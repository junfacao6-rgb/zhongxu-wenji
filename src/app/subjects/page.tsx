import type { Metadata } from "next";
import SubjectCard from "@/components/subjects/SubjectCard";
import { platformMockBooks } from "@/data/books";
import { courses } from "@/data/courses";
import { subjects } from "@/data/subjects";
import type { SubjectKey } from "@/types/platform";

export const metadata: Metadata = {
  title: "学科中心 | 问古书斋",
  description: "按奇门、八字、六爻、梅花、道家经典、易学基础建立传统文化术数学科入口。",
};

const subjectAudience: Record<SubjectKey, string[]> = {
  qimen: ["想学习时空、方位与人事结构的人", "需要结合工具做择时和复盘的人"],
  bazi: ["想系统学习命理基础语言的人", "需要从五行十神进入案例分析的人"],
  liuyao: ["想学习问事流程的人", "需要掌握用神、动变与应期的人"],
  meihua: ["想学习象数、体用和触机的人", "适合从案例复盘进入的人"],
  dao: ["想安静读原典和白话注解的人", "希望把经典用于修身省察的人"],
  yixue: ["需要补齐共同基础的人", "准备进入奇门、八字、六爻学习的人"],
};

export default function SubjectsPage() {
  const totalBooks = platformMockBooks.length;
  const totalCourses = courses.filter((course) => course.isPublished).length;

  return (
    <main className="subjects-page subjects-archive-page">
      <section className="subjects-archive-scroll" aria-label="问古书斋学科画卷">
        <img src="/images/hero-scroll-reference-crop-20260705.webp" alt="" />
      </section>

      <div className="subjects-archive-main">
        <section className="subjects-index-hero subjects-archive-hero">
          <div className="subjects-archive-hero-copy">
            <span>学科中心</span>
            <h1>六门入学，循书成径</h1>
            <p>问古书斋按奇门、八字、六爻、梅花、道家经典与易学基础组织资料。先辨门类，再循路径读书、识术语、看案例、做复盘。</p>
          </div>

          <div className="subjects-archive-ledger" aria-label="学科统计">
            <span>
              <strong>{subjects.length}</strong>
              <small>学科门类</small>
            </span>
            <span>
              <strong>{totalBooks}</strong>
              <small>相关藏书</small>
            </span>
            <span>
              <strong>{totalCourses}</strong>
              <small>入门课程</small>
            </span>
          </div>
        </section>

        <section className="subjects-card-grid subjects-archive-grid" aria-label="所有学科">
          {subjects.map((subject) => {
            const bookCount = platformMockBooks.filter((book) => book.subject === subject.key).length;
            const courseCount = courses.filter((course) => course.subject === subject.key && course.isPublished).length;
            const href = subject.key === "yixue" ? "/terms" : subject.route;

            return (
              <SubjectCard
                key={subject.key}
                subject={subject}
                audience={subjectAudience[subject.key]}
                bookCount={bookCount}
                courseCount={courseCount}
                href={href}
              />
            );
          })}
        </section>
      </div>
    </main>
  );
}
