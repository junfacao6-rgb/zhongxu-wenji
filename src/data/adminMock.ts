import type { AiDraftStatus, CopyrightStatus, ExtractedTextStatus, ProcessStatus, ReviewStatus, SourceFileType, SubjectKey, UploadStatus, Visibility } from "@/types/platform";
import {
  newUploadImportPipelineMocks,
  newUploadReviewMocks,
  newUploadSegmentMocks,
  newUploadSourceMocks,
} from "@/data/sourceIntakeMock";

export interface AdminSourceMock {
  id: string;
  title: string;
  subject: SubjectKey;
  fileType: SourceFileType;
  copyrightStatus: CopyrightStatus;
  visibility: Visibility;
  uploadStatus: UploadStatus;
  processStatus: ProcessStatus;
  extractedTextStatus: ExtractedTextStatus;
  aiDraftStatus: AiDraftStatus;
  reviewStatus: ReviewStatus;
  owner: string;
  updatedAt: string;
}

export interface AdminReviewMock {
  id: string;
  sourceId: string;
  title: string;
  reviewStatus: ReviewStatus;
  riskLevel: "low" | "medium" | "high";
  checklist: {
    label: string;
    ok: boolean;
    note: string;
  }[];
}

export type ImportStepStatus = "done" | "active" | "pending" | "blocked";

export interface AdminImportStepMock {
  key:
    | "uploaded"
    | "text_extracted"
    | "cleaned"
    | "chaptered"
    | "translated"
    | "terms_extracted"
    | "course_drafted"
    | "reviewing"
    | "published";
  label: string;
  status: ImportStepStatus;
  description: string;
}

export interface AdminImportPipelineMock {
  id: string;
  sourceId: string;
  title: string;
  subject: SubjectKey;
  copyrightStatus: CopyrightStatus;
  visibility: Visibility;
  owner: string;
  updatedAt: string;
  riskNote: string;
  steps: AdminImportStepMock[];
}

export interface AdminSegmentMock {
  id: string;
  documentId: string;
  documentTitle: string;
  pageLabel: string;
  chapterTitle: string;
  originalText: string;
  cleanedText: string;
  modernTranslation: string;
  notes: string[];
  keyPoints?: string[];
  relatedTerms: string[];
  possibleLessons?: string[];
  quizDrafts?: Array<{
    question: string;
    answer: string;
  }>;
  evidenceRefs?: AdminSegmentEvidenceRef[];
  reviewStatus: ReviewStatus;
}

export interface AdminSegmentEvidenceRef {
  documentId: string;
  segmentId: string;
  pageStart: number;
  pageEnd: number;
  chapterTitle: string;
  originalText: string;
}

const baseAdminSourceMocks: AdminSourceMock[] = [
  {
    id: "source-qimen-upload-1",
    title: "奇门讲义第一讲",
    subject: "qimen",
    fileType: "docx",
    copyrightStatus: "self_owned",
    visibility: "private",
    uploadStatus: "uploaded",
    processStatus: "ready",
    extractedTextStatus: "ready",
    aiDraftStatus: "mock_ready",
    reviewStatus: "pending",
    owner: "管理员",
    updatedAt: "2026-07-07T00:00:00.000Z",
  },
  {
    id: "source-bazi-classic-1",
    title: "子平真诠摘录",
    subject: "bazi",
    fileType: "pdf",
    copyrightStatus: "public_domain",
    visibility: "public",
    uploadStatus: "uploaded",
    processStatus: "processing",
    extractedTextStatus: "needs_ocr",
    aiDraftStatus: "not_started",
    reviewStatus: "needs_review",
    owner: "管理员",
    updatedAt: "2026-07-07T00:00:00.000Z",
  },
  {
    id: "source-liuyao-private-1",
    title: "六爻案例复盘私有资料",
    subject: "liuyao",
    fileType: "txt",
    copyrightStatus: "private_study",
    visibility: "private",
    uploadStatus: "uploaded",
    processStatus: "ready",
    extractedTextStatus: "ready",
    aiDraftStatus: "mock_ready",
    reviewStatus: "pending",
    owner: "管理员",
    updatedAt: "2026-07-07T00:00:00.000Z",
  },
  {
    id: "source-dao-excerpt-1",
    title: "庄子选读授权待确认",
    subject: "dao",
    fileType: "doc",
    copyrightStatus: "excerpt_only",
    visibility: "hidden",
    uploadStatus: "uploaded",
    processStatus: "ready",
    extractedTextStatus: "ready",
    aiDraftStatus: "needs_review",
    reviewStatus: "needs_review",
    owner: "管理员",
    updatedAt: "2026-07-07T00:00:00.000Z",
  },
];

export const adminSourceMocks: AdminSourceMock[] = [...baseAdminSourceMocks, ...newUploadSourceMocks];

const baseAdminReviewMocks: AdminReviewMock[] = [
  {
    id: "review-qimen-upload-1",
    sourceId: "source-qimen-upload-1",
    title: "奇门讲义第一讲审核",
    reviewStatus: "pending",
    riskLevel: "low",
    checklist: [
      { label: "版权状态", ok: true, note: "自有讲义，可进入草稿整理。" },
      { label: "公开范围", ok: true, note: "默认私有，审核后再发布。" },
      { label: "免责声明", ok: false, note: "工具相关段落需补充学习参考口径。" },
    ],
  },
  {
    id: "review-dao-excerpt-1",
    sourceId: "source-dao-excerpt-1",
    title: "庄子选读授权待确认审核",
    reviewStatus: "needs_review",
    riskLevel: "medium",
    checklist: [
      { label: "版权状态", ok: false, note: "仅可短摘、目录和摘要，不得公开全文。" },
      { label: "来源说明", ok: true, note: "已填写来源说明。" },
      { label: "发布状态", ok: true, note: "保持隐藏直到授权确认。" },
    ],
  },
];

export const adminReviewMocks: AdminReviewMock[] = [...baseAdminReviewMocks, ...newUploadReviewMocks];

const pipelineStepLabels: Array<Pick<AdminImportStepMock, "key" | "label">> = [
  { key: "uploaded", label: "已上传" },
  { key: "text_extracted", label: "已抽取文本" },
  { key: "cleaned", label: "已清洗" },
  { key: "chaptered", label: "已分章" },
  { key: "translated", label: "已生成白话" },
  { key: "terms_extracted", label: "已提取术语" },
  { key: "course_drafted", label: "已生成课程草稿" },
  { key: "reviewing", label: "待审核" },
  { key: "published", label: "已发布" },
];

function buildPipelineSteps(doneCount: number, activeIndex: number | null, blockedIndex: number | null = null): AdminImportStepMock[] {
  return pipelineStepLabels.map((step, index) => {
    const status: ImportStepStatus =
      blockedIndex === index ? "blocked" : index < doneCount ? "done" : activeIndex === index ? "active" : "pending";
    return {
      ...step,
      status,
      description: getPipelineStepDescription(step.key, status),
    };
  });
}

function getPipelineStepDescription(step: AdminImportStepMock["key"], status: ImportStepStatus) {
  const descriptionMap: Record<AdminImportStepMock["key"], string> = {
    uploaded: "资料已进入后台，默认私密保存。",
    text_extracted: "文本抽取使用 mock 结果，后续再接真实解析服务。",
    cleaned: "清理页眉页脚、重复空白和明显识别噪声。",
    chaptered: "按标题、页码和语义段落生成章节草稿。",
    translated: "白话稿仅为草稿，必须保留来源证据。",
    terms_extracted: "术语提取后进入术语库待审核。",
    course_drafted: "课程草稿只进入后台，不自动发布。",
    reviewing: "管理员检查版权、来源、注解和免责声明。",
    published: "通过审核后才可进入公开或会员学习区。",
  };

  if (status === "blocked") return "当前节点受版权或质量风险限制，需人工处理。";
  return descriptionMap[step];
}

const baseAdminImportPipelineMocks: AdminImportPipelineMock[] = [
  {
    id: "import-qimen-upload-1",
    sourceId: "source-qimen-upload-1",
    title: "奇门讲义第一讲",
    subject: "qimen",
    copyrightStatus: "self_owned",
    visibility: "private",
    owner: "管理员",
    updatedAt: "2026-07-07T00:00:00.000Z",
    riskNote: "自有讲义，可进入草稿整理；发布前仍需补充学习用途说明。",
    steps: buildPipelineSteps(7, 7),
  },
  {
    id: "import-bazi-classic-1",
    sourceId: "source-bazi-classic-1",
    title: "子平真诠摘录",
    subject: "bazi",
    copyrightStatus: "public_domain",
    visibility: "public",
    owner: "管理员",
    updatedAt: "2026-07-07T00:00:00.000Z",
    riskNote: "公版内容仍需校对 OCR，白话与讲义先进入草稿审核。",
    steps: buildPipelineSteps(1, 1),
  },
  {
    id: "import-liuyao-private-1",
    sourceId: "source-liuyao-private-1",
    title: "六爻案例复盘私有资料",
    subject: "liuyao",
    copyrightStatus: "private_study",
    visibility: "private",
    owner: "管理员",
    updatedAt: "2026-07-07T00:00:00.000Z",
    riskNote: "私密学习资料仅用于后台整理，不得公开全文或案例细节。",
    steps: buildPipelineSteps(6, 6),
  },
  {
    id: "import-dao-excerpt-1",
    sourceId: "source-dao-excerpt-1",
    title: "庄子选读授权待确认",
    subject: "dao",
    copyrightStatus: "excerpt_only",
    visibility: "hidden",
    owner: "管理员",
    updatedAt: "2026-07-07T00:00:00.000Z",
    riskNote: "授权未确认，只能做目录、摘要、短摘索引；不得进入全文发布。",
    steps: buildPipelineSteps(3, null, 4),
  },
];

export const adminImportPipelineMocks: AdminImportPipelineMock[] = [...baseAdminImportPipelineMocks, ...newUploadImportPipelineMocks];

const baseAdminSegmentMocks: AdminSegmentMock[] = [
  {
    id: "segment-qimen-001",
    documentId: "source-qimen-upload-1",
    documentTitle: "奇门讲义第一讲",
    pageLabel: "第 1-2 页",
    chapterTitle: "九宫与用局基础",
    originalText: "九宫者，以洛书为体，分布方隅，以观时空之位次。",
    cleanedText: "九宫以洛书为体，分布于八方与中宫，用来观察时空位置与结构。",
    modernTranslation: "九宫可以理解为一个观察时空和方位的结构框架，用于承载门、星、神、干等信息。",
    notes: ["保留原文出处，白话解释不替代原典。", "后续可关联奇门入门课程第一课。"],
    relatedTerms: ["九宫", "洛书", "中宫"],
    reviewStatus: "pending",
  },
  {
    id: "segment-qimen-002",
    documentId: "source-qimen-upload-1",
    documentTitle: "奇门讲义第一讲",
    pageLabel: "第 3 页",
    chapterTitle: "八门取象",
    originalText: "景门主文书、信息、光明、传播，得生则表达顺畅，受制则多阻滞。",
    cleanedText: "景门主文书、信息、光明与传播。得生时，表达较顺畅；受制时，传播容易受阻。",
    modernTranslation: "在日常应用中，景门常被用来参考表达、汇报、发布、展示等事项，但仍需结合全盘结构判断。",
    notes: ["用语保持参考口径，避免绝对化判断。"],
    relatedTerms: ["景门", "八门", "门迫"],
    reviewStatus: "needs_review",
  },
  {
    id: "segment-bazi-001",
    documentId: "source-bazi-classic-1",
    documentTitle: "子平真诠摘录",
    pageLabel: "第 12 页",
    chapterTitle: "月令提纲",
    originalText: "论命以月令为提纲，察其旺衰，辨其格局。",
    cleanedText: "论命以月令为提纲，观察五行旺衰，并辨别格局。",
    modernTranslation: "八字学习中，月令常作为判断季节气势和结构重点的入口，不宜孤立看单个字。",
    notes: ["原典摘录需确认版本来源。", "课程化前补充公版来源说明。"],
    relatedTerms: ["月令", "旺衰", "格局"],
    reviewStatus: "pending",
  },
  {
    id: "segment-liuyao-001",
    documentId: "source-liuyao-private-1",
    documentTitle: "六爻案例复盘私有资料",
    pageLabel: "案例 04",
    chapterTitle: "用神与动爻",
    originalText: "取用不明，则吉凶难定；动爻发动，须看生克冲合。",
    cleanedText: "若用神不明确，判断倾向就不稳定；动爻发动时，需要观察生克冲合关系。",
    modernTranslation: "六爻分析应先明确问题与用神，再看动爻、月建、日辰等结构，不宜直接给出确定承诺。",
    notes: ["私密案例不能公开具体背景。", "生成课程时应脱敏处理。"],
    relatedTerms: ["用神", "动爻", "月建", "日辰"],
    reviewStatus: "needs_review",
  },
  {
    id: "segment-dao-001",
    documentId: "source-dao-excerpt-1",
    documentTitle: "庄子选读授权待确认",
    pageLabel: "第 6 页",
    chapterTitle: "逍遥游摘记",
    originalText: "节选内容仅作索引占位，授权确认前不展示全文。",
    cleanedText: "授权确认前，仅保留目录、摘要和短摘索引。",
    modernTranslation: "该资料目前只适合做学习索引，不进入公开阅读器。",
    notes: ["保持 hidden。", "不得生成可公开的全文课程。"],
    relatedTerms: ["道家经典", "逍遥", "原文阅读"],
    reviewStatus: "rejected",
  },
];

export const adminSegmentMocks: AdminSegmentMock[] = [...baseAdminSegmentMocks, ...newUploadSegmentMocks];
