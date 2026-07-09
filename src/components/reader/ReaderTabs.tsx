import type { ReactNode } from "react";

export type ReaderTab = "original" | "plain" | "notes";

const tabs: Array<{ key: ReaderTab; label: string; description: string }> = [
  { key: "original", label: "原文", description: "保留古籍语气与术语结构" },
  { key: "plain", label: "白话", description: "用现代语言梳理意思" },
  { key: "notes", label: "笔记", description: "记录阅读提示与复盘线索" },
];

type ReaderTabsProps = {
  activeTab: ReaderTab;
  onTabChange: (tab: ReaderTab) => void;
  children: ReactNode;
};

export default function ReaderTabs({ activeTab, onTabChange, children }: ReaderTabsProps) {
  return (
    <section className="reader-tabs" aria-label="阅读内容切换">
      <div className="reader-tab-list" role="tablist" aria-label="原文白话笔记">
        {tabs.map((tab) => (
          <button key={tab.key} type="button" role="tab" aria-selected={activeTab === tab.key} className={activeTab === tab.key ? "is-active" : ""} onClick={() => onTabChange(tab.key)}>
            <strong>{tab.label}</strong>
            <span>{tab.description}</span>
          </button>
        ))}
      </div>
      <div className="reader-tab-panel" role="tabpanel">
        {children}
      </div>
    </section>
  );
}
