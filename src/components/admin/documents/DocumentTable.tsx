"use client";

import { Eye, FilePlus2, Filter, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import DocumentStatusBadge from "@/components/admin/documents/DocumentStatusBadge";
import DocumentUploadDialog from "@/components/admin/documents/DocumentUploadDialog";
import type { AdminSourceMock } from "@/data/adminMock";
import type { CopyrightStatus, ProcessStatus, ReviewStatus, SourceFileType, SubjectKey } from "@/types/platform";

type SubjectFilter = SubjectKey | "all";
type FileTypeFilter = SourceFileType | "all";
type CopyrightFilter = CopyrightStatus | "all";
type ProcessFilter = ProcessStatus | "all";
type ReviewFilter = ReviewStatus | "all";

const subjectOptions: Array<{ value: SubjectFilter; label: string }> = [
  { value: "all", label: "全部学科" },
  { value: "qimen", label: "奇门" },
  { value: "bazi", label: "八字" },
  { value: "liuyao", label: "六爻" },
  { value: "meihua", label: "梅花" },
  { value: "dao", label: "道家" },
  { value: "yixue", label: "易学基础" },
];

const copyrightOptions: Array<{ value: CopyrightFilter; label: string }> = [
  { value: "all", label: "全部版权" },
  { value: "public_domain", label: "公版" },
  { value: "self_owned", label: "自有" },
  { value: "authorized", label: "授权" },
  { value: "excerpt_only", label: "摘录" },
  { value: "private_study", label: "私密学习" },
  { value: "hidden", label: "隐藏" },
];

const processOptions: Array<{ value: ProcessFilter; label: string }> = [
  { value: "all", label: "全部处理" },
  { value: "pending", label: "待处理" },
  { value: "extracting", label: "抽取中" },
  { value: "processing", label: "处理中" },
  { value: "ready", label: "就绪" },
  { value: "failed", label: "失败" },
];

const reviewOptions: Array<{ value: ReviewFilter; label: string }> = [
  { value: "all", label: "全部审核" },
  { value: "pending", label: "待审核" },
  { value: "needs_review", label: "需复核" },
  { value: "approved", label: "已通过" },
  { value: "rejected", label: "已驳回" },
];

const subjectLabels: Record<SubjectKey, string> = {
  qimen: "奇门",
  bazi: "八字",
  liuyao: "六爻",
  meihua: "梅花",
  dao: "道家",
  yixue: "易学基础",
};

type DocumentTableProps = {
  documents: AdminSourceMock[];
};

export default function DocumentTable({ documents }: DocumentTableProps) {
  const [subject, setSubject] = useState<SubjectFilter>("all");
  const [fileType, setFileType] = useState<FileTypeFilter>("all");
  const [copyrightStatus, setCopyrightStatus] = useState<CopyrightFilter>("all");
  const [processStatus, setProcessStatus] = useState<ProcessFilter>("all");
  const [reviewStatus, setReviewStatus] = useState<ReviewFilter>("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const fileTypeOptions = useMemo(() => {
    const values = Array.from(new Set(documents.map((document) => document.fileType)));
    return [{ value: "all" as FileTypeFilter, label: "全部类型" }, ...values.map((value) => ({ value, label: value.toUpperCase() }))];
  }, [documents]);

  const filteredDocuments = documents.filter((document) => {
    const subjectMatched = subject === "all" || document.subject === subject;
    const fileTypeMatched = fileType === "all" || document.fileType === fileType;
    const copyrightMatched = copyrightStatus === "all" || document.copyrightStatus === copyrightStatus;
    const processMatched = processStatus === "all" || document.processStatus === processStatus;
    const reviewMatched = reviewStatus === "all" || document.reviewStatus === reviewStatus;
    return subjectMatched && fileTypeMatched && copyrightMatched && processMatched && reviewMatched;
  });

  return (
    <section className="document-admin-panel">
      <DocumentUploadDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />

      <div className="document-admin-toolbar">
        <div>
          <span>资料上传后台</span>
          <h2>SourceDocument 列表</h2>
          <p>上传资料默认 `copyrightStatus=private_study`，`visibility=private`。管理员确认版权后才能改变公开范围。</p>
        </div>
        <button type="button" onClick={() => setDialogOpen(true)}>
          <FilePlus2 aria-hidden="true" />
          上传资料
        </button>
      </div>

      <div className="document-copyright-warning">
        <ShieldAlert aria-hidden="true" />
        <p>版权提醒：未授权资料不得公开全文展示，不得提供下载。`excerpt_only` 只展示短摘、目录、摘要、索引。</p>
      </div>

      <div className="document-filter-bar" aria-label="资料筛选">
        <Filter aria-hidden="true" />
        <SelectFilter label="学科" value={subject} onChange={(value) => setSubject(value as SubjectFilter)} options={subjectOptions} />
        <SelectFilter label="文件类型" value={fileType} onChange={(value) => setFileType(value as FileTypeFilter)} options={fileTypeOptions} />
        <SelectFilter label="版权状态" value={copyrightStatus} onChange={(value) => setCopyrightStatus(value as CopyrightFilter)} options={copyrightOptions} />
        <SelectFilter label="处理状态" value={processStatus} onChange={(value) => setProcessStatus(value as ProcessFilter)} options={processOptions} />
        <SelectFilter label="审核状态" value={reviewStatus} onChange={(value) => setReviewStatus(value as ReviewFilter)} options={reviewOptions} />
      </div>

      <div className="document-table-card">
        <div className="document-table-head">
          <span>{filteredDocuments.length} 条资料</span>
          <small>第一阶段仅展示 mock 数据，上传按钮不接真实存储。</small>
        </div>

        <div className="document-table-scroll">
          <table>
            <thead>
              <tr>
                <th>标题</th>
                <th>学科</th>
                <th>文件类型</th>
                <th>版权状态</th>
                <th>可见性</th>
                <th>上传状态</th>
                <th>处理状态</th>
                <th>抽取状态</th>
                <th>AI 草稿状态</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((document) => (
                <tr key={document.id}>
                  <td>
                    <strong>{document.title}</strong>
                    <small>{document.owner}</small>
                  </td>
                  <td>{subjectLabels[document.subject]}</td>
                  <td>{document.fileType.toUpperCase()}</td>
                  <td><DocumentStatusBadge value={document.copyrightStatus} /></td>
                  <td><DocumentStatusBadge value={document.visibility} /></td>
                  <td><DocumentStatusBadge value={document.uploadStatus} /></td>
                  <td><DocumentStatusBadge value={document.processStatus} /></td>
                  <td><DocumentStatusBadge value={document.extractedTextStatus} /></td>
                  <td><DocumentStatusBadge value={document.aiDraftStatus} /></td>
                  <td>{formatDate(document.updatedAt)}</td>
                  <td>
                    <button type="button" className="document-action-button">
                      <Eye aria-hidden="true" />
                      查看
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function SelectFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}
