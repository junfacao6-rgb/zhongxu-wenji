export const classicCategories = ["全部", "道家经典", "命理典籍", "术数方法", "修习笔记"] as const;
export const classicDifficulties = ["全部难度", "入门", "进阶", "高阶"] as const;
export const termCategories = ["全部", "道家心法", "命理骨架", "术数问事", "修身日用"] as const;

export type ClassicCategory = (typeof classicCategories)[number];
export type ClassicDifficulty = (typeof classicDifficulties)[number];
export type TermCategory = (typeof termCategories)[number];

export type ClassicRecord = {
  id: string;
  title: string;
  category: Exclude<ClassicCategory, "全部">;
  dynasty: string;
  focus: string;
  status: string;
  difficulty: string;
  summary: string;
  excerpt: string;
  keywords: string[];
  nextStep: string;
};

export type ClassicChapter = {
  order: string;
  title: string;
  theme: string;
  original: string;
  translation: string;
  notes: string[];
  keywords: string[];
  status: string;
};

export type StudyPathRecord = {
  id: string;
  title: string;
  subtitle: string;
  level: string;
  duration: string;
  summary: string;
  suitableFor: string;
  classicIds: string[];
  keywords: string[];
  milestones: {
    title: string;
    text: string;
    proof: string;
  }[];
  practices: string[];
  nextAction: string;
};

export type TermRecord = {
  id: string;
  term: string;
  category: Exclude<TermCategory, "全部">;
  reading: string;
  summary: string;
  plain: string;
  avoid: string;
  practice: string;
  relatedTerms: string[];
  classicIds: string[];
  pathIds: string[];
  keywords: string[];
};

export const readingModes = [
  {
    title: "原文",
    text: "逐章保存原文，保留章节、卷次、版本和来源信息。",
  },
  {
    title: "白话",
    text: "把古文拆成现代语义，不做恐吓化或绝对化解释。",
  },
  {
    title: "注解",
    text: "记录术语、典故、判断条件和常见误读。",
  },
  {
    title: "案例",
    text: "把命例、问事、日课和复盘结果关联回原文。",
  },
] as const;

export const ingestionFields = [
  ["book.title", "书名", "如 道德经 / 子平真诠"],
  ["book.category", "分类", "道家经典、命理典籍、术数方法或修习笔记"],
  ["source.file", "来源文件", "PDF、Word、TXT、图片 OCR 或手工摘录"],
  ["chapter.title", "章节", "卷、篇、章、条目或专题名称"],
  ["content.original", "原文", "尽量保留原文标点和版本差异"],
  ["content.translation", "白话", "解释意思，不夸大承诺"],
  ["content.notes", "注解", "术语、用法、条件、误区"],
  ["index.keywords", "关键词", "用于搜索、筛选和关联案例"],
] as const;

export const sourcePipelines = [
  {
    title: "文本类",
    items: ["TXT", "Markdown", "Word"],
    text: "最适合直接拆章节、做关键词和注解。",
  },
  {
    title: "扫描类",
    items: ["PDF", "图片"],
    text: "需要先 OCR，再人工校对原文和标点。",
  },
  {
    title: "笔记类",
    items: ["摘录", "案例", "讲义"],
    text: "适合沉淀成主题索引和复盘卡片。",
  },
] as const;

export const importKeywordHints = [
  "道",
  "德",
  "无为",
  "有无",
  "守中",
  "阴阳",
  "五行",
  "干支",
  "用神",
  "格局",
  "月令",
  "六爻",
  "动爻",
  "应期",
  "九宫",
  "八门",
  "修身",
  "心斋",
] as const;

export const importSampleText = `道德经

第一章 体道
道可道，非常道；名可名，非常名。
无名天地之始；有名万物之母。

第二章 养身
有无相生，难易相成，长短相形。
是以圣人处无为之事，行不言之教。`;

export const classicRecords: ClassicRecord[] = [
  {
    id: "daodejing",
    title: "道德经",
    category: "道家经典",
    dynasty: "春秋",
    focus: "道、德、无为、守中",
    status: "提纲已建",
    difficulty: "入门",
    summary: "以道为体，以德为用，适合放在整个知识库的根部。",
    excerpt: "读这部书，先不要急着解释每一句，先看它如何反复提醒人从争夺、躁动和过度控制里退一步。",
    keywords: ["无为", "守柔", "反者道动"],
    nextStep: "补入原文、章目、白话提要和现代行动注。",
  },
  {
    id: "zhuangzi",
    title: "庄子",
    category: "道家经典",
    dynasty: "战国",
    focus: "逍遥、齐物、心斋",
    status: "待补原文",
    difficulty: "进阶",
    summary: "更适合做心法和人生处境的解释层，让页面有精神纵深。",
    excerpt: "庄子的重点不是逃避现实，而是让人从固定身份和单一胜负里松开，重新获得观看世界的余地。",
    keywords: ["逍遥游", "齐物论", "心斋"],
    nextStep: "按篇章拆分寓言、观点、现代处境和练习题。",
  },
  {
    id: "taishang-ganying",
    title: "太上感应篇",
    category: "道家经典",
    dynasty: "宋元以后流行",
    focus: "因果、修身、日用戒惧",
    status: "可接入",
    difficulty: "入门",
    summary: "适合作为庄重感和日常修身入口，但表达要避免恐吓化。",
    excerpt: "它可以被整理成每日自省，而不是简单的奖惩叙事：什么念头会让人失序，什么行动会让人归正。",
    keywords: ["修身", "省察", "善念"],
    nextStep: "建立条目、解释、现代场景和每日省察卡片。",
  },
  {
    id: "ziping-zhenquan",
    title: "子平真诠",
    category: "命理典籍",
    dynasty: "清代",
    focus: "格局、用神、月令",
    status: "框架已建",
    difficulty: "进阶",
    summary: "适合作为八字学习的主干经典，和命例笔记联动。",
    excerpt: "重点不是背格局名称，而是理解月令、气势、用神之间如何形成判断路径。",
    keywords: ["格局", "月令", "用神"],
    nextStep: "补入章节、格局索引、命例交叉引用。",
  },
  {
    id: "ditiansui",
    title: "滴天髓",
    category: "命理典籍",
    dynasty: "明清流传",
    focus: "气势、旺衰、通关",
    status: "待补注解",
    difficulty: "高阶",
    summary: "可做成精读栏目，帮助用户从口诀进入真实判断。",
    excerpt: "这类文本最怕只读成玄句，要把每句话拆成条件、关系和验证方式。",
    keywords: ["旺衰", "通关", "气势"],
    nextStep: "按原文、注解、例证、误区四层录入。",
  },
  {
    id: "qiongtong",
    title: "穷通宝鉴",
    category: "命理典籍",
    dynasty: "清代",
    focus: "调候、五行、月份",
    status: "可接入",
    difficulty: "进阶",
    summary: "适合做查询型资料，按日主与月份建立索引。",
    excerpt: "这部书更像调候地图，关键在于把季节、寒暖、燥湿和五行状态对应起来。",
    keywords: ["调候", "寒暖", "燥湿"],
    nextStep: "建立日主、月份、调候用神的可检索表。",
  },
  {
    id: "zengshan-buyi",
    title: "增删卜易",
    category: "术数方法",
    dynasty: "清代",
    focus: "六爻、用神、断法",
    status: "待接入",
    difficulty: "高阶",
    summary: "后续可支撑六爻问事功能的解释层和案例库。",
    excerpt: "它适合被拆成问题类型、取用神、看动变、看应期四个学习入口。",
    keywords: ["六爻", "用神", "应期"],
    nextStep: "按问财、问事、问失物、问行人等场景拆分。",
  },
  {
    id: "qimen",
    title: "奇门遁甲笔记",
    category: "术数方法",
    dynasty: "现代整理",
    focus: "九宫、八门、格局",
    status: "预留入口",
    difficulty: "高阶",
    summary: "为后续奇门资料和你的本地笔记预留导航位置。",
    excerpt: "奇门资料要先做结构，不急着堆内容：宫、门、星、神、干之间的关系要能被查到。",
    keywords: ["九宫", "八门", "用局"],
    nextStep: "接入本地奇门笔记目录，建立章节和关键词索引。",
  },
];

export const classicChapterSamples: Record<string, ClassicChapter[]> = {
  daodejing: [
    {
      order: "01",
      title: "体道",
      theme: "道与名",
      original: "道可道，非常道；名可名，非常名。",
      translation: "凡是已经被说死、被命名固定的，都不是那个正在流动和生成的道。",
      notes: ["先区分“可说的道”和“正在发生的道”。", "这一章适合作为全站的阅读起点，提醒用户不要把术语当终点。"],
      keywords: ["道", "名", "不可执"],
      status: "样例已建",
    },
    {
      order: "02",
      title: "养身",
      theme: "有无相生",
      original: "有无相生，难易相成，长短相形。",
      translation: "判断一件事时，不要只看一端；对立面往往同时在场。",
      notes: ["可以关联到日课里的“动与守”。", "后续可补现代案例：什么时候该推进，什么时候该留白。"],
      keywords: ["有无", "相生", "守中"],
      status: "待补注解",
    },
  ],
  zhuangzi: [
    {
      order: "01",
      title: "逍遥游",
      theme: "大与小的尺度",
      original: "北冥有鱼，其名为鲲。",
      translation: "先把人的眼界从眼前得失里拔出来，才可能谈真正的自在。",
      notes: ["适合做人生处境和心法栏目。", "后续可拆为寓言、处境、行动练习三层。"],
      keywords: ["逍遥", "尺度", "鲲鹏"],
      status: "待补原文",
    },
  ],
  "ziping-zhenquan": [
    {
      order: "01",
      title: "论用神",
      theme: "月令与格局",
      original: "八字用神，专求月令。",
      translation: "看八字不能只抓零散神煞，要先看一局气势从哪里发起。",
      notes: ["后续可关联命盘页的月柱和日主。", "适合建立格局索引。"],
      keywords: ["用神", "月令", "格局"],
      status: "框架已建",
    },
  ],
  ditiansui: [
    {
      order: "01",
      title: "通神",
      theme: "气势与通关",
      original: "欲识三元万法宗，先观帝载与神功。",
      translation: "读口诀之前，先看全局之气从哪里来、往哪里去。",
      notes: ["需要结合命例，不宜只做句读。", "后续补误区：把口诀当绝对结论。"],
      keywords: ["气势", "通关", "命例"],
      status: "待补注解",
    },
  ],
  "zengshan-buyi": [
    {
      order: "01",
      title: "取用神",
      theme: "问题与对象",
      original: "凡占，先明用神。",
      translation: "问事的第一步不是急着断吉凶，而是明确这件事到底以谁、以何物为中心。",
      notes: ["后续可直接支撑六爻问事页面。", "可拆为问财、问事、问失物、问行人等场景。"],
      keywords: ["六爻", "用神", "问事"],
      status: "待接入",
    },
  ],
};

export function getClassicById(id: string) {
  return classicRecords.find((record) => record.id === id);
}

export function getChaptersForClassic(id: string): ClassicChapter[] {
  const record = getClassicById(id);
  if (!record) return [];
  return (
    classicChapterSamples[id] ?? [
      {
        order: "01",
        title: "待整理章节",
        theme: record.focus,
        original: "等待补入原文。",
        translation: record.excerpt,
        notes: [record.nextStep],
        keywords: record.keywords,
        status: record.status,
      },
    ]
  );
}

export const studyRituals = [
  {
    title: "晨起一问",
    time: "3分钟",
    text: "今天最该守住的边界是什么？先定边界，再看日课。",
  },
  {
    title: "午间一验",
    time: "5分钟",
    text: "把上午发生的事对照五行和节奏，看哪里过旺，哪里不足。",
  },
  {
    title: "夜读一章",
    time: "12分钟",
    text: "读一小段原文，只记一句能放进明天行动里的话。",
  },
];

export const portalStats = [
  ["8", "典籍入口"],
  ["4", "学习体系"],
  ["19", "术语索引"],
  ["24", "节气线索"],
];

export const studyPathRecords: StudyPathRecord[] = [
  {
    id: "dao-root",
    title: "玄门立根",
    subtitle: "先把心法、语言和日用边界立起来",
    level: "入门",
    duration: "7日",
    summary: "从《道德经》进入守中、无为、观照，再用《庄子》和《太上感应篇》把心法落到日常选择。",
    suitableFor: "适合刚进入传统文化学习、容易被术语带乱、想先建立内在秩序的人。",
    classicIds: ["daodejing", "zhuangzi", "taishang-ganying"],
    keywords: ["道", "无为", "守中", "心斋", "修身"],
    milestones: [
      {
        title: "识道与名",
        text: "先读“道可道，非常道”，理解术语只是路标，不是结论。",
        proof: "能用自己的话说出一个判断为什么不能急着定死。",
      },
      {
        title: "观对立相生",
        text: "从有无、难易、长短里看关系，不只抓一端。",
        proof: "能把今日一件事拆成动与守两面。",
      },
      {
        title: "落到省察",
        text: "把修身文本做成每日边界，而不是恐吓式奖惩。",
        proof: "能写下今天要守住的一条界限。",
      },
    ],
    practices: ["晨起一问", "夜读一章", "复制摘记到书斋"],
    nextAction: "先读《道德经》第一章，再到书斋留下第一条摘记。",
  },
  {
    id: "bazi-spine",
    title: "命理主干",
    subtitle: "从月令、格局、气势进入八字判断路径",
    level: "进阶",
    duration: "14日",
    summary: "以《子平真诠》立格局，以《滴天髓》看气势，以《穷通宝鉴》补调候，避免只背口诀。",
    suitableFor: "适合已经接触八字，但容易在神煞、口诀和零散术语之间迷路的人。",
    classicIds: ["ziping-zhenquan", "ditiansui", "qiongtong"],
    keywords: ["用神", "月令", "格局", "气势", "调候"],
    milestones: [
      {
        title: "先求月令",
        text: "把判断重心放到月令和全局气势，不从单点术语起断。",
        proof: "能说明一个八字为什么先看月令。",
      },
      {
        title: "拆开口诀",
        text: "把口诀转成条件、关系、验证方式，避免玄句化。",
        proof: "能把一句原文拆成至少两个判断条件。",
      },
      {
        title: "补调候地图",
        text: "把寒暖燥湿和月份、五行状态对应起来。",
        proof: "能按日主和月份写出一个调候方向。",
      },
    ],
    practices: ["整理关键词", "记录命例疑点", "回到总检索查同词"],
    nextAction: "打开《子平真诠》论用神，把“月令”相关摘记先收进书斋。",
  },
  {
    id: "liuyao-question",
    title: "六爻问事",
    subtitle: "把问题、用神、动变、应期连成一条断事线",
    level: "高阶",
    duration: "10日",
    summary: "围绕《增删卜易》建立问事流程，先明用神，再看动变和应期，减少凭感觉乱断。",
    suitableFor: "适合已经会起卦，但想让每一次问事更可复盘、更能回到原文依据的人。",
    classicIds: ["zengshan-buyi", "daodejing"],
    keywords: ["六爻", "用神", "动爻", "应期", "问事"],
    milestones: [
      {
        title: "先明所问",
        text: "把模糊问题收成一个中心对象，再谈用神。",
        proof: "能把一个问题改写成清楚的问事句。",
      },
      {
        title: "取用神",
        text: "按问题类型决定中心，不先急着断吉凶。",
        proof: "能说明此卦为什么取这个用神。",
      },
      {
        title: "复盘应期",
        text: "把结果回填到案例里，形成下一次判断的依据。",
        proof: "能记录一次问事的结果和误差。",
      },
    ],
    practices: ["六爻问事", "事件复盘", "关联原文依据"],
    nextAction: "先读《增删卜易》取用神，再去六爻问事页做一次可复盘的问题。",
  },
  {
    id: "qimen-archive",
    title: "奇门资料架",
    subtitle: "先搭宫、门、星、神、干的索引骨架",
    level: "高阶",
    duration: "预留",
    summary: "为后续奇门笔记和本地资料预留结构，先做目录、关键词、术语关系，不急着堆散文。",
    suitableFor: "适合后续要批量补充奇门笔记、讲义或案例，并希望它们能被检索和交叉引用的人。",
    classicIds: ["qimen"],
    keywords: ["奇门", "九宫", "八门", "用局", "格局"],
    milestones: [
      {
        title: "建术语骨架",
        text: "先把宫、门、星、神、干拆成可检索字段。",
        proof: "能给一条笔记补上至少三个关键词。",
      },
      {
        title: "补章节来源",
        text: "每段材料记录来源、卷章或讲义位置。",
        proof: "能在录入助手里保存一份奇门草稿。",
      },
      {
        title: "做案例关联",
        text: "把格局和真实事件、复盘结果连起来。",
        proof: "能从关键词检索到相关笔记和案例。",
      },
    ],
    practices: ["导入古籍", "关键词扫描", "总检索复核"],
    nextAction: "把第一份奇门笔记粘到录入助手，先保存为待校对草稿。",
  },
];

export const termIndexRecords: TermRecord[] = [
  {
    id: "dao",
    term: "道",
    category: "道家心法",
    reading: "dao",
    summary: "不是一个固定概念，而是万物流动、生成和归复的总根。",
    plain: "读经典时先把“道”当成观察方式：看事情如何发生，而不是急着给它下定义。",
    avoid: "不要把“道”解释成一句玄话，也不要把任何单一术语当成最终答案。",
    practice: "遇到复杂问题时，先写下它正在变化的三件事，再决定是否行动。",
    relatedTerms: ["无为", "有无", "守中", "心斋"],
    classicIds: ["daodejing", "zhuangzi"],
    pathIds: ["dao-root"],
    keywords: ["道", "名", "体道", "反者道动"],
  },
  {
    id: "wuwei",
    term: "无为",
    category: "道家心法",
    reading: "wu wei",
    summary: "不是不做事，而是不用过度控制去破坏事物本来的势。",
    plain: "它更接近“顺势而为”：先看条件和节奏，再决定少做、慢做或不做。",
    avoid: "不要把无为理解成躺平、逃避或什么都不承担。",
    practice: "把今天最想强行推进的一件事写下来，判断它缺的是时机、资源还是边界。",
    relatedTerms: ["道", "守中", "有无"],
    classicIds: ["daodejing"],
    pathIds: ["dao-root"],
    keywords: ["无为", "守柔", "不争", "节奏"],
  },
  {
    id: "you-wu",
    term: "有无",
    category: "道家心法",
    reading: "you wu",
    summary: "看见显性的存在，也看见空位、余地和未成形的可能。",
    plain: "它提醒人判断一件事时，不只看已有资源，也看留白、缺口和反面条件。",
    avoid: "不要只抓“有”的证据，也不要把“无”当成空洞虚无。",
    practice: "做选择前列两栏：已经存在的条件，以及暂时不能做的限制。",
    relatedTerms: ["道", "无为", "阴阳"],
    classicIds: ["daodejing"],
    pathIds: ["dao-root"],
    keywords: ["有无", "相生", "留白", "条件"],
  },
  {
    id: "shou-zhong",
    term: "守中",
    category: "道家心法",
    reading: "shou zhong",
    summary: "在过与不及之间守住中心，不被一时情绪和外界拉走。",
    plain: "它是日用层面的定力：先稳住判断位置，再谈行动。",
    avoid: "不要把守中变成中庸敷衍，也不要用它回避必要选择。",
    practice: "今天只定一条边界：什么事可以推进，什么事先不碰。",
    relatedTerms: ["道", "无为", "修身"],
    classicIds: ["daodejing", "taishang-ganying"],
    pathIds: ["dao-root"],
    keywords: ["守中", "边界", "静", "省察"],
  },
  {
    id: "xin-zhai",
    term: "心斋",
    category: "道家心法",
    reading: "xin zhai",
    summary: "让心从杂念、身份和胜负里空出来，重新获得观看余地。",
    plain: "它不是神秘仪式，而是把心里先入为主的判断暂时放下。",
    avoid: "不要把心斋理解成压抑感受，真正的清空是为了看得更准。",
    practice: "读一章之前，先写下自己此刻最强的预设，再暂时放在一边。",
    relatedTerms: ["道", "修身", "逍遥"],
    classicIds: ["zhuangzi"],
    pathIds: ["dao-root"],
    keywords: ["心斋", "齐物", "观照", "清静"],
  },
  {
    id: "xiushen",
    term: "修身",
    category: "修身日用",
    reading: "xiu shen",
    summary: "把经典落到每天的念头、边界和行动复盘上。",
    plain: "修身不是空泛道德说教，而是持续校准自己的心、言、事。",
    avoid: "不要把修身做成恐吓式奖惩，也不要替代医疗、法律或投资判断。",
    practice: "夜里只复盘一件事：今天哪里失序，明天怎么少一点。",
    relatedTerms: ["守中", "心斋", "道"],
    classicIds: ["taishang-ganying", "daodejing"],
    pathIds: ["dao-root"],
    keywords: ["修身", "省察", "日课", "善念"],
  },
  {
    id: "yinyang",
    term: "阴阳",
    category: "命理骨架",
    reading: "yin yang",
    summary: "用来观察一件事的两面、动静、消长和互根关系。",
    plain: "它不是简单二分，而是看关系如何互相生成、互相制约。",
    avoid: "不要把阴阳当标签贴人，也不要用它做绝对化判断。",
    practice: "分析一个问题时，先找出它的主动面和承受面。",
    relatedTerms: ["五行", "有无", "干支"],
    classicIds: ["qiongtong", "ziping-zhenquan"],
    pathIds: ["bazi-spine"],
    keywords: ["阴阳", "动静", "消长", "关系"],
  },
  {
    id: "wuxing",
    term: "五行",
    category: "命理骨架",
    reading: "wu xing",
    summary: "木火土金水五类状态，用来观察生克、流通和偏枯。",
    plain: "它更像一套关系语言：什么在生发，什么在收敛，什么被堵住。",
    avoid: "不要把五行等同于固定性格标签，也不要只数个数不看气势。",
    practice: "把一件事拆成生发、扩张、承载、收敛、流动五个状态。",
    relatedTerms: ["阴阳", "干支", "调候"],
    classicIds: ["qiongtong", "ditiansui"],
    pathIds: ["bazi-spine"],
    keywords: ["五行", "生克", "流通", "偏枯"],
  },
  {
    id: "ganzhi",
    term: "干支",
    category: "命理骨架",
    reading: "gan zhi",
    summary: "天干地支构成时间、气势和象的表达骨架。",
    plain: "它让时间不只是日期，而是带着寒暖、动静、关系和阶段。",
    avoid: "不要只背干支名，也不要脱离月份和局势单看一个字。",
    practice: "看一个日期时，同时记录天干、地支、月份和当下事件。",
    relatedTerms: ["阴阳", "五行", "月令"],
    classicIds: ["qiongtong", "ziping-zhenquan"],
    pathIds: ["bazi-spine"],
    keywords: ["干支", "甲子", "时间", "气"],
  },
  {
    id: "yueling",
    term: "月令",
    category: "命理骨架",
    reading: "yue ling",
    summary: "八字里判断一局气势从哪里发起的重要枢纽。",
    plain: "先看月令，是为了知道季节和全局力量的底色。",
    avoid: "不要绕过月令直接抓零散神煞或单个字下结论。",
    practice: "读命理材料时，把涉及月份、季节、旺衰的句子先标出来。",
    relatedTerms: ["用神", "格局", "调候"],
    classicIds: ["ziping-zhenquan", "qiongtong"],
    pathIds: ["bazi-spine"],
    keywords: ["月令", "季节", "旺衰", "气势"],
  },
  {
    id: "yongshen",
    term: "用神",
    category: "命理骨架",
    reading: "yong shen",
    summary: "不是万能答案，而是一局判断里最需要抓住的作用点。",
    plain: "用神要回到问题和结构：这一局最需要什么力量来成事或解结。",
    avoid: "不要把用神当固定喜忌，也不要不看月令、格局和问题场景。",
    practice: "每次看到“用神”，追问三句：为何用、用来做什么、条件是否成立。",
    relatedTerms: ["月令", "格局", "六爻"],
    classicIds: ["ziping-zhenquan", "zengshan-buyi"],
    pathIds: ["bazi-spine", "liuyao-question"],
    keywords: ["用神", "取用", "主次", "判断点"],
  },
  {
    id: "geju",
    term: "格局",
    category: "命理骨架",
    reading: "ge ju",
    summary: "一组力量关系形成的判断框架，不只是名称表。",
    plain: "格局帮助人从散乱信息里看主线：谁主事，谁成局，谁破局。",
    avoid: "不要只背格局名，更不要一见名词就直接断吉凶。",
    practice: "把一个格局拆成主气、辅助、阻碍、成败条件四栏。",
    relatedTerms: ["月令", "用神", "气势"],
    classicIds: ["ziping-zhenquan", "ditiansui"],
    pathIds: ["bazi-spine"],
    keywords: ["格局", "主线", "成败", "条件"],
  },
  {
    id: "qishi",
    term: "气势",
    category: "命理骨架",
    reading: "qi shi",
    summary: "全局力量的来处、去处、强弱和流通方向。",
    plain: "读口诀之前先看气势，才知道一句话在什么条件下成立。",
    avoid: "不要只看旺衰数字，也不要把气势读成单点强弱。",
    practice: "用箭头写出一局里力量从哪里来、往哪里去、在哪里被堵住。",
    relatedTerms: ["格局", "调候", "五行"],
    classicIds: ["ditiansui", "ziping-zhenquan"],
    pathIds: ["bazi-spine"],
    keywords: ["气势", "旺衰", "通关", "流通"],
  },
  {
    id: "tiaohou",
    term: "调候",
    category: "命理骨架",
    reading: "tiao hou",
    summary: "处理寒暖燥湿与季节状态，让五行关系能真正流通。",
    plain: "它像气候地图：同一五行在不同季节，需要的条件不一样。",
    avoid: "不要把调候机械化成固定表格，也不要脱离全局气势。",
    practice: "读《穷通宝鉴》时，先记录日主、月份、寒暖燥湿和所需条件。",
    relatedTerms: ["月令", "五行", "气势"],
    classicIds: ["qiongtong"],
    pathIds: ["bazi-spine"],
    keywords: ["调候", "寒暖", "燥湿", "月份"],
  },
  {
    id: "liuyao",
    term: "六爻",
    category: "术数问事",
    reading: "liu yao",
    summary: "围绕具体问题建立卦象、用神、动变和应期的判断方法。",
    plain: "它适合处理当下具体问题，不适合拿来替代专业决策。",
    avoid: "不要问题没问清就起断，也不要把结果说成绝对承诺。",
    practice: "每次问事先写清楚：问什么、问谁、希望判断哪一个行动。",
    relatedTerms: ["用神", "动爻", "应期"],
    classicIds: ["zengshan-buyi"],
    pathIds: ["liuyao-question"],
    keywords: ["六爻", "问事", "取用", "卦象"],
  },
  {
    id: "dongyao",
    term: "动爻",
    category: "术数问事",
    reading: "dong yao",
    summary: "卦中发生变化的爻，提示事情的变化点和作用方向。",
    plain: "它像一件事里正在动的环节：哪里变化，哪里就要重点看。",
    avoid: "不要只见动爻就急断吉凶，要回到用神、世应和问题。",
    practice: "复盘一次问事时，记录动爻对应的现实变化是什么。",
    relatedTerms: ["六爻", "用神", "应期"],
    classicIds: ["zengshan-buyi"],
    pathIds: ["liuyao-question"],
    keywords: ["动爻", "变化", "世应", "变卦"],
  },
  {
    id: "yingqi",
    term: "应期",
    category: "术数问事",
    reading: "ying qi",
    summary: "事情可能显现、转折或验证的时间线索。",
    plain: "应期不是保证，而是把判断放到时间里等待验证。",
    avoid: "不要把应期说成绝对日期，也不要省略后续复盘。",
    practice: "问事后记录预测时间、实际发生时间和偏差原因。",
    relatedTerms: ["六爻", "动爻", "干支"],
    classicIds: ["zengshan-buyi"],
    pathIds: ["liuyao-question"],
    keywords: ["应期", "时间", "验证", "复盘"],
  },
  {
    id: "jiugong",
    term: "九宫",
    category: "术数问事",
    reading: "jiu gong",
    summary: "奇门中承载方位、局势和关系落点的空间骨架。",
    plain: "先把宫位当作结构位置，再看门、星、神、干落在哪里。",
    avoid: "不要只背宫位象意，也不要不看组合关系单断。",
    practice: "整理奇门笔记时，先给每条材料标出宫位和对应关键词。",
    relatedTerms: ["八门", "格局", "干支"],
    classicIds: ["qimen"],
    pathIds: ["qimen-archive"],
    keywords: ["九宫", "方位", "奇门", "宫位"],
  },
  {
    id: "bamen",
    term: "八门",
    category: "术数问事",
    reading: "ba men",
    summary: "奇门中表达行动方式、出入口和事件状态的一组符号。",
    plain: "它帮助人看一件事是开、休、生，还是陷入阻滞和消耗。",
    avoid: "不要单看一个门就下结论，要和宫、星、神、干一起看。",
    practice: "给奇门资料补录时，把八门相关句子单独标关键词。",
    relatedTerms: ["九宫", "格局", "用局"],
    classicIds: ["qimen"],
    pathIds: ["qimen-archive"],
    keywords: ["八门", "开休生", "奇门", "行动"],
  },
];
