import { ArrowRight, BookOpenText, Compass, ScrollText, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

const featureCards = [
  {
    title: "阅读古籍",
    eyebrow: "古籍书架",
    description: "把公开古籍放进一个干净的阅读入口，先让用户能找书、看书、继续读。",
    href: "/library",
    action: "进入书架",
    image: "/images/wengu/books/ziping-zhenquan.webp",
    icon: BookOpenText,
    tone: "library",
  },
  {
    title: "奇门模块",
    eyebrow: "奇门问时",
    description: "保留今日气机、排盘、择时和报告预览，作为第一个术数工具主线。",
    href: "/qimen",
    action: "进入奇门",
    image: "/images/wengu/categories/qimen.webp",
    icon: Compass,
    tone: "qimen",
  },
  {
    title: "大六壬金口诀",
    eyebrow: "金口诀",
    description: "新增金口诀 mock 入口，先展示起课结构、课象摘要和参考边界。",
    href: "/jinkoujue",
    action: "查看金口诀",
    image: "/images/wengu/categories/liuyao.webp",
    icon: Sparkles,
    tone: "jinkou",
  },
];

const readingBooks = [
  { title: "子平真诠", href: "/book/ziping-zhenquan", image: "/images/wengu/books/ziping-zhenquan.webp" },
  { title: "滴天髓", href: "/book/ditiansui-chanwei", image: "/images/wengu/books/ditiansui.webp" },
  { title: "三命通会", href: "/book/sanming-tonghui", image: "/images/wengu/books/sanming-tonghui.webp" },
];

export default function HomePage() {
  return (
    <div className="trinity-home">
      <section className="trinity-hero" aria-label="问古书斋三功能首页">
        <div className="trinity-hero-art" aria-hidden="true">
          <img src="/images/hero-scroll-reference-crop-20260705.webp" alt="" />
        </div>

        <div className="trinity-hero-content">
          <p className="trinity-kicker">问古书斋</p>
          <h1>只保留三件真正要给用户看的事</h1>
          <p>
            阅读古籍、奇门模块、大六壬金口诀。前台先收敛，视觉先精致，后续功能都放到后台慢慢补。
          </p>
          <div className="trinity-hero-actions">
            <Link href="/library">
              <BookOpenText aria-hidden="true" />
              阅读古籍
            </Link>
            <Link href="/qimen" className="is-secondary">
              <Compass aria-hidden="true" />
              奇门模块
            </Link>
            <Link href="/jinkoujue" className="is-secondary">
              <Sparkles aria-hidden="true" />
              金口诀
            </Link>
          </div>
        </div>
      </section>

      <main className="trinity-main">
        <section className="trinity-feature-grid" aria-label="三大功能">
          {featureCards.map((item) => {
            const Icon = item.icon;
            return (
              <Link href={item.href} className={`trinity-feature-card is-${item.tone}`} key={item.title}>
                <div className="trinity-feature-image">
                  <img src={item.image} alt="" />
                </div>
                <div className="trinity-feature-copy">
                  <span>{item.eyebrow}</span>
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                  <strong>
                    <Icon aria-hidden="true" />
                    {item.action}
                    <ArrowRight aria-hidden="true" />
                  </strong>
                </div>
              </Link>
            );
          })}
        </section>

        <section className="trinity-reading-strip" aria-label="古籍阅读预览">
          <div>
            <span>
              <ScrollText aria-hidden="true" />
              公开古籍
            </span>
            <h2>先把可读的书放在前面</h2>
          </div>
          <div className="trinity-book-row">
            {readingBooks.map((book) => (
              <Link href={book.href} key={book.title}>
                <img src={book.image} alt="" />
                <strong>{book.title}</strong>
              </Link>
            ))}
          </div>
        </section>

        <section className="trinity-boundary" aria-label="边界说明">
          <ShieldCheck aria-hidden="true" />
          <p>奇门与金口诀当前为 mock 演示，用于传统文化学习和行动参考，不作医疗、法律、投资等现实专业决策依据。</p>
        </section>
      </main>
    </div>
  );
}
