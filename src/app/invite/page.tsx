import type { Metadata } from "next";
import InvitePageClient from "@/components/invite/InvitePageClient";

export const metadata: Metadata = {
  title: "邀请码与会员权益 | 问古书斋",
  description: "输入邀请码，查看 mock 验证结果和会员权益分层。",
};

export default function InvitePage() {
  return <InvitePageClient />;
}
