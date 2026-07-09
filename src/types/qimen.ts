import type { EvidenceRef, ISODateString, ReviewStatus, Visibility } from "./platform";

export type QimenDoor = "休门" | "生门" | "伤门" | "杜门" | "景门" | "死门" | "惊门" | "开门";

export type QimenStar = "天蓬" | "天任" | "天冲" | "天辅" | "天英" | "天芮" | "天柱" | "天心" | "天禽";

export type QimenDeity = "值符" | "腾蛇" | "太阴" | "六合" | "白虎" | "玄武" | "九地" | "九天";

export type QimenStem = "甲" | "乙" | "丙" | "丁" | "戊" | "己" | "庚" | "辛" | "壬" | "癸";

export interface QimenPattern {
  id: string;
  name: string;
  level: "参考" | "较适合" | "慎用";
  summary: string;
  evidenceRefs: EvidenceRef[];
}

export interface QimenPalace {
  palaceNumber: number;
  palaceName: string;
  trigram: string;
  direction: string;
  element: "木" | "火" | "土" | "金" | "水";
  heavenlyStem: QimenStem;
  earthlyStem: QimenStem;
  door: QimenDoor;
  star: QimenStar;
  deity: QimenDeity;
  branches: string[];
  isEmpty: boolean;
  isTomb: boolean;
  isDoorForced: boolean;
  isPunishment: boolean;
  patterns: QimenPattern[];
  score: number;
  explanation: string;
}

export interface QimenChart {
  id: string;
  title: string;
  chartTime: ISODateString;
  question?: string;
  juType: "阳遁" | "阴遁";
  juNumber: number;
  dutyStar: QimenStar;
  dutyDoor: QimenDoor;
  palaces: QimenPalace[];
  disclaimer: string;
  createdAt: ISODateString;
}

export interface QimenEventRule {
  id: string;
  eventType: string;
  title: string;
  description: string;
  suitablePatterns: string[];
  cautionPatterns: string[];
  evidenceRefs: EvidenceRef[];
  reviewStatus: ReviewStatus;
}

export interface QimenTimingResult {
  id: string;
  eventType: string;
  timeRange: string;
  suggestedTime: string;
  level: "较适合" | "可参考" | "慎用";
  reasons: string[];
  cautions: string[];
  chartId?: string;
  evidenceRefs: EvidenceRef[];
  disclaimer: string;
}

export interface QimenReport {
  id: string;
  title: string;
  chartId?: string;
  timingResultId?: string;
  summary: string;
  sections: {
    title: string;
    body: string;
    evidenceRefs: EvidenceRef[];
  }[];
  visibility: Visibility;
  createdAt: ISODateString;
}
