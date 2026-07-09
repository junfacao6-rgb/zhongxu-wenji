import type { Metadata } from "next";
import UnifiedSearchPage from "@/components/UnifiedSearchPage";

export const metadata: Metadata = {
  title: "典籍总检索｜观复书阁",
  description: "搜索术语、典籍、章节、研读摘记与待校对古籍草稿。",
};

export default function SearchPage() {
  return <UnifiedSearchPage />;
}
