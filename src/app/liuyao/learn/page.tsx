import type { Metadata } from "next";
import LiuyaoHero from "@/components/liuyao/LiuyaoHero";
import LiuyaoLearningPath from "@/components/liuyao/LiuyaoLearningPath";
import LiuyaoTermGrid from "@/components/liuyao/LiuyaoTermGrid";
import { liuyaoLearningPath, liuyaoStudyPrinciples, liuyaoTermCards } from "@/data/liuyaoLearning";

export const metadata: Metadata = {
  title: "六爻学习路径 | 问古书斋",
  description: "从八卦基础、起卦、装卦、世应、六亲、用神到案例复盘的六爻学习路径。",
};

export default function LiuyaoLearnPage() {
  return (
    <main className="liuyao-page">
      <LiuyaoHero compact />

      <section className="liuyao-panel" aria-labelledby="liuyao-full-path-title">
        <div className="liuyao-section-head">
          <span>完整路径</span>
          <h2 id="liuyao-full-path-title">十五步建立六爻问事结构</h2>
          <p>每一步都围绕问题边界、取用依据和复盘记录，不输出确定性结论。</p>
        </div>
        <LiuyaoLearningPath steps={liuyaoLearningPath} />
      </section>

      <section className="liuyao-panel liuyao-principles-panel" aria-labelledby="liuyao-learn-principles-title">
        <div className="liuyao-section-head">
          <span>学习纪律</span>
          <h2 id="liuyao-learn-principles-title">从所问到用神</h2>
        </div>
        <ul>
          {liuyaoStudyPrinciples.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="liuyao-panel" aria-labelledby="liuyao-learn-terms-title">
        <div className="liuyao-section-head">
          <span>关键术语</span>
          <h2 id="liuyao-learn-terms-title">路径中的核心概念</h2>
        </div>
        <LiuyaoTermGrid terms={liuyaoTermCards} />
      </section>
    </main>
  );
}
