import type { EventRule } from "@/qimen-core/eventRules";
import type { QimenPalace } from "@/types/qimen";

export type TimingLevel = "较宜" | "可用" | "平稳" | "慎用" | "不建议";

type ExplanationContext = {
  palace: QimenPalace;
  score: number;
  level: TimingLevel;
};

export function renderPlainAdvice(eventRule: EventRule, context: ExplanationContext) {
  const baseAdvice = fillTemplate(eventRule.plainAdviceTemplate, eventRule, context);
  const levelAdvice = getLevelAdvice(context.level);
  return `${baseAdvice} 当前评分为 ${context.score}，等级为“${context.level}”。${levelAdvice}`;
}

export function renderProfessionalExplanation(eventRule: EventRule, context: ExplanationContext, reasons: string[]) {
  const baseExplanation = fillTemplate(eventRule.professionalExplanationTemplate, eventRule, context);
  const reasonText = reasons.length > 0 ? `主要依据：${reasons.join("；")}。` : "主要依据仍需结合盘面和事项进一步校验。";
  return `${baseExplanation} ${reasonText}`;
}

export function buildWarnings(eventRule: EventRule, warningReasons: string[]) {
  const warnings = [...warningReasons, eventRule.riskDisclaimer];
  return Array.from(new Set(warnings.filter(Boolean)));
}

export function describePatternLevel(level: "参考" | "较适合" | "慎用") {
  if (level === "较适合") return "结构显示有可用条件";
  if (level === "慎用") return "结构显示需谨慎处理";
  return "结构可作为参考观察";
}

function fillTemplate(template: string, eventRule: EventRule, context: ExplanationContext) {
  return template
    .replaceAll("{{eventName}}", eventRule.name)
    .replaceAll("{{palaceName}}", context.palace.palaceName)
    .replaceAll("{{door}}", context.palace.door)
    .replaceAll("{{star}}", context.palace.star)
    .replaceAll("{{deity}}", context.palace.deity)
    .replaceAll("{{level}}", context.level)
    .replaceAll("{{score}}", String(context.score));
}

function getLevelAdvice(level: TimingLevel) {
  switch (level) {
    case "较宜":
      return "较适合推进，但仍建议保留现实校验和复盘记录。";
    case "可用":
      return "可作为参考时段，建议先确认关键条件再行动。";
    case "平稳":
      return "整体偏平稳，适合常规处理，不宜过度放大结果。";
    case "慎用":
      return "建议慎重推进，先处理风险点、资料和沟通边界。";
    case "不建议":
      return "不建议作为优先行动时段，可改为整理、观察或等待条件明朗。";
  }
}
