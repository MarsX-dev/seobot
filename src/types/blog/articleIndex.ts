import { ICategory } from "./category";
import { ITag } from "./tag";

export interface IArticleIndex {
  id: string;
  slug: string;
  category: ICategory;
  tags: ITag[];
}