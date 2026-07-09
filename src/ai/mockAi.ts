import type { AiDraft, AiTaskRequest, AiTaskType } from "@/ai/types";
import type { EvidenceRef } from "@/types/platform";

const MOCK_AI_CREATED_AT = "2026-07-07T00:00:00.000Z";

export async function runMockAiTask(request: AiTaskRequest): Promise<AiDraft> {
  return {
    id: buildDraftId(request.taskType, request.sourceDocumentId),
    taskType: request.taskType,
    sourceDocumentId: request.sourceDocumentId,
    sourceSegmentIds: request.sourceSegmentIds,
    input: request.input,
    output: createMockOutput(request),
    evidenceRefs: normalizeEvidenceRefs(request),
    reviewStatus: "pending",
    createdAt: MOCK_AI_CREATED_AT,
  };
}

function createMockOutput(request: AiTaskRequest): Record<string, unknown> {
  const title = String(request.input.sourceTitle ?? "资料草稿");
  const subject = String(request.input.subject ?? "unknown");
  const evidenceRefs = normalizeEvidenceRefs(request);

  switch (request.taskType) {
    case "extract_outline":
      return {
        title: `${title} · 章节提纲草稿`,
        status: "draft",
        chapters: request.sourceSegmentIds.map((segmentId, index) => ({
          title: `第 ${index + 1} 节整理`,
          summary: "根据输入片段生成的章节线索，后续需管理员核对原文和页码。",
          sourceSegmentIds: [segmentId],
          evidenceRefs: evidenceRefs.filter((ref) => ref.segmentId === segmentId),
        })),
      };

    case "clean_text":
      return {
        title: `${title} · 清洗片段草稿`,
        status: "draft",
        segments: request.sourceSegmentIds.map((segmentId, index) => ({
          segmentId,
          cleanedText: `mock 清洗文本 ${index + 1}：保留原意，去除明显噪声，等待人工复核。`,
          evidenceRefs: evidenceRefs.filter((ref) => ref.segmentId === segmentId),
        })),
      };

    case "translate_classical":
    case "explain_plain":
      return {
        title: `${title} · 白话解释草稿`,
        status: "draft",
        paragraphs: request.sourceSegmentIds.map((segmentId, index) => ({
          segmentId,
          plainText: `mock 白话 ${index + 1}：此段用于说明资料中的结构与学习要点，具体应用只作参考。`,
          caution: "涉及术数判断时，应使用参考、倾向、建议等表达。",
          evidenceRefs: evidenceRefs.filter((ref) => ref.segmentId === segmentId),
        })),
      };

    case "extract_terms":
      return {
        title: `${title} · 术语提取草稿`,
        status: "draft",
        terms: [
          {
            name: subject === "qimen" ? "九宫" : "核心术语",
            plainExplanation: "从输入资料中提取的术语草稿，需管理员确认解释边界。",
            tags: ["mock", "待审核"],
            evidenceRefs,
          },
          {
            name: subject === "liuyao" ? "用神" : "结构关系",
            plainExplanation: "用于帮助学习者理解资料中的基础结构，不作为绝对判断。",
            tags: ["mock", "学习参考"],
            evidenceRefs,
          },
        ],
      };

    case "generate_lesson":
      return {
        title: `${title} · 入门课草稿`,
        status: "draft",
        lessons: [
          {
            title: "资料背景与学习目标",
            blocks: ["资料来源说明", "核心概念", "学习边界"],
            evidenceRefs,
          },
          {
            title: "结构拆解与案例提示",
            blocks: ["术语解释", "段落白话", "练习入口"],
            evidenceRefs,
          },
        ],
      };

    case "generate_quiz":
      return {
        title: `${title} · 练习题草稿`,
        status: "draft",
        quizzes: [
          {
            prompt: "本段资料主要说明了哪一类结构或概念？",
            type: "single-choice",
            options: ["基础结构", "绝对预测", "公开下载", "投资建议"],
            answer: "基础结构",
            explanation: "题目只考查输入资料中的学习要点。",
            evidenceRefs,
          },
        ],
      };

    case "generate_flashcards":
      return {
        title: `${title} · 术语卡草稿`,
        status: "draft",
        flashcards: [
          {
            front: "核心概念",
            back: "根据资料片段生成的学习卡片，需管理员审核。",
            evidenceRefs,
          },
        ],
      };

    case "generate_summary":
      return {
        title: `${title} · 摘要草稿`,
        status: "draft",
        summary: "这是一份 mock 摘要，用于概括资料主题、学习价值和版权风险。",
        riskNote: "未授权或私密资料不得自动发布。",
        evidenceRefs,
      };

    case "generate_report":
      return {
        title: `${title} · 报告草稿`,
        status: "draft",
        report: "报告内容仅作传统文化学习与行动参考，不替代专业意见。",
        evidenceRefs,
      };
  }
}

function buildDraftId(taskType: AiTaskType, sourceDocumentId: string) {
  return `mock-${taskType}-${sourceDocumentId}`.replace(/[^a-zA-Z0-9_-]/g, "-");
}

function normalizeEvidenceRefs(request: AiTaskRequest): EvidenceRef[] {
  if (request.evidenceRefs.length > 0) return request.evidenceRefs;
  return request.sourceSegmentIds.map((segmentId) => ({
    sourceId: request.sourceDocumentId,
    segmentId,
  }));
}
