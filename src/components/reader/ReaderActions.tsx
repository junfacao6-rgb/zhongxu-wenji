import { BookmarkPlus, Moon, NotebookPen, Sun } from "lucide-react";

type ReaderActionsProps = {
  isNightMode: boolean;
  bookmarkStatus: string | null;
  noteStatus: string | null;
  onToggleNightMode: () => void;
  onAddBookmark: () => void;
  onAddNote: () => void;
};

export default function ReaderActions({ isNightMode, bookmarkStatus, noteStatus, onToggleNightMode, onAddBookmark, onAddNote }: ReaderActionsProps) {
  return (
    <div className="reader-actions" aria-label="阅读操作">
      <button type="button" onClick={onAddBookmark}>
        <BookmarkPlus aria-hidden="true" />
        添加书签
      </button>
      <button type="button" onClick={onAddNote}>
        <NotebookPen aria-hidden="true" />
        添加笔记
      </button>
      <button type="button" onClick={onToggleNightMode} aria-pressed={isNightMode}>
        {isNightMode ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
        {isNightMode ? "日间模式" : "夜间模式"}
      </button>
      <div className="reader-action-status" aria-live="polite">
        {bookmarkStatus ? <span>{bookmarkStatus}</span> : null}
        {noteStatus ? <span>{noteStatus}</span> : null}
      </div>
    </div>
  );
}
