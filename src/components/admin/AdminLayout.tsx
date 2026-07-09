import type { ReactNode } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar, { type AdminSectionKey } from "@/components/admin/AdminSidebar";

type AdminLayoutProps = {
  activeKey: AdminSectionKey;
  title: string;
  description: string;
  breadcrumbs: string[];
  children: ReactNode;
};

export default function AdminLayout({ activeKey, title, description, breadcrumbs, children }: AdminLayoutProps) {
  return (
    <main className="admin-shell">
      <AdminSidebar activeKey={activeKey} />
      <section className="admin-main">
        <AdminHeader title={title} description={description} breadcrumbs={breadcrumbs.map((label) => ({ label }))} />
        <div className="admin-content">{children}</div>
      </section>
    </main>
  );
}
