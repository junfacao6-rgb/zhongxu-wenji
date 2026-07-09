import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Clock3,
  Compass,
  Library,
  Map,
  PenLine,
  Star,
} from "lucide-react";

const moduleCards = [
  {
    title: "术数知识地图",
    description: "构建完整知识关系，从基础到进阶的系统导航。",
    href: "/knowledge-map",
    icon: Compass,
  },
  {
    title: "五行图解",
    description: "五行生克制化详解，图文并茂，深入浅出。",
    href: "/diagrams/wuxing",
    icon: Map,
  },
  {
    title: "十神速查",
    description: "十神关系与象义速查，命理分析的得力助手。",
    href: "/tools",
    icon: Star,
  },
  {
    title: "古籍书架",
    description: "精选术数古籍典藏，随时查阅，传承经典。",
    href: "/library",
    icon: Library,
  },
  {
    title: "工具集成",
    description: "排盘、查询、起局等实用工具一站直达。",
    href: "/tools",
    icon: Compass,
  },
];

const readingList = [
  ["渊海子平", "系统阐述格局、用神、喜忌之理。", "八字命理"],
  ["三命通会", "集合命理大成之作，内容广博，论断精详。", "进阶必读"],
  ["滴天髓阐微", "阐发命理精要，理法兼备。", "任铁樵"],
];

const recentItems = [
  ["子平真诠 · 格局论", "研读至：论正格 · 第一节", "32%"],
  ["穷通宝鉴 · 调候用神", "研读至：夏月癸水 · 第二节", "47%"],
  ["滴天髓阐微 · 用神篇", "研读至：用神取用 · 第三节", "28%"],
  ["六爻占验全书 · 封例", "研读至：占财运 · 案例三", "61%"],
];

const quickLinks: Array<[string, LucideIcon, string]> = [
  ["我的书架", Library, "/library"],
  ["研读笔记", PenLine, "/articles"],
  ["收藏与标注", Star, "/knowledge-map"],
  ["历史记录", Clock3, "/learn"],
];

export default function MysticLabPage() {
  return (
    <section className="mystic-lab">
      <div className="mystic-shell">
        <div className="mystic-hero">
          <div className="mystic-hero-copy">
            <p className="mystic-kicker">月白墨金 · 观象天幕</p>
            <h1>观象天幕</h1>
            <div className="mystic-verse">
              <span />
              <p>观天之道，执天之行</p>
              <span />
            </div>
            <p className="mystic-description">
              汇集术数典籍、图解体系与实用工具于一体，以古为据，以今证道，助你系统研习，洞明玄机。
            </p>
            <div className="mystic-hero-actions">
              <Link href="/knowledge-map">探索知识</Link>
              <Link href="/library">进入书架</Link>
            </div>
          </div>
          <div className="mystic-visual">
            <img src="/mystic/moon-gold-observatory.png" alt="月白墨金观象台与浑仪" />
          </div>
        </div>

        <div className="mystic-module-row">
          {moduleCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.title} href={card.href} className="mystic-module-card">
                <Icon className="h-9 w-9" />
                <span>
                  <strong>{card.title}</strong>
                  <small>{card.description}</small>
                </span>
                <ArrowRight className="h-4 w-4 mystic-card-arrow" />
              </Link>
            );
          })}
        </div>

        <div className="mystic-content-grid">
          <section className="mystic-panel">
            <div className="mystic-panel-head">
              <h2>推荐研读</h2>
              <Link href="/library">查看全部</Link>
            </div>
            <div className="mystic-reading-list">
              {readingList.map(([title, desc, tag], index) => (
                <Link key={title} href="/library" className="mystic-reading-item">
                  <span className="mystic-book-cover">{index + 1}</span>
                  <span>
                    <strong>{title}</strong>
                    <small>{desc}</small>
                  </span>
                  <em>{tag}</em>
                </Link>
              ))}
            </div>
          </section>

          <section className="mystic-panel">
            <div className="mystic-panel-head">
              <h2>最近研读</h2>
              <Link href="/learn">查看全部</Link>
            </div>
            <div className="mystic-progress-list">
              {recentItems.map(([title, desc, progress]) => (
                <Link key={title} href="/learn" className="mystic-progress-item">
                  <span>
                    <strong>{title}</strong>
                    <small>{desc}</small>
                  </span>
                  <span className="mystic-progress-bar" aria-hidden="true">
                    <i style={{ width: progress }} />
                  </span>
                  <em>{progress}</em>
                </Link>
              ))}
            </div>
          </section>

          <aside className="mystic-side-stack">
            <section className="mystic-panel">
              <h2>快捷入口</h2>
              <div className="mystic-quick-grid">
                {quickLinks.map(([label, Icon, href]) => (
                  <Link key={label as string} href={href as string}>
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="mystic-panel">
              <h2>研习统计</h2>
              <div className="mystic-stats">
                {[
                  ["128", "累计研读"],
                  ["23", "研读书籍"],
                  ["356", "笔记记录"],
                  ["89", "收藏内容"],
                ].map(([value, label]) => (
                  <span key={label}>
                    <strong>{value}</strong>
                    <small>{label}</small>
                  </span>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <div className="mystic-bottom-bar">
          <span>格物致知</span>
          <span>学以致用</span>
          <span>守正出新</span>
        </div>
      </div>
    </section>
  );
}
