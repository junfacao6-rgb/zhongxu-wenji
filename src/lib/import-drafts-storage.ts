export type ClassicImportDraft = {
  id: string;
  title: string;
  category: string;
  sourceType: string;
  author: string;
  dynasty: string;
  edition: string;
  sourceNote: string;
  rawText: string;
  chapterCount: number;
  cjkCount: number;
  keywords: string[];
  updatedAt: string;
};

export const importDraftsStorageKey = "zhongxu-import-drafts";

function normalizeDraft(value: unknown): ClassicImportDraft | null {
  if (!value || typeof value !== "object") return null;
  const draft = value as Partial<ClassicImportDraft>;
  if (typeof draft.id !== "string" || !draft.id) return null;
  if (typeof draft.title !== "string") return null;
  if (typeof draft.rawText !== "string") return null;

  return {
    id: draft.id,
    title: draft.title,
    category: typeof draft.category === "string" ? draft.category : "道家经典",
    sourceType: typeof draft.sourceType === "string" ? draft.sourceType : "TXT / Markdown",
    author: typeof draft.author === "string" ? draft.author : "",
    dynasty: typeof draft.dynasty === "string" ? draft.dynasty : "",
    edition: typeof draft.edition === "string" ? draft.edition : "",
    sourceNote: typeof draft.sourceNote === "string" ? draft.sourceNote : "",
    rawText: draft.rawText,
    chapterCount: typeof draft.chapterCount === "number" ? draft.chapterCount : 0,
    cjkCount: typeof draft.cjkCount === "number" ? draft.cjkCount : 0,
    keywords: Array.isArray(draft.keywords) ? draft.keywords.filter((item) => typeof item === "string") : [],
    updatedAt: typeof draft.updatedAt === "string" ? draft.updatedAt : "",
  };
}

export function readImportDrafts() {
  try {
    const stored = window.localStorage.getItem(importDraftsStorageKey);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => normalizeDraft(item))
      .filter((item): item is ClassicImportDraft => Boolean(item))
      .sort((a, b) => Date.parse(b.updatedAt || "0") - Date.parse(a.updatedAt || "0"));
  } catch {
    return [];
  }
}

export function writeImportDrafts(drafts: ClassicImportDraft[]) {
  window.localStorage.setItem(importDraftsStorageKey, JSON.stringify(drafts));
}

export function formatImportDraftTime(value: string) {
  if (!value) return "尚未保存";
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
