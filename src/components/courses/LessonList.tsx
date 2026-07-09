import { Clock3, PlayCircle } from "lucide-react";
import Link from "next/link";
import type { Lesson } from "@/types/learning";

type LessonListProps = {
  lessons: Lesson[];
};

export default function LessonList({ lessons }: LessonListProps) {
  return (
    <section id="lesson-list" className="course-detail-card" aria-labelledby="lesson-list-title">
      <div className="course-section-head">
        <span>课时列表</span>
        <h2 id="lesson-list-title">从基础到复盘</h2>
      </div>

      <div className="lesson-list">
        {lessons.map((lesson) => (
          <article key={lesson.id}>
            <Link href={`/courses/${lesson.courseId}/lessons/${lesson.id}`}>
              <div className="lesson-order">
                <PlayCircle aria-hidden="true" />
                <span>{lesson.order}</span>
              </div>
              <div>
                <h3>{lesson.title}</h3>
                <p>{lesson.summary}</p>
                <small>
                  <Clock3 aria-hidden="true" />
                  约 {lesson.estimatedMinutes} 分钟 · {lesson.blocks.length} 个内容块
                </small>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
