import type { Metadata } from "next";
import DiagramsPage from "@/components/site/DiagramsPage";

export const metadata: Metadata = {
  title: "图示中心 | 中华命理文典",
  description: "围绕传统文化图示做结构化入口，先上线五行图谱，其他模块持续补齐。",
};

export default function DiagramsRoute() {
  return <DiagramsPage />;
}
