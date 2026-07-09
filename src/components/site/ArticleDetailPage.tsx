import Link from "next/link";
import type { ArticleDocument } from "@/lib/article-content";

interface ArticleDetailPageProps {
  article: ArticleDocument;
}

export default function ArticleDetailPage({ article }: ArticleDetailPageProps) {
  return (
    <article className="centered-page pb-12 pt-10 md:pb-16 md:pt-14">
      <Link href="/articles" className="text-xs text-[#8a6a42] hover:text-[#9f3f2f]">
        ← 返回文章目录
      </Link>

      <header className="mt-8 border-b border-[rgba(92,61,28,0.12)] pb-8">
        <p className="eyebrow-line">{article.category}</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#2f1d0c] md:text-5xl">
          {article.title}
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#6a4f33]">
          {article.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#6f5639] sm:gap-3">
          <span>发布于：{article.date || "未填写"}</span>
          <span className="hidden sm:inline">·</span>
          {article.tags.map((tag) => (
            <span
              key={`${article.slug}-tag-${tag}`}
              className="rounded-full border border-[rgba(122,88,34,0.28)] px-2 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="my-8 border-l-4 border-[#d6b268] bg-[#f6ecd5] px-5 py-4 text-sm leading-7 text-[#6a5238]">
        <p>
          本文适合先读概念边界，再对照案例复盘。不要把术语当结论，先看结构是否成立。
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-sm font-semibold tracking-[0.14em] text-[#9f3f2f]">文章要点</h2>
        <div className="mt-4 space-y-4 border-l border-[rgba(159,63,47,0.22)] pl-5">
          {article.tags.map((tag) => (
            <div key={`${article.slug}-point-${tag}`} className="relative">
              <span className="absolute -left-[1.72rem] top-1.5 h-2.5 w-2.5 rounded-full border border-[#9f3f2f] bg-[#f8f0df]" />
              <p className="font-semibold text-[#2f1d0c]">{tag}</p>
              <p className="mt-1 text-sm leading-7 text-[#6a5238]">
                阅读时把「{tag}」作为检索点，回到正文里找定义、条件和反例。
              </p>
            </div>
          ))}
        </div>
      </section>

      <div
        className="article-content max-w-none border-t border-[rgba(92,61,28,0.12)] pt-8 text-base leading-[2.05] text-[#4b3518]"
        style={{
          fontFamily: `"Noto Serif SC","Source Han Serif SC","STSong",serif`,
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: article.renderedHtml ?? "" }} />
      </div>
    </article>
  );
}
