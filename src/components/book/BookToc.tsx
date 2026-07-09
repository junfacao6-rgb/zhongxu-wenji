import { LockKeyhole, ScrollText } from "lucide-react";
import type { BookAccess } from "./BookHero";

type BookTocProps = {
  items: string[];
  access: BookAccess;
};

export default function BookToc({ items, access }: BookTocProps) {
  const isRestricted = access === "restricted";

  return (
    <section className="book-detail-card book-toc-card" aria-labelledby="book-toc-title">
      <div className="book-section-head">
        <span>阅读路径</span>
        <h2 id="book-toc-title">目录</h2>
      </div>

      {isRestricted ? (
        <div className="book-restricted-block">
          <LockKeyhole aria-hidden="true" />
          <p>该资料目录暂不向普通用户展示，可在后台整理草稿中查看。</p>
        </div>
      ) : (
        <>
          <ol className="book-toc-list">
            {items.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </li>
            ))}
          </ol>
          {access === "excerpt" ? (
            <p className="book-toc-note">
              <ScrollText aria-hidden="true" />
              当前版权状态仅开放目录索引、摘要与短摘，不提供全文阅读入口。
            </p>
          ) : null}
        </>
      )}
    </section>
  );
}
