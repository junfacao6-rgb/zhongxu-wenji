import type { EvidenceRef, ISODateString, ReviewStatus } from "@/types/platform";

export type AiTaskType =
  | "extract_outline"
  | "clean_text"
  | "translate_classical"
  | "explain_plain"
  | "extract_terms"
  | "generate_lesson"
  | "generate_quiz"
  | "generate_flashcards"
  | "generate_summary"
  | "generate_report";

export type AiDraftPayload = Record<string, unknown>;

export interface AiDraft {
  id: string;
  taskType: AiTaskType;
  sourceDocumentId: string;
  sourceSegmentIds: string[];
  input: AiDraftPayload;
  output: AiDraftPayload;
  evidenceRefs: EvidenceRef[];
  reviewStatus: ReviewStatus;
  createdAt: ISODateString;
}

export interface AiTaskRequest {
  taskType: AiTaskType;
  sourceDocumentId: string;
  sourceSegmentIds: string[];
  input: AiDraftPayload;
  evidenceRefs: EvidenceRef[];
}

export interface AiClient {
  runTask(request: AiTaskRequest): Promise<AiDraft>;
}

export interface DocumentPipelineResult {
  outlineDraft: AiDraft;
  segmentsDraft: AiDraft;
  termsDraft: AiDraft;
  lessonsDraft: AiDraft;
  quizzesDraft: AiDraft;
}
