import { ArrowLeft, ArrowRight, BookOpen, PanelLeft } from "lucide-react";
import Link from "next/link";
import LessonBlockRenderer from "@/components/learning/LessonBlockRenderer";
import LessonSidebar from "@/components/learning/LessonSidebar";
import type { Book, Term } from "@/types/content";
import type { Course, Lesson, Module as CourseModule } from "@/types/learning";

type LessonLayoutProps = {
  course: Course;
  modules: CourseModule[];
  lessons: Lesson[];
  currentLesson: Lesson;
  previousLesson?: Lesson;
  nextLesson?: Lesson;
  terms: Term[];
  relatedBooks: Book[];
};

export default function LessonLayout({ course, modules, lessons, currentLesson, previousLesson, nextLesson, terms, relatedBooks }: LessonLayoutProps) {
  const progressPercent = Math.round((currentLesson.order / lessons.length) * 100);

  return (
    <main className="lesson-learning-page">
      <aside className="lesson-course-nav" aria-label="课程目录">
        <Link className="lesson-course-back" href={`/courses/${course.id}`}>
          <ArrowLeft aria-hidden="true" />
          返回课程
        </Link>
        <div className="lesson-course-title">
          <BookOpen aria-hidden="true" />
          <div>
            <span>{course.title}</span>
            <strong>{course.subtitle}</strong>
          </div>
        </div>

        <nav>
          {modules.map((module) => {
            const moduleLessons = lessons.filter((lesson) => lesson.moduleId === module.id);
            return (
              <section key={module.id}>
                <h2>
                  <PanelLeft aria-hidden="true" />
                  {module.title}
                </h2>
                {moduleLessons.map((lesson) => {
                  const active = lesson.id === currentLesson.id;
                  return (
                    <Link key={lesson.id} href={`/courses/${course.id}/lessons/${lesson.id}`} className={active ? "is-active" : ""} aria-current={active ? "page" : undefined}>
                      <span>{lesson.order}</span>
                      {lesson.title}
                    </Link>
                  );
                })}
              </section>
            );
          })}
        </nav>
      </aside>

      <article className="lesson-content">
        <header className="lesson-content-hero">
          <span>{course.title}</span>
          <h1>{currentLesson.title}</h1>
          <p>{currentLesson.summary}</p>
          <div>
            <em>约 {currentLesson.estimatedMinutes} 分钟</em>
            <em>{currentLesson.blocks.length} 个内容块</em>
          </div>
        </header>

        <div className="lesson-block-stack">
          {currentLesson.blocks.map((block) => (
            <LessonBlockRenderer key={block.id} block={block} terms={terms} />
          ))}
        </div>

        <nav className="lesson-bottom-nav" aria-label="上一课和下一课">
          {previousLesson ? (
            <Link href={`/courses/${course.id}/lessons/${previousLesson.id}`}>
              <ArrowLeft aria-hidden="true" />
              <span>上一课</span>
              <strong>{previousLesson.title}</strong>
            </Link>
          ) : (
            <span className="is-disabled">已是第一课</span>
          )}

          {nextLesson ? (
            <Link href={`/courses/${course.id}/lessons/${nextLesson.id}`} className="is-next">
              <span>下一课</span>
              <strong>{nextLesson.title}</strong>
              <ArrowRight aria-hidden="true" />
            </Link>
          ) : (
            <span className="is-disabled">已是最后一课</span>
          )}
        </nav>
      </article>

      <LessonSidebar
        terms={terms}
        relatedBooks={relatedBooks}
        currentOrder={currentLesson.order}
        totalLessons={lessons.length}
        progressPercent={progressPercent}
      />
    </main>
  );
}
