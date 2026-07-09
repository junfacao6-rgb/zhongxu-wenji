import { Clock3, ExternalLink } from "lucide-react";
import type { ContentTimingSlot } from "@/components/qimen/ContentTimingPanel";

interface ContentPublishTimeCardProps {
  slot: ContentTimingSlot;
  variant?: "recommended" | "caution";
}

export default function ContentPublishTimeCard({ slot, variant = "recommended" }: ContentPublishTimeCardProps) {
  const label = variant === "recommended" ? "推荐发布时间" : "不建议发布时间";
  const leadReason = slot.reasons.find((reason) => !reason.startsWith("基础分")) ?? slot.reasons[0];

  return (
    <article className={`content-publish-time-card is-${variant}`}>
      <header>
        <div>
          <span>{label}</span>
          <h3>{slot.timeLabel}</h3>
          <p>
            <Clock3 aria-hidden="true" />
            {slot.timeRange}
          </p>
        </div>
        <strong>{slot.score}</strong>
      </header>

      <div className="content-publish-level">
        <span>{slot.level}</span>
        <small>{slot.palace.palaceName} · {slot.palace.door} · {slot.palace.star}</small>
      </div>

      <section>
        <h4>{variant === "recommended" ? "适合原因" : "不建议原因"}</h4>
        <p>{leadReason}</p>
      </section>

      <section>
        <h4>发布建议</h4>
        <p>{slot.advice}</p>
      </section>

      <a href="#content-timing-evidence">
        查看盘理依据
        <ExternalLink aria-hidden="true" />
      </a>
    </article>
  );
}
