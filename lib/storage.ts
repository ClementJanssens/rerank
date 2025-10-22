import { ApiKeys, GeneratedArticle } from "./types";

const STORAGE_KEYS = {
  API_KEYS: "seo_gen_api_keys",
  ARTICLES: "seo_gen_articles",
} as const;

// API Keys management
export function saveApiKeys(keys: ApiKeys): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(keys));
}

export function getApiKeys(): ApiKeys | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEYS.API_KEYS);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as ApiKeys;
  } catch {
    return null;
  }
}

export function hasApiKeys(): boolean {
  const keys = getApiKeys();
  return !!(keys?.anthropic && keys?.firecrawl && keys?.perplexity);
}

// Articles management
export function saveArticle(article: GeneratedArticle): void {
  if (typeof window === "undefined") return;
  const articles = getArticles();
  const existingIndex = articles.findIndex((a) => a.id === article.id);

  if (existingIndex >= 0) {
    articles[existingIndex] = article;
  } else {
    articles.unshift(article);
  }

  localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
}

export function getArticles(): GeneratedArticle[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEYS.ARTICLES);
  if (!stored) return [];
  try {
    return JSON.parse(stored) as GeneratedArticle[];
  } catch {
    return [];
  }
}

export function getArticleById(id: string): GeneratedArticle | null {
  const articles = getArticles();
  return articles.find((a) => a.id === id) || null;
}

export function deleteArticle(id: string): void {
  if (typeof window === "undefined") return;
  const articles = getArticles();
  const filtered = articles.filter((a) => a.id !== id);
  localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(filtered));
}

export function clearAllArticles(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify([]));
}

