import Link from "next/link";
import BookCover from "@/components/site/BookCover";
import type { BookItem } from "@/lib/site-content";
import type { WenguReadingRecord } from "@/lib/wengu-reading-progress";
import { getBookAttribution, getBookPrimaryReadHref } from "@/lib/wengu-library";

const coverTones = ["teal", "cinnabar", "indigo", "ochre", "earth"] as const;
const coverImages: Record<string, string> = {
  "ziping-zhenquan": "/images/wengu/books/ziping-zhenquan.webp",
  "ditiansui-chanwei": "/images/wengu/books/ditiansui.webp",
  "sanming-tonghui": "/images/wengu/books/sanming-tonghui.webp",
  "yuanhai-ziping": "/images/wengu/books/ziping-zhenquan.webp",
};

function getDisplayBookTitle(title: string) {
  return title.replace("导读", "").replace("白话评注", "").replace("阐微", "").trim();
}

type WenguShelfRowProps = {
  title: string;
  description?: string;
  books: BookItem[];
  recordsByBookId?: Record<string, WenguReadingRecord>;
};

export default function WenguShelfRow({ title, description, books, recordsByBookId = {} }: WenguShelfRowProps) {
  return (
    <section className="wen-gu-shelf-row" aria-label={title}>
      <div className="wen-gu-shelf-row-head">
        <div>
          <h3>{title}</h3>
          {description ? <p>{description}</p> : null}
        </div>
        <span>{books.length} 本</span>
      </div>

      <div className="wen-gu-shelf-scroll">
        {books.map((book, index) => {
          const record = recordsByBookId[book.id];
          const progress = record?.progressPercent;
          return (
            <article className="wen-gu-shelf-book" key={book.id}>
              <Link href={`/library/${book.id}`} className="wen-gu-shelf-cover-link" aria-label={`查看${book.title}`}>
                <BookCover
                  title={getDisplayBookTitle(book.title)}
                  tone={coverTones[index % coverTones.length]}
                  imageSrc={coverImages[book.id]}
                />
              </Link>
              <div className="wen-gu-shelf-book-copy">
                <Link href={`/library/${book.id}`}>《{getDisplayBookTitle(book.title)}》</Link>
                <small>{getBookAttribution(book)}</small>
                {typeof progress === "number" ? (
                  <div className="wen-gu-shelf-progress" aria-label={`阅读进度 ${progress}%`}>
                    <i style={{ width: `${progress}%` }} />
                  </div>
                ) : null}
                <Link href={getBookPrimaryReadHref(book)} className="wen-gu-shelf-read">
                  开始阅读
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
