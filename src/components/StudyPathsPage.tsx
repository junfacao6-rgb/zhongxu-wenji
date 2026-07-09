"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpenText,
  CheckCircle2,
  Compass,
  FileText,
  GitBranch,
  LibraryBig,
  NotebookTabs,
  ScrollText,
  Search,
  Upload,
} from "lucide-react";
import {
  classicRecords,
  getChaptersForClassic,
  studyPathRecords,
  type ClassicRecord,
  type StudyPathRecord,
} from "@/lib/culture-content";
import { formatImportDraftTime, readImportDrafts, type ClassicImportDraft } from "@/lib/import-drafts-storage";
import { getReadingStorageKey, normalizeReadingState, type ReadingState } from "@/lib/reading-storage";

type ClassicPathProgress = {
  record: ClassicRecord;
  totalChapters: number;
  completedCount: number;
  progress: number;
  nextChapterTitle: string;
};

type PathSummary = {
  path: StudyPathRecord;
  classics: ClassicPathProgress[];
  totalChapters: number;
  completedCount: number;
  progress: number;
  nextClassic: ClassicRecord;
  nextChapterTitle: string;
  matchingDrafts: ClassicImportDraft[];
};

function pathButtonClass(active: boolean) {
  return active
    ? "border-[#d8b642] bg-[#1d160f] text-[#fff4d7]"
    : "border-[#33291f] bg-[#100c09] text-[#c8b692] hover:border-[#8a6f38] hover:text-[#f4deb0]";
}

function hasKeywordOverlap(path: StudyPathRecord, draft: ClassicImportDraft) {
  const raw = draft.rawText.toLowerCase();
  return path.keywords.some((keyword) => draft.keywords.includes(keyword) || raw.includes(keyword.toLowerCase()));
}

function getClassicRecords(path: StudyPathRecord) {
  return path.classicIds
    .map((id) => classicRecords.find((record) => record.id === id))
    .filter((record): record is ClassicRecord => Boolean(record));
}

function buildPathSummary(path: StudyPathRecord, readingStates: Record<string, ReadingState>, drafts: ClassicImportDraft[]): PathSummary {
  const classics = getClassicRecords(path).map<ClassicPathProgress>((record) => {
    const chapters = getChaptersForClassic(record.id);
    const state = readingStates[record.id] ?? normalizeReadingState(null, chapters[0]?.order ?? "");
    const completedCount = chapters.filter((chapter) => state.completedOrders.includes(chapter.order)).length;
    const nextChapter = chapters.find((chapter) => !state.completedOrders.includes(chapter.order)) ?? chapters[0];

    return {
      record,
      totalChapters: chapters.length,
      completedCount,
      progress: chapters.length ? Math.round((completedCount / chapters.length) * 100) : 0,
      nextChapterTitle: nextChapter?.title ?? "待整理章节",
    };
  });

  const totalChapters = classics.reduce((sum, item) => sum + item.totalChapters, 0);
  const completedCount = classics.reduce((sum, item) => sum + item.completedCount, 0);
  const nextClassicProgress = classics.find((item) => item.completedCount < item.totalChapters) ?? classics[0];
  const categories = new Set(classics.map((item) => item.record.category));

  return {
    path,
    classics,
    totalChapters,
    completedCount,
    progress: totalChapters ? Math.round((completedCount / totalChapters) * 100) : 0,
    nextClassic: nextClassicProgress.record,
    nextChapterTitle: nextClassicProgress.nextChapterTitle,
    matchingDrafts: drafts.filter((draft) => categories.has(draft.category as ClassicRecord["category"]) || hasKeywordOverlap(path, draft)).slice(0, 4),
  };
}

export default function StudyPathsPage() {
  const [readingStates, setReadingStates] = useState<Record<string, ReadingState>>({});
  const [drafts, setDrafts] = useState<ClassicImportDraft[]>([]);
  const [selectedId, setSelectedId] = useState(studyPathRecords[0].id);

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

    setReadingStates(nextStates);
    setDrafts(readImportDrafts());
  }, []);

  const summaries = useMemo(() => studyPathRecords.map((path) => buildPathSummary(path, readingStates, drafts)), [drafts, readingStates]);
  const selectedSummary = summaries.find((summary) => summary.path.id === selectedId) ?? summaries[0];
  const linkedClassicCount = new Set(studyPathRecords.flatMap((path) => path.classicIds)).size;
  const averageProgress = summaries.length ? Math.round(summaries.reduce((sum, item) => sum + item.progress, 0) / summaries.length) : 0;

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
            <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-4 py-2 text-sm text-[#e8c86e]" href="/glossary">
              术语玄览
            </Link>
            <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-4 py-2 text-sm text-[#e8c86e]" href="/study">
              我的书斋
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
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#080706_0%,rgba(8,7,6,0.91)_52%,rgba(8,7,6,0.68)_100%)]" />
        <div className="relative mx-auto grid max-w-[1220px] gap-8 px-5 py-14 lg:grid-cols-[0.92fr_0.5fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-[#d8b642]">STUDY PATHS</p>
            <h1 className="mt-4 text-5xl font-semibold leading-tight text-[#fff4d7] md:text-6xl">研读路径</h1>
            <p className="mt-5 max-w-[44rem] text-base leading-8 text-[#cbb894]">
              把散落的古籍、笔记和问事工具串成有次第的路。先立根，再入术；先读懂，再拿来复盘。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="rounded-[8px] bg-[#d8b642] px-5 py-3 text-sm font-semibold text-[#120e09]" href={`/classics/${selectedSummary.nextClassic.id}`}>
                继续《{selectedSummary.nextClassic.title}》
              </Link>
              <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-5 py-3 text-sm font-semibold text-[#e8c86e]" href="/classics/import">
                补入新古籍
              </Link>
              <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-5 py-3 text-sm font-semibold text-[#e8c86e]" href="/intake">
                查看入藏队列
              </Link>
            </div>
          </div>
          <aside className="rounded-[8px] border border-[#463722] bg-[#100c09]/88 p-5">
            <div className="flex items-center gap-3">
              <GitBranch className="text-[#d8b642]" size={24} />
              <div>
                <p className="text-sm text-[#b99758]">路径总览</p>
                <h2 className="text-3xl font-semibold text-[#fff4d7]">{averageProgress}%</h2>
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-[8px] bg-[#080706] p-3">
                <dt className="text-[#786954]">路线</dt>
                <dd className="mt-1 text-[#f4deb0]">{studyPathRecords.length}</dd>
              </div>
              <div className="rounded-[8px] bg-[#080706] p-3">
                <dt className="text-[#786954]">典籍</dt>
                <dd className="mt-1 text-[#f4deb0]">{linkedClassicCount}</dd>
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
          <div className="mb-4 flex items-center gap-2">
            <Compass className="text-[#d8b642]" size={19} />
            <h2 className="text-sm font-semibold text-[#f4deb0]">选择路线</h2>
          </div>
          <div className="grid min-w-0 gap-3">
            {summaries.map((summary) => (
              <button
                key={summary.path.id}
                type="button"
                onClick={() => setSelectedId(summary.path.id)}
                className={`w-full min-w-0 overflow-hidden rounded-[8px] border p-4 text-left transition ${pathButtonClass(summary.path.id === selectedSummary.path.id)}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-[#b99758]">{summary.path.level} · {summary.path.duration}</p>
                    <strong className="mt-1 block break-words text-xl">{summary.path.title}</strong>
                  </div>
                  <span className="shrink-0 rounded-full border border-[#463722] px-3 py-1 text-xs text-[#cab89b]">{summary.progress}%</span>
                </div>
                <p className="mt-3 text-xs leading-6 text-[#a99575]">{summary.path.subtitle}</p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#21190f]">
                  <div className="h-full rounded-full bg-[#d8b642]" style={{ width: `${summary.progress}%` }} />
                </div>
              </button>
            ))}
          </div>
        </aside>

        <div className="grid min-w-0 gap-6">
          <section className="rounded-[8px] border border-[#463722] bg-[#120e0a] p-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_270px]">
              <div>
                <p className="text-sm font-semibold text-[#d8b642]">{selectedSummary.path.level} · {selectedSummary.path.duration}</p>
                <h2 className="mt-3 text-4xl font-semibold text-[#fff4d7]">{selectedSummary.path.title}</h2>
                <p className="mt-4 text-sm leading-8 text-[#cbb894]">{selectedSummary.path.summary}</p>
                <p className="mt-4 text-sm leading-7 text-[#a99575]">{selectedSummary.path.suitableFor}</p>
              </div>
              <div className="rounded-[8px] border border-[#33291f] bg-[#080706] p-5">
                <div className="flex items-center gap-3">
                  <NotebookTabs className="text-[#d8b642]" size={22} />
                  <div>
                    <p className="text-sm text-[#b99758]">下一步</p>
                    <h3 className="text-xl font-semibold text-[#fff4d7]">{selectedSummary.nextClassic.title}</h3>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#a99575]">
                  {selectedSummary.nextChapterTitle} · {selectedSummary.path.nextAction}
                </p>
                <Link className="mt-5 inline-flex rounded-[8px] bg-[#d8b642] px-4 py-2 text-sm font-semibold text-[#120e09]" href={`/classics/${selectedSummary.nextClassic.id}`}>
                  打开这一书
                </Link>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {selectedSummary.path.keywords.map((keyword) => (
                <span key={keyword} className="rounded-full bg-[#21190f] px-3 py-1 text-xs text-[#d8c8aa]">
                  {keyword}
                </span>
              ))}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {selectedSummary.path.milestones.map((milestone, index) => (
              <article key={milestone.title} className="rounded-[8px] border border-[#3a3026] bg-[#100c09] p-5">
                <span className="text-sm font-semibold text-[#a63f31]">第 {index + 1} 阶</span>
                <h3 className="mt-3 text-xl font-semibold text-[#fff4d7]">{milestone.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#a99575]">{milestone.text}</p>
                <p className="mt-4 border-t border-[#33291f] pt-4 text-xs leading-6 text-[#b99758]">{milestone.proof}</p>
              </article>
            ))}
          </section>

          <section className="rounded-[8px] border border-[#3a3026] bg-[#100c09] p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <LibraryBig className="text-[#d8b642]" size={23} />
                <div>
                  <p className="text-sm text-[#b99758]">路径典籍</p>
                  <h2 className="text-2xl font-semibold text-[#fff4d7]">按这个顺序推进</h2>
                </div>
              </div>
              <span className="rounded-full border border-[#463722] px-3 py-1 text-xs text-[#cab89b]">
                {selectedSummary.completedCount}/{selectedSummary.totalChapters} 节
              </span>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {selectedSummary.classics.map((item) => (
                <Link key={item.record.id} href={`/classics/${item.record.id}`} className="rounded-[8px] border border-[#33291f] bg-[#080706] p-5 hover:border-[#d8b642]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-[#b99758]">{item.record.category}</p>
                      <h3 className="mt-2 text-xl font-semibold text-[#fff4d7]">{item.record.title}</h3>
                    </div>
                    <span className="rounded-full border border-[#463722] px-3 py-1 text-xs text-[#cab89b]">{item.progress}%</span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[#a99575]">{item.record.focus}</p>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#21190f]">
                    <div className="h-full rounded-full bg-[#d8b642]" style={{ width: `${item.progress}%` }} />
                  </div>
                  <p className="mt-3 text-xs text-[#8d7a61]">下一章：{item.nextChapterTitle}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="rounded-[8px] border border-[#463722] bg-[#120e0a] p-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-[#8aa076]" size={22} />
                <div>
                  <p className="text-sm text-[#b99758]">修习动作</p>
                  <h2 className="text-2xl font-semibold text-[#fff4d7]">读完要留下痕迹</h2>
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                {selectedSummary.path.practices.map((practice) => (
                  <div key={practice} className="rounded-[8px] border border-[#33291f] bg-[#080706] p-4">
                    <p className="text-sm font-semibold text-[#f4deb0]">{practice}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link className="inline-flex items-center gap-2 rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm text-[#e8c86e]" href="/study">
                  <ScrollText size={16} />
                  去书斋
                </Link>
                <Link className="inline-flex items-center gap-2 rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm text-[#e8c86e]" href="/search">
                  <Search size={16} />
                  总检索
                </Link>
                <Link className="inline-flex items-center gap-2 rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm text-[#e8c86e]" href="/glossary">
                  <BookOpenText size={16} />
                  术语玄览
                </Link>
              </div>
            </div>

            <div className="rounded-[8px] border border-[#3a3026] bg-[#100c09] p-6">
              <div className="flex items-center gap-3">
                <Upload className="text-[#d8b642]" size={22} />
                <div>
                  <p className="text-sm text-[#b99758]">待补资料</p>
                  <h2 className="text-2xl font-semibold text-[#fff4d7]">与此路径相关的草稿</h2>
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                {selectedSummary.matchingDrafts.length ? (
                  selectedSummary.matchingDrafts.map((draft) => (
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
                    <p className="mt-3 text-sm leading-7 text-[#a99575]">暂时没有匹配草稿。后面把相关古籍或笔记粘进录入助手，这里会自动出现。</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-[8px] border border-[#463722] bg-[#120e0a] p-6">
            <div className="flex items-center gap-3">
              <BookOpenText className="text-[#d8b642]" size={22} />
              <div>
                <p className="text-sm text-[#b99758]">后续扩展</p>
                <h2 className="text-2xl font-semibold text-[#fff4d7]">新古籍进来后挂到路径</h2>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-[#a99575]">
              后面你补《黄庭经》、奇门资料、八字讲义或自己的案例笔记时，可以先保存草稿，再把它们归入对应路径。这样用户不是只看到资料堆，而是知道每一部书该怎么读、读完要验证什么。
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link className="rounded-[8px] bg-[#d8b642] px-4 py-2 text-sm font-semibold text-[#120e09]" href="/classics/import">
                保存一份草稿
              </Link>
              <Link className="rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm text-[#e8c86e]" href="/intake">
                打开入藏队列
              </Link>
              <Link className="rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm text-[#e8c86e]" href="/classics">
                回典籍库
              </Link>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
