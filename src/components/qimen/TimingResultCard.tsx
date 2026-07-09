import { ArrowRight, Clock3, ShieldAlert } from "lucide-react";
import type { EvaluatedTimeSlot } from "@/components/qimen/EventTimingPanel";

interface TimingResultCardProps {
  slot: EvaluatedTimeSlot;
  variant?: "recommended" | "caution";
}

export default function TimingResultCard({ slot, variant = "recommended" }: TimingResultCardProps) {
  const title = variant === "recommended" ? "推荐时辰" : "慎用时辰";
  const reason = slot.reasons.find((item) => !item.startsWith("基础分")) ?? slot.reasons[0];

  return (
    <article className={`timing-result-card is-${variant}`}>
      <div className="timing-result-card-head">
        <div>
          <span>{title}</span>
          <h3>{slot.timeLabel}</h3>
          <p>
            <Clock3 aria-hidden="true" />
            {slot.timeRange}
          </p>
        </div>
        <strong>{slot.score}</strong>
      </div>

      <div className="timing-result-level">
        <span>{slot.level}</span>
        <small>{slot.palace.palaceName} · {slot.palace.door} · {slot.palace.star}</small>
      </div>

      <section>
        <h4>{variant === "recommended" ? "适合原因" : "慎用原因"}</h4>
        <p>{reason}</p>
      </section>

      <section>
        <h4>行动建议</h4>
        <p>{slot.advice}</p>
      </section>

      {slot.warnings.length > 0 ? (
        <div className="timing-result-warning">
          <ShieldAlert aria-hidden="true" />
          <span>{slot.warnings[0]}</span>
        </div>
      ) : null}

      <a href="#timing-reasons">
        查看盘理依据
        <ArrowRight aria-hidden="true" />
      </a>
    </article>
  );
}
