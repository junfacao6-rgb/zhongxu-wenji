"use client";

import { CalendarDays, Send } from "lucide-react";
import type { ContentPlatform, ContentPurpose } from "@/components/qimen/ContentTimingPanel";

interface ContentTimingSelectorProps {
  platforms: ContentPlatform[];
  purposes: ContentPurpose[];
  selectedPlatformId: string;
  selectedPurpose: ContentPurpose;
  targetDate: string;
  onPlatformChange: (platformId: string) => void;
  onPurposeChange: (purpose: ContentPurpose) => void;
  onTargetDateChange: (date: string) => void;
  onGenerate: () => void;
}

export default function ContentTimingSelector({
  platforms,
  purposes,
  selectedPlatformId,
  selectedPurpose,
  targetDate,
  onPlatformChange,
  onPurposeChange,
  onTargetDateChange,
  onGenerate,
}: ContentTimingSelectorProps) {
  return (
    <section className="content-timing-selector" aria-labelledby="content-timing-selector-title">
      <div className="content-timing-selector-head">
        <div>
          <span>发布条件</span>
          <h2 id="content-timing-selector-title">选择平台、目的和目标日期</h2>
          <p>第一版仅使用 mock 盘和规则评分，目标日期作为查询信息展示。</p>
        </div>
        <CalendarDays aria-hidden="true" />
      </div>

      <div className="content-timing-form">
        <label>
          <span>发布平台</span>
          <select value={selectedPlatformId} onChange={(event) => onPlatformChange(event.target.value)}>
            {platforms.map((platform) => (
              <option key={platform.id} value={platform.id}>
                {platform.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>目标日期</span>
          <input type="date" value={targetDate} onChange={(event) => onTargetDateChange(event.target.value)} />
        </label>

        <button type="button" onClick={onGenerate}>
          <Send aria-hidden="true" />
          生成发布参考
        </button>
      </div>

      <div className="content-purpose-control" role="group" aria-label="选择内容目的">
        {purposes.map((purpose) => (
          <button
            key={purpose}
            type="button"
            className={purpose === selectedPurpose ? "is-active" : undefined}
            onClick={() => onPurposeChange(purpose)}
          >
            {purpose}
          </button>
        ))}
      </div>
    </section>
  );
}
