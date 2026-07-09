"use client";

import type { Difficulty, SubjectKey } from "@/types/platform";

export type SubjectFilterValue = "all" | SubjectKey;
export type DifficultyFilterValue = "all" | Difficulty;

const subjectFilters: { label: string; value: SubjectFilterValue }[] = [
  { label: "全部", value: "all" },
  { label: "奇门", value: "qimen" },
  { label: "八字", value: "bazi" },
  { label: "六爻", value: "liuyao" },
  { label: "梅花", value: "meihua" },
  { label: "道家", value: "dao" },
  { label: "易学基础", value: "yixue" },
];

const difficultyFilters: { label: string; value: DifficultyFilterValue }[] = [
  { label: "全部", value: "all" },
  { label: "入门", value: "入门" },
  { label: "进阶", value: "进阶" },
  { label: "专业", value: "专业" },
  { label: "原典", value: "原典" },
];

type BookFiltersProps = {
  subject: SubjectFilterValue;
  difficulty: DifficultyFilterValue;
  onSubjectChange: (value: SubjectFilterValue) => void;
  onDifficultyChange: (value: DifficultyFilterValue) => void;
  totalCount: number;
  visibleCount: number;
};

export default function BookFilters({
  subject,
  difficulty,
  onSubjectChange,
  onDifficultyChange,
  totalCount,
  visibleCount,
}: BookFiltersProps) {
  return (
    <section className="wen-gu-section library-filter-panel book-filter-panel library-archive-filter-panel" id="categories">
      <div className="wen-gu-section-head library-filter-head">
        <div>
          <p>筛选</p>
          <h2>藏书门类</h2>
        </div>
        <span>{visibleCount} / {totalCount} 本</span>
      </div>

      <div className="library-filter-group" aria-label="按学科筛选">
        <strong>门类</strong>
        <div>
          {subjectFilters.map((item) => (
            <button
              className={subject === item.value ? "active" : undefined}
              key={item.value}
              onClick={() => onSubjectChange(item.value)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="library-filter-group" aria-label="按难度筛选">
        <strong>读法</strong>
        <div>
          {difficultyFilters.map((item) => (
            <button
              className={difficulty === item.value ? "active" : undefined}
              key={item.value}
              onClick={() => onDifficultyChange(item.value)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
