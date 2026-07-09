import { ArrowRight, BookOpen, CheckCircle2, UsersRound } from "lucide-react";
import Link from "next/link";
import type { Course } from "@/types/learning";

type CourseHeroProps = {
  course: Course;
  subjectName: string;
  lessonCount: number;
  moduleCount: number;
  progressPercent: number;
};

const visibilityLabel = {
  public: "免费课程",
  members: "会员课程",
  course: "课程学员可见",
  private: "私密课程",
  hidden: "隐藏课程",
};

export default function CourseHero({ course, subjectName, lessonCount, moduleCount, progressPercent }: CourseHeroProps) {
  return (
    <section className={`course-hero course-hero-${course.subject}`}>
      <div className="course-hero-copy">
        <span>{subjectName} · {visibilityLabel[course.visibility]}</span>
        <h1>{course.title}</h1>
        <p className="course-hero-subtitle">{course.subtitle}</p>
        <p>{course.description}</p>
        <div className="course-hero-actions">
          <Link href="#lesson-list">
            <BookOpen aria-hidden="true" />
            开始学习
          </Link>
          <Link href="/courses" className="is-secondary">
            返回课程
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="course-hero-panel" aria-label="课程概况">
        <div>
          <CheckCircle2 aria-hidden="true" />
          <span>难度</span>
          <strong>{course.difficulty}</strong>
        </div>
        <div>
          <BookOpen aria-hidden="true" />
          <span>课时</span>
          <strong>{lessonCount}</strong>
        </div>
        <div>
          <UsersRound aria-hidden="true" />
          <span>模块</span>
          <strong>{moduleCount}</strong>
        </div>
        <div className="is-wide">
          <span>学习进度</span>
          <strong>{progressPercent}%</strong>
          <progress value={progressPercent} max={100} />
        </div>
      </div>
    </section>
  );
}
