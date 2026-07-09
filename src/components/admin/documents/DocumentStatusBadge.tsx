import type { AiDraftStatus, CopyrightStatus, ExtractedTextStatus, ProcessStatus, ReviewStatus, UploadStatus, Visibility } from "@/types/platform";

type BadgeValue = CopyrightStatus | Visibility | UploadStatus | ProcessStatus | ExtractedTextStatus | AiDraftStatus | ReviewStatus | string;

type DocumentStatusBadgeProps = {
  value: BadgeValue;
};

const toneMap: Record<string, "default" | "success" | "warning" | "danger"> = {
  public_domain: "success",
  self_owned: "success",
  authorized: "success",
  excerpt_only: "warning",
  private_study: "danger",
  hidden: "danger",
  public: "success",
  members: "warning",
  course: "warning",
  private: "danger",
  uploaded: "success",
  uploading: "warning",
  idle: "default",
  failed: "danger",
  ready: "success",
  processing: "warning",
  extracting: "warning",
  pending: "warning",
  needs_ocr: "warning",
  not_started: "default",
  mock_ready: "success",
  drafting: "warning",
  needs_review: "warning",
  approved: "success",
  rejected: "danger",
};

const labelMap: Record<string, string> = {
  public_domain: "公版",
  self_owned: "自有",
  authorized: "授权",
  excerpt_only: "摘录",
  private_study: "私密学习",
  hidden: "隐藏",
  public: "公开",
  members: "会员",
  course: "课程",
  private: "私密",
  uploaded: "已上传",
  uploading: "上传中",
  idle: "待上传",
  failed: "失败",
  ready: "就绪",
  processing: "处理中",
  extracting: "抽取中",
  pending: "待处理",
  needs_ocr: "需 OCR",
  not_started: "未开始",
  mock_ready: "mock 就绪",
  drafting: "生成中",
  needs_review: "待复核",
  approved: "已通过",
  rejected: "已驳回",
};

export default function DocumentStatusBadge({ value }: DocumentStatusBadgeProps) {
  const key = String(value);
  const tone = toneMap[key] ?? "default";
  const label = labelMap[key] ?? key;

  return <span className={`document-status-badge is-${tone}`}>{label}</span>;
}
