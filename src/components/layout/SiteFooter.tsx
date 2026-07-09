import Link from "next/link";
import BrandMark from "@/components/site/BrandMark";
import { wenguBrand } from "@/lib/wengu-library";

const footerLinks = [
  { label: "首页", href: "/" },
  { label: "藏书", href: "/library" },
  { label: "学科", href: "/subjects" },
  { label: "奇门工具", href: "/qimen" },
  { label: "术语库", href: "/terms" },
  { label: "课程", href: "/courses" },
  { label: "我的书斋", href: "/me" },
];

export default function SiteFooter() {
  return (
    <footer className="platform-footer">
      <div className="platform-footer-inner">
        <div className="platform-footer-brand">
          <BrandMark size={44} className="platform-brand-seal" />
          <div>
            <p>{wenguBrand.name}</p>
            <small>{wenguBrand.subtitle}</small>
          </div>
        </div>
        <div className="platform-footer-copy">
          <p>以古籍为根，以讲义为桥，以工具为用，整理传统文化资料、术语、课程、笔记和报告。</p>
          <small>© {new Date().getFullYear()} · 问古书斋</small>
        </div>
        <div className="platform-footer-nav-group">
          <span>主要入口</span>
          <nav aria-label="页脚导航" className="platform-footer-links">
            {footerLinks.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <p className="platform-footer-disclaimer">
        本平台内容用于传统文化学习、资料整理与行动参考，不替代医学、法律、投资、心理等专业意见。
      </p>
    </footer>
  );
}
