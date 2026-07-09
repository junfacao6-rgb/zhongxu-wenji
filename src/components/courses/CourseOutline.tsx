import { ListTree } from "lucide-react";
import type { Lesson, Module as CourseModule } from "@/types/learning";

type CourseOutlineProps = {
  modules: CourseModule[];
  lessons: Lesson[];
};

export default function CourseOutline({ modules, lessons }: CourseOutlineProps) {
  return (
    <section className="course-detail-card" aria-labelledby="course-outline-title">
      <div className="course-section-head">
        <span>模块目录</span>
        <h2 id="course-outline-title">学习结构</h2>
      </div>

      <div className="course-outline-list">
        {modules.map((module) => {
          const moduleLessons = lessons.filter((lesson) => lesson.moduleId === module.id).sort((a, b) => a.order - b.order);
          return (
            <article key={module.id}>
              <div>
                <ListTree aria-hidden="true" />
                <span>模块 {module.order}</span>
              </div>
              <h3>{module.title}</h3>
              <p>{module.summary}</p>
              <ol>
                {moduleLessons.map((lesson) => (
                  <li key={lesson.id}>{lesson.title}</li>
                ))}
              </ol>
            </article>
          );
        })}
      </div>
    </section>
  );
}
