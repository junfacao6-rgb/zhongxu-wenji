"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookMarked,
  BookOpenText,
  ClipboardCopy,
  Edit3,
  FileText,
  History,
  LibraryBig,
  ListChecks,
  Save,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { classicCategories, type ClassicCategory } from "@/lib/culture-content";
import {
  formatLocalClassicTime,
  localCollationStatuses,
  normalizeLocalClassicsPayload,
  readLocalClassics,
  removeLocalClassic,
  writeLocalClassics,
  type LocalClassicRecord,
} from "@/lib/local-classics-storage";

function categoryButtonClass(active: boolean) {
  return active
    ? "border-[#d8b642] bg-[#d8b642] text-[#120e09]"
    : "border-[#3a3026] bg-[#14100c] text-[#c8b692] hover:border-[#8a6f38] hover:text-[#f4deb0]";
}

type StatusFilter = LocalClassicRecord["collationStatus"] | "全部";
type ChapterTodo = "待白话" | "待注解" | "可复核";

const statusFilters: StatusFilter[] = ["全部", ...localCollationStatuses];

function hasChapterTranslation(chapter: LocalClassicRecord["chapters"][number]) {
  const text = chapter.translation.trim();
  return Boolean(text && text !== "待补白话");
}

function hasUsefulChapterNotes(chapter: LocalClassicRecord["chapters"][number]) {
  return chapter.notes.some((note) => {
    const text = note.trim();
    return text && !text.includes("由入藏队列生成") && !text.includes("待补");
  });
}

function getChapterTodo(chapter: LocalClassicRecord["chapters"][number]): ChapterTodo {
  if (!hasChapterTranslation(chapter)) return "待白话";
  if (!hasUsefulChapterNotes(chapter)) return "待注解";
  return "可复核";
}

function chapterTodoClass(todo: ChapterTodo) {
  if (todo === "可复核") return "border-[#8aa076] bg-[#172013] text-[#b8d49b]";
  if (todo === "待注解") return "border-[#8a6f38] bg-[#21190f] text-[#f4deb0]";
  return "border-[#6b2f27] bg-[#2a1712] text-[#d89b87]";
}

function getBookProgress(record: LocalClassicRecord) {
  const translated = record.chapters.filter(hasChapterTranslation).length;
  const noted = record.chapters.filter(hasUsefulChapterNotes).length;
  const completed = record.chapters.filter((chapter) => getChapterTodo(chapter) === "可复核").length;
  const total = record.chapters.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  const nextPending = record.chapters.find((chapter) => getChapterTodo(chapter) !== "可复核");

  return {
    translated,
    noted,
    completed,
    pending: Math.max(total - completed, 0),
    total,
    percent,
    nextPending: nextPending ? { chapter: nextPending, todo: getChapterTodo(nextPending) } : null,
  };
}

function getAutoCollationStatus(record: LocalClassicRecord): LocalClassicRecord["collationStatus"] {
  const progress = getBookProgress(record);
  if (progress.total && progress.completed === progress.total) return "已初校";
  if (progress.translated || progress.noted || record.collationLogs.length) return "校勘中";
  return "待校勘";
}

function buildExport(record: LocalClassicRecord) {
  return {
    book: {
      id: record.id,
      title: record.title,
      category: record.category,
      author: record.author,
      dynasty: record.dynasty,
      edition: record.edition,
      collationStatus: record.collationStatus,
    },
    source: {
      draftId: record.sourceDraftId,
      type: record.sourceType,
      note: record.sourceNote,
    },
    index: {
      keywords: record.keywords,
      matchedTerms: record.matchedTerms,
      suggestedPaths: record.suggestedPaths,
      readinessScore: record.readinessScore,
      chapterCount: record.chapterCount,
      cjkCount: record.cjkCount,
    },
    chapters: record.chapters,
    collationLogs: record.collationLogs,
  };
}

function buildMarkdown(record: LocalClassicRecord) {
  const lines = [
    `# ${record.title}`,
    "",
    `- 分类：${record.category}`,
    `- 作者：${record.author || "待考"}`,
    `- 朝代：${record.dynasty || "待考"}`,
    `- 版本：${record.edition || "待补"}`,
    `- 来源：${record.sourceType}`,
    `- 来源说明：${record.sourceNote || "待补"}`,
    `- 整理状态：${record.collationStatus}`,
    `- 关键词：${record.keywords.join(" / ") || "待补"}`,
    `- 术语：${record.matchedTerms.join(" / ") || "待补"}`,
    `- 路径：${record.suggestedPaths.join(" / ") || "待挂"}`,
    "",
  ];

  for (const chapter of record.chapters) {
    lines.push(`## 第 ${chapter.order} 章 ${chapter.title}`);
    lines.push("");
    lines.push("### 原文");
    lines.push(chapter.original);
    lines.push("");
    lines.push("### 白话");
    lines.push(chapter.translation || "待补白话");
    lines.push("");
    lines.push("### 注解");
    if (chapter.notes.length) {
      for (const note of chapter.notes) lines.push(`- ${note}`);
    } else {
      lines.push("- 待补注解");
    }
    lines.push("");
  }

  if (record.collationLogs.length) {
    lines.push("## 校勘轨迹");
    lines.push("");
    for (const log of record.collationLogs) {
      const target = log.chapterOrder === "书目" ? "书目信息" : `第 ${log.chapterOrder} 章`;
      lines.push(`- ${formatLocalClassicTime(log.updatedAt)}｜${target}｜${log.summary}`);
    }
  }

  return lines.join("\n");
}

function buildLibraryBackup(records: LocalClassicRecord[]) {
  return {
    schema: "zhongxu-local-classics/v2",
    exportedAt: new Date().toISOString(),
    count: records.length,
    records,
  };
}

type BookMetaDraft = Pick<LocalClassicRecord, "author" | "dynasty" | "edition" | "sourceNote" | "collationStatus">;

const emptyBookMetaDraft: BookMetaDraft = {
  author: "",
  dynasty: "",
  edition: "",
  sourceNote: "",
  collationStatus: "待校勘",
};

export default function LocalClassicsPage() {
  const [records, setRecords] = useState<LocalClassicRecord[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ClassicCategory>("全部");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("全部");
  const [copied, setCopied] = useState(false);
  const [activeChapterOrder, setActiveChapterOrder] = useState("");
  const [translationDraft, setTranslationDraft] = useState("");
  const [notesDraft, setNotesDraft] = useState("");
  const [saveNotice, setSaveNotice] = useState("");
  const [backupDraft, setBackupDraft] = useState("");
  const [backupNotice, setBackupNotice] = useState("");
  const [metaDraft, setMetaDraft] = useState<BookMetaDraft>(emptyBookMetaDraft);
  const [metaNotice, setMetaNotice] = useState("");

  useEffect(() => {
    const stored = readLocalClassics();
    const initialBookId = new URLSearchParams(window.location.search).get("book") ?? "";
    setRecords(stored);
    setSelectedId(stored.some((record) => record.id === initialBookId) ? initialBookId : stored[0]?.id ?? "");
  }, []);

  const filteredRecords = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return records.filter((record) => {
      const categoryMatch = category === "全部" || record.category === category;
      const statusMatch = statusFilter === "全部" || record.collationStatus === statusFilter;
      const queryMatch =
        !normalized ||
        [
          record.title,
          record.category,
          record.sourceType,
          record.author,
          record.dynasty,
          record.edition,
          record.sourceNote,
          record.collationStatus,
          ...record.keywords,
          ...record.matchedTerms,
          ...record.suggestedPaths,
          ...record.chapters.flatMap((chapter) => [chapter.title, chapter.original, chapter.translation, ...chapter.notes]),
        ].some((value) => value.toLowerCase().includes(normalized));
      return categoryMatch && statusMatch && queryMatch;
    });
  }, [category, query, records, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts: Record<StatusFilter, number> = {
      全部: records.length,
      待校勘: 0,
      校勘中: 0,
      已初校: 0,
      已定稿: 0,
    };
    for (const record of records) counts[record.collationStatus] += 1;
    return counts;
  }, [records]);

  const selected = filteredRecords.find((record) => record.id === selectedId) ?? filteredRecords[0] ?? records[0];
  const totalChapters = records.reduce((sum, record) => sum + record.chapters.length, 0);
  const totalWords = records.reduce((sum, record) => sum + record.cjkCount, 0);
  const keywordCount = new Set(records.flatMap((record) => record.keywords)).size;
  const collationCount = records.reduce((sum, record) => sum + record.collationLogs.length, 0);
  const completedChapters = records.reduce((sum, record) => sum + getBookProgress(record).completed, 0);
  const pendingChapters = Math.max(totalChapters - completedChapters, 0);
  const selectedProgress = selected ? getBookProgress(selected) : null;
  const activeChapter = selected?.chapters.find((chapter) => chapter.order === activeChapterOrder) ?? selected?.chapters[0];

  useEffect(() => {
    if (!selected) {
      setMetaDraft(emptyBookMetaDraft);
      setMetaNotice("");
      return;
    }

    setMetaDraft({
      author: selected.author,
      dynasty: selected.dynasty,
      edition: selected.edition,
      sourceNote: selected.sourceNote,
      collationStatus: selected.collationStatus,
    });
    setMetaNotice("");
  }, [selected]);

  useEffect(() => {
    const firstChapter = selected?.chapters[0];
    if (!selected || !firstChapter) {
      setActiveChapterOrder("");
      setTranslationDraft("");
      setNotesDraft("");
      return;
    }

    const nextChapter = selected.chapters.find((chapter) => chapter.order === activeChapterOrder) ?? firstChapter;
    setActiveChapterOrder(nextChapter.order);
    setTranslationDraft(nextChapter.translation);
    setNotesDraft(nextChapter.notes.join("\n"));
  }, [activeChapterOrder, selected]);

  function deleteRecord(id: string) {
    const next = removeLocalClassic(id);
    setRecords(next);
    if (selectedId === id) setSelectedId(next[0]?.id ?? "");
  }

  async function copySelected() {
    if (!selected) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(buildExport(selected), null, 2));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  async function copySelectedMarkdown() {
    if (!selected) return;
    try {
      await navigator.clipboard.writeText(buildMarkdown(selected));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  async function copyLibraryBackup() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(buildLibraryBackup(records), null, 2));
      setBackupNotice(`已复制 ${records.length} 本典藏的整库备份`);
      window.setTimeout(() => setBackupNotice(""), 2000);
    } catch {
      setBackupNotice("复制失败，可以稍后再试");
      window.setTimeout(() => setBackupNotice(""), 2000);
    }
  }

  function restoreLibraryBackup(mode: "merge" | "replace") {
    try {
      const parsed = JSON.parse(backupDraft);
      const incoming = normalizeLocalClassicsPayload(parsed);
      if (!incoming.length) {
        setBackupNotice("没有识别到可恢复的典藏记录");
        window.setTimeout(() => setBackupNotice(""), 2200);
        return;
      }

      const nextRecords =
        mode === "replace"
          ? incoming
          : [
              ...incoming,
              ...records.filter((record) => !incoming.some((item) => item.id === record.id)),
            ].sort((a, b) => Date.parse(b.updatedAt || "0") - Date.parse(a.updatedAt || "0"));
      setRecords(nextRecords);
      writeLocalClassics(nextRecords);
      setSelectedId(nextRecords[0]?.id ?? "");
      setBackupDraft("");
      setBackupNotice(mode === "replace" ? `已覆盖恢复 ${incoming.length} 本典藏` : `已合并导入 ${incoming.length} 本典藏`);
      window.setTimeout(() => setBackupNotice(""), 2200);
    } catch {
      setBackupNotice("备份内容不是有效 JSON");
      window.setTimeout(() => setBackupNotice(""), 2200);
    }
  }

  function saveBookMetadata() {
    if (!selected) return;
    const updatedAt = new Date().toISOString();
    const nextMeta: BookMetaDraft = {
      author: metaDraft.author.trim(),
      dynasty: metaDraft.dynasty.trim(),
      edition: metaDraft.edition.trim(),
      sourceNote: metaDraft.sourceNote.trim(),
      collationStatus: metaDraft.collationStatus,
    };
    const changedParts = [
      nextMeta.author !== selected.author ? "作者" : "",
      nextMeta.dynasty !== selected.dynasty ? "朝代" : "",
      nextMeta.edition !== selected.edition ? "版本" : "",
      nextMeta.sourceNote !== selected.sourceNote ? "来源说明" : "",
      nextMeta.collationStatus !== selected.collationStatus ? "整理状态" : "",
    ].filter(Boolean);
    const summary = changedParts.length ? `更新书目信息：${changedParts.join("、")}` : "复核书目信息";
    const nextRecords = records.map((record) => {
      if (record.id !== selected.id) return record;
      return {
        ...record,
        ...nextMeta,
        updatedAt,
        collationLogs: [
          {
            id: `log-${Date.now()}`,
            chapterOrder: "书目",
            chapterTitle: "书目信息",
            summary,
            updatedAt,
          },
          ...record.collationLogs,
        ].slice(0, 80),
      };
    });
    setRecords(nextRecords);
    writeLocalClassics(nextRecords);
    setMetaDraft(nextMeta);
    setMetaNotice(changedParts.length ? "书目信息已保存" : "书目信息已复核");
    window.setTimeout(() => setMetaNotice(""), 1800);
  }

  function saveChapterEdits() {
    if (!selected || !activeChapter) return;
    const notes = notesDraft
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    const updatedAt = new Date().toISOString();
    const changedParts = [
      translationDraft.trim() !== activeChapter.translation.trim() ? "白话" : "",
      notes.join("\n") !== activeChapter.notes.join("\n") ? "注解" : "",
    ].filter(Boolean);
    const summary = changedParts.length ? `更新${changedParts.join("与")}` : "复核章节内容";
    const nextRecords = records.map((record) => {
      if (record.id !== selected.id) return record;
      const chapters = record.chapters.map((chapter) =>
        chapter.order === activeChapter.order
          ? {
              ...chapter,
              translation: translationDraft.trim() || "待补白话",
              notes,
            }
          : chapter,
      );
      const nextRecord = {
        ...record,
        chapters,
        updatedAt,
        collationLogs: [
          {
            id: `log-${Date.now()}`,
            chapterOrder: activeChapter.order,
            chapterTitle: activeChapter.title,
            summary,
            updatedAt,
          },
          ...record.collationLogs,
        ].slice(0, 80),
      };

      return {
        ...nextRecord,
        collationStatus:
          record.collationStatus === "待校勘" || record.collationStatus === "校勘中" ? getAutoCollationStatus(nextRecord) : record.collationStatus,
      };
    });
    setRecords(nextRecords);
    writeLocalClassics(nextRecords);
    setSaveNotice(`第 ${activeChapter.order} 章已保存`);
    window.setTimeout(() => setSaveNotice(""), 1800);
  }

  async function copyActiveChapter() {
    if (!selected || !activeChapter) return;
    const text = [
      `《${selected.title}》第 ${activeChapter.order} 章 ${activeChapter.title}`,
      "",
      "原文：",
      activeChapter.original,
      "",
      "白话：",
      translationDraft.trim() || activeChapter.translation,
      "",
      "注解：",
      notesDraft.trim() || activeChapter.notes.join("\n"),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
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
            <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-4 py-2 text-sm text-[#e8c86e]" href="/intake">
              入藏队列
            </Link>
            <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-4 py-2 text-sm text-[#e8c86e]" href="/search">
              总检索
            </Link>
            <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-4 py-2 text-sm text-[#e8c86e]" href="/paths">
              研读路径
            </Link>
            <Link className="rounded-[8px] bg-[#d8b642] px-4 py-2 text-sm font-semibold text-[#120e09]" href="/classics/import">
              导入古籍
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-[#241c15]">
        <img src="/images/dao-library-hero.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#080706_0%,rgba(8,7,6,0.9)_54%,rgba(8,7,6,0.66)_100%)]" />
        <div className="relative mx-auto grid max-w-[1220px] gap-8 px-5 py-14 lg:grid-cols-[0.92fr_0.5fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-[#d8b642]">LOCAL SCRIPTORIUM</p>
            <h1 className="mt-4 text-5xl font-semibold leading-tight text-[#fff4d7] md:text-6xl">本机典藏</h1>
            <p className="mt-5 max-w-[44rem] text-base leading-8 text-[#cbb894]">
              这里收已经从入藏队列转成书目的内容。先在本机形成可读、可搜、可导出的典藏，再逐步补版本、白话和注解。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="rounded-[8px] bg-[#d8b642] px-5 py-3 text-sm font-semibold text-[#120e09]" href="/classics/import">
                新增古籍
              </Link>
              <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-5 py-3 text-sm font-semibold text-[#e8c86e]" href="/intake">
                回入藏队列
              </Link>
              <button
                type="button"
                onClick={copySelected}
                className="inline-flex items-center gap-2 rounded-[8px] border border-[#6e562b] bg-[#120e09] px-5 py-3 text-sm font-semibold text-[#e8c86e]"
              >
                <ClipboardCopy size={16} />
                {copied ? "已复制" : "导出选中书目"}
              </button>
              <button
                type="button"
                onClick={copySelectedMarkdown}
                className="inline-flex items-center gap-2 rounded-[8px] border border-[#6e562b] bg-[#120e09] px-5 py-3 text-sm font-semibold text-[#e8c86e]"
              >
                <ClipboardCopy size={16} />
                复制 Markdown
              </button>
              <a className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-5 py-3 text-sm font-semibold text-[#e8c86e]" href="#collation-desk">
                打开校勘台
              </a>
            </div>
          </div>
          <aside className="rounded-[8px] border border-[#463722] bg-[#100c09]/88 p-5">
            <div className="flex items-center gap-3">
              <LibraryBig className="text-[#d8b642]" size={24} />
              <div>
                <p className="text-sm text-[#b99758]">本机入藏</p>
                <h2 className="text-3xl font-semibold text-[#fff4d7]">{records.length}</h2>
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-[8px] bg-[#080706] p-3">
                <dt className="text-[#786954]">章节</dt>
                <dd className="mt-1 text-[#f4deb0]">{totalChapters}</dd>
              </div>
              <div className="rounded-[8px] bg-[#080706] p-3">
                <dt className="text-[#786954]">汉字</dt>
                <dd className="mt-1 text-[#f4deb0]">{totalWords}</dd>
              </div>
              <div className="rounded-[8px] bg-[#080706] p-3">
                <dt className="text-[#786954]">关键词</dt>
                <dd className="mt-1 text-[#f4deb0]">{keywordCount}</dd>
              </div>
              <div className="col-span-3 rounded-[8px] bg-[#080706] p-3">
                <dt className="text-[#786954]">校勘轨迹</dt>
                <dd className="mt-1 text-[#f4deb0]">{collationCount} 条</dd>
              </div>
              <div className="col-span-3 rounded-[8px] bg-[#080706] p-3">
                <dt className="text-[#786954]">待办章节</dt>
                <dd className="mt-1 text-[#f4deb0]">{pendingChapters} 章</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1220px] min-w-0 gap-6 px-5 py-8 lg:grid-cols-[330px_1fr]">
        <aside className="min-w-0 self-start overflow-hidden rounded-[8px] border border-[#3a3026] bg-[#100c09] p-4 lg:sticky lg:top-4">
          <label className="flex items-center gap-3 rounded-[8px] border border-[#3a3026] bg-[#080706] px-4 py-3">
            <Search className="text-[#d8b642]" size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full bg-transparent text-sm text-[#f4ead4] outline-none placeholder:text-[#71604b]"
              placeholder="搜 书名 / 术语 / 原文"
            />
          </label>

          <div className="mt-5 flex flex-wrap gap-2">
            {classicCategories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-[8px] border px-3 py-2 text-sm ${categoryButtonClass(category === item)}`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-5">
            <p className="mb-3 text-xs font-semibold text-[#b99758]">整理状态</p>
            <div className="grid gap-2">
              {statusFilters.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`flex items-center justify-between rounded-[8px] border px-3 py-2 text-sm ${
                    statusFilter === status
                      ? "border-[#d8b642] bg-[#d8b642] text-[#120e09]"
                      : "border-[#3a3026] bg-[#14100c] text-[#c8b692] hover:border-[#8a6f38] hover:text-[#f4deb0]"
                  }`}
                >
                  <span>{status}</span>
                  <span>{statusCounts[status]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {filteredRecords.length ? (
              filteredRecords.map((record) => {
                const progress = getBookProgress(record);
                return (
                  <button
                    key={record.id}
                    type="button"
                    onClick={() => setSelectedId(record.id)}
                    className={`w-full rounded-[8px] border p-4 text-left transition ${
                      selected?.id === record.id ? "border-[#d8b642] bg-[#1d160f]" : "border-[#33291f] bg-[#080706] hover:border-[#806739]"
                    }`}
                  >
                    <p className="text-xs text-[#b99758]">{record.category} · {record.sourceType}</p>
                    <strong className="mt-1 block break-words text-lg text-[#fff4d7]">{record.title}</strong>
                    <p className="mt-2 text-xs leading-6 text-[#a99575]">
                      {record.author || "作者待考"} · {record.dynasty || "朝代待考"} · {record.collationStatus}
                    </p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#21190f]">
                      <div className="h-full rounded-full bg-[#d8b642]" style={{ width: `${progress.percent}%` }} />
                    </div>
                    <p className="mt-3 text-xs leading-6 text-[#8d7a61]">
                      {record.chapters.length} 章 · 可复核 {progress.completed} 章 · {formatLocalClassicTime(record.updatedAt)}
                    </p>
                  </button>
                );
              })
            ) : (
              <div className="rounded-[8px] border border-[#33291f] bg-[#080706] p-5">
                <p className="text-sm leading-7 text-[#a99575]">还没有匹配书目。先从入藏队列收入一本。</p>
              </div>
            )}
          </div>
        </aside>

        {selected ? (
          <div className="grid min-w-0 gap-6">
            <section className="rounded-[8px] border border-[#463722] bg-[#120e0a] p-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_250px]">
                <div>
                  <p className="text-sm font-semibold text-[#d8b642]">{selected.category} · {selected.sourceType}</p>
                  <h2 className="mt-3 text-4xl font-semibold text-[#fff4d7]">{selected.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-[#d8c8aa]">
                    {[selected.author || "作者待考", selected.dynasty || "朝代待考", selected.edition || "版本待补"].join(" · ")}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[#a99575]">
                    {selected.chapters.length} 章 · {selected.cjkCount} 个汉字 · 入藏准备度 {selected.readinessScore}%
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {selected.keywords.slice(0, 14).map((keyword) => (
                      <Link key={keyword} href={`/glossary?term=${encodeURIComponent(keyword)}`} className="rounded-full bg-[#21190f] px-3 py-1 text-xs text-[#d8c8aa] hover:text-[#e8c86e]">
                        {keyword}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="rounded-[8px] border border-[#33291f] bg-[#080706] p-5">
                  <BookMarked className="text-[#d8b642]" size={24} />
                  <p className="mt-4 inline-flex rounded-full border border-[#6e562b] px-3 py-1 text-xs text-[#e8c86e]">{selected.collationStatus}</p>
                  <p className="mt-4 text-sm text-[#b99758]">入藏时间</p>
                  <p className="mt-1 text-lg font-semibold text-[#fff4d7]">{formatLocalClassicTime(selected.updatedAt)}</p>
                  <p className="mt-4 text-xs leading-6 text-[#8d7a61]">{selected.sourceNote || "来源说明待补"}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => deleteRecord(selected.id)}
                      className="inline-flex items-center gap-2 rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm text-[#e8c86e]"
                    >
                      <Trash2 size={15} />
                      删除
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {selectedProgress ? (
              <section className="rounded-[8px] border border-[#463722] bg-[#120e0a] p-6">
                <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                  <div>
                    <div className="flex items-center gap-3">
                      <ListChecks className="text-[#d8b642]" size={22} />
                      <div>
                        <p className="text-sm text-[#b99758]">校勘进度</p>
                        <h2 className="text-2xl font-semibold text-[#fff4d7]">先让每章有白话、有注解、可复核</h2>
                      </div>
                    </div>
                    <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#21190f]">
                      <div className="h-full rounded-full bg-[#d8b642]" style={{ width: `${selectedProgress.percent}%` }} />
                    </div>
                    <p className="mt-3 text-sm leading-7 text-[#a99575]">
                      已有 {selectedProgress.completed} / {selectedProgress.total} 章进入可复核状态，整理完成度 {selectedProgress.percent}%。
                    </p>
                  </div>
                  <div className="rounded-[8px] border border-[#33291f] bg-[#080706] p-5">
                    <dl className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <dt className="text-[#786954]">白话</dt>
                        <dd className="mt-1 text-[#f4deb0]">{selectedProgress.translated}</dd>
                      </div>
                      <div>
                        <dt className="text-[#786954]">注解</dt>
                        <dd className="mt-1 text-[#f4deb0]">{selectedProgress.noted}</dd>
                      </div>
                      <div>
                        <dt className="text-[#786954]">待办</dt>
                        <dd className="mt-1 text-[#f4deb0]">{selectedProgress.pending}</dd>
                      </div>
                    </dl>
                    {selectedProgress.nextPending ? (
                      (() => {
                        const nextPending = selectedProgress.nextPending;
                        return (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveChapterOrder(nextPending.chapter.order);
                              setTranslationDraft(nextPending.chapter.translation);
                              setNotesDraft(nextPending.chapter.notes.join("\n"));
                              document.getElementById("collation-desk")?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="mt-5 w-full rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm font-semibold text-[#e8c86e] hover:border-[#d8b642]"
                          >
                            处理第 {nextPending.chapter.order} 章 · {nextPending.todo}
                          </button>
                        );
                      })()
                    ) : (
                      <p className="mt-5 rounded-[8px] border border-[#48613a] bg-[#172013] px-4 py-3 text-sm text-[#b8d49b]">
                        这本已经全部进入可复核状态。
                      </p>
                    )}
                  </div>
                </div>
              </section>
            ) : null}

            <section className="rounded-[8px] border border-[#463722] bg-[#120e0a] p-6">
              <div className="flex items-center gap-3">
                <BookMarked className="text-[#d8b642]" size={22} />
                <div>
                  <p className="text-sm text-[#b99758]">书目信息</p>
                  <h2 className="text-2xl font-semibold text-[#fff4d7]">作者、版本、来源和整理状态</h2>
                </div>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-[#c8b692]">
                  作者
                  <input
                    value={metaDraft.author}
                    onChange={(event) => setMetaDraft((current) => ({ ...current, author: event.target.value }))}
                    className="w-full rounded-[8px] border border-[#3a3026] bg-[#080706] px-4 py-3 text-sm text-[#f4ead4] outline-none focus:border-[#d8b642]"
                    placeholder="例：老子 / 郭璞 / 待考"
                  />
                </label>
                <label className="grid gap-2 text-sm text-[#c8b692]">
                  朝代
                  <input
                    value={metaDraft.dynasty}
                    onChange={(event) => setMetaDraft((current) => ({ ...current, dynasty: event.target.value }))}
                    className="w-full rounded-[8px] border border-[#3a3026] bg-[#080706] px-4 py-3 text-sm text-[#f4ead4] outline-none focus:border-[#d8b642]"
                    placeholder="例：先秦 / 唐 / 明"
                  />
                </label>
                <label className="grid gap-2 text-sm text-[#c8b692]">
                  版本
                  <input
                    value={metaDraft.edition}
                    onChange={(event) => setMetaDraft((current) => ({ ...current, edition: event.target.value }))}
                    className="w-full rounded-[8px] border border-[#3a3026] bg-[#080706] px-4 py-3 text-sm text-[#f4ead4] outline-none focus:border-[#d8b642]"
                    placeholder="例：王弼注本 / 影印本 / 自整理"
                  />
                </label>
                <label className="grid gap-2 text-sm text-[#c8b692]">
                  整理状态
                  <select
                    value={metaDraft.collationStatus}
                    onChange={(event) =>
                      setMetaDraft((current) => ({
                        ...current,
                        collationStatus: event.target.value as LocalClassicRecord["collationStatus"],
                      }))
                    }
                    className="w-full rounded-[8px] border border-[#3a3026] bg-[#080706] px-4 py-3 text-sm text-[#f4ead4] outline-none focus:border-[#d8b642]"
                  >
                    {localCollationStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm text-[#c8b692] md:col-span-2">
                  来源说明
                  <textarea
                    value={metaDraft.sourceNote}
                    onChange={(event) => setMetaDraft((current) => ({ ...current, sourceNote: event.target.value }))}
                    className="min-h-[110px] w-full resize-y rounded-[8px] border border-[#3a3026] bg-[#080706] p-4 text-sm leading-7 text-[#f4ead4] outline-none focus:border-[#d8b642]"
                    placeholder="记录文本来源、整理依据、底本说明，或暂存需要回查的版本线索。"
                  />
                </label>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={saveBookMetadata}
                  className="inline-flex items-center gap-2 rounded-[8px] bg-[#d8b642] px-4 py-2 text-sm font-semibold text-[#120e09]"
                >
                  <Save size={16} />
                  保存书目信息
                </button>
                {metaNotice ? <span className="text-sm text-[#b8d49b]">{metaNotice}</span> : null}
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[8px] border border-[#3a3026] bg-[#100c09] p-6">
                <div className="flex items-center gap-3">
                  <BookOpenText className="text-[#d8b642]" size={22} />
                  <div>
                    <p className="text-sm text-[#b99758]">章节目录</p>
                    <h2 className="text-2xl font-semibold text-[#fff4d7]">先把原文读通</h2>
                  </div>
                </div>
                <div className="mt-5 grid gap-3">
                  {selected.chapters.map((chapter) => {
                    const todo = getChapterTodo(chapter);
                    return (
                      <a key={chapter.order} href={`#local-chapter-${chapter.order}`} className="rounded-[8px] border border-[#33291f] bg-[#080706] p-4 hover:border-[#d8b642]">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-xs text-[#b99758]">{chapter.order}</p>
                          <span className={`rounded-full border px-2.5 py-1 text-xs ${chapterTodoClass(todo)}`}>{todo}</span>
                        </div>
                        <h3 className="mt-2 text-lg font-semibold text-[#fff4d7]">{chapter.title}</h3>
                        <p className="mt-2 line-clamp-2 text-xs leading-6 text-[#a99575]">{chapter.original}</p>
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[8px] border border-[#3a3026] bg-[#100c09] p-6">
                <div className="flex items-center gap-3">
                  <FileText className="text-[#d8b642]" size={22} />
                  <div>
                    <p className="text-sm text-[#b99758]">入藏索引</p>
                    <h2 className="text-2xl font-semibold text-[#fff4d7]">术语和路径先挂上</h2>
                  </div>
                </div>
                <div className="mt-5 grid gap-4">
                  <div className="rounded-[8px] border border-[#33291f] bg-[#080706] p-4">
                    <p className="text-xs text-[#b99758]">术语命中</p>
                    <p className="mt-2 text-sm leading-7 text-[#d8c8aa]">{selected.matchedTerms.length ? selected.matchedTerms.join(" / ") : "待补术语"}</p>
                  </div>
                  <div className="rounded-[8px] border border-[#33291f] bg-[#080706] p-4">
                    <p className="text-xs text-[#b99758]">建议路径</p>
                    <p className="mt-2 text-sm leading-7 text-[#d8c8aa]">{selected.suggestedPaths.length ? selected.suggestedPaths.join(" / ") : "待挂路径"}</p>
                  </div>
                  <pre className="max-h-[260px] overflow-auto whitespace-pre-wrap break-all rounded-[8px] border border-[#33291f] bg-[#080706] p-4 text-xs leading-6 text-[#c8b692]">
                    {JSON.stringify(buildExport(selected), null, 2)}
                  </pre>
                </div>
              </div>
            </section>

            <section id="collation-desk" className="scroll-mt-8 rounded-[8px] border border-[#463722] bg-[#120e0a] p-6">
              <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
                <div>
                  <div className="flex items-center gap-3">
                    <Edit3 className="text-[#d8b642]" size={22} />
                    <div>
                      <p className="text-sm text-[#b99758]">校勘台</p>
                      <h2 className="text-2xl font-semibold text-[#fff4d7]">逐章补白话和注解</h2>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[#a99575]">
                    先保存到浏览器本机。后面你给我完整古籍时，这里可以继续补版本、校注和术语关系。
                  </p>
                  <div className="mt-5 grid gap-3">
                    {selected.chapters.map((chapter) => {
                      const todo = getChapterTodo(chapter);
                      return (
                        <button
                          key={chapter.order}
                          type="button"
                          onClick={() => {
                            setActiveChapterOrder(chapter.order);
                            setTranslationDraft(chapter.translation);
                            setNotesDraft(chapter.notes.join("\n"));
                          }}
                          className={`rounded-[8px] border p-4 text-left ${
                            activeChapter?.order === chapter.order
                              ? "border-[#d8b642] bg-[#1d160f]"
                              : "border-[#33291f] bg-[#080706] hover:border-[#806739]"
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-xs text-[#b99758]">第 {chapter.order} 章</p>
                            <span className={`rounded-full border px-2.5 py-1 text-xs ${chapterTodoClass(todo)}`}>{todo}</span>
                          </div>
                          <strong className="mt-2 block text-[#fff4d7]">{chapter.title}</strong>
                          <span className="mt-2 block text-xs leading-6 text-[#8d7a61]">
                            {hasChapterTranslation(chapter) ? "已补白话" : "待补白话"} · 有效注解 {hasUsefulChapterNotes(chapter) ? "已补" : "待补"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {activeChapter ? (
                  <div className="rounded-[8px] border border-[#33291f] bg-[#080706] p-5">
                    <p className="text-sm font-semibold text-[#d8b642]">第 {activeChapter.order} 章 · {activeChapter.title}</p>
                    <div className="mt-4 rounded-[8px] border border-[#2d241b] bg-[#120e0a] p-4">
                      <p className="text-xs text-[#b99758]">原文</p>
                      <p className="mt-2 max-h-[220px] overflow-auto whitespace-pre-wrap text-sm leading-8 text-[#f4ead4]">{activeChapter.original}</p>
                    </div>
                    <label className="mt-4 grid gap-2 text-sm text-[#c8b692]">
                      白话
                      <textarea
                        value={translationDraft}
                        onChange={(event) => setTranslationDraft(event.target.value)}
                        className="min-h-[150px] w-full resize-y rounded-[8px] border border-[#3a3026] bg-[#120e0a] p-4 text-sm leading-7 text-[#f4ead4] outline-none focus:border-[#d8b642]"
                      />
                    </label>
                    <label className="mt-4 grid gap-2 text-sm text-[#c8b692]">
                      注解，每行一条
                      <textarea
                        value={notesDraft}
                        onChange={(event) => setNotesDraft(event.target.value)}
                        className="min-h-[170px] w-full resize-y rounded-[8px] border border-[#3a3026] bg-[#120e0a] p-4 text-sm leading-7 text-[#f4ead4] outline-none focus:border-[#d8b642]"
                      />
                    </label>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={saveChapterEdits}
                        className="inline-flex items-center gap-2 rounded-[8px] bg-[#d8b642] px-4 py-2 text-sm font-semibold text-[#120e09]"
                      >
                        <Save size={16} />
                        保存校勘
                      </button>
                      <button
                        type="button"
                        onClick={copyActiveChapter}
                        className="inline-flex items-center gap-2 rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm text-[#e8c86e]"
                      >
                        <ClipboardCopy size={15} />
                        复制本章
                      </button>
                      {saveNotice ? <span className="text-sm text-[#b8d49b]">{saveNotice}</span> : null}
                    </div>
                  </div>
                ) : null}
              </div>
            </section>

            <section className="rounded-[8px] border border-[#463722] bg-[#120e0a] p-6">
              <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
                <div>
                  <div className="flex items-center gap-3">
                    <Upload className="text-[#d8b642]" size={22} />
                    <div>
                      <p className="text-sm text-[#b99758]">典藏备份</p>
                      <h2 className="text-2xl font-semibold text-[#fff4d7]">整库复制与恢复</h2>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[#a99575]">
                    浏览器本机数据适合快速整理，长期保存最好定期复制整库备份。换电脑或清浏览器前，把备份 JSON 粘回来即可恢复。
                  </p>
                  <dl className="mt-5 grid grid-cols-3 gap-3 text-sm">
                    <div className="rounded-[8px] bg-[#080706] p-3">
                      <dt className="text-[#786954]">书目</dt>
                      <dd className="mt-1 text-[#f4deb0]">{records.length}</dd>
                    </div>
                    <div className="rounded-[8px] bg-[#080706] p-3">
                      <dt className="text-[#786954]">章节</dt>
                      <dd className="mt-1 text-[#f4deb0]">{totalChapters}</dd>
                    </div>
                    <div className="rounded-[8px] bg-[#080706] p-3">
                      <dt className="text-[#786954]">校勘</dt>
                      <dd className="mt-1 text-[#f4deb0]">{collationCount}</dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    onClick={copyLibraryBackup}
                    className="mt-5 inline-flex items-center gap-2 rounded-[8px] bg-[#d8b642] px-4 py-2 text-sm font-semibold text-[#120e09]"
                  >
                    <ClipboardCopy size={16} />
                    复制整库备份
                  </button>
                  {backupNotice ? <p className="mt-3 text-sm text-[#b8d49b]">{backupNotice}</p> : null}
                </div>

                <div className="rounded-[8px] border border-[#33291f] bg-[#080706] p-5">
                  <label className="grid gap-2 text-sm text-[#c8b692]">
                    粘贴备份 JSON
                    <textarea
                      value={backupDraft}
                      onChange={(event) => setBackupDraft(event.target.value)}
                      className="min-h-[230px] w-full resize-y rounded-[8px] border border-[#3a3026] bg-[#120e0a] p-4 text-xs leading-6 text-[#f4ead4] outline-none focus:border-[#d8b642]"
                      placeholder='{"schema":"zhongxu-local-classics/v2","records":[...]}'
                    />
                  </label>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => restoreLibraryBackup("merge")}
                      className="rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm font-semibold text-[#e8c86e]"
                    >
                      合并导入
                    </button>
                    <button
                      type="button"
                      onClick={() => restoreLibraryBackup("replace")}
                      className="rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm font-semibold text-[#e8c86e]"
                    >
                      覆盖恢复
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-4">
              {selected.chapters.map((chapter) => (
                <article key={chapter.order} id={`local-chapter-${chapter.order}`} className="scroll-mt-8 rounded-[8px] border border-[#3a3026] bg-[#100c09] p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#d8b642]">第 {chapter.order} 章</p>
                    <span className={`rounded-full border px-3 py-1 text-xs ${chapterTodoClass(getChapterTodo(chapter))}`}>{getChapterTodo(chapter)}</span>
                  </div>
                  <h2 className="mt-3 text-3xl font-semibold text-[#fff4d7]">{chapter.title}</h2>
                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <section className="rounded-[8px] border border-[#33291f] bg-[#080706] p-5">
                      <p className="text-sm font-semibold text-[#d8b642]">原文</p>
                      <p className="mt-3 whitespace-pre-wrap text-base leading-9 text-[#fff4d7]">{chapter.original}</p>
                    </section>
                    <section className="rounded-[8px] border border-[#33291f] bg-[#080706] p-5">
                      <p className="text-sm font-semibold text-[#d8b642]">白话与注解</p>
                      <p className="mt-3 text-sm leading-8 text-[#d8c8aa]">{chapter.translation}</p>
                      <ul className="mt-4 grid gap-2 text-xs leading-6 text-[#a99575]">
                        {chapter.notes.map((note) => (
                          <li key={note}>· {note}</li>
                        ))}
                      </ul>
                    </section>
                  </div>
                </article>
              ))}
            </section>

            <section className="rounded-[8px] border border-[#463722] bg-[#120e0a] p-6">
              <div className="flex items-center gap-3">
                <History className="text-[#d8b642]" size={22} />
                <div>
                  <p className="text-sm text-[#b99758]">校勘轨迹</p>
                  <h2 className="text-2xl font-semibold text-[#fff4d7]">每次整理都留下痕迹</h2>
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                {selected.collationLogs.length ? (
                  selected.collationLogs.slice(0, 8).map((log) => (
                    <div key={log.id} className="rounded-[8px] border border-[#33291f] bg-[#080706] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <strong className="text-sm text-[#fff4d7]">
                          {log.chapterOrder === "书目" ? log.chapterTitle : `第 ${log.chapterOrder} 章 ${log.chapterTitle}`}
                        </strong>
                        <span className="text-xs text-[#b99758]">{formatLocalClassicTime(log.updatedAt)}</span>
                      </div>
                      <p className="mt-2 text-xs leading-6 text-[#a99575]">{log.summary}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[8px] border border-[#33291f] bg-[#080706] p-5">
                    <p className="text-sm leading-7 text-[#a99575]">还没有校勘记录。保存一次白话或注解后，这里会自动生成轨迹。</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        ) : (
          <div className="rounded-[8px] border border-[#463722] bg-[#120e0a] p-8">
            <Upload className="text-[#d8b642]" size={26} />
            <h2 className="mt-4 text-3xl font-semibold text-[#fff4d7]">本机典藏还空着</h2>
            <p className="mt-3 text-sm leading-7 text-[#a99575]">先去录入助手保存草稿，再在入藏队列里点“收入本机典藏”。</p>
            <Link className="mt-5 inline-flex rounded-[8px] bg-[#d8b642] px-4 py-2 text-sm font-semibold text-[#120e09]" href="/classics/import">
              去录入助手
            </Link>
            <div className="mt-6 rounded-[8px] border border-[#33291f] bg-[#080706] p-5">
              <p className="text-sm font-semibold text-[#d8b642]">从备份恢复</p>
              <p className="mt-2 text-sm leading-7 text-[#a99575]">如果你之前复制过整库备份，把 JSON 粘到这里即可恢复。</p>
              <textarea
                value={backupDraft}
                onChange={(event) => setBackupDraft(event.target.value)}
                className="mt-4 min-h-[180px] w-full resize-y rounded-[8px] border border-[#3a3026] bg-[#120e0a] p-4 text-xs leading-6 text-[#f4ead4] outline-none focus:border-[#d8b642]"
                placeholder='{"schema":"zhongxu-local-classics/v2","records":[...]}'
              />
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => restoreLibraryBackup("replace")}
                  className="rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm font-semibold text-[#e8c86e]"
                >
                  恢复备份
                </button>
                {backupNotice ? <span className="text-sm text-[#b8d49b]">{backupNotice}</span> : null}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
