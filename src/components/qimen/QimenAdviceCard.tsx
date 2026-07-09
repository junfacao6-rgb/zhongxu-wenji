import type { LucideIcon } from "lucide-react";

type QimenAdviceCardProps = {
  title: string;
  subtitle: string;
  items: string[];
  icon: LucideIcon;
  tone?: "default" | "caution" | "ink";
};

export default function QimenAdviceCard({ title, subtitle, items, icon: Icon, tone = "default" }: QimenAdviceCardProps) {
  return (
    <section className={`qimen-advice-card is-${tone}`}>
      <div className="qimen-advice-head">
        <Icon aria-hidden="true" />
        <div>
          <span>{subtitle}</span>
          <h2>{title}</h2>
        </div>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
