import type { Metadata } from "next";
import TermFilters from "@/components/terms/TermFilters";
import { platformMockBooks } from "@/data/books";
import { terms } from "@/data/terms";
import type { Term } from "@/types/content";

export const metadata: Metadata = {
  title: "术语库 | 问古书斋",
  description: "检索奇门、八字、六爻、梅花、道家经典与易学基础术语。",
};

export default function TermsPage() {
  const visibleTerms = terms.filter((term) => term.visibility !== "hidden");
  const categories = Array.from(new Set(visibleTerms.map((term) => term.category))).sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
  const relatedBookCounts = Object.fromEntries(visibleTerms.map((term) => [term.id, getRelatedBookCount(term)]));

  return (
    <main className="terms-page">
      <section className="terms-hero">
        <span>术语库</span>
        <h1>把术语讲清楚，再进入古籍与案例</h1>
        <p>
          术语库用于整理传统文化和术数学科中的基础概念。每个术语先给白话解释，再关联书籍、课程、工具和复盘场景，避免只背名称。
        </p>
      </section>

      <TermFilters terms={visibleTerms} categories={categories} relatedBookCounts={relatedBookCounts} />
    </main>
  );
}

function getRelatedBookCount(term: Term) {
  return platformMockBooks.filter((book) => {
    if (book.visibility === "private" || book.visibility === "hidden") return false;
    if (book.subject === term.subject) return true;
    return book.tags.some((tag) => term.name.includes(tag) || term.tags.includes(tag) || term.relatedTerms.includes(tag));
  }).length;
}
