import { CheckCircle2, ListTree } from "lucide-react";

type TocChapter = {
  id: string;
  title: string;
  subtitle: string;
  order: number;
};

type ChapterTocProps = {
  chapters: TocChapter[];
  activeChapterId: string;
  onSelectChapter: (index: number) => void;
};

export default function ChapterToc({ chapters, activeChapterId, onSelectChapter }: ChapterTocProps) {
  return (
    <nav className="reader-toc" aria-label="章节目录">
      <div className="reader-rail-title">
        <ListTree aria-hidden="true" />
        <span>章节目录</span>
      </div>

      <ol>
        {chapters.map((chapter, index) => {
          const isActive = chapter.id === activeChapterId;
          return (
            <li key={chapter.id}>
              <button type="button" className={isActive ? "is-active" : ""} aria-current={isActive ? "step" : undefined} onClick={() => onSelectChapter(index)}>
                <small>{String(chapter.order).padStart(2, "0")}</small>
                <span>
                  <strong>{chapter.title}</strong>
                  <em>{chapter.subtitle}</em>
                </span>
                {isActive ? <CheckCircle2 aria-hidden="true" /> : null}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
