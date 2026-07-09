import { ArrowRight, BookOpen, GraduationCap, Wrench } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Book } from "@/types/content";
import type { Course } from "@/types/learning";

export type RelatedTool = {
  title: string;
  href: string;
  summary: string;
};

type RelatedSourcesProps = {
  books: Book[];
  courses: Course[];
  tools: RelatedTool[];
};

export default function RelatedSources({ books, courses, tools }: RelatedSourcesProps) {
  return (
    <section className="term-detail-card term-related-sources" aria-labelledby="term-sources-title">
      <div className="term-section-head">
        <span>延伸学习</span>
        <h2 id="term-sources-title">相关古籍、课程与工具</h2>
      </div>

      <div className="term-source-columns">
        <SourceColumn title="相关古籍" empty="相关古籍正在整理中。">
          {books.map((book) => (
            <Link key={book.id} href={`/book/${book.id}`}>
              <BookOpen aria-hidden="true" />
              <strong>{book.title}</strong>
              <p>{book.subtitle}</p>
              <small>
                查看书籍
                <ArrowRight aria-hidden="true" />
              </small>
            </Link>
          ))}
        </SourceColumn>

        <SourceColumn title="相关课程" empty="相关课程正在整理中。">
          {courses.map((course) => (
            <Link key={course.id} href={`/courses/${course.id}`}>
              <GraduationCap aria-hidden="true" />
              <strong>{course.title}</strong>
              <p>{course.subtitle}</p>
              <small>
                查看课程
                <ArrowRight aria-hidden="true" />
              </small>
            </Link>
          ))}
        </SourceColumn>

        <SourceColumn title="相关工具" empty="相关工具正在整理中。">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href}>
              <Wrench aria-hidden="true" />
              <strong>{tool.title}</strong>
              <p>{tool.summary}</p>
              <small>
                进入工具
                <ArrowRight aria-hidden="true" />
              </small>
            </Link>
          ))}
        </SourceColumn>
      </div>
    </section>
  );
}

function SourceColumn({ title, empty, children }: { title: string; empty: string; children: ReactNode }) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : Boolean(children);

  return (
    <div className="term-source-column">
      <h3>{title}</h3>
      <div>{hasChildren ? children : <p className="term-empty-copy">{empty}</p>}</div>
    </div>
  );
}
