import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ClassicDetailPage from "@/components/ClassicDetailPage";
import { classicRecords, getClassicById } from "@/lib/culture-content";

export function generateStaticParams() {
  return classicRecords.map((record) => ({ id: record.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const record = getClassicById(id);
  if (!record) {
    return {
      title: "典籍未找到｜观复书阁",
    };
  }
  return {
    title: `${record.title}｜观复典籍库`,
    description: `${record.summary} 关键词：${record.keywords.join("、")}。`,
  };
}

export default async function ClassicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = getClassicById(id);
  if (!record) notFound();
  return <ClassicDetailPage record={record} />;
}
