import type { Metadata } from "next";
import ClassicsWorkbench from "@/components/ClassicsWorkbench";

export const metadata: Metadata = {
  title: "典籍库工作台｜观复书阁",
  description: "用于整理道家经典、命理典籍、术数方法和修习笔记的传统文化典籍库。",
};

export default function ClassicsPage() {
  return <ClassicsWorkbench />;
}
