import { CheckCircle2, RotateCcw, Sparkles, Undo2 } from "lucide-react";
import DocumentStatusBadge from "@/components/admin/documents/DocumentStatusBadge";
import type { AdminSegmentMock } from "@/data/adminMock";

type SegmentEditorProps = {
  segment: AdminSegmentMock;
};

export default function SegmentEditor({ segment }: SegmentEditorProps) {
  return (
    <aside className="segment-editor" aria-label="片段编辑预览">
      <header>
        <span>片段编辑</span>
        <h2>{segment.chapterTitle}</h2>
        <DocumentStatusBadge value={segment.reviewStatus} />
      </header>

      <div className="segment-editor-meta">
        <span>{segment.documentTitle}</span>
        <span>{segment.pageLabel}</span>
      </div>

      <label>
        <span>原文</span>
        <textarea readOnly value={segment.originalText} rows={4} />
      </label>

      <label>
        <span>清洗文本</span>
        <textarea readOnly value={segment.cleanedText} rows={4} />
      </label>

      <label>
        <span>白话翻译</span>
        <textarea readOnly value={segment.modernTranslation} rows={4} />
      </label>

      <section>
        <span>注解</span>
        <ul>
          {segment.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      {segment.keyPoints?.length ? (
        <section>
          <span>要点草稿</span>
          <ul>
            {segment.keyPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <span>相关术语</span>
        <div className="segment-term-list">
          {segment.relatedTerms.map((term) => (
            <em key={term}>{term}</em>
          ))}
        </div>
      </section>

      {segment.possibleLessons?.length ? (
        <section>
          <span>可转课程</span>
          <ul>
            {segment.possibleLessons.map((lesson) => (
              <li key={lesson}>{lesson}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {segment.quizDrafts?.length ? (
        <section>
          <span>测验草稿</span>
          <ul>
            {segment.quizDrafts.map((quiz) => (
              <li key={quiz.question}>
                <strong>{quiz.question}</strong>
                <small>{quiz.answer}</small>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {segment.evidenceRefs?.length ? (
        <section>
          <span>evidenceRefs</span>
          <ul>
            {segment.evidenceRefs.map((ref) => (
              <li key={`${ref.documentId}-${ref.segmentId}`}>
                <strong>{ref.documentId}</strong>
                <small>
                  第 {ref.pageStart}-{ref.pageEnd} 页 · {ref.chapterTitle} · {ref.originalText}
                </small>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <footer>
        <button type="button">
          <CheckCircle2 aria-hidden="true" />
          通过
        </button>
        <button type="button">
          <Undo2 aria-hidden="true" />
          退回
        </button>
        <button type="button">
          <Sparkles aria-hidden="true" />
          生成课程
        </button>
        <button type="button">
          <RotateCcw aria-hidden="true" />
          重置
        </button>
      </footer>
    </aside>
  );
}
