"use client";

import { ChevronLeft, ChevronRight, LibraryBig } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import ChapterToc from "@/components/reader/ChapterToc";
import ReaderActions from "@/components/reader/ReaderActions";
import ReaderTabs, { type ReaderTab } from "@/components/reader/ReaderTabs";
import ReadingProgress from "@/components/reader/ReadingProgress";
import TermPopover from "@/components/reader/TermPopover";
import type { Book, Term } from "@/types/content";

export type ReaderBookSummary = Pick<Book, "id" | "title" | "subtitle" | "author" | "dynasty" | "subject" | "difficulty">;

export type ReaderChapter = {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  originalParagraphs: string[];
  plainParagraphs: string[];
  noteParagraphs: string[];
  termIds: string[];
};

type TermMatch = {
  start: number;
  end: number;
  term: Term;
};

type ReaderLayoutProps = {
  book: ReaderBookSummary;
  chapters: ReaderChapter[];
  terms: Term[];
};

export default function ReaderLayout({ book, chapters, terms }: ReaderLayoutProps) {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<ReaderTab>("original");
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);
  const [isNightMode, setIsNightMode] = useState(false);
  const [bookmarkStatus, setBookmarkStatus] = useState<string | null>(null);
  const [noteStatus, setNoteStatus] = useState<string | null>(null);

  const currentChapter = chapters[chapterIndex] ?? chapters[0];
  const progressPercent = Math.round(((chapterIndex + 1) / chapters.length) * 100);
  const currentTerms = useMemo(() => terms.filter((term) => currentChapter.termIds.includes(term.id)), [currentChapter.termIds, terms]);
  const selectedTerm = terms.find((term) => term.id === selectedTermId) ?? null;
  const paragraphs = getParagraphs(currentChapter, activeTab);

  function selectChapter(nextIndex: number) {
    const safeIndex = Math.max(0, Math.min(chapters.length - 1, nextIndex));
    setChapterIndex(safeIndex);
    setSelectedTermId(null);
    setBookmarkStatus(null);
    setNoteStatus(null);
  }

  function addBookmark() {
    setBookmarkStatus(`已将「${currentChapter.title}」加入书签`);
  }

  function addNote() {
    setNoteStatus(`已为「${currentChapter.title}」创建笔记入口`);
  }

  function renderHighlightedText(text: string) {
    const matches = findTermMatches(text, currentTerms);
    if (matches.length === 0) return text;

    const nodes = [];
    let cursor = 0;

    for (const match of matches) {
      if (match.start > cursor) {
        nodes.push(text.slice(cursor, match.start));
      }

      const isActive = selectedTermId === match.term.id;
      nodes.push(
        <button key={`${match.term.id}-${match.start}`} type="button" className={`reader-term-highlight ${isActive ? "is-active" : ""}`} onClick={() => setSelectedTermId(match.term.id)}>
          {text.slice(match.start, match.end)}
        </button>,
      );
      cursor = match.end;
    }

    if (cursor < text.length) {
      nodes.push(text.slice(cursor));
    }

    return nodes;
  }

  return (
    <main className={`reader-page ${isNightMode ? "is-night" : ""}`}>
      <ReadingProgress percent={progressPercent} label={`第 ${chapterIndex + 1} / ${chapters.length} 章`} />

      <div className="reader-shell">
        <aside className="reader-left-rail">
          <section className="reader-book-summary">
            <LibraryBig aria-hidden="true" />
            <span>{book.difficulty}</span>
            <h1>{book.title}</h1>
            <p>{book.subtitle}</p>
            <small>
              {book.author} / {book.dynasty}
            </small>
            <Link href={`/book/${book.id}`}>返回书籍详情</Link>
          </section>
          <ChapterToc chapters={chapters} activeChapterId={currentChapter.id} onSelectChapter={selectChapter} />
        </aside>

        <article className="reader-paper">
          <header className="reader-paper-head">
            <div>
              <span>第 {currentChapter.order} 章</span>
              <h2>{currentChapter.title}</h2>
              <p>{currentChapter.subtitle}</p>
            </div>
            <ReaderActions
              isNightMode={isNightMode}
              bookmarkStatus={bookmarkStatus}
              noteStatus={noteStatus}
              onToggleNightMode={() => setIsNightMode((value) => !value)}
              onAddBookmark={addBookmark}
              onAddNote={addNote}
            />
          </header>

          <ReaderTabs activeTab={activeTab} onTabChange={setActiveTab}>
            <div className={`reader-text reader-text-${activeTab}`}>
              {paragraphs.map((paragraph, index) => (
                <p key={`${currentChapter.id}-${activeTab}-${index}`}>{renderHighlightedText(paragraph)}</p>
              ))}
            </div>
          </ReaderTabs>

          <nav className="reader-chapter-nav" aria-label="章节翻页">
            <button type="button" onClick={() => selectChapter(chapterIndex - 1)} disabled={chapterIndex === 0}>
              <ChevronLeft aria-hidden="true" />
              上一章
            </button>
            <button type="button" onClick={() => selectChapter(chapterIndex + 1)} disabled={chapterIndex === chapters.length - 1}>
              下一章
              <ChevronRight aria-hidden="true" />
            </button>
          </nav>
        </article>

        <aside className="reader-right-rail">
          <TermPopover term={selectedTerm} onClose={() => setSelectedTermId(null)} />
          <section className="reader-term-list" aria-label="本章术语">
            <span>本章术语</span>
            <div>
              {currentTerms.map((term) => (
                <button key={term.id} type="button" className={selectedTermId === term.id ? "is-active" : ""} onClick={() => setSelectedTermId(term.id)}>
                  {term.name}
                </button>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

function getParagraphs(chapter: ReaderChapter, tab: ReaderTab) {
  if (tab === "plain") return chapter.plainParagraphs;
  if (tab === "notes") return chapter.noteParagraphs;
  return chapter.originalParagraphs;
}

function findTermMatches(text: string, sourceTerms: Term[]) {
  const matches: TermMatch[] = [];

  for (const term of sourceTerms) {
    let start = text.indexOf(term.name);
    while (start >= 0) {
      matches.push({ start, end: start + term.name.length, term });
      start = text.indexOf(term.name, start + term.name.length);
    }
  }

  const sortedMatches = matches.sort((a, b) => a.start - b.start || b.end - b.start - (a.end - a.start));
  const acceptedMatches: TermMatch[] = [];
  let occupiedUntil = 0;

  for (const match of sortedMatches) {
    if (match.start >= occupiedUntil) {
      acceptedMatches.push(match);
      occupiedUntil = match.end;
    }
  }

  return acceptedMatches;
}
