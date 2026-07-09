import Link from "next/link";
import {
  ArrowLeft,
  BookOpenText,
  Boxes,
  CalendarDays,
  FileText,
  LibraryBig,
  ListTree,
  NotebookTabs,
  Search,
} from "lucide-react";
import ClassicReadingPanel from "@/components/ClassicReadingPanel";
import { classicRecords, getChaptersForClassic, type ClassicRecord } from "@/lib/culture-content";

export default function ClassicDetailPage({ record }: { record: ClassicRecord }) {
  const chapters = getChaptersForClassic(record.id);
  const relatedRecords = classicRecords.filter((item) => item.id !== record.id && item.category === record.category).slice(0, 3);

  return (
    <main className="min-h-screen bg-[#080706] text-[#f4ead4]">
      <header className="border-b border-[#2c231a] bg-[#080706]">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-3 px-5 py-4">
          <Link className="inline-flex items-center gap-2 text-sm text-[#c8b692] hover:text-[#e8c86e]" href="/classics">
            <ArrowLeft size={17} />
            返回典籍库
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
              补入原文
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-[#241c15]">
        <img src="/images/dao-library-hero.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#080706_0%,rgba(8,7,6,0.9)_56%,rgba(8,7,6,0.68)_100%)]" />
        <div className="relative mx-auto grid max-w-[1180px] gap-8 px-5 py-14 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-[#d8b642]">{record.category}</p>
            <h1 className="mt-4 text-5xl font-semibold leading-tight text-[#fff4d7] md:text-7xl">{record.title}</h1>
            <p className="mt-5 max-w-[42rem] text-base leading-8 text-[#cbb894]">{record.summary}</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {record.keywords.map((keyword) => (
                <Link key={keyword} href={`/glossary?term=${encodeURIComponent(keyword)}`} className="rounded-full bg-[#21190f] px-3 py-1 text-xs text-[#d8c8aa] hover:text-[#e8c86e]">
                  {keyword}
                </Link>
              ))}
            </div>
          </div>
          <aside className="rounded-[8px] border border-[#463722] bg-[#100c09]/88 p-5">
            <div className="flex items-center gap-3">
              <BookOpenText className="text-[#d8b642]" size={24} />
              <div>
                <p className="text-sm text-[#b99758]">阅读状态</p>
                <h2 className="text-xl font-semibold text-[#fff4d7]">{record.status}</h2>
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-[8px] bg-[#080706] p-3">
                <dt className="text-[#786954]">时期</dt>
                <dd className="mt-1 text-[#f4deb0]">{record.dynasty}</dd>
              </div>
              <div className="rounded-[8px] bg-[#080706] p-3">
                <dt className="text-[#786954]">难度</dt>
                <dd className="mt-1 text-[#f4deb0]">{record.difficulty}</dd>
              </div>
            </dl>
            <p className="mt-4 text-sm leading-7 text-[#a99575]">{record.focus}</p>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1180px] gap-6 px-5 py-10 lg:grid-cols-[300px_1fr]">
        <aside className="self-start rounded-[8px] border border-[#3a3026] bg-[#100c09] p-5 lg:sticky lg:top-4">
          <div className="flex items-center gap-2 text-[#d8b642]">
            <ListTree size={18} />
            <p className="text-sm font-semibold">章节目录</p>
          </div>
          <div className="mt-4 grid gap-3">
            {chapters.map((chapter) => (
              <a key={chapter.order} className="rounded-[8px] border border-[#33291f] bg-[#080706] p-4 hover:border-[#d8b642]" href={`#chapter-${chapter.order}`}>
                <span className="text-xs text-[#b99758]">{chapter.order}</span>
                <strong className="mt-1 block text-[#fff4d7]">{chapter.title}</strong>
                <span className="mt-1 block text-xs leading-5 text-[#8d7a61]">{chapter.theme}</span>
              </a>
            ))}
          </div>
          <div className="mt-5 rounded-[8px] border border-[#33291f] bg-[#080706] p-4">
            <div className="flex items-center gap-2 text-[#f4deb0]">
              <Search size={16} className="text-[#d8b642]" />
              <strong className="text-sm">后续可检索</strong>
            </div>
            <p className="mt-2 text-xs leading-6 text-[#a99575]">章节、关键词、原文、白话、注解和案例会统一进入典籍库。</p>
          </div>
        </aside>

        <div className="grid gap-6">
          <section className="rounded-[8px] border border-[#463722] bg-[#120e0a] p-6">
            <div className="flex items-center gap-3">
              <NotebookTabs className="text-[#d8b642]" size={24} />
              <div>
                <p className="text-sm text-[#b99758]">阅读说明</p>
                <h2 className="text-2xl font-semibold text-[#fff4d7]">先看结构，再补原文</h2>
              </div>
            </div>
            <p className="mt-4 text-sm leading-8 text-[#a99575]">{record.excerpt}</p>
            <div className="mt-5 rounded-[8px] border border-[#33291f] bg-[#080706] p-5">
              <p className="text-xs text-[#b99758]">下一步接入</p>
              <p className="mt-2 text-sm leading-7 text-[#d8c8aa]">{record.nextStep}</p>
              <Link className="mt-4 inline-flex rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm text-[#e8c86e]" href="/classics/import">
                用录入助手整理这一书
              </Link>
              <Link className="ml-3 mt-4 inline-flex rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm text-[#e8c86e]" href="/intake">
                查看入藏队列
              </Link>
            </div>
          </section>

          <ClassicReadingPanel record={record} chapters={chapters} />

          {chapters.map((chapter) => (
            <article key={chapter.order} id={`chapter-${chapter.order}`} className="scroll-mt-8 rounded-[8px] border border-[#3a3026] bg-[#100c09] p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#d8b642]">第 {chapter.order} 节 · {chapter.theme}</p>
                  <h2 className="mt-2 text-3xl font-semibold text-[#fff4d7]">{chapter.title}</h2>
                </div>
                <span className="rounded-full border border-[#463722] px-3 py-1 text-xs text-[#cab89b]">{chapter.status}</span>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <section className="rounded-[8px] border border-[#33291f] bg-[#080706] p-5">
                  <div className="mb-3 flex items-center gap-2 text-[#d8b642]">
                    <FileText size={18} />
                    <strong>原文</strong>
                  </div>
                  <p className="text-lg leading-9 text-[#fff4d7]">{chapter.original}</p>
                </section>
                <section className="rounded-[8px] border border-[#33291f] bg-[#080706] p-5">
                  <div className="mb-3 flex items-center gap-2 text-[#d8b642]">
                    <BookOpenText size={18} />
                    <strong>白话</strong>
                  </div>
                  <p className="text-sm leading-8 text-[#d8c8aa]">{chapter.translation}</p>
                </section>
              </div>

              <section className="mt-4 rounded-[8px] border border-[#33291f] bg-[#080706] p-5">
                <p className="text-sm font-semibold text-[#d8b642]">注解与补录方向</p>
                <ul className="mt-3 grid gap-2 text-sm leading-7 text-[#a99575]">
                  {chapter.notes.map((note) => (
                    <li key={note}>· {note}</li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  {chapter.keywords.map((keyword) => (
                    <Link key={keyword} href={`/glossary?term=${encodeURIComponent(keyword)}`} className="rounded-full bg-[#21190f] px-3 py-1 text-xs text-[#d8c8aa] hover:text-[#e8c86e]">
                      {keyword}
                    </Link>
                  ))}
                </div>
              </section>
            </article>
          ))}

          {relatedRecords.length ? (
            <section className="rounded-[8px] border border-[#3a3026] bg-[#100c09] p-6">
              <div className="mb-4 flex items-center gap-2">
                <Boxes className="text-[#d8b642]" size={20} />
                <h2 className="text-xl font-semibold text-[#fff4d7]">同类典籍</h2>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {relatedRecords.map((item) => (
                  <Link key={item.id} className="rounded-[8px] border border-[#33291f] bg-[#080706] p-4 hover:border-[#d8b642]" href={`/classics/${item.id}`}>
                    <LibraryBig className="text-[#d8b642]" size={18} />
                    <strong className="mt-3 block text-[#fff4d7]">{item.title}</strong>
                    <span className="mt-2 block text-xs leading-6 text-[#a99575]">{item.focus}</span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <section className="rounded-[8px] border border-[#463722] bg-[#120e0a] p-6">
            <div className="flex items-center gap-3">
              <CalendarDays className="text-[#d8b642]" size={22} />
              <div>
                <p className="text-sm text-[#b99758]">从经典回到日用</p>
                <h2 className="text-2xl font-semibold text-[#fff4d7]">读完一章，再看今日节奏</h2>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-[#a99575]">典籍页负责立意，工具页负责落地。后续可以把章节注解关联到日课、六爻和案例复盘。</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link className="rounded-[8px] bg-[#d8b642] px-4 py-2 text-sm font-semibold text-[#120e09]" href="/daily">
                查看日课
              </Link>
              <Link className="rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm text-[#e8c86e]" href="/liuyao">
                六爻问事
              </Link>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
