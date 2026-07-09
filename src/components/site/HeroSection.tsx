import Link from "next/link";
import { siteContent } from "@/lib/site-content";

export default function HeroSection() {
  const featuredBooks = siteContent.books.slice(0, 3);
  const totalPages = siteContent.books.reduce((sum, book) => sum + book.totalPages, 0);
  const heroStats = [
    [String(siteContent.books.length), "馆藏书目"],
    [String(totalPages), "整理页数"],
    ["持续", "馆主上传"],
  ];

  return (
    <section className="reader-hero-shell">
      <div className="reader-hero-grid">
        <div className="reader-hero-copy">
          <p className="reader-kicker">观复书阁 · 粉丝阅读馆</p>
          <h1>
            <span>把上传的书，</span>
            <span>整理成一座</span>
            <span>可持续阅读的观复书阁。</span>
          </h1>
          <p>
            这里不是普通资料列表，而是给粉丝长期阅读、查找、续读的书籍平台。馆主上传书籍后，内容会按八字、六爻、奇门与方法工具整理成可进入、可追踪、可继续阅读的馆藏。
          </p>

          <div className="reader-hero-actions">
            <Link href="/library" className="reader-primary-action">
              进入书架
            </Link>
            <Link href="/learn" className="reader-secondary-action">
              查看阅读路径
            </Link>
          </div>

          <div className="reader-hero-stats" aria-label="观复书阁阅读平台统计">
            {heroStats.map(([value, label]) => (
              <span key={label}>
                <strong>{value}</strong>
                <small>{label}</small>
              </span>
            ))}
          </div>
        </div>

        <div className="reader-hero-stage" aria-label="阅读馆预览">
          <div className="reader-continue-card">
            <span>继续阅读</span>
            <strong>{featuredBooks[0]?.title ?? "馆藏导读"}</strong>
            <p>{featuredBooks[0]?.subtitle ?? "从第一本上传资料开始建立阅读路径"}</p>
            <div className="reader-progress-track">
              <i />
            </div>
          </div>

          <div className="reader-stack">
            {featuredBooks.map((book, index) => (
              <Link
                key={book.id}
                href={`/library/${book.id}`}
                className={`reader-spine reader-spine-${index + 1}`}
              >
                <span>{book.category}</span>
                <strong>{book.title}</strong>
                <small>{book.totalPages} 页</small>
              </Link>
            ))}
          </div>

          <div className="reader-upload-note">
            <span>上传规划</span>
            <p>先确定阅读馆风格，再接入真实书籍上传、阅读记录与权限管理。</p>
          </div>
        </div>
      </div>
    </section>
  );
}
