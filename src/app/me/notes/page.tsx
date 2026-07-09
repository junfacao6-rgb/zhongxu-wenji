import type { Metadata } from "next";
import NoteList from "@/components/me/NoteList";
import ProfileSummary from "@/components/me/ProfileSummary";
import RecentItems from "@/components/me/RecentItems";
import { meNotes, mockMembership, mockUserProfile } from "@/data/userMock";

const noteCategoryItems = [
  {
    id: "note-type-reading",
    title: "读书笔记",
    meta: "古籍阅读",
    description: "记录原文、白话、术语和章节疑问。",
    href: "/me/notes",
    status: "查看",
  },
  {
    id: "note-type-course",
    title: "课程笔记",
    meta: "现代讲义",
    description: "记录课程重点、练习题和学习反馈。",
    href: "/me/notes",
    status: "查看",
  },
  {
    id: "note-type-chart",
    title: "盘局笔记",
    meta: "奇门复盘",
    description: "记录盘面结构、行动建议和事后反馈。",
    href: "/me/charts",
    status: "查看",
  },
];

export const metadata: Metadata = {
  title: "我的笔记 | 问古书斋",
  description: "读书笔记、课程笔记和盘局笔记。",
};

export default function MeNotesPage() {
  return (
    <main className="me-page">
      <ProfileSummary user={mockUserProfile} membership={mockMembership} learningDays="28 天" readingProgress="46%" compact />
      <RecentItems title="笔记分类" subtitle="整理方式" items={noteCategoryItems} />
      <NoteList notes={meNotes} />
    </main>
  );
}
