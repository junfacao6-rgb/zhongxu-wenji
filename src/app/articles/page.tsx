import type { Metadata } from "next";
import ArticlesPage from "@/components/site/ArticlesPage";

export const metadata: Metadata = {
  title: "文章 | 观复书阁",
  description: "五行与术数专题文章，包含基础解读与误区修正。",
};

export default function ArticlesRoute() {
  return <ArticlesPage />;
}
