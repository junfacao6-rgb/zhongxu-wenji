import { X } from "lucide-react";
import type { Term } from "@/types/content";

type TermPopoverProps = {
  term: Term | null;
  onClose: () => void;
};

export default function TermPopover({ term, onClose }: TermPopoverProps) {
  if (!term) {
    return (
      <aside className="reader-term-popover is-empty" aria-label="术语解释">
        <span>术语卡</span>
        <p>点击正文中的高亮术语，可在这里查看白话解释、进阶提示和关联词。</p>
      </aside>
    );
  }

  return (
    <aside className="reader-term-popover" aria-label={`${term.name}解释卡片`}>
      <button type="button" className="reader-term-close" onClick={onClose} aria-label="关闭术语解释">
        <X aria-hidden="true" />
      </button>
      <span>{term.category}</span>
      <h3>{term.name}</h3>
      <p>{term.plainExplanation}</p>
      <div>
        <strong>进阶提示</strong>
        <p>{term.advancedExplanation}</p>
      </div>
      {term.relatedTerms.length > 0 ? (
        <small>关联：{term.relatedTerms.slice(0, 4).join("、")}</small>
      ) : null}
    </aside>
  );
}
