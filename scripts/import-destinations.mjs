import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const sharp = createRequire(import.meta.resolve('astro'))('sharp');
const project = fileURLToPath(new URL('../', import.meta.url));
const source = path.resolve(process.argv[2] ?? 'C:/Users/王牧川1/Desktop/PHOTOS/jpg photos/精选');
const albums = [
  ['Boston', 'boston', 'Boston, MA'],
  ['Colyer Lake', 'colyer-lake', 'Colyer Lake, PA'],
  ['DC', 'washington-dc', 'Washington, DC'],
  ['Harrisburg', 'harrisburg', 'Harrisburg, PA'],
  ['HongKong', 'hong-kong', 'Hong Kong, China'],
  ['Miami', 'miami', 'Miami, FL'],
  ['Orlando', 'orlando', 'Orlando, FL'],
  ["Penn's Cave& Wildlife", 'penns-cave', 'Penn’s Cave & Wildlife, PA'],
  ['Sedona', 'sedona', 'Sedona, AZ'],
  ['St.Paul', 'st-paul', 'St. Paul, MN'],
];

async function imageFiles(directory, relative = '') {
  const entries = await fs.readdir(path.join(directory, relative), { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const filename = path.join(relative, entry.name);
    if (entry.isDirectory()) files.push(...await imageFiles(directory, filename));
    else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) files.push(filename);
  }
  return files.sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
}

const records = [];
const audit = [];
const summary = [];
for (const [folder, slug, location] of albums) {
  const directory = path.join(source, folder);
  const filenames = await imageFiles(directory);
  if (!filenames.length) throw new Error(`Empty destination folder: ${folder}`);
  const output = path.join(project, 'public/photos/destinations', slug);
  await fs.mkdir(output, { recursive: true });
  const usedIds = new Set();
  const cells = [];
  let originalBytes = 0;
  let webBytes = 0;

  for (const [index, filename] of filenames.entries()) {
    const input = path.join(directory, filename);
    const original = await fs.readFile(input);
    const sha256 = createHash('sha256').update(original).digest('hex');
    const stem = path.parse(filename).name;
    const assetId = filename.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (!assetId || usedIds.has(assetId)) throw new Error(`Duplicate asset name: ${folder}/${filename}`);
    usedIds.add(assetId);
    const fullPath = path.join(output, `${assetId}.webp`);
    const thumbPath = path.join(output, `${assetId}-thumb.webp`);
    const full = await sharp(original).autoOrient()
      .resize({ width: 1600, height: 2200, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 }).toFile(fullPath);
    await sharp(original).autoOrient()
      .resize({ width: 900, height: 1200, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 78, effort: 5 }).toFile(thumbPath);
    originalBytes += original.length;
    webBytes += (await fs.stat(fullPath)).size + (await fs.stat(thumbPath)).size;
    records.push({
      id: `${slug}-${assetId}`,
      sourceFolder: folder,
      sourceFilename: filename.replaceAll('\\', '/'),
      title: stem,
      alt: `${location} — photograph ${stem} by Michael Wang.`,
      src: `/photos/destinations/${slug}/${assetId}.webp`,
      thumb: `/photos/destinations/${slug}/${assetId}-thumb.webp`,
      width: full.width,
      height: full.height,
      destination: slug,
      categories: [],
    });
    // Dense foliage in this panoramic featured photo needs more detail for large displays.
    if (slug === 'colyer-lake' && assetId === 'p1011883') {
      const variants = [];
      for (const width of [900, 1600, 3840]) {
        const name = `${assetId}-${width}-hq.webp`;
        const info = await sharp(original).autoOrient()
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: 94, effort: 6 }).toFile(path.join(output, name));
        variants.push({ src: `/photos/destinations/${slug}/${name}`, ...info });
        webBytes += info.size;
      }
      const highResolution = variants.at(-1);
      Object.assign(records.at(-1), {
        src: highResolution.src,
        thumb: variants[0].src,
        width: highResolution.width,
        height: highResolution.height,
        srcSet: variants.map((variant) => `${variant.src} ${variant.width}w`).join(', '),
      });
    }
    audit.push({ folder, filename, bytes: original.length, sha256 });

    const left = (index % 6) * 250 + 10;
    const top = Math.floor(index / 6) * 200 + 10;
    const preview = await sharp(original).autoOrient()
      .resize(230, 165, { fit: 'contain', background: '#f1ede5' })
      .jpeg({ quality: 85 }).toBuffer();
    const safeLabel = `${index + 1}. ${stem}`.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
    cells.push({ input: preview, left, top });
    cells.push({ input: Buffer.from(`<svg width="230" height="25"><text x="4" y="18" font-family="Arial" font-size="13" fill="#191715">${safeLabel}</text></svg>`), left, top: top + 168 });
  }

  await fs.mkdir(path.join(project, 'previews/destinations'), { recursive: true });
  await sharp({ create: { width: 1500, height: Math.ceil(filenames.length / 6) * 200, channels: 3, background: '#fbfaf7' } })
    .composite(cells).jpeg({ quality: 90 })
    .toFile(path.join(project, `previews/destinations/${slug}-contact-sheet.jpg`));
  const result = { folder, slug, count: filenames.length, originalMB: +(originalBytes / 1024 ** 2).toFixed(2), webMB: +(webBytes / 1024 ** 2).toFixed(2) };
  summary.push(result);
  console.log(JSON.stringify(result));
}

await fs.writeFile(path.join(project, 'src/data/destination-selection.json'), JSON.stringify(records, null, 2) + '\n');
await fs.writeFile(path.join(project, 'previews/destinations/source-audit.json'), JSON.stringify(audit, null, 2) + '\n');
console.log(JSON.stringify({ total: records.length, albums: summary.length, webMB: +summary.reduce((sum, album) => sum + album.webMB, 0).toFixed(2) }));
