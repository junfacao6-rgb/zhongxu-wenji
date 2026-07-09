import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { MeRecentItem } from "@/data/userMock";

interface RecentItemsProps {
  title: string;
  subtitle?: string;
  items: MeRecentItem[];
  emptyText?: string;
}

export default function RecentItems({ title, subtitle, items, emptyText = "暂无记录。" }: RecentItemsProps) {
  return (
    <section className="me-panel me-recent-panel">
      <div className="me-section-head">
        <span>{subtitle ?? "最近记录"}</span>
        <h2>{title}</h2>
      </div>

      {items.length > 0 ? (
        <div className="me-recent-list">
          {items.map((item) => (
            <Link key={item.id} href={item.href} className="me-recent-item">
              <div>
                <span>{item.meta}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              {typeof item.progressPercent === "number" ? (
                <div className="me-progress-line" aria-label={`进度 ${item.progressPercent}%`}>
                  <i style={{ width: `${item.progressPercent}%` }} />
                </div>
              ) : null}
              <footer>
                <small>{item.timeLabel ?? item.status}</small>
                <strong>
                  {item.status ?? "查看"}
                  <ArrowRight aria-hidden="true" />
                </strong>
              </footer>
            </Link>
          ))}
        </div>
      ) : (
        <p className="me-empty-copy">{emptyText}</p>
      )}
    </section>
  );
}
