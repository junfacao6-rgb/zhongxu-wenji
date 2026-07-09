"use client";

import { CalendarDays, PlayCircle } from "lucide-react";
import type { EventRule, QimenEventCategory } from "@/qimen-core/eventRules";

interface EventSelectorProps {
  categories: QimenEventCategory[];
  rulesByCategory: Record<QimenEventCategory, EventRule[]>;
  selectedCategory: QimenEventCategory;
  selectedRuleId: string;
  targetDate: string;
  onCategoryChange: (category: QimenEventCategory) => void;
  onRuleChange: (ruleId: string) => void;
  onTargetDateChange: (date: string) => void;
  onGenerate: () => void;
}

export default function EventSelector({
  categories,
  rulesByCategory,
  selectedCategory,
  selectedRuleId,
  targetDate,
  onCategoryChange,
  onRuleChange,
  onTargetDateChange,
  onGenerate,
}: EventSelectorProps) {
  const selectedRules = rulesByCategory[selectedCategory] ?? [];

  return (
    <section className="event-selector-card" aria-labelledby="event-selector-title">
      <div className="event-selector-head">
        <div>
          <span>事件选择</span>
          <h2 id="event-selector-title">先定事项，再看时段结构</h2>
          <p>第一版使用 mock 盘和事件规则库评分，目标日期仅作为查询信息展示。</p>
        </div>
        <CalendarDays aria-hidden="true" />
      </div>

      <div className="event-selector-grid">
        <label>
          <span>事件分类</span>
          <select value={selectedCategory} onChange={(event) => onCategoryChange(event.target.value as QimenEventCategory)}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>具体事项</span>
          <select value={selectedRuleId} onChange={(event) => onRuleChange(event.target.value)}>
            {selectedRules.map((rule) => (
              <option key={rule.id} value={rule.id}>
                {rule.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>目标日期</span>
          <input type="date" value={targetDate} onChange={(event) => onTargetDateChange(event.target.value)} />
        </label>

        <button type="button" onClick={onGenerate}>
          <PlayCircle aria-hidden="true" />
          生成择时参考
        </button>
      </div>
    </section>
  );
}
