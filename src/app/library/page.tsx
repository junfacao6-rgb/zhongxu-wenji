import type { Metadata } from "next";
import LibraryPage from "@/components/site/LibraryPage";

export const metadata: Metadata = {
  title: "藏书 | 问古书斋",
  description: "问古书斋藏书页，按分类搜索古籍并进入阅读。",
};

export default function LibraryRoute() {
  return <LibraryPage />;
}
