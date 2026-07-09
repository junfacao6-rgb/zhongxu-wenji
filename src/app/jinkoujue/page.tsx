import type { Metadata } from "next";
import { ArrowRight, CalendarClock, CircleDot, Compass, FileText, ShieldAlert, Sparkles } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "大六壬金口诀 | 问古书斋",
  description: "大六壬金口诀 mock 模块，展示起课结构、课象摘要和参考边界。",
};

const lessonPoints = [
  "以地分、人元、贵神、将神构成课体",
  "先看五动、三动，再看用神旺衰",
  "所有判断保留证据和边界说明",
];

const lessonCards = [
  { label: "地分", value: "午", note: "以问事方位取象" },
  { label: "人元", value: "壬", note: "观发端与当下气口" },
  { label: "贵神", value: "六合", note: "看助力、牵连与协同" },
  { label: "将神", value: "胜光", note: "看事体落点和行动势" },
];

const resultRows = [
  { title: "课象摘要", text: "当前 mock 课象偏向先整合资料，再择时推进；适合做学习、归档、复盘类动作。" },
  { title: "参考建议", text: "先确认问题边界和可执行动作，不宜把金口诀结果当作现实决策的唯一依据。" },
  { title: "证据保留", text: "后续真实模块需要保存起课时间、输入问题、规则命中、分数和 evidenceRefs。" },
];

export default function JinKouJuePage() {
  return (
    <main className="jinkou-page">
      <section className="jinkou-hero" aria-label="大六壬金口诀">
        <div className="jinkou-hero-copy">
          <span>第三个前台功能</span>
          <h1>大六壬金口诀</h1>
          <p>先做一个清爽的 mock 模块：看结构、看课象、看边界，不把复杂后台和草稿内容推给用户。</p>
          <div className="jinkou-actions">
            <a href="#jinkou-mock">
              <Sparkles aria-hidden="true" />
              查看 mock 课
            </a>
            <Link href="/library">
              <FileText aria-hidden="true" />
              阅读古籍
            </Link>
          </div>
        </div>

        <aside className="jinkou-hero-card" aria-label="金口诀结构">
          <img src="/images/wengu/categories/liuyao.webp" alt="" />
          <div>
            <strong>四位成课</strong>
            <span>地分 · 人元 · 贵神 · 将神</span>
          </div>
        </aside>
      </section>

      <section id="jinkou-mock" className="jinkou-workbench" aria-label="金口诀 mock 起课">
        <div className="jinkou-input-panel">
          <span>
            <CalendarClock aria-hidden="true" />
            MOCK 起课
          </span>
          <h2>今日学习资料整理</h2>
          <p>2026-07-09 申时 · 北京时间 · 学习参考</p>
          <button type="button">
            重新生成 mock
            <ArrowRight aria-hidden="true" />
          </button>
        </div>

        <div className="jinkou-lesson-board" aria-label="四位结构">
          {lessonCards.map((item) => (
            <article key={item.label}>
              <small>{item.label}</small>
              <strong>{item.value}</strong>
              <span>{item.note}</span>
            </article>
          ))}
        </div>

        <div className="jinkou-result-list">
          {resultRows.map((row) => (
            <article key={row.title}>
              <CircleDot aria-hidden="true" />
              <div>
                <h3>{row.title}</h3>
                <p>{row.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="jinkou-notes" aria-label="学习边界">
        <div>
          <span>
            <Compass aria-hidden="true" />
            学习重点
          </span>
          <ul>
            {lessonPoints.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="jinkou-disclaimer">
          <ShieldAlert aria-hidden="true" />
          <p>本模块当前为 mock，用于传统文化学习与产品演示，不构成医疗、法律、投资、婚姻等现实专业建议。</p>
        </div>
      </section>
    </main>
  );
}
