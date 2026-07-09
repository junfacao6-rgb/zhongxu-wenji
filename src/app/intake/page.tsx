import type { Metadata } from "next";
import IntakeQueuePage from "@/components/IntakeQueuePage";

export const metadata: Metadata = {
  title: "入藏队列｜观复书阁",
  description: "集中管理待校对古籍草稿，查看入库准备度、术语命中、研读路径建议和结构化入库包。",
};

export default function IntakePage() {
  return <IntakeQueuePage />;
}
