import type { EvaluatedTimeSlot } from "@/components/qimen/EventTimingPanel";
import type { TimingResult } from "@/qimen-core/scoring";

interface TimingReasonListProps {
  result: TimingResult;
  recommendedSlots: EvaluatedTimeSlot[];
  cautiousSlots: EvaluatedTimeSlot[];
}

export default function TimingReasonList({ result, recommendedSlots, cautiousSlots }: TimingReasonListProps) {
  return (
    <section id="timing-reasons" className="timing-reason-list" aria-labelledby="timing-reasons-title">
      <details open>
        <summary>
          <span>专业依据</span>
          <strong id="timing-reasons-title">盘理依据折叠区</strong>
        </summary>

        <div className="timing-reason-body">
          <article>
            <h3>总体结构</h3>
            <p>{result.professionalExplanation}</p>
          </article>

          <article>
            <h3>主要加减分原因</h3>
            <ul>
              {result.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </article>

          <article>
            <h3>推荐时辰依据</h3>
            <div className="timing-reason-slot-grid">
              {recommendedSlots.map((slot) => (
                <div key={slot.id}>
                  <strong>{slot.timeLabel}</strong>
                  <span>{slot.score}分 · {slot.level}</span>
                  <p>{slot.reasons.slice(0, 3).join("；")}</p>
                </div>
              ))}
            </div>
          </article>

          <article>
            <h3>慎用时辰依据</h3>
            <div className="timing-reason-slot-grid is-caution">
              {cautiousSlots.map((slot) => (
                <div key={slot.id}>
                  <strong>{slot.timeLabel}</strong>
                  <span>{slot.score}分 · {slot.level}</span>
                  <p>{slot.reasons.slice(0, 3).join("；")}</p>
                </div>
              ))}
            </div>
          </article>

          {result.warnings.length > 0 ? (
            <article>
              <h3>风险提示</h3>
              <ul>
                {result.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </article>
          ) : null}
        </div>
      </details>
    </section>
  );
}
