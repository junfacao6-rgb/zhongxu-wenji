import type { Metadata } from "next";
import LearnPage from "@/components/site/LearnPage";

export const metadata: Metadata = {
  title: "学习 | 观复书阁",
  description: "从基础到进阶的传统术数学习路径，支持课程化浏览。",
};

export default function LearnRoute() {
  return <LearnPage />;
}
