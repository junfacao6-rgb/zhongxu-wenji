import { BookOpen, FileText, LockKeyhole } from "lucide-react";
import Link from "next/link";
import BookCover from "@/components/site/BookCover";
import type { Book } from "@/types/content";
import type { SubjectKey } from "@/types/platform";

export type BookAccess = "readable" | "excerpt" | "restricted";

const subjectTone: Record<SubjectKey, "teal" | "cinnabar" | "indigo" | "ochre" | "earth"> = {
  qimen: "indigo",
  bazi: "cinnabar",
  liuyao: "ochre",
  meihua: "teal",
  dao: "earth",
  yixue: "teal",
};

const accessCopy: Record<BookAccess, { label: string; detail: string }> = {
  readable: {
    label: "可进入阅读",
    detail: "当前版权状态允许在站内展示学习内容。",
  },
  excerpt: {
    label: "仅摘要短摘",
    detail: "该资料当前只展示摘要、目录索引与短摘，不提供全文阅读。",
  },
  restricted: {
    label: "仅管理员可见",
    detail: "该资料用于后台学习整理，普通用户暂不能阅读。",
  },
};

type BookHeroProps = {
  book: Book;
  access: BookAccess;
};

export default function BookHero({ book, access }: BookHeroProps) {
  const copy = accessCopy[access];

  return (
    <section className={`book-hero book-hero-${book.subject}`}>
      <div className="book-hero-cover-area">
        <BookCover title={book.title} tone={subjectTone[book.subject]} className="book-hero-cover" />
      </div>

      <div className="book-hero-copy">
        <span className={`book-access-pill is-${access}`}>
          {access === "readable" ? <BookOpen aria-hidden="true" /> : access === "excerpt" ? <FileText aria-hidden="true" /> : <LockKeyhole aria-hidden="true" />}
          {copy.label}
        </span>
        <h1>{book.title}</h1>
        <p className="book-hero-subtitle">{book.subtitle}</p>
        <p className="book-hero-description">{book.description}</p>
        <p className="book-hero-access-note">{copy.detail}</p>

        <div className="book-hero-actions">
          {access === "readable" ? (
            <Link className="book-primary-action" href={`/book/${book.id}/read`}>
              <BookOpen aria-hidden="true" />
              开始阅读
            </Link>
          ) : access === "excerpt" ? (
            <a className="book-secondary-action" href="#book-excerpt">
              <FileText aria-hidden="true" />
              查看短摘
            </a>
          ) : (
            <span className="book-disabled-action">
              <LockKeyhole aria-hidden="true" />
              仅管理员可见
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
