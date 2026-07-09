export type InviteType = "trial" | "monthly" | "yearly" | "course";
export type InviteStatus = "active" | "used_up" | "expired" | "paused";
export type BenefitTier = "free" | "member" | "course";

export interface InviteBenefitTier {
  id: BenefitTier;
  title: string;
  subtitle: string;
  items: string[];
}

export interface InviteCodeMock {
  id: string;
  code: string;
  type: InviteType;
  title: string;
  validDays: number;
  usedCount: number;
  maxUses: number;
  status: InviteStatus;
  createdAt: string;
  expiresAt: string;
  note: string;
}

export interface InviteValidationResult {
  state: "valid" | "invalid" | "used_up" | "expired" | "paused";
  title: string;
  message: string;
  invite?: InviteCodeMock;
  tier: BenefitTier;
}

export const inviteTypeLabels: Record<InviteType, string> = {
  trial: "trial",
  monthly: "monthly",
  yearly: "yearly",
  course: "course",
};

export const inviteTypeNames: Record<InviteType, string> = {
  trial: "体验会员",
  monthly: "月度会员",
  yearly: "年度会员",
  course: "课程用户",
};

export const inviteStatusLabels: Record<InviteStatus, string> = {
  active: "可用",
  used_up: "已用完",
  expired: "已过期",
  paused: "已暂停",
};

export const inviteStatusTone: Record<InviteStatus, "default" | "warning" | "success" | "danger"> = {
  active: "success",
  used_up: "warning",
  expired: "danger",
  paused: "default",
};

export const memberBenefitTiers: InviteBenefitTier[] = [
  {
    id: "free",
    title: "免费用户",
    subtitle: "公开阅读和基础学习入口",
    items: ["阅读公开古籍", "查看术语", "学习免费课程", "今日气机简版", "每日一次一事择时 mock"],
  },
  {
    id: "member",
    title: "会员用户",
    subtitle: "完整课程、工具和个人书斋能力",
    items: ["完整课程", "奇门工具完整功能", "报告生成", "笔记和收藏", "高级术语", "未来 7 天择时，先做占位"],
  },
  {
    id: "course",
    title: "课程用户",
    subtitle: "围绕课程交付的学习闭环",
    items: ["专属讲义", "案例库", "作业", "老师点评，先做占位"],
  },
];

export const inviteCodeMocks: InviteCodeMock[] = [
  {
    id: "invite-trial-001",
    code: "WENGU-TRIAL-7",
    type: "trial",
    title: "7 天体验会员",
    validDays: 7,
    usedCount: 3,
    maxUses: 30,
    status: "active",
    createdAt: "2026-07-08",
    expiresAt: "2026-07-15",
    note: "用于内测体验完整会员入口。",
  },
  {
    id: "invite-monthly-001",
    code: "WENGU-MONTH-30",
    type: "monthly",
    title: "月度会员",
    validDays: 30,
    usedCount: 8,
    maxUses: 50,
    status: "active",
    createdAt: "2026-07-08",
    expiresAt: "2026-08-07",
    note: "用于私域月度会员转化测试。",
  },
  {
    id: "invite-yearly-001",
    code: "WENGU-YEAR-365",
    type: "yearly",
    title: "年度会员",
    validDays: 365,
    usedCount: 12,
    maxUses: 120,
    status: "active",
    createdAt: "2026-07-08",
    expiresAt: "2027-07-08",
    note: "用于年度会员权益展示。",
  },
  {
    id: "invite-course-001",
    code: "WENGU-COURSE-180",
    type: "course",
    title: "课程用户",
    validDays: 180,
    usedCount: 5,
    maxUses: 25,
    status: "active",
    createdAt: "2026-07-08",
    expiresAt: "2027-01-04",
    note: "用于课程班学员入口。",
  },
  {
    id: "invite-used-001",
    code: "WENGU-USED",
    type: "trial",
    title: "已用完体验码",
    validDays: 7,
    usedCount: 20,
    maxUses: 20,
    status: "used_up",
    createdAt: "2026-07-01",
    expiresAt: "2026-07-08",
    note: "用于展示已达使用上限状态。",
  },
  {
    id: "invite-paused-001",
    code: "WENGU-PAUSED",
    type: "monthly",
    title: "暂停发放月卡",
    validDays: 30,
    usedCount: 2,
    maxUses: 20,
    status: "paused",
    createdAt: "2026-07-03",
    expiresAt: "2026-08-02",
    note: "用于展示人工暂停状态。",
  },
];

export function tierForInviteType(type: InviteType): BenefitTier {
  return type === "course" ? "course" : "member";
}

export function validateMockInviteCode(input: string): InviteValidationResult {
  const normalized = input.trim().toUpperCase();

  if (!normalized) {
    return {
      state: "invalid",
      title: "请输入邀请码",
      message: "当前为 mock 验证，不会请求真实后台。",
      tier: "free",
    };
  }

  const invite = inviteCodeMocks.find((item) => item.code === normalized);

  if (!invite) {
    return {
      state: "invalid",
      title: "未匹配到邀请码",
      message: "mock 数据中没有这个邀请码，暂时保持免费用户权益。",
      tier: "free",
    };
  }

  const tier = tierForInviteType(invite.type);

  if (invite.status === "used_up" || invite.usedCount >= invite.maxUses) {
    return {
      state: "used_up",
      title: "邀请码已达到使用上限",
      message: "该邀请码已用完，第一阶段仅展示状态，不做真实扣减。",
      invite,
      tier: "free",
    };
  }

  if (invite.status === "expired") {
    return {
      state: "expired",
      title: "邀请码已过期",
      message: "请更换新的邀请码。当前仅为 mock 状态展示。",
      invite,
      tier: "free",
    };
  }

  if (invite.status === "paused") {
    return {
      state: "paused",
      title: "邀请码已暂停",
      message: "该邀请码暂时不可用，需管理员重新启用。",
      invite,
      tier: "free",
    };
  }

  return {
    state: "valid",
    title: "验证通过",
    message: `${invite.title} mock 权益可用，有效 ${invite.validDays} 天。`,
    invite,
    tier,
  };
}
