import { MessageSquareText, PenLine, ShieldAlert, Sparkles } from "lucide-react";
import type { ContentAdvice } from "@/components/qimen/ContentTimingPanel";

interface ContentAdviceBoardProps {
  advice: ContentAdvice;
}

const adviceCards = [
  { key: "contentTypes", title: "今日适合内容类型", subtitle: "选题方向", icon: Sparkles },
  { key: "titleDirections", title: "今日标题方向", subtitle: "标题口径", icon: PenLine },
  { key: "expressionStyles", title: "今日表达风格", subtitle: "表达方式", icon: MessageSquareText },
  { key: "commentNotes", title: "评论区注意事项", subtitle: "互动边界", icon: ShieldAlert },
  { key: "privateConversion", title: "私域转化建议", subtitle: "承接方式", icon: MessageSquareText },
] as const;

export default function ContentAdviceBoard({ advice }: ContentAdviceBoardProps) {
  return (
    <section className="content-advice-board" aria-label="内容发布建议">
      {adviceCards.map((card) => {
        const Icon = card.icon;
        return (
          <article key={card.key} className={card.key === "privateConversion" ? "is-ink" : undefined}>
            <div className="content-advice-head">
              <Icon aria-hidden="true" />
              <div>
                <span>{card.subtitle}</span>
                <h2>{card.title}</h2>
              </div>
            </div>
            <ul>
              {advice[card.key].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        );
      })}
    </section>
  );
}
