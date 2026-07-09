import { Tags } from "lucide-react";
import Link from "next/link";
import type { Term } from "@/types/content";

type SubjectTermsProps = {
  terms: Term[];
};

export default function SubjectTerms({ terms }: SubjectTermsProps) {
  if (terms.length === 0) {
    return <p className="subject-empty-copy">核心术语正在整理中。</p>;
  }

  return (
    <div className="subject-term-list">
      {terms.map((term) => (
        <Link key={term.id} href={`/terms/${term.id}`} className="subject-term-item">
          <span>
            <Tags aria-hidden="true" />
            {term.category}
          </span>
          <strong>{term.name}</strong>
          <p>{term.plainExplanation}</p>
        </Link>
      ))}
    </div>
  );
}
