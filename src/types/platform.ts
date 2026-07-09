export type SubjectKey = "qimen" | "bazi" | "liuyao" | "meihua" | "dao" | "yixue";

export type Visibility = "public" | "members" | "course" | "private" | "hidden";

export type CopyrightStatus =
  | "public_domain"
  | "self_owned"
  | "authorized"
  | "excerpt_only"
  | "private_study"
  | "hidden";

export type Difficulty = "入门" | "进阶" | "专业" | "原典";

export type PublishStatus = "draft" | "reviewing" | "published" | "archived" | "rejected";

export type ReviewStatus = "pending" | "needs_review" | "approved" | "rejected";

export type UploadStatus = "idle" | "uploading" | "uploaded" | "failed";

export type ProcessStatus = "pending" | "extracting" | "processing" | "ready" | "failed";

export type ExtractedTextStatus = "not_started" | "needs_ocr" | "ready" | "failed";

export type AiDraftStatus = "not_started" | "mock_ready" | "drafting" | "ready" | "needs_review" | "failed";

export type SourceFileType = "pdf" | "doc" | "docx" | "txt" | "md" | "image" | "audio" | "video" | "other";

export type ISODateString = string;

export interface EvidenceRef {
  sourceId: string;
  segmentId?: string;
  pageStart?: number;
  pageEnd?: number;
  chapterTitle?: string;
  quote?: string;
}
