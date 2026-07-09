import type { Metadata } from "next";
import ToolsPage from "@/components/site/ToolsPage";

export const metadata: Metadata = {
  title: "工具 | 观复书阁",
  description: "术数学习工具入口页，支持五行、十神、六十四卦与干支查询。",
};

export default function ToolsRoute() {
  return <ToolsPage />;
}
