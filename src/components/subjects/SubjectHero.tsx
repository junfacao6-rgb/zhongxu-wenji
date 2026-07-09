import { BookOpen, Compass, GraduationCap } from "lucide-react";
import Link from "next/link";
import type { SubjectMock } from "@/data/subjects";

type SubjectHeroProps = {
  subject: SubjectMock;
  introduction: string;
  bookCount: number;
  courseCount: number;
  primaryHref?: string;
  primaryLabel?: string;
};

export default function SubjectHero({ subject, introduction, bookCount, courseCount, primaryHref = "/library", primaryLabel = "查看推荐书籍" }: SubjectHeroProps) {
  return (
    <section className={`subject-hero subject-tone-${subject.colorTone}`}>
      <div className="subject-hero-copy">
        <span>{subject.subtitle}</span>
        <h1>{subject.name}</h1>
        <p>{introduction}</p>
        <div className="subject-hero-actions">
          <Link className="subject-primary-link" href={primaryHref}>
            <Compass aria-hidden="true" />
            {primaryLabel}
          </Link>
          <Link className="subject-secondary-link" href="/terms">
            查看术语库
          </Link>
        </div>
      </div>

      <div className="subject-hero-stats" aria-label="学科统计">
        <div>
          <BookOpen aria-hidden="true" />
          <span>{bookCount}</span>
          <small>相关书籍</small>
        </div>
        <div>
          <GraduationCap aria-hidden="true" />
          <span>{courseCount}</span>
          <small>相关课程</small>
        </div>
      </div>
    </section>
  );
}
