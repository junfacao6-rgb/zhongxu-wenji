import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RelatedSources, { type RelatedTool } from "@/components/terms/RelatedSources";
import TermDetail from "@/components/terms/TermDetail";
import { platformMockBooks } from "@/data/books";
import { courses } from "@/data/courses";
import { terms } from "@/data/terms";
import type { Book, Term } from "@/types/content";
import type { SubjectKey } from "@/types/platform";

export function generateStaticParams() {
  return terms.map((term) => ({ termId: term.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ termId: string }>;
}): Promise<Metadata> {
  const { termId } = await params;
  const term = getTerm(termId);

  if (!term) {
    return {
      title: "术语不存在 | 问古书斋",
      description: "该术语不存在或暂未发布。",
    };
  }

  return {
    title: `${term.name} | 术语库 | 问古书斋`,
    description: term.plainExplanation,
  };
}

export default async function TermDetailPage({ params }: { params: Promise<{ termId: string }> }) {
  const { termId } = await params;
  const term = getTerm(termId);

  if (!term) {
    notFound();
  }

  const relatedTerms = getRelatedTerms(term);
  const relatedBooks = getRelatedBooks(term);
  const relatedCourses = courses.filter((course) => course.subject === term.subject && course.isPublished).slice(0, 3);
  const relatedTools = getRelatedTools(term.subject);

  return (
    <main className="term-detail-page">
      <TermDetail term={term} dailyScenarios={getDailyScenarios(term)} relatedTerms={relatedTerms} />
      <RelatedSources books={relatedBooks} courses={relatedCourses} tools={relatedTools} />
    </main>
  );
}

function getTerm(termId: string) {
  return terms.find((term) => term.id === termId && term.visibility !== "hidden");
}

function getRelatedTerms(term: Term) {
  const direct = terms.filter((candidate) => {
    if (candidate.id === term.id || candidate.visibility === "hidden") return false;
    return term.relatedTerms.includes(candidate.name) || candidate.relatedTerms.includes(term.name);
  });
  const fallback = terms.filter((candidate) => candidate.id !== term.id && candidate.subject === term.subject && candidate.visibility !== "hidden");

  return Array.from(new Map([...direct, ...fallback].map((item) => [item.id, item])).values()).slice(0, 6);
}

function getRelatedBooks(term: Term) {
  const visibleBooks = platformMockBooks.filter((book) => book.visibility !== "private" && book.visibility !== "hidden");
  const relatedBooks = visibleBooks.filter((book) => isBookRelatedToTerm(book, term));
  const classics = relatedBooks.filter((book) => book.sourceType === "classic");

  return Array.from(new Map([...classics, ...relatedBooks].map((book) => [book.id, book])).values()).slice(0, 4);
}

function isBookRelatedToTerm(book: Book, term: Term) {
  if (book.subject === term.subject) return true;
  return book.tags.some((tag) => term.name.includes(tag) || term.tags.includes(tag) || term.relatedTerms.includes(tag));
}

function getDailyScenarios(term: Term) {
  if (term.id === "jingmen") {
    return ["发视频", "写文章", "做 PPT", "考试", "面试", "直播", "投稿", "汇报"];
  }

  const scenarios: Record<SubjectKey, string[]> = {
    qimen: ["择时练习", "方位观察", "事项复盘", "报告表达"],
    bazi: ["命例拆解", "十神练习", "格局条件记录", "大运流年复盘"],
    liuyao: ["问事记录", "用神定位", "动变分析", "应期复盘"],
    meihua: ["取象练习", "体用分析", "外应记录", "案例复盘"],
    dao: ["原文短读", "白话札记", "日用省察", "文案素材整理"],
    yixue: ["基础概念复习", "术语卡片", "跨学科对照", "学习路径梳理"],
  };

  return scenarios[term.subject];
}

function getRelatedTools(subject: SubjectKey): RelatedTool[] {
  const tools: Record<SubjectKey, RelatedTool[]> = {
    qimen: [
      { title: "今日气机", href: "/qimen/today", summary: "用 mock 气机练习观察当日节奏。" },
      { title: "专业排盘", href: "/qimen/chart", summary: "查看九宫盘式结构，后续接规则引擎。" },
      { title: "一事择时", href: "/qimen/select-time", summary: "围绕具体事项生成参考时段。" },
    ],
    bazi: [{ title: "八字学科中心", href: "/subjects/bazi", summary: "排盘工具后续接入，当前先回到学习路径。" }],
    liuyao: [{ title: "六爻学科中心", href: "/subjects/liuyao", summary: "起卦工具后续接入，当前先回到问事路径。" }],
    meihua: [{ title: "梅花学科中心", href: "/subjects/meihua", summary: "从象数、体用和案例复盘进入学习。" }],
    dao: [{ title: "道家经典中心", href: "/subjects/dao", summary: "从原文阅读、白话解释和日用省察进入。" }],
    yixue: [{ title: "学科中心", href: "/subjects", summary: "从共同基础进入奇门、八字、六爻等方向。" }],
  };

  return tools[subject];
}
