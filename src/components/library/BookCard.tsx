import { Eye, LockKeyhole, UsersRound } from "lucide-react";
import Link from "next/link";
import BookCover from "@/components/site/BookCover";
import type { Book } from "@/types/content";
import type { CopyrightStatus, SubjectKey } from "@/types/platform";

const subjectLabels: Record<SubjectKey, string> = {
  qimen: "奇门",
  bazi: "八字",
  liuyao: "六爻",
  meihua: "梅花",
  dao: "道家",
  yixue: "易学基础",
};

const copyrightLabels: Record<CopyrightStatus, string> = {
  public_domain: "公版",
  self_owned: "自有",
  authorized: "授权",
  excerpt_only: "摘录",
  private_study: "私密",
  hidden: "私密",
};

const copyrightTone: Record<CopyrightStatus, string> = {
  public_domain: "is-public",
  self_owned: "is-owned",
  authorized: "is-authorized",
  excerpt_only: "is-excerpt",
  private_study: "is-private",
  hidden: "is-private",
};

const availableCoverImages = new Set([
  "/images/wengu/books/ditiansui.webp",
  "/images/wengu/books/qiongtong-baojian.webp",
  "/images/wengu/books/sanming-tonghui.webp",
  "/images/wengu/books/ziping-zhenquan.webp",
]);

function formatReadCount(readCount: number) {
  if (readCount >= 10000) return `${(readCount / 10000).toFixed(1)} 万`;
  return `${readCount}`;
}

export default function BookCard({ book }: { book: Book }) {
  const isPrivate = book.visibility === "private" || book.visibility === "hidden" || book.copyrightStatus === "private_study" || book.copyrightStatus === "hidden";
  const coverImage = book.coverUrl && availableCoverImages.has(book.coverUrl) ? book.coverUrl : undefined;

  return (
    <article className={`library-book-card ${isPrivate ? "is-private" : ""}`} id={book.id}>
      <div className="library-book-cover">
        <BookCover
          imageSrc={coverImage}
          title={book.title}
          tone={book.subject === "qimen" ? "indigo" : book.subject === "bazi" ? "cinnabar" : book.subject === "liuyao" ? "ochre" : book.subject === "meihua" ? "teal" : "earth"}
        />
        <span className={`library-copyright-badge ${copyrightTone[book.copyrightStatus]}`}>
          {copyrightLabels[book.copyrightStatus]}
        </span>
      </div>

      <div className="library-book-copy">
        <div className="library-book-meta-row">
          <span>{subjectLabels[book.subject]}</span>
          <span>{book.difficulty}</span>
        </div>
        <h3>{book.title}</h3>
        <p className="library-book-author">{book.author || "作者待考"} / {book.dynasty || "年代待考"}</p>
        <p className="library-book-category">{book.category}</p>
        <p className="library-book-description">{book.description}</p>
        <div className="library-book-footer">
          <span className="library-read-count">
            <UsersRound aria-hidden="true" className="h-4 w-4" />
            {formatReadCount(book.readCount)} 人读过
          </span>
          {isPrivate ? (
            <span className="library-private-action">
              <LockKeyhole aria-hidden="true" className="h-4 w-4" />
              仅管理员可见
            </span>
          ) : (
            <Link className="library-detail-link" href={`/book/${book.id}`}>
              <Eye aria-hidden="true" className="h-4 w-4" />
              查看详情
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
