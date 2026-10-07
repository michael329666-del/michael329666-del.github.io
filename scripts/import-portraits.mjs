import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const sharp = createRequire(import.meta.resolve('astro'))('sharp');
const project = fileURLToPath(new URL('../', import.meta.url));
if (!process.argv[2]) throw new Error('Provide the absolute path to the portrait source folder.');
const source = path.resolve(process.argv[2]);
const excluded = '小红书';
const folders = (await fs.readdir(source, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && entry.name !== excluded)
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
const previewDir = path.join(project, 'previews/portraits');
await fs.mkdir(previewDir, { recursive: true });
const auditPath = path.join(previewDir, 'source-audit.json');
const previous = await fs.readFile(auditPath, 'utf8').then(JSON.parse).catch((error) => {
  if (error.code === 'ENOENT') return null;
  throw error;
});
if (previous && JSON.stringify(previous.folders) !== JSON.stringify(folders)) {
  throw new Error('Source folders changed. Review the local model mapping before reimporting.');
}

async function imageFiles(directory, relative = '') {
  const entries = await fs.readdir(path.join(directory, relative), { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const filename = path.join(relative, entry.name);
    if (entry.isDirectory() && entry.name !== excluded) files.push(...await imageFiles(directory, filename));
    else if (entry.isFile() && /\.(jpe?g|png|webp)$/i.test(entry.name)) files.push(filename);
  }
  return files.sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
}

const albums = [];
const photos = [];
const audit = [];
for (const [folderIndex, folder] of folders.entries()) {
  const model = folderIndex + 1;
  const slug = `model-${model}`;
  const name = `模特${model}`;
  const directory = path.join(source, folder);
  const filenames = await imageFiles(directory);
  if (!filenames.length) throw new Error(`Empty album: ${slug}`);
  const output = path.join(project, 'public/photos/portraits', slug);
  await fs.mkdir(output, { recursive: true });
  const cells = [];
  let webBytes = 0;
  for (const [index, filename] of filenames.entries()) {
    const input = await fs.readFile(path.join(directory, filename));
    const number = String(index + 1).padStart(2, '0');
    const fullPath = path.join(output, `${number}.webp`);
    const thumbPath = path.join(output, `${number}-thumb.webp`);
    const full = await sharp(input).autoOrient()
      .resize({ width: 1600, height: 2200, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 }).toFile(fullPath);
    const thumb = await sharp(input).autoOrient()
      .resize({ width: 900, height: 1200, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 78, effort: 5 }).toFile(thumbPath);
    webBytes += full.size + thumb.size;
    photos.push({
      id: `${slug}-${number}`,
      portraitAlbum: slug,
      title: `${name} · ${number}`,
      alt: `${name} / Model ${model} — portrait ${number}.`,
      src: `/photos/portraits/${slug}/${number}.webp`,
      thumb: `/photos/portraits/${slug}/${number}-thumb.webp`,
      width: full.width,
      height: full.height,
      destination: '',
      categories: ['portrait'],
    });
    // Source names and hashes stay in local, uncommitted audit records only.
    audit.push({ model: slug, folder, filename, bytes: input.length,
      sha256: createHash('sha256').update(input).digest('hex') });
    const left = (index % 4) * 280 + 10;
    const top = Math.floor(index / 4) * 290 + 10;
    cells.push({ input: await sharp(input).autoOrient()
      .resize(260, 250, { fit: 'contain', background: '#f1ede5' })
      .jpeg({ quality: 85 }).toBuffer(), left, top });
    cells.push({ input: Buffer.from(`<svg width="260" height="25"><text x="5" y="18" font-family="Arial" font-size="15">Model ${model} / ${number}</text></svg>`), left, top: top + 252 });
  }
  albums.push({ slug, name, english: `Model ${model}`,
    note: `Portraits — Model ${model} / ${name}.`, accent: 'spring',
    coverId: previous?.covers?.[slug] ?? `${slug}-01` });
  await sharp({ create: { width: 1120, height: Math.ceil(filenames.length / 4) * 290, channels: 3, background: '#f1ede5' } })
    .composite(cells).jpeg({ quality: 90 }).toFile(path.join(previewDir, `${slug}-contact-sheet.jpg`));
  console.log(JSON.stringify({ model: slug, count: filenames.length, webMB: +(webBytes / 1024 ** 2).toFixed(2) }));
}

await fs.writeFile(path.join(project, 'src/data/portrait-selection.json'), JSON.stringify({ albums, photos }, null, 2) + '\n');
await fs.writeFile(auditPath, JSON.stringify({ folders, covers: previous?.covers ?? {}, files: audit }, null, 2) + '\n');
console.log(JSON.stringify({ albums: albums.length, photos: photos.length }));
