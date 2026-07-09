"use client";

import { Bookmark, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import BrandMark from "@/components/site/BrandMark";
import { wenguBrand } from "@/lib/wengu-library";

type NavItem = {
  label: string;
  href: string;
  tone?: "qimen";
};

const navItems: NavItem[] = [
  { label: "首页", href: "/" },
  { label: "藏书", href: "/library" },
  { label: "学科", href: "/subjects" },
  { label: "奇门工具", href: "/qimen", tone: "qimen" },
  { label: "术语库", href: "/terms" },
  { label: "课程", href: "/courses" },
  { label: "我的书斋", href: "/me" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SearchBox({ compact = false }: { compact?: boolean }) {
  return (
    <form action="/library" className={compact ? "platform-search platform-search-mobile" : "platform-search"}>
      <Search aria-hidden="true" className="h-4 w-4" />
      <input aria-label="搜索书名、作者、关键词" name="q" placeholder="搜索书名、作者、关键词" type="search" />
      <button type="submit">搜索</button>
    </form>
  );
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
        <nav aria-label="主站导航" className="platform-nav">
          {navItems.map((item) => {
            const isActive = isActivePath(pathname, item.href);

            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={[
                  isActive ? "is-active" : "",
                  item.tone === "qimen" ? "is-qimen" : "",
                ].filter(Boolean).join(" ")}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="platform-actions">
          <SearchBox />
          <Link className="platform-study-button" href="/me">
            <Bookmark aria-hidden="true" className="h-4 w-4" />
            <span>我的书斋</span>
          </Link>
          <button
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "关闭导航菜单" : "打开导航菜单"}
            className="platform-menu-button"
            onClick={() => setMenuOpen((value) => !value)}
            type="button"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <button
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "关闭导航菜单" : "打开导航菜单"}
        className="platform-floating-menu-button"
        onClick={() => setMenuOpen((value) => !value)}
        type="button"
      >
        {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {menuOpen ? (
        <div aria-label="移动端导航菜单" className="platform-mobile-panel" role="dialog">
          <SearchBox compact />
          <nav aria-label="移动端主站导航" className="platform-mobile-nav">
            {navItems.map((item) => {
              const isActive = isActivePath(pathname, item.href);

              return (
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    isActive ? "is-active" : "",
                    item.tone === "qimen" ? "is-qimen" : "",
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
