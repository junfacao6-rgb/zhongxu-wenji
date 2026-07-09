import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, Target, UsersRound } from "lucide-react";
import Link from "next/link";
import CourseHero from "@/components/courses/CourseHero";
import CourseOutline from "@/components/courses/CourseOutline";
import LessonList from "@/components/courses/LessonList";
import { platformMockBooks } from "@/data/books";
import { courseModules, courses, lessons } from "@/data/courses";
import { terms } from "@/data/terms";
import type { Course, Lesson, Module as CourseModule } from "@/types/learning";
import type { SubjectKey } from "@/types/platform";

type CourseDetailProps = {
  params: Promise<{ courseId: string }>;
};

type CourseDetailCopy = {
  subjectName: string;
  audience: string[];
  goals: string[];
};

const progressByCourseId: Record<string, number> = {
  "qimen-intro-course": 18,
  "bazi-intro-course": 8,
  "liuyao-intro-course": 32,
  "meihua-intro-course": 0,
  "dao-intro-course": 12,
  "yixue-intro-course": 45,
};

const detailCopyBySubject: Record<SubjectKey, CourseDetailCopy> = {
  qimen: {
    subjectName: "奇门遁甲",
    audience: ["想从九宫、八门、九星、八神建立基础的人", "需要把工具练习和案例复盘结合起来的人", "希望用稳妥语言表达择时参考的人"],
    goals: ["看懂奇门盘面的基本层次", "掌握常见术语的学习顺序", "能把案例记录成可复盘的判断链"],
  },
  bazi: {
    subjectName: "八字命理",
    audience: ["刚开始学习八字基础语言的人", "需要梳理五行、干支、十神关系的人", "希望从结构而非结论进入案例的人"],
    goals: ["理解日主、月令和十神的基础关系", "区分旺衰、格局、调候和用神", "形成条件化、可复盘的学习笔记"],
  },
  liuyao: {
    subjectName: "六爻纳甲",
    audience: ["想学习问事流程的人", "需要掌握世应、六亲、用神、动变的人", "希望把断语转成结构化分析的人"],
    goals: ["明确起卦、装卦和取用神顺序", "理解月建、日辰、动爻的参考作用", "用案例练习谨慎表达和复盘"],
  },
  meihua: {
    subjectName: "梅花易数",
    audience: ["想理解象数、体用和触机关系的人", "适合从案例拆解进入的人", "希望减少凭印象判断的人"],
    goals: ["建立象数与八卦基础", "分清体用、互卦、变卦的观察位置", "把案例整理成可回看的记录"],
  },
  dao: {
    subjectName: "道家经典",
    audience: ["希望安静读原典的人", "需要白话提示和章句索引的人", "想把经典阅读用于日用省察的人"],
    goals: ["按短章阅读原文与白话", "理解道、无为、守中等核心概念", "把章句、术语和札记关联起来"],
  },
  yixue: {
    subjectName: "易学基础",
    audience: ["准备进入奇门、八字、六爻学习的人", "需要补齐阴阳五行、八卦干支的人", "希望用术语卡长期复习的人"],
    goals: ["理解阴阳、五行、八卦和干支的共同语言", "能把基础术语连接到不同学科", "为后续工具和案例学习打底"],
  },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return courses.map((course) => ({ courseId: course.id }));
}

export async function generateMetadata({ params }: CourseDetailProps): Promise<Metadata> {
  const { courseId } = await params;
  const course = getCourse(courseId);

  if (!course) {
    return {
      title: "课程不存在 | 问古书斋",
      description: "该课程不存在或暂未发布。",
    };
  }

  return {
    title: `${course.title} | 课程 | 问古书斋`,
    description: course.description,
  };
}

export default async function CourseDetailPage({ params }: CourseDetailProps) {
  const { courseId } = await params;
  const course = getCourse(courseId);

  if (!course) {
    notFound();
  }

  const copy = detailCopyBySubject[course.subject];
  const modules = getCourseModules(course);
  const courseLessons = getCourseLessons(course);
  const firstLessonHref = courseLessons[0] ? `/courses/${course.id}/lessons/${courseLessons[0].id}` : "#lesson-list";
  const relatedBooks = platformMockBooks.filter((book) => book.subject === course.subject && book.isPublished).slice(0, 4);
  const relatedTerms = terms.filter((term) => term.subject === course.subject || term.subject === "yixue").slice(0, 8);

  return (
    <main className="course-detail-page">
      <CourseHero
        course={course}
        subjectName={copy.subjectName}
        lessonCount={courseLessons.length}
        moduleCount={modules.length}
        progressPercent={progressByCourseId[course.id] ?? 0}
      />

      <div className="course-detail-layout">
        <div className="course-detail-main">
          <section className="course-detail-card" aria-labelledby="course-intro-title">
            <div className="course-section-head">
              <span>课程介绍</span>
              <h2 id="course-intro-title">这门课解决什么问题</h2>
            </div>
            <p className="course-long-copy">{course.description}</p>
            <p className="course-long-copy">
              课程以资料阅读、术语卡、讲义段落和练习题为基础，帮助学习者先建立结构，再进入案例和工具练习。当前为 mock 课程内容。
            </p>
          </section>

          <section className="course-detail-card course-audience-card" aria-labelledby="course-audience-title">
            <div className="course-section-head">
              <span>学习对象</span>
              <h2 id="course-audience-title">适合人群与学习目标</h2>
            </div>
            <div className="course-two-column">
              <div>
                <h3>
                  <UsersRound aria-hidden="true" />
                  适合人群
                </h3>
                <ul>
                  {copy.audience.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>
                  <Target aria-hidden="true" />
                  学习目标
                </h3>
                <ul>
                  {copy.goals.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <CourseOutline modules={modules} lessons={courseLessons} />
          <LessonList lessons={courseLessons} />
        </div>

        <aside className="course-detail-side" aria-label="课程关联内容">
          <section className="course-detail-card">
            <div className="course-section-head">
              <span>相关书籍</span>
              <h2>延伸阅读</h2>
            </div>
            <div className="course-related-list">
              {relatedBooks.map((book) => (
                <Link key={book.id} href={`/book/${book.id}`}>
                  <strong>{book.title}</strong>
                  <span>{book.difficulty} · {book.category}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="course-detail-card">
            <div className="course-section-head">
              <span>相关术语</span>
              <h2>先掌握这些概念</h2>
            </div>
            <div className="course-term-list">
              {relatedTerms.map((term) => (
                <Link key={term.id} href={`/terms/${term.id}`}>
                  {term.name}
                </Link>
              ))}
            </div>
          </section>

          <section className="course-detail-card course-start-card">
            <BookOpen aria-hidden="true" />
            <h2>开始学习</h2>
            <p>从第一课开始，按课时完成阅读、术语复习和练习题。所有建议仅作传统文化学习参考。</p>
            <Link href={firstLessonHref}>
              开始学习
              <ArrowRight aria-hidden="true" />
            </Link>
          </section>
        </aside>
      </div>
    </main>
  );
}

function getCourse(courseId: string) {
  return courses.find((course) => course.id === courseId && course.isPublished);
}

function getCourseModules(course: Course): CourseModule[] {
  return courseModules.filter((module) => module.courseId === course.id).sort((a, b) => a.order - b.order);
}

function getCourseLessons(course: Course): Lesson[] {
  return lessons.filter((lesson) => lesson.courseId === course.id).sort((a, b) => a.order - b.order);
}
