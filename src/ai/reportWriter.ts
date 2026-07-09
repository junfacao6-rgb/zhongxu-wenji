import type { EvidenceRef } from "@/types/platform";

export type ReportKind = "todayQi" | "eventTiming" | "contentTiming" | "consultation";

export interface StructuredReportScore {
  label: string;
  value: number;
  note?: string;
}

export interface StructuredReportPattern {
  name: string;
  level?: "参考" | "较适合" | "慎用" | "不建议";
  summary?: string;
}

export interface StructuredReportAnalysis {
  kind?: ReportKind;
  title?: string;
  subject?: string;
  target?: string;
  timeRange?: string;
  reasons: string[];
  scores?: StructuredReportScore[];
  patterns?: StructuredReportPattern[];
  evidenceRefs: EvidenceRef[];
  advice?: string[];
  warnings?: string[];
}

export interface GeneratedReportDraft {
  title: string;
  summary: string;
  professionalExplanation: string;
  plainAdvice: string;
  warnings: string[];
  disclaimer: string;
}

const REPORT_DISCLAIMER =
  "本报告由规则引擎输出的结构化分析润色生成，仅作传统文化学习、行动参考与复盘记录，不构成医疗、投资、法律、婚姻或其他现实专业决策建议。";

const POLICY_WARNINGS = [
  "AI 仅负责润色，不负责判盘；报告不得新增输入中不存在的信息。",
  "涉及现实行动时，请结合实际条件、专业意见和风险核验后再决定。",
];

export function mockGenerateReport(analysis: StructuredReportAnalysis): GeneratedReportDraft {
  const title = analysis.title?.trim() || defaultTitleFor(analysis.kind);
  const reasonText = joinItems(analysis.reasons, "规则引擎未提供具体理由，本报告仅保留占位说明。");
  const scoreText = formatScores(analysis.scores);
  const patternText = formatPatterns(analysis.patterns);
  const evidenceText = formatEvidenceRefs(analysis.evidenceRefs);
  const adviceText = joinItems(analysis.advice ?? [], "输入中未提供行动建议，建议先保留为复盘样本，不做扩大解读。");

  return {
    title,
    summary: buildSummary(analysis, reasonText),
    professionalExplanation: [
      `规则理由：${reasonText}`,
      scoreText ? `评分依据：${scoreText}` : "",
      patternText ? `结构标记：${patternText}` : "",
      evidenceText ? `证据引用：${evidenceText}` : "证据引用：未提供 evidenceRefs，正式报告生成前必须补齐。",
    ]
      .filter(Boolean)
      .join("\n"),
    plainAdvice: adviceText,
    warnings: [...new Set([...(analysis.warnings ?? []), ...POLICY_WARNINGS, evidenceWarning(analysis.evidenceRefs)].filter(Boolean))],
    disclaimer: REPORT_DISCLAIMER,
  };
}

function defaultTitleFor(kind: ReportKind | undefined) {
  switch (kind) {
    case "todayQi":
      return "今日气机报告";
    case "eventTiming":
      return "一事择时报告";
    case "contentTiming":
      return "内容发布择时报告";
    case "consultation":
      return "客户咨询报告";
    default:
      return "规则分析报告";
  }
}

function buildSummary(analysis: StructuredReportAnalysis, reasonText: string) {
  const target = analysis.target ? `「${analysis.target}」` : "当前事项";
  const timeRange = analysis.timeRange ? `，参考时段为 ${analysis.timeRange}` : "";
  return `${target}${timeRange}。根据规则引擎提供的结构化理由，当前报告只做语言整理：${reasonText}`;
}

function formatScores(scores: StructuredReportScore[] | undefined) {
  if (!scores?.length) return "";
  return scores.map((score) => `${score.label} ${score.value} 分${score.note ? `（${score.note}）` : ""}`).join("；");
}

function formatPatterns(patterns: StructuredReportPattern[] | undefined) {
  if (!patterns?.length) return "";
  return patterns.map((pattern) => `${pattern.name}${pattern.level ? ` / ${pattern.level}` : ""}${pattern.summary ? `：${pattern.summary}` : ""}`).join("；");
}

function formatEvidenceRefs(evidenceRefs: EvidenceRef[]) {
  if (!evidenceRefs.length) return "";
  return evidenceRefs
    .map((ref) => {
      const parts = [ref.sourceId, ref.segmentId, ref.chapterTitle].filter(Boolean);
      const page = ref.pageStart || ref.pageEnd ? `页码 ${ref.pageStart ?? "?"}-${ref.pageEnd ?? "?"}` : "";
      return [...parts, page].filter(Boolean).join(" / ");
    })
    .join("；");
}

function joinItems(items: string[], fallback: string) {
  const cleanItems = items.map((item) => item.trim()).filter(Boolean);
  if (!cleanItems.length) return fallback;
  return cleanItems.join("；");
}

function evidenceWarning(evidenceRefs: EvidenceRef[]) {
  return evidenceRefs.length ? "" : "缺少 evidenceRefs，正式接入真实 AI 前必须补齐生成依据。";
}
