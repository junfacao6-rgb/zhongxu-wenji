import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string | number;
  note: string;
  icon: LucideIcon;
  tone?: "default" | "warning" | "success" | "danger";
};

export default function StatCard({ label, value, note, icon: Icon, tone = "default" }: StatCardProps) {
  return (
    <article className={`admin-stat-card is-${tone}`}>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <p>{note}</p>
      </div>
      <Icon aria-hidden="true" />
    </article>
  );
}
