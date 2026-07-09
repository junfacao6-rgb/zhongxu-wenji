import type { Metadata } from "next";
import CourseCard from "@/components/courses/CourseCard";
import CourseFilters, {
  type CourseAccessFilter,
  type CourseDifficultyFilter,
  type CourseSubjectFilter,
} from "@/components/courses/CourseFilters";
import { courses, lessons } from "@/data/courses";
import type { Course } from "@/types/learning";

export const metadata: Metadata = {
  title: "课程 | 问古书斋",
  description: "按奇门、八字、六爻、梅花、道家经典、易学基础组织传统文化课程。",
};

const progressByCourseId: Record<string, number> = {
  "qimen-intro-course": 18,
  "bazi-intro-course": 8,
  "liuyao-intro-course": 32,
  "meihua-intro-course": 0,
  "dao-intro-course": 12,
  "yixue-intro-course": 45,
};

export default function CoursesPage() {
  const selectedSubject: CourseSubjectFilter = "all";
  const selectedDifficulty: CourseDifficultyFilter = "all";
  const selectedAccess: CourseAccessFilter = "all";
  const filteredCourses = courses.filter((course) => course.isPublished);

  return (
    <main className="courses-page">
      <section className="courses-index-hero">
        <span>课程</span>
        <h1>把古籍、术语和工具整理成可学习的路径</h1>
        <p>
          第一阶段课程使用 mock 数据，先验证课程列表、课时目录、学习进度和详情页结构。
          所有课程草稿后续仍需管理员审核。
        </p>
      </section>

      <CourseFilters selectedSubject={selectedSubject} selectedDifficulty={selectedDifficulty} selectedAccess={selectedAccess} />

      <section className="course-card-grid" aria-label="课程列表">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              lessonCount={getLessonCount(course)}
              progressPercent={progressByCourseId[course.id] ?? 0}
            />
          ))
        ) : (
          <div className="course-empty-state">
            <h2>暂无课程</h2>
            <p>当前 mock 阶段课程数量有限，后续可继续补充学科和章节。</p>
          </div>
        )}
      </section>
    </main>
  );
}

function getLessonCount(course: Course) {
  return lessons.filter((lesson) => lesson.courseId === course.id).length;
}
