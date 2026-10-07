import type { APIRoute } from 'astro';
import { categories, collectionPath, destinations, pageSize, photosFor, portraitAlbums } from '../data/portfolio';

export const GET: APIRoute = ({ site }) => {
  const paths = ['/', '/destinations/', '/categories/', '/about/'];
  for (const [kind, collections] of [
    ['destinations', destinations],
    ['categories', categories],
    ['portraits', portraitAlbums],
  ] as const) {
    for (const collection of collections) {
      const base = collectionPath(kind, collection.slug);
      paths.push(base);
      if (kind === 'categories' && collection.slug === 'portrait') continue;
      const totalPages = Math.ceil(photosFor(kind, collection.slug).length / pageSize);
      for (let page = 2; page <= totalPages; page++) paths.push(`${base}page/${page}/`);
    }
  }
  const entries = paths.map((path) => `<url><loc>${new URL(path, site).href}</loc></url>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
