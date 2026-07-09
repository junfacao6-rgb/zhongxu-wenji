import Link from "next/link";
import { ArrowRight, Layers, Tags } from "lucide-react";
import type { Term } from "@/types/content";
import type { SubjectKey } from "@/types/platform";

const subjectLabels: Record<SubjectKey, string> = {
  qimen: "奇门遁甲",
  bazi: "八字命理",
  liuyao: "六爻纳甲",
  meihua: "梅花易数",
  dao: "道家经典",
  yixue: "易学基础",
};

type TermDetailProps = {
  term: Term;
  dailyScenarios: string[];
  relatedTerms: Term[];
};

export default function TermDetail({ term, dailyScenarios, relatedTerms }: TermDetailProps) {
  return (
    <section className={`term-detail-hero term-subject-${term.subject}`}>
      <div className="term-detail-title">
        <span>{subjectLabels[term.subject]}</span>
        <h1>{term.name}</h1>
        {term.aliases.length > 0 ? <p>别名：{term.aliases.join("、")}</p> : <p>别名：暂无</p>}
      </div>

      <div className="term-detail-meta">
        <span>
          <Layers aria-hidden="true" />
          {term.category}
        </span>
        <span>
          <Tags aria-hidden="true" />
          {term.tags.slice(0, 4).join(" / ")}
        </span>
      </div>

      <div className="term-explanation-grid">
        <article>
          <span>原文解释</span>
          <p>{term.originalExplanation}</p>
        </article>
        <article>
          <span>白话解释</span>
          <p>{term.plainExplanation}</p>
        </article>
        <article>
          <span>专业解释</span>
          <p>{term.advancedExplanation}</p>
        </article>
      </div>

      <section className="term-detail-card" aria-labelledby="term-daily-title">
        <div className="term-section-head">
          <span>日用场景</span>
          <h2 id="term-daily-title">可以这样理解和练习</h2>
        </div>
        <div className="term-daily-list">
          {dailyScenarios.map((scenario) => (
            <span key={scenario}>{scenario}</span>
          ))}
        </div>
      </section>

      <section className="term-detail-card" aria-labelledby="term-related-title">
        <div className="term-section-head">
          <span>关联术语</span>
          <h2 id="term-related-title">继续串联概念</h2>
        </div>
        {relatedTerms.length > 0 ? (
          <div className="term-related-list">
            {relatedTerms.map((item) => (
              <Link key={item.id} href={`/terms/${item.id}`}>
                <strong>{item.name}</strong>
                <p>{item.plainExplanation}</p>
                <small>
                  查看
                  <ArrowRight aria-hidden="true" />
                </small>
              </Link>
            ))}
          </div>
        ) : (
          <p className="term-empty-copy">相关术语正在整理中。</p>
        )}
      </section>
    </section>
  );
}
