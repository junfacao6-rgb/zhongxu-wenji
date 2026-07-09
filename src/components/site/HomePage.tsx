import { ChevronRight, CircleCheck, Search, Sparkles, Stamp, UploadCloud } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";

const categoryEntries = [
  {
    title: "八字古籍",
    subtitle: "命理源流",
    description: "子平术数精要",
    href: "/subjects/bazi",
    image: "/images/wengu/categories/bazi.webp",
  },
  {
    title: "奇门古籍",
    subtitle: "奇门遁甲",
    description: "时空演算秘典",
    href: "/subjects/qimen",
    image: "/images/wengu/categories/qimen.webp",
  },
  {
    title: "六爻古籍",
    subtitle: "六爻占卜",
    description: "断事明理之术",
    href: "/subjects/liuyao",
    image: "/images/wengu/categories/liuyao.webp",
  },
  {
    title: "梅花易数",
    subtitle: "梅花易数",
    description: "心易占断之学",
    href: "/subjects/meihua",
    image: "/images/wengu/categories/meihua.webp",
  },
  {
    title: "道家经典",
    subtitle: "道法自然",
    description: "修真养性之要",
    href: "/subjects/dao",
    image: "/images/wengu/categories/daoist.webp",
  },
  {
    title: "其他典籍",
    subtitle: "更多典籍",
    description: "持续整理中",
    href: "/library",
    image: "/images/wengu/categories/other.webp",
  },
];

const featuredBooks = [
  {
    title: "子平真诠",
    description: "命理学经典之作，论述格局、用神、旺衰之理。",
    author: "清 · 沈孝瞻",
    reads: "28.7万",
    href: "/library/ziping-zhenquan",
    image: "/images/wengu/books/ziping-zhenquan.webp",
  },
  {
    title: "滴天髓",
    description: "命理精要，言简意赅，发人深省。",
    author: "宋 · 京图撰",
    reads: "35.2万",
    href: "/library/ditiansui-chanwei",
    image: "/images/wengu/books/ditiansui.webp",
  },
  {
    title: "穷通宝鉴",
    description: "详述五行生克制化与调候用神之法。",
    author: "清 · 余春台",
    reads: "22.4万",
    href: "/library/ditiansui-chanwei",
    image: "/images/wengu/books/qiongtong-baojian.webp",
  },
  {
    title: "三命通会",
    description: "命理集大成之作，内容博赡，体系完备。",
    author: "明 · 万民英",
    reads: "41.6万",
    href: "/library/sanming-tonghui",
    image: "/images/wengu/books/sanming-tonghui.webp",
  },
];

const recentBooks = [
  {
    title: "渊海子平",
    note: "上次阅读到：卷三 · 论十干生旺",
    progress: 32,
    href: "/library/yuanhai-ziping",
    image: "/images/wengu/books/ziping-zhenquan.webp",
  },
  {
    title: "神峰通考",
    note: "上次阅读到：卷一 · 五行生克",
    progress: 18,
    href: "/library/sanming-tonghui",
    image: "/images/wengu/books/qiongtong-baojian.webp",
  },
  {
    title: "梅花易数",
    note: "上次阅读到：卷二 · 占断总诀",
    progress: 45,
    href: "/library/meihua-yishu",
    image: "/images/wengu/books/sanming-tonghui.webp",
  },
];

const featureRibbon = [
  { title: "古籍底本校勘", text: "严谨校勘，力求准确", icon: Stamp },
  { title: "原文影像呈现", text: "原书影像，沉浸阅读", icon: CircleCheck },
  { title: "智能检索", text: "全文检索，便捷直达", icon: Search },
  { title: "持续更新", text: "不断扩充，常读常新", icon: UploadCloud },
];

export default function HomePage() {
  return (
    <div className="platform-home-page museum-replica-home">
      <section className="museum-replica-scroll" aria-label="问古书斋画卷">
        <img src="/images/hero-scroll-reference-crop-20260705.webp" alt="" />
      </section>

      <main className="museum-replica-main">
        <section className="museum-replica-intro-row" aria-label="书斋入口">
          <div className="museum-replica-intro">
            <h1>一处安静读古籍的地方</h1>
            <p>问古书斋是一个专注于中国传统古籍的在线阅读平台，致力于整理、呈现与传承经典文化典籍，让古籍之美在数字时代延续。</p>
            <Link href="/library">
              <span>了解问古书斋</span>
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          <nav className="museum-replica-categories" aria-label="古籍分类">
            {categoryEntries.map((item) => (
              <Link href={item.href} className="museum-replica-category" key={item.title}>
                <img src={item.image} alt="" />
                <strong>{item.title}</strong>
                <span>{item.subtitle}</span>
                <small>{item.description}</small>
              </Link>
            ))}
          </nav>
        </section>

        <section className="museum-replica-library" aria-label="精选推荐与最近阅读">
          <div className="museum-replica-books">
            <div className="museum-replica-section-head">
              <div>
                <span>精选推荐</span>
                <h2>精选推荐</h2>
              </div>
              <Link href="/library">
                查看全部
                <ChevronRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>

            <div className="museum-replica-book-list">
              {featuredBooks.map((book) => (
                <article className="museum-replica-book" key={book.title}>
                  <Link href={book.href} className="museum-replica-book-cover">
                    <img src={book.image} alt={`《${book.title}》封面`} />
                  </Link>
                  <div className="museum-replica-book-copy">
                    <h3>《{book.title}》</h3>
                    <p>{book.description}</p>
                    <span>{book.author}</span>
                    <small>{book.reads}</small>
                    <Link href={book.href}>开始阅读</Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="museum-replica-recent" aria-label="最近阅读">
            <div className="museum-replica-section-head">
              <div>
                <span>最近阅读</span>
                <h2>最近阅读</h2>
              </div>
              <Link href="/me/books">
                查看全部
                <ChevronRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>

            <div className="museum-replica-recent-list">
              {recentBooks.map((book) => (
                <Link href={book.href} className="museum-replica-recent-item" key={book.title}>
                  <img src={book.image} alt="" />
                  <div>
                    <strong>{book.title}</strong>
                    <span>{book.note}</span>
                    <small>阅读进度 {book.progress}%</small>
                    <i style={{ "--progress": `${book.progress}%` } as CSSProperties} />
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </section>

        <section className="museum-replica-ribbon" aria-label="平台能力">
          <img className="museum-replica-plum" src="/images/wengu/decor/plum-branch.webp" alt="" />
          {featureRibbon.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title}>
                <Icon aria-hidden="true" className="h-5 w-5" />
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </div>
              </article>
            );
          })}
          <p>“书犹药也，善读之可以医愚。”</p>
          <img className="museum-replica-seal" src="/images/wengu/decor/bottom-seal.webp" alt="" />
        </section>

        <section className="museum-replica-compliance" aria-label="合规说明">
          <Sparkles aria-hidden="true" className="h-4 w-4" />
          <p>本平台内容用于传统文化学习、资料整理与行动参考，不替代医学、法律、投资、心理等专业意见。</p>
        </section>
      </main>
    </div>
  );
}
