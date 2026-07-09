export type BaziLearningStep = {
  id: string;
  title: string;
  summary: string;
  focus: string[];
};

export type BaziTermCard = {
  id: string;
  title: string;
  category: string;
  summary: string;
  route?: string;
};

export const baziLearningPath: BaziLearningStep[] = [
  {
    id: "yin-yang-wuxing",
    title: "阴阳五行",
    summary: "先理解动静、寒暖、燥湿、生克与流通，不把五行当成孤立标签。",
    focus: ["阴阳消长", "五行生克", "寒暖燥湿"],
  },
  {
    id: "stems-branches",
    title: "天干地支",
    summary: "天干看外显，地支看根气、季节、藏干和内部结构。",
    focus: ["十干气象", "十二支", "藏干根气"],
  },
  {
    id: "ten-gods",
    title: "十神",
    summary: "十神是以日主为中心的关系语言，不脱离日主和全局单看。",
    focus: ["生我克我", "我生我克", "同类关系"],
  },
  {
    id: "hidden-stems",
    title: "藏干",
    summary: "地支内部的藏干影响根气、透干和结构清浊，是读地支的基础。",
    focus: ["本气中气余气", "透干", "根气"],
  },
  {
    id: "twelve-growth",
    title: "十二长生",
    summary: "用来观察五行在不同地支中的状态变化，适合作为旺衰判断的辅助层。",
    focus: ["长生帝旺墓库", "气势阶段", "辅助判断"],
  },
  {
    id: "month-command",
    title: "月令",
    summary: "月令是季节之气的入口，决定原局第一层气势背景。",
    focus: ["节气", "司令之气", "格局入口"],
  },
  {
    id: "day-master-strength",
    title: "日主旺衰",
    summary: "旺衰不是数量统计，要看月令、根气、透干、生克和全局气势。",
    focus: ["得令得地", "通根", "气势偏向"],
  },
  {
    id: "structure-pattern",
    title: "格局",
    summary: "格局是结构成立条件，不是命名游戏；要看成格、破格、救应和清浊。",
    focus: ["成格条件", "破格条件", "清浊"],
  },
  {
    id: "temperature-balance",
    title: "调候",
    summary: "调候处理寒暖燥湿，尤其在冬木、夏土、寒金等结构中不可忽略。",
    focus: ["寒暖", "燥湿", "先后次序"],
  },
  {
    id: "useful-god",
    title: "用神",
    summary: "用神是结构中的作用点，需结合格局、调候、清浊和流通判断。",
    focus: ["扶抑", "通关", "成败救应"],
  },
  {
    id: "luck-cycle",
    title: "大运",
    summary: "大运是阶段性环境，不脱离原局单独判断。",
    focus: ["运入原局", "阶段背景", "结构触发"],
  },
  {
    id: "annual-flow",
    title: "流年",
    summary: "流年是年度触发点，需和原局、大运共同观察。",
    focus: ["岁运并临", "冲合刑害", "事件触发"],
  },
  {
    id: "integrated-reading",
    title: "原局与运年综合判断",
    summary: "把原局结构、大运环境和流年触发合看，形成可复盘的结构判断。",
    focus: ["原局为体", "运年为用", "复盘验证"],
  },
];

export const baziTermCards: BaziTermCard[] = [
  { id: "yueling", title: "月令", category: "结构入口", summary: "季节之气的入口，先定原局气势，再谈旺衰格局。", route: "/terms/yueling" },
  { id: "qishi", title: "气势", category: "全局观察", summary: "观察五行力量在原局中的方向、厚薄和流通，不只数个数。" },
  { id: "canggan", title: "藏干", category: "地支内部", summary: "地支内部所藏天干，帮助判断根气、透干和清浊。", route: "/terms/canggan" },
  { id: "twelve-growth", title: "十二长生", category: "状态阶段", summary: "描述五行在十二支中的生旺墓绝等状态，作为辅助参考。" },
  { id: "geju", title: "格局", category: "结构成败", summary: "看条件是否成立、是否破格、是否有救应，而不是只记名称。", route: "/terms/bazi-geju" },
  { id: "tiaohou", title: "调候", category: "寒暖燥湿", summary: "处理季节偏寒、偏热、偏燥、偏湿的问题，常影响用神次序。", route: "/terms/tiaohou" },
  { id: "qingzhuo", title: "清浊", category: "流通质量", summary: "观察结构是否清晰、力量是否混杂、路径是否顺畅。" },
  { id: "yongshen", title: "用神", category: "作用点", summary: "为成局、平衡、调候或通关而重点观察的力量。", route: "/terms/bazi-yongshen" },
];

export const baziStudyPrinciples = [
  "先看月令与气势，再看日主旺衰。",
  "先辨寒暖燥湿，再谈调候与流通。",
  "格局要看成立条件、破格条件和救应条件。",
  "用神不是固定答案，要结合清浊、成败和运年触发。",
  "案例只做结构学习，不做完整断命。",
];
