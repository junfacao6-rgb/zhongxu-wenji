"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpenText,
  ClipboardCopy,
  Compass,
  FileText,
  GitBranch,
  LibraryBig,
  NotebookTabs,
  Search,
  ScrollText,
  Sparkles,
  Upload,
} from "lucide-react";
import {
  classicRecords,
  getChaptersForClassic,
  studyPathRecords,
  termCategories,
  termIndexRecords,
  type ClassicChapter,
  type ClassicRecord,
  type StudyPathRecord,
  type TermCategory,
  type TermRecord,
} from "@/lib/culture-content";
import { formatImportDraftTime, readImportDrafts, type ClassicImportDraft } from "@/lib/import-drafts-storage";

type ChapterHit = {
  record: ClassicRecord;
  chapter: ClassicChapter;
};

type TermAtlasSummary = {
  term: TermRecord;
  classics: ClassicRecord[];
  chapters: ChapterHit[];
  paths: StudyPathRecord[];
  drafts: ClassicImportDraft[];
};

function filterButtonClass(active: boolean) {
  return active
    ? "border-[#d8b642] bg-[#d8b642] text-[#120e09]"
    : "border-[#3a3026] bg-[#14100c] text-[#c8b692] hover:border-[#8a6f38] hover:text-[#f4deb0]";
}

function includesAny(values: string[], needles: string[]) {
  const haystack = values.join(" ").toLowerCase();
  return needles.some((needle) => haystack.includes(needle.toLowerCase()));
}

function matchesQuery(term: TermRecord, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return [term.term, term.category, term.reading, term.summary, term.plain, term.avoid, term.practice, ...term.keywords, ...term.relatedTerms].some((value) =>
    value.toLowerCase().includes(normalized),
  );
}

function buildTermPrompt(term: TermRecord) {
  return [
    `术语：${term.term}`,
    `分类：${term.category}`,
    `核心理解：${term.summary}`,
    `白话用法：${term.plain}`,
    `常见误读：${term.avoid}`,
    `录入要求：后续补古籍时，请把包含“${term.term}”的原文、白话、注解、关键词和可验证场景分开整理，不做绝对断语。`,
  ].join("\n");
}

function buildSummary(term: TermRecord, drafts: ClassicImportDraft[]): TermAtlasSummary {
  const needles = [term.term, ...term.keywords, ...term.relatedTerms];
  const classics = classicRecords.filter(
    (record) =>
      term.classicIds.includes(record.id) ||
      includesAny([record.title, record.focus, record.summary, record.excerpt, ...record.keywords], needles),
  );

  const chapters = classicRecords.flatMap<ChapterHit>((record) =>
    getChaptersForClassic(record.id)
      .filter((chapter) => includesAny([chapter.title, chapter.theme, chapter.original, chapter.translation, ...chapter.notes, ...chapter.keywords], needles))
      .map((chapter) => ({ record, chapter })),
  );

  const paths = studyPathRecords.filter(
    (path) =>
      term.pathIds.includes(path.id) ||
      includesAny([path.title, path.subtitle, path.summary, path.suitableFor, path.nextAction, ...path.keywords, ...path.practices], needles),
  );

  const matchingDrafts = drafts
    .filter((draft) => includesAny([draft.title, draft.category, draft.sourceType, draft.rawText, ...draft.keywords], needles))
    .slice(0, 5);

  return {
    term,
    classics,
    chapters,
    paths,
    drafts: matchingDrafts,
  };
}

export default function TermAtlasPage() {
  const [category, setCategory] = useState<TermCategory>("全部");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(termIndexRecords[0].id);
  const [drafts, setDrafts] = useState<ClassicImportDraft[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const initialTerm = new URLSearchParams(window.location.search).get("term");
    if (initialTerm) {
      const matched = termIndexRecords.find((term) => term.term === initialTerm || term.keywords.includes(initialTerm));
      if (matched) setSelectedId(matched.id);
    }
    setDrafts(readImportDrafts());
  }, []);

  const filteredTerms = useMemo(() => {
    return termIndexRecords.filter((term) => {
      const categoryMatch = category === "全部" || term.category === category;
      return categoryMatch && matchesQuery(term, query);
    });
  }, [category, query]);

  const selectedTerm = useMemo(() => {
    return filteredTerms.find((term) => term.id === selectedId) ?? filteredTerms[0] ?? termIndexRecords[0];
  }, [filteredTerms, selectedId]);

  const summary = useMemo(() => buildSummary(selectedTerm, drafts), [drafts, selectedTerm]);
  const allChapterHits = useMemo(
    () =>
      termIndexRecords.reduce((sum, term) => {
        return sum + buildSummary(term, drafts).chapters.length;
      }, 0),
    [drafts],
  );

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(buildTermPrompt(selectedTerm));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  function selectRelatedTerm(label: string) {
    const next = termIndexRecords.find((term) => term.term === label);
    if (next) {
      setSelectedId(next.id);
      setCategory("全部");
      setQuery("");
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
            <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-4 py-2 text-sm text-[#e8c86e]" href="/classics">
              典籍库
            </Link>
            <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-4 py-2 text-sm text-[#e8c86e]" href="/paths">
              研读路径
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
        <img src="/images/dao-library-hero.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-28" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#080706_0%,rgba(8,7,6,0.9)_54%,rgba(8,7,6,0.66)_100%)]" />
        <div className="relative mx-auto grid max-w-[1220px] gap-8 px-5 py-14 lg:grid-cols-[0.92fr_0.5fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-[#d8b642]">TERM ATLAS</p>
            <h1 className="mt-4 text-5xl font-semibold leading-tight text-[#fff4d7] md:text-6xl">术语玄览</h1>
            <p className="mt-5 max-w-[44rem] text-base leading-8 text-[#cbb894]">
              把古籍里的关键字先立成索引。以后补原文、白话和注解时，每个术语都能回到典籍、章节、路径和草稿。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="rounded-[8px] bg-[#d8b642] px-5 py-3 text-sm font-semibold text-[#120e09]" href={`/search?term=${encodeURIComponent(selectedTerm.term)}`}>
                搜索“{selectedTerm.term}”
              </Link>
              <button
                type="button"
                onClick={copyPrompt}
                className="inline-flex items-center gap-2 rounded-[8px] border border-[#6e562b] bg-[#120e09] px-5 py-3 text-sm font-semibold text-[#e8c86e]"
              >
                <ClipboardCopy size={16} />
                {copied ? "已复制" : "复制录入提示"}
              </button>
              <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-5 py-3 text-sm font-semibold text-[#e8c86e]" href="/intake">
                查看入藏队列
              </Link>
            </div>
          </div>
          <aside className="rounded-[8px] border border-[#463722] bg-[#100c09]/88 p-5">
            <div className="flex items-center gap-3">
              <NotebookTabs className="text-[#d8b642]" size={24} />
              <div>
                <p className="text-sm text-[#b99758]">索引规模</p>
                <h2 className="text-3xl font-semibold text-[#fff4d7]">{termIndexRecords.length}</h2>
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-[8px] bg-[#080706] p-3">
                <dt className="text-[#786954]">分类</dt>
                <dd className="mt-1 text-[#f4deb0]">{termCategories.length - 1}</dd>
              </div>
              <div className="rounded-[8px] bg-[#080706] p-3">
                <dt className="text-[#786954]">章节</dt>
                <dd className="mt-1 text-[#f4deb0]">{allChapterHits}</dd>
              </div>
              <div className="rounded-[8px] bg-[#080706] p-3">
                <dt className="text-[#786954]">草稿</dt>
                <dd className="mt-1 text-[#f4deb0]">{drafts.length}</dd>
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
              placeholder="搜 道 / 用神 / 月令 / 九宫"
            />
          </label>

          <div className="mt-5">
            <p className="mb-3 text-xs font-semibold text-[#b99758]">分类</p>
            <div className="flex flex-wrap gap-2">
              {termCategories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setCategory(item);
                    setSelectedId(termIndexRecords[0].id);
                  }}
                  className={`rounded-[8px] border px-3 py-2 text-sm ${filterButtonClass(category === item)}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid min-w-0 gap-2">
            {filteredTerms.length ? (
              filteredTerms.map((term) => (
                <button
                  key={term.id}
                  type="button"
                  onClick={() => setSelectedId(term.id)}
                  className={`w-full min-w-0 rounded-[8px] border p-4 text-left transition ${
                    selectedTerm.id === term.id
                      ? "border-[#d8b642] bg-[#1d160f]"
                      : "border-[#33291f] bg-[#080706] hover:border-[#806739]"
                  }`}
                >
                  <span className="text-xs text-[#b99758]">{term.category}</span>
                  <strong className="mt-1 block text-xl text-[#fff4d7]">{term.term}</strong>
                  <span className="mt-2 block text-xs leading-6 text-[#a99575]">{term.summary}</span>
                </button>
              ))
            ) : (
              <div className="rounded-[8px] border border-[#33291f] bg-[#080706] p-4">
                <p className="text-sm leading-7 text-[#a99575]">没有匹配术语，换一个词或切回全部。</p>
              </div>
            )}
          </div>
        </aside>

        <div className="grid min-w-0 gap-6">
          <section className="rounded-[8px] border border-[#463722] bg-[#120e0a] p-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
              <div>
                <p className="text-sm font-semibold text-[#d8b642]">{selectedTerm.category} · {selectedTerm.reading}</p>
                <h2 className="mt-3 text-5xl font-semibold leading-tight text-[#fff4d7]">{selectedTerm.term}</h2>
                <p className="mt-4 text-base leading-8 text-[#cbb894]">{selectedTerm.summary}</p>
                <p className="mt-4 text-sm leading-7 text-[#a99575]">{selectedTerm.plain}</p>
              </div>
              <div className="rounded-[8px] border border-[#33291f] bg-[#080706] p-5">
                <div className="flex items-center gap-3">
                  <Sparkles className="text-[#d8b642]" size={22} />
                  <div>
                    <p className="text-sm text-[#b99758]">修习动作</p>
                    <h3 className="text-xl font-semibold text-[#fff4d7]">读词先验事</h3>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#a99575]">{selectedTerm.practice}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <section className="rounded-[8px] border border-[#33291f] bg-[#080706] p-5">
                <div className="flex items-center gap-2 text-[#d8b642]">
                  <BookOpenText size={18} />
                  <strong>白话用法</strong>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#d8c8aa]">{selectedTerm.plain}</p>
              </section>
              <section className="rounded-[8px] border border-[#33291f] bg-[#080706] p-5">
                <div className="flex items-center gap-2 text-[#d8b642]">
                  <Compass size={18} />
                  <strong>常见误读</strong>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#d8c8aa]">{selectedTerm.avoid}</p>
              </section>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {selectedTerm.relatedTerms.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => selectRelatedTerm(label)}
                  className="rounded-full border border-[#463722] bg-[#21190f] px-3 py-1 text-xs text-[#d8c8aa] hover:border-[#d8b642]"
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="rounded-[8px] border border-[#3a3026] bg-[#100c09] p-6">
              <div className="flex items-center gap-3">
                <LibraryBig className="text-[#d8b642]" size={22} />
                <div>
                  <p className="text-sm text-[#b99758]">关联典籍</p>
                  <h2 className="text-2xl font-semibold text-[#fff4d7]">从词回到书</h2>
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                {summary.classics.length ? (
                  summary.classics.map((record) => (
                    <Link key={record.id} href={`/classics/${record.id}`} className="rounded-[8px] border border-[#33291f] bg-[#080706] p-4 hover:border-[#d8b642]">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs text-[#b99758]">{record.category}</p>
                          <h3 className="mt-1 text-xl font-semibold text-[#fff4d7]">{record.title}</h3>
                        </div>
                        <span className="rounded-full border border-[#463722] px-3 py-1 text-xs text-[#cab89b]">{record.status}</span>
                      </div>
                      <p className="mt-3 text-xs leading-6 text-[#a99575]">{record.focus}</p>
                    </Link>
                  ))
                ) : (
                  <p className="rounded-[8px] border border-[#33291f] bg-[#080706] p-4 text-sm leading-7 text-[#a99575]">暂时没有直接关联典籍。</p>
                )}
              </div>
            </div>

            <div className="rounded-[8px] border border-[#3a3026] bg-[#100c09] p-6">
              <div className="flex items-center gap-3">
                <BookOpenText className="text-[#d8b642]" size={22} />
                <div>
                  <p className="text-sm text-[#b99758]">关联章节</p>
                  <h2 className="text-2xl font-semibold text-[#fff4d7]">原文和注解落点</h2>
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                {summary.chapters.length ? (
                  summary.chapters.slice(0, 6).map(({ record, chapter }) => (
                    <Link
                      key={`${record.id}-${chapter.order}`}
                      href={`/classics/${record.id}#chapter-${chapter.order}`}
                      className="rounded-[8px] border border-[#33291f] bg-[#080706] p-4 hover:border-[#d8b642]"
                    >
                      <p className="text-xs text-[#b99758]">《{record.title}》第 {chapter.order} 节</p>
                      <h3 className="mt-1 text-lg font-semibold text-[#fff4d7]">{chapter.title}</h3>
                      <p className="mt-2 line-clamp-2 text-xs leading-6 text-[#a99575]">{chapter.translation}</p>
                    </Link>
                  ))
                ) : (
                  <p className="rounded-[8px] border border-[#33291f] bg-[#080706] p-4 text-sm leading-7 text-[#a99575]">后续补原文后会自动形成章节命中。</p>
                )}
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="rounded-[8px] border border-[#463722] bg-[#120e0a] p-6">
              <div className="flex items-center gap-3">
                <GitBranch className="text-[#d8b642]" size={22} />
                <div>
                  <p className="text-sm text-[#b99758]">关联路径</p>
                  <h2 className="text-2xl font-semibold text-[#fff4d7]">这个词该放在哪条路里读</h2>
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                {summary.paths.map((path) => (
                  <Link key={path.id} href="/paths" className="rounded-[8px] border border-[#33291f] bg-[#080706] p-4 hover:border-[#d8b642]">
                    <p className="text-xs text-[#b99758]">{path.level} · {path.duration}</p>
                    <h3 className="mt-1 text-lg font-semibold text-[#fff4d7]">{path.title}</h3>
                    <p className="mt-2 text-xs leading-6 text-[#a99575]">{path.subtitle}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[8px] border border-[#3a3026] bg-[#100c09] p-6">
              <div className="flex items-center gap-3">
                <Upload className="text-[#d8b642]" size={22} />
                <div>
                  <p className="text-sm text-[#b99758]">待校对草稿</p>
                  <h2 className="text-2xl font-semibold text-[#fff4d7]">本机文本是否命中这个词</h2>
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                {summary.drafts.length ? (
                  summary.drafts.map((draft) => (
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
                    <FileText className="text-[#d8b642]" size={20} />
                    <p className="mt-3 text-sm leading-7 text-[#a99575]">没有本机草稿命中。把古籍或笔记粘进录入助手后，这里会显示可校对文本。</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-[8px] border border-[#463722] bg-[#120e0a] p-6">
            <div className="flex items-center gap-3">
              <ScrollText className="text-[#d8b642]" size={22} />
              <div>
                <p className="text-sm text-[#b99758]">给后续古籍的结构</p>
                <h2 className="text-2xl font-semibold text-[#fff4d7]">每个术语都要能回到原文</h2>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-[#a99575]">
              后面补《黄庭经》、命理讲义、六爻案例或奇门笔记时，我会用这套术语索引做第一层归档：先找关键词，再拆章节，再补白话和注解，最后挂到研读路径里。
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link className="rounded-[8px] bg-[#d8b642] px-4 py-2 text-sm font-semibold text-[#120e09]" href="/classics/import">
                去录入助手
              </Link>
              <Link className="rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm text-[#e8c86e]" href="/intake">
                查看入藏队列
              </Link>
              <Link className="rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm text-[#e8c86e]" href="/search">
                回总检索
              </Link>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
