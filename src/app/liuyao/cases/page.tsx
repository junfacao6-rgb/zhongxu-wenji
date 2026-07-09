import type { Metadata } from "next";
import LiuyaoCaseCard from "@/components/liuyao/LiuyaoCaseCard";
import LiuyaoHero from "@/components/liuyao/LiuyaoHero";
import { liuyaoLearningCases } from "@/data/liuyaoMock";

export const metadata: Metadata = {
  title: "六爻案例学习 | 问古书斋",
  description: "求财、求职、感情、失物、考试五个六爻学习 mock 案例。",
};

export default function LiuyaoCasesPage() {
  return (
    <main className="liuyao-page">
      <LiuyaoHero compact />

      <section className="liuyao-panel" aria-labelledby="liuyao-cases-page-title">
        <div className="liuyao-section-head">
          <span>案例学习</span>
          <h2 id="liuyao-cases-page-title">五个问事案例</h2>
          <p>每个案例展示本卦、变卦、世应、用神、动爻和学习重点，不输出确定性结论。</p>
        </div>
        <div className="liuyao-case-grid">
          {liuyaoLearningCases.map((item) => (
            <LiuyaoCaseCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
