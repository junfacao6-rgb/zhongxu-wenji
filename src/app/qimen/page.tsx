import type { Metadata } from "next";
import { CalendarClock, Compass, FileText, History, LayoutGrid, Megaphone, ScrollText, TimerReset } from "lucide-react";
import QimenLearningEntry from "@/components/qimen/QimenLearningEntry";
import QimenNineGrid from "@/components/qimen/QimenNineGrid";
import QimenToolCard from "@/components/qimen/QimenToolCard";
import { qimenContentTimingMock, qimenMockChart, qimenTimingMock, qimenTodayMock } from "@/data/qimenMock";

export const metadata: Metadata = {
  title: "奇门问时 | 问古书斋",
  description: "以九宫、八门、九星、八神与三奇六仪为基础的奇门工具区。",
};

const qimenTools = [
  {
    title: "今日气机",
    subtitle: qimenTodayMock.summary,
    href: "/qimen/today",
    icon: CalendarClock,
    meta: qimenTodayMock.date,
  },
  {
    title: "专业排盘",
    subtitle: "以九宫盘式展示门、星、神、干与宫位关系，第一阶段为 mock 入口。",
    href: "/qimen/chart",
    icon: LayoutGrid,
    meta: `${qimenMockChart.juType}${qimenMockChart.juNumber}局`,
  },
  {
    title: "一事择时",
    subtitle: qimenTimingMock.reasons[0],
    href: "/qimen/select-time",
    icon: TimerReset,
    meta: qimenTimingMock.level,
  },
  {
    title: "内容发布择时",
    subtitle: qimenContentTimingMock.reasons[0],
    href: "/qimen/content-timing",
    icon: Megaphone,
    meta: qimenContentTimingMock.level,
  },
  {
    title: "报告生成",
    subtitle: "把盘面结构、参考建议和复盘提示整理为可审核的报告草稿。",
    href: "/qimen/report/preview",
    icon: FileText,
    meta: "草稿预览",
  },
  {
    title: "排盘历史",
    subtitle: "保存问题、盘面、参考建议和后续复盘记录，便于长期校验。",
    href: "/qimen/history",
    icon: History,
    meta: "记录复盘",
  },
];

const learningEntries = [
  { title: "九宫基础", description: "宫位、方位、洛书与空间骨架。", href: "/terms/jiugong" },
  { title: "八门", description: "休生伤杜景死惊开的行动象意。", href: "/terms/bamen" },
  { title: "九星", description: "天时、状态与倾向的星系结构。", href: "/terms/jiuxing" },
  { title: "八神", description: "值符、腾蛇、太阴、六合等辅助象意。", href: "/terms/bashen" },
  { title: "三奇六仪", description: "乙丙丁与戊己庚辛壬癸的干系基础。", href: "/terms/sanqi" },
  { title: "十干克应", description: "以天干关系观察应象和条件边界。", href: "/subjects/qimen" },
];

const qimenHeroStats = [
  { label: "盘式", value: `${qimenMockChart.juType}${qimenMockChart.juNumber}局` },
  { label: "值符", value: qimenMockChart.dutyStar },
  { label: "值使", value: qimenMockChart.dutyDoor },
  { label: "用途", value: "学习参考" },
];

export default function QimenPage() {
  return (
    <main className="qimen-page qimen-gate-page">
      <section className="qimen-gate-scroll" aria-label="奇门工具画卷">
        <img src="/images/hero-scroll-reference-crop-20260705.webp" alt="" />
        <div className="qimen-gate-scroll-mark" aria-hidden="true">
          <span>九宫</span>
          <small>时空观象</small>
        </div>
      </section>

      <section className="qimen-hero qimen-gate-hero">
        <div className="qimen-hero-copy">
          <span>奇门工具区</span>
          <h1>奇门问时</h1>
          <p className="qimen-hero-slogan">以时为机，以宫为位，以门观事，以干察应。</p>
          <p>
            以九宫、八门、九星、八神与三奇六仪为基础，提供传统文化角度的排盘、择时与学习参考。
          </p>
          <dl className="qimen-hero-ledger" aria-label="当前 mock 盘摘要">
            {qimenHeroStats.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
          <div className="qimen-hero-actions">
            <a href="#qimen-tools">
              <Compass aria-hidden="true" />
              查看工具
            </a>
            <a href="#qimen-learning" className="is-secondary">
              <ScrollText aria-hidden="true" />
              学习基础
            </a>
          </div>
        </div>

        <aside className="qimen-hero-grid-panel qimen-gate-board">
          <span>{qimenMockChart.title}</span>
          <QimenNineGrid palaces={qimenMockChart.palaces} />
          <p>{qimenMockChart.disclaimer}</p>
        </aside>
      </section>

      <section id="qimen-tools" className="qimen-section" aria-labelledby="qimen-tools-title">
        <div className="qimen-section-head">
          <span>工具卡片</span>
          <h2 id="qimen-tools-title">先看结构，再做参考</h2>
          <p>当前工具区以 mock 数据搭建入口；后续排盘与择时必须由明确规则引擎输出，不交给 AI 随机生成。</p>
        </div>
        <div className="qimen-tool-grid">
          {qimenTools.map((tool) => (
            <QimenToolCard key={tool.href} {...tool} />
          ))}
        </div>
      </section>

      <section id="qimen-learning" className="qimen-section qimen-learning-section" aria-labelledby="qimen-learning-title">
        <div className="qimen-section-head">
          <span>学习入口</span>
          <h2 id="qimen-learning-title">把工具拆回基础结构</h2>
          <p>先理解宫、门、星、神、干的层次，再进入案例、择时和报告复盘。</p>
        </div>
        <div className="qimen-learning-grid">
          {learningEntries.map((entry) => (
            <QimenLearningEntry key={entry.title} {...entry} />
          ))}
        </div>
      </section>

      <section className="qimen-compliance" aria-label="合规说明">
        <strong>合规说明</strong>
        <p>本工具仅作传统文化学习和行动参考，不替代现实专业决策。</p>
      </section>
    </main>
  );
}
