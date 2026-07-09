import type { Metadata } from "next";
import BaziHero from "@/components/bazi/BaziHero";
import BaziLearningPath from "@/components/bazi/BaziLearningPath";
import BaziTermGrid from "@/components/bazi/BaziTermGrid";
import { baziLearningPath, baziStudyPrinciples, baziTermCards } from "@/data/baziLearning";

export const metadata: Metadata = {
  title: "八字学习路径 | 问古书斋",
  description: "从阴阳五行、天干地支、十神、藏干到原局与运年综合判断的八字学习路径。",
};

export default function BaziLearnPage() {
  return (
    <main className="bazi-page">
      <BaziHero compact />

      <section className="bazi-panel" aria-labelledby="bazi-full-path-title">
        <div className="bazi-section-head">
          <span>完整路径</span>
          <h2 id="bazi-full-path-title">十三步建立八字结构判断</h2>
          <p>每一步都围绕可解释、可复盘的结构语言，不写浅层鸡汤。</p>
        </div>
        <BaziLearningPath steps={baziLearningPath} />
      </section>

      <section className="bazi-panel bazi-principles-panel" aria-labelledby="bazi-learn-principles-title">
        <div className="bazi-section-head">
          <span>学习纪律</span>
          <h2 id="bazi-learn-principles-title">从条件到判断</h2>
        </div>
        <ul>
          {baziStudyPrinciples.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="bazi-panel" aria-labelledby="bazi-learn-terms-title">
        <div className="bazi-section-head">
          <span>关键术语</span>
          <h2 id="bazi-learn-terms-title">路径中的核心概念</h2>
        </div>
        <BaziTermGrid terms={baziTermCards} />
      </section>
    </main>
  );
}
