import type { Metadata } from "next";
import DaoClassicList from "@/components/dao/DaoClassicList";
import DaoHero from "@/components/dao/DaoHero";
import DaoLearningPath from "@/components/dao/DaoLearningPath";
import { daoClassics, daoLearningPath, daoStudyPrinciples } from "@/data/daoLearning";

export const metadata: Metadata = {
  title: "道家经典学习系统 | 问古书斋",
  description: "道家经典学习系统第一版：道德经、庄子、阴符经、清静经和传统文化文案素材。",
};

export default function DaoPage() {
  return (
    <main className="dao-page">
      <DaoHero />

      <section className="dao-panel dao-principles-panel" aria-labelledby="dao-principles-title">
        <div className="dao-section-head">
          <span>阅读原则</span>
          <h2 id="dao-principles-title">以原文为根，以札记为桥</h2>
          <p>道家经典学习偏文气、修身与哲思，重在慢读、涵泳、省察和整理可引用的表达。</p>
        </div>
        <ul>
          {daoStudyPrinciples.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="dao-panel" aria-labelledby="dao-classics-title">
        <div className="dao-section-head">
          <span>经典内容</span>
          <h2 id="dao-classics-title">道德经、庄子与短篇经典</h2>
        </div>
        <DaoClassicList items={daoClassics} />
      </section>

      <section className="dao-panel" aria-labelledby="dao-path-title">
        <div className="dao-section-head">
          <span>学习路径</span>
          <h2 id="dao-path-title">从原文慢读到文案素材</h2>
        </div>
        <DaoLearningPath steps={daoLearningPath} />
      </section>
    </main>
  );
}
