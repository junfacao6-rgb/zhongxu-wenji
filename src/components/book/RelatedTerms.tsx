import { ArrowRight, Tags } from "lucide-react";
import Link from "next/link";
import type { Term } from "@/types/content";

type RelatedTermsProps = {
  terms: Term[];
};

export default function RelatedTerms({ terms }: RelatedTermsProps) {
  return (
    <section className="book-detail-card book-related-card" aria-labelledby="book-terms-title">
      <div className="book-section-head">
        <span>术语索引</span>
        <h2 id="book-terms-title">相关术语</h2>
      </div>

      {terms.length > 0 ? (
        <div className="book-term-grid">
          {terms.map((term) => (
            <Link key={term.id} className="book-term-card" href={`/terms/${term.id}`}>
              <span>
                <Tags aria-hidden="true" />
                {term.category}
              </span>
              <strong>{term.name}</strong>
              <p>{term.plainExplanation}</p>
              <small>
                查看术语
                <ArrowRight aria-hidden="true" />
              </small>
            </Link>
          ))}
        </div>
      ) : (
        <p className="book-empty-copy">相关术语正在整理中。</p>
      )}
    </section>
  );
}
