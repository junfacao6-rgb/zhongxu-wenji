import { BookMarked } from "lucide-react";
import type { LiuyaoCase } from "@/types/liuyao";

interface LiuyaoCaseCardProps {
  item: LiuyaoCase;
}

export default function LiuyaoCaseCard({ item }: LiuyaoCaseCardProps) {
  const shiLine = item.hexagram.lines.find((line) => line.isShi);
  const yingLine = item.hexagram.lines.find((line) => line.isYing);
  const movingLines = item.hexagram.lines.filter((line) => line.isMoving);

  return (
    <article className="liuyao-case-card">
      <header>
        <span>
          <BookMarked aria-hidden="true" />
          {item.questionType}
        </span>
        <h3>{item.title}</h3>
        <p>{item.scopeNote ?? "本案例只作六爻学习结构参考，不做确定性结论。"}</p>
      </header>

      <dl className="liuyao-case-meta">
        <div>
          <dt>本卦</dt>
          <dd>{item.hexagram.baseName}</dd>
        </div>
        <div>
          <dt>变卦</dt>
          <dd>{item.hexagram.changedName ?? "无变卦"}</dd>
        </div>
        <div>
          <dt>世应</dt>
          <dd>世：{shiLine?.name ?? "待标注"} / 应：{yingLine?.name ?? "待标注"}</dd>
        </div>
        <div>
          <dt>用神</dt>
          <dd>{item.yongshenAnalysis.yongshen}</dd>
        </div>
        <div>
          <dt>动爻</dt>
          <dd>{movingLines.length > 0 ? movingLines.map((line) => line.name).join("、") : "无动爻"}</dd>
        </div>
      </dl>

      <div className="liuyao-line-list" aria-label={`${item.title}六爻 mock`}>
        {item.hexagram.lines.map((line) => (
          <div key={line.position} className={line.isMoving ? "is-moving" : undefined}>
            <span>{line.name}{line.isShi ? " · 世" : line.isYing ? " · 应" : ""}</span>
            <strong>{line.isYang ? "阳爻" : "阴爻"}{line.isMoving ? " 动" : ""}</strong>
            <small>{line.liushen} · {line.liuqin} · {line.earthlyBranch}{line.element}</small>
          </div>
        ))}
      </div>

      <section>
        <h4>学习重点</h4>
        <ul>
          {(item.learningFocus ?? item.movingLineAnalysis.possibleChanges).map((focus) => (
            <li key={focus}>{focus}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}
