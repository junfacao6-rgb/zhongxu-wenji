import type {
  AiDraftStatus,
  CopyrightStatus,
  Difficulty,
  EvidenceRef,
  ExtractedTextStatus,
  ISODateString,
  ProcessStatus,
  ReviewStatus,
  SourceFileType,
  SubjectKey,
  UploadStatus,
  Visibility,
} from "./platform";

export type SourceType = "classic" | "lecture" | "case" | "note" | "tool-rule" | "report-source" | "other";

export interface Book {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  dynasty: string;
  category: string;
  subject: SubjectKey;
  coverUrl: string;
  description: string;
  difficulty: Difficulty;
  tags: string[];
  copyrightStatus: CopyrightStatus;
  sourceType: SourceType;
  visibility: Visibility;
  readCount: number;
  isPublished: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Chapter {
  id: string;
  bookId: string;
  title: string;
  order: number;
  summary: string;
  segmentIds: string[];
  visibility: Visibility;
}

export interface SourceFile {
  id: string;
  documentId: string;
  fileName: string;
  fileType: SourceFileType;
  fileUrl: string;
  sizeLabel: string;
  checksum?: string;
  uploadedAt: ISODateString;
}

export interface SourceDocument {
  id: string;
  title: string;
  subject: SubjectKey;
  fileType: SourceFileType;
  originalFileUrl: string;
  copyrightStatus: CopyrightStatus;
  visibility: Visibility;
  uploadStatus: UploadStatus;
  processStatus: ProcessStatus;
  extractedTextStatus: ExtractedTextStatus;
  aiDraftStatus: AiDraftStatus;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface SourceSegment {
  id: string;
  documentId: string;
  chapterTitle: string;
  pageStart: number | null;
  pageEnd: number | null;
  originalText: string;
  cleanedText: string;
  modernTranslation: string;
  notes: string[];
  tags: string[];
  evidenceRefs: EvidenceRef[];
  reviewStatus: ReviewStatus;
}

export interface Quote {
  id: string;
  sourceSegmentId: string;
  text: string;
  translation?: string;
  pageLabel?: string;
  evidenceRefs: EvidenceRef[];
}

export interface Annotation {
  id: string;
  sourceSegmentId: string;
  type: "term" | "translation" | "context" | "warning" | "case-link";
  title: string;
  body: string;
  termIds: string[];
  evidenceRefs: EvidenceRef[];
  reviewStatus: ReviewStatus;
}

export interface Term {
  id: string;
  name: string;
  subject: SubjectKey;
  category: string;
  aliases: string[];
  originalExplanation: string;
  plainExplanation: string;
  advancedExplanation: string;
  relatedTerms: string[];
  relatedSources: EvidenceRef[];
  tags: string[];
  visibility: Visibility;
}

export interface KnowledgeUnit {
  id: string;
  subject: SubjectKey;
  title: string;
  summary: string;
  level: Difficulty;
  sourceSegmentIds: string[];
  termIds: string[];
  lessonIds: string[];
  tags: string[];
}
