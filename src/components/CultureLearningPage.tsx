"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookMarked,
  BookOpenText,
  CalendarDays,
  ChevronRight,
  Compass,
  LibraryBig,
  Moon,
  Search,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import { classicCategories, classicRecords, portalStats, studyRituals, type ClassicCategory } from "@/lib/culture-content";

const navItems = [
  ["典籍库", "/classics"],
  ["典藏", "/library"],
  ["书斋", "/study"],
  ["检索", "/search"],
  ["术语", "/glossary"],
  ["入藏", "/intake"],
  ["修习", "#rituals"],
  ["路径", "/paths"],
  ["问机", "#tools"],
];

const toolLinks = [
  {
    title: "今日日课",
    text: "看今天适合动、守、谈、写或避开的方向。",
    href: "/daily",
    icon: CalendarDays,
  },
  {
    title: "六爻问事",
    text: "把一个模糊问题收束成当下可执行的选择。",
    href: "/liuyao",
    icon: Sparkles,
  },
  {
    title: "事件择机",
    text: "为提交、发布、沟通、见面选择更合适的节奏。",
    href: "/events",
    icon: Compass,
  },
];

const pathSteps = [
  ["一", "立根", "先读道家经典，建立静、守、观、应的底层语言。"],
  ["二", "明象", "再学阴阳五行、干支、卦象，把符号放进关系里看。"],
  ["三", "入术", "进入八字、六爻、奇门等方法，训练判断路径。"],
  ["四", "验事", "用日课、问事和案例复盘，让古籍回到当下生活。"],
];

function getCategoryClass(active: boolean) {
  return active
    ? "border-[#d8b642] bg-[#d8b642] text-[#130f0a]"
    : "border-[#3c3328] bg-[#17120e] text-[#cab89b] hover:border-[#8a6f38] hover:text-[#f4deb0]";
}

export default function CultureLearningPage() {
  const [category, setCategory] = useState<ClassicCategory>("全部");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(classicRecords[0].id);

  const filteredRecords = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return classicRecords.filter((record) => {
      const categoryMatch = category === "全部" || record.category === category;
      const queryMatch =
        !normalized ||
        [record.title, record.focus, record.summary, record.dynasty, ...record.keywords].some((value) =>
          value.toLowerCase().includes(normalized),
        );
      return categoryMatch && queryMatch;
    });
  }, [category, query]);

  const selectedRecord = useMemo(() => {
    return filteredRecords.find((record) => record.id === selectedId) ?? filteredRecords[0] ?? classicRecords[0];
  }, [filteredRecords, selectedId]);

  return (
    <main className="min-h-screen bg-[#080706] text-[#f4ead4]">
      <header className="sticky top-0 z-40 border-b border-[#3b2f20] bg-[#080706]/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-5 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-[8px] border border-[#9e7f38] bg-[#15100c] text-sm font-semibold text-[#e8c86e]">
              中
            </span>
            <span>
              <span className="block text-base font-semibold text-[#f4ead4]">观复书阁</span>
              <span className="block text-xs text-[#9d8a70]">道家传统文化研习</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-[#b5a284] md:flex">
            {navItems.map(([label, href]) => (
              href.startsWith("/") ? (
                <Link key={label} className="hover:text-[#e8c86e]" href={href}>
                  {label}
                </Link>
              ) : (
                <a key={label} className="hover:text-[#e8c86e]" href={href}>
                  {label}
                </a>
              )
            ))}
          </nav>
          <Link
            className="inline-flex items-center gap-2 rounded-[8px] bg-[#a63f31] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(166,63,49,0.28)]"
            href="/birth"
          >
            入门起课
            <ChevronRight size={16} />
          </Link>
        </div>
      </header>

      <section className="relative min-h-[760px] overflow-hidden">
        <img
          src="/images/dao-library-hero.png"
          alt="夜色中的道家藏经阁、香炉、古籍与罗盘"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,7,6,0.95)_0%,rgba(8,7,6,0.78)_38%,rgba(8,7,6,0.22)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,7,6,0.3)_0%,rgba(8,7,6,0.48)_62%,#080706_100%)]" />

        <div className="relative mx-auto grid min-h-[760px] max-w-[1180px] items-center gap-10 px-5 py-16 lg:grid-cols-[0.92fr_0.74fr]">
          <div className="max-w-[680px]">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#7b6233] bg-[#15100c]/82 px-4 py-2 text-sm text-[#e8c86e]">
              <Moon size={16} />
              以道为根，以术为用
            </p>
            <h1 className="text-5xl font-semibold leading-tight text-[#fff4d7] md:text-7xl">观复书阁</h1>
            <p className="mt-6 max-w-[38rem] text-lg leading-9 text-[#d8c8aa]">
              一座面向传统文化学习、古籍整理、日课问事和术数复盘的研习门户。先静心读经典，再把判断落回每天的选择。
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link className="rounded-[8px] bg-[#d8b642] px-5 py-3 text-sm font-semibold text-[#120e09]" href="/classics">
                进入典籍库
              </Link>
              <Link className="rounded-[8px] border border-[#7e6637] bg-[#15100c]/76 px-5 py-3 text-sm font-semibold text-[#f4deb0]" href="/daily">
                查看今日日课
              </Link>
              <Link className="rounded-[8px] border border-[#7e6637] bg-[#15100c]/76 px-5 py-3 text-sm font-semibold text-[#f4deb0]" href="/study">
                打开我的书斋
              </Link>
              <Link className="rounded-[8px] border border-[#7e6637] bg-[#15100c]/76 px-5 py-3 text-sm font-semibold text-[#f4deb0]" href="/paths">
                研读路径
              </Link>
              <Link className="rounded-[8px] border border-[#7e6637] bg-[#15100c]/76 px-5 py-3 text-sm font-semibold text-[#f4deb0]" href="/glossary">
                术语玄览
              </Link>
              <Link className="rounded-[8px] border border-[#7e6637] bg-[#15100c]/76 px-5 py-3 text-sm font-semibold text-[#f4deb0]" href="/intake">
                入藏队列
              </Link>
              <Link className="rounded-[8px] border border-[#7e6637] bg-[#15100c]/76 px-5 py-3 text-sm font-semibold text-[#f4deb0]" href="/library">
                本机典藏
              </Link>
              <Link className="rounded-[8px] border border-[#7e6637] bg-[#15100c]/76 px-5 py-3 text-sm font-semibold text-[#f4deb0]" href="/search">
                总检索
              </Link>
            </div>
            <div className="mt-10 grid max-w-[560px] grid-cols-2 gap-3 sm:grid-cols-4">
              {portalStats.map(([value, label]) => (
                <div key={label} className="rounded-[8px] border border-[#3a3026] bg-[#100c09]/78 p-4">
                  <strong className="block text-2xl text-[#e8c86e]">{value}</strong>
                  <span className="mt-1 block text-xs text-[#a99575]">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="ml-auto max-w-[390px] border-l border-[#5f4b2d] pl-6">
              <p className="text-sm text-[#b99758]">今日修习</p>
              <h2 className="mt-3 text-3xl font-semibold text-[#fff4d7]">先收心，再问事</h2>
              <p className="mt-4 text-sm leading-7 text-[#c6b28e]">
                读一段经典，定一个边界，选一个动作。传统文化最有力量的地方，是让人从混乱里重新站稳。
              </p>
              <div className="mt-6 grid gap-3">
                {studyRituals.map((ritual) => (
                  <div key={ritual.title} className="rounded-[8px] border border-[#3a3026] bg-[#100c09]/78 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <strong className="text-[#f4ead4]">{ritual.title}</strong>
                      <span className="text-xs text-[#d8b642]">{ritual.time}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#a99575]">{ritual.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="classics" className="mx-auto max-w-[1180px] px-5 py-16">
        <div className="mb-8 grid gap-6 lg:grid-cols-[0.75fr_1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-[#d8b642]">典籍库</p>
            <h2 className="mt-2 text-4xl font-semibold text-[#fff4d7]">古籍、术数与笔记入口</h2>
            <p className="mt-4 text-sm leading-7 text-[#a99575]">
              先用结构把入口搭好。后续你把古籍、笔记或章节给我，我可以继续补原文、注解、关键词和章节索引。
            </p>
            <Link className="mt-5 inline-flex text-sm font-semibold text-[#d8b642] hover:text-[#f4deb0]" href="/classics">
              打开完整典籍库工作台
            </Link>
          </div>
          <div className="rounded-[8px] border border-[#3a3026] bg-[#100c09] p-3">
            <label className="flex items-center gap-3 rounded-[8px] border border-[#3a3026] bg-[#080706] px-4 py-3">
              <Search className="text-[#d8b642]" size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full bg-transparent text-sm text-[#f4ead4] outline-none placeholder:text-[#71604b]"
                placeholder="搜索 道德经 / 用神 / 六爻 / 调候"
              />
            </label>
            <div className="mt-3 flex flex-wrap gap-2">
              {classicCategories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setCategory(item);
                    setSelectedId(classicRecords[0].id);
                  }}
                  className={`rounded-[8px] border px-3 py-2 text-sm ${getCategoryClass(category === item)}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_410px]">
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredRecords.map((record) => (
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
                    <h3 className="mt-2 text-xl font-semibold text-[#fff4d7]">{record.title}</h3>
                  </div>
                  <span className="rounded-full border border-[#463722] px-3 py-1 text-xs text-[#cab89b]">{record.status}</span>
                </div>
                <p className="mt-4 min-h-[3.5rem] text-sm leading-7 text-[#a99575]">{record.summary}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {record.keywords.map((keyword) => (
                    <span key={keyword} className="rounded-full bg-[#21190f] px-3 py-1 text-xs text-[#d8c8aa]">
                      {keyword}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          <aside className="self-start rounded-[8px] border border-[#463722] bg-[#120e0a] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
            <div className="flex items-center gap-3">
              <BookOpenText className="text-[#d8b642]" size={24} />
              <div>
                <p className="text-sm text-[#b99758]">阅读预览</p>
                <h3 className="text-2xl font-semibold text-[#fff4d7]">{selectedRecord.title}</h3>
              </div>
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-[8px] bg-[#080706] p-3">
                <dt className="text-[#786954]">时期</dt>
                <dd className="mt-1 text-[#f4deb0]">{selectedRecord.dynasty}</dd>
              </div>
              <div className="rounded-[8px] bg-[#080706] p-3">
                <dt className="text-[#786954]">难度</dt>
                <dd className="mt-1 text-[#f4deb0]">{selectedRecord.difficulty}</dd>
              </div>
            </dl>
            <div className="mt-5 rounded-[8px] border border-[#33291f] bg-[#080706] p-5">
              <p className="text-sm leading-8 text-[#d8c8aa]">{selectedRecord.excerpt}</p>
            </div>
            <div className="mt-5 border-t border-[#33291f] pt-5">
              <p className="text-xs text-[#b99758]">下一步接入</p>
              <p className="mt-2 text-sm leading-7 text-[#a99575]">{selectedRecord.nextStep}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link className="rounded-[8px] bg-[#d8b642] px-4 py-2 text-sm font-semibold text-[#120e09]" href={`/classics/${selectedRecord.id}`}>
                  打开单本书页
                </Link>
                <Link className="rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm text-[#e8c86e]" href="/classics/import">
                  补入原文
                </Link>
                <Link className="rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm text-[#e8c86e]" href="/intake">
                  查看队列
                </Link>
                <Link className="rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm text-[#e8c86e]" href="/library">
                  本机典藏
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section id="rituals" className="border-y border-[#241c15] bg-[#0d0a08]">
        <div className="mx-auto grid max-w-[1180px] gap-8 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold text-[#d8b642]">日用修习</p>
            <h2 className="mt-2 text-4xl font-semibold text-[#fff4d7]">让学习有仪轨感</h2>
            <p className="mt-4 text-sm leading-7 text-[#a99575]">
              不是做玄学包装，而是让用户每天有清楚的入口：读、问、验、记。页面的庄重感要服务于秩序感。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {studyRituals.map((ritual, index) => (
              <article key={ritual.title} className="rounded-[8px] border border-[#3a3026] bg-[#15100c] p-5">
                <span className="text-sm text-[#d8b642]">0{index + 1}</span>
                <h3 className="mt-4 text-xl font-semibold text-[#fff4d7]">{ritual.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#a99575]">{ritual.text}</p>
                <p className="mt-5 text-xs text-[#b99758]">{ritual.time}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="path" className="mx-auto max-w-[1180px] px-5 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#d8b642]">学习路径</p>
            <h2 className="mt-2 text-4xl font-semibold text-[#fff4d7]">先立心法，再入术数</h2>
          </div>
          <div className="hidden items-center gap-4 md:flex">
            <Link className="rounded-[8px] border border-[#6e562b] px-4 py-2 text-sm font-semibold text-[#e8c86e] hover:border-[#d8b642]" href="/paths">
              打开研读路径
            </Link>
            <ShieldCheck className="text-[#8aa076]" size={30} />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {pathSteps.map(([step, title, text]) => (
            <article key={step} className="rounded-[8px] border border-[#3a3026] bg-[#100c09] p-5">
              <span className="text-3xl font-semibold text-[#a63f31]">{step}</span>
              <h3 className="mt-5 text-xl font-semibold text-[#fff4d7]">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#a99575]">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="tools" className="mx-auto max-w-[1180px] px-5 pb-20">
        <div className="grid gap-8 rounded-[8px] border border-[#463722] bg-[#120e0a] p-6 md:p-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold text-[#d8b642]">问机工具</p>
            <h2 className="mt-2 text-4xl font-semibold text-[#fff4d7]">把古籍变成可用的入口</h2>
            <p className="mt-4 text-sm leading-7 text-[#a99575]">
              首页负责建立信任和秩序，工具页负责让用户真正开始使用。后续古籍补进来后，可以继续增强解释、引用和案例复盘。
            </p>
            <div className="mt-6 rounded-[8px] border border-[#33291f] bg-[#080706] p-4">
              <div className="flex items-center gap-3">
                <Upload className="text-[#d8b642]" size={20} />
                <strong className="text-[#fff4d7]">古籍接入预留</strong>
              </div>
              <p className="mt-3 text-sm leading-7 text-[#a99575]">原文、章节、注解、关键词、案例都可以继续扩展到这套结构里。</p>
              <div className="mt-3 flex flex-wrap gap-4">
                <Link className="inline-flex text-sm font-semibold text-[#d8b642] hover:text-[#f4deb0]" href="/classics#import">
                  查看接入模板
                </Link>
                <Link className="inline-flex text-sm font-semibold text-[#d8b642] hover:text-[#f4deb0]" href="/paths">
                  打开研读路径
                </Link>
                <Link className="inline-flex text-sm font-semibold text-[#d8b642] hover:text-[#f4deb0]" href="/glossary">
                  查看术语玄览
                </Link>
                <Link className="inline-flex text-sm font-semibold text-[#d8b642] hover:text-[#f4deb0]" href="/study">
                  查看书斋进度
                </Link>
                <Link className="inline-flex text-sm font-semibold text-[#d8b642] hover:text-[#f4deb0]" href="/search">
                  打开总检索
                </Link>
                <Link className="inline-flex text-sm font-semibold text-[#d8b642] hover:text-[#f4deb0]" href="/intake">
                  查看入藏队列
                </Link>
                <Link className="inline-flex text-sm font-semibold text-[#d8b642] hover:text-[#f4deb0]" href="/library">
                  打开本机典藏
                </Link>
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {toolLinks.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.title} className="rounded-[8px] border border-[#3a3026] bg-[#080706] p-5 hover:border-[#d8b642]" href={tool.href}>
                  <Icon className="text-[#d8b642]" size={24} />
                  <strong className="mt-5 block text-lg text-[#fff4d7]">{tool.title}</strong>
                  <span className="mt-3 block text-sm leading-7 text-[#a99575]">{tool.text}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#241c15] px-5 py-10 text-center text-xs leading-6 text-[#8d7a61]">
        <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-[#d8b642]">
            <LibraryBig size={16} />
            <span className="font-semibold">观复书阁</span>
            <BookMarked size={16} />
          </div>
          <p>传统文化学习资料与日常节奏参考，不构成医疗、法律、金融投资或其他专业建议。</p>
        </div>
      </footer>
    </main>
  );
}
