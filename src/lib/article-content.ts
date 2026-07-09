import fs from "node:fs";
import path from "node:path";

export interface ArticleMeta {
  title: string;
  slug: string;
  category: string;
  description: string;
  date: string;
  cover?: string;
  tags: string[];
}

export interface ArticleDocument extends ArticleMeta {
  rawContent: string;
  fileName: string;
  renderedHtml?: string;
}

const contentDir = path.join(process.cwd(), "content", "articles");
const supportedExtensions = [".md", ".mdx"];

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseFrontMatter(raw: string): {
  frontMatter: Partial<ArticleMeta>;
  body: string;
} {
  const normalizedRaw = raw.replace(/^\uFEFF/, "");

  if (!normalizedRaw.startsWith("---")) {
    return { frontMatter: {}, body: normalizedRaw.trim() };
  }

  const lines = normalizedRaw.split(/\r?\n/);
  const secondFence = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
  if (secondFence < 0) {
    return { frontMatter: {}, body: raw.trim() };
  }

  const fmLines = lines.slice(1, secondFence);
  const body = lines.slice(secondFence + 1).join("\n").trim();
  const frontMatter: Partial<ArticleMeta> = {};

  for (const line of fmLines) {
    const [rawKey, ...rest] = line.split(":");
    if (!rawKey || rest.length === 0) {
      continue;
    }

    const key = rawKey.trim();
    const valueText = rest.join(":").trim();
    if (!key) {
      continue;
    }

    if (key === "tags") {
      try {
        frontMatter.tags = JSON.parse(valueText) as string[];
      } catch {
        frontMatter.tags = valueText
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }
      continue;
    }

    if (key === "date") {
      frontMatter.date = valueText;
      continue;
    }
    if (key === "cover") {
      frontMatter.cover = valueText;
      continue;
    }
    if (key === "title") {
      frontMatter.title = valueText;
      continue;
    }
    if (key === "slug") {
      frontMatter.slug = valueText;
      continue;
    }
    if (key === "category") {
      frontMatter.category = valueText;
      continue;
    }
    if (key === "description") {
      frontMatter.description = valueText;
    }
  }

  if (!frontMatter.tags) {
    frontMatter.tags = [];
  }

  return { frontMatter, body };
}

function applyInlineMarkdown(input: string): string {
  return input
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[(.+?)\]\((.+?)\)/g, "<a href=\"$2\">$1</a>");
}

function parseMarkdownBlock(markdown: string): string {
  const escaped = escapeHtml(markdown);
  const rawLines = escaped.split(/\r?\n/);
  const htmlParts: string[] = [];
  const listItems: string[] = [];
  let listType: "ul" | "ol" = "ul";

  const flushList = () => {
    if (!listItems.length) {
      return;
    }
    const listTag = listType === "ol" ? "ol" : "ul";
    const listStyle = listType === "ol" ? "list-decimal" : "list-disc";
    htmlParts.push(`<${listTag} class='${listStyle} pl-6 space-y-2'>`);
    for (const item of listItems) {
      htmlParts.push(`<li>${applyInlineMarkdown(item)}</li>`);
    }
    htmlParts.push(`</${listTag}>`);
    listItems.length = 0;
  };

  const pushParagraph = (value: string) => {
    const text = value.trim();
    if (!text) {
      return;
    }
    htmlParts.push(`<p>${applyInlineMarkdown(text)}</p>`);
  };

  const normalizeCodeBlockFence = (line: string): boolean => /^(```|~~~)/.test(line.trim());

  let inCodeBlock = false;
  let codeBuffer: string[] = [];

  for (const rawLine of rawLines) {
    const line = rawLine.trimEnd();

    if (normalizeCodeBlockFence(line)) {
      flushList();
      inCodeBlock = !inCodeBlock;
      if (!inCodeBlock) {
        htmlParts.push(`<pre><code>${codeBuffer.join("\n")}</code></pre>`);
        codeBuffer = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    const headingMatch = /^(#{1,3})\s+(.+)$/.exec(line);
    if (headingMatch) {
      flushList();
      const level = headingMatch[1].length;
      const content = applyInlineMarkdown(headingMatch[2].trim());
      htmlParts.push(`<h${level} class='font-semibold mt-8 mb-4'>${content}</h${level}>`);
      continue;
    }

    const ulMatch = /^-\s+(.+)$/.exec(line);
    if (ulMatch?.[1]) {
      if (listType !== "ul" && listItems.length > 0) {
        flushList();
      }
      listType = "ul";
      listItems.push(applyInlineMarkdown(ulMatch[1].trim()));
      continue;
    }

    const olMatch = /^\d+[.)]\s+(.+)$/.exec(line);
    if (olMatch?.[1]) {
      if (listType !== "ol" && listItems.length > 0) {
        flushList();
      }
      listType = "ol";
      listItems.push(applyInlineMarkdown(olMatch[1].trim()));
      continue;
    }

    if (!line.trim()) {
      flushList();
      continue;
    }

    if (line.startsWith(">")) {
      flushList();
      htmlParts.push(`<blockquote class='border-l-2 pl-4 text-[#6a5238]'>${applyInlineMarkdown(
        line.replace(/^>\s?/, ""),
      )}</blockquote>`);
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      flushList();
      htmlParts.push("<hr class='my-6 border-[rgba(73,58,34,0.24)]' />");
      continue;
    }

    pushParagraph(line);
  }

  flushList();
  if (inCodeBlock) {
    htmlParts.push(`<pre><code>${codeBuffer.join("\n")}</code></pre>`);
  }

  return htmlParts.filter(Boolean).join("\n");
}

function getArticleFiles(): string[] {
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  return fs
    .readdirSync(contentDir)
    .filter((name) => supportedExtensions.includes(path.extname(name).toLowerCase()))
    .sort();
}

export function getAllArticles(): ArticleDocument[] {
  const files = getArticleFiles();
  const articles = files.map((fileName) => {
    const fullPath = path.join(contentDir, fileName);
    const rawText = fs.readFileSync(fullPath, "utf8");
    const { frontMatter, body } = parseFrontMatter(rawText);
    const safeSlug = path.basename(fileName, path.extname(fileName));
    const slug = frontMatter.slug || safeSlug;

    return {
      title: frontMatter.title || safeSlug,
      slug,
      category: frontMatter.category || "文章",
      description: frontMatter.description || "",
      date: frontMatter.date || "",
      cover: frontMatter.cover,
      tags: frontMatter.tags || [],
      rawContent: body,
      fileName,
    } as ArticleDocument;
  });

  return articles.sort((a, b) => {
    if (!a.date || !b.date) {
      return a.slug.localeCompare(b.slug);
    }
    return b.date.localeCompare(a.date);
  });
}

export function getArticleBySlug(slug: string): ArticleDocument | undefined {
  return getAllArticles().find((article) => article.slug === slug);
}

export function getArticleParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export function renderArticleHtml(article: ArticleDocument): string {
  return parseMarkdownBlock(article.rawContent);
}
