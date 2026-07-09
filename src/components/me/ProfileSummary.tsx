import Link from "next/link";
import { BookMarked, Crown, Settings, UserRound } from "lucide-react";
import type { Membership, UserProfile } from "@/types/user";

const meNavItems = [
  { label: "总览", href: "/me" },
  { label: "藏书", href: "/me/books" },
  { label: "笔记", href: "/me/notes" },
  { label: "进度", href: "/me/progress" },
  { label: "排盘", href: "/me/charts" },
  { label: "报告", href: "/me/reports" },
  { label: "上传", href: "/me/uploads" },
  { label: "设置", href: "/me/settings" },
];

const planLabel: Record<Membership["plan"], string> = {
  free: "免费用户",
  member: "会员用户",
  course: "课程学员",
  consultant: "咨询师",
  admin: "管理员",
};

interface ProfileSummaryProps {
  user: UserProfile;
  membership: Membership;
  learningDays: string;
  readingProgress: string;
  compact?: boolean;
}

export default function ProfileSummary({ user, membership, learningDays, readingProgress, compact = false }: ProfileSummaryProps) {
  return (
    <section className={`me-profile-summary ${compact ? "is-compact" : ""}`}>
      <div className="me-profile-main">
        <div className="me-profile-avatar" aria-hidden="true">
          <UserRound />
        </div>
        <div>
          <span>我的书斋 · 用户名</span>
          <h1>{user.nickname}</h1>
          <p>第一阶段使用 mock 用户，用于验证学习进度、笔记、收藏、报告和上传资料的书斋骨架。</p>
        </div>
      </div>

      <div className="me-profile-meta" aria-label="用户状态">
        <div>
          <Crown aria-hidden="true" />
          <span>会员状态</span>
          <strong>{planLabel[membership.plan]}</strong>
        </div>
        <div>
          <BookMarked aria-hidden="true" />
          <span>学习天数</span>
          <strong>{learningDays}</strong>
        </div>
        <div>
          <Settings aria-hidden="true" />
          <span>阅读进度</span>
          <strong>{readingProgress}</strong>
        </div>
      </div>

      <nav className="me-profile-nav" aria-label="我的书斋导航">
        {meNavItems.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </section>
  );
}
