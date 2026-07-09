import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleDetailPage from "@/components/site/ArticleDetailPage";
import {
  getArticleBySlug,
  getArticleParams,
  renderArticleHtml,
} from "@/lib/article-content";

export function generateStaticParams() {
  return getArticleParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) {
    return {
      title: "文章不存在 | 观复书阁",
      description: "该文章不存在或已归档。",
    };
  }
  return {
    title: `${article.title} | 观复书阁`,
    description: article.description,
  };
}

export default async function ArticleRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) {
    notFound();
  }
  return (
    <ArticleDetailPage
      article={{
        ...article,
        renderedHtml: renderArticleHtml(article),
      }}
    />
  );
}
