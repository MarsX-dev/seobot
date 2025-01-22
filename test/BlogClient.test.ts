import { BlogClient } from '../src';

jest.setTimeout(15000); // Increase timeout for all tests in this file to 15 seconds
const DEMO_KEY = 'a8c58738-7b98-4597-b20a-0bb1c2fe5772';

describe('BlogClient', () => {
  let client: BlogClient;

  beforeEach(() => {
    client = new BlogClient(DEMO_KEY);
  });

  describe('constructor', () => {
    it('should throw error if no API key provided', () => {
      expect(() => new BlogClient('')).toThrow('SEObot API key must be provided');
    });

    it('should create instance with valid API key', () => {
      expect(new BlogClient(DEMO_KEY)).toBeInstanceOf(BlogClient);
    });
  });

  describe('getArticles', () => {
    it('should return paginated articles', async () => {
      const result = await client.getArticles(0, 5);

      expect(result).toHaveProperty('articles');
      expect(result).toHaveProperty('total');
      expect(Array.isArray(result.articles)).toBeTruthy();
      expect(result.articles.length).toBeLessThanOrEqual(5);

      // Check article structure
      const article = result.articles[0];
      expect(article).toHaveProperty('id');
      expect(article).toHaveProperty('slug');
      expect(article).toHaveProperty('headline');
      expect(article).toHaveProperty('metaDescription');
    });

    it('should handle pagination correctly', async () => {
      const page1 = await client.getArticles(0, 2);
      const page2 = await client.getArticles(1, 2);

      expect(page1.articles).not.toEqual(page2.articles);
      expect(page1.total).toBe(page2.total);
    });
  });

  describe('getCategoryArticles', () => {
    it('should return articles for a specific category', async () => {
      // First get any article to find a valid category
      const { articles } = await client.getArticles(0, 1);
      const categorySlug = articles[0]?.category?.slug;

      if (categorySlug) {
        const result = await client.getCategoryArticles(categorySlug, 0, 5);

        expect(result).toHaveProperty('articles');
        expect(result).toHaveProperty('total');
        expect(Array.isArray(result.articles)).toBeTruthy();
        expect(result.articles[0].category?.slug).toBe(categorySlug);
      }
    });
  });

  describe('getTagArticles', () => {
    it('should return articles for a specific tag', async () => {
      // First get any article to find a valid tag
      const { articles } = await client.getArticles(0, 1);
      const tagSlug = articles[0]?.tags[0]?.slug;

      if (tagSlug) {
        const result = await client.getTagArticles(tagSlug, 0, 5);

        expect(result).toHaveProperty('articles');
        expect(result).toHaveProperty('total');
        expect(Array.isArray(result.articles)).toBeTruthy();
        expect(result.articles[0].tags.some(tag => tag.slug === tagSlug)).toBeTruthy();
      }
    });
  });

  describe('getArticle', () => {
    it('should return full article by slug', async () => {
      // First get any article to find a valid slug
      const { articles } = await client.getArticles(0, 1);
      const slug = articles[0]?.slug;

      if (slug) {
        const article = await client.getArticle(slug);

        expect(article).not.toBeNull();
        expect(article).toHaveProperty('id');
        expect(article).toHaveProperty('slug', slug);
        expect(article).toHaveProperty('headline');
        expect(article).toHaveProperty('html');
      }
    });

    it('should return null for non-existent article', async () => {
      const article = await client.getArticle('non-existent-slug');
      expect(article).toBeNull();
    });
  });
});
