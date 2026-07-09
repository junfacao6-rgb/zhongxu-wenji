export type MeihuaLearningStep = {
  id: string;
  title: string;
  summary: string;
  focus: string[];
};

export type MeihuaTermCard = {
  id: string;
  title: string;
  category: string;
  summary: string;
  route?: string;
};

export type MeihuaCase = {
  id: string;
  title: string;
  trigger: string;
  method: string;
  baseHexagram: string;
  mutualHexagram: string;
  changedHexagram: string;
  tiYong: string;
  externalResponse: string;
  learningFocus: string[];
  scopeNote: string;
};

export const meihuaLearningPath: MeihuaLearningStep[] = [
  {
    id: "xiantian-houtian",
    title: "先后天八卦",
    summary: "先理解八卦象意、方位与先后天次序，建立象数语言的底层地图。",
    focus: ["八卦象意", "方位", "先后天"],
  },
  {
    id: "qigua-method",
    title: "起卦法",
    summary: "学习时间、数字、声音、方位、触机等起卦方式，重点记录取数来源。",
    focus: ["时间起卦", "数字起卦", "触机记录"],
  },
  {
    id: "ti-yong",
    title: "体用",
    summary: "体用用于区分主客、内外与观察重点，不能脱离所问事项。",
    focus: ["主客", "动静", "所问对象"],
  },
  {
    id: "mutual-hexagram",
    title: "互卦",
    summary: "互卦用于观察中间过程和内在结构，适合辅助拆解变化链。",
    focus: ["中间结构", "过程线索", "内在关系"],
  },
  {
    id: "changed-hexagram",
    title: "变卦",
    summary: "变卦提示变化后的方向，需和本卦、体用、外应一起看。",
    focus: ["变化方向", "动爻", "后续倾向"],
  },
  {
    id: "wuxing-shengke",
    title: "五行生克",
    summary: "用五行生克观察体用之间的支持、制约和流通关系。",
    focus: ["生扶", "克制", "流通"],
  },
  {
    id: "external-response",
    title: "外应",
    summary: "外应来自当下场景和触发事件，必须记录来源，避免凭印象硬断。",
    focus: ["场景证据", "触发点", "记录来源"],
  },
  {
    id: "number-imagery",
    title: "数字取象",
    summary: "数字可用于起卦和取象，但要说明取数规则、时间和上下文。",
    focus: ["取数规则", "象数对应", "上下文"],
  },
  {
    id: "case-review",
    title: "案例",
    summary: "把起卦、体用、互变、外应和反馈分栏记录，形成可复盘案例。",
    focus: ["过程记录", "反馈校验", "语言克制"],
  },
];

export const meihuaTermCards: MeihuaTermCard[] = [
  { id: "bagua", title: "八卦", category: "象数基础", summary: "乾兑离震巽坎艮坤八类象意，是梅花取象的基础。", route: "/terms/bagua" },
  { id: "xiantian", title: "先天八卦", category: "卦序基础", summary: "偏重本体与对待关系，适合建立象数根基。" },
  { id: "houtian", title: "后天八卦", category: "方位应用", summary: "偏重方位、时序和后天流行，常用于场景定位。" },
  { id: "tiyong", title: "体用", category: "主客关系", summary: "体为主体或所问核心，用为外部作用或变化条件。" },
  { id: "hugua", title: "互卦", category: "过程结构", summary: "从本卦中取出中间结构，用于观察过程线索。" },
  { id: "biangua", title: "变卦", category: "变化方向", summary: "动爻变化后的卦，提示后续倾向和变化结果。" },
  { id: "waiying", title: "外应", category: "场景证据", summary: "起卦时外界声音、人物、物象等触发，需要如实记录。" },
  { id: "shengke", title: "五行生克", category: "关系判断", summary: "观察体用之间相生相克和流通关系。", route: "/terms/shengke" },
];

export const meihuaCases: MeihuaCase[] = [
  {
    id: "meihua-case-study-plan",
    title: "学习计划触机",
    trigger: "准备课程目录时，手机时间显示 09:18，窗外传来钟声。",
    method: "时间与触机合参 mock",
    baseHexagram: "风火家人",
    mutualHexagram: "火水未济",
    changedHexagram: "风山渐",
    tiYong: "体取离火为学习内容，用取巽木为整理和传播。",
    externalResponse: "钟声提示节奏，宜先定目录，再逐步推进。",
    learningFocus: ["记录取数来源", "体用先分主客", "外应只作辅助证据"],
    scopeNote: "本案例只作梅花学习结构示例，不输出确定性结论。",
  },
  {
    id: "meihua-case-content-release",
    title: "内容发布取象",
    trigger: "拟发布读书笔记时，页面连续出现“修订”提示。",
    method: "触机取象 mock",
    baseHexagram: "山泽损",
    mutualHexagram: "地雷复",
    changedHexagram: "山天大畜",
    tiYong: "体取艮为文章框架，用取兑为表达与反馈。",
    externalResponse: "修订提示说明先减繁、定标题，再考虑发布。",
    learningFocus: ["外应必须来自真实场景", "变卦看后续方向", "发布前保留校对环节"],
    scopeNote: "本案例只作内容复盘练习，不承诺传播结果。",
  },
  {
    id: "meihua-case-lost-note",
    title: "札记遗失练习",
    trigger: "找不到纸质札记，桌面只剩书签和铅笔。",
    method: "物象取象 mock",
    baseHexagram: "水山蹇",
    mutualHexagram: "火水未济",
    changedHexagram: "地山谦",
    tiYong: "体取艮为静物，用取坎为遗失与查找路径。",
    externalResponse: "书签与铅笔提示先回到阅读位置和书桌周边查找。",
    learningFocus: ["先确认所问对象", "方位和物象要分开记录", "结论只作查找参考"],
    scopeNote: "本案例只作失物类结构学习，不作确定承诺。",
  },
];

export const meihuaStudyPrinciples = [
  "取象要有来源，不能凭空补象。",
  "先写起卦法，再写体用、互卦、变卦。",
  "外应只作辅助证据，必须记录具体场景。",
  "五行生克要回到所问事项，不泛泛而谈。",
  "案例需要复盘，语言保持参考口径。",
];
