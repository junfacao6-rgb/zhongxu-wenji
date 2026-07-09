import type { ReactNode } from "react";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="platform-shell">
      <SiteHeader />
      <main className="site-main platform-main">{children}</main>
      <SiteFooter />
    </div>
  );
}
