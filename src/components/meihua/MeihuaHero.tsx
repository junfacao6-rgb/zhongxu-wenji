import Link from "next/link";
import { ArrowRight, BookOpen, FileText, Sparkles } from "lucide-react";

interface MeihuaHeroProps {
  compact?: boolean;
}

export default function MeihuaHero({ compact = false }: MeihuaHeroProps) {
  return (
    <section className={`meihua-hero ${compact ? "is-compact" : ""}`}>
      <div>
        <span>梅花易数学习系统</span>
        <h1>以象为门，以复盘校正判断</h1>
        <p>
          梅花易数第一版只做学习系统，围绕先后天八卦、起卦法、体用、互卦、变卦、五行生克、外应和案例复盘建立路径。
        </p>
        <div className="meihua-hero-actions">
          <Link href="/meihua/learn">
            <BookOpen aria-hidden="true" />
            学习路径
          </Link>
          <Link href="/meihua/cases">
            <FileText aria-hidden="true" />
            案例练习
          </Link>
          <Link href="/terms">
            <Sparkles aria-hidden="true" />
            术语库
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
