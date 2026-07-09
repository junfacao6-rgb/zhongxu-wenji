import ArticleCard from "@/components/site/ArticleCard";
import { getAllArticles } from "@/lib/article-content";

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <section className="knowledge-shell pb-10 pt-10 md:pb-14 md:pt-14">
      <header className="light-page-hero">
        <p className="eyebrow-line">ESSAYS</p>
        <h1 className="mt-4 text-4xl font-semibold text-[#2f1d0c]">文章</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6a5238]">
          围绕常见术语与案例误区输出专题文章，适合按需快速查阅与收藏复盘。
        </p>
      </header>
      <div className="mt-8 grid gap-3 md:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  );
}
