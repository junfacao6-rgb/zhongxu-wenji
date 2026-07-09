"use client";

import { ArrowLeft, BookOpen, ListTree } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import type { BookItem } from "@/lib/site-content";
import { writeWenguReadingRecord } from "@/lib/wengu-reading-progress";
import { getReadingRecordStorageKey, getWenguCategory } from "@/lib/wengu-library";

type ClassicReaderPageProps = {
  book: BookItem;
};

export default function ClassicReaderPage({ book }: ClassicReaderPageProps) {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);
  const [fontSize, setFontSize] = useState(19);
  const [isDark, setIsDark] = useState(false);
  const category = getWenguCategory(book);
  const storageKey = getReadingRecordStorageKey(book.id);
  const chapters = book.tableOfContents.length ? book.tableOfContents : ["原书试读"];
  const activeChapter = chapters[chapterIndex] ?? chapters[0];
  const progressPercent = Math.round(((chapterIndex + 1) / chapters.length) * 100);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("zhongxu-theme");
    setIsDark(document.documentElement.getAttribute("data-theme") === "dark" || savedTheme === "dark");
    const savedFontSize = Number(window.localStorage.getItem("wengu-reader-font-size"));
    if (Number.isFinite(savedFontSize) && savedFontSize >= 18 && savedFontSize <= 22) {
      setFontSize(savedFontSize);
    }

    const requestedChapter = Number(new URLSearchParams(window.location.search).get("chapter"));
    if (Number.isFinite(requestedChapter) && requestedChapter >= 1) {
      setChapterIndex(Math.min(chapters.length - 1, requestedChapter - 1));
      return;
    }

    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as { chapterIndex?: number };
      if (typeof parsed.chapterIndex === "number" && parsed.chapterIndex >= 0) {
        setChapterIndex(Math.min(parsed.chapterIndex, chapters.length - 1));
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, [chapters.length, storageKey]);

  useEffect(() => {
    writeWenguReadingRecord({
      bookId: book.id,
      title: book.title,
      chapterIndex,
      chapterTitle: activeChapter,
      progressPercent,
      updatedAt: new Date().toISOString(),
    });
  }, [activeChapter, book.id, book.title, chapterIndex, progressPercent]);

  useEffect(() => {
    window.localStorage.setItem("wengu-reader-font-size", String(fontSize));
  }, [fontSize]);

  const readingParagraphs = useMemo(() => {
    const suggestions = book.studySuggestions.length ? book.studySuggestions : book.suitableAudience;
    return [
      book.description,
      book.summary,
      `本章题为“${activeChapter}”。阅读时可先从全书脉络入手，再回到原文词句，逐段辨清概念、条件与用法。`,
      ...suggestions.slice(0, 3).map((item) => `读书札记：${item}`),
    ];
  }, [activeChapter, book.description, book.studySuggestions, book.summary, book.suitableAudience]);

  const goToChapter = (nextIndex: number) => {
    const normalizedIndex = Math.max(0, Math.min(chapters.length - 1, nextIndex));
    setChapterIndex(normalizedIndex);
    setTocOpen(false);
    window.history.replaceState(null, "", `/library/${book.id}/read?chapter=${normalizedIndex + 1}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleReaderTheme = () => {
    const nextTheme = !isDark;
    document.documentElement.setAttribute("data-theme", nextTheme ? "dark" : "light");
    window.localStorage.setItem("zhongxu-theme", nextTheme ? "dark" : "light");
    setIsDark(nextTheme);
  };

  return (
    <section
      className="wen-gu-reader-page"
      style={{ "--reader-font-size": `${fontSize}px` } as CSSProperties & Record<"--reader-font-size", string>}
    >
      <header className="wen-gu-reader-top">
        <Link href={`/library/${book.id}`} className="wen-gu-back-link">
          <ArrowLeft className="h-4 w-4" />
          返回
        </Link>
        <div>
          <p>{category.label}</p>
          <h1>{book.title}</h1>
        </div>
        <div className="wen-gu-reader-tools" aria-label="阅读设置">
          <button onClick={() => setTocOpen((open) => !open)} type="button">
            目录
          </button>
          <button onClick={() => setFontSize((size) => Math.max(18, size - 1))} type="button">
            A-
          </button>
          <button onClick={() => setFontSize((size) => Math.min(22, size + 1))} type="button">
            A+
          </button>
          <button onClick={toggleReaderTheme} type="button">
            {isDark ? "日间" : "夜间"}
          </button>
        </div>
      </header>

      <article className="wen-gu-reading-paper">
        <p className="wen-gu-eyebrow">第 {chapterIndex + 1} 章</p>
        <h2>{activeChapter}</h2>
        <div className="wen-gu-reader-meta">
          <span>{book.totalPages} 页</span>
          <span>第 {chapterIndex + 1}/{chapters.length} 章</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="wen-gu-reader-progress" aria-label={`阅读进度 ${progressPercent}%`}>
          <i style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="wen-gu-reader-body">
          {readingParagraphs.map((paragraph, index) => (
            <p key={`${book.id}-paragraph-${index}`}>{paragraph}</p>
          ))}
        </div>
      </article>

      {book.sourceFile ? (
        <div className="wen-gu-reader-source">
          <span>原书底本：{book.sourceFile.label}</span>
          {book.sourceFile.format === "PDF" ? (
            <Link href={`/library/${book.id}/source`}>原书阅读</Link>
          ) : (
            <Link href={book.sourceFile.href} target="_blank" rel="noreferrer">
              打开{book.sourceFile.format}
            </Link>
          )}
        </div>
      ) : book.sourceNote ? (
        <div className="wen-gu-reader-source">
          <span>{book.sourceNote}</span>
        </div>
      ) : null}

      {tocOpen ? (
        <aside className="wen-gu-reader-toc" aria-label="章节目录">
          <div className="wen-gu-section-head">
            <p>目录</p>
            <h2>章节目录</h2>
          </div>
          <ol>
            {chapters.map((chapter, index) => (
              <li key={`${book.id}-toc-${index}`}>
                <button
                  className={chapterIndex === index ? "active" : undefined}
                  onClick={() => goToChapter(index)}
                  type="button"
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {chapter}
                </button>
              </li>
            ))}
          </ol>
        </aside>
      ) : null}

      <nav className="wen-gu-reader-bottom" aria-label="阅读控制">
        <button
          disabled={chapterIndex === 0}
          onClick={() => goToChapter(chapterIndex - 1)}
          type="button"
        >
          上一章
        </button>
        <button onClick={() => setTocOpen((open) => !open)} type="button">
          <ListTree className="h-4 w-4" />
          目录 {progressPercent}%
        </button>
        <button
          disabled={chapterIndex >= chapters.length - 1}
          onClick={() => goToChapter(chapterIndex + 1)}
          type="button"
        >
          下一章
        </button>
      </nav>

      <Link href="/library" className="wen-gu-reader-library-link">
        <BookOpen className="h-4 w-4" />
        返回藏书
      </Link>
    </section>
  );
}
