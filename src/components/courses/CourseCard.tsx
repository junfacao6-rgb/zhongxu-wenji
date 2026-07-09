import { ArrowRight, BookOpen, CheckCircle2, LockKeyhole, UsersRound } from "lucide-react";
import Link from "next/link";
import type { Course } from "@/types/learning";
import type { SubjectKey, Visibility } from "@/types/platform";

type CourseCardProps = {
  course: Course;
  lessonCount: number;
  progressPercent: number;
};

const subjectLabels: Record<SubjectKey, string> = {
  qimen: "奇门",
  bazi: "八字",
  liuyao: "六爻",
  meihua: "梅花",
  dao: "道家",
  yixue: "易学基础",
};

const accessCopy: Record<Visibility, { label: string; icon: typeof BookOpen }> = {
  public: { label: "免费", icon: BookOpen },
  members: { label: "会员", icon: UsersRound },
  course: { label: "课程", icon: CheckCircle2 },
  private: { label: "私密", icon: LockKeyhole },
  hidden: { label: "隐藏", icon: LockKeyhole },
};

export default function CourseCard({ course, lessonCount, progressPercent }: CourseCardProps) {
  const access = accessCopy[course.visibility];
  const AccessIcon = access.icon;

  return (
    <article className={`course-card course-card-${course.subject}`}>
      <div className="course-card-head">
        <span>{subjectLabels[course.subject]}</span>
        <em>
          <AccessIcon aria-hidden="true" />
          {access.label}
        </em>
      </div>

      <div className="course-card-copy">
        <h2>{course.title}</h2>
        <p>{course.description}</p>
      </div>

      <dl className="course-card-meta">
        <div>
          <dt>难度</dt>
          <dd>{course.difficulty}</dd>
        </div>
        <div>
          <dt>课时</dt>
          <dd>{lessonCount}</dd>
        </div>
      </dl>

      <div className="course-card-progress" aria-label={`${course.title} 学习进度 ${progressPercent}%`}>
        <div>
          <span>学习进度</span>
          <strong>{progressPercent}%</strong>
        </div>
        <progress value={progressPercent} max={100} />
      </div>

      <Link href={`/courses/${course.id}`}>
        进入课程
        <ArrowRight aria-hidden="true" />
      </Link>
    </article>
  );
}
