import type { Metadata } from "next";
import TermAtlasPage from "@/components/TermAtlasPage";

export const metadata: Metadata = {
  title: "术语玄览｜观复书阁",
  description: "索引道家心法、命理骨架、术数问事和修身日用术语，关联典籍、章节、路径和草稿。",
};

export default function GlossaryPage() {
  return <TermAtlasPage />;
}
