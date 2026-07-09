import type { QimenPalace } from "@/types/qimen";

type QimenPalaceCardProps = {
  palace: QimenPalace;
  onSelect: (palace: QimenPalace) => void;
};

export default function QimenPalaceCard({ palace, onSelect }: QimenPalaceCardProps) {
  const statusLabels = getPalaceStatusLabels(palace);

  return (
    <button type="button" className="qimen-palace-card" onClick={() => onSelect(palace)}>
      <span className="qimen-palace-number">{palace.palaceNumber}</span>
      <div className="qimen-palace-head">
        <strong>{palace.palaceName}</strong>
        <small>{palace.direction} · {palace.element}</small>
      </div>

      <dl className="qimen-palace-symbols">
        <div>
          <dt>天盘干</dt>
          <dd>{palace.heavenlyStem}</dd>
        </div>
        <div>
          <dt>地盘干</dt>
          <dd>{palace.earthlyStem}</dd>
        </div>
        <div>
          <dt>八门</dt>
          <dd>{palace.door}</dd>
        </div>
        <div>
          <dt>九星</dt>
          <dd>{palace.star}</dd>
        </div>
        <div>
          <dt>八神</dt>
          <dd>{palace.deity}</dd>
        </div>
      </dl>

      <div className="qimen-palace-tags" aria-label={`${palace.palaceName}状态标签`}>
        {statusLabels.map((label) => (
          <em key={label} className={label === "吉格" ? "is-good" : label === "凶格" ? "is-risk" : ""}>
            {label}
          </em>
        ))}
      </div>
    </button>
  );
}

function getPalaceStatusLabels(palace: QimenPalace) {
  const labels: string[] = [];
  if (palace.isEmpty) labels.push("空亡");
  if (palace.isTomb) labels.push("入墓");
  if (palace.isDoorForced) labels.push("门迫");
  if (palace.isPunishment) labels.push("击刑");
  if (palace.patterns.some((pattern) => pattern.level === "较适合")) labels.push("吉格");
  if (palace.patterns.some((pattern) => pattern.level === "慎用")) labels.push("凶格");
  return labels.length > 0 ? labels : ["参考"];
}
