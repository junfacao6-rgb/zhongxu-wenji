import type { ClassicCategory } from "@/lib/culture-content";

export type LocalClassicChapter = {
  order: string;
  title: string;
  original: string;
  translation: string;
  notes: string[];
};

export type LocalClassicCollationLog = {
  id: string;
  chapterOrder: string;
  chapterTitle: string;
  summary: string;
  updatedAt: string;
};

export const localCollationStatuses = ["待校勘", "校勘中", "已初校", "已定稿"] as const;

export type LocalClassicCollationStatus = (typeof localCollationStatuses)[number];

export type LocalClassicRecord = {
  id: string;
  sourceDraftId: string;
  title: string;
  category: Exclude<ClassicCategory, "全部">;
  sourceType: string;
  author: string;
  dynasty: string;
  edition: string;
  sourceNote: string;
  collationStatus: LocalClassicCollationStatus;
  chapterCount: number;
  cjkCount: number;
  keywords: string[];
  matchedTerms: string[];
  suggestedPaths: string[];
  readinessScore: number;
  chapters: LocalClassicChapter[];
  collationLogs: LocalClassicCollationLog[];
  createdAt: string;
  updatedAt: string;
};

export const localClassicsStorageKey = "zhongxu-local-classics";

function normalizeCategory(value: unknown): Exclude<ClassicCategory, "全部"> {
  if (value === "道家经典" || value === "命理典籍" || value === "术数方法" || value === "修习笔记") return value;
  return "道家经典";
}

function normalizeText(value: unknown) {
  return typeof value === "string" ? value : "";
}

function normalizeCollationStatus(value: unknown): LocalClassicCollationStatus {
  return localCollationStatuses.includes(value as LocalClassicCollationStatus) ? (value as LocalClassicCollationStatus) : "待校勘";
}

function normalizeChapter(value: unknown, index: number): LocalClassicChapter | null {
  if (!value || typeof value !== "object") return null;
  const chapter = value as Partial<LocalClassicChapter>;
  const original = typeof chapter.original === "string" ? chapter.original : "";
  if (!original.trim()) return null;

  return {
    order: typeof chapter.order === "string" && chapter.order ? chapter.order : String(index + 1).padStart(2, "0"),
    title: typeof chapter.title === "string" && chapter.title ? chapter.title : `第 ${index + 1} 章`,
    original,
    translation: typeof chapter.translation === "string" ? chapter.translation : "待补白话",
    notes: Array.isArray(chapter.notes) ? chapter.notes.filter((item) => typeof item === "string") : [],
  };
}

function normalizeCollationLog(value: unknown, index: number): LocalClassicCollationLog | null {
  if (!value || typeof value !== "object") return null;
  const log = value as Partial<LocalClassicCollationLog>;
  if (typeof log.chapterOrder !== "string" || !log.chapterOrder) return null;

  return {
    id: typeof log.id === "string" && log.id ? log.id : `log-${index}`,
    chapterOrder: log.chapterOrder,
    chapterTitle: typeof log.chapterTitle === "string" ? log.chapterTitle : "",
    summary: typeof log.summary === "string" ? log.summary : "更新校勘内容",
    updatedAt: typeof log.updatedAt === "string" ? log.updatedAt : "",
  };
}

function normalizeLocalClassic(value: unknown): LocalClassicRecord | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Partial<LocalClassicRecord>;
  if (typeof record.id !== "string" || !record.id) return null;
  if (typeof record.title !== "string" || !record.title.trim()) return null;

  const chapters = Array.isArray(record.chapters)
    ? record.chapters.map((chapter, index) => normalizeChapter(chapter, index)).filter((chapter): chapter is LocalClassicChapter => Boolean(chapter))
    : [];
  const collationLogs = Array.isArray(record.collationLogs)
    ? record.collationLogs.map((log, index) => normalizeCollationLog(log, index)).filter((log): log is LocalClassicCollationLog => Boolean(log))
    : [];

  return {
    id: record.id,
    sourceDraftId: typeof record.sourceDraftId === "string" ? record.sourceDraftId : "",
    title: record.title,
    category: normalizeCategory(record.category),
    sourceType: typeof record.sourceType === "string" ? record.sourceType : "TXT / Markdown",
    author: normalizeText(record.author),
    dynasty: normalizeText(record.dynasty),
    edition: normalizeText(record.edition),
    sourceNote: normalizeText(record.sourceNote),
    collationStatus: normalizeCollationStatus(record.collationStatus),
    chapterCount: typeof record.chapterCount === "number" ? record.chapterCount : chapters.length,
    cjkCount: typeof record.cjkCount === "number" ? record.cjkCount : 0,
    keywords: Array.isArray(record.keywords) ? record.keywords.filter((item) => typeof item === "string") : [],
    matchedTerms: Array.isArray(record.matchedTerms) ? record.matchedTerms.filter((item) => typeof item === "string") : [],
    suggestedPaths: Array.isArray(record.suggestedPaths) ? record.suggestedPaths.filter((item) => typeof item === "string") : [],
    readinessScore: typeof record.readinessScore === "number" ? record.readinessScore : 0,
    chapters,
    collationLogs,
    createdAt: typeof record.createdAt === "string" ? record.createdAt : "",
    updatedAt: typeof record.updatedAt === "string" ? record.updatedAt : "",
  };
}

export function normalizeLocalClassicsPayload(value: unknown) {
  const source =
    Array.isArray(value)
      ? value
      : value && typeof value === "object" && Array.isArray((value as { records?: unknown }).records)
        ? (value as { records: unknown[] }).records
        : [];

  return source
    .map((item) => normalizeLocalClassic(item))
    .filter((item): item is LocalClassicRecord => Boolean(item))
    .sort((a, b) => Date.parse(b.updatedAt || "0") - Date.parse(a.updatedAt || "0"));
}

export function makeLocalClassicId(title: string) {
  const normalized = title.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\u4e00-\u9fff-]/g, "");
  return `local-${normalized || "classic"}-${Date.now()}`;
}

export function readLocalClassics() {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(localClassicsStorageKey);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return normalizeLocalClassicsPayload(parsed);
  } catch {
    return [];
  }
}

export function writeLocalClassics(records: LocalClassicRecord[]) {
  window.localStorage.setItem(localClassicsStorageKey, JSON.stringify(records));
}

export function upsertLocalClassic(record: LocalClassicRecord) {
  const current = readLocalClassics();
  const next = [record, ...current.filter((item) => item.id !== record.id)].sort(
    (a, b) => Date.parse(b.updatedAt || "0") - Date.parse(a.updatedAt || "0"),
  );
  writeLocalClassics(next);
  return next;
}

export function removeLocalClassic(id: string) {
  const next = readLocalClassics().filter((item) => item.id !== id);
  writeLocalClassics(next);
  return next;
}

export function formatLocalClassicTime(value: string) {
  if (!value) return "尚未入藏";
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
