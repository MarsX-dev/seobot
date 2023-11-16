import { ICategory } from "./category";
import { IRelatedPost } from "./relatedPost";
import { ITag } from "./tag";

export interface IArticle {
  id: string;
  slug: string;
  headline: string;
  metaDescription: string;
  metaKeywords: string;
  tags: ITag[];
  category: ICategory;
  readingTime: number;
  html: string;
  outline: string;
  deleted: boolean;
  published: boolean;
  publishedAt: string;
  createdAt: string;
  relatedPosts: IRelatedPost[];
  image: string;
}