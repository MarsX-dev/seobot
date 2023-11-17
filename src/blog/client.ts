import { Cache } from './cache';
import { Blog } from '../types';
import slugify from 'slugify';

export class BlogClient {
  private _key: string;
  private _baseCache: Cache<Blog.IArticleIndex[]>;
  private _articleCache: Cache<Blog.IArticle>;

  constructor(key: string, ttl: number = 180_000) {
    if (!key) throw Error('SEObot API key must be provided. You can use the DEMO key a8c58738-7b98-4597-b20a-0bb1c2fe5772 for testing');
    this._key = key;
    this._baseCache = new Cache<Blog.IArticleIndex[]>(ttl);
    this._articleCache = new Cache<Blog.IArticle>(ttl);
  }

  private _decompressIndex(short: Blog.IArticleIndexCompressed): Blog.IArticleIndex {
    return {
      id: short.id,
      slug: short.s,
      headline: short.h,
      metaDescription: short.d,
      image: short.i,
      createdAt: short.cr,
      category: short.c
        ? {
            title: short.c.t,
            slug: slugify(short.c.t, { lower: true, strict: true }),
          }
        : null,
      tags: (short.tg || []).map(i => ({
        title: i.t,
        slug: slugify(i.t, { lower: true, strict: true }),
      })),
    };
  }

  private async _fetchIndex(): Promise<Blog.IArticleIndex[]> {
    const base = await this._baseCache.get(async () => {
      const response = await fetch(`https://cdn.seobotai.com/${this._key}/system/base.json`, { cache: 'no-store' });
      const index = (await response.json()) as Blog.IArticleIndexCompressed[];
      return index.map(i => this._decompressIndex(i)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    });

    return base;
  }

  private async _fetchArticle(id: string): Promise<Blog.IArticle> {
    const post = await this._articleCache.get(async () => {
      const postData = await fetch(`https://cdn.seobotai.com/${this._key}/blog/${id}.json`, { cache: 'no-store' });
      const post = (await postData.json()) as Blog.IArticle;
      return post;
    });

    return post;
  }

  public async getArticles(page: number, limit: number = 10): Promise<{ articles: Blog.IArticleIndex[]; total: number }> {
    try {
      const base = await this._fetchIndex();
      const start = page * limit;
      const end = start + limit;
      return {
        articles: base.slice(start, end),
        total: base.length,
      };
    } catch {
      return { total: 0, articles: [] };
    }
  }

  public async getCategoryArticles(slug: string, page: number, limit: number = 10): Promise<{ articles: Blog.IArticleIndex[]; total: number }> {
    try {
      const base = await this._fetchIndex();
      const categoryIds = base.filter(i => i.category?.slug == slug).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      const start = page * limit;
      const end = start + limit;

      return {
        articles: categoryIds.slice(start, end),
        total: categoryIds.length,
      };
    } catch {
      return { total: 0, articles: [] };
    }
  }

  public async getTagArticles(slug: string, page: number, limit: number = 10): Promise<{ articles: Blog.IArticleIndex[]; total: number }> {
    try {
      const base = await this._fetchIndex();
      const tags = base.filter(i => i.tags.some(item => item?.slug === slug)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      const start = page * limit;
      const end = start + limit;

      return {
        articles: tags.slice(start, end),
        total: tags.length,
      };
    } catch {
      return { total: 0, articles: [] };
    }
  }

  public async getArticle(slug: string): Promise<Blog.IArticle | null> {
    try {
      const base = await this._fetchIndex();
      const record = base.find(item => item.slug === slug);
      if (!record) return null;
      const post = await this._fetchArticle(record.id);
      return post;
    } catch {
      return null;
    }
  }
}
