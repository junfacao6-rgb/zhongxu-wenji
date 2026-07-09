import type { CopyrightStatus, ISODateString, UploadStatus, Visibility } from "./platform";

export interface UserProfile {
  id: string;
  nickname: string;
  avatarUrl?: string;
  email?: string;
  phone?: string;
  role: "guest" | "user" | "member" | "student" | "consultant" | "admin";
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Membership {
  id: string;
  userId: string;
  plan: "free" | "member" | "course" | "consultant" | "admin";
  status: "active" | "expired" | "paused" | "cancelled";
  startedAt: ISODateString;
  expiresAt?: ISODateString;
  benefits: string[];
}

export interface InviteCode {
  id: string;
  code: string;
  plan: Membership["plan"];
  maxUses: number;
  usedCount: number;
  expiresAt?: ISODateString;
  isActive: boolean;
  createdAt: ISODateString;
}

export interface UserReport {
  id: string;
  userId: string;
  title: string;
  reportType: "qimen" | "bazi" | "liuyao" | "learning" | "general";
  status: "draft" | "ready" | "archived";
  visibility: Visibility;
  reportId?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface UserUpload {
  id: string;
  userId: string;
  title: string;
  fileName: string;
  fileType: string;
  copyrightStatus: CopyrightStatus;
  visibility: Visibility;
  uploadStatus: UploadStatus;
  documentId?: string;
  createdAt: ISODateString;
}

export interface UserActivity {
  id: string;
  userId: string;
  action:
    | "read_book"
    | "create_note"
    | "complete_lesson"
    | "run_qimen_tool"
    | "preview_report"
    | "upload_source"
    | "admin_review";
  targetType: "book" | "segment" | "term" | "lesson" | "course" | "report" | "source" | "tool";
  targetId: string;
  createdAt: ISODateString;
}
