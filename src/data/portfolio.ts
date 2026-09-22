export type Photo = {
  id: string;
  src: string;
  thumb: string;
  alt: string;
  title?: string;
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
  { slug: 'hong-kong', name: '香港', english: 'Hong Kong', note: '街道、海港与两次抵达。', accent: 'city' },
  { slug: 'miami', name: '迈阿密', english: 'Miami', note: '阳光、海岸与旅途中的人。', accent: 'coast' },
  { slug: 'sedona', name: '塞多纳', english: 'Sedona', note: '红岩、公路与日落。', accent: 'desert' },
  { slug: 'boston', name: '波士顿', english: 'Boston', note: '水边、建筑与城市漫游。', accent: 'stone' },
  { slug: 'washington-dc', name: '华盛顿', english: 'Washington, D.C.', note: '街头、博物馆与城市片段。', accent: 'city' },
  { slug: 'harrisburg', name: '哈里斯堡', english: 'Harrisburg', note: '春天、街道与河边的人。', accent: 'spring' },
  { slug: 'orlando', name: '奥兰多', english: 'Orlando', note: '游乐园的一天。', accent: 'coast' },
  { slug: 'penns-cave', name: 'Penn’s Cave', english: 'Penn’s Cave', note: '草地、洞穴与动物。', accent: 'spring' },
  { slug: 'shenzhen', name: '深圳', english: 'Shenzhen', note: '城市天际线与花间人像。', accent: 'city' },
  { slug: 'st-paul', name: '圣保罗', english: 'St. Paul', note: '艺术展与城市散步。', accent: 'stone' },
];

export const categories: Collection[] = [
  { slug: 'landscape', name: '风景与自然', english: 'Landscape & Nature', note: '山、海、天空，以及路途上的自然。', accent: 'desert' },
  { slug: 'life', name: '街头与生活', english: 'Street & Life', note: '城市中的片刻，与身边的人。', accent: 'city' },
  { slug: 'portrait', name: '人像', english: 'Portraits', note: '人物、表情和他们所处的空间。', accent: 'spring' },
];

export const pageSize = 12;

export function photosFor(kind: 'destinations' | 'categories', slug: string) {
  return photos.filter((photo) =>
    kind === 'destinations' ? photo.destination === slug : photo.categories.includes(slug),
  );
}
