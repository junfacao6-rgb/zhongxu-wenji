import type { Course, Lesson, Module as CourseModule } from "@/types/learning";
import type { SubjectKey } from "@/types/platform";

const courseTime = "2026-07-07T00:00:00.000Z";

type CourseSeed = {
  subject: SubjectKey;
  title: string;
  subtitle: string;
  moduleTitle: string;
  lessons: string[];
};

const termIdsBySubject: Record<SubjectKey, string[]> = {
  qimen: ["jiugong", "bamen", "jingmen", "zhifu"],
  bazi: ["yinyang", "wuxing", "rizhu", "yueling", "shishen"],
  liuyao: ["shiying", "liuqin", "liushen", "liuyao-yongshen", "dongyao"],
  meihua: ["bagua", "wuxing", "fangwei", "shengke"],
  dao: ["yinyang", "taiji", "liangyi"],
  yixue: ["yinyang", "wuxing", "bagua", "tiangan", "dizhi"],
};

const toolLinkBySubject: Record<SubjectKey, { label: string; href: string; toolKey: string }> = {
  qimen: { label: "打开今日气机", href: "/qimen/today", toolKey: "qimen-today" },
  bazi: { label: "查看八字学习路径", href: "/subjects/bazi", toolKey: "bazi-path" },
  liuyao: { label: "查看六爻学习路径", href: "/subjects/liuyao", toolKey: "liuyao-path" },
  meihua: { label: "查看梅花学习路径", href: "/subjects/meihua", toolKey: "meihua-path" },
  dao: { label: "进入道家经典", href: "/subjects/dao", toolKey: "dao-classics" },
  yixue: { label: "打开术语库", href: "/terms", toolKey: "terms" },
};

const courseSeeds: CourseSeed[] = [
  { subject: "qimen", title: "奇门入门", subtitle: "先懂九宫八门，再看格局与择时", moduleTitle: "奇门基础骨架", lessons: ["九宫定位", "八门象意", "值符值使", "格局与复盘"] },
  { subject: "bazi", title: "八字基础", subtitle: "从五行十神到月令格局", moduleTitle: "八字基础语言", lessons: ["阴阳五行", "天干地支", "十神关系", "月令与旺衰"] },
  { subject: "liuyao", title: "六爻基础", subtitle: "把问事流程讲清楚", moduleTitle: "六爻问事基础", lessons: ["起卦方法", "六亲六神", "世应用神", "动变与应期"] },
  { subject: "meihua", title: "梅花入门", subtitle: "象数、体用与案例复盘", moduleTitle: "梅花象数基础", lessons: ["象数起点", "体用关系", "动静触机", "断例复盘"] },
  { subject: "dao", title: "道家经典导读", subtitle: "以道德经和庄子建立阅读路径", moduleTitle: "道家原典短读", lessons: ["道与名", "无为与守中", "心斋与齐物", "日用省察"] },
  { subject: "yixue", title: "易学基础", subtitle: "阴阳五行、八卦干支的底层地图", moduleTitle: "易学共用基础", lessons: ["阴阳两仪", "五行生克", "八卦河洛", "干支节气"] },
];

const visibilityBySubject: Record<SubjectKey, Course["visibility"]> = {
  qimen: "course",
  bazi: "public",
  liuyao: "members",
  meihua: "public",
  dao: "members",
  yixue: "public",
};

export const courses: Course[] = courseSeeds.map((seed) => ({
  id: `${seed.subject}-intro-course`,
  subject: seed.subject,
  title: seed.title,
  subtitle: seed.subtitle,
  description: `${seed.title}用于建立${seed.subtitle}的学习骨架，第一阶段使用 mock 课时内容。`,
  difficulty: "入门",
  moduleIds: [`${seed.subject}-intro-module`],
  lessonIds: seed.lessons.map((_, index) => `${seed.subject}-lesson-${index + 1}`),
  visibility: visibilityBySubject[seed.subject],
  isPublished: true,
  createdAt: courseTime,
  updatedAt: courseTime,
}));

export const courseModules: CourseModule[] = courseSeeds.map((seed) => ({
  id: `${seed.subject}-intro-module`,
  courseId: `${seed.subject}-intro-course`,
  title: seed.moduleTitle,
  summary: "先建立术语、结构和判断顺序，再进入案例和工具。",
  order: 1,
  lessonIds: seed.lessons.map((_, index) => `${seed.subject}-lesson-${index + 1}`),
}));

export const lessons: Lesson[] = courseSeeds.flatMap((seed) =>
  seed.lessons.map((title, index) => ({
    id: `${seed.subject}-lesson-${index + 1}`,
    courseId: `${seed.subject}-intro-course`,
    moduleId: `${seed.subject}-intro-module`,
    subject: seed.subject,
    title,
    summary: `本节围绕“${title}”建立基础理解，强调条件、结构和复盘。`,
    order: index + 1,
    estimatedMinutes: 12,
    blocks: [
      {
        id: `${seed.subject}-lesson-${index + 1}-text`,
        type: "text",
        title,
        body: `本课围绕“${title}”建立基础理解。学习时先看术语和结构，再看案例，不急于把单个词直接当成结论使用。`,
        evidenceRefs: [],
      },
      {
        id: `${seed.subject}-lesson-${index + 1}-quote`,
        type: "quote",
        quoteId: `${seed.subject}-quote-${index + 1}`,
        text: "观其所由，察其所安，仍须回到原文、条件与场景中理解。",
        sourceLabel: "问古书斋 mock 讲义摘句",
        evidenceRefs: [],
      },
      {
        id: `${seed.subject}-lesson-${index + 1}-translation`,
        type: "translation",
        original: "原文或古籍摘句在此处保留，后续接入真实 evidence。",
        translation: "白话解释用于帮助学习者理解结构，不替代原典，也不作绝对化判断。",
        evidenceRefs: [],
      },
      {
        id: `${seed.subject}-lesson-${index + 1}-terms`,
        type: "term-list",
        termIds: termIdsBySubject[seed.subject].slice(0, index === 0 ? 5 : 4),
      },
      {
        id: `${seed.subject}-lesson-${index + 1}-case`,
        type: "case",
        caseStudyId: `${seed.subject}-case-${index + 1}`,
      },
      {
        id: `${seed.subject}-lesson-${index + 1}-quiz`,
        type: "quiz",
        quizId: `${seed.subject}-quiz-${index + 1}`,
      },
      {
        id: `${seed.subject}-lesson-${index + 1}-tool`,
        type: "tool-link",
        ...toolLinkBySubject[seed.subject],
      },
      {
        id: `${seed.subject}-lesson-${index + 1}-note`,
        type: "note",
        title: "老师提示",
        body: "本节内容用于传统文化学习和复盘练习。涉及判断或择时的表达，一律使用参考、倾向、建议等稳妥口径。",
      },
    ],
    quizIds: [`${seed.subject}-quiz-${index + 1}`],
    knowledgeUnitIds: [],
    visibility: "public",
  })),
);
