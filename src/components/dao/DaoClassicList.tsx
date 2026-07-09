import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import type { DaoClassicItem } from "@/data/daoLearning";

interface DaoClassicListProps {
  items: DaoClassicItem[];
}

export default function DaoClassicList({ items }: DaoClassicListProps) {
  return (
    <div className="dao-classic-list">
      {items.map((item) => {
        const content = (
          <>
            <div>
              <BookOpen aria-hidden="true" />
              <span>{item.subtitle}</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
            <ul>
              {item.readingFocus.map((focus) => (
                <li key={focus}>{focus}</li>
              ))}
            </ul>
          </>
        );

        return item.route ? (
          <Link key={item.id} href={item.route}>
            {content}
            <small>
              进入阅读
              <ArrowRight aria-hidden="true" />
            </small>
          </Link>
        ) : (
          <article key={item.id}>
            {content}
            <small>资料待整理</small>
          </article>
        );
      })}
    </div>
  );
}
