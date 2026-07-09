import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "学习区重定向 | 观复书阁",
  description: "学习区已整合为学习路径页。",
};

export default function StudyRedirectPage() {
  redirect("/learn");
}
