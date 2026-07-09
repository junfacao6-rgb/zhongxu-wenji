import rawContent from "@/data/site-content.json";
import { books } from "@/data/books";

export interface BookItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  totalPages: number;
  status: string;
  tags: string[];
  coverStyle: string;
  summary: string;
  suitableAudience: string[];
  studySuggestions: string[];
  tableOfContents: string[];
  sourceFile?: {
    label: string;
    href: string;
    format: "PDF" | "TXT";
    sizeLabel: string;
  };
  extractedTextFile?: {
    label: string;
    href: string;
    sizeLabel: string;
    status: "ready" | "needs_ocr";
  };
  sourceNote?: string;
}

export interface ArticleItem {
  slug: string;
  title: string;
  summary: string;
  category: string;
  author: string;
  publishDate: string;
  content: string[];
}

export interface DiagramItem {
  id: string;
  title: string;
  category: string;
  summary: string;
}

export interface ToolItem {
  id: string;
  title: string;
  description: string;
  status: string;
}

export interface LearningPathItem {
  id: string;
  title: string;
  items: string[];
  summary: string;
}

export interface SiteData {
  brand: {
    name: string;
    description: string;
    heroTag: string;
    heroTitle: string;
    heroSubtitle: string;
  };
  stats: {
    label: string;
    value: string;
  }[];
  books: BookItem[];
  articles: ArticleItem[];
  diagrams: DiagramItem[];
  tools: ToolItem[];
  learningPaths: LearningPathItem[];
}

const baseSiteContent = rawContent as Omit<SiteData, "books"> & { books?: unknown[] };

export const siteContent: SiteData = {
  ...baseSiteContent,
  books,
};

export function getBookById(id: string): BookItem | undefined {
  return siteContent.books.find((book) => book.id === id);
}

export function getArticleBySlug(slug: string): ArticleItem | undefined {
  return siteContent.articles.find((article) => article.slug === slug);
}
