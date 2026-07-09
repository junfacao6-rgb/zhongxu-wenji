import type { Difficulty, EvidenceRef, ISODateString, SubjectKey, Visibility } from "./platform";

export type LessonBlockType =
  | "text"
  | "quote"
  | "translation"
  | "image"
  | "diagram"
  | "table"
  | "term-list"
  | "quiz"
  | "case"
  | "tool-link"
  | "note";

export interface Course {
  id: string;
  subject: SubjectKey;
  title: string;
  subtitle: string;
  description: string;
  difficulty: Difficulty;
  moduleIds: string[];
  lessonIds: string[];
  visibility: Visibility;
  isPublished: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  summary: string;
  order: number;
  lessonIds: string[];
}

export interface Lesson {
  id: string;
  courseId: string;
  moduleId: string;
  subject: SubjectKey;
  title: string;
  summary: string;
  order: number;
  estimatedMinutes: number;
  blocks: LessonBlock[];
  quizIds: string[];
  knowledgeUnitIds: string[];
  visibility: Visibility;
}

export type LessonBlock =
  | { id: string; type: "text"; title?: string; body: string; evidenceRefs?: EvidenceRef[] }
  | { id: string; type: "quote"; quoteId: string; text: string; sourceLabel: string; evidenceRefs: EvidenceRef[] }
  | { id: string; type: "translation"; original: string; translation: string; evidenceRefs: EvidenceRef[] }
  | { id: string; type: "image"; imageUrl: string; alt: string; caption?: string }
  | { id: string; type: "diagram"; title: string; diagramKey: string; caption?: string }
  | { id: string; type: "table"; title: string; headers: string[]; rows: string[][] }
  | { id: string; type: "term-list"; termIds: string[] }
  | { id: string; type: "quiz"; quizId: string }
  | { id: string; type: "case"; caseStudyId: string }
  | { id: string; type: "tool-link"; label: string; href: string; toolKey: string }
  | { id: string; type: "note"; title: string; body: string };

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  questions: QuizQuestion[];
  passingScore: number;
}

export interface QuizQuestion {
  id: string;
  type: "single-choice" | "multi-choice" | "true-false" | "short-answer";
  prompt: string;
  options?: string[];
  answer: string | string[];
  explanation: string;
  evidenceRefs: EvidenceRef[];
}

export interface Flashcard {
  id: string;
  subject: SubjectKey;
  front: string;
  back: string;
  termIds: string[];
  evidenceRefs: EvidenceRef[];
}

export interface StudyProgress {
  id: string;
  userId: string;
  courseId?: string;
  lessonId?: string;
  subject?: SubjectKey;
  progressPercent: number;
  completedLessonIds: string[];
  lastStudiedAt: ISODateString;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  body: string;
  sourceSegmentId?: string;
  lessonId?: string;
  termId?: string;
  tags: string[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Bookmark {
  id: string;
  userId: string;
  targetType: "book" | "chapter" | "segment" | "term" | "lesson" | "course" | "report";
  targetId: string;
  title: string;
  createdAt: ISODateString;
}
