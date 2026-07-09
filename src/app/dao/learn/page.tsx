import type { Metadata } from "next";
import DaoClassicList from "@/components/dao/DaoClassicList";
import DaoHero from "@/components/dao/DaoHero";
import DaoLearningPath from "@/components/dao/DaoLearningPath";
import { daoClassics, daoLearningPath, daoStudyPrinciples } from "@/data/daoLearning";

export const metadata: Metadata = {
  title: "道家经典学习路径 | 问古书斋",
  description: "原文慢读、白话札记、核心思想、修身应用和传统文化文案素材整理。",
};

export default function DaoLearnPage() {
  return (
    <main className="dao-page">
      <DaoHero compact />

      <section className="dao-panel" aria-labelledby="dao-learn-path-title">
        <div className="dao-section-head">
          <span>阅读路径</span>
          <h2 id="dao-learn-path-title">五步建立道家经典研读节奏</h2>
          <p>从原文到札记，再到修身省察与合规文案素材整理。</p>
        </div>
        <DaoLearningPath steps={daoLearningPath} />
      </section>

      <section className="dao-panel dao-principles-panel" aria-labelledby="dao-learn-principles-title">
        <div className="dao-section-head">
          <span>阅读纪律</span>
          <h2 id="dao-learn-principles-title">不急，不玄，不作承诺</h2>
        </div>
        <ul>
          {daoStudyPrinciples.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="dao-panel" aria-labelledby="dao-learn-classics-title">
        <div className="dao-section-head">
          <span>经典索引</span>
          <h2 id="dao-learn-classics-title">可进入的经典与素材</h2>
        </div>
        <DaoClassicList items={daoClassics} />
      </section>
    </main>
  );
}
