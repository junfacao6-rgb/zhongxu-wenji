export type KnowledgeMapStatus = "可用" | "已上线" | "建设中" | "建议先读";

export interface KnowledgeMapNode {
  title: string;
  description: string;
  href: string;
  source: string;
  status: KnowledgeMapStatus;
}

export interface KnowledgeMapLane {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  nodes: KnowledgeMapNode[];
}

export interface KnowledgeMapRoute {
  title: string;
  summary: string;
  steps: string[];
  href: string;
}

export const knowledgeMapHighlights: KnowledgeMapNode[] = [
  {
    title: "先看全局",
    description: "用一页看清五行、十神、八字、六爻、奇门之间的学习关系。",
    href: "/knowledge-map",
    source: "地图",
    status: "建议先读",
  },
  {
    title: "再选入口",
    description: "按自己的阶段选择书架、图解、工具或文章，不用在资料里反复跳转。",
    href: "/knowledge-map",
    source: "路径",
    status: "可用",
  },
  {
    title: "最后复盘",
    description: "把学习结果落到案例、问题、证据和结论，形成自己的判断记录。",
    href: "/knowledge-map",
    source: "复盘",
    status: "建设中",
  },
];

export const knowledgeMapLanes: KnowledgeMapLane[] = [
  {
    id: "foundation",
    eyebrow: "根基",
    title: "先立阴阳五行",
    summary: "先把最小概念单位学稳，再进入八字、六爻、奇门。",
    nodes: [
      {
        title: "五行生克",
        description: "理解木火土金水的生、克、同类关系。",
        href: "/diagrams/wuxing",
        source: "图解",
        status: "可用",
      },
      {
        title: "天干地支",
        description: "查天干地支的阴阳、五行、藏干与时令。",
        href: "/tools",
        source: "工具",
        status: "可用",
      },
      {
        title: "十神关系",
        description: "把日主与对象天干的关系转成十神语言。",
        href: "/tools",
        source: "工具",
        status: "可用",
      },
    ],
  },
  {
    id: "bazi",
    eyebrow: "八字",
    title: "再看格局与用神",
    summary: "八字线负责建立命局结构、十神关系和岁运判断框架。",
    nodes: [
      {
        title: "八字格局通论",
        description: "从日主、月令、格局、用神建立基础判断顺序。",
        href: "/library/bazi-geju",
        source: "书架",
        status: "已上线",
      },
      {
        title: "五行循环与应用",
        description: "把五行关系转成可追踪的判断变量。",
        href: "/library/wuxing-cycle",
        source: "书架",
        status: "建设中",
      },
      {
        title: "误区澄清",
        description: "用文章拆开用神、空亡、格局口诀等常见偏差。",
        href: "/articles",
        source: "文章",
        status: "可用",
      },
    ],
  },
  {
    id: "liuyao",
    eyebrow: "六爻",
    title: "以问题进入卦象",
    summary: "六爻线负责把具体问题转成可复核的问事流程。",
    nodes: [
      {
        title: "六爻手写札记",
        description: "从起卦、动爻、世应关系建立问事记录格式。",
        href: "/library/liuyao-handwritten",
        source: "书架",
        status: "已上线",
      },
      {
        title: "六爻图谱",
        description: "后续整理取象、变爻、用神和问事流程图。",
        href: "/diagrams",
        source: "图解",
        status: "建设中",
      },
      {
        title: "问事复盘",
        description: "把每次判断写成可检验命题，减少跳步结论。",
        href: "/learn",
        source: "路径",
        status: "建议先读",
      },
    ],
  },
  {
    id: "qimen",
    eyebrow: "奇门",
    title: "以时空判断局势",
    summary: "奇门线负责处理时间窗口、空间位置和行动建议。",
    nodes: [
      {
        title: "奇门入门课",
        description: "先看时势、宫位、门神，再转成行动项。",
        href: "/library/qimen-entry",
        source: "书架",
        status: "已上线",
      },
      {
        title: "奇门九宫图",
        description: "后续补齐九宫、九星、八门与局势关系图。",
        href: "/diagrams",
        source: "图解",
        status: "建设中",
      },
      {
        title: "决策模板",
        description: "把趋势、窗口、约束写成一份简明判断表。",
        href: "/learn",
        source: "路径",
        status: "建设中",
      },
    ],
  },
  {
    id: "review",
    eyebrow: "复盘",
    title: "从知识回到案例",
    summary: "学习最终要回到案例、记录和复核，不停留在术语背诵。",
    nodes: [
      {
        title: "专题文章",
        description: "用短文澄清具体概念，适合日常阅读和收藏。",
        href: "/articles",
        source: "文章",
        status: "可用",
      },
      {
        title: "速查工具",
        description: "用五行、十神、干支工具校验基础关系。",
        href: "/tools",
        source: "工具",
        status: "可用",
      },
      {
        title: "个人资料书架",
        description: "把长期资料集中在书架，后续可接 PDF 和课程。",
        href: "/library",
        source: "书架",
        status: "可用",
      },
    ],
  },
];

export const knowledgeMapRoutes: KnowledgeMapRoute[] = [
  {
    title: "零基础路线",
    summary: "先把术语和关系学稳，再进入八字或六爻。",
    steps: ["五行生克", "天干地支", "十神关系", "八字格局通论"],
    href: "/diagrams/wuxing",
  },
  {
    title: "实战复盘路线",
    summary: "适合已经看过基础概念，想开始做案例记录的人。",
    steps: ["六爻手写札记", "问事复盘", "速查工具", "专题文章"],
    href: "/library/liuyao-handwritten",
  },
  {
    title: "体系整合路线",
    summary: "适合后期把八字、六爻、奇门和文章内容串成方法库。",
    steps: ["奇门入门课", "个人资料书架", "误区澄清", "决策模板"],
    href: "/library/qimen-entry",
  },
];
