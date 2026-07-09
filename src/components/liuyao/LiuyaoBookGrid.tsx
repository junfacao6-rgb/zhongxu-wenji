import Link from "next/link";
import { ArrowRight, LockKeyhole } from "lucide-react";
import BookCover from "@/components/site/BookCover";
import type { Book } from "@/types/content";

interface LiuyaoBookGridProps {
  books: Book[];
}

export default function LiuyaoBookGrid({ books }: LiuyaoBookGridProps) {
  return (
    <div className="liuyao-book-grid">
      {books.map((book) => {
        const isPrivate = book.visibility === "private" || book.visibility === "hidden" || book.copyrightStatus === "private_study" || book.copyrightStatus === "hidden";

        return (
          <article key={book.id}>
            <BookCover title={book.title} tone="ochre" className="liuyao-book-cover" />
            <div>
              <span>{book.difficulty} · {book.category}</span>
              <h3>{book.title}</h3>
              <p>{book.description}</p>
              {isPrivate ? (
                <small>
                  <LockKeyhole aria-hidden="true" />
                  仅后台学习整理
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
