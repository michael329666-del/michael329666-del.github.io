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
};

export type Collection = {
  slug: string;
  name: string;
  english: string;
  note: string;
  accent: string;
};

// The source photo folders stay untouched. Only chosen website images go here.
export const photos: Photo[] = [];

export const destinations: Collection[] = [
  { slug: 'hong-kong', name: '香港，中国', english: 'Hong Kong, China', note: 'Photographs from Hong Kong.', accent: 'city' },
  { slug: 'miami', name: '迈阿密，佛罗里达', english: 'Miami, FL', note: 'Photographs from Miami, Florida.', accent: 'coast' },
  { slug: 'sedona', name: '塞多纳，亚利桑那', english: 'Sedona, AZ', note: 'Photographs from Sedona, Arizona.', accent: 'desert' },
  { slug: 'boston', name: '波士顿，马萨诸塞', english: 'Boston, MA', note: 'Photographs from Boston, Massachusetts.', accent: 'stone' },
  { slug: 'washington-dc', name: '华盛顿，哥伦比亚特区', english: 'Washington, DC', note: 'Photographs from Washington, D.C.', accent: 'city' },
  { slug: 'harrisburg', name: '哈里斯堡，宾夕法尼亚', english: 'Harrisburg, PA', note: 'Photographs from Harrisburg, Pennsylvania.', accent: 'spring' },
  { slug: 'orlando', name: '奥兰多，佛罗里达', english: 'Orlando, FL', note: 'Photographs from Orlando, Florida.', accent: 'coast' },
  { slug: 'penns-cave', name: '潘斯洞穴，宾夕法尼亚', english: 'Penn’s Cave, PA', note: 'Photographs from Penn’s Cave, Pennsylvania.', accent: 'spring' },
  { slug: 'shenzhen', name: '深圳，广东', english: 'Shenzhen, Guangdong', note: 'Photographs from Shenzhen, Guangdong.', accent: 'city' },
  { slug: 'st-paul', name: '圣保罗，明尼苏达', english: 'St. Paul, MN', note: 'Photographs from St. Paul, Minnesota.', accent: 'stone' },
];

export const categories: Collection[] = [
  { slug: 'landscape', name: '风景与自然', english: 'Landscape & Nature', note: 'Landscape and nature photographs by Michael Wang.', accent: 'desert' },
  { slug: 'life', name: '街头与生活', english: 'Street & Life', note: 'Street and everyday photographs by Michael Wang.', accent: 'city' },
  { slug: 'portrait', name: '人像', english: 'Portraits', note: 'Portrait photographs by Michael Wang.', accent: 'spring' },
];

export const pageSize = 12;

export function photosFor(kind: 'destinations' | 'categories', slug: string) {
  return photos.filter((photo) =>
    kind === 'destinations' ? photo.destination === slug : photo.categories.includes(slug),
  );
}
