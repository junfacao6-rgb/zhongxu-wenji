import { ArrowRight, GraduationCap } from "lucide-react";
import Link from "next/link";
import type { Course } from "@/types/learning";

type RelatedCoursesProps = {
  courses: Course[];
};

export default function RelatedCourses({ courses }: RelatedCoursesProps) {
  return (
    <section className="book-detail-card book-related-card" aria-labelledby="book-courses-title">
      <div className="book-section-head">
        <span>课程衔接</span>
        <h2 id="book-courses-title">相关课程</h2>
      </div>

      {courses.length > 0 ? (
        <div className="book-course-list">
          {courses.map((course) => (
            <Link key={course.id} className="book-course-card" href={`/courses/${course.id}`}>
              <span>
                <GraduationCap aria-hidden="true" />
                {course.difficulty}
              </span>
              <strong>{course.title}</strong>
              <p>{course.subtitle}</p>
              <small>
                查看课程
                <ArrowRight aria-hidden="true" />
              </small>
            </Link>
          ))}
        </div>
      ) : (
        <p className="book-empty-copy">相关课程正在整理中。</p>
      )}
    </section>
  );
}
