export interface IArticleIndexCompressed {
  id: string;             // id
  h: string;              // headline
  d: string;              // description
  s: string;              // slug
  i: string;              // image
  cr: string;             // createdAt
  c?: { t: string; };     // category
  tg?: { t: string; }[];  // tags
}

export interface IArticleIndex {
  id: string;
  slug: string;
  headline: string;
  metaDescription: string;
  image: string;
  createdAt: string;
  category: { title: string; slug: string; } | null;
  tags: { title: string; slug: string; }[];
}