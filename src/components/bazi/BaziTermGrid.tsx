import Link from "next/link";
import { Tags } from "lucide-react";
import type { BaziTermCard } from "@/data/baziLearning";

interface BaziTermGridProps {
  terms: BaziTermCard[];
}

export default function BaziTermGrid({ terms }: BaziTermGridProps) {
  return (
    <div className="bazi-term-grid">
      {terms.map((term) => {
        const content = (
          <>
            <span>
              <Tags aria-hidden="true" />
              {term.category}
            </span>
            <h3>{term.title}</h3>
            <p>{term.summary}</p>
          </>
        );

        return term.route ? (
          <Link key={term.id} href={term.route}>
            {content}
          </Link>
        ) : (
          <article key={term.id}>{content}</article>
        );
      })}
    </div>
  );
}
