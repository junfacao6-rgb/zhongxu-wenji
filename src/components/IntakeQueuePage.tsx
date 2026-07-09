"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookMarked,
  BookOpenText,
  CheckCircle2,
  ClipboardCopy,
  FileText,
  GitBranch,
  Inbox,
  Layers3,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { importKeywordHints, type ClassicCategory } from "@/lib/culture-content";
import { formatImportDraftTime, readImportDrafts, writeImportDrafts, type ClassicImportDraft } from "@/lib/import-drafts-storage";
import {
  buildIntakeChecks,
  buildIntakeKeywords,
  buildIntakePayload,
  countCjk,
  getMatchedTerms,
  getPathSuggestions,
  getReadyScore,
  splitChapters,
  type IntakeCheck,
  type PathSuggestion,
} from "@/lib/intake-analysis";
import {
  makeLocalClassicId,
  readLocalClassics,
  upsertLocalClassic,
  type LocalClassicRecord,
} from "@/lib/local-classics-storage";

type DraftAnalysis = {
  draft: ClassicImportDraft;
  category: ClassicCategory;
  chapters: ReturnType<typeof splitChapters>;
  cjkCount: number;
  detectedKeywords: readonly string[];
  matchedTerms: ReturnType<typeof getMatchedTerms>;
  pathSuggestions: PathSuggestion[];
  intakeChecks: IntakeCheck[];
  readyScore: number;
  allKeywords: string[];
  payload: ReturnType<typeof buildIntakePayload>;
};

type QueueFilter = "全部" | "可校勘" | "待补章" | "待补文";

const filters: QueueFilter[] = ["全部", "可校勘", "待补章", "待补文"];

function normalizeCategory(value: string): ClassicCategory {
  if (value === "道家经典" || value === "命理典籍" || value === "术数方法" || value === "修习笔记") return value;
  return "道家经典";
}

function analyzeDraft(draft: ClassicImportDraft): DraftAnalysis {
  const category = normalizeCategory(draft.category);
  const chapters = splitChapters(draft.rawText);
  const cjkCount = countCjk(draft.rawText);
  const detectedKeywords = importKeywordHints.filter((keyword) => draft.rawText.includes(keyword));
  const matchedTerms = getMatchedTerms(draft.rawText, detectedKeywords);
  const pathSuggestions = getPathSuggestions(category, matchedTerms, detectedKeywords);
  const intakeChecks = buildIntakeChecks(draft.title, category, cjkCount, chapters, matchedTerms);
  const readyScore = getReadyScore(intakeChecks);
  const allKeywords = buildIntakeKeywords(detectedKeywords, matchedTerms);
  const payload = buildIntakePayload({
    title: draft.title,
    category,
    sourceType: draft.sourceType,
    author: draft.author,
    dynasty: draft.dynasty,
    edition: draft.edition,
    sourceNote: draft.sourceNote,
    chapters,
    cjkCount,
    allKeywords,
    matchedTerms,
    pathSuggestions,
    readyScore,
    intakeChecks,
  });

  return {
    draft,
    category,
    chapters,
    cjkCount,
    detectedKeywords,
    matchedTerms,
    pathSuggestions,
    intakeChecks,
    readyScore,
    allKeywords,
    payload,
  };
}

function getQueueStatus(item: DraftAnalysis): Exclude<QueueFilter, "全部"> {
  if (item.readyScore >= 80) return "可校勘";
  if (item.chapters.length <= 1) return "待补章";
  return "待补文";
}

function statusClass(status: string) {
  if (status === "可校勘") return "border-[#8aa076] bg-[#172013] text-[#b8d49b]";
  if (status === "待补章") return "border-[#8a6f38] bg-[#21190f] text-[#f4deb0]";
  return "border-[#6b2f27] bg-[#2a1712] text-[#d89b87]";
}

export default function IntakeQueuePage() {
  const [drafts, setDrafts] = useState<ClassicImportDraft[]>([]);
  const [localClassics, setLocalClassics] = useState<LocalClassicRecord[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<QueueFilter>("全部");
  const [copied, setCopied] = useState(false);
  const [publishNotice, setPublishNotice] = useState("");

  useEffect(() => {
    const storedDrafts = readImportDrafts();
    setDrafts(storedDrafts);
    setLocalClassics(readLocalClassics());
    setSelectedId(storedDrafts[0]?.id ?? "");
  }, []);

  const analyses = useMemo(() => drafts.map((draft) => analyzeDraft(draft)), [drafts]);
  const filteredAnalyses = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return analyses.filter((item) => {
      const status = getQueueStatus(item);
      const statusMatch = filter === "全部" || status === filter;
      const queryMatch =
        !normalized ||
        [
          item.draft.title,
          item.category,
          item.draft.sourceType,
          item.draft.author,
          item.draft.dynasty,
          item.draft.edition,
          item.draft.sourceNote,
          ...item.allKeywords,
          ...item.matchedTerms.map((term) => term.term),
          ...item.pathSuggestions.map((entry) => entry.path.title),
        ].some((value) => value.toLowerCase().includes(normalized));
      return statusMatch && queryMatch;
    });
  }, [analyses, filter, query]);

  const selected = filteredAnalyses.find((item) => item.draft.id === selectedId) ?? filteredAnalyses[0] ?? analyses[0];
  const readyCount = analyses.filter((item) => getQueueStatus(item) === "可校勘").length;
  const averageReady = analyses.length ? Math.round(analyses.reduce((sum, item) => sum + item.readyScore, 0) / analyses.length) : 0;
  const totalChapters = analyses.reduce((sum, item) => sum + item.chapters.length, 0);
  const termCount = new Set(analyses.flatMap((item) => item.matchedTerms.map((term) => term.id))).size;
  const publishedClassic = selected
    ? localClassics.find((record) => record.sourceDraftId === selected.draft.id || record.title === selected.draft.title)
    : undefined;

  function deleteDraft(id: string) {
    const nextDrafts = drafts.filter((draft) => draft.id !== id);
    setDrafts(nextDrafts);
    writeImportDrafts(nextDrafts);
    if (selectedId === id) setSelectedId(nextDrafts[0]?.id ?? "");
  }

  async function copySelectedPayload() {
    if (!selected) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(selected.payload, null, 2));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  function publishSelectedClassic() {
    if (!selected) return;
    const now = new Date().toISOString();
    const existing = localClassics.find((record) => record.sourceDraftId === selected.draft.id || record.title === selected.draft.title);
    const record: LocalClassicRecord = {
      id: existing?.id ?? makeLocalClassicId(selected.draft.title),
      sourceDraftId: selected.draft.id,
      title: selected.draft.title,
      category: selected.category === "全部" ? "道家经典" : selected.category,
      sourceType: selected.draft.sourceType,
      author: existing?.author || selected.draft.author,
      dynasty: existing?.dynasty || selected.draft.dynasty,
      edition: existing?.edition || selected.draft.edition,
      sourceNote: existing?.sourceNote || selected.draft.sourceNote || selected.draft.sourceType,
      collationStatus: existing?.collationStatus ?? "待校勘",
      chapterCount: selected.chapters.length,
      cjkCount: selected.cjkCount,
      keywords: selected.allKeywords,
      matchedTerms: selected.matchedTerms.map((term) => term.term),
      suggestedPaths: selected.pathSuggestions.map((item) => item.path.title),
      readinessScore: selected.readyScore,
      chapters: selected.chapters.map((chapter) => ({
        order: chapter.order,
        title: chapter.title,
        original: chapter.original,
        translation: "待补白话",
        notes: ["由入藏队列生成，待补版本、白话、注解与校勘说明。"],
      })),
      collationLogs: existing?.collationLogs ?? [],
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    const next = upsertLocalClassic(record);
    setLocalClassics(next);
    setPublishNotice(`《${record.title}》已收入本机典藏`);
    window.setTimeout(() => setPublishNotice(""), 2000);
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
            <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-4 py-2 text-sm text-[#e8c86e]" href="/classics/import">
              导入古籍
            </Link>
            <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-4 py-2 text-sm text-[#e8c86e]" href="/glossary">
              术语玄览
            </Link>
            <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-4 py-2 text-sm text-[#e8c86e]" href="/paths">
              研读路径
            </Link>
            <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-4 py-2 text-sm text-[#e8c86e]" href="/library">
              本机典藏
            </Link>
            <Link className="rounded-[8px] bg-[#d8b642] px-4 py-2 text-sm font-semibold text-[#120e09]" href="/classics">
              典籍库
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-[#241c15]">
        <img src="/images/dao-library-hero.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-28" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#080706_0%,rgba(8,7,6,0.9)_54%,rgba(8,7,6,0.66)_100%)]" />
        <div className="relative mx-auto grid max-w-[1220px] gap-8 px-5 py-14 lg:grid-cols-[0.92fr_0.5fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-[#d8b642]">INTAKE QUEUE</p>
            <h1 className="mt-4 text-5xl font-semibold leading-tight text-[#fff4d7] md:text-6xl">入藏队列</h1>
            <p className="mt-5 max-w-[44rem] text-base leading-8 text-[#cbb894]">
              把录入助手保存的草稿集中管理。先看准备度，再看术语和路径，最后决定哪一份可以进入正式典籍。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="rounded-[8px] bg-[#d8b642] px-5 py-3 text-sm font-semibold text-[#120e09]" href="/classics/import">
                新增草稿
              </Link>
              <button
                type="button"
                onClick={copySelectedPayload}
                className="inline-flex items-center gap-2 rounded-[8px] border border-[#6e562b] bg-[#120e09] px-5 py-3 text-sm font-semibold text-[#e8c86e]"
              >
                <ClipboardCopy size={16} />
                {copied ? "已复制" : "复制选中入库包"}
              </button>
              <button
                type="button"
                onClick={publishSelectedClassic}
                className="inline-flex items-center gap-2 rounded-[8px] border border-[#6e562b] bg-[#120e09] px-5 py-3 text-sm font-semibold text-[#e8c86e]"
              >
                <BookMarked size={16} />
                {publishedClassic ? "更新典藏" : "收入本机典藏"}
              </button>
              <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-5 py-3 text-sm font-semibold text-[#e8c86e]" href="/library">
                打开本机典藏
              </Link>
            </div>
            {publishNotice ? <p className="mt-4 text-sm text-[#b8d49b]">{publishNotice}</p> : null}
          </div>
          <aside className="rounded-[8px] border border-[#463722] bg-[#100c09]/88 p-5">
            <div className="flex items-center gap-3">
              <Inbox className="text-[#d8b642]" size={24} />
              <div>
                <p className="text-sm text-[#b99758]">队列平均准备度</p>
                <h2 className="text-3xl font-semibold text-[#fff4d7]">{averageReady}%</h2>
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-[8px] bg-[#080706] p-3">
                <dt className="text-[#786954]">草稿</dt>
                <dd className="mt-1 text-[#f4deb0]">{analyses.length}</dd>
              </div>
              <div className="rounded-[8px] bg-[#080706] p-3">
                <dt className="text-[#786954]">可校勘</dt>
                <dd className="mt-1 text-[#f4deb0]">{readyCount}</dd>
              </div>
              <div className="rounded-[8px] bg-[#080706] p-3">
                <dt className="text-[#786954]">章节</dt>
                <dd className="mt-1 text-[#f4deb0]">{totalChapters}</dd>
              </div>
              <div className="rounded-[8px] bg-[#080706] p-3">
                <dt className="text-[#786954]">术语</dt>
                <dd className="mt-1 text-[#f4deb0]">{termCount}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1220px] min-w-0 gap-6 px-5 py-8 lg:grid-cols-[340px_1fr]">
        <aside className="min-w-0 self-start overflow-hidden rounded-[8px] border border-[#3a3026] bg-[#100c09] p-4 lg:sticky lg:top-4">
          <label className="flex items-center gap-3 rounded-[8px] border border-[#3a3026] bg-[#080706] px-4 py-3">
            <Search className="text-[#d8b642]" size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full bg-transparent text-sm text-[#f4ead4] outline-none placeholder:text-[#71604b]"
              placeholder="搜 道德经 / 用神 / 奇门"
            />
          </label>

          <div className="mt-5 flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`rounded-[8px] border px-3 py-2 text-sm ${
                  filter === item
                    ? "border-[#d8b642] bg-[#d8b642] text-[#120e09]"
                    : "border-[#3a3026] bg-[#14100c] text-[#c8b692] hover:border-[#8a6f38] hover:text-[#f4deb0]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-5 grid min-w-0 gap-3">
            {filteredAnalyses.length ? (
              filteredAnalyses.map((item) => {
                const status = getQueueStatus(item);
                return (
                  <button
                    key={item.draft.id}
                    type="button"
                    onClick={() => setSelectedId(item.draft.id)}
                    className={`w-full min-w-0 rounded-[8px] border p-4 text-left transition ${
                      selected?.draft.id === item.draft.id
                        ? "border-[#d8b642] bg-[#1d160f]"
                        : "border-[#33291f] bg-[#080706] hover:border-[#806739]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs text-[#b99758]">{item.category}</p>
                        <strong className="mt-1 block break-words text-lg text-[#fff4d7]">{item.draft.title}</strong>
                      </div>
                      <span className={`shrink-0 rounded-full border px-3 py-1 text-xs ${statusClass(status)}`}>{status}</span>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#21190f]">
                      <div className="h-full rounded-full bg-[#d8b642]" style={{ width: `${item.readyScore}%` }} />
                    </div>
                    <p className="mt-3 text-xs leading-6 text-[#8d7a61]">
                      {item.chapters.length} 章 · {item.cjkCount} 字 · {formatImportDraftTime(item.draft.updatedAt)}
                    </p>
                    <p className="mt-1 text-xs leading-6 text-[#a99575]">
                      {item.draft.author || "作者待考"} · {item.draft.dynasty || "朝代待考"} · {item.draft.edition || "版本待补"}
                    </p>
                  </button>
                );
              })
            ) : (
              <div className="rounded-[8px] border border-[#33291f] bg-[#080706] p-5">
                <p className="text-sm leading-7 text-[#a99575]">没有匹配草稿。可以先去录入助手保存一份。</p>
              </div>
            )}
          </div>
        </aside>

        {selected ? (
          <div className="grid min-w-0 gap-6">
            <section className="rounded-[8px] border border-[#463722] bg-[#120e0a] p-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
                <div>
                  <p className="text-sm font-semibold text-[#d8b642]">{selected.category} · {selected.draft.sourceType}</p>
                  <h2 className="mt-3 text-4xl font-semibold text-[#fff4d7]">{selected.draft.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-[#a99575]">
                    {selected.chapters.length} 章 · {selected.cjkCount} 个汉字 · {selected.matchedTerms.length} 个术语命中
                  </p>
                  <div className="mt-5 grid gap-3 rounded-[8px] border border-[#33291f] bg-[#080706] p-4 text-sm md:grid-cols-3">
                    <div>
                      <p className="text-xs text-[#786954]">作者</p>
                      <p className="mt-1 text-[#f4deb0]">{selected.draft.author || "待考"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#786954]">朝代</p>
                      <p className="mt-1 text-[#f4deb0]">{selected.draft.dynasty || "待考"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#786954]">版本</p>
                      <p className="mt-1 text-[#f4deb0]">{selected.draft.edition || "待补"}</p>
                    </div>
                    <div className="md:col-span-3">
                      <p className="text-xs text-[#786954]">来源说明</p>
                      <p className="mt-1 leading-7 text-[#a99575]">{selected.draft.sourceNote || "待补来源说明"}</p>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {selected.allKeywords.slice(0, 12).map((keyword) => (
                      <Link key={keyword} href={`/glossary?term=${encodeURIComponent(keyword)}`} className="rounded-full bg-[#21190f] px-3 py-1 text-xs text-[#d8c8aa] hover:text-[#e8c86e]">
                        {keyword}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="rounded-[8px] border border-[#33291f] bg-[#080706] p-5">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-[#8aa076]" size={22} />
                    <div>
                      <p className="text-sm text-[#b99758]">准备度</p>
                      <h3 className="text-3xl font-semibold text-[#fff4d7]">{selected.readyScore}%</h3>
                    </div>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#21190f]">
                    <div className="h-full rounded-full bg-[#d8b642]" style={{ width: `${selected.readyScore}%` }} />
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      className="rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm text-[#e8c86e]"
                      href={`/classics/import?draft=${encodeURIComponent(selected.draft.id)}`}
                    >
                      回录入助手
                    </Link>
                    <button
                      type="button"
                      onClick={publishSelectedClassic}
                      className="inline-flex items-center gap-2 rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm text-[#e8c86e]"
                    >
                      <BookMarked size={15} />
                      {publishedClassic ? "更新典藏" : "收入典藏"}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteDraft(selected.draft.id)}
                      className="inline-flex items-center gap-2 rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm text-[#e8c86e]"
                    >
                      <Trash2 size={15} />
                      删除
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[8px] border border-[#3a3026] bg-[#100c09] p-6">
                <div className="flex items-center gap-3">
                  <Layers3 className="text-[#d8b642]" size={22} />
                  <div>
                    <p className="text-sm text-[#b99758]">校勘清单</p>
                    <h2 className="text-2xl font-semibold text-[#fff4d7]">入正式典籍前先过这五项</h2>
                  </div>
                </div>
                <div className="mt-5 grid gap-3">
                  {selected.intakeChecks.map((check) => (
                    <div key={check.label} className="rounded-[8px] border border-[#33291f] bg-[#080706] p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className={check.ok ? "text-[#8aa076]" : "text-[#a63f31]"} size={17} />
                        <strong className="text-[#f4ead4]">{check.label}</strong>
                      </div>
                      <p className="mt-2 text-xs leading-6 text-[#a99575]">{check.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[8px] border border-[#3a3026] bg-[#100c09] p-6">
                <div className="flex items-center gap-3">
                  <GitBranch className="text-[#d8b642]" size={22} />
                  <div>
                    <p className="text-sm text-[#b99758]">推荐归档</p>
                    <h2 className="text-2xl font-semibold text-[#fff4d7]">建议挂到哪条研读路径</h2>
                  </div>
                </div>
                <div className="mt-5 grid gap-3">
                  {selected.pathSuggestions.length ? (
                    selected.pathSuggestions.map((item) => (
                      <Link key={item.path.id} href="/paths" className="rounded-[8px] border border-[#33291f] bg-[#080706] p-4 hover:border-[#d8b642]">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-xs text-[#b99758]">{item.path.level} · {item.path.duration}</p>
                            <h3 className="mt-1 text-lg font-semibold text-[#fff4d7]">{item.path.title}</h3>
                          </div>
                          <span className="rounded-full border border-[#463722] px-3 py-1 text-xs text-[#cab89b]">匹配 {item.score}</span>
                        </div>
                        <p className="mt-2 text-xs leading-6 text-[#a99575]">{item.reason}</p>
                      </Link>
                    ))
                  ) : (
                    <p className="rounded-[8px] border border-[#33291f] bg-[#080706] p-4 text-sm leading-7 text-[#a99575]">暂时没有路径建议，建议先补正文或关键词。</p>
                  )}
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
              <div className="rounded-[8px] border border-[#463722] bg-[#120e0a] p-6">
                <div className="flex items-center gap-3">
                  <BookOpenText className="text-[#d8b642]" size={22} />
                  <div>
                    <p className="text-sm text-[#b99758]">章节预览</p>
                    <h2 className="text-2xl font-semibold text-[#fff4d7]">先看卷章是否断得合理</h2>
                  </div>
                </div>
                <div className="mt-5 grid gap-3">
                  {selected.chapters.slice(0, 6).map((chapter) => (
                    <div key={chapter.order} className="rounded-[8px] border border-[#33291f] bg-[#080706] p-4">
                      <p className="text-xs text-[#b99758]">{chapter.order}</p>
                      <h3 className="mt-1 text-lg font-semibold text-[#fff4d7]">{chapter.title}</h3>
                      <p className="mt-2 line-clamp-2 text-xs leading-6 text-[#a99575]">{chapter.original}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[8px] border border-[#463722] bg-[#120e0a] p-6">
                <div className="flex items-center gap-3">
                  <FileText className="text-[#d8b642]" size={22} />
                  <div>
                    <p className="text-sm text-[#b99758]">入库包</p>
                    <h2 className="text-2xl font-semibold text-[#fff4d7]">可复制给正式入库流程</h2>
                  </div>
                </div>
                <pre className="mt-5 max-h-[420px] max-w-full overflow-auto whitespace-pre-wrap break-all rounded-[8px] border border-[#33291f] bg-[#080706] p-4 text-xs leading-6 text-[#c8b692]">
                  {JSON.stringify(selected.payload, null, 2)}
                </pre>
              </div>
            </section>
          </div>
        ) : (
          <div className="rounded-[8px] border border-[#463722] bg-[#120e0a] p-8">
            <Upload className="text-[#d8b642]" size={26} />
            <h2 className="mt-4 text-3xl font-semibold text-[#fff4d7]">还没有待入藏草稿</h2>
            <p className="mt-3 text-sm leading-7 text-[#a99575]">去录入助手粘贴一段古籍，保存草稿后，这里会出现准备度、术语和路径建议。</p>
            <Link className="mt-5 inline-flex rounded-[8px] bg-[#d8b642] px-4 py-2 text-sm font-semibold text-[#120e09]" href="/classics/import">
              去录入助手
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
