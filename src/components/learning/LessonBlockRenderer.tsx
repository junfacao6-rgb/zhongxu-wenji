import { BookMarked, FileText, Lightbulb, MessageSquareQuote, NotebookText, Puzzle, Route, ScrollText } from "lucide-react";
import Link from "next/link";
import QuizBlock from "@/components/learning/QuizBlock";
import type { Term } from "@/types/content";
import type { LessonBlock } from "@/types/learning";

type LessonBlockRendererProps = {
  block: LessonBlock;
  terms: Term[];
};

export default function LessonBlockRenderer({ block, terms }: LessonBlockRendererProps) {
  switch (block.type) {
    case "text":
      return (
        <section className="lesson-block lesson-text-block">
          <div className="lesson-block-label">
            <FileText aria-hidden="true" />
            正文
          </div>
          {block.title ? <h2>{block.title}</h2> : null}
          <p>{block.body}</p>
        </section>
      );

    case "quote":
      return (
        <section className="lesson-block lesson-quote-block">
          <div className="lesson-block-label">
            <MessageSquareQuote aria-hidden="true" />
            原文引用
          </div>
          <blockquote>{block.text}</blockquote>
          <p>{block.sourceLabel}</p>
        </section>
      );

    case "translation":
      return (
        <section className="lesson-block lesson-translation-block">
          <div className="lesson-block-label">
            <ScrollText aria-hidden="true" />
            白话翻译
          </div>
          <div>
            <strong>原文</strong>
            <p>{block.original}</p>
          </div>
          <div>
            <strong>白话</strong>
            <p>{block.translation}</p>
          </div>
        </section>
      );

    case "term-list": {
      const blockTerms = terms.filter((term) => block.termIds.includes(term.id));
      return (
        <section className="lesson-block lesson-term-block">
          <div className="lesson-block-label">
            <BookMarked aria-hidden="true" />
            术语列表
          </div>
          <div className="lesson-term-grid">
            {blockTerms.length > 0 ? (
              blockTerms.map((term) => (
                <Link key={term.id} href={`/terms/${term.id}`}>
                  <strong>{term.name}</strong>
                  <span>{term.plainExplanation}</span>
                </Link>
              ))
            ) : (
              <p>本课术语待后台整理。</p>
            )}
          </div>
        </section>
      );
    }

    case "case":
      return (
        <section className="lesson-block lesson-case-block">
          <div className="lesson-block-label">
            <NotebookText aria-hidden="true" />
            案例
          </div>
          <h2>案例复盘占位</h2>
          <p>案例编号：{block.caseStudyId}。第一阶段使用 mock 案例，后续会接入脱敏案例、来源片段和复盘记录。</p>
        </section>
      );

    case "quiz":
      return (
        <section className="lesson-block">
          <div className="lesson-block-label">
            <Puzzle aria-hidden="true" />
            练习
          </div>
          <QuizBlock quizId={block.quizId} />
        </section>
      );

    case "tool-link":
      return (
        <section className="lesson-block lesson-tool-block">
          <div className="lesson-block-label">
            <Route aria-hidden="true" />
            工具入口
          </div>
          <Link href={block.href}>
            {block.label}
            <span>{block.toolKey}</span>
          </Link>
        </section>
      );

    case "note":
      return (
        <section className="lesson-block lesson-note-block">
          <div className="lesson-block-label">
            <Lightbulb aria-hidden="true" />
            老师提示
          </div>
          <h2>{block.title}</h2>
          <p>{block.body}</p>
        </section>
      );

    default:
      return null;
  }
}
