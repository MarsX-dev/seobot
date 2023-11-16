import { Cache } from './cache';
import { Blog } from '../types';

export class BlogClient {
  private _key: string;
  private _fetchBaseCache: Cache<Blog.IArticleIndex[]> = new Cache<Blog.IArticleIndex[]>(60000);
  private _fetchPostCache: Cache<Blog.IArticle> = new Cache<Blog.IArticle>(60000);

  constructor(key: string) {
    this._key = key;
  }

  private async _fetchBase(): Promise<Blog.IArticleIndex[]> {
    const base = await this._fetchBaseCache.get(async () => {
      const response = await fetch(`https://seobot-blogs.s3.eu-north-1.amazonaws.com/${this._key}/system/base.json`, { cache: 'no-store' });

      const base = (await response.json()) as Blog.IArticleIndex[];
      return base;
    });

    return base;
  }

  private async _fetchPost(id: string): Promise<Blog.IArticle> {
    const post = await this._fetchPostCache.get(async () => {
      const postData = await fetch(`https://seobot-blogs.s3.eu-north-1.amazonaws.com/${this._key}/blog/${id}.json`, { cache: 'no-store' });
      const post = (await postData.json()) as Blog.IArticle;
      return post;
    });

    return post;
  }

  public async getArticles(page: number, limit: number = 10): Promise<{ articles: Blog.IArticle[]; total: number }> {
    try {
      const base = await this._fetchBase();
      const start = page * limit;
      const end = start + limit;
      const articles = await Promise.all(
        base.slice(start, end).map(async item => {
          return item.id ? this._fetchPost(item.id) : null;
        })
      );

      return {
        articles: articles.filter(item => item?.published) as Blog.IArticle[],
        total: base.length,
      };
    } catch {
      return { total: 0, articles: [] };
    }
  }

  public async getCategoryArticles(slug: string, page: number, limit: number = 10): Promise<{ articles: Blog.IArticle[]; total: number }> {
    try {
      const base = await this._fetchBase();
      const categoryIds = base.filter(item => item?.category?.slug == slug);
      const start = page * limit;
      const end = start + limit;
      const articles = await Promise.all(
        categoryIds.slice(start, end).map(async item => {
          return item?.id ? this._fetchPost(item?.id) : null;
        })
      );

      return {
        articles: articles.filter(item => item?.published) as Blog.IArticle[],
        total: categoryIds.length,
      };
    } catch {
      return { total: 0, articles: [] };
    }
  }

  public async getTagArticles(slug: string, page: number, limit: number = 10): Promise<{ articles: Blog.IArticle[]; total: number }> {
    try {
      const base = await this._fetchBase();
      const tags = base.filter(obj => {
        const itemTags = obj?.tags;
        return itemTags?.some(item => item?.slug === slug);
      });

      const start = page * limit;
      const end = start + limit;
      const articles = await Promise.all(
        tags.slice(start, end).map(async item => {
          return item?.id ? this._fetchPost(item?.id) : null;
        })
      );

      return {
        articles: articles.filter(item => item?.published) as Blog.IArticle[],
        total: tags.length,
      };
    } catch {
      return { total: 0, articles: [] };
    }
  }

  public async getArticle(slug: string): Promise<Blog.IArticle | null> {
    try {
      const base = await this._fetchBase();
      const record = base.find(item => item.slug === slug);
      if (!record) return null;
      const post = await this._fetchPost(record.id);
      return post;
    } catch {
      return null;
    }
  }
}
