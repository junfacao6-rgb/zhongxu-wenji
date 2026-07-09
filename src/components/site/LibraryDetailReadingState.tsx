"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { WenguReadingRecord } from "@/lib/wengu-reading-progress";
import { parseWenguReadingRecord } from "@/lib/wengu-reading-progress";
import { getReadingRecordStorageKey } from "@/lib/wengu-library";

type LibraryDetailReadingStateProps = {
  bookId: string;
  title: string;
  sourceHref?: string;
};

export default function LibraryDetailReadingState({ bookId, title, sourceHref }: LibraryDetailReadingStateProps) {
  const [record, setRecord] = useState<WenguReadingRecord | null>(null);

  useEffect(() => {
    const parsed = parseWenguReadingRecord({ id: bookId, title }, window.localStorage.getItem(getReadingRecordStorageKey(bookId)));
    setRecord(parsed);
  }, [bookId, title]);

  if (!record) {
    return (
      <aside className="wen-gu-detail-progress">
        <strong>尚未开卷</strong>
        <span>开始阅读后，本机将记住最近读到的位置。</span>
      </aside>
    );
  }

  const recordHref = record.chapterTitle === "原书影像" || record.chapterTitle === "提取文字"
    ? sourceHref ?? `/library/${bookId}/read?chapter=${record.chapterIndex + 1}`
    : `/library/${bookId}/read?chapter=${record.chapterIndex + 1}`;

  return (
    <aside className="wen-gu-detail-progress">
      <strong>上次读到</strong>
      <span>
        {record.chapterTitle ?? `第 ${record.chapterIndex + 1} 章`}
        {typeof record.progressPercent === "number" ? ` · ${record.progressPercent}%` : ""}
      </span>
      <div>
        <Link href={recordHref}>继续阅读</Link>
        {sourceHref ? <Link href={sourceHref}>打开原书</Link> : null}
      </div>
    </aside>
  );
}
