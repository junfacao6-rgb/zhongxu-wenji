import { ArrowRight, BookOpen, Heart, Tags } from "lucide-react";
import Link from "next/link";
import type { Term } from "@/types/content";
import type { SubjectKey } from "@/types/platform";

const subjectLabels: Record<SubjectKey, string> = {
  qimen: "奇门",
  bazi: "八字",
  liuyao: "六爻",
  meihua: "梅花",
  dao: "道家",
  yixue: "易学基础",
};

type TermCardProps = {
  term: Term;
  relatedBookCount: number;
  isFavorite: boolean;
  onToggleFavorite: (termId: string) => void;
};

export default function TermCard({ term, relatedBookCount, isFavorite, onToggleFavorite }: TermCardProps) {
  return (
    <article className={`term-card term-subject-${term.subject}`}>
      <div className="term-card-head">
        <div>
          <span>{subjectLabels[term.subject]}</span>
          <h2>{term.name}</h2>
        </div>
        <button type="button" className={isFavorite ? "is-favorite" : ""} onClick={() => onToggleFavorite(term.id)} aria-pressed={isFavorite} aria-label={isFavorite ? `取消收藏${term.name}` : `收藏${term.name}`}>
          <Heart aria-hidden="true" />
        </button>
      </div>

      <p>{term.plainExplanation}</p>

      <div className="term-card-meta">
        <span>
          <Tags aria-hidden="true" />
          {term.category}
        </span>
        <span>
          <BookOpen aria-hidden="true" />
          {relatedBookCount} 本相关书籍
        </span>
      </div>

      <div className="term-card-tags">
        {term.tags.slice(0, 4).map((tag) => (
          <small key={tag}>{tag}</small>
        ))}
      </div>

      <Link href={`/terms/${term.id}`}>
        查看详情
        <ArrowRight aria-hidden="true" />
      </Link>
    </article>
  );
}
