import { FileText, ShieldAlert, Sparkles } from "lucide-react";
import DocumentStatusBadge from "@/components/admin/documents/DocumentStatusBadge";
import ImportStatusTimeline from "@/components/admin/imports/ImportStatusTimeline";
import type { AdminImportPipelineMock } from "@/data/adminMock";
import type { SubjectKey } from "@/types/platform";

type ImportPipelineProps = {
  imports: AdminImportPipelineMock[];
};

const subjectLabels: Record<SubjectKey, string> = {
  qimen: "奇门",
  bazi: "八字",
  liuyao: "六爻",
  meihua: "梅花",
  dao: "道家",
  yixue: "易学基础",
};

export default function ImportPipeline({ imports }: ImportPipelineProps) {
  const waitingReviewCount = imports.filter((item) => item.steps.some((step) => step.key === "reviewing" && step.status === "active")).length;
  const blockedCount = imports.filter((item) => item.steps.some((step) => step.status === "blocked")).length;

  return (
    <section className="import-admin-panel">
      <div className="import-admin-intro">
        <div>
          <span>资料整理草稿后台</span>
          <h2>导入处理流程</h2>
          <p>每份资料从上传、抽取、清洗、分章到课程草稿，都先进入后台草稿；管理员审核后才允许发布。</p>
        </div>
        <div className="import-summary">
          <strong>{imports.length}</strong>
          <span>资料队列</span>
          <strong>{waitingReviewCount}</strong>
          <span>待审核</span>
          <strong>{blockedCount}</strong>
          <span>受限项</span>
        </div>
      </div>

      <div className="import-ai-warning">
        <Sparkles aria-hidden="true" />
        <p>当前为 mock 流程，不接真实 AI。白话翻译、术语提取、课程草稿只展示草稿状态，不自动发布。</p>
      </div>

      <div className="import-pipeline-grid">
        {imports.map((item) => (
          <article key={item.id} className="import-pipeline-card">
            <header>
              <div>
                <span>{subjectLabels[item.subject]}</span>
                <h3>{item.title}</h3>
                <p>负责人：{item.owner} · 更新：{formatDate(item.updatedAt)}</p>
              </div>
              <FileText aria-hidden="true" />
            </header>

            <div className="import-pipeline-meta">
              <DocumentStatusBadge value={item.copyrightStatus} />
              <DocumentStatusBadge value={item.visibility} />
            </div>

            <ImportStatusTimeline steps={item.steps} />

            <footer>
              <ShieldAlert aria-hidden="true" />
              <p>{item.riskNote}</p>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}
