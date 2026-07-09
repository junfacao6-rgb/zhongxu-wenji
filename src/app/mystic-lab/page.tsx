import type { Metadata } from "next";
import MysticLabPage from "@/components/site/MysticLabPage";

export const metadata: Metadata = {
  title: "月白墨金观象台 | 观复书阁",
  description: "观复书阁的月白墨金观象台视觉探索页。",
};

export default function Page() {
  return <MysticLabPage />;
}
