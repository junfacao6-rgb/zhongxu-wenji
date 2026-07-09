export type DaoClassicItem = {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  route?: string;
  readingFocus: string[];
};

export type DaoLearningStep = {
  id: string;
  title: string;
  summary: string;
};

export const daoClassics: DaoClassicItem[] = [
  {
    id: "daodejing",
    title: "道德经",
    subtitle: "短章、含蓄、重在反复涵泳",
    summary: "适合每日短读，围绕道、名、无为、守中、柔弱、反者道之动建立阅读节奏。",
    route: "/book/daodejing-public-domain",
    readingFocus: ["道与名", "无为", "守中"],
  },
  {
    id: "zhuangzi",
    title: "庄子",
    subtitle: "寓言、齐物、逍遥与心斋",
    summary: "适合长读与札记，重点不在立刻得出工具结论，而在打开视角、安顿心神。",
    route: "/book/zhuangzi-selected-reading",
    readingFocus: ["逍遥游", "齐物论", "心斋"],
  },
  {
    id: "yinfu-jing",
    title: "阴符经",
    subtitle: "短篇深义，重在天人关系与机微",
    summary: "第一版先作为经典目录占位，后续只在版权和底本清楚后做原文、注解和讲义。",
    readingFocus: ["天人关系", "机微", "修身警醒"],
  },
  {
    id: "qingjing-jing",
    title: "清静经",
    subtitle: "清静、观心与日用省察",
    summary: "适合与日课、札记和修身实践结合，保持安静、克制、可持续的阅读方式。",
    readingFocus: ["清静", "观心", "日课"],
  },
  {
    id: "copywriting-materials",
    title: "传统文化文案素材",
    subtitle: "从经典章句到合规表达",
    summary: "把经典概念整理成克制、准确、可引用的表达素材，不包装成神秘承诺。",
    readingFocus: ["摘句", "白话转写", "合规表达"],
  },
];

export const daoLearningPath: DaoLearningStep[] = [
  {
    id: "original-reading",
    title: "原文慢读",
    summary: "先读原文，保留章句语气，不急着把文字变成工具结论。",
  },
  {
    id: "plain-notes",
    title: "白话札记",
    summary: "用现代语言写下这一章在说什么、没有说什么、容易误读什么。",
  },
  {
    id: "core-ideas",
    title: "核心思想",
    summary: "围绕道、无为、守中、虚静、心斋、齐物等概念建立索引。",
  },
  {
    id: "self-cultivation",
    title: "修身应用",
    summary: "把章句落到日用省察、情绪节制、言行边界和长期学习。",
  },
  {
    id: "material-library",
    title: "文案素材整理",
    summary: "整理可引用的章句、白话解释和合规表达，用于课程、讲义和内容创作。",
  },
];

export const daoStudyPrinciples = [
  "先读原文，再写白话，不急着下结论。",
  "道家经典页面只做阅读、札记、修身和文案素材，不做预测工具。",
  "经典章句不包装成神秘承诺，也不替代现实专业意见。",
  "引用素材要保留出处、章节和语境。",
];
