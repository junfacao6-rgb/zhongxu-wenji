import type { Metadata } from "next";
import MeihuaCaseCard from "@/components/meihua/MeihuaCaseCard";
import MeihuaHero from "@/components/meihua/MeihuaHero";
import { meihuaCases } from "@/data/meihuaLearning";

export const metadata: Metadata = {
  title: "梅花易数案例学习 | 问古书斋",
  description: "梅花易数案例卡：触机、起卦法、体用、互卦、变卦、外应和学习重点。",
};

export default function MeihuaCasesPage() {
  return (
    <main className="meihua-page">
      <MeihuaHero compact />

      <section className="meihua-panel" aria-labelledby="meihua-cases-page-title">
        <div className="meihua-section-head">
          <span>案例学习</span>
          <h2 id="meihua-cases-page-title">触机、体用与复盘</h2>
          <p>案例只作学习结构参考，重点记录来源、过程和反馈。</p>
        </div>
        <div className="meihua-case-grid">
          {meihuaCases.map((item) => (
            <MeihuaCaseCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
