import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProfileSummary from "@/components/me/ProfileSummary";
import StudyStats from "@/components/me/StudyStats";
import {
  meDashboardStats,
  meRecentCourseItems,
  meStudyProgress,
  meSubjectProgress,
  mockMembership,
  mockUserProfile,
} from "@/data/userMock";

export const metadata: Metadata = {
  title: "学习进度 | 问古书斋",
  description: "各学科学习进度、课程进度和下一步学习建议。",
};

export default function MeProgressPage() {
  return (
    <main className="me-page">
      <ProfileSummary user={mockUserProfile} membership={mockMembership} learningDays="28 天" readingProgress="46%" compact />
      <StudyStats stats={meDashboardStats.slice(0, 3)} />

      <section className="me-panel" aria-labelledby="me-progress-title">
        <div className="me-section-head">
          <span>学科进度</span>
          <h2 id="me-progress-title">按学科复盘学习状态</h2>
        </div>
        <div className="me-subject-progress-list">
          {meSubjectProgress.map((item) => (
            <Link key={item.id} href={item.href} className={`me-subject-progress is-${item.subject}`}>
              <header>
                <span>{item.subjectName}</span>
                <strong>{item.progressPercent}%</strong>
              </header>
              <div className="me-progress-line" aria-label={`${item.subjectName}进度 ${item.progressPercent}%`}>
                <i style={{ width: `${item.progressPercent}%` }} />
              </div>
              <p>{item.currentFocus}</p>
              <small>{item.nextAction}</small>
              <footer>
                <em>
                  {item.completedLessons}/{item.totalLessons} 节
                </em>
                <span>
                  继续学习
                  <ArrowRight aria-hidden="true" />
                </span>
              </footer>
            </Link>
          ))}
        </div>
      </section>

      <section className="me-panel" aria-labelledby="me-course-progress-title">
        <div className="me-section-head">
          <span>课程记录</span>
          <h2 id="me-course-progress-title">最近课程进度</h2>
        </div>
        <div className="me-course-progress-grid">
          {meRecentCourseItems.map((course) => (
            <Link key={course.id} href={course.href}>
              <span>{course.meta}</span>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className="me-progress-line" aria-label={`课程进度 ${course.progressPercent}%`}>
                <i style={{ width: `${course.progressPercent ?? 0}%` }} />
              </div>
            </Link>
          ))}
        </div>
        <p className="me-muted-copy">当前共有 {meStudyProgress.length} 条课程进度 mock 记录，后续接真实学习记录表。</p>
      </section>
    </main>
  );
}
