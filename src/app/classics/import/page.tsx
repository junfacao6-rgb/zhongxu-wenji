import type { Metadata } from "next";
import ClassicImportAssistant from "@/components/ClassicImportAssistant";

export const metadata: Metadata = {
  title: "古籍录入助手｜观复书阁",
  description: "用于预检古籍文本、识别章节、扫描关键词并生成结构化入库草稿。",
};

export default function ClassicImportPage() {
  return <ClassicImportAssistant />;
}
