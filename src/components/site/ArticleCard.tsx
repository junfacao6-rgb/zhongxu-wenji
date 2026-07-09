import Link from "next/link";
import type { ArticleMeta } from "@/lib/article-content";

export default function ArticleCard({ article }: { article: ArticleMeta }) {
  return (
    <article className="paper-card flex h-full flex-col justify-between rounded-lg p-5">
      <div>
        <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#9f3f2f]">{article.category}</p>
        <h3 className="mb-2 text-xl font-semibold text-[#2f1d0c]">{article.title}</h3>
        <p className="mb-4 text-sm leading-relaxed text-[#6a5238]">{article.description}</p>
      </div>
      <Link href={`/articles/${article.slug}`} className="ghost-button mt-2 inline-flex w-full px-4 py-2 text-sm sm:w-fit">
        阅读正文
      </Link>
    </article>
  );
}
