"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpenText,
  Boxes,
  CheckCircle2,
  FileText,
  Layers3,
  Search,
  Upload,
} from "lucide-react";
import {
  classicCategories,
  classicDifficulties,
  classicRecords,
  ingestionFields,
  readingModes,
  sourcePipelines,
  type ClassicCategory,
  type ClassicDifficulty,
} from "@/lib/culture-content";

function filterButtonClass(active: boolean) {
  return active
    ? "border-[#d8b642] bg-[#d8b642] text-[#120e09]"
    : "border-[#3a3026] bg-[#14100c] text-[#c8b692] hover:border-[#8a6f38] hover:text-[#f4deb0]";
}

export default function ClassicsWorkbench() {
  const [category, setCategory] = useState<ClassicCategory>("全部");
  const [difficulty, setDifficulty] = useState<ClassicDifficulty>("全部难度");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(classicRecords[0].id);

  const filteredRecords = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return classicRecords.filter((record) => {
      const categoryMatch = category === "全部" || record.category === category;
      const difficultyMatch = difficulty === "全部难度" || record.difficulty === difficulty;
      const queryMatch =
        !normalized ||
        [record.title, record.category, record.dynasty, record.focus, record.summary, record.excerpt, ...record.keywords].some((value) =>
          value.toLowerCase().includes(normalized),
        );
      return categoryMatch && difficultyMatch && queryMatch;
    });
  }, [category, difficulty, query]);

  const selectedRecord = useMemo(() => {
    return filteredRecords.find((record) => record.id === selectedId) ?? filteredRecords[0] ?? classicRecords[0];
  }, [filteredRecords, selectedId]);

  const relatedRecords = classicRecords.filter((record) => record.id !== selectedRecord.id && record.category === selectedRecord.category).slice(0, 3);

  return (
    <main className="min-h-screen bg-[#080706] text-[#f4ead4]">
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
            <Link className="rounded-[8px] border border-[#6e562b] bg-[#120e09] px-4 py-2 text-sm text-[#e8c86e]" href="/daily">
              今日日课
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
        <img src="/images/dao-library-hero.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-32" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#080706_0%,rgba(8,7,6,0.86)_48%,rgba(8,7,6,0.62)_100%)]" />
        <div className="relative mx-auto grid max-w-[1220px] gap-8 px-5 py-14 lg:grid-cols-[0.88fr_0.52fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-[#d8b642]">CLASSICS WORKBENCH</p>
            <h1 className="mt-4 text-5xl font-semibold leading-tight text-[#fff4d7] md:text-6xl">典籍库工作台</h1>
            <p className="mt-5 max-w-[44rem] text-base leading-8 text-[#cbb894]">
              用来承接后续古籍、讲义、笔记和案例。现在先把检索、筛选、阅读预览和接入字段跑通，后面补内容会更稳。
            </p>
          </div>
          <div className="rounded-[8px] border border-[#463722] bg-[#100c09]/88 p-5">
            <div className="flex items-center gap-3">
              <Upload className="text-[#d8b642]" size={22} />
              <div>
                <p className="text-sm text-[#b99758]">下一批可接入</p>
                <h2 className="text-xl font-semibold text-[#fff4d7]">原文、章节、注解、关键词</h2>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-[#a99575]">
              你后面给 PDF、Word、TXT 或图片，我会先抽章节和关键词，再进入校对与注解。
            </p>
            <Link className="mt-4 inline-flex text-sm font-semibold text-[#d8b642] hover:text-[#f4deb0]" href="/classics/import">
              打开古籍录入助手
            </Link>
            <Link className="mt-3 inline-flex text-sm font-semibold text-[#d8b642] hover:text-[#f4deb0]" href="/intake">
              查看入藏队列
            </Link>
            <Link className="mt-3 inline-flex text-sm font-semibold text-[#d8b642] hover:text-[#f4deb0]" href="/library">
              打开本机典藏
            </Link>
          </div>
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
              placeholder="搜索 书名 / 用神 / 修身 / 六爻"
            />
          </label>

          <div className="mt-5">
            <p className="mb-3 text-xs font-semibold text-[#b99758]">分类</p>
            <div className="flex flex-wrap gap-2">
              {classicCategories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setCategory(item);
                    setSelectedId(classicRecords[0].id);
                  }}
                  className={`rounded-[8px] border px-3 py-2 text-sm ${filterButtonClass(category === item)}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="mb-3 text-xs font-semibold text-[#b99758]">难度</p>
            <div className="flex flex-wrap gap-2">
              {classicDifficulties.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setDifficulty(item);
                    setSelectedId(classicRecords[0].id);
                  }}
                  className={`rounded-[8px] border px-3 py-2 text-sm ${filterButtonClass(difficulty === item)}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-[8px] border border-[#33291f] bg-[#080706] p-4">
            <p className="text-xs text-[#b99758]">当前结果</p>
            <p className="mt-2 text-2xl font-semibold text-[#fff4d7]">{filteredRecords.length}</p>
            <p className="mt-1 text-xs leading-5 text-[#8d7a61]">条典籍与笔记入口</p>
          </div>
        </aside>

        <div className="grid gap-6">
          <section className="grid gap-4 md:grid-cols-2">
            {filteredRecords.length ? (
              filteredRecords.map((record) => (
                <button
                  key={record.id}
                  type="button"
                  onClick={() => setSelectedId(record.id)}
                  className={`rounded-[8px] border p-5 text-left transition ${
                    selectedRecord.id === record.id
                      ? "border-[#d8b642] bg-[#1d160f]"
                      : "border-[#31281f] bg-[#100c09] hover:border-[#806739]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-[#b99758]">{record.category}</p>
                      <h2 className="mt-2 text-2xl font-semibold text-[#fff4d7]">{record.title}</h2>
                    </div>
                    <span className="rounded-full border border-[#463722] px-3 py-1 text-xs text-[#cab89b]">{record.status}</span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[#a99575]">{record.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {record.keywords.map((keyword) => (
                      <span key={keyword} className="rounded-full bg-[#21190f] px-3 py-1 text-xs text-[#d8c8aa]">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </button>
              ))
            ) : (
              <div className="rounded-[8px] border border-[#463722] bg-[#100c09] p-8 md:col-span-2">
                <p className="text-xl font-semibold text-[#fff4d7]">暂时没有匹配结果</p>
                <p className="mt-3 text-sm leading-7 text-[#a99575]">换一个关键词，或先把分类/难度切回全部。</p>
              </div>
            )}
          </section>

          <section className="grid gap-6 rounded-[8px] border border-[#463722] bg-[#120e0a] p-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="flex items-center gap-3">
                <BookOpenText className="text-[#d8b642]" size={26} />
                <div>
                  <p className="text-sm text-[#b99758]">当前阅读</p>
                  <h2 className="text-3xl font-semibold text-[#fff4d7]">{selectedRecord.title}</h2>
                </div>
              </div>
              <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-[8px] bg-[#080706] p-4">
                  <dt className="text-[#786954]">时期</dt>
                  <dd className="mt-1 text-[#f4deb0]">{selectedRecord.dynasty}</dd>
                </div>
                <div className="rounded-[8px] bg-[#080706] p-4">
                  <dt className="text-[#786954]">难度</dt>
                  <dd className="mt-1 text-[#f4deb0]">{selectedRecord.difficulty}</dd>
                </div>
                <div className="col-span-2 rounded-[8px] bg-[#080706] p-4">
                  <dt className="text-[#786954]">核心</dt>
                  <dd className="mt-1 text-[#f4deb0]">{selectedRecord.focus}</dd>
                </div>
              </dl>
              <div className="mt-5 rounded-[8px] border border-[#33291f] bg-[#080706] p-5">
                <p className="text-sm leading-8 text-[#d8c8aa]">{selectedRecord.excerpt}</p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[8px] border border-[#33291f] bg-[#080706] p-5">
                <p className="text-xs text-[#b99758]">下一步接入</p>
                <p className="mt-2 text-sm leading-7 text-[#a99575]">{selectedRecord.nextStep}</p>
                <Link
                  className="mt-4 inline-flex rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm font-semibold text-[#e8c86e] hover:border-[#d8b642]"
                  href={`/classics/${selectedRecord.id}`}
                >
                  打开单本书页
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {readingModes.map((mode) => (
                  <div key={mode.title} className="rounded-[8px] border border-[#33291f] bg-[#080706] p-4">
                    <FileText className="text-[#d8b642]" size={18} />
                    <strong className="mt-3 block text-[#fff4d7]">{mode.title}</strong>
                    <p className="mt-2 text-xs leading-6 text-[#a99575]">{mode.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="import" className="grid gap-6 rounded-[8px] border border-[#3a3026] bg-[#100c09] p-6 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <p className="text-sm font-semibold text-[#d8b642]">接入模板</p>
              <h2 className="mt-2 text-3xl font-semibold text-[#fff4d7]">后续加古籍，就按这些字段进库</h2>
              <p className="mt-4 text-sm leading-7 text-[#a99575]">
                先把结构定住，后面不管你给古籍 PDF、讲义 Word，还是自己的笔记，都能统一转成可搜索、可阅读、可引用的内容。
              </p>
              <Link className="mt-5 inline-flex rounded-[8px] bg-[#d8b642] px-4 py-2 text-sm font-semibold text-[#120e09]" href="/classics/import">
                进入录入助手
              </Link>
              <Link className="mt-3 inline-flex rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm font-semibold text-[#e8c86e]" href="/intake">
                查看入藏队列
              </Link>
              <Link className="mt-3 inline-flex rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm font-semibold text-[#e8c86e]" href="/library">
                打开本机典藏
              </Link>
              <div className="mt-5 grid gap-3">
                {sourcePipelines.map((pipeline) => (
                  <div key={pipeline.title} className="rounded-[8px] border border-[#33291f] bg-[#080706] p-4">
                    <div className="flex items-center gap-2 text-[#fff4d7]">
                      <Layers3 size={17} className="text-[#d8b642]" />
                      <strong>{pipeline.title}</strong>
                    </div>
                    <p className="mt-2 text-xs leading-6 text-[#a99575]">{pipeline.text}</p>
                    <p className="mt-3 text-xs text-[#b99758]">{pipeline.items.join(" / ")}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {ingestionFields.map(([key, label, hint]) => (
                <div key={key} className="rounded-[8px] border border-[#33291f] bg-[#080706] p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-[#8aa076]" size={17} />
                    <strong className="text-[#fff4d7]">{label}</strong>
                  </div>
                  <code className="mt-3 block text-xs text-[#d8b642]">{key}</code>
                  <p className="mt-2 text-xs leading-6 text-[#a99575]">{hint}</p>
                </div>
              ))}
            </div>
          </section>

          {relatedRecords.length ? (
            <section className="rounded-[8px] border border-[#3a3026] bg-[#100c09] p-6">
              <div className="mb-4 flex items-center gap-2">
                <Boxes className="text-[#d8b642]" size={20} />
                <h2 className="text-xl font-semibold text-[#fff4d7]">同类可继续整理</h2>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {relatedRecords.map((record) => (
                  <button
                    type="button"
                    key={record.id}
                    onClick={() => setSelectedId(record.id)}
                    className="rounded-[8px] border border-[#33291f] bg-[#080706] p-4 text-left hover:border-[#d8b642]"
                  >
                    <p className="text-sm font-semibold text-[#fff4d7]">{record.title}</p>
                    <p className="mt-2 text-xs leading-6 text-[#a99575]">{record.focus}</p>
                  </button>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </main>
  );
}
