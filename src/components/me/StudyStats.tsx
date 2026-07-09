import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface StudyStatItem {
  id: string;
  label: string;
  value: string;
  helper: string;
  href?: string;
}

interface StudyStatsProps {
  stats: StudyStatItem[];
}

export default function StudyStats({ stats }: StudyStatsProps) {
  return (
    <section className="me-study-stats" aria-label="学习统计">
      {stats.map((stat) => {
        const content = (
          <>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
            <small>{stat.helper}</small>
            {stat.href ? <ArrowRight aria-hidden="true" /> : null}
          </>
        );

        return stat.href ? (
          <Link key={stat.id} href={stat.href}>
            {content}
          </Link>
        ) : (
          <article key={stat.id}>{content}</article>
        );
      })}
    </section>
  );
}
