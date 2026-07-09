import type { Metadata } from "next";
import MeihuaHero from "@/components/meihua/MeihuaHero";
import MeihuaLearningPath from "@/components/meihua/MeihuaLearningPath";
import MeihuaTermGrid from "@/components/meihua/MeihuaTermGrid";
import { meihuaLearningPath, meihuaStudyPrinciples, meihuaTermCards } from "@/data/meihuaLearning";

export const metadata: Metadata = {
  title: "梅花易数学习路径 | 问古书斋",
  description: "先后天八卦、起卦法、体用、互卦、变卦、五行生克、外应、数字取象和案例。",
};

export default function MeihuaLearnPage() {
  return (
    <main className="meihua-page">
      <MeihuaHero compact />

      <section className="meihua-panel" aria-labelledby="meihua-full-path-title">
        <div className="meihua-section-head">
          <span>完整路径</span>
          <h2 id="meihua-full-path-title">九步建立梅花学习框架</h2>
          <p>每一步都要求记录取象来源和复盘反馈，减少凭印象硬断。</p>
        </div>
        <MeihuaLearningPath steps={meihuaLearningPath} />
      </section>

      <section className="meihua-panel meihua-principles-panel" aria-labelledby="meihua-learn-principles-title">
        <div className="meihua-section-head">
          <span>学习纪律</span>
          <h2 id="meihua-learn-principles-title">从触机到复盘</h2>
        </div>
        <ul>
          {meihuaStudyPrinciples.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="meihua-panel" aria-labelledby="meihua-learn-terms-title">
        <div className="meihua-section-head">
          <span>关键术语</span>
          <h2 id="meihua-learn-terms-title">路径中的核心概念</h2>
        </div>
        <MeihuaTermGrid terms={meihuaTermCards} />
      </section>
    </main>
  );
}
