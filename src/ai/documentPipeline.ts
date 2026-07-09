import { runMockAiTask } from "@/ai/mockAi";
import { renderDocumentPrompt } from "@/ai/prompts/documentPrompts";
import type { AiDraft, DocumentPipelineResult } from "@/ai/types";
import { adminSegmentMocks, adminSourceMocks } from "@/data/adminMock";
import type { EvidenceRef } from "@/types/platform";

export async function processDocument(documentId: string): Promise<DocumentPipelineResult> {
  const sourceDocument = adminSourceMocks.find((document) => document.id === documentId);

  if (!sourceDocument) {
    throw new Error(`Source document not found: ${documentId}`);
  }

  const segments = adminSegmentMocks.filter((segment) => segment.documentId === documentId);
  const sourceSegmentIds = segments.map((segment) => segment.id);
  const sourceText = segments.map((segment) => `${segment.chapterTitle}\n${segment.originalText}`).join("\n\n");
  const evidenceRefs = buildEvidenceRefs(documentId, segments);
  const baseInput = {
    sourceTitle: sourceDocument.title,
    subject: sourceDocument.subject,
    copyrightStatus: sourceDocument.copyrightStatus,
    visibility: sourceDocument.visibility,
    sourceText,
    compliance: "AI 整理结果只进入后台草稿，必须管理员审核后发布。",
  };

  const outlineDraft = await runMockAiTask({
    taskType: "extract_outline",
    sourceDocumentId: documentId,
    sourceSegmentIds,
    input: {
      ...baseInput,
      prompt: renderDocumentPrompt("generateSummary", { sourceText }),
      requestedOutput: "outlineDraft",
    },
    evidenceRefs,
  });

  const segmentsDraft = await runMockAiTask({
    taskType: "clean_text",
    sourceDocumentId: documentId,
    sourceSegmentIds,
    input: {
      ...baseInput,
      prompt: "清洗文本并保留原文对应关系；不改变原意，不补造来源。",
      requestedOutput: "segmentsDraft",
    },
    evidenceRefs,
  });

  const termsDraft = await runMockAiTask({
    taskType: "extract_terms",
    sourceDocumentId: documentId,
    sourceSegmentIds,
    input: {
      ...baseInput,
      prompt: renderDocumentPrompt("extractTerms", { sourceText }),
      requestedOutput: "termsDraft",
    },
    evidenceRefs,
  });

  const lessonsDraft = await runMockAiTask({
    taskType: "generate_lesson",
    sourceDocumentId: documentId,
    sourceSegmentIds,
    input: {
      ...baseInput,
      prompt: renderDocumentPrompt("generateLesson", { sourceText }),
      requestedOutput: "lessonsDraft",
    },
    evidenceRefs,
  });

  const quizzesDraft = await runMockAiTask({
    taskType: "generate_quiz",
    sourceDocumentId: documentId,
    sourceSegmentIds,
    input: {
      ...baseInput,
      prompt: renderDocumentPrompt("generateQuiz", { sourceText }),
      requestedOutput: "quizzesDraft",
    },
    evidenceRefs,
  });

  return {
    outlineDraft: ensureDraftReview(outlineDraft),
    segmentsDraft: ensureDraftReview(segmentsDraft),
    termsDraft: ensureDraftReview(termsDraft),
    lessonsDraft: ensureDraftReview(lessonsDraft),
    quizzesDraft: ensureDraftReview(quizzesDraft),
  };
}

function buildEvidenceRefs(documentId: string, segments: Array<{ id: string; chapterTitle: string; originalText: string }>): EvidenceRef[] {
  if (segments.length === 0) {
    return [{ sourceId: documentId }];
  }

  return segments.map((segment) => ({
    sourceId: documentId,
    segmentId: segment.id,
    chapterTitle: segment.chapterTitle,
    quote: segment.originalText.slice(0, 80),
  }));
}

function ensureDraftReview(draft: AiDraft): AiDraft {
  return {
    ...draft,
    reviewStatus: "pending",
  };
}
