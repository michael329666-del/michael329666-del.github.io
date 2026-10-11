import selection from './destination-selection.json';
import portraits from './portrait-selection.json';
import portraitCovers from './portrait-covers.json';

export type GalleryPhoto = {
  id: string;
  src: string;
  thumb: string;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
};

export type Photo = GalleryPhoto & {
  destination: string;
  categories: string[];
  featured?: boolean;
  portraitAlbum?: string;
};

export type Collection = {
  slug: string;
  name: string;
  english: string;
  note: string;
  accent: string;
  coverId?: string;
  cover?: GalleryPhoto;
};

// The source photo folders stay untouched. Only chosen website images go here.
export const photos: Photo[] = [...selection, ...portraits.photos];
export const portraitAlbums: Collection[] = portraits.albums.map((album) => ({
  ...album,
  cover: portraitCovers.find((cover) => cover.id === `${album.slug}-cover`),
}));
export type CollectionKind = 'destinations' | 'categories' | 'portraits';

export function collectionPath(kind: CollectionKind, slug: string) {
  return kind === 'portraits' ? `/categories/portrait/${slug}/` : `/${kind}/${slug}/`;
}

export const destinations: Collection[] = [
  { slug: 'boston', name: '波士顿，马萨诸塞', english: 'Boston, MA', note: 'Photographs from Boston, Massachusetts.', accent: 'stone', coverId: 'boston-dsc00926' },
  { slug: 'colyer-lake', name: '科利尔湖，宾夕法尼亚', english: 'Colyer Lake, PA', note: 'Autumn photographs from Colyer Lake, Pennsylvania.', accent: 'spring', coverId: 'colyer-lake-p1011889' },
  { slug: 'washington-dc', name: '华盛顿，哥伦比亚特区', english: 'Washington, DC', note: 'Photographs from Washington, D.C.', accent: 'city', coverId: 'washington-dc-dsc04793' },
  { slug: 'harrisburg', name: '哈里斯堡，宾夕法尼亚', english: 'Harrisburg, PA', note: 'Photographs from Harrisburg, Pennsylvania.', accent: 'spring', coverId: 'harrisburg-dsc08266' },
  { slug: 'hong-kong', name: '香港，中国', english: 'Hong Kong, China', note: 'Photographs from Hong Kong.', accent: 'city', coverId: 'hong-kong-dsc01378' },
  { slug: 'miami', name: '迈阿密，佛罗里达', english: 'Miami, FL', note: 'Photographs from Miami, Florida.', accent: 'coast', coverId: 'miami-dsc06261' },
  { slug: 'orlando', name: '奥兰多，佛罗里达', english: 'Orlando, FL', note: 'Photographs from Orlando, Florida.', accent: 'coast', coverId: 'orlando-dsc07975' },
  { slug: 'penns-cave', name: '潘斯洞穴与野生动物园，宾夕法尼亚', english: 'Penn’s Cave & Wildlife, PA', note: 'Photographs from Penn’s Cave & Wildlife, Pennsylvania.', accent: 'spring', coverId: 'penns-cave-p1011169' },
  { slug: 'sedona', name: '塞多纳，亚利桑那', english: 'Sedona, AZ', note: 'Photographs from Sedona, Arizona.', accent: 'desert', coverId: 'sedona-dsc09854' },
  { slug: 'st-paul', name: '圣保罗，明尼苏达', english: 'St. Paul, MN', note: 'Photographs from St. Paul, Minnesota.', accent: 'stone', coverId: 'st-paul-dsc09255' },
];

export const categories: Collection[] = [
  { slug: 'landscape', name: '风景与自然', english: 'Landscape & Nature', note: 'Landscape and nature photographs by Michael Wang.', accent: 'desert', coverId: 'sedona-dsc09854' },
  { slug: 'life', name: '街头与生活', english: 'Street & Life', note: 'Street and everyday photographs by Michael Wang.', accent: 'city', coverId: 'hong-kong-dsc01434' },
  {
    slug: 'portrait', name: '人像', english: 'Portraits',
    note: 'Portrait photographs by Michael Wang.', accent: 'spring',
    cover: {
      id: 'portrait-category-cover',
      src: '/photos/portraits/covers/portrait-category.webp',
      thumb: '/photos/portraits/covers/portrait-category.webp',
      alt: 'Portrait collage featuring Model 3, Model 5, and Model 6.',
      width: 1600, height: 1080,
    },
  },
];

export const pageSize = 12;

export function photosFor(kind: CollectionKind, slug: string) {
  return photos.filter((photo) =>
    kind === 'destinations' ? photo.destination === slug
      : kind === 'portraits' ? photo.portraitAlbum === slug
      : photo.categories.includes(slug),
  );
}
