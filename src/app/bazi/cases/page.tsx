import type { Metadata } from "next";
import BaziCaseCard from "@/components/bazi/BaziCaseCard";
import BaziHero from "@/components/bazi/BaziHero";
import { baziLearningCases } from "@/data/baziMock";

export const metadata: Metadata = {
  title: "八字案例学习 | 问古书斋",
  description: "身强财旺、身弱杀旺、寒木向阳、火炎土燥、食伤生财五个八字学习 mock 案例。",
};

export default function BaziCasesPage() {
  return (
    <main className="bazi-page">
      <BaziHero compact />

      <section className="bazi-panel" aria-labelledby="bazi-cases-page-title">
        <div className="bazi-section-head">
          <span>案例学习</span>
          <h2 id="bazi-cases-page-title">五个结构案例</h2>
          <p>每个案例只展示四柱 mock、结构提示和学习重点，不做完整断命。</p>
        </div>
        <div className="bazi-case-grid">
          {baziLearningCases.map((item) => (
            <BaziCaseCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
