import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LessonLayout from "@/components/learning/LessonLayout";
import { platformMockBooks } from "@/data/books";
import { courseModules, courses, lessons } from "@/data/courses";
import { terms } from "@/data/terms";
import type { Course, Lesson, Module as CourseModule } from "@/types/learning";

type CourseLessonPageProps = {
  params: Promise<{ courseId: string; lessonId: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return lessons.map((lesson) => ({
    courseId: lesson.courseId,
    lessonId: lesson.id,
  }));
}

export async function generateMetadata({ params }: CourseLessonPageProps): Promise<Metadata> {
  const { courseId, lessonId } = await params;
  const course = getCourse(courseId);
  const lesson = getLesson(courseId, lessonId);

  if (!course || !lesson) {
    return {
      title: "课时不存在 | 问古书斋",
      description: "该课程课时不存在或暂未发布。",
    };
  }

  return {
    title: `${lesson.title} | ${course.title} | 问古书斋`,
    description: lesson.summary,
  };
}

export default async function CourseLessonPage({ params }: CourseLessonPageProps) {
  const { courseId, lessonId } = await params;
  const course = getCourse(courseId);
  const currentLesson = getLesson(courseId, lessonId);

  if (!course || !currentLesson) {
    notFound();
  }

  const modules = getCourseModules(course);
  const courseLessons = getCourseLessons(course);
  const currentIndex = courseLessons.findIndex((lesson) => lesson.id === currentLesson.id);
  const previousLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : undefined;
  const nextLesson = currentIndex >= 0 && currentIndex < courseLessons.length - 1 ? courseLessons[currentIndex + 1] : undefined;
  const lessonTerms = getLessonTerms(currentLesson, course);
  const relatedBooks = platformMockBooks.filter((book) => book.subject === course.subject && book.isPublished).slice(0, 4);

  return (
    <LessonLayout
      course={course}
      modules={modules}
      lessons={courseLessons}
      currentLesson={currentLesson}
      previousLesson={previousLesson}
      nextLesson={nextLesson}
      terms={lessonTerms}
      relatedBooks={relatedBooks}
    />
  );
}

function getCourse(courseId: string) {
  return courses.find((course) => course.id === courseId && course.isPublished);
}

function getLesson(courseId: string, lessonId: string) {
  return lessons.find((lesson) => lesson.courseId === courseId && lesson.id === lessonId);
}

function getCourseModules(course: Course): CourseModule[] {
  return courseModules.filter((module) => module.courseId === course.id).sort((a, b) => a.order - b.order);
}

function getCourseLessons(course: Course): Lesson[] {
  return lessons.filter((lesson) => lesson.courseId === course.id).sort((a, b) => a.order - b.order);
}

function getLessonTerms(lesson: Lesson, course: Course) {
  const termIds = lesson.blocks.flatMap((block) => (block.type === "term-list" ? block.termIds : []));
  const exactTerms = terms.filter((term) => termIds.includes(term.id));
  const fallbackTerms = terms.filter((term) => term.subject === course.subject || term.subject === "yixue");
  const uniqueTerms = new Map([...exactTerms, ...fallbackTerms].map((term) => [term.id, term]));
  return Array.from(uniqueTerms.values()).slice(0, 8);
}
