import Link from "next/link";
import { NotebookPen } from "lucide-react";
import type { MeNote } from "@/data/userMock";

interface NoteListProps {
  notes: MeNote[];
}

export default function NoteList({ notes }: NoteListProps) {
  return (
    <section className="me-panel">
      <div className="me-section-head">
        <span>我的笔记</span>
        <h2>读书、课程与盘局记录</h2>
      </div>

      <div className="me-note-list">
        {notes.map((note) => (
          <Link key={note.id} href={note.href} className="me-note-card">
            <header>
              <NotebookPen aria-hidden="true" />
              <span>{note.noteType}</span>
            </header>
            <h3>{note.title}</h3>
            <p>{note.body}</p>
            <small>{note.sourceLabel}</small>
            <div>
              {note.tags.map((tag) => (
                <em key={tag}>{tag}</em>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
