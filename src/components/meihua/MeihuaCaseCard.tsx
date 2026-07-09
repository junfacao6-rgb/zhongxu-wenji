import { BookMarked } from "lucide-react";
import type { MeihuaCase } from "@/data/meihuaLearning";

interface MeihuaCaseCardProps {
  item: MeihuaCase;
}

export default function MeihuaCaseCard({ item }: MeihuaCaseCardProps) {
  return (
    <article className="meihua-case-card">
      <header>
        <span>
          <BookMarked aria-hidden="true" />
          {item.method}
        </span>
        <h3>{item.title}</h3>
        <p>{item.scopeNote}</p>
      </header>

      <dl className="meihua-case-meta">
        <div><dt>本卦</dt><dd>{item.baseHexagram}</dd></div>
        <div><dt>互卦</dt><dd>{item.mutualHexagram}</dd></div>
        <div><dt>变卦</dt><dd>{item.changedHexagram}</dd></div>
      </dl>

      <section>
        <h4>触机记录</h4>
        <p>{item.trigger}</p>
      </section>
      <section>
        <h4>体用</h4>
        <p>{item.tiYong}</p>
      </section>
      <section>
        <h4>外应</h4>
        <p>{item.externalResponse}</p>
      </section>
      <section>
        <h4>学习重点</h4>
        <ul>
          {item.learningFocus.map((focus) => (
            <li key={focus}>{focus}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}
