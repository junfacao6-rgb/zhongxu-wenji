import type { Metadata } from "next";
import StudyPathsPage from "@/components/StudyPathsPage";

export const metadata: Metadata = {
  title: "研读路径｜观复书阁",
  description: "按道家经典、命理主干、六爻问事和奇门资料架组织传统文化研读路线。",
};

export default function PathsPage() {
  return <StudyPathsPage />;
}
