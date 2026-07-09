import {
  BookOpen,
  Boxes,
  Brain,
  FileText,
  Gauge,
  KeyRound,
  LibraryBig,
  NotebookTabs,
  ScrollText,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

export type AdminSectionKey =
  | "dashboard"
  | "books"
  | "documents"
  | "imports"
  | "segments"
  | "terms"
  | "knowledge"
  | "lessons"
  | "courses"
  | "qimen-rules"
  | "invites"
  | "users"
  | "reports";

export type AdminNavItem = {
  key: AdminSectionKey;
  label: string;
  href: string;
  description: string;
};

const adminNavItems: AdminNavItem[] = [
  { key: "dashboard", label: "总览", href: "/admin", description: "后台状态与风险提醒" },
  { key: "books", label: "书籍", href: "/admin/books", description: "馆藏与版权状态" },
  { key: "documents", label: "资料", href: "/admin/documents", description: "上传资料与处理状态" },
  { key: "imports", label: "导入", href: "/admin/imports", description: "文本抽取和整理队列" },
  { key: "segments", label: "章节", href: "/admin/segments", description: "页面、章节与片段" },
  { key: "terms", label: "术语", href: "/admin/terms", description: "术语卡与解释" },
  { key: "knowledge", label: "知识点", href: "/admin/knowledge", description: "知识单元与证据" },
  { key: "lessons", label: "课时", href: "/admin/lessons", description: "Lesson 草稿" },
  { key: "courses", label: "课程", href: "/admin/courses", description: "课程结构与发布" },
  { key: "qimen-rules", label: "奇门规则", href: "/admin/qimen-rules", description: "规则引擎 mock" },
  { key: "invites", label: "邀请码", href: "/admin/invites", description: "私域邀请入口" },
  { key: "users", label: "用户", href: "/admin/users", description: "用户与会员状态" },
  { key: "reports", label: "报告", href: "/admin/reports", description: "报告草稿与审核" },
];

const iconMap = {
  dashboard: Gauge,
  books: LibraryBig,
  documents: FileText,
  imports: UploadCloud,
  segments: ScrollText,
  terms: Boxes,
  knowledge: Brain,
  lessons: NotebookTabs,
  courses: BookOpen,
  "qimen-rules": Sparkles,
  invites: KeyRound,
  users: UsersRound,
  reports: ShieldCheck,
} satisfies Record<AdminSectionKey, typeof Gauge>;

export function getAdminNavItems() {
  return adminNavItems;
}

export function getAdminNavItem(key: AdminSectionKey) {
  return adminNavItems.find((item) => item.key === key);
}

export default function AdminSidebar({ activeKey }: { activeKey: AdminSectionKey }) {
  return (
    <aside className="admin-sidebar" aria-label="管理后台导航">
      <Link className="admin-sidebar-brand" href="/admin">
        <span>问古</span>
        <div>
          <strong>管理后台</strong>
          <small>资料整理与审核</small>
        </div>
      </Link>

      <nav>
        {adminNavItems.map((item) => {
          const Icon = iconMap[item.key];
          const active = activeKey === item.key;
          return (
            <Link key={item.key} href={item.href} className={active ? "is-active" : ""} aria-current={active ? "page" : undefined}>
              <Icon aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
