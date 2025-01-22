import axios from 'axios';
import slugify from 'slugify';
import { transliterate } from 'transliteration';

import { Blog } from '../types';

export class BlogClient {
  private _key: string;
  private _axios;

  constructor(key: string) {
    if (!key) throw Error('SEObot API key must be provided. You can use the DEMO key a8c58738-7b98-4597-b20a-0bb1c2fe5772 for testing');
    this._key = key;
    this._axios = axios.create({
      baseURL: 'https://cdn.seobotai.com',
    });
  }

  private _decompressIndex(short: Blog.IArticleIndexCompressed): Blog.IArticleIndex {
    return {
      id: short.id,
      slug: short.s,
      headline: short.h,
      metaDescription: short.d,
      image: short.i,
      readingTime: short.rt,
      createdAt: short.cr,
      updatedAt: short.up,
      category: short.c
        ? {
            title: short.c.t,
            slug: short.c.s || slugify(transliterate(short.c.t), { lower: true, strict: true }),
          }
        : null,
      tags: (short.tg || []).map(i => ({
        title: i.t,
        slug: i.s || slugify(transliterate(i.t), { lower: true, strict: true }),
      })),
    };
  }

  private async _fetchIndex(): Promise<Blog.IArticleIndex[]> {
    const { data } = await this._axios.get<Blog.IArticleIndexCompressed[]>(`/${this._key}/system/base.json`);
    return data.map(i => this._decompressIndex(i)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  private async _fetchArticle(id: string): Promise<Blog.IArticle> {
    const { data } = await this._axios.get<Blog.IArticle>(`/${this._key}/blog/${id}.json`);
    return data;
  }

  public async getArticles(page: number, limit: number = 10): Promise<{ articles: Blog.IArticleIndex[]; total: number }> {
    const base = await this._fetchIndex();
    const start = page * limit;
    const end = start + limit;
    return {
      articles: base.slice(start, end),
      total: base.length,
    };
  }

  public async getCategoryArticles(slug: string, page: number, limit: number = 10): Promise<{ articles: Blog.IArticleIndex[]; total: number }> {
    const base = await this._fetchIndex();
    const categoryIds = base.filter(i => i.category?.slug == slug).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const start = page * limit;
    const end = start + limit;

    return {
      articles: categoryIds.slice(start, end),
      total: categoryIds.length,
    };
  }

  public async getTagArticles(slug: string, page: number, limit: number = 10): Promise<{ articles: Blog.IArticleIndex[]; total: number }> {
    const base = await this._fetchIndex();
    const tags = base.filter(i => i.tags.some(item => item?.slug === slug)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const start = page * limit;
    const end = start + limit;

    return {
      articles: tags.slice(start, end),
      total: tags.length,
    };
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
