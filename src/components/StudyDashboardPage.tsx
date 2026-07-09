"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpenText,
  CheckCircle2,
  ClipboardCopy,
  FileText,
  Layers3,
  LibraryBig,
  NotebookTabs,
  ScrollText,
  Sparkles,
} from "lucide-react";
import { classicRecords, getChaptersForClassic, studyRituals } from "@/lib/culture-content";
import { formatImportDraftTime, readImportDrafts, type ClassicImportDraft } from "@/lib/import-drafts-storage";
import { readLocalClassics, type LocalClassicRecord } from "@/lib/local-classics-storage";
import { formatReadingSavedTime, getReadingStorageKey, normalizeReadingState, type ReadingState } from "@/lib/reading-storage";

type ReadingSummary = {
  id: string;
  title: string;
  category: string;
  focus: string;
  totalChapters: number;
  completedCount: number;
  progress: number;
  currentTitle: string;
  note: string;
  updatedAt: string;
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function buildExportText(items: ReadingSummary[]) {
  const noted = items.filter((item) => item.note.trim());
  if (!noted.length) return "暂无研读摘记";

  return noted
    .map((item) =>
      [
        `《${item.title}》`,
        `进度：${item.completedCount}/${item.totalChapters}`,
        `当前：${item.currentTitle}`,
        `摘记：${item.note.trim()}`,
      ].join("\n"),
    )
    .join("\n\n");
}

export default function StudyDashboardPage() {
  const [readingStates, setReadingStates] = useState<Record<string, ReadingState>>({});
  const [importDrafts, setImportDrafts] = useState<ClassicImportDraft[]>([]);
  const [localClassics, setLocalClassics] = useState<LocalClassicRecord[]>([]);
  const [ritualDone, setRitualDone] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const ritualStorageKey = `zhongxu-rituals:${todayKey()}`;

  useEffect(() => {
    const nextStates: Record<string, ReadingState> = {};
    for (const record of classicRecords) {
      const fallbackOrder = getChaptersForClassic(record.id)[0]?.order ?? "";
      try {
        const stored = window.localStorage.getItem(getReadingStorageKey(record.id));
        nextStates[record.id] = stored ? normalizeReadingState(JSON.parse(stored), fallbackOrder) : normalizeReadingState(null, fallbackOrder);
      } catch {
        nextStates[record.id] = normalizeReadingState(null, fallbackOrder);
      }
    }

    try {
      const storedRituals = window.localStorage.getItem(ritualStorageKey);
      setRitualDone(storedRituals ? JSON.parse(storedRituals) : []);
    } catch {
      setRitualDone([]);
    }

    setReadingStates(nextStates);
    setImportDrafts(readImportDrafts());
    setLocalClassics(readLocalClassics());
  }, [ritualStorageKey]);

  useEffect(() => {
    window.localStorage.setItem(ritualStorageKey, JSON.stringify(ritualDone));
  }, [ritualDone, ritualStorageKey]);

  const summaries = useMemo<ReadingSummary[]>(() => {
    return classicRecords.map((record) => {
      const chapters = getChaptersForClassic(record.id);
      const state = readingStates[record.id] ?? normalizeReadingState(null, chapters[0]?.order ?? "");
      const completed = chapters.filter((chapter) => state.completedOrders.includes(chapter.order));
      const currentChapter = chapters.find((chapter) => chapter.order === state.currentOrder) ?? chapters[0];
      const progress = chapters.length ? Math.round((completed.length / chapters.length) * 100) : 0;

      return {
        id: record.id,
        title: record.title,
        category: record.category,
        focus: record.focus,
        totalChapters: chapters.length,
        completedCount: completed.length,
        progress,
        currentTitle: currentChapter?.title ?? "待整理章节",
        note: state.note,
        updatedAt: state.updatedAt,
      };
    });
  }, [readingStates]);

  const activeSummaries = summaries.filter((item) => item.completedCount > 0 || item.note.trim());
  const totalChapters = summaries.reduce((sum, item) => sum + item.totalChapters, 0);
  const completedChapters = summaries.reduce((sum, item) => sum + item.completedCount, 0);
  const totalProgress = totalChapters ? Math.round((completedChapters / totalChapters) * 100) : 0;
  const notesCount = summaries.filter((item) => item.note.trim()).length;
  const nextReading = activeSummaries[0] ?? summaries[0];
  const exportText = buildExportText(summaries);
  const pendingChapterCount = importDrafts.reduce((sum, draft) => sum + draft.chapterCount, 0);

  function toggleRitual(title: string) {
    setRitualDone((previous) => (previous.includes(title) ? previous.filter((item) => item !== title) : [...previous, title]));
  }

  async function copyAllNotes() {
    try {
      await navigator.clipboard.writeText(exportText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#080706] text-[#f4ead4]">
      <header className="border-b border-[#2c231a] bg-[#080706]">
        <div className="mx-auto flex max-w-[1220px] flex-wrap items-center justify-between gap-3 px-5 py-4">
          <Link className="inline-flex items-center gap-2 text-sm text-[#c8b692] hover:text-[#e8c86e]" href="/">
            <ArrowLeft size={17} />
            返回首页
          </Link>
          <div className="flex flex-wrap gap-3">
            <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-4 py-2 text-sm text-[#e8c86e]" href="/paths">
              研读路径
            </Link>
            <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-4 py-2 text-sm text-[#e8c86e]" href="/glossary">
              术语玄览
            </Link>
            <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-4 py-2 text-sm text-[#e8c86e]" href="/classics">
              典籍库
            </Link>
            <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-4 py-2 text-sm text-[#e8c86e]" href="/search">
              总检索
            </Link>
            <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-4 py-2 text-sm text-[#e8c86e]" href="/intake">
              入藏队列
            </Link>
            <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-4 py-2 text-sm text-[#e8c86e]" href="/library">
              本机典藏
            </Link>
            <Link className="rounded-[8px] bg-[#d8b642] px-4 py-2 text-sm font-semibold text-[#120e09]" href="/classics/import">
              导入古籍
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-[#241c15]">
        <img src="/images/dao-library-hero.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#080706_0%,rgba(8,7,6,0.9)_54%,rgba(8,7,6,0.68)_100%)]" />
        <div className="relative mx-auto grid max-w-[1220px] gap-8 px-5 py-14 lg:grid-cols-[0.92fr_0.48fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-[#d8b642]">STUDY CHAMBER</p>
            <h1 className="mt-4 text-5xl font-semibold leading-tight text-[#fff4d7] md:text-6xl">我的书斋</h1>
            <p className="mt-5 max-w-[44rem] text-base leading-8 text-[#cbb894]">
              把读过的章、留下的句、每天的修习都收在一处。典籍越多，这里越像一张自己的学习脉络。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="rounded-[8px] bg-[#d8b642] px-5 py-3 text-sm font-semibold text-[#120e09]" href={`/classics/${nextReading.id}`}>
                继续读《{nextReading.title}》
              </Link>
              <button
                type="button"
                onClick={copyAllNotes}
                className="inline-flex items-center gap-2 rounded-[8px] border border-[#6e562b] bg-[#120e09] px-5 py-3 text-sm font-semibold text-[#e8c86e]"
              >
                <ClipboardCopy size={16} />
                {copied ? "已复制" : "复制摘记"}
              </button>
              <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-5 py-3 text-sm font-semibold text-[#e8c86e]" href="/intake">
                查看入藏队列
              </Link>
              <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-5 py-3 text-sm font-semibold text-[#e8c86e]" href="/library">
                打开本机典藏
              </Link>
            </div>
          </div>
          <aside className="rounded-[8px] border border-[#463722] bg-[#100c09]/88 p-5">
            <div className="flex items-center gap-3">
              <NotebookTabs className="text-[#d8b642]" size={24} />
              <div>
                <p className="text-sm text-[#b99758]">研读总进度</p>
                <h2 className="text-3xl font-semibold text-[#fff4d7]">{totalProgress}%</h2>
              </div>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#21190f]">
              <div className="h-full rounded-full bg-[#d8b642]" style={{ width: `${totalProgress}%` }} />
            </div>
            <dl className="mt-5 grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-[8px] bg-[#080706] p-3">
                <dt className="text-[#786954]">已读</dt>
                <dd className="mt-1 text-[#f4deb0]">{completedChapters}</dd>
              </div>
              <div className="rounded-[8px] bg-[#080706] p-3">
                <dt className="text-[#786954]">总章</dt>
                <dd className="mt-1 text-[#f4deb0]">{totalChapters}</dd>
              </div>
              <div className="rounded-[8px] bg-[#080706] p-3">
                <dt className="text-[#786954]">摘记</dt>
                <dd className="mt-1 text-[#f4deb0]">{notesCount}</dd>
              </div>
              <div className="col-span-3 rounded-[8px] bg-[#080706] p-3">
                <dt className="text-[#786954]">待校对草稿</dt>
                <dd className="mt-1 text-[#f4deb0]">{importDrafts.length} 份 · {pendingChapterCount} 章</dd>
              </div>
              <div className="col-span-3 rounded-[8px] bg-[#080706] p-3">
                <dt className="text-[#786954]">本机典藏</dt>
                <dd className="mt-1 text-[#f4deb0]">{localClassics.length} 本 · {localClassics.reduce((sum, record) => sum + record.chapters.length, 0)} 章</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1220px] gap-6 px-5 py-8 lg:grid-cols-[0.86fr_1.14fr]">
        <div className="grid gap-6">
          <section className="rounded-[8px] border border-[#463722] bg-[#120e0a] p-6">
            <div className="flex items-center gap-3">
              <Sparkles className="text-[#d8b642]" size={22} />
              <div>
                <p className="text-sm text-[#b99758]">今日修习</p>
                <h2 className="text-2xl font-semibold text-[#fff4d7]">读、验、记</h2>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              {studyRituals.map((ritual) => {
                const done = ritualDone.includes(ritual.title);
                return (
                  <button
                    key={ritual.title}
                    type="button"
                    onClick={() => toggleRitual(ritual.title)}
                    className={`flex items-start gap-3 rounded-[8px] border p-4 text-left transition ${
                      done ? "border-[#8aa076] bg-[#172013]" : "border-[#33291f] bg-[#080706] hover:border-[#806739]"
                    }`}
                  >
                    <span
                      className={`mt-0.5 grid h-8 min-w-8 shrink-0 place-items-center rounded-full border px-2 text-xs whitespace-nowrap ${
                        done ? "border-[#8aa076] bg-[#1f2a18] text-[#b8d49b]" : "border-[#4a3b28] text-[#8d7a61]"
                      }`}
                    >
                      {done ? <CheckCircle2 size={16} /> : ritual.time}
                    </span>
                    <span>
                      <strong className="block text-[#fff4d7]">{ritual.title}</strong>
                      <span className="mt-1 block text-sm leading-6 text-[#a99575]">{ritual.text}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-[8px] border border-[#3a3026] bg-[#100c09] p-6">
            <div className="flex items-center gap-3">
              <ScrollText className="text-[#d8b642]" size={22} />
              <div>
                <p className="text-sm text-[#b99758]">摘记汇总</p>
                <h2 className="text-2xl font-semibold text-[#fff4d7]">留下来的句子</h2>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              {summaries.filter((item) => item.note.trim()).length ? (
                summaries
                  .filter((item) => item.note.trim())
                  .map((item) => (
                    <article key={item.id} className="rounded-[8px] border border-[#33291f] bg-[#080706] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <strong className="text-[#fff4d7]">《{item.title}》</strong>
                        <span className="text-xs text-[#b99758]">{formatReadingSavedTime(item.updatedAt)}</span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-[#d8c8aa]">{item.note}</p>
                    </article>
                  ))
              ) : (
                <div className="rounded-[8px] border border-[#33291f] bg-[#080706] p-5">
                  <p className="text-sm leading-7 text-[#a99575]">书斋还很安静。读完一章后留下摘记，这里会自动汇总。</p>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[8px] border border-[#3a3026] bg-[#100c09] p-6">
            <div className="flex items-center gap-3">
              <Layers3 className="text-[#d8b642]" size={22} />
              <div>
                <p className="text-sm text-[#b99758]">补录队列</p>
                <h2 className="text-2xl font-semibold text-[#fff4d7]">待校对古籍草稿</h2>
              </div>
            </div>
            <Link className="mt-4 inline-flex rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm font-semibold text-[#e8c86e]" href="/intake">
              打开入藏队列
            </Link>
            <div className="mt-5 grid gap-3">
              {importDrafts.length ? (
                importDrafts.slice(0, 4).map((draft) => (
                  <Link key={draft.id} href="/intake" className="rounded-[8px] border border-[#33291f] bg-[#080706] p-4 hover:border-[#d8b642]">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <strong className="text-[#fff4d7]">{draft.title}</strong>
                      <span className="text-xs text-[#b99758]">{formatImportDraftTime(draft.updatedAt)}</span>
                    </div>
                    <p className="mt-2 text-xs leading-6 text-[#8d7a61]">
                      {draft.category} · {draft.chapterCount} 章 · {draft.cjkCount} 汉字
                    </p>
                  </Link>
                ))
              ) : (
                <div className="rounded-[8px] border border-[#33291f] bg-[#080706] p-5">
                  <p className="text-sm leading-7 text-[#a99575]">录入助手保存的古籍草稿会出现在这里，方便后续继续校对和入库。</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <section className="rounded-[8px] border border-[#3a3026] bg-[#100c09] p-6">
          <div className="flex items-center gap-3">
            <LibraryBig className="text-[#d8b642]" size={24} />
            <div>
              <p className="text-sm text-[#b99758]">典籍书架</p>
              <h2 className="text-2xl font-semibold text-[#fff4d7]">八部入口的研读状态</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {summaries.map((item) => (
              <Link key={item.id} href={`/classics/${item.id}`} className="rounded-[8px] border border-[#33291f] bg-[#080706] p-5 hover:border-[#d8b642]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-[#b99758]">{item.category}</p>
                    <h3 className="mt-2 text-xl font-semibold text-[#fff4d7]">{item.title}</h3>
                  </div>
                  <span className="rounded-full border border-[#463722] px-3 py-1 text-xs text-[#cab89b]">{item.progress}%</span>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#a99575]">{item.focus}</p>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#21190f]">
                  <div className="h-full rounded-full bg-[#d8b642]" style={{ width: `${item.progress}%` }} />
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[#8d7a61]">
                  <span className="inline-flex items-center gap-1">
                    <BookOpenText size={14} />
                    {item.completedCount}/{item.totalChapters} 节
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <FileText size={14} />
                    {item.currentTitle}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
