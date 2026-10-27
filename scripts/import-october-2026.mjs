import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

// Incremental import: keep the existing selections and their curated category tags.
const sharp = createRequire(import.meta.resolve('astro'))('sharp');
const project = fileURLToPath(new URL('../', import.meta.url));
const source = path.resolve(process.argv[2] ?? 'C:/Users/王牧川1/Desktop/PHOTOS/jpg photos/精选');
const albums = [
  ['Bellefonte', 'bellefonte', 'Bellefonte, PA'],
  ['Black Moshanno State Park', 'black-moshannon-state-park', 'Black Moshannon State Park, PA'],
  ['Harrisburg', 'harrisburg', 'Harrisburg, PA'],
  ['Little Buffalo State Park', 'little-buffalo-state-park', 'Little Buffalo State Park, PA'],
];
const nature = new Set(['P1012321','P1012355','P1012361','P1011974','P1012013','P1012045','P1012092','P1012099','P1012115','P1012182','P1012304','P1012548','P1012585','P1012658','P1012664']);
const life = new Set(['P1012307','P1012311','P1012318','P1012335','P1012339','P1012349','P1012369','P1012376','P1012406','P1012409','P1012425','P1012234','P1012480','P1012547','P1012569','P1012579']);
const featured = [
  ['P1012355.jpg', 'Autumn afternoon', 'A person sits beneath autumn trees beside the water in Bellefonte.'],
  ['P1012369.jpg', 'Under the willows', 'People gather under sunlit willow trees beside the water in Bellefonte.'],
  ['P1012480.jpg', 'By the river', 'A person stands beside a swing overlooking the river beneath autumn trees in Harrisburg.'],
  ['P1012548.jpg', 'Autumn canopy', 'An orange autumn tree frames a bench overlooking the river in Harrisburg.'],
  ['P1012579.jpg', 'Among the trees', 'A person walks through an autumn woodland beside a pavilion at Little Buffalo State Park.'],
];

async function makeVariants(input, folder, stem) {
  const output = path.join(project, 'public/photos', folder);
  await fs.mkdir(output, { recursive: true });
  const variants = [];
  for (const width of [900, 1600, 3840]) {
    const filename = `${stem}-${width}-hq.webp`;
    const info = await sharp(input).autoOrient().resize({ width, height: width === 3840 ? 3840 : width === 1600 ? 2200 : 1200, fit: 'inside', withoutEnlargement: true }).webp({ quality: 94, effort: 6 }).toFile(path.join(output, filename));
    variants.push({ src: `/photos/${folder}/${filename}`, width: info.width, height: info.height });
  }
  const largest = variants.at(-1);
  return { src: largest.src, thumb: variants[0].src, width: largest.width, height: largest.height, srcSet: variants.map(v => `${v.src} ${v.width}w`).join(', ') };
}

const destinationPath = path.join(project, 'src/data/destination-selection.json');
const homePath = path.join(project, 'src/data/home-selection.json');
const destinations = JSON.parse(await fs.readFile(destinationPath, 'utf8'));
const home = JSON.parse(await fs.readFile(homePath, 'utf8'));
for (const [folder, slug, location] of albums) {
  const directory = path.join(source, folder);
  const files = (await fs.readdir(directory)).filter(f => /\.(jpe?g|png|webp)$/i.test(f)).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
  for (const filename of files) {
    if (destinations.some(p => p.sourceFolder === folder && p.sourceFilename.toLowerCase() === filename.toLowerCase())) continue;
    const title = path.parse(filename).name;
    const asset = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const variants = await makeVariants(path.join(directory, filename), `destinations/${slug}`, asset);
    destinations.push({ id: `${slug}-${asset}`, sourceFolder: folder, sourceFilename: filename, title, alt: `${location} — photograph ${title} by Michael Wang.`, ...variants, destination: slug, categories: [ ...(nature.has(title) ? ['landscape'] : []), ...(life.has(title) ? ['life'] : []) ] });
    console.log(`${folder}: ${filename}`);
  }
}
for (const [filename, title, alt] of featured) {
  if (home.some(p => p.sourceFilename.toLowerCase() === filename.toLowerCase())) continue;
  const asset = path.parse(filename).name.toLowerCase();
  const variants = await makeVariants(path.join(source, '首页之精选中的精选', filename), 'home', asset);
  home.push({ id: asset, sourceFilename: filename, title, alt, ...variants });
  console.log(`Home: ${filename}`);
}
await fs.writeFile(destinationPath, JSON.stringify(destinations, null, 2) + '\n');
await fs.writeFile(homePath, JSON.stringify(home, null, 2) + '\n');
