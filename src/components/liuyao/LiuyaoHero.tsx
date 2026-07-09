import Link from "next/link";
import { ArrowRight, BookOpen, FileText, Hexagon } from "lucide-react";

interface LiuyaoHeroProps {
  compact?: boolean;
}

export default function LiuyaoHero({ compact = false }: LiuyaoHeroProps) {
  return (
    <section className={`liuyao-hero ${compact ? "is-compact" : ""}`}>
      <div>
        <span>六爻学习系统</span>
        <h1>先明所问，再取用神</h1>
        <p>
          六爻学习以具体问题为入口，按起卦、装卦、世应、六亲、六神、用神、动变、月建日辰和应期逐层记录。
          第一版只做学习系统，不做真实起卦。
        </p>
        <div className="liuyao-hero-actions">
          <Link href="/liuyao/learn">
            <BookOpen aria-hidden="true" />
            学习路径
          </Link>
          <Link href="/liuyao/cases">
            <FileText aria-hidden="true" />
            案例学习
          </Link>
          <Link href="/liuyao/hexagram-placeholder">
            <Hexagon aria-hidden="true" />
            起卦占位
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
