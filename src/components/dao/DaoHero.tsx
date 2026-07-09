import Link from "next/link";
import { BookOpen, Feather, ScrollText } from "lucide-react";

interface DaoHeroProps {
  compact?: boolean;
}

export default function DaoHero({ compact = false }: DaoHeroProps) {
  return (
    <section className={`dao-hero ${compact ? "is-compact" : ""}`}>
      <div>
        <span>道家经典学习系统</span>
        <h1>慢读原典，安顿身心，整理可引用的文气</h1>
        <p>
          道家经典页偏向原文阅读、白话札记、修身省察与传统文化文案素材整理。
          这里不是预测工具，也不把经典包装成神秘承诺。
        </p>
        <div className="dao-hero-actions">
          <Link href="/dao/learn">
            <BookOpen aria-hidden="true" />
            阅读路径
          </Link>
          <Link href="/classics">
            <ScrollText aria-hidden="true" />
            典籍库
          </Link>
          <Link href="/terms">
            <Feather aria-hidden="true" />
            术语札记
          </Link>
        </div>
      </div>
    </section>
  );
}
