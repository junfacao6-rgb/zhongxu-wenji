import { BookMarked } from "lucide-react";
import type { BaziLearningCase } from "@/types/bazi";

interface BaziCaseCardProps {
  item: BaziLearningCase;
}

export default function BaziCaseCard({ item }: BaziCaseCardProps) {
  const chart = item.chart;
  const pillars = chart ? [chart.year, chart.month, chart.day, chart.hour] : [];

  return (
    <article className="bazi-case-card">
      <header>
        <span>
          <BookMarked aria-hidden="true" />
          {item.topic}
        </span>
        <h3>{item.title}</h3>
        <p>{item.scopeNote ?? "本案例只作学习结构参考，不做完整断命。"}</p>
      </header>

      {pillars.length > 0 ? (
        <div className="bazi-pillars" aria-label={`${item.title}四柱 mock`}>
          {pillars.map((pillar) => (
            <div key={pillar.label}>
              <span>{pillar.label}</span>
              <strong>{pillar.stem}{pillar.branch}</strong>
              <small>藏干：{pillar.hiddenStems.join("、")}</small>
            </div>
          ))}
        </div>
      ) : (
        <p className="bazi-case-pillars-label">{item.pillarsLabel}</p>
      )}

      <section>
        <h4>结构提示</h4>
        <p>{item.structureHint}</p>
      </section>

      <section>
        <h4>学习重点</h4>
        <ul>
          {(item.learningFocus ?? item.analysisSteps).map((focus) => (
            <li key={focus}>{focus}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}
