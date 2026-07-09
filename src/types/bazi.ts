import type { EvidenceRef, ISODateString, SubjectKey } from "./platform";

export type BaziStem = "甲" | "乙" | "丙" | "丁" | "戊" | "己" | "庚" | "辛" | "壬" | "癸";

export type BaziBranch = "子" | "丑" | "寅" | "卯" | "辰" | "巳" | "午" | "未" | "申" | "酉" | "戌" | "亥";

export type TenGod = "比肩" | "劫财" | "食神" | "伤官" | "偏财" | "正财" | "七杀" | "正官" | "偏印" | "正印";

export interface BaziPillar {
  stem: BaziStem;
  branch: BaziBranch;
  hiddenStems: BaziStem[];
  tenGod?: TenGod;
  label: "年柱" | "月柱" | "日柱" | "时柱";
}

export interface DayMasterAnalysis {
  dayMaster: BaziStem;
  season: string;
  strengthLevel: "偏弱" | "中和" | "偏旺" | "从势待判";
  summary: string;
  evidenceRefs: EvidenceRef[];
}

export interface UsefulGodAnalysis {
  usefulGods: string[];
  avoidGods: string[];
  reasoning: string;
  cautions: string[];
  evidenceRefs: EvidenceRef[];
}

export interface LuckCycle {
  id: string;
  startAge: number;
  endAge: number;
  stem: BaziStem;
  branch: BaziBranch;
  summary: string;
}

export interface BaziChart {
  id: string;
  subject: Extract<SubjectKey, "bazi">;
  title: string;
  birthTimeLabel: string;
  year: BaziPillar;
  month: BaziPillar;
  day: BaziPillar;
  hour: BaziPillar;
  dayMasterAnalysis: DayMasterAnalysis;
  usefulGodAnalysis?: UsefulGodAnalysis;
  luckCycles: LuckCycle[];
  disclaimer: string;
  createdAt: ISODateString;
}

export interface BaziLearningCase {
  id: string;
  title: string;
  topic: string;
  pillarsLabel?: string;
  chart?: BaziChart;
  structureHint?: string;
  learningFocus?: string[];
  scopeNote?: string;
  sourceSegmentIds: string[];
  termIds: string[];
  analysisSteps: string[];
  reviewQuestions: string[];
  evidenceRefs: EvidenceRef[];
}
