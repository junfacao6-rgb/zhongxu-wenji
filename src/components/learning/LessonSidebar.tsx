import { Bookmark, BookOpen, NotebookPen } from "lucide-react";
import Link from "next/link";
import LessonProgress from "@/components/learning/LessonProgress";
import type { Book, Term } from "@/types/content";

type LessonSidebarProps = {
  terms: Term[];
  relatedBooks: Book[];
  currentOrder: number;
  totalLessons: number;
  progressPercent: number;
};

export default function LessonSidebar({ terms, relatedBooks, currentOrder, totalLessons, progressPercent }: LessonSidebarProps) {
  return (
    <aside className="lesson-sidebar" aria-label="学习辅助">
      <LessonProgress currentOrder={currentOrder} totalLessons={totalLessons} progressPercent={progressPercent} />

      <section className="lesson-assist-card">
        <div className="lesson-assist-head">
          <BookOpen aria-hidden="true" />
          <h2>本课术语</h2>
        </div>
        <div className="lesson-sidebar-terms">
          {terms.map((term) => (
            <Link key={term.id} href={`/terms/${term.id}`}>
              {term.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="lesson-assist-card">
        <div className="lesson-assist-head">
          <BookOpen aria-hidden="true" />
          <h2>相关古籍</h2>
        </div>
        <div className="lesson-sidebar-books">
          {relatedBooks.map((book) => (
            <Link key={book.id} href={`/book/${book.id}`}>
              <strong>{book.title}</strong>
              <span>{book.category}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="lesson-assist-card">
        <div className="lesson-assist-head">
          <NotebookPen aria-hidden="true" />
          <h2>我的笔记</h2>
        </div>
        <textarea readOnly rows={5} value="第一阶段为笔记 UI 占位。后续接入我的书斋后，可保存本课笔记、标签和复盘记录。" />
      </section>

      <section className="lesson-assist-card lesson-favorite-card">
        <button type="button">
          <Bookmark aria-hidden="true" />
          收藏本课
        </button>
      </section>
    </aside>
  );
}
