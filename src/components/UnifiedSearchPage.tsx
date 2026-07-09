"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpenText, Compass, FileText, LibraryBig, NotebookTabs, Search, ScrollText, Upload } from "lucide-react";
import { classicRecords, getChaptersForClassic, termIndexRecords } from "@/lib/culture-content";
import { formatImportDraftTime, readImportDrafts, type ClassicImportDraft } from "@/lib/import-drafts-storage";
import { readLocalClassics, type LocalClassicRecord } from "@/lib/local-classics-storage";
import { formatReadingSavedTime, getReadingStorageKey, normalizeReadingState, type ReadingState } from "@/lib/reading-storage";

type SearchKind = "全部" | "术语" | "典籍" | "章节" | "本机" | "摘记" | "草稿";

type SearchItem = {
  id: string;
  kind: Exclude<SearchKind, "全部">;
  title: string;
  subtitle: string;
  text: string;
  href: string;
  meta: string;
  keywords: string[];
};

const kinds: SearchKind[] = ["全部", "术语", "典籍", "章节", "本机", "摘记", "草稿"];

function includesQuery(values: string[], query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return values.some((value) => value.toLowerCase().includes(normalized));
}

function getKindIcon(kind: SearchItem["kind"]) {
  if (kind === "术语") return Compass;
  if (kind === "典籍") return LibraryBig;
  if (kind === "章节") return BookOpenText;
  if (kind === "本机") return LibraryBig;
  if (kind === "摘记") return ScrollText;
  return Upload;
}

function buildSnippet(text: string, query: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  const normalized = query.trim().toLowerCase();
  if (!normalized) return clean.slice(0, 110);
  const index = clean.toLowerCase().indexOf(normalized);
  if (index < 0) return clean.slice(0, 110);
  const start = Math.max(0, index - 28);
  return `${start > 0 ? "..." : ""}${clean.slice(start, start + 132)}`;
}

export default function UnifiedSearchPage() {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<SearchKind>("全部");
  const [readingStates, setReadingStates] = useState<Record<string, ReadingState>>({});
  const [drafts, setDrafts] = useState<ClassicImportDraft[]>([]);
  const [localClassics, setLocalClassics] = useState<LocalClassicRecord[]>([]);

  useEffect(() => {
    const initialTerm = new URLSearchParams(window.location.search).get("term");
    if (initialTerm) setQuery(initialTerm);

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
    setReadingStates(nextStates);
    setDrafts(readImportDrafts());
    setLocalClassics(readLocalClassics());
  }, []);

  const allItems = useMemo<SearchItem[]>(() => {
    const termItems: SearchItem[] = termIndexRecords.map((term) => ({
      id: `term-${term.id}`,
      kind: "术语",
      title: term.term,
      subtitle: `${term.category} · ${term.reading}`,
      text: `${term.summary} ${term.plain} ${term.avoid} ${term.practice}`,
      href: `/glossary?term=${encodeURIComponent(term.term)}`,
      meta: "术语玄览",
      keywords: term.keywords,
    }));

    const classicItems: SearchItem[] = classicRecords.map((record) => ({
      id: `classic-${record.id}`,
      kind: "典籍",
      title: record.title,
      subtitle: `${record.category} · ${record.dynasty}`,
      text: `${record.summary} ${record.excerpt} ${record.focus}`,
      href: `/classics/${record.id}`,
      meta: record.status,
      keywords: record.keywords,
    }));

    const chapterItems: SearchItem[] = classicRecords.flatMap((record) =>
      getChaptersForClassic(record.id).map((chapter) => ({
        id: `chapter-${record.id}-${chapter.order}`,
        kind: "章节",
        title: `${record.title} · ${chapter.title}`,
        subtitle: chapter.theme,
        text: `${chapter.original} ${chapter.translation} ${chapter.notes.join(" ")}`,
        href: `/classics/${record.id}#chapter-${chapter.order}`,
        meta: `第 ${chapter.order} 节`,
        keywords: chapter.keywords,
      })),
    );

    const noteItems = classicRecords
      .map<SearchItem | null>((record) => {
        const state = readingStates[record.id];
        if (!state?.note.trim()) return null;
        const currentChapter = getChaptersForClassic(record.id).find((chapter) => chapter.order === state.currentOrder);
        return {
          id: `note-${record.id}`,
          kind: "摘记" as const,
          title: `《${record.title}》摘记`,
          subtitle: currentChapter ? currentChapter.title : "研读留痕",
          text: state.note,
          href: `/classics/${record.id}`,
          meta: formatReadingSavedTime(state.updatedAt),
          keywords: record.keywords,
        };
      })
      .filter((item): item is SearchItem => item !== null);

    const draftItems: SearchItem[] = drafts.map((draft) => ({
      id: `draft-${draft.id}`,
      kind: "草稿",
      title: draft.title,
      subtitle: `${draft.category} · ${draft.author || "作者待考"} · ${draft.sourceType}`,
      text: `${draft.author} ${draft.dynasty} ${draft.edition} ${draft.sourceNote} ${draft.rawText}`,
      href: "/intake",
      meta: `${draft.chapterCount} 章 · ${formatImportDraftTime(draft.updatedAt)}`,
      keywords: [draft.author, draft.dynasty, draft.edition, ...draft.keywords].filter(Boolean),
    }));

    const localClassicItems: SearchItem[] = localClassics.map((record) => ({
      id: `local-${record.id}`,
      kind: "本机",
      title: record.title,
      subtitle: `${record.category} · ${record.author || "作者待考"} · ${record.collationStatus}`,
      text: `${record.author} ${record.dynasty} ${record.edition} ${record.sourceType} ${record.sourceNote} ${record.collationStatus} ${record.keywords.join(" ")} ${record.matchedTerms.join(" ")} ${record.suggestedPaths.join(" ")} ${record.chapters
        .map((chapter) => `${chapter.title} ${chapter.original} ${chapter.translation} ${chapter.notes.join(" ")}`)
        .join(" ")} ${record.collationLogs.map((log) => `${log.chapterTitle} ${log.summary}`).join(" ")}`,
      href: `/library?book=${encodeURIComponent(record.id)}`,
      meta: `${record.chapters.length} 章 · ${record.collationStatus}`,
      keywords: [record.author, record.dynasty, record.edition, record.collationStatus, ...record.keywords].filter(Boolean),
    }));

    const localChapterItems: SearchItem[] = localClassics.flatMap((record) =>
      record.chapters.map((chapter) => ({
        id: `local-chapter-${record.id}-${chapter.order}`,
        kind: "本机" as const,
        title: `${record.title} · ${chapter.title}`,
        subtitle: `${record.category} · ${record.collationStatus} · 本机章节`,
        text: `${record.author} ${record.dynasty} ${record.edition} ${record.sourceNote} ${record.collationStatus} ${chapter.original} ${chapter.translation} ${chapter.notes.join(" ")}`,
        href: `/library?book=${encodeURIComponent(record.id)}#local-chapter-${chapter.order}`,
        meta: `第 ${chapter.order} 章`,
        keywords: [record.author, record.dynasty, record.edition, record.collationStatus, ...record.keywords].filter(Boolean),
      })),
    );

    return [...termItems, ...classicItems, ...chapterItems, ...localClassicItems, ...localChapterItems, ...noteItems, ...draftItems];
  }, [drafts, localClassics, readingStates]);

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const kindMatch = kind === "全部" || item.kind === kind;
      const queryMatch = includesQuery([item.title, item.subtitle, item.text, item.meta, ...item.keywords], query);
      return kindMatch && queryMatch;
    });
  }, [allItems, kind, query]);

  const counts = kinds.reduce<Record<SearchKind, number>>((acc, item) => {
    acc[item] = item === "全部" ? allItems.length : allItems.filter((entry) => entry.kind === item).length;
    return acc;
  }, {} as Record<SearchKind, number>);

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
            <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-4 py-2 text-sm text-[#e8c86e]" href="/study">
              我的书斋
            </Link>
            <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-4 py-2 text-sm text-[#e8c86e]" href="/intake">
              入藏队列
            </Link>
            <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-4 py-2 text-sm text-[#e8c86e]" href="/library">
              本机典藏
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-[#241c15]">
        <img src="/images/dao-library-hero.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-28" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#080706_0%,rgba(8,7,6,0.9)_54%,rgba(8,7,6,0.7)_100%)]" />
        <div className="relative mx-auto grid max-w-[1220px] gap-8 px-5 py-14 lg:grid-cols-[0.9fr_0.55fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-[#d8b642]">ARCHIVE SEARCH</p>
            <h1 className="mt-4 text-5xl font-semibold leading-tight text-[#fff4d7] md:text-6xl">典籍总检索</h1>
            <p className="mt-5 max-w-[44rem] text-base leading-8 text-[#cbb894]">
              一处搜索典籍、章节、个人摘记和待校对草稿。后续古籍越多，这里越是整座书斋的中枢。
            </p>
          </div>
          <aside className="rounded-[8px] border border-[#463722] bg-[#100c09]/88 p-5">
            <div className="flex items-center gap-3">
              <NotebookTabs className="text-[#d8b642]" size={24} />
              <div>
                <p className="text-sm text-[#b99758]">可检索条目</p>
                <h2 className="text-3xl font-semibold text-[#fff4d7]">{allItems.length}</h2>
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-[8px] bg-[#080706] p-3">
                <dt className="text-[#786954]">典籍</dt>
                <dd className="mt-1 text-[#f4deb0]">{counts["典籍"]}</dd>
              </div>
              <div className="rounded-[8px] bg-[#080706] p-3">
                <dt className="text-[#786954]">章节</dt>
                <dd className="mt-1 text-[#f4deb0]">{counts["章节"]}</dd>
              </div>
              <div className="rounded-[8px] bg-[#080706] p-3">
                <dt className="text-[#786954]">本机</dt>
                <dd className="mt-1 text-[#f4deb0]">{counts["本机"]}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1220px] gap-6 px-5 py-8 lg:grid-cols-[320px_1fr]">
        <aside className="self-start rounded-[8px] border border-[#3a3026] bg-[#100c09] p-4 lg:sticky lg:top-4">
          <label className="flex items-center gap-3 rounded-[8px] border border-[#3a3026] bg-[#080706] px-4 py-3">
            <Search className="text-[#d8b642]" size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full bg-transparent text-sm text-[#f4ead4] outline-none placeholder:text-[#71604b]"
              placeholder="搜 道 / 修身 / 六爻 / 黄庭"
            />
          </label>

          <div className="mt-5">
            <p className="mb-3 text-xs font-semibold text-[#b99758]">范围</p>
            <div className="grid gap-2">
              {kinds.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setKind(item)}
                  className={`flex items-center justify-between rounded-[8px] border px-3 py-2 text-sm ${
                    kind === item
                      ? "border-[#d8b642] bg-[#d8b642] text-[#120e09]"
                      : "border-[#3a3026] bg-[#14100c] text-[#c8b692] hover:border-[#8a6f38] hover:text-[#f4deb0]"
                  }`}
                >
                  <span>{item}</span>
                  <span>{counts[item]}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="grid gap-4">
          <div className="rounded-[8px] border border-[#463722] bg-[#120e0a] p-5">
            <p className="text-sm text-[#b99758]">当前结果</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#fff4d7]">{filteredItems.length} 条</h2>
            <p className="mt-2 text-sm leading-7 text-[#a99575]">
              {query.trim() ? `正在检索“${query.trim()}”` : "输入关键词后可进一步收束结果。"}
            </p>
          </div>

          {filteredItems.length ? (
            filteredItems.map((item) => {
              const Icon = getKindIcon(item.kind);
              return (
                <Link key={item.id} href={item.href} className="rounded-[8px] border border-[#33291f] bg-[#100c09] p-5 hover:border-[#d8b642]">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <Icon className="mt-1 shrink-0 text-[#d8b642]" size={20} />
                      <div className="min-w-0">
                        <p className="text-xs text-[#b99758]">{item.kind} · {item.subtitle}</p>
                        <h3 className="mt-2 text-2xl font-semibold text-[#fff4d7]">{item.title}</h3>
                      </div>
                    </div>
                    <span className="rounded-full border border-[#463722] px-3 py-1 text-xs text-[#cab89b]">{item.meta}</span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[#a99575]">{buildSnippet(item.text, query)}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.keywords.slice(0, 6).map((keyword) => (
                      <span key={keyword} className="rounded-full bg-[#21190f] px-3 py-1 text-xs text-[#d8c8aa]">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="rounded-[8px] border border-[#463722] bg-[#100c09] p-8">
              <FileText className="text-[#d8b642]" size={24} />
              <p className="mt-4 text-xl font-semibold text-[#fff4d7]">暂时没有匹配结果</p>
              <p className="mt-3 text-sm leading-7 text-[#a99575]">换一个词，或把范围切回“全部”。</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
