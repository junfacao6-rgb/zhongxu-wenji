"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import TermCard from "@/components/terms/TermCard";
import type { Term } from "@/types/content";
import type { SubjectKey } from "@/types/platform";

type SubjectFilter = SubjectKey | "all";

const subjectOptions: Array<{ key: SubjectFilter; label: string }> = [
  { key: "all", label: "全部" },
  { key: "yixue", label: "易学基础" },
  { key: "qimen", label: "奇门" },
  { key: "bazi", label: "八字" },
  { key: "liuyao", label: "六爻" },
  { key: "meihua", label: "梅花" },
  { key: "dao", label: "道家" },
];

type TermFiltersProps = {
  terms: Term[];
  categories: string[];
  relatedBookCounts: Record<string, number>;
};

export default function TermFilters({ terms, categories, relatedBookCounts }: TermFiltersProps) {
  const [subject, setSubject] = useState<SubjectFilter>("all");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);
  const normalizedQuery = query.trim().toLowerCase();

  const filteredTerms = terms.filter((term) => {
    const subjectMatched = subject === "all" || term.subject === subject;
    const categoryMatched = category === "all" || term.category === category;
    const queryMatched =
      normalizedQuery.length === 0 ||
      [term.name, term.category, term.plainExplanation, term.originalExplanation, ...term.aliases, ...term.tags]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);

    return subjectMatched && categoryMatched && queryMatched;
  });

  function toggleFavorite(termId: string) {
    setFavoriteIds((current) => (current.includes(termId) ? current.filter((id) => id !== termId) : [...current, termId]));
  }

  return (
    <section className="terms-browser" aria-label="术语筛选与列表">
      <div className="terms-filter-panel">
        <label className="terms-search">
          <Search aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索术语、别名、标签" />
        </label>

        <div className="terms-filter-group" aria-label="按学科筛选">
          <strong>学科</strong>
          <div>
            {subjectOptions.map((option) => (
              <button key={option.key} type="button" className={subject === option.key ? "is-active" : ""} onClick={() => setSubject(option.key)}>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="terms-filter-group" aria-label="按分类筛选">
          <strong>分类</strong>
          <div>
            <button type="button" className={category === "all" ? "is-active" : ""} onClick={() => setCategory("all")}>
              全部
            </button>
            {categories.map((item) => (
              <button key={item} type="button" className={category === item ? "is-active" : ""} onClick={() => setCategory(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="terms-result-head">
        <span>共 {filteredTerms.length} 个术语</span>
        <small>{favoriteIds.length > 0 ? `已收藏 ${favoriteIds.length} 个` : "收藏状态仅为当前 UI mock"}</small>
      </div>

      {filteredTerms.length > 0 ? (
        <div className="term-card-grid">
          {filteredTerms.map((term) => (
            <TermCard
              key={term.id}
              term={term}
              relatedBookCount={relatedBookCounts[term.id] ?? 0}
              isFavorite={favoriteSet.has(term.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="terms-empty-state">
          <h2>没有找到匹配术语</h2>
          <p>可以减少筛选条件，或改用更短的关键词。</p>
        </div>
      )}
    </section>
  );
}
