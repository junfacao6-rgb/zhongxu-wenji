import type { Metadata } from "next";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminInvitesClient from "@/components/invite/AdminInvitesClient";

export const metadata: Metadata = {
  title: "邀请码 | 管理后台 | 问古书斋",
  description: "邀请码列表、生成按钮、类型、有效天数、使用次数和状态 mock 管理。",
};

export default function AdminInvitesPage() {
  return (
    <AdminLayout activeKey="invites" title="邀请码" description="第一阶段为 mock 管理界面，用于验证邀请码发放和会员权益入口。" breadcrumbs={["管理后台", "邀请码"]}>
      <AdminInvitesClient />
    </AdminLayout>
  );
}
