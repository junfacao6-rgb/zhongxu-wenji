import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, FileText } from "lucide-react";

interface BaziHeroProps {
  compact?: boolean;
}

export default function BaziHero({ compact = false }: BaziHeroProps) {
  return (
    <section className={`bazi-hero ${compact ? "is-compact" : ""}`}>
      <div>
        <span>八字学习系统</span>
        <h1>先看结构，再谈判断</h1>
        <p>
          八字学习不从浅层鸡汤进入，而从月令、气势、寒暖燥湿、格局、调候、清浊、用神成败，
          以及原局与大运流年的综合判断入手。
        </p>
        <div className="bazi-hero-actions">
          <Link href="/bazi/learn">
            <BookOpen aria-hidden="true" />
            学习路径
          </Link>
          <Link href="/bazi/cases">
            <FileText aria-hidden="true" />
            案例学习
          </Link>
          <Link href="/bazi/chart-placeholder">
            <CalendarDays aria-hidden="true" />
            排盘占位
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
