import type { Bookmark, Note, StudyProgress } from "@/types/learning";
import type { SubjectKey } from "@/types/platform";
import type { Membership, UserProfile, UserReport, UserUpload } from "@/types/user";

const userMockTime = "2026-07-07T08:00:00.000Z";

export type MeNoteType = "读书笔记" | "课程笔记" | "盘局笔记";

export interface MeRecentItem {
  id: string;
  title: string;
  meta: string;
  description: string;
  href: string;
  status?: string;
  progressPercent?: number;
  timeLabel?: string;
}

export interface MeSubjectProgress {
  id: string;
  subject: SubjectKey;
  subjectName: string;
  progressPercent: number;
  completedLessons: number;
  totalLessons: number;
  currentFocus: string;
  nextAction: string;
  href: string;
  updatedAt: string;
}

export interface MeNote extends Note {
  noteType: MeNoteType;
  sourceLabel: string;
  href: string;
}

export interface MeReport extends UserReport {
  reportTypeLabel: string;
  summary: string;
  href: string;
}

export interface MeChartRecord {
  id: string;
  title: string;
  question: string;
  chartTime: string;
  level: "学习盘" | "择时参考" | "复盘记录";
  summary: string;
  href: string;
}

export interface MeUpload extends UserUpload {
  subjectName: string;
  note: string;
}

export interface MeSettingGroup {
  id: string;
  title: string;
  description: string;
  items: {
    label: string;
    value: string;
    helper: string;
  }[];
}

export const mockUserProfile: UserProfile = {
  id: "user-mock-001",
  nickname: "书斋学员",
  avatarUrl: "",
  email: "student@example.com",
  role: "member",
  createdAt: "2026-06-10T08:00:00.000Z",
  updatedAt: userMockTime,
};

export const mockMembership: Membership = {
  id: "membership-mock-001",
  userId: mockUserProfile.id,
  plan: "member",
  status: "active",
  startedAt: "2026-06-10T08:00:00.000Z",
  expiresAt: "2026-12-31T23:59:59.000Z",
  benefits: ["古籍阅读记录", "课程学习进度", "报告草稿保存", "排盘复盘记录"],
};

export const meDashboardStats = [
  { id: "learning-days", label: "学习天数", value: "28 天", helper: "连续记录 6 天" },
  { id: "reading-progress", label: "阅读进度", value: "46%", helper: "本周读完 3 节" },
  { id: "notes", label: "我的笔记", value: "18 条", helper: "含读书、课程、盘局" },
  { id: "reports", label: "报告草稿", value: "5 份", helper: "均为私密保存" },
];

export const meRecentReadingItems: MeRecentItem[] = [
  {
    id: "recent-book-qimen",
    title: "奇门入门正义",
    meta: "奇门遁甲 · 第 2 章",
    description: "正在阅读九宫与八门的基础结构。",
    href: "/book/qimen-ru-men-zheng-yi/read",
    status: "继续阅读",
    progressPercent: 42,
    timeLabel: "今天 08:20",
  },
  {
    id: "recent-book-daodejing",
    title: "道德经",
    meta: "道家经典 · 第 8 章",
    description: "记录“上善若水”的章句札记。",
    href: "/book/daodejing-public-domain/read",
    status: "原典短读",
    progressPercent: 31,
    timeLabel: "昨天 21:10",
  },
  {
    id: "recent-book-bazi",
    title: "八字阴阳五行讲义",
    meta: "八字命理 · 五行基础",
    description: "复习五行生克与十神入门。",
    href: "/book/bazi-yinyang-wuxing/read",
    status: "复习",
    progressPercent: 58,
    timeLabel: "7 月 5 日",
  },
];

export const meFavoriteBooks: MeRecentItem[] = [
  {
    id: "fav-book-qimen",
    title: "奇门入门正义",
    meta: "奇门遁甲 · 自有讲义",
    description: "适合建立九宫、八门、九星、八神的基础骨架。",
    href: "/book/qimen-ru-men-zheng-yi",
    status: "已收藏",
  },
  {
    id: "fav-book-ziping",
    title: "子平真诠研读",
    meta: "八字命理 · 公版原典",
    description: "围绕月令、格局和用神做进阶研读。",
    href: "/book/ziping-zhenquan-study",
    status: "已收藏",
  },
  {
    id: "fav-book-meihua",
    title: "梅花易数入门",
    meta: "梅花易数 · 入门",
    description: "练习象数、体用、触机和案例复盘。",
    href: "/book/meihua-yishu-intro",
    status: "已收藏",
  },
];

export const meRecentCourseItems: MeRecentItem[] = [
  {
    id: "course-qimen",
    title: "奇门入门",
    meta: "课时 2 / 4",
    description: "下一课：值符值使。",
    href: "/courses/qimen-intro-course",
    status: "继续学习",
    progressPercent: 50,
    timeLabel: "今天",
  },
  {
    id: "course-bazi",
    title: "八字基础",
    meta: "课时 3 / 4",
    description: "当前重点：十神关系与月令旺衰。",
    href: "/courses/bazi-intro-course",
    status: "复习",
    progressPercent: 75,
    timeLabel: "7 月 6 日",
  },
  {
    id: "course-dao",
    title: "道家经典导读",
    meta: "课时 1 / 4",
    description: "从道与名进入原文慢读。",
    href: "/courses/dao-intro-course",
    status: "刚开始",
    progressPercent: 25,
    timeLabel: "7 月 4 日",
  },
];

export const meStudyProgress: StudyProgress[] = [
  {
    id: "progress-qimen-course",
    userId: mockUserProfile.id,
    courseId: "qimen-intro-course",
    lessonId: "qimen-lesson-2",
    subject: "qimen",
    progressPercent: 50,
    completedLessonIds: ["qimen-lesson-1", "qimen-lesson-2"],
    lastStudiedAt: userMockTime,
  },
  {
    id: "progress-bazi-course",
    userId: mockUserProfile.id,
    courseId: "bazi-intro-course",
    lessonId: "bazi-lesson-3",
    subject: "bazi",
    progressPercent: 75,
    completedLessonIds: ["bazi-lesson-1", "bazi-lesson-2", "bazi-lesson-3"],
    lastStudiedAt: "2026-07-06T20:30:00.000Z",
  },
];

export const meSubjectProgress: MeSubjectProgress[] = [
  {
    id: "subject-progress-qimen",
    subject: "qimen",
    subjectName: "奇门遁甲",
    progressPercent: 64,
    completedLessons: 7,
    totalLessons: 12,
    currentFocus: "九宫、八门与一事择时",
    nextAction: "复盘两条择时记录，写明用神和宫位。",
    href: "/subjects/qimen",
    updatedAt: "今天 08:20",
  },
  {
    id: "subject-progress-bazi",
    subject: "bazi",
    subjectName: "八字命理",
    progressPercent: 48,
    completedLessons: 5,
    totalLessons: 13,
    currentFocus: "月令、十神与旺衰",
    nextAction: "用案例记录月令和气势，不作现实断语。",
    href: "/subjects/bazi",
    updatedAt: "昨天 21:10",
  },
  {
    id: "subject-progress-liuyao",
    subject: "liuyao",
    subjectName: "六爻纳甲",
    progressPercent: 32,
    completedLessons: 4,
    totalLessons: 15,
    currentFocus: "世应、六亲与用神",
    nextAction: "先明所问，再练习取用神。",
    href: "/subjects/liuyao",
    updatedAt: "7 月 5 日",
  },
  {
    id: "subject-progress-dao",
    subject: "dao",
    subjectName: "道家经典",
    progressPercent: 27,
    completedLessons: 3,
    totalLessons: 10,
    currentFocus: "道德经短读与白话札记",
    nextAction: "保持一章原文、一段白话、一条日用札记。",
    href: "/subjects/dao",
    updatedAt: "7 月 4 日",
  },
];

export const meNotes: MeNote[] = [
  {
    id: "note-reading-jingmen",
    userId: mockUserProfile.id,
    title: "景门与内容发布的表达边界",
    body: "景门可作为传播、展示、文书的参考象，但仍要结合门星神干和现实发布条件。",
    noteType: "读书笔记",
    sourceLabel: "奇门入门正义 · 八门象意",
    sourceSegmentId: "segment-qimen-002",
    tags: ["奇门", "景门", "内容发布"],
    href: "/book/qimen-ru-men-zheng-yi/read",
    createdAt: "2026-07-07T08:30:00.000Z",
    updatedAt: "2026-07-07T08:30:00.000Z",
  },
  {
    id: "note-course-yueling",
    userId: mockUserProfile.id,
    title: "月令不是单个标签",
    body: "月令要和季节气势、寒暖燥湿、透干和全局流通一起看，不能只背术语名。",
    noteType: "课程笔记",
    sourceLabel: "八字基础 · 月令与旺衰",
    lessonId: "bazi-lesson-4",
    tags: ["八字", "月令", "旺衰"],
    href: "/courses/bazi-intro-course/lessons/bazi-lesson-4",
    createdAt: "2026-07-06T21:12:00.000Z",
    updatedAt: "2026-07-06T21:12:00.000Z",
  },
  {
    id: "note-chart-review",
    userId: mockUserProfile.id,
    title: "一事择时复盘记录",
    body: "今日盘只作参考。实际行动前仍需确认版权、发布范围和文案语气，复盘时记录反馈。",
    noteType: "盘局笔记",
    sourceLabel: "一事择时 mock 盘",
    tags: ["奇门", "择时", "复盘"],
    href: "/qimen/select-time",
    createdAt: "2026-07-05T10:20:00.000Z",
    updatedAt: "2026-07-05T10:20:00.000Z",
  },
];

export const meBookmarks: Bookmark[] = [
  {
    id: "bookmark-term-yueling",
    userId: mockUserProfile.id,
    targetType: "term",
    targetId: "yueling",
    title: "月令",
    createdAt: "2026-07-06T21:00:00.000Z",
  },
  {
    id: "bookmark-course-qimen",
    userId: mockUserProfile.id,
    targetType: "course",
    targetId: "qimen-intro-course",
    title: "奇门入门",
    createdAt: "2026-07-05T09:00:00.000Z",
  },
  {
    id: "bookmark-book-daodejing",
    userId: mockUserProfile.id,
    targetType: "book",
    targetId: "daodejing-public-domain",
    title: "道德经",
    createdAt: "2026-07-04T19:30:00.000Z",
  },
];

export const meBookmarkItems: MeRecentItem[] = meBookmarks.map((bookmark) => ({
  id: bookmark.id,
  title: bookmark.title,
  meta: bookmark.targetType === "book" ? "收藏书籍" : bookmark.targetType === "course" ? "收藏课程" : "收藏术语",
  description: "已保存到我的书斋，后续可从这里继续阅读或复习。",
  href:
    bookmark.targetType === "book"
      ? `/book/${bookmark.targetId}`
      : bookmark.targetType === "course"
        ? `/courses/${bookmark.targetId}`
        : `/terms/${bookmark.targetId}`,
  status: "已收藏",
}));

export const meChartRecords: MeChartRecord[] = [
  {
    id: "chart-record-today",
    title: "今日学习节奏参考",
    question: "今天适合整理课程还是发布内容？",
    chartTime: "2026-07-07 09:00",
    level: "学习盘",
    summary: "结构显示更适合整理资料、校对文本和复盘旧案例；外部发布建议多做确认。",
    href: "/qimen/chart",
  },
  {
    id: "chart-record-select-time",
    title: "课程发布择时参考",
    question: "本周课程预告何时发布较合适？",
    chartTime: "2026-07-05 10:00",
    level: "择时参考",
    summary: "推荐先发布价值内容，再引导咨询；标题宜稳，不作效果承诺。",
    href: "/qimen/select-time",
  },
  {
    id: "chart-record-review",
    title: "沟通复盘记录",
    question: "一次客户沟通后的复盘",
    chartTime: "2026-07-02 16:00",
    level: "复盘记录",
    summary: "记录当时门星神干和实际反馈，用于后续学习，不替代现实沟通判断。",
    href: "/me/charts",
  },
];

export const meChartRecentItems: MeRecentItem[] = meChartRecords.map((record) => ({
  id: record.id,
  title: record.title,
  meta: `${record.level} · ${record.chartTime}`,
  description: record.summary,
  href: record.href,
  status: "查看记录",
}));

export const meReports: MeReport[] = [
  {
    id: "user-report-qimen-today",
    userId: mockUserProfile.id,
    title: "今日气机学习报告",
    reportType: "qimen",
    reportTypeLabel: "今日气机",
    status: "ready",
    visibility: "private",
    reportId: "qimen-report-mock-1",
    summary: "用于整理今日行动参考、适合事项、慎用事项和复盘提醒。",
    href: "/qimen/report/preview",
    createdAt: "2026-07-07T09:10:00.000Z",
    updatedAt: "2026-07-07T09:10:00.000Z",
  },
  {
    id: "user-report-content-timing",
    userId: mockUserProfile.id,
    title: "内容发布择时报告",
    reportType: "qimen",
    reportTypeLabel: "内容发布择时",
    status: "draft",
    visibility: "private",
    summary: "围绕标题方向、表达风格和私域转化建议形成草稿。",
    href: "/qimen/report/preview",
    createdAt: "2026-07-05T11:00:00.000Z",
    updatedAt: "2026-07-05T11:00:00.000Z",
  },
  {
    id: "user-report-learning",
    userId: mockUserProfile.id,
    title: "八字学习阶段复盘",
    reportType: "learning",
    reportTypeLabel: "学习复盘",
    status: "draft",
    visibility: "private",
    summary: "记录月令、十神、旺衰学习进度，不作现实命断。",
    href: "/me/progress",
    createdAt: "2026-07-03T20:40:00.000Z",
    updatedAt: "2026-07-03T20:40:00.000Z",
  },
];

export const meReportRecentItems: MeRecentItem[] = meReports.map((report) => ({
  id: report.id,
  title: report.title,
  meta: `${report.reportTypeLabel} · ${report.status === "ready" ? "已生成" : "草稿"}`,
  description: report.summary,
  href: report.href,
  status: report.visibility === "private" ? "私密" : "可见",
}));

export const meUploads: MeUpload[] = [
  {
    id: "upload-user-notes-001",
    userId: mockUserProfile.id,
    title: "个人读书札记",
    fileName: "reading-notes.txt",
    fileType: "txt",
    subjectName: "道家经典",
    copyrightStatus: "private_study",
    visibility: "private",
    uploadStatus: "uploaded",
    documentId: "user-doc-notes-001",
    note: "默认私密，仅用于个人学习整理。",
    createdAt: "2026-07-06T18:00:00.000Z",
  },
  {
    id: "upload-user-course-001",
    userId: mockUserProfile.id,
    title: "奇门课程听课笔记",
    fileName: "qimen-course-note.docx",
    fileType: "docx",
    subjectName: "奇门遁甲",
    copyrightStatus: "private_study",
    visibility: "private",
    uploadStatus: "uploaded",
    documentId: "user-doc-qimen-001",
    note: "不公开、不下载，仅作后台整理草稿。",
    createdAt: "2026-07-04T15:20:00.000Z",
  },
];

export const meSettings: MeSettingGroup[] = [
  {
    id: "profile",
    title: "基础资料",
    description: "第一阶段仅展示 mock 设置，不接真实账号系统。",
    items: [
      { label: "昵称", value: mockUserProfile.nickname, helper: "用于我的书斋页面展示。" },
      { label: "账号身份", value: "会员用户", helper: "后续接登录后从会员系统读取。" },
      { label: "邮箱", value: mockUserProfile.email ?? "未设置", helper: "当前为 mock 字段。" },
    ],
  },
  {
    id: "privacy",
    title: "隐私与资料",
    description: "上传资料默认私密，未经确认不公开。",
    items: [
      { label: "资料默认版权状态", value: "private_study", helper: "个人上传资料默认仅用于学习整理。" },
      { label: "资料默认可见性", value: "private", helper: "管理员或用户手动调整前不公开。" },
      { label: "报告默认可见性", value: "private", helper: "报告和排盘记录默认保存到个人书斋。" },
    ],
  },
  {
    id: "learning",
    title: "学习偏好",
    description: "用于后续推荐学习路径，当前仅做静态展示。",
    items: [
      { label: "默认学科", value: "奇门遁甲", helper: "首页优先显示相关阅读和课程进度。" },
      { label: "笔记提醒", value: "每次阅读后提醒复盘", helper: "第一阶段不发送真实通知。" },
    ],
  },
];
