"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import BrandMark from "@/components/site/BrandMark";
import { wenguBrand } from "@/lib/wengu-library";

type NavItem = {
  label: string;
  href: string;
  tone?: "qimen" | "jinkou";
};

const navItems: NavItem[] = [
  { label: "阅读古籍", href: "/library" },
  { label: "奇门模块", href: "/qimen", tone: "qimen" },
  { label: "大六壬金口诀", href: "/jinkoujue", tone: "jinkou" },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="platform-header">
      <div className="platform-header-inner">
        <Link aria-label="返回问古书斋首页" className="platform-brand" href="/" onClick={() => setMenuOpen(false)}>
          <BrandMark size={42} className="platform-brand-seal" />
          <span>
            <strong>{wenguBrand.name}</strong>
            <small>{wenguBrand.subtitle}</small>
          </span>
        </Link>

        <button
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "关闭导航菜单" : "打开导航菜单"}
          className="platform-inline-menu-button"
          onClick={() => setMenuOpen((value) => !value)}
          type="button"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <nav aria-label="主站导航" className="platform-nav trinity-nav">
          {navItems.map((item) => {
            const isActive = isActivePath(pathname, item.href);

            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={[
                  isActive ? "is-active" : "",
                  item.tone === "qimen" ? "is-qimen" : "",
                  item.tone === "jinkou" ? "is-jinkou" : "",
                ].filter(Boolean).join(" ")}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {menuOpen ? (
        <div aria-label="移动端导航菜单" className="platform-mobile-panel trinity-mobile-panel" role="dialog">
          <nav aria-label="移动端主站导航" className="platform-mobile-nav trinity-mobile-nav">
            {navItems.map((item) => {
              const isActive = isActivePath(pathname, item.href);

              return (
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    isActive ? "is-active" : "",
                    item.tone === "qimen" ? "is-qimen" : "",
                    item.tone === "jinkou" ? "is-jinkou" : "",
                  ].filter(Boolean).join(" ")}
                  href={item.href}
                  key={item.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
