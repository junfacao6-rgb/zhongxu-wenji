"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FileText, Info, Lightbulb, ShieldCheck } from "lucide-react";
import EventSelector from "@/components/qimen/EventSelector";
import TimingReasonList from "@/components/qimen/TimingReasonList";
import TimingResultCard from "@/components/qimen/TimingResultCard";
import { qimenMockChart } from "@/data/qimenMock";
import { eventCategories, eventRulesByCategory, type EventRule, type QimenEventCategory } from "@/qimen-core/eventRules";
import { analyzeEventTiming, scorePalaceForEvent, type TimingResult } from "@/qimen-core/scoring";
import type { QimenPalace } from "@/types/qimen";

export type EvaluatedTimeSlot = {
  id: string;
  timeLabel: string;
  timeRange: string;
  palace: QimenPalace;
  score: number;
  level: TimingResult["level"];
  reasons: string[];
  advice: string;
  professionalExplanation: string;
  warnings: string[];
};

type MockTimeSlot = {
  id: string;
  timeLabel: string;
  timeRange: string;
  palaceNumber: number;
};

const mockTimeSlots: MockTimeSlot[] = [
  { id: "zi", timeLabel: "甲子时", timeRange: "23:00 - 01:00", palaceNumber: 1 },
  { id: "chou", timeLabel: "乙丑时", timeRange: "01:00 - 03:00", palaceNumber: 8 },
  { id: "yin", timeLabel: "丙寅时", timeRange: "03:00 - 05:00", palaceNumber: 3 },
  { id: "mao", timeLabel: "丁卯时", timeRange: "05:00 - 07:00", palaceNumber: 4 },
  { id: "chen", timeLabel: "戊辰时", timeRange: "07:00 - 09:00", palaceNumber: 9 },
  { id: "si", timeLabel: "己巳时", timeRange: "09:00 - 11:00", palaceNumber: 6 },
  { id: "wu", timeLabel: "庚午时", timeRange: "11:00 - 13:00", palaceNumber: 7 },
  { id: "wei", timeLabel: "辛未时", timeRange: "13:00 - 15:00", palaceNumber: 2 },
  { id: "shen", timeLabel: "壬申时", timeRange: "15:00 - 17:00", palaceNumber: 5 },
  { id: "you", timeLabel: "癸酉时", timeRange: "17:00 - 19:00", palaceNumber: 1 },
  { id: "xu", timeLabel: "甲戌时", timeRange: "19:00 - 21:00", palaceNumber: 8 },
  { id: "hai", timeLabel: "乙亥时", timeRange: "21:00 - 23:00", palaceNumber: 9 },
];

export default function EventTimingPanel() {
  const initialCategory = eventCategories[0];
  const [selectedCategory, setSelectedCategory] = useState<QimenEventCategory>(initialCategory);
  const [selectedRuleId, setSelectedRuleId] = useState(eventRulesByCategory[initialCategory][0]?.id ?? "");
  const [targetDate, setTargetDate] = useState(qimenMockChart.chartTime.slice(0, 10));
  const [hasGenerated, setHasGenerated] = useState(false);

  const selectedRule = useMemo(() => {
    return eventRulesByCategory[selectedCategory].find((rule) => rule.id === selectedRuleId) ?? eventRulesByCategory[selectedCategory][0];
  }, [selectedCategory, selectedRuleId]);

  const timingResult = useMemo(() => analyzeEventTiming(qimenMockChart, selectedRule), [selectedRule]);

  const evaluatedSlots = useMemo(() => evaluateTimeSlots(selectedRule), [selectedRule]);
  const recommendedSlots = evaluatedSlots.slice(0, 3);
  const cautiousSlots = evaluatedSlots.slice(-3).reverse();

  function handleCategoryChange(category: QimenEventCategory) {
    const nextRule = eventRulesByCategory[category][0];
    setSelectedCategory(category);
    setSelectedRuleId(nextRule?.id ?? "");
    setHasGenerated(false);
  }

  function handleRuleChange(ruleId: string) {
    setSelectedRuleId(ruleId);
    setHasGenerated(false);
  }

  return (
    <div className="event-timing-panel">
      <EventSelector
        categories={eventCategories}
        rulesByCategory={eventRulesByCategory}
        selectedCategory={selectedCategory}
        selectedRuleId={selectedRuleId}
        targetDate={targetDate}
        onCategoryChange={handleCategoryChange}
        onRuleChange={handleRuleChange}
        onTargetDateChange={(date) => {
          setTargetDate(date);
          setHasGenerated(false);
        }}
        onGenerate={() => setHasGenerated(true)}
      />

      <section className="event-query-card" aria-labelledby="event-query-title">
        <div>
          <span>查询信息</span>
          <h2 id="event-query-title">{selectedRule.name}</h2>
          <p>{selectedRule.description}</p>
        </div>
        <dl>
          <div>
            <dt>分类</dt>
            <dd>{selectedRule.category}</dd>
          </div>
          <div>
            <dt>目标日期</dt>
            <dd>{targetDate}</dd>
          </div>
          <div>
            <dt>盘面来源</dt>
            <dd>{qimenMockChart.title}</dd>
          </div>
          <div>
            <dt>规则口径</dt>
            <dd>规则评分，不接 AI</dd>
          </div>
        </dl>
      </section>

      {!hasGenerated ? (
        <section className="event-empty-state" aria-label="尚未生成择时参考">
          <Info aria-hidden="true" />
          <div>
            <h2>请选择事项后生成参考</h2>
            <p>结果会按八门、九星、八神、宫位状态和格局标签进行规则评分；目标日期暂不触发真实排盘。</p>
          </div>
        </section>
      ) : (
        <>
          <section className="timing-card-section" aria-labelledby="recommended-times-title">
            <div className="qimen-section-head">
              <span>推荐时辰</span>
              <h2 id="recommended-times-title">结构较顺的参考时段</h2>
              <p>以下时段来自同一 mock 盘的宫位映射与事件规则评分，适合先作为安排和复盘样本。</p>
            </div>
            <div className="timing-card-grid">
              {recommendedSlots.map((slot) => (
                <TimingResultCard key={slot.id} slot={slot} />
              ))}
            </div>
          </section>

          <section className="timing-card-section" aria-labelledby="cautious-times-title">
            <div className="qimen-section-head">
              <span>慎用时辰</span>
              <h2 id="cautious-times-title">建议放慢或改作整理的时段</h2>
              <p>慎用不等于完全不可用，表示盘面结构提示需复核现实条件、材料和沟通边界。</p>
            </div>
            <div className="timing-card-grid">
              {cautiousSlots.map((slot) => (
                <TimingResultCard key={slot.id} slot={slot} variant="caution" />
              ))}
            </div>
          </section>

          <TimingReasonList result={timingResult} recommendedSlots={recommendedSlots} cautiousSlots={cautiousSlots} />

          <section className="timing-action-panel" aria-labelledby="timing-action-title">
            <div>
              <span>行动建议</span>
              <h2 id="timing-action-title">把择时结果落到可复盘动作</h2>
              <p>{timingResult.advice}</p>
              <ul>
                <li>行动前先确认对象、材料、授权、预算和现实约束。</li>
                <li>选择推荐时辰时，建议记录事项、执行时间、关键条件和后续反馈。</li>
                <li>若落在慎用时段，可改为整理资料、修订话术、准备证据或等待条件更明朗。</li>
              </ul>
            </div>
            <Link href="/qimen/report/preview">
              <FileText aria-hidden="true" />
              跳转报告预览
            </Link>
          </section>
        </>
      )}

      <section className="select-time-disclaimer" aria-label="免责声明">
        <ShieldCheck aria-hidden="true" />
        <div>
          <strong>免责声明</strong>
          <p>{qimenMockChart.disclaimer}</p>
          <p>{selectedRule.riskDisclaimer}</p>
        </div>
      </section>
    </div>
  );
}

function evaluateTimeSlots(eventRule: EventRule): EvaluatedTimeSlot[] {
  const slots = mockTimeSlots
    .map((timeSlot) => {
      const palace = qimenMockChart.palaces.find((item) => item.palaceNumber === timeSlot.palaceNumber);
      if (!palace) return null;

      const palaceScore = scorePalaceForEvent(palace, eventRule);
      const score = palaceScore.score;
      const level = getTimingLevel(score);
      const reasons = palaceScore.reasons.length > 0 ? palaceScore.reasons : ["当前时段暂无明显加减分项，暂作平稳参考。"];

      return {
        id: timeSlot.id,
        timeLabel: timeSlot.timeLabel,
        timeRange: timeSlot.timeRange,
        palace,
        score,
        level,
        reasons,
        advice: buildSlotAdvice(eventRule, level, palace),
        professionalExplanation: `${timeSlot.timeLabel}取${palace.palaceName}为参考，门为${palace.door}，星为${palace.star}，神为${palace.deity}。${reasons.join("；")}`,
        warnings: palaceScore.warningReasons,
      };
    })
    .filter((slot): slot is EvaluatedTimeSlot => Boolean(slot));

  return [...slots].sort((left, right) => right.score - left.score);
}

function getTimingLevel(score: number): TimingResult["level"] {
  if (score >= 80) return "较宜";
  if (score >= 65) return "可用";
  if (score >= 50) return "平稳";
  if (score >= 35) return "慎用";
  return "不建议";
}

function buildSlotAdvice(eventRule: EventRule, level: TimingResult["level"], palace: QimenPalace) {
  const base = `${eventRule.name}可重点观察${palace.palaceName}的${palace.door}、${palace.star}和${palace.deity}组合。`;

  switch (level) {
    case "较宜":
      return `${base}结构偏向较顺，可作为优先参考时段，但仍建议先核实现实条件。`;
    case "可用":
      return `${base}结构显示可用，适合在材料齐备、边界清楚时推进。`;
    case "平稳":
      return `${base}整体偏平稳，适合常规处理、准备和复盘，不宜过度放大结果。`;
    case "慎用":
      return `${base}结构提示需慎重，建议先处理风险点，再决定是否行动。`;
    case "不建议":
      return `${base}不建议作为优先行动时段，可改为整理资料、观察反馈或等待条件明朗。`;
  }
}
