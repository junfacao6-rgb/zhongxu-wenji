export type LiuyaoLearningStep = {
  id: string;
  title: string;
  summary: string;
  focus: string[];
};

export type LiuyaoTermCard = {
  id: string;
  title: string;
  category: string;
  summary: string;
  route?: string;
};

export const liuyaoLearningPath: LiuyaoLearningStep[] = [
  {
    id: "bagua-foundation",
    title: "八卦基础",
    summary: "先理解八卦、五行、方位和基本象意，避免直接套断语。",
    focus: ["八卦象意", "五行对应", "主客关系"],
  },
  {
    id: "divination-method",
    title: "起卦方法",
    summary: "学习手摇、时间、数字等起卦方式的边界，第一版不做真实起卦。",
    focus: ["问题边界", "起卦记录", "时间标注"],
  },
  {
    id: "install-hexagram",
    title: "装卦",
    summary: "把卦装成可分析结构，包括纳甲、六亲、六神、世应和动变。",
    focus: ["纳甲", "六亲", "六神"],
  },
  {
    id: "shi-ying",
    title: "世应",
    summary: "世应用于观察自身与对象，不可替代用神和现实语境。",
    focus: ["世爻", "应爻", "主客位置"],
  },
  {
    id: "liuqin",
    title: "六亲",
    summary: "父母、兄弟、子孙、妻财、官鬼是定位对象的基础语言。",
    focus: ["所问对象", "六亲定位", "关系转换"],
  },
  {
    id: "liushen",
    title: "六神",
    summary: "六神用于辅助观察象意和风险，不越过六亲、用神和动变。",
    focus: ["青龙朱雀", "白虎玄武", "辅助象意"],
  },
  {
    id: "yongshen",
    title: "用神",
    summary: "用神是所问对象的观察中心，必须先明所问再取用。",
    focus: ["问事分类", "取用规则", "相关爻位"],
  },
  {
    id: "source-avoid-enemy",
    title: "原神忌神仇神",
    summary: "观察用神的生扶、克制和间接干扰，训练关系链判断。",
    focus: ["原神", "忌神", "仇神"],
  },
  {
    id: "month-day",
    title: "月建日辰",
    summary: "月建日辰是时间力量，用于观察旺衰、冲合和应期线索。",
    focus: ["月建", "日辰", "旺衰来源"],
  },
  {
    id: "moving-changing",
    title: "动爻变爻",
    summary: "动爻提示变化点，变爻提示变化后的方向，不能脱离用神。",
    focus: ["动爻", "变爻", "变化链"],
  },
  {
    id: "chong-he-xing-hai",
    title: "冲合刑害",
    summary: "冲合刑害用于观察作用关系，需结合月日、动变和用神状态。",
    focus: ["冲", "合", "刑害"],
  },
  {
    id: "empty-tomb-absolute",
    title: "空亡墓绝",
    summary: "空亡、入墓、绝地常提示落空、收束或力量不显，需要看填实和出空条件。",
    focus: ["旬空", "入墓", "填实出空"],
  },
  {
    id: "timing",
    title: "应期",
    summary: "应期只作时间线索，必须结合事实反馈复盘，不作确定承诺。",
    focus: ["时间线索", "触发条件", "复盘验证"],
  },
  {
    id: "categories",
    title: "分类占断",
    summary: "求财、求职、感情、失物、考试等问题取用不同，需先定问题类型。",
    focus: ["求财", "求职", "失物考试"],
  },
  {
    id: "case-review",
    title: "案例复盘",
    summary: "记录问题、卦象、用神、动变、行动和反馈，建立可复盘学习档案。",
    focus: ["案例记录", "后验反馈", "边界修正"],
  },
];

export const liuyaoTermCards: LiuyaoTermCard[] = [
  { id: "shiying", title: "世应", category: "主客位置", summary: "世为自身或所处位置，应为对象或外部关系。", route: "/terms/shiying" },
  { id: "liuqin", title: "六亲", category: "对象定位", summary: "用父母、兄弟、子孙、妻财、官鬼定位所问对象。", route: "/terms/liuqin" },
  { id: "liushen", title: "六神", category: "辅助象意", summary: "青龙、朱雀、勾陈、腾蛇、白虎、玄武只作辅助观察。", route: "/terms/liushen" },
  { id: "yongshen", title: "用神", category: "观察中心", summary: "围绕具体问题选取核心爻位，先明所问再取用。", route: "/terms/liuyao-yongshen" },
  { id: "yuanshen", title: "原神", category: "生扶关系", summary: "生扶用神的力量，用于观察支持条件和来源。" },
  { id: "jishen", title: "忌神", category: "克制关系", summary: "克制用神的力量，提示阻力或风险来源。" },
  { id: "yuejian", title: "月建", category: "时间力量", summary: "月令在六爻中的环境力量，用于观察旺衰和支持。", route: "/terms/yuejian" },
  { id: "richen", title: "日辰", category: "当日触发", summary: "起卦日的力量，用于观察冲合、生克和应期线索。", route: "/terms/richen" },
  { id: "dongyao", title: "动爻", category: "变化点", summary: "发生变化的爻，提示事务中正在动的环节。", route: "/terms/dongyao" },
  { id: "yingqi", title: "应期", category: "时间线索", summary: "事情可能显现的时间参考，需要后续复盘验证。", route: "/terms/yingqi" },
];

export const liuyaoStudyPrinciples = [
  "先定问题边界，再谈起卦和取用。",
  "世应、六亲、用神、动变要分层记录。",
  "六神只作辅助象意，不越过用神和现实语境。",
  "月建日辰、空亡墓绝和冲合刑害都要回到条件判断。",
  "案例必须复盘，不输出确定性结论。",
];
