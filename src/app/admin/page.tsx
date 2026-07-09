import type { Metadata } from "next";
import { AlertTriangle, BookOpen, FileText, GraduationCap, LibraryBig, ScrollText, ShieldAlert, UploadCloud, UsersRound, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";
import StatCard from "@/components/admin/StatCard";
import { adminReviewMocks, adminSourceMocks, type AdminReviewMock, type AdminSourceMock } from "@/data/adminMock";
import { platformMockBooks } from "@/data/books";
import { courses } from "@/data/courses";
import { terms } from "@/data/terms";

export const metadata: Metadata = {
  title: "管理后台 | 问古书斋",
  description: "问古书斋管理后台基础框架。",
};

const mockUserCount = 128;

const sourceColumns: DataTableColumn<AdminSourceMock>[] = [
  { key: "title", header: "资料", render: (row) => <strong>{row.title}</strong> },
  { key: "type", header: "类型", render: (row) => row.fileType.toUpperCase() },
  { key: "copyright", header: "版权", render: (row) => <StatusPill>{row.copyrightStatus}</StatusPill> },
  { key: "process", header: "处理", render: (row) => <StatusPill>{row.processStatus}</StatusPill> },
  { key: "review", header: "审核", render: (row) => <StatusPill>{row.reviewStatus}</StatusPill> },
];

const reviewColumns: DataTableColumn<AdminReviewMock>[] = [
  { key: "title", header: "草稿", render: (row) => <strong>{row.title}</strong> },
  { key: "status", header: "审核状态", render: (row) => <StatusPill>{row.reviewStatus}</StatusPill> },
  { key: "risk", header: "风险", render: (row) => <StatusPill tone={row.riskLevel === "high" ? "danger" : row.riskLevel === "medium" ? "warning" : "success"}>{row.riskLevel}</StatusPill> },
  { key: "check", header: "检查项", render: (row) => `${row.checklist.filter((item) => item.ok).length}/${row.checklist.length} 已通过` },
];

export default function AdminPage() {
  const pendingSources = adminSourceMocks.filter((source) => source.processStatus !== "ready").length;
  const pendingReviews = adminReviewMocks.filter((review) => review.reviewStatus !== "approved").length;

  return (
    <AdminLayout activeKey="dashboard" title="管理后台" description="第一阶段为静态后台 UI，使用 mock 数据展示资料、草稿和合规状态。" breadcrumbs={["管理后台", "总览"]}>
      <section className="admin-stat-grid" aria-label="后台状态统计">
        <StatCard label="资料数量" value={adminSourceMocks.length} note="上传资料 mock" icon={FileText} />
        <StatCard label="待整理资料" value={pendingSources} note="处理中或待 OCR" icon={UploadCloud} tone={pendingSources > 0 ? "warning" : "success"} />
        <StatCard label="待审核草稿" value={pendingReviews} note="需管理员确认" icon={AlertTriangle} tone="warning" />
        <StatCard label="已发布课程" value={courses.filter((course) => course.isPublished).length} note="课程 mock" icon={GraduationCap} tone="success" />
        <StatCard label="术语数量" value={terms.length} note="术语库条目" icon={ScrollText} />
        <StatCard label="用户数量" value={mockUserCount} note="用户 mock" icon={UsersRound} />
      </section>

      <section className="admin-dashboard-grid">
        <DataTable title="最近上传" description="资料默认不公开，审核后再进入学习系统。" columns={sourceColumns} rows={adminSourceMocks.slice(0, 4)} />
        <DataTable title="最近生成草稿" description="AI 整理草稿需管理员审核后才能发布。" columns={reviewColumns} rows={adminReviewMocks} />
      </section>

      <section className="admin-risk-panel">
        <ShieldAlert aria-hidden="true" />
        <div>
          <span>风险提醒</span>
          <h2>未授权资料不得公开</h2>
          <p>所有上传资料默认不公开。`excerpt_only`、`private_study`、`hidden` 状态的资料不得开放全文展示，也不得提供下载入口。</p>
        </div>
      </section>

      <section className="admin-quick-grid" aria-label="快速入口">
        <QuickLink href="/admin/books" title="书籍管理" icon={LibraryBig} count={platformMockBooks.length} />
        <QuickLink href="/admin/documents" title="资料管理" icon={BookOpen} count={adminSourceMocks.length} />
        <QuickLink href="/admin/courses" title="课程管理" icon={GraduationCap} count={courses.length} />
      </section>
    </AdminLayout>
  );
}

function StatusPill({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "warning" | "success" | "danger" }) {
  return <span className={`admin-status-pill is-${tone}`}>{children}</span>;
}

function QuickLink({ href, title, icon: Icon, count }: { href: string; title: string; icon: LucideIcon; count: number }) {
  return (
    <a className="admin-quick-link" href={href}>
      <Icon aria-hidden="true" />
      <span>{title}</span>
      <strong>{count}</strong>
    </a>
  );
}
