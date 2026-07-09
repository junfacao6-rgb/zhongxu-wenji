export type ReadingState = {
  completedOrders: string[];
  currentOrder: string;
  note: string;
  updatedAt: string;
};

export const readingStoragePrefix = "zhongxu-reading:";

export const emptyReadingState: ReadingState = {
  completedOrders: [],
  currentOrder: "",
  note: "",
  updatedAt: "",
};

export function getReadingStorageKey(classicId: string) {
  return `${readingStoragePrefix}${classicId}`;
}

export function normalizeReadingState(value: unknown, fallbackOrder = ""): ReadingState {
  if (!value || typeof value !== "object") return { ...emptyReadingState, currentOrder: fallbackOrder };
  const draft = value as Partial<ReadingState>;
  return {
    completedOrders: Array.isArray(draft.completedOrders) ? draft.completedOrders.filter((item) => typeof item === "string") : [],
    currentOrder: typeof draft.currentOrder === "string" && draft.currentOrder ? draft.currentOrder : fallbackOrder,
    note: typeof draft.note === "string" ? draft.note : "",
    updatedAt: typeof draft.updatedAt === "string" ? draft.updatedAt : "",
  };
}

export function formatReadingSavedTime(value: string) {
  if (!value) return "尚未保存";
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
