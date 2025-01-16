# [SEObot](https://seobotai.com/?utm_source=github) Blog API Client library

## Overview

Elevate your website by integrating SEObot's Blog API. This setup allows you to fetch and render real-time, SEO-optimized blog content directly into your website.

## Demo

Visit the [DevHunt Blog](https://devhunt.org/blog?utm_source=github) to check out an example of SEObot Blog API integration.

Checkout Next.js integration example at [seobot-nextjs-blog](https://github.com/MarsX-dev/seobot-nextjs-blog) repository.

## Prerequisites

**SEObot API Key** - you can find the API key in settings on [app.seobotai.com](https://app.seobotai.com/?utm_source=github)

## Features

- Fetch articles by page and limit.
- Retrieve articles based on categories or tags.
- Access detailed information about a specific article.
- Built-in caching mechanism for efficient data retrieval.

## Installation

To install the [seobot npm package](https://www.npmjs.com/package/seobot), run:

```bash
npm install seobot
```

## Usage

```typescript
import { BlogClient } from 'seobot';

const client = new BlogClient('your_seobot_api_key_here');
```

### Fetching Articles

```typescript
// Note: page parameter is zero-based (0 = first page, 1 = second page, etc.)
const articles = await client.getArticles(page, limit);
```

### Fetching Articles by Category

```typescript
// Note: page parameter is zero-based (0 = first page, 1 = second page, etc.)
 const articles = await client.getCategoryArticles(categorySlug, page, limit);
```

### Fetching Articles by Tag

```typescript
// Note: page parameter is zero-based (0 = first page, 1 = second page, etc.)
const articles = await client.getTagArticles(tagSlug, page, limit);
```

### Getting a Single Article

```typescript
const article = await client.getArticle(slug);
```

## Data Types

```typescript
interface IArticle {
  id: string;
  slug: string;
  headline: string;
  metaDescription: string;
  metaKeywords: string;
  tags: ITag[];
  category: ICategory;
  readingTime: number;
  html: string;
  markdown: string;
  outline: string;
  deleted: boolean;
  published: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  relatedPosts: IRelatedPost[];
  image: string;
}

interface ITag {
  id: string;
  title: string;
  slug: string;
}

interface ICategory {
  id: string;
  title: string;
  slug: string;
}

interface IRelatedPost {
  id: string;
  headline: string;
  slug: string;
}
```

## Contributing

Contributions are welcome. Please open an issue or submit a pull request for any bugs, features, or improvements.

## License

This project is licensed under the MIT License.

## Contact

For additional assistance or information, feel free to reach out.

---

Revolutionize your website's content strategy with real-time, automated, SEO-optimized blog posts. Get started with [SEObot](https://seobotai.com/?utm_source=github) AI Blog Autopilot integration today!