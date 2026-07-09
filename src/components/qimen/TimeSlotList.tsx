import type { QimenDoor } from "@/types/qimen";

export type QimenTimeSlotLevel = "较宜" | "可用" | "平稳" | "慎用" | "不建议";

export type QimenTimeSlot = {
  id: string;
  ganzhi: string;
  timeRange: string;
  door: QimenDoor;
  score: number;
  level: QimenTimeSlotLevel;
  note: string;
};

type TimeSlotListProps = {
  slots: QimenTimeSlot[];
};

export default function TimeSlotList({ slots }: TimeSlotListProps) {
  return (
    <section className="time-slot-section" aria-labelledby="time-slot-title">
      <div className="qimen-section-head">
        <span>十二时辰</span>
        <h2 id="time-slot-title">按时辰观察行动节奏</h2>
        <p>评分为 mock 参考值，只用于学习页面结构，不代表真实择时结果。</p>
      </div>

      <div className="time-slot-list">
        {slots.map((slot) => (
          <article key={slot.id} className={`time-slot-card level-${slot.level}`}>
            <header>
              <div>
                <strong>{slot.ganzhi}</strong>
                <span>{slot.timeRange}</span>
              </div>
              <em>{slot.level}</em>
            </header>
            <dl>
              <div>
                <dt>八门</dt>
                <dd>{slot.door}</dd>
              </div>
              <div>
                <dt>评分</dt>
                <dd>{slot.score}</dd>
              </div>
            </dl>
            <p>{slot.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
