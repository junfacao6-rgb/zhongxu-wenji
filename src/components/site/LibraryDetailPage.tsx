import { ArrowLeft, BookOpen, CheckCircle2, FileText, ScrollText } from "lucide-react";
import Link from "next/link";
import BookCover from "@/components/site/BookCover";
import LibraryDetailReadingState from "@/components/site/LibraryDetailReadingState";
import WenguShelfRow from "@/components/site/WenguShelfRow";
import { getBookById, siteContent } from "@/lib/site-content";
import { getBookAttribution, getBookPrimaryReadHref, getBookReadHref, getWenguCategory } from "@/lib/wengu-library";

function getDisplayBookTitle(title: string) {
  return title.replace("导读", "").replace("白话评注", "").replace("阐微", "").trim();
}

const detailCoverImages: Record<string, string> = {
  "ziping-zhenquan": "/images/wengu/books/ziping-zhenquan.webp",
  "ditiansui-chanwei": "/images/wengu/books/ditiansui.webp",
  "sanming-tonghui": "/images/wengu/books/sanming-tonghui.webp",
  "yuanhai-ziping": "/images/wengu/books/ziping-zhenquan.webp",
};

export default function LibraryDetailPage({ id }: { id: string }) {
  const book = getBookById(id);

  if (!book) {
    return (
      <section className="wen-gu-page">
        <div className="wen-gu-section">
          <h1>书籍不存在</h1>
          <p className="wen-gu-muted-line">你访问的内容未找到，建议先返回藏书页。</p>
          <Link href="/library" className="wen-gu-secondary-link">
            返回藏书
          </Link>
        </div>
      </section>
    );
  }

  const category = getWenguCategory(book);
  const attribution = getBookAttribution(book);
  const displayTitle = getDisplayBookTitle(book.title);
  const readHref = getBookReadHref(book);
  const primaryReadHref = getBookPrimaryReadHref(book);
  const sourceReady = Boolean(book.sourceFile);
  const sourceHref = book.sourceFile ? `/library/${book.id}/source` : undefined;
  const textHref = sourceHref ? `${sourceHref}?mode=text` : readHref;
  const textReady = book.extractedTextFile?.status === "ready";
  const relatedBooks = siteContent.books
    .filter((item) => item.id !== book.id && getWenguCategory(item).id === category.id)
    .slice(0, 5);

  return (
    <section className="wen-gu-page wen-gu-detail-page">
      <Link href="/library" className="wen-gu-back-link">
        <ArrowLeft className="h-4 w-4" />
        返回藏书
      </Link>

      <article className="wen-gu-detail-card">
        <div className="wen-gu-detail-cover-panel">
          <BookCover
            title={displayTitle}
            tone="earth"
            className="wen-gu-detail-cover"
            imageSrc={detailCoverImages[book.id]}
          />
          <div className="wen-gu-detail-cover-stamp">
            <strong>问古书斋辑入</strong>
            <small>{category.label} · {book.status}</small>
          </div>
        </div>

        <div className="wen-gu-detail-copy">
          <p className="wen-gu-eyebrow">{category.label}</p>
          <h1>{displayTitle}</h1>
          <p className="wen-gu-detail-subtitle">{book.subtitle}</p>
          <p className="wen-gu-detail-meta">{attribution} · {book.totalPages} 页 · {book.status}</p>
          <div className="wen-gu-detail-badges" aria-label="底本状态">
            <span>
              {sourceReady ? <CheckCircle2 className="h-4 w-4" /> : <ScrollText className="h-4 w-4" />}
              {sourceReady ? `已接入${book.sourceFile?.format}底本` : "导读先行，底本整理中"}
            </span>
            <span>
              <FileText className="h-4 w-4" />
              {book.tableOfContents.length} 章目录
            </span>
          </div>
          <p>{book.description}</p>
          <div className="wen-gu-detail-guide-card" aria-label="导读提示">
            <span>读前一念</span>
            <p>{book.studySuggestions[0] ?? "先看目录，再入正文，慢慢读。"}</p>
          </div>
          <div className="wen-gu-detail-entry-grid" aria-label="阅读入口">
            <Link href={sourceHref ?? primaryReadHref} className="wen-gu-detail-entry">
              <span>
                <ScrollText className="h-4 w-4" />
                原书影像
              </span>
              <strong>{sourceReady ? "照底本阅读" : "底本整理中"}</strong>
              <small>{sourceReady ? "保留原书页貌，适合核对版式与原文。" : "当前先进入章节导读。"}</small>
            </Link>
            <Link href={textHref} className="wen-gu-detail-entry">
              <span>
                <FileText className="h-4 w-4" />
                提取文字
              </span>
              <strong>{textReady ? "手机清读" : "待校文字"}</strong>
              <small>{book.extractedTextFile ? "适合长时间阅读、复制与后续校注。" : "先读章节导读，后续补全文字。"}</small>
            </Link>
          </div>
          <div className="wen-gu-detail-actions">
            <Link href={primaryReadHref} className="wen-gu-primary-link">
              <BookOpen className="h-4 w-4" />
              开始阅读
            </Link>
            <Link href={readHref} className="wen-gu-secondary-link">
              章节导读
            </Link>
          </div>
        </div>
      </article>

      <LibraryDetailReadingState bookId={book.id} sourceHref={sourceHref} title={book.title} />

      <section className="wen-gu-section">
        <div className="wen-gu-section-head">
          <p>简介</p>
          <h2>本书说明</h2>
        </div>
        <p className="wen-gu-reading-summary">{book.summary}</p>
        <div className="wen-gu-detail-reading-path" aria-label="读书路径">
          {book.studySuggestions.slice(0, 3).map((item, index) => (
            <p key={`${book.id}-path-${index}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item}
            </p>
          ))}
        </div>
        {book.sourceFile || book.sourceNote ? (
          <aside className="wen-gu-source-note">
            <strong>底本</strong>
            {book.sourceFile ? (
              <span>
                {book.sourceFile.label} · {book.sourceFile.sizeLabel} · 可切换原书影像与提取文字
              </span>
            ) : null}
            {book.sourceNote ? <p>{book.sourceNote}</p> : null}
          </aside>
        ) : null}
      </section>

      <section className="wen-gu-section">
        <div className="wen-gu-section-head">
          <p>目录</p>
          <h2>章节目录</h2>
        </div>
        <ol className="wen-gu-toc-list">
          {book.tableOfContents.map((chapter, index) => (
            <li key={`${book.id}-chapter-${index}`}>
              <Link href={`${readHref}?chapter=${index + 1}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {chapter}
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {relatedBooks.length ? (
        <section className="wen-gu-section">
          <div className="wen-gu-section-head">
            <p>同类</p>
            <h2>同类藏书</h2>
          </div>
          <WenguShelfRow books={relatedBooks} description={category.description} title={category.label} />
        </section>
      ) : null}
    </section>
  );
}
