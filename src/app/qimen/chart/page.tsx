import type { Metadata } from "next";
import NinePalaceChart from "@/components/qimen/NinePalaceChart";
import QimenChartMeta from "@/components/qimen/QimenChartMeta";
import { qimenMockChart } from "@/data/qimenMock";

export const metadata: Metadata = {
  title: "专业排盘 | 奇门问时 | 问古书斋",
  description: "奇门九宫 mock 盘，展示宫位、门星神干、状态标签和宫位详情。",
};

const qimenChartMockMeta = {
  fourPillars: "丙午年 乙未月 壬申日 乙巳时",
  solarTerm: "小暑后 · mock",
  xunShou: "甲戌己",
  emptyBranches: "戌亥",
  horseStar: "寅",
};

export default function QimenChartPage() {
  return (
    <main className="qimen-chart-page">
      <section className="qimen-chart-hero">
        <span>专业排盘</span>
        <h1>奇门九宫盘</h1>
        <p>第一阶段只展示 mock 盘，不做真实排盘算法。点击任一宫位，可查看门、星、神、干、状态解释和学习参考。</p>
      </section>

      <QimenChartMeta chart={qimenMockChart} {...qimenChartMockMeta} />
      <NinePalaceChart chart={qimenMockChart} />
    </main>
  );
}
