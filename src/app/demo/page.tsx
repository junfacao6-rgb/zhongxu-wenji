import type { Metadata } from "next";
import DemoPage from "@/components/site/DemoPage";

export const metadata: Metadata = {
  title: "手机演示入口 | 问古书斋",
  description: "问古书斋第一阶段 H5 演示入口，收拢首页、藏书、课程、奇门 mock 和邀请码 UI。",
};

export default function DemoRoute() {
  return <DemoPage />;
}
