import { ArrowRight, LockKeyhole } from "lucide-react";
import Link from "next/link";
import BookCover from "@/components/site/BookCover";
import type { Book } from "@/types/content";
import type { SubjectKey } from "@/types/platform";

const subjectTone: Record<SubjectKey, "teal" | "cinnabar" | "indigo" | "ochre" | "earth"> = {
  qimen: "indigo",
  bazi: "cinnabar",
  liuyao: "ochre",
  meihua: "teal",
  dao: "earth",
  yixue: "teal",
};

type SubjectBooksProps = {
  books: Book[];
};

export default function SubjectBooks({ books }: SubjectBooksProps) {
  if (books.length === 0) {
    return <p className="subject-empty-copy">推荐书籍正在整理中。</p>;
  }

  return (
    <div className="subject-book-list">
      {books.map((book) => {
        const isPrivate = book.visibility === "private" || book.visibility === "hidden" || book.copyrightStatus === "private_study" || book.copyrightStatus === "hidden";
        return (
          <article key={book.id} className="subject-book-item">
            <BookCover title={book.title} tone={subjectTone[book.subject]} className="subject-book-cover" />
            <div>
              <span>{book.difficulty} / {book.category}</span>
              <h3>{book.title}</h3>
              <p>{book.description}</p>
              {isPrivate ? (
                <small>
                  <LockKeyhole aria-hidden="true" />
                  仅后台整理可见
                </small>
              ) : (
                <Link href={`/book/${book.id}`}>
                  查看书籍
                  <ArrowRight aria-hidden="true" />
                </Link>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
