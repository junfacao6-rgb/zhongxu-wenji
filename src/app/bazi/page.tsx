import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BaziBookGrid from "@/components/bazi/BaziBookGrid";
import BaziCaseCard from "@/components/bazi/BaziCaseCard";
import BaziChartPlaceholder from "@/components/bazi/BaziChartPlaceholder";
import BaziHero from "@/components/bazi/BaziHero";
import BaziLearningPath from "@/components/bazi/BaziLearningPath";
import BaziTermGrid from "@/components/bazi/BaziTermGrid";
import { baziLearningCases } from "@/data/baziMock";
import { baziLearningPath, baziStudyPrinciples, baziTermCards } from "@/data/baziLearning";
import { platformMockBooks } from "@/data/books";

export const metadata: Metadata = {
  title: "八字学习系统 | 问古书斋",
  description: "八字学习系统第一版：学习路径、术语卡、推荐书籍、案例卡片和排盘占位。",
};

export default function BaziPage() {
  const baziBooks = platformMockBooks.filter((book) => book.subject === "bazi").slice(0, 4);

  return (
    <main className="bazi-page">
      <BaziHero />

      <section className="bazi-panel bazi-principles-panel" aria-labelledby="bazi-principles-title">
        <div className="bazi-section-head">
          <span>学习原则</span>
          <h2 id="bazi-principles-title">八字先学结构，不急于断语</h2>
          <p>围绕月令、气势、寒暖燥湿、格局、调候、清浊与用神成败建立判断框架。</p>
        </div>
        <ul>
          {baziStudyPrinciples.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="bazi-panel" aria-labelledby="bazi-path-title">
        <div className="bazi-section-head">
          <span>学习路径</span>
          <h2 id="bazi-path-title">从基础语言走到运年综合</h2>
          <Link href="/bazi/learn">
            查看完整路径
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <BaziLearningPath steps={baziLearningPath.slice(0, 6)} compact />
      </section>

      <section className="bazi-panel" aria-labelledby="bazi-terms-title">
        <div className="bazi-section-head">
          <span>术语卡</span>
          <h2 id="bazi-terms-title">先把结构词汇说清楚</h2>
        </div>
        <BaziTermGrid terms={baziTermCards} />
      </section>

      <section className="bazi-panel" aria-labelledby="bazi-books-title">
        <div className="bazi-section-head">
          <span>推荐书籍</span>
          <h2 id="bazi-books-title">从讲义到原典</h2>
        </div>
        <BaziBookGrid books={baziBooks} />
      </section>

      <section className="bazi-panel" aria-labelledby="bazi-cases-title">
        <div className="bazi-section-head">
          <span>案例卡片</span>
          <h2 id="bazi-cases-title">只练结构，不做完整断命</h2>
          <Link href="/bazi/cases">
            查看全部案例
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <div className="bazi-case-grid">
          {baziLearningCases.slice(0, 2).map((item) => (
            <BaziCaseCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <BaziChartPlaceholder />
    </main>
  );
}
