import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import LiuyaoBookGrid from "@/components/liuyao/LiuyaoBookGrid";
import LiuyaoCaseCard from "@/components/liuyao/LiuyaoCaseCard";
import LiuyaoHero from "@/components/liuyao/LiuyaoHero";
import LiuyaoHexagramPlaceholder from "@/components/liuyao/LiuyaoHexagramPlaceholder";
import LiuyaoLearningPath from "@/components/liuyao/LiuyaoLearningPath";
import LiuyaoTermGrid from "@/components/liuyao/LiuyaoTermGrid";
import { liuyaoLearningCases } from "@/data/liuyaoMock";
import { liuyaoLearningPath, liuyaoStudyPrinciples, liuyaoTermCards } from "@/data/liuyaoLearning";
import { platformMockBooks } from "@/data/books";

export const metadata: Metadata = {
  title: "六爻学习系统 | 问古书斋",
  description: "六爻学习系统第一版：学习路径、术语卡、推荐书籍、案例卡片和起卦占位。",
};

export default function LiuyaoPage() {
  const liuyaoBooks = platformMockBooks.filter((book) => book.subject === "liuyao").slice(0, 4);

  return (
    <main className="liuyao-page">
      <LiuyaoHero />

      <section className="liuyao-panel liuyao-principles-panel" aria-labelledby="liuyao-principles-title">
        <div className="liuyao-section-head">
          <span>学习原则</span>
          <h2 id="liuyao-principles-title">六爻先定问题，再分层判断</h2>
          <p>围绕问题边界、世应、六亲、六神、用神、动变、月建日辰和应期建立可复盘记录。</p>
        </div>
        <ul>
          {liuyaoStudyPrinciples.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="liuyao-panel" aria-labelledby="liuyao-path-title">
        <div className="liuyao-section-head">
          <span>学习路径</span>
          <h2 id="liuyao-path-title">从八卦基础走到案例复盘</h2>
          <Link href="/liuyao/learn">
            查看完整路径
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <LiuyaoLearningPath steps={liuyaoLearningPath.slice(0, 6)} compact />
      </section>

      <section className="liuyao-panel" aria-labelledby="liuyao-terms-title">
        <div className="liuyao-section-head">
          <span>术语卡</span>
          <h2 id="liuyao-terms-title">把问事语言先拆清楚</h2>
        </div>
        <LiuyaoTermGrid terms={liuyaoTermCards} />
      </section>

      <section className="liuyao-panel" aria-labelledby="liuyao-books-title">
        <div className="liuyao-section-head">
          <span>推荐书籍</span>
          <h2 id="liuyao-books-title">从基础流程到原典索引</h2>
        </div>
        <LiuyaoBookGrid books={liuyaoBooks} />
      </section>

      <section className="liuyao-panel" aria-labelledby="liuyao-cases-title">
        <div className="liuyao-section-head">
          <span>案例卡片</span>
          <h2 id="liuyao-cases-title">只练取用、动变和复盘</h2>
          <Link href="/liuyao/cases">
            查看全部案例
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <div className="liuyao-case-grid">
          {liuyaoLearningCases.slice(0, 2).map((item) => (
            <LiuyaoCaseCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <LiuyaoHexagramPlaceholder />
    </main>
  );
}
