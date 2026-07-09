import type { Metadata } from "next";
import { CheckCircle2, Clock3, FileText, ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { getAdminNavItem, getAdminNavItems, type AdminSectionKey } from "@/components/admin/AdminSidebar";
import DocumentTable from "@/components/admin/documents/DocumentTable";
import ImportPipeline from "@/components/admin/imports/ImportPipeline";
import SegmentReviewTable from "@/components/admin/segments/SegmentReviewTable";
import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";
import StatCard from "@/components/admin/StatCard";
import { adminImportPipelineMocks, adminReviewMocks, adminSegmentMocks, adminSourceMocks } from "@/data/adminMock";
import { platformMockBooks } from "@/data/books";
import { courses, lessons } from "@/data/courses";
import { terms } from "@/data/terms";

type AdminSubSectionKey = Exclude<AdminSectionKey, "dashboard" | "invites">;

type AdminRow = {
  name: string;
  type: string;
  status: string;
  owner: string;
  note: string;
};

const adminSubSections = getAdminNavItems().filter(
  (item): item is ReturnType<typeof getAdminNavItems>[number] & { key: AdminSubSectionKey } => item.key !== "dashboard" && item.key !== "invites",
);

export const dynamicParams = false;

export function generateStaticParams() {
  return adminSubSections.map((item) => ({ section: item.key }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section } = await params;
  const navItem = isAdminSubSection(section) ? getAdminNavItem(section) : null;

  if (!navItem) {
    return {
      title: "后台页面不存在 | 问古书斋",
      description: "该后台页面不存在。",
    };
  }

  return {
    title: `${navItem.label} | 管理后台 | 问古书斋`,
    description: navItem.description,
  };
}

const columns: DataTableColumn<AdminRow>[] = [
  { key: "name", header: "名称", render: (row) => <strong>{row.name}</strong> },
  { key: "type", header: "类型", render: (row) => row.type },
  { key: "status", header: "状态", render: (row) => <StatusPill tone={getStatusTone(row.status)}>{row.status}</StatusPill> },
  { key: "owner", header: "负责人", render: (row) => row.owner },
  { key: "note", header: "说明", render: (row) => row.note },
];

export default async function AdminSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;

  if (!isAdminSubSection(section)) {
    notFound();
  }

  const navItem = getAdminNavItem(section);

  if (!navItem) {
    notFound();
  }

  if (section === "documents") {
    return (
      <AdminLayout activeKey={section} title="资料" description="上传资料、版权状态、处理状态与审核状态。" breadcrumbs={["管理后台", "资料"]}>
        <DocumentTable documents={adminSourceMocks} />
      </AdminLayout>
    );
  }

  if (section === "imports") {
    return (
      <AdminLayout activeKey={section} title="导入" description="资料抽取、清洗、分章、白话、术语与课程草稿流程。" breadcrumbs={["管理后台", "导入"]}>
        <ImportPipeline imports={adminImportPipelineMocks} />
      </AdminLayout>
    );
  }

  if (section === "segments") {
    return (
      <AdminLayout activeKey={section} title="章节" description="资料片段、原文清洗、白话翻译、注解与审核。" breadcrumbs={["管理后台", "章节"]}>
        <SegmentReviewTable segments={adminSegmentMocks} />
      </AdminLayout>
    );
  }

  const rows = getRows(section);
  const pendingCount = rows.filter((row) => row.status.includes("待") || row.status.includes("needs") || row.status.includes("pending")).length;
  const readyCount = rows.filter((row) => row.status.includes("已") || row.status.includes("ready") || row.status.includes("published")).length;
  const riskCount = rows.filter((row) => row.note.includes("不得公开") || row.note.includes("授权") || row.status.includes("hidden")).length;

  return (
    <AdminLayout activeKey={section} title={navItem.label} description={navItem.description} breadcrumbs={["管理后台", navItem.label]}>
      <section className="admin-stat-grid is-compact" aria-label={`${navItem.label}统计`}>
        <StatCard label="总数" value={rows.length} note={`${navItem.label} mock 数据`} icon={FileText} />
        <StatCard label="待处理" value={pendingCount} note="需继续整理或审核" icon={Clock3} tone={pendingCount > 0 ? "warning" : "success"} />
        <StatCard label="可用项" value={readyCount} note="可进入下一步流程" icon={CheckCircle2} tone="success" />
        <StatCard label="风险项" value={riskCount} note="需保持隐藏或补授权" icon={ShieldAlert} tone={riskCount > 0 ? "danger" : "default"} />
      </section>

      <DataTable title={`${navItem.label}列表`} description="第一阶段为静态 UI 和 mock 数据，后续接入 Prisma + PostgreSQL。" columns={columns} rows={rows} />

      <section className="admin-section-note">
        <ShieldAlert aria-hidden="true" />
        <p>后台生成的翻译、注解、课程和报告必须先进入草稿状态，管理员审核后才能发布；未授权资料不得公开全文展示。</p>
      </section>
    </AdminLayout>
  );
}

function isAdminSubSection(section: string): section is AdminSubSectionKey {
  return adminSubSections.some((item) => item.key === section);
}

function StatusPill({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "warning" | "success" | "danger" }) {
  return <span className={`admin-status-pill is-${tone}`}>{children}</span>;
}

function getStatusTone(status: string): "default" | "warning" | "success" | "danger" {
  if (status.includes("未授权") || status.includes("hidden") || status.includes("private") || status.includes("风险")) return "danger";
  if (status.includes("待") || status.includes("needs") || status.includes("pending")) return "warning";
  if (status.includes("已") || status.includes("ready") || status.includes("published")) return "success";
  return "default";
}

function getRows(section: AdminSubSectionKey): AdminRow[] {
  const rowMap: Record<AdminSubSectionKey, AdminRow[]> = {
    books: platformMockBooks.map((book) => ({
      name: book.title,
      type: book.category,
      status: book.isPublished ? "已发布" : "待审核",
      owner: book.author,
      note: `${book.copyrightStatus} / ${book.visibility}`,
    })),
    documents: adminSourceMocks.map((source) => ({
      name: source.title,
      type: source.fileType.toUpperCase(),
      status: source.processStatus,
      owner: source.owner,
      note: `${source.copyrightStatus} / ${source.visibility}`,
    })),
    imports: adminSourceMocks.map((source) => ({
      name: source.title,
      type: "文本抽取",
      status: source.extractedTextStatus,
      owner: source.owner,
      note: `AI 草稿：${source.aiDraftStatus}`,
    })),
    segments: adminSourceMocks.map((source, index) => ({
      name: `${source.title} - 第 ${index + 1} 组片段`,
      type: "SourceSegment",
      status: source.reviewStatus,
      owner: source.owner,
      note: "页面、章节、原文、白话与 evidence 后续接入。",
    })),
    terms: terms.slice(0, 14).map((term) => ({
      name: term.name,
      type: term.category,
      status: term.visibility,
      owner: "术语库",
      note: term.plainExplanation,
    })),
    knowledge: [
      { name: "九宫八门基础", type: "KnowledgeUnit", status: "draft", owner: "管理员", note: "关联奇门入门课与术语卡。" },
      { name: "八字十神关系", type: "KnowledgeUnit", status: "draft", owner: "管理员", note: "后续接 evidence 来源片段。" },
      { name: "六爻用神取法", type: "KnowledgeUnit", status: "needs_review", owner: "管理员", note: "需补充案例边界和免责声明。" },
    ],
    lessons: lessons.slice(0, 12).map((lesson) => ({
      name: lesson.title,
      type: lesson.subject,
      status: lesson.visibility,
      owner: "课程组",
      note: `预计 ${lesson.estimatedMinutes} 分钟 / ${lesson.blocks.length} 个内容块`,
    })),
    courses: courses.map((course) => ({
      name: course.title,
      type: course.subject,
      status: course.isPublished ? "published" : "draft",
      owner: "课程组",
      note: course.subtitle,
    })),
    "qimen-rules": [
      { name: "九宫基础映射", type: "ToolRule", status: "mock_ready", owner: "规则组", note: "只做 UI mock，不接真实排盘算法。" },
      { name: "今日气机评分", type: "ToolRule", status: "draft", owner: "规则组", note: "需后续由明确规则引擎输出。" },
      { name: "一事择时提示语", type: "ToolRule", status: "needs_review", owner: "规则组", note: "必须使用参考、倾向、建议等稳妥表达。" },
    ],
    users: [
      { name: "游客用户", type: "UserProfile", status: "mock", owner: "系统", note: "浏览公开页面。" },
      { name: "注册用户", type: "UserProfile", status: "mock", owner: "系统", note: "后续保存笔记、收藏和进度。" },
      { name: "管理员", type: "UserProfile", status: "mock", owner: "系统", note: "后续接真实登录与权限。" },
    ],
    reports: adminReviewMocks.map((review) => ({
      name: review.title.replace("审核", "报告草稿"),
      type: "Report",
      status: review.reviewStatus,
      owner: "管理员",
      note: review.riskLevel === "medium" ? "存在授权风险，不得公开。" : "需审核后发布。",
    })),
  };

  return rowMap[section];
}
