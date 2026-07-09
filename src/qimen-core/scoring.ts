import type { EventRule } from "@/qimen-core/eventRules";
import { buildWarnings, describePatternLevel, renderPlainAdvice, renderProfessionalExplanation, type TimingLevel } from "@/qimen-core/explanations";
import type { QimenChart, QimenDeity, QimenDoor, QimenPalace, QimenStar } from "@/types/qimen";

export interface TimingResult {
  timeLabel: string;
  timeRange: string;
  score: number;
  level: TimingLevel;
  reasons: string[];
  advice: string;
  professionalExplanation: string;
  warnings: string[];
}

type PalaceScore = {
  palace: QimenPalace;
  score: number;
  reasons: string[];
  warningReasons: string[];
};

const generallyFavorableDoors: QimenDoor[] = ["开门", "生门", "休门"];
const generallyUnfavorableDoors: QimenDoor[] = ["死门", "惊门"];

const supportiveStars: QimenStar[] = ["天辅", "天心", "天任", "天英"];
const cautiousStars: QimenStar[] = ["天蓬", "天芮", "天柱"];

const supportiveDeities: QimenDeity[] = ["值符", "太阴", "六合", "九天", "九地"];
const cautiousDeities: QimenDeity[] = ["白虎", "玄武", "腾蛇"];

export function analyzeEventTiming(chart: QimenChart, eventRule: EventRule): TimingResult {
  const palaceScores = chart.palaces.map((palace) => scorePalaceForEvent(palace, eventRule));
  const bestScore = palaceScores.sort((left, right) => right.score - left.score)[0];

  if (!bestScore) {
    const fallbackLevel: TimingLevel = "平稳";
    return {
      timeLabel: "当前盘",
      timeRange: "mock 起盘时刻",
      score: 50,
      level: fallbackLevel,
      reasons: ["当前 mock 盘暂无可评分宫位，暂以基础分作为参考。"],
      advice: "当前仅可作为学习结构参考，建议等待盘面数据完整后再分析。",
      professionalExplanation: "评分函数未接真实排盘算法，当前无法形成宫位级分析。",
      warnings: [eventRule.riskDisclaimer],
    };
  }

  const score = clampScore(bestScore.score);
  const level = getTimingLevel(score);
  const reasons = bestScore.reasons.length > 0 ? bestScore.reasons : ["以基础分 50 起算，当前宫位暂无明显加减分项。"];

  return {
    timeLabel: `当前起盘：${formatDateTime(chart.chartTime)}`,
    timeRange: "当前 mock 盘时刻",
    score,
    level,
    reasons,
    advice: renderPlainAdvice(eventRule, { palace: bestScore.palace, score, level }),
    professionalExplanation: renderProfessionalExplanation(eventRule, { palace: bestScore.palace, score, level }, reasons),
    warnings: buildWarnings(eventRule, bestScore.warningReasons),
  };
}

export function scorePalaceForEvent(palace: QimenPalace, eventRule: EventRule): PalaceScore {
  let score = eventRule.scoringWeights.base;
  const reasons: string[] = [`基础分 ${eventRule.scoringWeights.base}。`];
  const warningReasons: string[] = [];

  const doorScore = scoreDoor(palace.door, eventRule);
  score += doorScore.delta;
  reasons.push(doorScore.reason);
  if (doorScore.warning) warningReasons.push(doorScore.warning);

  const starScore = scoreStar(palace.star, eventRule);
  score += starScore.delta;
  reasons.push(starScore.reason);
  if (starScore.warning) warningReasons.push(starScore.warning);

  const deityScore = scoreDeity(palace.deity, eventRule);
  score += deityScore.delta;
  reasons.push(deityScore.reason);
  if (deityScore.warning) warningReasons.push(deityScore.warning);

  const stateScores = scorePalaceStates(palace);
  stateScores.forEach((item) => {
    score += item.delta;
    reasons.push(item.reason);
    if (item.warning) warningReasons.push(item.warning);
  });

  palace.patterns.forEach((pattern) => {
    if (pattern.level === "较适合") {
      score += 15;
      reasons.push(`格局“${pattern.name}”${describePatternLevel(pattern.level)}，按状态规则加 15 分。`);
    }

    if (pattern.level === "慎用") {
      score -= 20;
      reasons.push(`格局“${pattern.name}”${describePatternLevel(pattern.level)}，按状态规则减 20 分。`);
      warningReasons.push(`格局“${pattern.name}”提示慎用，建议先复核条件。`);
    }

    if (eventRule.positivePatterns.includes(pattern.name)) {
      score += eventRule.scoringWeights.positivePattern;
      reasons.push(`命中事件正向格局“${pattern.name}”，加 ${eventRule.scoringWeights.positivePattern} 分。`);
    }

    if (eventRule.negativePatterns.includes(pattern.name)) {
      score -= eventRule.scoringWeights.negativePattern;
      reasons.push(`命中事件风险格局“${pattern.name}”，减 ${eventRule.scoringWeights.negativePattern} 分。`);
      warningReasons.push(`事件规则将“${pattern.name}”列为风险格局。`);
    }
  });

  return {
    palace,
    score: clampScore(score),
    reasons: compactReasons(reasons),
    warningReasons,
  };
}

function scoreDoor(door: QimenDoor, eventRule: EventRule) {
  if (eventRule.favorableDoors.includes(door)) {
    return {
      delta: eventRule.scoringWeights.door,
      reason: `${door}符合“${eventRule.name}”的行动入口，八门加 ${eventRule.scoringWeights.door} 分。`,
    };
  }

  if (eventRule.unfavorableDoors.includes(door)) {
    return {
      delta: -eventRule.scoringWeights.door,
      reason: `${door}不利于“${eventRule.name}”的顺畅推进，八门减 ${eventRule.scoringWeights.door} 分。`,
      warning: `${door}提示此事项需放慢节奏或调整入口。`,
    };
  }

  if (generallyFavorableDoors.includes(door)) {
    return {
      delta: 6,
      reason: `${door}通常有助于启动、资源或调和，作为通用八门修正加 6 分。`,
    };
  }

  if (generallyUnfavorableDoors.includes(door)) {
    return {
      delta: -8,
      reason: `${door}通常提示阻滞或惊扰，作为通用八门修正减 8 分。`,
      warning: `${door}为通用慎用门，建议核实现实条件。`,
    };
  }

  return {
    delta: 0,
    reason: `${door}对“${eventRule.name}”暂无明显加减分，保持基础参考。`,
  };
}

function scoreStar(star: QimenStar, eventRule: EventRule) {
  if (eventRule.favorableStars.includes(star)) {
    return {
      delta: eventRule.scoringWeights.star,
      reason: `${star}符合“${eventRule.name}”的事务状态，九星加 ${eventRule.scoringWeights.star} 分。`,
    };
  }

  if (eventRule.unfavorableStars.includes(star)) {
    return {
      delta: -eventRule.scoringWeights.star,
      reason: `${star}对“${eventRule.name}”提示需要谨慎，九星减 ${eventRule.scoringWeights.star} 分。`,
      warning: `${star}在此事件中偏慎用，建议增加现实校验。`,
    };
  }

  if (supportiveStars.includes(star)) {
    return {
      delta: 5,
      reason: `${star}${getStarSupportText(star)}，作为通用九星修正加 5 分。`,
    };
  }

  if (cautiousStars.includes(star)) {
    return {
      delta: -5,
      reason: `${star}在多数事务中需谨慎观察，作为通用九星修正减 5 分。`,
      warning: `${star}提示存在不稳定或需复核因素。`,
    };
  }

  return {
    delta: 0,
    reason: `${star}保持参考，不作额外加减分。`,
  };
}

function scoreDeity(deity: QimenDeity, eventRule: EventRule) {
  if (eventRule.favorableDeities.includes(deity)) {
    return {
      delta: eventRule.scoringWeights.deity,
      reason: `${deity}符合“${eventRule.name}”的外部配合象，八神加 ${eventRule.scoringWeights.deity} 分。`,
    };
  }

  if (eventRule.unfavorableDeities.includes(deity)) {
    return {
      delta: -eventRule.scoringWeights.deity,
      reason: `${deity}对“${eventRule.name}”提示风险，八神减 ${eventRule.scoringWeights.deity} 分。`,
      warning: `${deity}提示需注意信息误差、冲突或隐性成本。`,
    };
  }

  if (supportiveDeities.includes(deity)) {
    return {
      delta: 4,
      reason: `${deity}通常有助于秩序、配合或稳定，作为通用八神修正加 4 分。`,
    };
  }

  if (cautiousDeities.includes(deity)) {
    return {
      delta: -5,
      reason: `${deity}通常提示风险或干扰，作为通用八神修正减 5 分。`,
      warning: `${deity}提示需保留风险预案。`,
    };
  }

  return {
    delta: 0,
    reason: `${deity}保持参考，不作额外加减分。`,
  };
}

function scorePalaceStates(palace: QimenPalace) {
  const scores: Array<{ delta: number; reason: string; warning?: string }> = [];

  if (palace.isEmpty) {
    scores.push({
      delta: -20,
      reason: "宫位空亡，按状态规则减 20 分。",
      warning: "空亡提示信息或力量暂时落空，建议先核实条件。",
    });
  }

  if (palace.isDoorForced) {
    scores.push({
      delta: -20,
      reason: "宫位门迫，按状态规则减 20 分。",
      warning: "门迫提示行动入口受制，推进成本可能增加。",
    });
  }

  if (palace.isTomb) {
    scores.push({
      delta: -15,
      reason: "宫位入墓，按状态规则减 15 分。",
      warning: "入墓提示事项有收束、迟滞或不宜强推的倾向。",
    });
  }

  if (palace.isPunishment) {
    scores.push({
      delta: -20,
      reason: "宫位击刑，按状态规则减 20 分。",
      warning: "击刑提示冲突或压力信号，建议谨慎处理。",
    });
  }

  return scores;
}

function getTimingLevel(score: number): TimingLevel {
  if (score >= 80) return "较宜";
  if (score >= 65) return "可用";
  if (score >= 50) return "平稳";
  if (score >= 35) return "慎用";
  return "不建议";
}

function getStarSupportText(star: QimenStar) {
  switch (star) {
    case "天辅":
      return "利学习文书";
    case "天心":
      return "利决策、医药与技术";
    case "天任":
      return "利稳定、土地与积累";
    case "天英":
      return "利传播、名声与展示";
    default:
      return "可作为参考";
  }
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function compactReasons(reasons: string[]) {
  return reasons.filter((reason, index, list) => reason.trim().length > 0 && list.indexOf(reason) === index);
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}
