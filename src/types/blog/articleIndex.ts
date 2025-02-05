export interface IArticleIndexCompressed {
  id: string;             // id
  h: string;              // headline
  d: string;              // description
  s: string;              // slug
  i: string;              // image
  rt: number;             // readingTime
  cr: string;             // createdAt
  up: string;             // updatedAt
  c?: { t: string; s: string; };     // category
  tg?: { t: string; s: string; }[];  // tags
}

export interface IArticleIndex {
  id: string;
  slug: string;
  headline: string;
  metaDescription: string;
  image: string;
  readingTime: number,
  createdAt: string;
  updatedAt: string;
  category: { title: string; slug: string; } | null;
  tags: { title: string; slug: string; }[];
}