import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { SubjectMock } from "@/data/subjects";
import LearningPath from "@/components/subjects/LearningPath";

const subjectImageMap: Record<SubjectMock["key"], string> = {
  qimen: "/images/wengu/categories/qimen.webp",
  bazi: "/images/wengu/categories/bazi.webp",
  liuyao: "/images/wengu/categories/liuyao.webp",
  meihua: "/images/wengu/categories/meihua.webp",
  dao: "/images/wengu/categories/daoist.webp",
  yixue: "/images/wengu/categories/other.webp",
};

type SubjectCardProps = {
  subject: SubjectMock;
  audience: string[];
  bookCount: number;
  courseCount: number;
  href: string;
};

export default function SubjectCard({ subject, audience, bookCount, courseCount, href }: SubjectCardProps) {
  return (
    <article className={`subject-card subject-tone-${subject.colorTone}`}>
      <div className="subject-card-topline">
        <img src={subjectImageMap[subject.key]} alt="" />
        <span>{subject.subtitle}</span>
      </div>

      <div className="subject-card-copy">
        <h2>{subject.name}</h2>
        <p>{subject.description}</p>
      </div>

      <div className="subject-card-path">
        <strong>入门次第</strong>
        <LearningPath steps={subject.recommendedPath} compact />
      </div>

      <div className="subject-card-audience">
        <strong>适合人群</strong>
        <ul>
          {audience.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="subject-card-footer">
        <div>
          <span>{bookCount}</span>
          <small>相关书籍</small>
        </div>
        <div>
          <span>{courseCount}</span>
          <small>相关课程</small>
        </div>
        <Link href={href}>
          进入学习
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
