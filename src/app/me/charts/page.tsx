import type { Metadata } from "next";
import Link from "next/link";
import { Compass, ShieldAlert } from "lucide-react";
import ProfileSummary from "@/components/me/ProfileSummary";
import { meChartRecords, mockMembership, mockUserProfile } from "@/data/userMock";

export const metadata: Metadata = {
  title: "排盘记录 | 问古书斋",
  description: "奇门排盘历史和复盘记录。",
};

export default function MeChartsPage() {
  return (
    <main className="me-page">
      <ProfileSummary user={mockUserProfile} membership={mockMembership} learningDays="28 天" readingProgress="46%" compact />

      <section className="me-panel" aria-labelledby="me-charts-title">
        <div className="me-section-head">
          <span>奇门排盘历史</span>
          <h2 id="me-charts-title">排盘记录与复盘</h2>
          <p>第一阶段只展示 mock 记录。盘面和择时结果仅作传统文化学习与行动参考。</p>
        </div>
        <div className="me-chart-list">
          {meChartRecords.map((record) => (
            <Link key={record.id} href={record.href}>
              <header>
                <Compass aria-hidden="true" />
                <span>{record.level}</span>
                <em>{record.chartTime}</em>
              </header>
              <h3>{record.title}</h3>
              <p>{record.question}</p>
              <small>{record.summary}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="me-disclaimer-panel">
        <ShieldAlert aria-hidden="true" />
        <p>排盘记录用于学习、复盘和行动参考，不替代医学、法律、投资、心理、婚姻等专业意见。</p>
      </section>
    </main>
  );
}
