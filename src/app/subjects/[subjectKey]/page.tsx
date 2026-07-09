import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, FileText, GraduationCap, NotebookPen, Wrench } from "lucide-react";
import { notFound } from "next/navigation";
import LearningPath from "@/components/subjects/LearningPath";
import SubjectBooks from "@/components/subjects/SubjectBooks";
import SubjectHero from "@/components/subjects/SubjectHero";
import SubjectTerms from "@/components/subjects/SubjectTerms";
import { platformMockBooks } from "@/data/books";
import { courses } from "@/data/courses";
import { subjects } from "@/data/subjects";
import { terms } from "@/data/terms";
import type { Course } from "@/types/learning";
import type { SubjectKey } from "@/types/platform";

type DetailSubjectKey = "qimen" | "bazi" | "liuyao" | "meihua" | "dao";

type SubjectToolLink = {
  title: string;
  href: string;
  summary: string;
};

type SubjectCase = {
  title: string;
  summary: string;
};

type SubjectDetailContent = {
  introduction: string;
  path: string[];
  coreTermIds: string[];
  toolTitle: string;
  toolLinks: SubjectToolLink[];
  reservedTool?: string;
  cases: SubjectCase[];
  suggestions: string[];
};

const detailSubjectKeys: DetailSubjectKey[] = ["qimen", "bazi", "liuyao", "meihua", "dao"];

const subjectDetailContent: Record<DetailSubjectKey, SubjectDetailContent> = {
  qimen: {
    introduction:
      "奇门是观察时空、方位、人事、气机变化的象数模型。平台以九宫、八门、九星、八神、三奇六仪为基础，帮助用户学习其结构和应用。",
    path: ["九宫", "八门", "九星", "八神", "三奇六仪", "值符值使", "格局条件", "择时复盘"],
    coreTermIds: ["jiugong", "bamen", "jiuxing", "bashen", "sanqi", "liuyi", "zhifu", "zhishi"],
    toolTitle: "奇门工具入口",
    toolLinks: [
      { title: "今日气机", href: "/qimen/today", summary: "用 mock 气机提示练习观察日内节奏。" },
      { title: "专业排盘", href: "/qimen/chart", summary: "查看九宫盘式 UI，后续接规则引擎。" },
      { title: "一事择时", href: "/qimen/select-time", summary: "围绕单一事项生成参考时段。" },
      { title: "报告预览", href: "/qimen/report/preview", summary: "查看结构化报告草稿样式。" },
    ],
    cases: [
      { title: "出行择时复盘", summary: "围绕出行时间、方位、天气和实际反馈练习记录条件链。" },
      { title: "内容发布节奏", summary: "用今日气机与内容发布择时 mock 练习表达“较适合、慎用、参考”。" },
    ],
    suggestions: ["先背结构，不急着断事。", "每次练习必须写明用神、宫位、门星神干。", "择时只作行动参考，事后要复盘。"],
  },
  bazi: {
    introduction:
      "八字命理以出生时间的干支结构为学习对象，重点不是浅层断语，而是理解月令、气势、寒暖燥湿、格局、调候、清浊、用神成败，以及原局与大运流年的综合判断。",
    path: ["阴阳五行", "天干地支", "十神", "藏干", "十二长生", "月令", "日主旺衰", "格局", "调候", "用神", "大运", "流年", "原局与运年综合判断"],
    coreTermIds: ["yinyang", "wuxing", "tiangan", "dizhi", "shishen", "canggan", "yueling", "wangshuai", "bazi-geju", "tiaohou", "bazi-yongshen", "dayun", "liunian"],
    toolTitle: "八字学习入口",
    toolLinks: [
      { title: "八字学习系统", href: "/bazi", summary: "查看路径、术语、书籍、案例和排盘占位。" },
      { title: "完整学习路径", href: "/bazi/learn", summary: "从阴阳五行走到原局与运年综合判断。" },
      { title: "案例学习", href: "/bazi/cases", summary: "练习身强财旺、身弱杀旺、寒木向阳等结构。" },
      { title: "排盘占位", href: "/bazi/chart-placeholder", summary: "第一版只做占位，不接真实排盘算法。" },
    ],
    cases: [
      { title: "身强财旺案例", summary: "练习身强能否任财、财星是否清、食伤生财与比劫争财的区别。" },
      { title: "身弱杀旺案例", summary: "练习七杀、印星、扶身与制化条件，不作现实断语。" },
      { title: "寒木向阳案例", summary: "从冬令寒湿、木气生发和丙火调候观察结构。" },
      { title: "火炎土燥案例", summary: "从燥热、清浊、润燥与疏土观察调候次序。" },
      { title: "食伤生财案例", summary: "观察表达、流通与财星承接，不推断收入结果。" },
    ],
    suggestions: ["先掌握术语语言，再进入案例。", "不要只背格局名，要写出成立、破格和救应条件。", "所有解释都应作为结构参考，不替代专业意见。"],
  },
  liuyao: {
    introduction:
      "六爻纳甲以具体问题为入口，通过起卦、装卦、世应、六亲、六神、用神、动变、月建日辰和应期，训练有边界的问事分析与复盘。",
    path: ["八卦基础", "起卦方法", "装卦", "世应", "六亲", "六神", "用神", "原神忌神仇神", "月建日辰", "动爻变爻", "冲合刑害", "空亡墓绝", "应期", "分类占断", "案例复盘"],
    coreTermIds: ["bagua", "shiying", "liuqin", "liushen", "liuyao-yongshen", "dongyao", "bianyao", "yuejian", "richen", "xunkong", "yingqi"],
    toolTitle: "六爻学习入口",
    toolLinks: [
      { title: "六爻学习系统", href: "/liuyao", summary: "查看路径、术语、书籍、案例和起卦占位。" },
      { title: "完整学习路径", href: "/liuyao/learn", summary: "从八卦基础走到分类占断和案例复盘。" },
      { title: "案例学习", href: "/liuyao/cases", summary: "练习求财、求职、感情、失物、考试五类问事。" },
      { title: "起卦占位", href: "/liuyao/hexagram-placeholder", summary: "第一版只做占位，不接真实起卦算法。" },
    ],
    cases: [
      { title: "求财案例", summary: "练习妻财用神、世爻承载、动爻变化和现实合同校验。" },
      { title: "求职案例", summary: "练习官鬼、父母材料、世应关系和面试流程复盘。" },
      { title: "感情案例", summary: "练习关系对象取用、世应位置和现实边界表达。" },
      { title: "失物案例", summary: "练习物品类型、父母用神、方位线索和查找路径记录。" },
      { title: "考试案例", summary: "练习父母爻、世爻、官鬼压力和备考反馈复盘。" },
    ],
    suggestions: ["先明所问，再取用神。", "六神只作辅助象意，不越过六亲和用神。", "应期只作参考线索，必须复盘。", "第一版不做真实起卦，只做学习结构。"],
  },
  meihua: {
    introduction:
      "梅花易数重在象数、体用、动静、外应与复盘。第一版以先后天八卦、起卦法、体用、互卦、变卦、五行生克、外应、数字取象和案例训练为主，帮助学习者形成可记录的判断过程。",
    path: ["先后天八卦", "起卦法", "体用", "互卦", "变卦", "五行生克", "外应", "数字取象", "案例"],
    coreTermIds: ["bagua", "wuxing", "shengke", "fangwei", "yinyang", "liangyi"],
    toolTitle: "梅花学习入口",
    toolLinks: [
      { title: "梅花学习系统", href: "/meihua", summary: "查看路径、术语、书籍和案例卡片。" },
      { title: "完整学习路径", href: "/meihua/learn", summary: "按九步学习先后天八卦、体用、互变与外应。" },
      { title: "案例学习", href: "/meihua/cases", summary: "练习触机、体用、互卦、变卦和反馈复盘。" },
      { title: "基础术语库", href: "/terms", summary: "回到八卦、五行、方位等共同基础。" },
    ],
    cases: [
      { title: "学习计划触机", summary: "记录时间、钟声、体用和推进节奏，练习取数来源。" },
      { title: "内容发布取象", summary: "从修订提示、体用关系和变卦方向观察发布前准备。" },
      { title: "札记遗失练习", summary: "围绕物象、方位、体用和查找路径做结构记录。" },
    ],
    suggestions: ["取象要有来处。", "先写体用，再谈生克。", "案例复盘比追求断语更重要。"],
  },
  dao: {
    introduction:
      "道家经典学习以原文阅读为根，以白话札记为桥，围绕道、无为、守中、虚静、心斋、齐物等思想，进入稳定、安静的日用省察与文案素材整理。这里不做预测工具，只做阅读、修身与表达训练。",
    path: ["道德经", "庄子", "阴符经", "清静经", "传统文化文案素材"],
    coreTermIds: ["yinyang", "taiji", "liangyi", "wuxing", "shengke"],
    toolTitle: "道家经典入口",
    toolLinks: [
      { title: "道家学习系统", href: "/dao", summary: "查看经典索引、阅读原则和学习路径。" },
      { title: "完整阅读路径", href: "/dao/learn", summary: "从原文慢读到白话札记、修身应用和素材整理。" },
      { title: "道德经", href: "/book/daodejing-public-domain", summary: "公版经典短读，适合建立道家阅读节奏。" },
      { title: "庄子选读", href: "/book/zhuangzi-selected-reading", summary: "围绕寓言、齐物、心斋、逍遥等主题选读。" },
    ],
    cases: [
      { title: "章句札记", summary: "一章原文、一段白话、一条日用札记。" },
      { title: "清静日课", summary: "围绕清静、观心、言行边界记录每日省察。" },
      { title: "文案素材整理", summary: "将经典概念整理为合规、克制、可引用的表达素材。" },
    ],
    suggestions: ["先读原文，再看白话。", "不把经典包装成神秘承诺。", "用札记记录日用省察，不替代专业建议。"],
  },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return detailSubjectKeys.map((subjectKey) => ({ subjectKey }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subjectKey: string }>;
}): Promise<Metadata> {
  const { subjectKey } = await params;
  const subject = getSubject(subjectKey);

  if (!subject) {
    return {
      title: "学科不存在 | 问古书斋",
      description: "该学科暂未开放。",
    };
  }

  return {
    title: `${subject.name} | 问古书斋`,
    description: subject.description,
  };
}

export default async function SubjectDetailPage({ params }: { params: Promise<{ subjectKey: string }> }) {
  const { subjectKey } = await params;
  const subject = getSubject(subjectKey);

  if (!subject) {
    notFound();
  }

  const detail = subjectDetailContent[subject.key];
  const subjectBooks = platformMockBooks
    .filter((book) => book.subject === subject.key && book.visibility !== "private" && book.visibility !== "hidden")
    .slice(0, 4);
  const subjectCourses = courses.filter((course) => course.subject === subject.key && course.isPublished);
  const subjectTerms = getCoreTerms(detail.coreTermIds, subject.key);

  return (
    <main className="subject-detail-page">
      <SubjectHero
        subject={subject}
        introduction={detail.introduction}
        bookCount={subjectBooks.length}
        courseCount={subjectCourses.length}
        primaryHref={getPrimaryHref(subject.key, subjectBooks[0]?.id)}
        primaryLabel={getPrimaryLabel(subject.key)}
      />

      <div className="subject-detail-layout">
        <section className="subject-panel subject-path-panel" aria-labelledby="subject-path-title">
          <SectionHeading eyebrow="入门路径" title="建议学习顺序" />
          <LearningPath steps={detail.path} />
        </section>

        <section className="subject-panel" aria-labelledby="subject-terms-title">
          <SectionHeading eyebrow="核心术语" title="先掌握这些概念" />
          <SubjectTerms terms={subjectTerms} />
        </section>

        <section className="subject-panel" aria-labelledby="subject-books-title">
          <SectionHeading eyebrow="推荐古籍" title="相关书籍" />
          <SubjectBooks books={subjectBooks} />
        </section>

        <section className="subject-panel" aria-labelledby="subject-courses-title">
          <SectionHeading eyebrow="推荐课程" title="入门课程" />
          <SubjectCourseList courses={subjectCourses} />
        </section>

        <section className="subject-panel" aria-labelledby="subject-tools-title">
          <SectionHeading eyebrow={subject.key === "qimen" ? "工具入口" : detail.toolLinks.length > 0 ? "学习入口" : "工具预留"} title={detail.toolTitle} />
          {detail.toolLinks.length > 0 ? <SubjectToolList tools={detail.toolLinks} /> : <p className="subject-reserved-copy">{detail.reservedTool}</p>}
        </section>

        <section className="subject-panel" aria-labelledby="subject-cases-title">
          <SectionHeading eyebrow="案例学习" title="练习与复盘" />
          <div className="subject-case-list">
            {detail.cases.map((item) => (
              <article key={item.title}>
                <NotebookPen aria-hidden="true" />
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="subject-panel subject-advice-panel" aria-labelledby="subject-advice-title">
          <SectionHeading eyebrow="学习建议" title="保持克制和证据意识" />
          <ul>
            {detail.suggestions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="subject-section-head">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
    </div>
  );
}

function SubjectCourseList({ courses: subjectCourses }: { courses: Course[] }) {
  if (subjectCourses.length === 0) {
    return <p className="subject-empty-copy">推荐课程正在整理中。</p>;
  }

  return (
    <div className="subject-course-list">
      {subjectCourses.map((course) => (
        <Link key={course.id} href={`/courses/${course.id}`}>
          <GraduationCap aria-hidden="true" />
          <span>{course.difficulty}</span>
          <strong>{course.title}</strong>
          <p>{course.subtitle}</p>
          <small>
            查看课程
            <ArrowRight aria-hidden="true" />
          </small>
        </Link>
      ))}
    </div>
  );
}

function SubjectToolList({ tools }: { tools: SubjectToolLink[] }) {
  return (
    <div className="subject-tool-list">
      {tools.map((tool) => (
        <Link key={tool.href} href={tool.href}>
          <Wrench aria-hidden="true" />
          <strong>{tool.title}</strong>
          <p>{tool.summary}</p>
          <small>
            进入
            <ArrowRight aria-hidden="true" />
          </small>
        </Link>
      ))}
    </div>
  );
}

function getSubject(subjectKey: string) {
  if (!isDetailSubjectKey(subjectKey)) return null;
  const subject = subjects.find((item) => item.key === subjectKey);
  return subject ? { ...subject, key: subjectKey } : null;
}

function isDetailSubjectKey(subjectKey: string): subjectKey is DetailSubjectKey {
  return detailSubjectKeys.includes(subjectKey as DetailSubjectKey);
}

function getPrimaryHref(subjectKey: DetailSubjectKey, firstBookId?: string) {
  if (subjectKey === "qimen") return "/qimen";
  if (subjectKey === "bazi") return "/bazi";
  if (subjectKey === "liuyao") return "/liuyao";
  if (subjectKey === "meihua") return "/meihua";
  if (subjectKey === "dao") return "/dao";
  return firstBookId ? `/book/${firstBookId}` : "/library";
}

function getPrimaryLabel(subjectKey: DetailSubjectKey) {
  if (subjectKey === "qimen") return "进入奇门工具";
  if (subjectKey === "bazi") return "进入八字学习";
  if (subjectKey === "liuyao") return "进入六爻学习";
  if (subjectKey === "meihua") return "进入梅花学习";
  if (subjectKey === "dao") return "进入道家学习";
  return "查看推荐书籍";
}

function getCoreTerms(termIds: string[], subject: SubjectKey) {
  const termMap = new Map(terms.map((term) => [term.id, term]));
  const orderedTerms = termIds.flatMap((id) => {
    const term = termMap.get(id);
    return term ? [term] : [];
  });
  const fallbackTerms = terms.filter((term) => term.subject === subject || (subject === "dao" && term.subject === "yixue"));

  return Array.from(new Map([...orderedTerms, ...fallbackTerms].map((term) => [term.id, term])).values()).slice(0, 10);
}
