import type { BookItem } from "@/lib/site-content";
import { getReadingRecordStorageKey } from "@/lib/wengu-library";

export type WenguReadingRecord = {
  bookId: string;
  title: string;
  chapterIndex: number;
  chapterTitle?: string;
  progressPercent?: number;
  updatedAt?: string;
};

export function parseWenguReadingRecord(book: Pick<BookItem, "id" | "title">, value: string | null) {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as Partial<WenguReadingRecord>;
    return {
      bookId: book.id,
      title: book.title,
      chapterIndex: typeof parsed.chapterIndex === "number" ? parsed.chapterIndex : 0,
      chapterTitle: typeof parsed.chapterTitle === "string" ? parsed.chapterTitle : undefined,
      progressPercent: typeof parsed.progressPercent === "number" ? parsed.progressPercent : undefined,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : undefined,
    } satisfies WenguReadingRecord;
  } catch {
    window.localStorage.removeItem(getReadingRecordStorageKey(book.id));
    return null;
  }
}

export function readWenguReadingRecords(books: BookItem[]) {
  if (typeof window === "undefined") return [];

  return books
    .flatMap((book) => {
      const record = parseWenguReadingRecord(book, window.localStorage.getItem(getReadingRecordStorageKey(book.id)));
      return record ? [record] : [];
    })
    .sort((left, right) => {
      const leftTime = left.updatedAt ? Date.parse(left.updatedAt) : 0;
      const rightTime = right.updatedAt ? Date.parse(right.updatedAt) : 0;
      return rightTime - leftTime;
    });
}

export function writeWenguReadingRecord(record: WenguReadingRecord) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getReadingRecordStorageKey(record.bookId), JSON.stringify(record));
}
