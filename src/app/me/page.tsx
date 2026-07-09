import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bookmark, FileText, Upload } from "lucide-react";
import NoteList from "@/components/me/NoteList";
import ProfileSummary from "@/components/me/ProfileSummary";
import RecentItems from "@/components/me/RecentItems";
import ReportList from "@/components/me/ReportList";
import StudyStats from "@/components/me/StudyStats";
import {
  meBookmarkItems,
  meChartRecentItems,
  meDashboardStats,
  meFavoriteBooks,
  meRecentCourseItems,
  meRecentReadingItems,
  meReports,
  meReportRecentItems,
  meUploads,
  meNotes,
  mockMembership,
  mockUserProfile,
} from "@/data/userMock";

export const metadata: Metadata = {
  title: "我的书斋 | 问古书斋",
  description: "我的书斋第一版：学习进度、笔记、收藏、报告、排盘记录和上传资料。",
};

export default function MeHomePage() {
  return (
    <main className="me-page me-desk-page">
      <section className="me-desk-scroll" aria-label="我的书斋案头画卷">
        <img src="/images/hero-scroll-reference-crop-20260705.webp" alt="" />
        <div className="me-desk-scroll-note" aria-hidden="true">
          <span>我的书斋</span>
          <small>读书案头</small>
        </div>
      </section>

      <ProfileSummary user={mockUserProfile} membership={mockMembership} learningDays="28 天" readingProgress="46%" />
      <StudyStats
        stats={[
          { ...meDashboardStats[0], href: "/me/progress" },
          { ...meDashboardStats[1], href: "/me/books" },
          { ...meDashboardStats[2], href: "/me/notes" },
          { ...meDashboardStats[3], href: "/me/reports" },
        ]}
      />

      <div className="me-dashboard-grid">
        <RecentItems title="最近阅读" subtitle="阅读进度" items={meRecentReadingItems} />
        <RecentItems title="最近课程" subtitle="课程学习" items={meRecentCourseItems} />
        <RecentItems title="最近排盘" subtitle="奇门记录" items={meChartRecentItems.slice(0, 2)} />
        <RecentItems title="最近报告" subtitle="报告草稿" items={meReportRecentItems.slice(0, 2)} />
      </div>

      <div className="me-dashboard-grid is-wide">
        <NoteList notes={meNotes.slice(0, 3)} />
        <ReportList reports={meReports.slice(0, 2)} />
      </div>

      <section className="me-panel me-quick-grid" aria-labelledby="me-quick-title">
        <div className="me-section-head">
          <span>书斋入口</span>
          <h2 id="me-quick-title">收藏、上传与私密资料</h2>
        </div>
        <Link href="/me/books">
          <Bookmark aria-hidden="true" />
          <strong>我的收藏</strong>
          <span>{meFavoriteBooks.length + meBookmarkItems.length} 条收藏与书籍记录</span>
          <ArrowRight aria-hidden="true" />
        </Link>
        <Link href="/me/uploads">
          <Upload aria-hidden="true" />
          <strong>我的上传</strong>
          <span>{meUploads.length} 份资料，默认私密保存</span>
          <ArrowRight aria-hidden="true" />
        </Link>
        <Link href="/me/reports">
          <FileText aria-hidden="true" />
          <strong>我的报告</strong>
          <span>{meReports.length} 份报告和草稿</span>
          <ArrowRight aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
