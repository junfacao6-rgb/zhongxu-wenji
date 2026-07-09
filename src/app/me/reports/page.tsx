import type { Metadata } from "next";
import ProfileSummary from "@/components/me/ProfileSummary";
import ReportList from "@/components/me/ReportList";
import { meReports, mockMembership, mockUserProfile } from "@/data/userMock";

export const metadata: Metadata = {
  title: "我的报告 | 问古书斋",
  description: "报告历史、报告草稿和私密保存状态。",
};

export default function MeReportsPage() {
  return (
    <main className="me-page">
      <ProfileSummary user={mockUserProfile} membership={mockMembership} learningDays="28 天" readingProgress="46%" compact />
      <ReportList reports={meReports} />
      <section className="me-disclaimer-panel">
        <p>报告内容只作传统文化学习、资料整理与行动参考。所有报告第一阶段均为 mock 或草稿，不作现实专业决策依据。</p>
      </section>
    </main>
  );
}
