import type { Liuqin, Liushen, LiuyaoCase, LiuyaoHexagram, LiuyaoLine } from "@/types/liuyao";

const liuyaoTime = "2026-07-07T00:00:00.000Z";

export const liuyaoMockHexagram: LiuyaoHexagram = {
  id: "liuyao-hexagram-mock-1",
  subject: "liuyao",
  question: "本周是否适合整理课程资料？",
  method: "mock",
  baseName: "风火家人",
  changedName: "风山渐",
  lines: [
    { position: 1, name: "初爻", isYang: true, isMoving: false, liuqin: "父母", liushen: "青龙", earthlyBranch: "子", element: "水", isShi: false, isYing: false },
    { position: 2, name: "二爻", isYang: false, isMoving: true, liuqin: "兄弟", liushen: "朱雀", earthlyBranch: "丑", element: "土", isShi: true, isYing: false, note: "动爻 mock，用于展示变化点。" },
    { position: 3, name: "三爻", isYang: true, isMoving: false, liuqin: "子孙", liushen: "勾陈", earthlyBranch: "寅", element: "木", isShi: false, isYing: false },
    { position: 4, name: "四爻", isYang: true, isMoving: false, liuqin: "妻财", liushen: "腾蛇", earthlyBranch: "卯", element: "木", isShi: false, isYing: true },
    { position: 5, name: "五爻", isYang: false, isMoving: false, liuqin: "官鬼", liushen: "白虎", earthlyBranch: "辰", element: "土", isShi: false, isYing: false },
    { position: 6, name: "上爻", isYang: true, isMoving: false, liuqin: "父母", liushen: "玄武", earthlyBranch: "巳", element: "火", isShi: false, isYing: false },
  ],
  createdAt: liuyaoTime,
  disclaimer: "本卦仅作六爻学习结构示例，不替代医学、法律、投资、心理、婚姻等专业意见。",
};

export const liuyaoCaseMock: LiuyaoCase = {
  id: "liuyao-case-mock-1",
  title: "课程资料整理问事 mock",
  questionType: "学习与资料整理",
  question: liuyaoMockHexagram.question,
  hexagram: liuyaoMockHexagram,
  yongshenAnalysis: {
    yongshen: "父母",
    reason: "问题围绕资料、文书和课程整理，mock 案例取父母为观察中心。",
    relatedLinePositions: [1, 6],
    cautions: ["用神取法需结合真实装卦与问题语境", "不要直接输出确定性结果"],
    evidenceRefs: [],
  },
  movingLineAnalysis: {
    movingPositions: [2],
    summary: "动爻提示执行过程中可能有沟通或整理顺序的变化。",
    possibleChanges: ["先整理目录", "再补术语索引", "最后进入发布审核"],
    cautions: ["只作学习参考", "需复盘实际结果"],
    evidenceRefs: [],
  },
  learningFocus: ["父母爻可作资料文书用神", "动爻提示变化点，不直接作结果判断", "复盘时记录执行顺序和实际反馈"],
  scopeNote: "本案例只作六爻学习结构示例，不做确定性结论。",
  resultReview: "mock 复盘：若后续实际推进顺利，可记录目录、术语和审核耗时作为案例证据。",
  sourceSegmentIds: [],
  termIds: ["shiying", "liuqin", "liuyao-yongshen", "dongyao"],
  evidenceRefs: [],
};

export const liuyaoLearningCases: LiuyaoCase[] = [
  createLiuyaoCase({
    id: "liuyao-case-wealth",
    title: "求财案例",
    questionType: "求财",
    question: "近期某项小额合作是否适合推进？",
    baseName: "雷风恒",
    changedName: "泽风大过",
    shiPosition: 3,
    yingPosition: 6,
    yongshen: "妻财",
    movingPositions: [4],
    focus: ["求财多取妻财为用神，但要同时看世爻承载。", "动爻不等于结果，只提示事务变化点。", "财务事项仍需合同、预算和现金流校验。"],
    yongshenReason: "问题围绕收益、合作款项和资源转化，mock 案例取妻财为观察中心。",
    movingSummary: "四爻动，提示外部条件或合作对象可能出现变化，适合先核实条款。",
  }),
  createLiuyaoCase({
    id: "liuyao-case-job",
    title: "求职案例",
    questionType: "求职",
    question: "这次面试机会是否值得重点准备？",
    baseName: "风地观",
    changedName: "风山渐",
    shiPosition: 2,
    yingPosition: 5,
    yongshen: "官鬼",
    movingPositions: [2, 5],
    focus: ["求职多看官鬼与世爻关系。", "父母爻可辅助观察简历、材料和流程。", "结论需回到岗位要求、准备程度和面试反馈复盘。"],
    yongshenReason: "问题围绕岗位、面试和组织流程，mock 案例取官鬼为观察中心。",
    movingSummary: "世应相关爻位同时动，提示自己准备与对方流程都需要跟进。",
  }),
  createLiuyaoCase({
    id: "liuyao-case-relationship",
    title: "感情案例",
    questionType: "感情",
    question: "这段关系是否适合继续沟通？",
    baseName: "泽山咸",
    changedName: "泽地萃",
    shiPosition: 1,
    yingPosition: 4,
    yongshen: "官鬼",
    movingPositions: [1],
    focus: ["感情类问题先看所问对象和性别语境，不能机械取用。", "世应关系用于观察双方位置。", "涉及情感和婚姻时，应尊重现实边界和专业意见。"],
    yongshenReason: "此 mock 以关系对象为观察中心，暂取官鬼演示用神定位。",
    movingSummary: "世爻动，提示提问者自身态度或行动方式需要先调整。",
  }),
  createLiuyaoCase({
    id: "liuyao-case-lost-item",
    title: "失物案例",
    questionType: "失物",
    question: "遗失的资料袋是否还有线索？",
    baseName: "水山蹇",
    changedName: "地山谦",
    shiPosition: 4,
    yingPosition: 1,
    yongshen: "父母",
    movingPositions: [6],
    focus: ["失物需先明确物品类型，再取相应用神。", "父母可用于文书资料类物品。", "方位、时间和现实查找路径要同时记录。"],
    yongshenReason: "问题对象是资料袋、文书类物品，mock 案例取父母为观察中心。",
    movingSummary: "上爻动，提示线索可能在远处、上层位置或后续回查中出现。",
  }),
  createLiuyaoCase({
    id: "liuyao-case-exam",
    title: "考试案例",
    questionType: "考试",
    question: "本次考试准备节奏是否需要调整？",
    baseName: "山火贲",
    changedName: "山雷颐",
    shiPosition: 5,
    yingPosition: 2,
    yongshen: "父母",
    movingPositions: [3],
    focus: ["考试类问题可重点观察父母爻、世爻和官鬼压力。", "动爻提示复习环节变化，不替代真实备考。", "复盘应记录学习时间、错题和考试反馈。"],
    yongshenReason: "考试涉及文书、试卷、材料和规则，mock 案例取父母为观察中心。",
    movingSummary: "三爻动，提示中段复习或基础题环节需调整。",
  }),
];

function createLiuyaoCase(input: {
  id: string;
  title: string;
  questionType: string;
  question: string;
  baseName: string;
  changedName: string;
  shiPosition: number;
  yingPosition: number;
  yongshen: Liuqin;
  movingPositions: number[];
  focus: string[];
  yongshenReason: string;
  movingSummary: string;
}): LiuyaoCase {
  const hexagram = createHexagram(input);

  return {
    id: input.id,
    title: input.title,
    questionType: input.questionType,
    question: input.question,
    hexagram,
    yongshenAnalysis: {
      yongshen: input.yongshen,
      reason: input.yongshenReason,
      relatedLinePositions: hexagram.lines.filter((line) => line.liuqin === input.yongshen).map((line) => line.position),
      cautions: ["用神取法需结合问题语境", "本案例只作学习参考", "不输出确定性结论"],
      evidenceRefs: [],
    },
    movingLineAnalysis: {
      movingPositions: input.movingPositions,
      summary: input.movingSummary,
      possibleChanges: ["先确认问题边界", "再看世应用神", "最后记录后续反馈"],
      cautions: ["动爻只提示变化点", "需结合月建日辰和用神状态", "后续必须复盘"],
      evidenceRefs: [],
    },
    learningFocus: input.focus,
    scopeNote: "本案例只用于六爻学习结构，不做确定性结论。",
    resultReview: "mock 复盘：记录问题、用神、动爻、现实行动和后续反馈，用于校验学习过程。",
    sourceSegmentIds: [],
    termIds: ["shiying", "liuqin", "liushen", "liuyao-yongshen", "dongyao", "bianyao", "yuejian", "richen"],
    evidenceRefs: [],
  };
}

function createHexagram(input: {
  id: string;
  question: string;
  baseName: string;
  changedName: string;
  shiPosition: number;
  yingPosition: number;
  movingPositions: number[];
}): LiuyaoHexagram {
  return {
    id: `${input.id}-hexagram`,
    subject: "liuyao",
    question: input.question,
    method: "mock",
    baseName: input.baseName,
    changedName: input.changedName,
    lines: createLines(input.shiPosition, input.yingPosition, input.movingPositions),
    createdAt: liuyaoTime,
    disclaimer: "本卦仅作六爻学习结构示例，不替代医学、法律、投资、心理、婚姻等专业意见。",
  };
}

function createLines(shiPosition: number, yingPosition: number, movingPositions: number[]): LiuyaoLine[] {
  const lineSeeds: Array<{
    name: string;
    isYang: boolean;
    liuqin: Liuqin;
    liushen: Liushen;
    earthlyBranch: string;
    element: LiuyaoLine["element"];
  }> = [
    { name: "初爻", isYang: true, liuqin: "父母", liushen: "青龙", earthlyBranch: "子", element: "水" },
    { name: "二爻", isYang: false, liuqin: "兄弟", liushen: "朱雀", earthlyBranch: "丑", element: "土" },
    { name: "三爻", isYang: true, liuqin: "子孙", liushen: "勾陈", earthlyBranch: "寅", element: "木" },
    { name: "四爻", isYang: false, liuqin: "妻财", liushen: "腾蛇", earthlyBranch: "卯", element: "木" },
    { name: "五爻", isYang: true, liuqin: "官鬼", liushen: "白虎", earthlyBranch: "辰", element: "土" },
    { name: "上爻", isYang: false, liuqin: "父母", liushen: "玄武", earthlyBranch: "巳", element: "火" },
  ];

  return lineSeeds.map((seed, index) => {
    const position = index + 1;
    return {
      position,
      name: seed.name,
      isYang: seed.isYang,
      isMoving: movingPositions.includes(position),
      liuqin: seed.liuqin,
      liushen: seed.liushen,
      earthlyBranch: seed.earthlyBranch,
      element: seed.element,
      isShi: position === shiPosition,
      isYing: position === yingPosition,
      note: movingPositions.includes(position) ? "动爻 mock，用于提示变化点。" : undefined,
    };
  });
}
