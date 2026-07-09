import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MeihuaBookGrid from "@/components/meihua/MeihuaBookGrid";
import MeihuaCaseCard from "@/components/meihua/MeihuaCaseCard";
import MeihuaHero from "@/components/meihua/MeihuaHero";
import MeihuaLearningPath from "@/components/meihua/MeihuaLearningPath";
import MeihuaTermGrid from "@/components/meihua/MeihuaTermGrid";
import { meihuaCases, meihuaLearningPath, meihuaStudyPrinciples, meihuaTermCards } from "@/data/meihuaLearning";
import { platformMockBooks } from "@/data/books";

export const metadata: Metadata = {
  title: "梅花易数学习系统 | 问古书斋",
  description: "梅花易数学习系统第一版：学习路径、术语卡、推荐书籍和案例卡片。",
};

export default function MeihuaPage() {
  const meihuaBooks = platformMockBooks.filter((book) => book.subject === "meihua").slice(0, 4);

  return (
    <main className="meihua-page">
      <MeihuaHero />

      <section className="meihua-panel meihua-principles-panel" aria-labelledby="meihua-principles-title">
        <div className="meihua-section-head">
          <span>学习原则</span>
          <h2 id="meihua-principles-title">取象有来处，判断要复盘</h2>
          <p>梅花易数学习重点在起卦记录、体用分明、互变清楚、外应有据和案例复盘。</p>
        </div>
        <ul>
          {meihuaStudyPrinciples.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="meihua-panel" aria-labelledby="meihua-path-title">
        <div className="meihua-section-head">
          <span>学习路径</span>
          <h2 id="meihua-path-title">从八卦象数走到案例</h2>
          <Link href="/meihua/learn">
            查看完整路径
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <MeihuaLearningPath steps={meihuaLearningPath.slice(0, 6)} compact />
      </section>

      <section className="meihua-panel" aria-labelledby="meihua-terms-title">
        <div className="meihua-section-head">
          <span>术语卡</span>
          <h2 id="meihua-terms-title">象数、体用与外应</h2>
        </div>
        <MeihuaTermGrid terms={meihuaTermCards} />
      </section>

      <section className="meihua-panel" aria-labelledby="meihua-books-title">
        <div className="meihua-section-head">
          <span>推荐书籍</span>
          <h2 id="meihua-books-title">从入门讲义到原典</h2>
        </div>
        <MeihuaBookGrid books={meihuaBooks} />
      </section>

      <section className="meihua-panel" aria-labelledby="meihua-cases-title">
        <div className="meihua-section-head">
          <span>案例卡片</span>
          <h2 id="meihua-cases-title">记录触机、体用、互变和反馈</h2>
          <Link href="/meihua/cases">
            查看全部案例
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <div className="meihua-case-grid">
          {meihuaCases.slice(0, 2).map((item) => (
            <MeihuaCaseCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
