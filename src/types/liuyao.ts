import type { EvidenceRef, ISODateString, SubjectKey } from "./platform";

export type Liuqin = "父母" | "兄弟" | "子孙" | "妻财" | "官鬼";

export type Liushen = "青龙" | "朱雀" | "勾陈" | "腾蛇" | "白虎" | "玄武";

export interface LiuyaoLine {
  position: number;
  name: string;
  isYang: boolean;
  isMoving: boolean;
  liuqin: Liuqin;
  liushen: Liushen;
  earthlyBranch: string;
  element: "木" | "火" | "土" | "金" | "水";
  isShi: boolean;
  isYing: boolean;
  note?: string;
}

export interface LiuyaoHexagram {
  id: string;
  subject: Extract<SubjectKey, "liuyao">;
  question: string;
  method: "manual" | "time" | "number" | "coin" | "mock";
  baseName: string;
  changedName?: string;
  lines: LiuyaoLine[];
  createdAt: ISODateString;
  disclaimer: string;
}

export interface YongshenAnalysis {
  yongshen: Liuqin;
  reason: string;
  relatedLinePositions: number[];
  cautions: string[];
  evidenceRefs: EvidenceRef[];
}

export interface MovingLineAnalysis {
  movingPositions: number[];
  summary: string;
  possibleChanges: string[];
  cautions: string[];
  evidenceRefs: EvidenceRef[];
}

export interface LiuyaoCase {
  id: string;
  title: string;
  questionType: string;
  question: string;
  hexagram: LiuyaoHexagram;
  yongshenAnalysis: YongshenAnalysis;
  movingLineAnalysis: MovingLineAnalysis;
  learningFocus?: string[];
  scopeNote?: string;
  resultReview?: string;
  sourceSegmentIds: string[];
  termIds: string[];
  evidenceRefs: EvidenceRef[];
}
