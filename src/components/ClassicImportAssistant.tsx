"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpenText,
  CheckCircle2,
  ClipboardCopy,
  ClipboardList,
  FileText,
  GitBranch,
  Layers3,
  NotebookTabs,
  Save,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import {
  classicCategories,
  importKeywordHints,
  importSampleText,
  ingestionFields,
  sourcePipelines,
  type ClassicCategory,
} from "@/lib/culture-content";
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
} from "@/lib/intake-analysis";

const sourceTypes = ["TXT / Markdown", "Word", "PDF OCR", "图片 OCR", "手工摘录"] as const;

const supplementBodyTemplate = [
  "《新古籍题名》",
  "",
  "第一章 章名",
  "这里粘贴原文。可以按“第一章 / 卷一 / 篇一 / 第1章”分章，系统会自动拆分。",
  "",
  "第二章 章名",
  "继续粘贴下一章原文。",
].join("\n");

const supplementFormatTemplate = [
  "书名：新古籍题名",
  "分类：道家经典",
  "作者：待考",
  "朝代：待考",
  "版本：待补",
  "来源类型：TXT / Markdown",
  "来源说明：待补：文本来源、底本、OCR 或人工校对说明。",
  "",
  "正文：",
  "第一章 章名",
  "这里粘贴原文。可以按“第一章 / 卷一 / 篇一 / 第1章”分章，系统会自动拆分。",
  "",
  "第二章 章名",
  "继续粘贴下一章原文。",
].join("\n");

function parseSupplementText(text: string) {
  const lines = text.split(/\r?\n/);
  const fields: Partial<{
    title: string;
    category: ClassicCategory;
    sourceType: (typeof sourceTypes)[number];
    author: string;
    dynasty: string;
    edition: string;
    sourceNote: string;
  }> = {};
  const body: string[] = [];
  let bodyStarted = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!bodyStarted) {
      const pair = line.match(/^([^:：]{2,8})[:：]\s*(.*)$/);
      if (pair) {
        const key = pair[1].trim();
        const value = pair[2].trim();
        if (/^(书名|题名|名称)$/.test(key)) {
          fields.title = value;
          continue;
        }
        if (/^(分类|类别)$/.test(key)) {
          if (classicCategories.includes(value as ClassicCategory) && value !== "全部") fields.category = value as ClassicCategory;
          continue;
        }
        if (/^(来源类型|格式)$/.test(key)) {
          if (sourceTypes.includes(value as (typeof sourceTypes)[number])) fields.sourceType = value as (typeof sourceTypes)[number];
          continue;
        }
        if (/^(作者)$/.test(key)) {
          fields.author = value;
          continue;
        }
        if (/^(朝代|年代)$/.test(key)) {
          fields.dynasty = value;
          continue;
        }
        if (/^(版本|底本)$/.test(key)) {
          fields.edition = value;
          continue;
        }
        if (/^(来源说明|来源)$/.test(key)) {
          fields.sourceNote = value;
          continue;
        }
        if (/^(正文|原文)$/.test(key)) {
          bodyStarted = true;
          if (value) body.push(value);
          continue;
        }
      }

      const titleMatch = line.match(/^《(.+)》$/);
      if (titleMatch && !fields.title) {
        fields.title = titleMatch[1].trim();
        continue;
      }
    }

    body.push(rawLine);
  }

  return {
    fields,
    body: body.join("\n").trim(),
    recognizedCount: Object.values(fields).filter((value) => typeof value === "string" && value.trim()).length,
  };
}

export default function ClassicImportAssistant() {
  const [title, setTitle] = useState("道德经");
  const [category, setCategory] = useState<ClassicCategory>("道家经典");
  const [sourceType, setSourceType] = useState<(typeof sourceTypes)[number]>("TXT / Markdown");
  const [author, setAuthor] = useState("老子");
  const [dynasty, setDynasty] = useState("先秦");
  const [edition, setEdition] = useState("通行本");
  const [sourceNote, setSourceNote] = useState("示例文本，后续可替换为实际底本、影印本、OCR 或手工校对来源。");
  const [rawText, setRawText] = useState(importSampleText);
  const [drafts, setDrafts] = useState<ClassicImportDraft[]>([]);
  const [activeDraftId, setActiveDraftId] = useState("");
  const [saveNotice, setSaveNotice] = useState("");
  const [copiedPackage, setCopiedPackage] = useState(false);

  useEffect(() => {
    const storedDrafts = readImportDrafts();
    const draftId = new URLSearchParams(window.location.search).get("draft") ?? "";
    const initialDraft = storedDrafts.find((draft) => draft.id === draftId);
    setDrafts(storedDrafts);
    if (initialDraft) hydrateDraft(initialDraft, `已从入藏队列载入 ${initialDraft.title}`);
  }, []);

  const chapters = useMemo(() => splitChapters(rawText), [rawText]);
  const detectedKeywords = useMemo(() => importKeywordHints.filter((keyword) => rawText.includes(keyword)), [rawText]);
  const matchedTerms = useMemo(() => getMatchedTerms(rawText, detectedKeywords), [detectedKeywords, rawText]);
  const pathSuggestions = useMemo(() => getPathSuggestions(category, matchedTerms, detectedKeywords), [category, detectedKeywords, matchedTerms]);
  const cjkCount = useMemo(() => countCjk(rawText), [rawText]);
  const intakeChecks = useMemo(() => buildIntakeChecks(title, category, cjkCount, chapters, matchedTerms), [category, chapters, cjkCount, matchedTerms, title]);
  const readyScore = useMemo(() => getReadyScore(intakeChecks), [intakeChecks]);
  const allKeywords = useMemo(() => buildIntakeKeywords(detectedKeywords, matchedTerms), [detectedKeywords, matchedTerms]);
  const payload = useMemo(
    () => buildIntakePayload({
      title,
      category,
      sourceType,
      author,
      dynasty,
      edition,
      sourceNote,
      chapters,
      cjkCount,
      allKeywords,
      matchedTerms,
      pathSuggestions,
      readyScore,
      intakeChecks,
    }),
    [allKeywords, author, category, chapters, cjkCount, dynasty, edition, intakeChecks, matchedTerms, pathSuggestions, readyScore, sourceNote, sourceType, title],
  );

  function persistDraft(nextDraft: ClassicImportDraft) {
    const nextDrafts = [nextDraft, ...drafts.filter((draft) => draft.id !== nextDraft.id)].sort(
      (a, b) => Date.parse(b.updatedAt || "0") - Date.parse(a.updatedAt || "0"),
    );
    setDrafts(nextDrafts);
    writeImportDrafts(nextDrafts);
  }

  function saveDraft(forceNew = false) {
    const now = new Date().toISOString();
    const draft: ClassicImportDraft = {
      id: forceNew || !activeDraftId ? `draft-${Date.now()}` : activeDraftId,
      title: title.trim() || "未命名古籍",
      category,
      sourceType,
      author: author.trim(),
      dynasty: dynasty.trim(),
      edition: edition.trim(),
      sourceNote: sourceNote.trim(),
      rawText,
      chapterCount: chapters.length,
      cjkCount,
      keywords: allKeywords,
      updatedAt: now,
    };
    setActiveDraftId(draft.id);
    persistDraft(draft);
    setSaveNotice(`${draft.title} 已保存为草稿`);
    window.setTimeout(() => setSaveNotice(""), 1800);
  }

  async function copyIntakePackage() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      setCopiedPackage(true);
      window.setTimeout(() => setCopiedPackage(false), 1600);
    } catch {
      setCopiedPackage(false);
    }
  }

  function hydrateDraft(draft: ClassicImportDraft, notice: string) {
    setTitle(draft.title);
    setCategory(draft.category as ClassicCategory);
    setSourceType(draft.sourceType as (typeof sourceTypes)[number]);
    setAuthor(draft.author);
    setDynasty(draft.dynasty);
    setEdition(draft.edition);
    setSourceNote(draft.sourceNote);
    setRawText(draft.rawText);
    setActiveDraftId(draft.id);
    setSaveNotice(notice);
    window.setTimeout(() => setSaveNotice(""), 1800);
  }

  function loadDraft(draft: ClassicImportDraft) {
    hydrateDraft(draft, `已载入 ${draft.title}`);
  }

  function deleteDraft(id: string) {
    const nextDrafts = drafts.filter((draft) => draft.id !== id);
    setDrafts(nextDrafts);
    writeImportDrafts(nextDrafts);
    if (activeDraftId === id) setActiveDraftId("");
  }

  function loadSupplementTemplate() {
    setTitle("新古籍题名");
    setCategory("道家经典");
    setSourceType("TXT / Markdown");
    setAuthor("");
    setDynasty("");
    setEdition("");
    setSourceNote("待补：文本来源、底本、OCR 或人工校对说明。");
    setRawText(supplementBodyTemplate);
    setActiveDraftId("");
    setSaveNotice("已载入古籍补充模板");
    window.setTimeout(() => setSaveNotice(""), 1800);
  }

  function applySupplementFormat() {
    const parsed = parseSupplementText(rawText);
    if (parsed.fields.title) setTitle(parsed.fields.title);
    if (parsed.fields.category) setCategory(parsed.fields.category);
    if (parsed.fields.sourceType) setSourceType(parsed.fields.sourceType);
    if (parsed.fields.author !== undefined) setAuthor(parsed.fields.author);
    if (parsed.fields.dynasty !== undefined) setDynasty(parsed.fields.dynasty);
    if (parsed.fields.edition !== undefined) setEdition(parsed.fields.edition);
    if (parsed.fields.sourceNote !== undefined) setSourceNote(parsed.fields.sourceNote);
    if (parsed.body) setRawText(parsed.body);
    setActiveDraftId("");
    setSaveNotice(parsed.recognizedCount ? `已识别 ${parsed.recognizedCount} 项书目字段` : "没有识别到书目字段");
    window.setTimeout(() => setSaveNotice(""), 1800);
  }

  async function copySupplementFormat() {
    try {
      await navigator.clipboard.writeText(supplementFormatTemplate);
      setSaveNotice("已复制古籍补充格式");
      window.setTimeout(() => setSaveNotice(""), 1800);
    } catch {
      setSaveNotice("复制失败，可以手动载入模板");
      window.setTimeout(() => setSaveNotice(""), 1800);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#080706] text-[#f4ead4]">
      <header className="border-b border-[#2c231a] bg-[#080706]">
        <div className="mx-auto flex max-w-[1220px] flex-wrap items-center justify-between gap-3 px-5 py-4">
          <Link className="inline-flex items-center gap-2 text-sm text-[#c8b692] hover:text-[#e8c86e]" href="/classics">
            <ArrowLeft size={17} />
            返回典籍库
          </Link>
          <div className="flex flex-wrap gap-3">
            <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-4 py-2 text-sm text-[#e8c86e]" href="/">
              首页
            </Link>
            <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-4 py-2 text-sm text-[#e8c86e]" href="/paths">
              研读路径
            </Link>
            <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-4 py-2 text-sm text-[#e8c86e]" href="/glossary">
              术语玄览
            </Link>
            <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-4 py-2 text-sm text-[#e8c86e]" href="/intake">
              入藏队列
            </Link>
            <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-4 py-2 text-sm text-[#e8c86e]" href="/library">
              本机典藏
            </Link>
            <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-4 py-2 text-sm text-[#e8c86e]" href="/study">
              我的书斋
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-[#241c15]">
        <img src="/images/dao-library-hero.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-28" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#080706_0%,rgba(8,7,6,0.88)_54%,rgba(8,7,6,0.7)_100%)]" />
        <div className="relative mx-auto grid max-w-[1220px] gap-8 px-5 py-14 lg:grid-cols-[0.92fr_0.52fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-[#d8b642]">IMPORT ASSISTANT</p>
            <h1 className="mt-4 text-5xl font-semibold leading-tight text-[#fff4d7] md:text-6xl">古籍录入助手</h1>
            <p className="mt-5 max-w-[44rem] text-base leading-8 text-[#cbb894]">
              先把文本做预检：识别章节、扫描关键词、生成标准结构。后续接 PDF、Word 或图片 OCR 时，就按这套结构入库。
            </p>
          </div>
          <div className="rounded-[8px] border border-[#463722] bg-[#100c09]/88 p-5">
            <div className="flex items-center gap-3">
              <Upload className="text-[#d8b642]" size={22} />
              <div>
                <p className="text-sm text-[#b99758]">入库准备度</p>
                <h2 className="text-3xl font-semibold text-[#fff4d7]">{readyScore}%</h2>
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#21190f]">
              <div className="h-full rounded-full bg-[#d8b642]" style={{ width: `${readyScore}%` }} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {intakeChecks.map((check) => (
                <span key={check.label} className={`rounded-full px-3 py-1 text-xs ${check.ok ? "bg-[#1f2a18] text-[#b8d49b]" : "bg-[#2a1712] text-[#d89b87]"}`}>
                  {check.label}{check.ok ? "已就绪" : "待补"}
                </span>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={loadSupplementTemplate}
                className="rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm text-[#e8c86e]"
              >
                载入补充模板
              </button>
              <button
                type="button"
                onClick={applySupplementFormat}
                className="rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm text-[#e8c86e]"
              >
                识别粘贴格式
              </button>
              <button
                type="button"
                onClick={copySupplementFormat}
                className="rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm text-[#e8c86e]"
              >
                复制补充格式
              </button>
              <button
                type="button"
                onClick={() => saveDraft(false)}
                className="inline-flex items-center gap-2 rounded-[8px] bg-[#d8b642] px-4 py-2 text-sm font-semibold text-[#120e09]"
              >
                <Save size={16} />
                保存草稿
              </button>
              <button
                type="button"
                onClick={() => saveDraft(true)}
                className="rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm text-[#e8c86e]"
              >
                另存一份
              </button>
              <button
                type="button"
                onClick={copyIntakePackage}
                className="inline-flex items-center gap-2 rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm text-[#e8c86e]"
              >
                <ClipboardCopy size={16} />
                {copiedPackage ? "已复制" : "复制入库包"}
              </button>
              <Link className="rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm text-[#e8c86e]" href="/intake">
                查看队列
              </Link>
            </div>
            {saveNotice ? <p className="mt-3 text-xs text-[#b8d49b]">{saveNotice}</p> : null}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1220px] min-w-0 gap-6 px-5 py-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid min-w-0 gap-5">
          <section className="min-w-0 rounded-[8px] border border-[#3a3026] bg-[#100c09] p-5">
            <div className="mb-4 flex items-center gap-2">
              <BookOpenText className="text-[#d8b642]" size={20} />
              <h2 className="text-xl font-semibold text-[#fff4d7]">基本信息</h2>
            </div>
            <div className="grid min-w-0 gap-4 md:grid-cols-3">
              <label className="grid gap-2 text-sm text-[#c8b692]">
                书名
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="h-11 min-w-0 max-w-full rounded-[8px] border border-[#3a3026] bg-[#080706] px-3 text-[#f4ead4] outline-none focus:border-[#d8b642]"
                />
              </label>
              <label className="grid gap-2 text-sm text-[#c8b692]">
                分类
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value as ClassicCategory)}
                  className="h-11 min-w-0 max-w-full rounded-[8px] border border-[#3a3026] bg-[#080706] px-3 text-[#f4ead4] outline-none focus:border-[#d8b642]"
                >
                  {classicCategories.filter((item) => item !== "全部").map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm text-[#c8b692]">
                来源类型
                <select
                  value={sourceType}
                  onChange={(event) => setSourceType(event.target.value as (typeof sourceTypes)[number])}
                  className="h-11 min-w-0 max-w-full rounded-[8px] border border-[#3a3026] bg-[#080706] px-3 text-[#f4ead4] outline-none focus:border-[#d8b642]"
                >
                  {sourceTypes.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="min-w-0 rounded-[8px] border border-[#3a3026] bg-[#100c09] p-5">
            <div className="mb-4 flex items-center gap-2">
              <NotebookTabs className="text-[#d8b642]" size={20} />
              <div>
                <h2 className="text-xl font-semibold text-[#fff4d7]">书目信息</h2>
                <p className="mt-1 text-xs text-[#8d7a61]">这些线索会随草稿进入入藏队列和本机典藏。</p>
              </div>
            </div>
            <div className="grid min-w-0 gap-4 md:grid-cols-3">
              <label className="grid gap-2 text-sm text-[#c8b692]">
                作者
                <input
                  value={author}
                  onChange={(event) => setAuthor(event.target.value)}
                  className="h-11 min-w-0 max-w-full rounded-[8px] border border-[#3a3026] bg-[#080706] px-3 text-[#f4ead4] outline-none focus:border-[#d8b642]"
                  placeholder="例：老子 / 待考"
                />
              </label>
              <label className="grid gap-2 text-sm text-[#c8b692]">
                朝代
                <input
                  value={dynasty}
                  onChange={(event) => setDynasty(event.target.value)}
                  className="h-11 min-w-0 max-w-full rounded-[8px] border border-[#3a3026] bg-[#080706] px-3 text-[#f4ead4] outline-none focus:border-[#d8b642]"
                  placeholder="例：先秦 / 唐 / 明"
                />
              </label>
              <label className="grid gap-2 text-sm text-[#c8b692]">
                版本
                <input
                  value={edition}
                  onChange={(event) => setEdition(event.target.value)}
                  className="h-11 min-w-0 max-w-full rounded-[8px] border border-[#3a3026] bg-[#080706] px-3 text-[#f4ead4] outline-none focus:border-[#d8b642]"
                  placeholder="例：王弼注本 / OCR 初稿"
                />
              </label>
              <label className="grid gap-2 text-sm text-[#c8b692] md:col-span-3">
                来源说明
                <textarea
                  value={sourceNote}
                  onChange={(event) => setSourceNote(event.target.value)}
                  className="min-h-[96px] w-full min-w-0 max-w-full resize-y rounded-[8px] border border-[#3a3026] bg-[#080706] p-4 text-sm leading-7 text-[#f4ead4] outline-none focus:border-[#d8b642]"
                  placeholder="记录底本、来源网页、OCR 情况、人工整理说明，或后续需要回查的版本线索。"
                />
              </label>
            </div>
          </section>

          <section className="min-w-0 rounded-[8px] border border-[#3a3026] bg-[#100c09] p-5">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="text-[#d8b642]" size={20} />
              <h2 className="text-xl font-semibold text-[#fff4d7]">粘贴原文</h2>
            </div>
            <textarea
              value={rawText}
              onChange={(event) => setRawText(event.target.value)}
              className="min-h-[360px] w-full min-w-0 max-w-full resize-y rounded-[8px] border border-[#3a3026] bg-[#080706] p-4 text-sm leading-7 text-[#f4ead4] outline-none focus:border-[#d8b642]"
            />
          </section>

          <section className="grid min-w-0 gap-4 md:grid-cols-3">
            {sourcePipelines.map((pipeline) => (
              <article key={pipeline.title} className="rounded-[8px] border border-[#3a3026] bg-[#100c09] p-4">
                <Layers3 className="text-[#d8b642]" size={18} />
                <h3 className="mt-3 font-semibold text-[#fff4d7]">{pipeline.title}</h3>
                <p className="mt-2 text-xs leading-6 text-[#a99575]">{pipeline.text}</p>
                <p className="mt-3 text-xs text-[#d8b642]">{pipeline.items.join(" / ")}</p>
              </article>
            ))}
          </section>

          <section className="min-w-0 rounded-[8px] border border-[#463722] bg-[#120e0a] p-5">
            <div className="mb-4 flex items-center gap-2">
              <NotebookTabs className="text-[#d8b642]" size={20} />
              <h2 className="text-xl font-semibold text-[#fff4d7]">入库研判</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-[150px_1fr]">
              <div className="rounded-[8px] border border-[#33291f] bg-[#080706] p-4">
                <p className="text-xs text-[#b99758]">准备度</p>
                <strong className="mt-2 block text-4xl text-[#fff4d7]">{readyScore}%</strong>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#21190f]">
                  <div className="h-full rounded-full bg-[#d8b642]" style={{ width: `${readyScore}%` }} />
                </div>
              </div>
              <div className="grid gap-2">
                {intakeChecks.map((check) => (
                  <div key={check.label} className="rounded-[8px] border border-[#33291f] bg-[#080706] p-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className={check.ok ? "text-[#8aa076]" : "text-[#a63f31]"} size={17} />
                      <strong className="text-sm text-[#f4ead4]">{check.label}</strong>
                    </div>
                    <p className="mt-2 text-xs leading-6 text-[#a99575]">{check.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="min-w-0 rounded-[8px] border border-[#463722] bg-[#120e0a] p-5">
            <div className="mb-4 flex items-center gap-2">
              <ClipboardList className="text-[#d8b642]" size={20} />
              <h2 className="text-xl font-semibold text-[#fff4d7]">本机草稿</h2>
            </div>
            <div className="grid gap-3">
              {drafts.length ? (
                drafts.map((draft) => (
                  <article key={draft.id} className="rounded-[8px] border border-[#33291f] bg-[#080706] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-[#b99758]">{draft.category}</p>
                        <h3 className="mt-1 text-lg font-semibold text-[#fff4d7]">{draft.title}</h3>
                      </div>
                      <span className="rounded-full border border-[#463722] px-3 py-1 text-xs text-[#cab89b]">
                        {draft.chapterCount} 章
                      </span>
                    </div>
                    <p className="mt-3 text-xs leading-6 text-[#8d7a61]">
                      {draft.sourceType} · {draft.cjkCount} 汉字 · {formatImportDraftTime(draft.updatedAt)}
                    </p>
                    <p className="mt-2 text-xs leading-6 text-[#a99575]">
                      {draft.author || "作者待考"} · {draft.dynasty || "朝代待考"} · {draft.edition || "版本待补"}
                    </p>
                    {draft.sourceNote ? <p className="mt-2 line-clamp-2 text-xs leading-6 text-[#8d7a61]">{draft.sourceNote}</p> : null}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {draft.keywords.slice(0, 6).map((keyword) => (
                        <span key={keyword} className="rounded-full bg-[#21190f] px-3 py-1 text-xs text-[#d8c8aa]">
                          {keyword}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => loadDraft(draft)}
                        className="rounded-[8px] bg-[#d8b642] px-4 py-2 text-sm font-semibold text-[#120e09]"
                      >
                        载入校对
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteDraft(draft.id)}
                        className="inline-flex items-center gap-2 rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm text-[#e8c86e]"
                      >
                        <Trash2 size={15} />
                        删除
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[8px] border border-[#33291f] bg-[#080706] p-5">
                  <p className="text-sm leading-7 text-[#a99575]">还没有保存草稿。粘贴原文后点“保存草稿”，后面就可以继续校对。</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="grid min-w-0 gap-5">
          <section className="rounded-[8px] border border-[#463722] bg-[#120e0a] p-5">
            <div className="mb-4 flex items-center gap-2">
              <ClipboardList className="text-[#d8b642]" size={20} />
              <h2 className="text-xl font-semibold text-[#fff4d7]">章节预检</h2>
            </div>
            <div className="grid gap-3">
              {chapters.map((chapter) => (
                <div key={chapter.order} className="rounded-[8px] border border-[#33291f] bg-[#080706] p-4">
                  <p className="text-xs text-[#b99758]">{chapter.order}</p>
                  <h3 className="mt-1 font-semibold text-[#fff4d7]">{chapter.title}</h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-6 text-[#a99575]">{chapter.original}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[8px] border border-[#3a3026] bg-[#100c09] p-5">
            <div className="mb-4 flex items-center gap-2">
              <Search className="text-[#d8b642]" size={20} />
              <h2 className="text-xl font-semibold text-[#fff4d7]">关键词扫描</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {allKeywords.length ? (
                allKeywords.map((keyword) => (
                  <Link key={keyword} href={`/glossary?term=${encodeURIComponent(keyword)}`} className="rounded-full bg-[#21190f] px-3 py-1 text-xs text-[#d8c8aa] hover:text-[#e8c86e]">
                    {keyword}
                  </Link>
                ))
              ) : (
                <p className="text-sm text-[#a99575]">暂未命中预设术语，可后续手动补关键词。</p>
              )}
            </div>
          </section>

          <section className="rounded-[8px] border border-[#463722] bg-[#120e0a] p-5">
            <div className="mb-4 flex items-center gap-2">
              <NotebookTabs className="text-[#d8b642]" size={20} />
              <h2 className="text-xl font-semibold text-[#fff4d7]">术语命中</h2>
            </div>
            <div className="grid gap-3">
              {matchedTerms.length ? (
                matchedTerms.slice(0, 8).map((term) => (
                  <Link key={term.id} href={`/glossary?term=${encodeURIComponent(term.term)}`} className="rounded-[8px] border border-[#33291f] bg-[#080706] p-4 hover:border-[#d8b642]">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <strong className="text-[#fff4d7]">{term.term}</strong>
                      <span className="rounded-full border border-[#463722] px-3 py-1 text-xs text-[#cab89b]">{term.category}</span>
                    </div>
                    <p className="mt-2 text-xs leading-6 text-[#a99575]">{term.summary}</p>
                  </Link>
                ))
              ) : (
                <div className="rounded-[8px] border border-[#33291f] bg-[#080706] p-5">
                  <p className="text-sm leading-7 text-[#a99575]">还没有命中术语。后续可在术语玄览里补词条，或扩大关键词表。</p>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[8px] border border-[#463722] bg-[#120e0a] p-5">
            <div className="mb-4 flex items-center gap-2">
              <GitBranch className="text-[#d8b642]" size={20} />
              <h2 className="text-xl font-semibold text-[#fff4d7]">路径建议</h2>
            </div>
            <div className="grid gap-3">
              {pathSuggestions.length ? (
                pathSuggestions.map((item) => (
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
                <div className="rounded-[8px] border border-[#33291f] bg-[#080706] p-5">
                  <p className="text-sm leading-7 text-[#a99575]">暂时没有路径建议。补充正文或关键词后，会自动推荐研读路径。</p>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[8px] border border-[#3a3026] bg-[#100c09] p-5">
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-[#8aa076]" size={20} />
              <h2 className="text-xl font-semibold text-[#fff4d7]">字段对照</h2>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {ingestionFields.map(([key, label]) => (
                <div key={key} className="rounded-[8px] border border-[#33291f] bg-[#080706] p-3">
                  <strong className="text-sm text-[#f4ead4]">{label}</strong>
                  <code className="mt-2 block text-xs text-[#d8b642]">{key}</code>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[8px] border border-[#463722] bg-[#120e0a] p-5">
            <h2 className="text-xl font-semibold text-[#fff4d7]">结构化预览</h2>
            <pre className="mt-4 max-h-[420px] max-w-full overflow-auto whitespace-pre-wrap break-all rounded-[8px] border border-[#33291f] bg-[#080706] p-4 text-xs leading-6 text-[#c8b692]">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </section>
        </div>
      </section>
    </main>
  );
}
