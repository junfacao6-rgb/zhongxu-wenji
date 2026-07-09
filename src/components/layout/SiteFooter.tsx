import Link from "next/link";
import BrandMark from "@/components/site/BrandMark";
import { wenguBrand } from "@/lib/wengu-library";

const footerLinks = [
  { label: "阅读古籍", href: "/library" },
  { label: "奇门模块", href: "/qimen" },
  { label: "大六壬金口诀", href: "/jinkoujue" },
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
          <p>前台只保留古籍阅读、奇门参考与金口诀三个入口，避免把学习、管理和草稿功能堆给普通用户。</p>
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
