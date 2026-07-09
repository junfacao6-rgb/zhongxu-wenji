import type { ReactNode } from "react";
import TopNav from "@/components/site/TopNav";
import SectionFooter from "@/components/site/SectionFooter";

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell">
      <TopNav />
      <main className="site-main pb-6">{children}</main>
      <SectionFooter />
    </div>
  );
}
