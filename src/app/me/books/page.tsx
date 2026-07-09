import type { Metadata } from "next";
import ProfileSummary from "@/components/me/ProfileSummary";
import RecentItems from "@/components/me/RecentItems";
import {
  meBookmarkItems,
  meFavoriteBooks,
  meRecentReadingItems,
  mockMembership,
  mockUserProfile,
} from "@/data/userMock";

export const metadata: Metadata = {
  title: "我的藏书 | 问古书斋",
  description: "我的书斋收藏书籍和阅读历史。",
};

export default function MeBooksPage() {
  return (
    <main className="me-page">
      <ProfileSummary user={mockUserProfile} membership={mockMembership} learningDays="28 天" readingProgress="46%" compact />

      <div className="me-dashboard-grid">
        <RecentItems title="收藏书籍" subtitle="我的藏书" items={meFavoriteBooks} />
        <RecentItems title="阅读历史" subtitle="最近开卷" items={meRecentReadingItems} />
      </div>

      <RecentItems title="其他收藏" subtitle="术语与课程" items={meBookmarkItems} />
    </main>
  );
}
