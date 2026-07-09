"use client";

import { ChevronRight, Search, ShieldAlert, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import BookCard from "@/components/library/BookCard";
import BookFilters, { type DifficultyFilterValue, type SubjectFilterValue } from "@/components/library/BookFilters";
import RecentReading from "@/components/library/RecentReading";
import { platformMockBooks } from "@/data/books";
import { newUploadCategoryIntake } from "@/data/sourceIntakeMock";
import { siteContent } from "@/lib/site-content";
import { readWenguReadingRecords, type WenguReadingRecord } from "@/lib/wengu-reading-progress";

const subjectEntrances: {
  label: string;
  value: Exclude<SubjectFilterValue, "all">;
  subtitle: string;
  image: string;
}[] = [
  { label: "奇门古籍", value: "qimen", subtitle: "九宫八门", image: "/images/wengu/categories/qimen.webp" },
  { label: "八字古籍", value: "bazi", subtitle: "格局用神", image: "/images/wengu/categories/bazi.webp" },
  { label: "六爻古籍", value: "liuyao", subtitle: "问事取象", image: "/images/wengu/categories/liuyao.webp" },
  { label: "梅花易数", value: "meihua", subtitle: "体用触机", image: "/images/wengu/categories/meihua.webp" },
  { label: "道家经典", value: "dao", subtitle: "修身明理", image: "/images/wengu/categories/daoist.webp" },
  { label: "易学基础", value: "yixue", subtitle: "阴阳干支", image: "/images/wengu/categories/other.webp" },
];

export default function LibraryPage() {
  const books = platformMockBooks;
  const [query, setQuery] = useState("");
  const [activeSubject, setActiveSubject] = useState<SubjectFilterValue>("all");
  const [activeDifficulty, setActiveDifficulty] = useState<DifficultyFilterValue>("all");
  const [records, setRecords] = useState<WenguReadingRecord[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const subject = params.get("subject") as SubjectFilterValue | null;
    const difficulty = params.get("difficulty") as DifficultyFilterValue | null;

    if (subject && ["qimen", "bazi", "liuyao", "meihua", "dao", "yixue"].includes(subject)) {
      setActiveSubject(subject);
    }
    if (difficulty && ["入门", "进阶", "专业", "原典"].includes(difficulty)) {
      setActiveDifficulty(difficulty);
    }

    setRecords(readWenguReadingRecords(siteContent.books));
  }, []);

  const visibleBooks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return books.filter((book) => {
      const matchesSubject = activeSubject === "all" || book.subject === activeSubject;
      const matchesDifficulty = activeDifficulty === "all" || book.difficulty === activeDifficulty;
      const text = [
        book.title,
        book.subtitle,
        book.author,
        book.dynasty,
        book.category,
        book.description,
        book.difficulty,
        ...book.tags,
      ].join(" ").toLowerCase();
      const matchesQuery = !normalizedQuery || text.includes(normalizedQuery);
      return matchesSubject && matchesDifficulty && matchesQuery;
    });
  }, [activeDifficulty, activeSubject, books, query]);

  const subjectCounts = useMemo(
    () =>
      subjectEntrances.reduce<Record<Exclude<SubjectFilterValue, "all">, number>>(
        (counts, item) => {
          counts[item.value] = books.filter((book) => book.subject === item.value).length;
          return counts;
        },
        {
          qimen: 0,
          bazi: 0,
          liuyao: 0,
          meihua: 0,
          dao: 0,
          yixue: 0,
        },
      ),
    [books],
  );

  const latestRecord = records[0];
  const latestRecordHref = latestRecord
    ? latestRecord.chapterTitle === "原书影像" || latestRecord.chapterTitle === "提取文字"
      ? `/library/${latestRecord.bookId}/source`
      : `/library/${latestRecord.bookId}/read?chapter=${latestRecord.chapterIndex + 1}`
    : "";
  const publicCount = books.filter((book) => book.visibility === "public").length;
  const privateCount = books.length - publicCount;

  return (
    <section className="wen-gu-page wen-gu-library-page library-platform-page library-archive-page">
      <section className="library-archive-scroll" aria-label="问古书斋藏书画卷">
        <img src="/images/hero-scroll-reference-crop-20260705.webp" alt="" />
      </section>

      <main className="library-archive-main">
        <header className="wen-gu-library-head library-platform-head library-archive-head">
          <div className="library-archive-intro">
            <p className="wen-gu-eyebrow">藏书阁</p>
            <h1>按门类寻书，循原典入学</h1>
            <span>以传统术数与道家经典为主线整理馆藏，按版权边界、学科、难度和关键词进入阅读。</span>

            <div className="library-archive-ledger" aria-label="馆藏统计">
              <span>
                <strong>{books.length}</strong>
                <small>馆藏条目</small>
              </span>
              <span>
                <strong>{publicCount}</strong>
                <small>公开可读</small>
              </span>
              <span>
                <strong>{privateCount}</strong>
                <small>后台资料</small>
              </span>
            </div>

            {latestRecord ? (
              <Link href={latestRecordHref} className="wen-gu-continue-strip library-archive-continue">
                <strong>继续阅读</strong>
                <span>
                  《{latestRecord.title}》 · {latestRecord.chapterTitle ?? `第 ${latestRecord.chapterIndex + 1} 章`}
                </span>
                <ChevronRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            ) : null}
          </div>

          <div className="library-archive-category-board" aria-label="藏书门类入口">
            {subjectEntrances.map((item) => (
              <button
                className={activeSubject === item.value ? "active" : undefined}
                key={item.value}
                onClick={() => setActiveSubject(item.value)}
                type="button"
              >
                <img src={item.image} alt="" />
                <strong>{item.label}</strong>
                <span>{item.subtitle}</span>
                <small>{subjectCounts[item.value]} 本</small>
              </button>
            ))}
          </div>
        </header>

        <section className="wen-gu-library-toolbar library-platform-toolbar library-archive-toolbar" aria-label="藏书检索">
          <label className="wen-gu-search-box library-archive-search">
            <Search className="h-4 w-4" />
            <input
              aria-label="搜索书名、作者、分类或关键词"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索书名、作者、分类或关键词"
              type="search"
              value={query}
            />
            {query ? (
              <button aria-label="清空搜索" onClick={() => setQuery("")} type="button">
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </label>
          <p>未授权资料默认不公开全文，私密资料仅后台可见。</p>
        </section>

        <section className="wen-gu-section library-intake-section" aria-label="新入库资料分类索引">
          <div className="wen-gu-section-head">
            <div>
              <p>新入库</p>
              <h2>上传资料分类索引</h2>
            </div>
            <span>仅展示分类，不公开全文</span>
          </div>
          <div className="library-intake-warning">
            <ShieldAlert aria-hidden="true" />
            <p>本批资料默认 `private_study / private / pending`。扫描 PDF 需要 OCR，现代出版物与敏感资料只进入后台学习草稿。</p>
          </div>
          <div className="library-intake-grid">
            {newUploadCategoryIntake.map((category) => (
              <article key={category.id} className={`library-intake-card is-${category.status}`}>
                <div>
                  <span>{category.fileCount} 份</span>
                  <strong>{category.title}</strong>
                  <small>{category.sizeLabel}</small>
                </div>
                <p>{category.summary}</p>
                <ul>
                  {category.representativeTitles.map((title) => (
                    <li key={title}>{title}</li>
                  ))}
                </ul>
                <em>{category.publicNote}</em>
              </article>
            ))}
          </div>
        </section>

        <BookFilters
          difficulty={activeDifficulty}
          onDifficultyChange={setActiveDifficulty}
          onSubjectChange={setActiveSubject}
          subject={activeSubject}
          totalCount={books.length}
          visibleCount={visibleBooks.length}
        />

        <div className="library-platform-layout library-archive-layout">
          <section className="wen-gu-section library-book-section library-archive-book-section" id="all-books">
            <div className="wen-gu-section-head library-book-section-head">
              <div>
                <p>目录</p>
                <h2>全部藏书</h2>
              </div>
              <span>{visibleBooks.length ? `当前显示 ${visibleBooks.length} 本` : "暂无匹配结果"}</span>
            </div>

            {visibleBooks.length ? (
              <div className="library-book-grid">
                {visibleBooks.map((book) => (
                  <BookCard book={book} key={book.id} />
                ))}
              </div>
            ) : (
              <div className="wen-gu-empty-state library-empty-state">
                <p>没有找到匹配的书籍。</p>
                <button
                  onClick={() => {
                    setQuery("");
                    setActiveSubject("all");
                    setActiveDifficulty("all");
                  }}
                  type="button"
                >
                  清空筛选
                </button>
              </div>
            )}
          </section>

          <RecentReading records={records} />
        </div>
      </main>
    </section>
  );
}
