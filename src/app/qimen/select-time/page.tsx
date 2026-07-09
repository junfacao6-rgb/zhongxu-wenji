import type { Metadata } from "next";
import EventTimingPanel from "@/components/qimen/EventTimingPanel";

export const metadata: Metadata = {
  title: "一事择时 | 奇门问时 | 问古书斋",
  description: "基于 mock 奇门盘和事件规则库生成一事择时参考。",
};

export default function QimenSelectTimePage() {
  return (
    <main className="qimen-select-time-page">
      <section className="qimen-select-time-hero">
        <span>一事择时</span>
        <h1>一事一问，先定事项，再取时段参考</h1>
        <p>
          选择事件分类、具体事项和目标日期后，系统会用 mock 盘与事件规则库输出推荐时辰、慎用时辰、盘理依据和行动建议。
          第一阶段不做真实日期排盘。
        </p>
      </section>

      <EventTimingPanel />
    </main>
  );
}
