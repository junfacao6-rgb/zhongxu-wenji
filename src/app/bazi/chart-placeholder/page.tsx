import type { Metadata } from "next";
import BaziChartPlaceholder from "@/components/bazi/BaziChartPlaceholder";
import BaziHero from "@/components/bazi/BaziHero";

export const metadata: Metadata = {
  title: "八字排盘占位 | 问古书斋",
  description: "八字排盘工具占位页，第一版不做真实排盘算法。",
};

export default function BaziChartPlaceholderPage() {
  return (
    <main className="bazi-page">
      <BaziHero compact />
      <BaziChartPlaceholder />
    </main>
  );
}
