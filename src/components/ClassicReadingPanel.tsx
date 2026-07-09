"use client";

import { useEffect, useMemo, useState } from "react";
import { BookmarkCheck, CheckCircle2, ClipboardCopy, RotateCcw, ScrollText } from "lucide-react";
import type { ClassicChapter, ClassicRecord } from "@/lib/culture-content";
import {
  emptyReadingState,
  formatReadingSavedTime,
  getReadingStorageKey,
  normalizeReadingState,
  type ReadingState,
} from "@/lib/reading-storage";

export default function ClassicReadingPanel({ record, chapters }: { record: ClassicRecord; chapters: ClassicChapter[] }) {
  const fallbackOrder = chapters[0]?.order ?? "";
  const storageKey = getReadingStorageKey(record.id);
  const [hydrated, setHydrated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [state, setState] = useState<ReadingState>({ ...emptyReadingState, currentOrder: fallbackOrder });

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      setState(stored ? normalizeReadingState(JSON.parse(stored), fallbackOrder) : { ...emptyReadingState, currentOrder: fallbackOrder });
    } catch {
      setState({ ...emptyReadingState, currentOrder: fallbackOrder });
    } finally {
      setHydrated(true);
    }
  }, [fallbackOrder, storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [hydrated, state, storageKey]);

  const currentChapter = chapters.find((chapter) => chapter.order === state.currentOrder) ?? chapters[0];
  const completedSet = useMemo(() => new Set(state.completedOrders), [state.completedOrders]);
  const completedCount = chapters.filter((chapter) => completedSet.has(chapter.order)).length;
  const progress = chapters.length ? Math.round((completedCount / chapters.length) * 100) : 0;
  const exportText = useMemo(() => {
    const completedTitles = chapters
      .filter((chapter) => completedSet.has(chapter.order))
      .map((chapter) => `${chapter.order} ${chapter.title}`)
      .join("、");

    return [
      `《${record.title}》研读留痕`,
      `当前章节：${currentChapter ? `${currentChapter.order} ${currentChapter.title}` : "未选择"}`,
      `已读进度：${completedCount}/${chapters.length}`,
      `已读章节：${completedTitles || "暂无"}`,
      "",
      "摘记：",
      state.note.trim() || "暂无摘记",
    ].join("\n");
  }, [chapters, completedCount, completedSet, currentChapter, record.title, state.note]);

  function updateState(partial: Partial<ReadingState>) {
    setState((previous) => ({
      ...previous,
      ...partial,
      updatedAt: new Date().toISOString(),
    }));
  }

  function toggleChapter(order: string) {
    const nextCompleted = completedSet.has(order)
      ? state.completedOrders.filter((item) => item !== order)
      : [...state.completedOrders, order];
    updateState({
      completedOrders: nextCompleted,
      currentOrder: order,
    });
  }

  async function copyExport() {
    try {
      await navigator.clipboard.writeText(exportText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  function resetReading() {
    updateState({
      completedOrders: [],
      currentOrder: fallbackOrder,
      note: "",
    });
  }

  return (
    <section className="rounded-[8px] border border-[#463722] bg-[#120e0a] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <BookmarkCheck className="text-[#d8b642]" size={24} />
          <div>
            <p className="text-sm text-[#b99758]">研读留痕</p>
            <h2 className="text-2xl font-semibold text-[#fff4d7]">标记进度，留下自己的摘记</h2>
          </div>
        </div>
        <div className="rounded-[8px] border border-[#33291f] bg-[#080706] px-4 py-3 text-right">
          <p className="text-xs text-[#8d7a61]">本机保存</p>
          <p className="mt-1 text-sm text-[#d8c8aa]">{formatReadingSavedTime(state.updatedAt)}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="rounded-[8px] border border-[#33291f] bg-[#080706] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[#b99758]">已读进度</p>
              <strong className="mt-1 block text-3xl text-[#fff4d7]">{progress}%</strong>
            </div>
            <span className="rounded-full border border-[#463722] px-3 py-1 text-xs text-[#cab89b]">
              {completedCount}/{chapters.length} 节
            </span>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#21190f]">
            <div className="h-full rounded-full bg-[#d8b642]" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-5 grid gap-2">
            {chapters.map((chapter) => {
              const done = completedSet.has(chapter.order);
              const current = currentChapter?.order === chapter.order;
              return (
                <button
                  key={chapter.order}
                  type="button"
                  onClick={() => toggleChapter(chapter.order)}
                  className={`flex items-start gap-3 rounded-[8px] border p-3 text-left transition ${
                    current ? "border-[#d8b642] bg-[#1d160f]" : "border-[#33291f] bg-[#100c09] hover:border-[#806739]"
                  }`}
                >
                  <span
                    className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border ${
                      done ? "border-[#8aa076] bg-[#1f2a18] text-[#b8d49b]" : "border-[#4a3b28] text-[#8d7a61]"
                    }`}
                  >
                    {done ? <CheckCircle2 size={15} /> : chapter.order}
                  </span>
                  <span>
                    <strong className="block text-sm text-[#fff4d7]">{chapter.title}</strong>
                    <span className="mt-1 block text-xs leading-5 text-[#8d7a61]">{chapter.theme}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4">
          <section className="rounded-[8px] border border-[#33291f] bg-[#080706] p-5">
            <div className="flex items-center gap-2 text-[#d8b642]">
              <ScrollText size={18} />
              <strong>当前摘句</strong>
            </div>
            <p className="mt-3 text-lg leading-9 text-[#fff4d7]">{currentChapter?.original ?? "等待补入原文。"}</p>
            <p className="mt-3 text-sm leading-7 text-[#a99575]">{currentChapter?.translation ?? record.excerpt}</p>
          </section>

          <label className="grid gap-3 rounded-[8px] border border-[#33291f] bg-[#080706] p-5 text-sm text-[#c8b692]">
            我的摘记
            <textarea
              value={state.note}
              onChange={(event) => updateState({ note: event.target.value })}
              className="min-h-[190px] w-full resize-y rounded-[8px] border border-[#3a3026] bg-[#100c09] p-4 text-sm leading-7 text-[#f4ead4] outline-none focus:border-[#d8b642]"
              placeholder="写下这一章对当下事务、修身或判断方法的启发。"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={copyExport}
              className="inline-flex items-center gap-2 rounded-[8px] bg-[#d8b642] px-4 py-2 text-sm font-semibold text-[#120e09]"
            >
              <ClipboardCopy size={16} />
              {copied ? "已复制" : "复制整理稿"}
            </button>
            <button
              type="button"
              onClick={resetReading}
              className="inline-flex items-center gap-2 rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm text-[#e8c86e]"
            >
              <RotateCcw size={16} />
              重置留痕
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
