import type { Metadata } from "next";
import StyleLabPage from "@/components/site/StyleLabPage";

export const metadata: Metadata = {
  title: "视觉方向试验台 | 观复书阁",
  description: "用于比较观复书阁首页的三种视觉方向。"
};

export default function Page() {
  return <StyleLabPage />;
}
