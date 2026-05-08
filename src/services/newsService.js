import axios from 'axios';
import { cache } from '../utils/helpers';

const GNEWS_BASE = 'https://gnews.io/api/v4/search';
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

/**
 * Fetch news articles for a given category/query
 * Uses GNews API with caching
 */
export async function fetchNews(category = 'technology', forceRefresh = false) {
  const cacheKey = `news_${category}`;

  // Check cache first
  if (!forceRefresh) {
    const cached = cache.get(cacheKey);
    if (cached) {
      return { articles: cached, fromCache: true };
    }
  }

  const apiKey = import.meta.env.VITE_NEWS_API_KEY;
  if (!apiKey) {
    throw new Error('News API key not configured. Please set VITE_NEWS_API_KEY in your .env file.');
  }

  const queryMap = {
    technology: 'technology innovation AI',
    space: 'space science NASA astronomy',
  };

  const query = queryMap[category] || category;

  const response = await axios.get(GNEWS_BASE, {
    params: {
      q: query,
      lang: 'en',
      max: 5,
      sortby: 'publishedAt',
      token: apiKey,
    },
  });

  const articles = response.data.articles.map((article) => ({
    title: article.title,
    description: article.description,
    content: article.content,
    url: article.url,
    image: article.image,
    publishedAt: article.publishedAt,
    source: article.source?.name || 'Unknown',
    author: article.source?.name || 'Unknown Author',
  }));

  // Cache the results
  cache.set(cacheKey, articles, CACHE_TTL);

  return { articles, fromCache: false };
}

/**
 * Search news across categories
 */
export async function searchNews(query) {
  const apiKey = import.meta.env.VITE_NEWS_API_KEY;
  if (!apiKey) {
    throw new Error('News API key not configured.');
  }

  const response = await axios.get(GNEWS_BASE, {
    params: {
      q: query,
      lang: 'en',
      max: 10,
      sortby: 'publishedAt',
      token: apiKey,
    },
  });

  return response.data.articles.map((article) => ({
    title: article.title,
    description: article.description,
    content: article.content,
    url: article.url,
    image: article.image,
    publishedAt: article.publishedAt,
    source: article.source?.name || 'Unknown',
    author: article.source?.name || 'Unknown Author',
  }));
}
