import type { Metadata } from "next";
import LiuyaoHero from "@/components/liuyao/LiuyaoHero";
import LiuyaoHexagramPlaceholder from "@/components/liuyao/LiuyaoHexagramPlaceholder";

export const metadata: Metadata = {
  title: "六爻起卦占位 | 问古书斋",
  description: "六爻起卦工具占位页，第一版不做真实起卦。",
};

export default function LiuyaoHexagramPlaceholderPage() {
  return (
    <main className="liuyao-page">
      <LiuyaoHero compact />
      <LiuyaoHexagramPlaceholder />
    </main>
  );
}
