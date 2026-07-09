import type { BaziChart, BaziLearningCase, BaziPillar } from "@/types/bazi";

const baziTime = "2026-07-07T00:00:00.000Z";

export const baziMockChart: BaziChart = {
  id: "bazi-chart-mock-1",
  subject: "bazi",
  title: "八字学习案例 mock",
  birthTimeLabel: "示例时间，不作真实排盘",
  year: { label: "年柱", stem: "甲", branch: "子", hiddenStems: ["癸"], tenGod: "偏印" },
  month: { label: "月柱", stem: "丙", branch: "寅", hiddenStems: ["甲", "丙", "戊"], tenGod: "食神" },
  day: { label: "日柱", stem: "戊", branch: "辰", hiddenStems: ["戊", "乙", "癸"] },
  hour: { label: "时柱", stem: "辛", branch: "酉", hiddenStems: ["辛"], tenGod: "伤官" },
  dayMasterAnalysis: {
    dayMaster: "戊",
    season: "寅月 mock",
    strengthLevel: "中和",
    summary: "此处只用于学习结构展示，不代表真实命盘判断。重点观察月令、日主和十神关系。",
    evidenceRefs: [],
  },
  usefulGodAnalysis: {
    usefulGods: ["火", "土"],
    avoidGods: ["过度金水"],
    reasoning: "mock 分析显示可先从季节、日主和流通关系理解用神，不作确定性结论。",
    cautions: ["不用于个人重大决策", "不替代专业意见", "需结合真实算法和人工校验"],
    evidenceRefs: [],
  },
  luckCycles: [
    { id: "luck-1", startAge: 8, endAge: 17, stem: "丁", branch: "卯", summary: "学习阶段 mock 运势背景。" },
    { id: "luck-2", startAge: 18, endAge: 27, stem: "戊", branch: "辰", summary: "结构整理与能力积累阶段 mock。" },
  ],
  disclaimer: "本案例仅作八字学习结构示例，不替代医学、法律、投资、心理、婚姻等专业意见。",
  createdAt: baziTime,
};

export const baziLearningCaseMock: BaziLearningCase = {
  id: "bazi-case-mock-1",
  title: "从月令观察日主状态",
  topic: "月令、十神与用神的学习路径",
  pillarsLabel: "甲子年 丙寅月 戊辰日 辛酉时",
  chart: baziMockChart,
  structureHint: "寅月木气初旺，日主戊土需先看月令、透干和地支根气，再谈十神与用神。",
  learningFocus: ["月令是气势入口", "十神只在日主关系中成立", "用神需结合寒暖燥湿与流通"],
  scopeNote: "本案例只用于学习月令与日主关系，不做完整断命。",
  sourceSegmentIds: [],
  termIds: ["yueling", "rizhu", "shishen", "bazi-yongshen"],
  analysisSteps: [
    "先确认日主，不急于判断吉凶。",
    "观察月令提供的季节背景。",
    "记录十神关系，区分资源、表达、约束和财星。",
    "把用神理解为结构中的作用点，而不是固定答案。",
  ],
  reviewQuestions: ["这个案例里为什么先看月令？", "十神关系如何影响学习路径？", "哪些结论需要真实算法复核？"],
  evidenceRefs: [],
};

export const baziLearningCases: BaziLearningCase[] = [
  {
    id: "bazi-case-strong-self-wealth",
    title: "身强财旺案例",
    topic: "身强、财星与取用边界",
    pillarsLabel: "戊辰年 戊午月 戊戌日 壬子时",
    chart: createCaseChart({
      id: "bazi-chart-strong-self-wealth",
      title: "身强财旺 mock",
      birthTimeLabel: "示例四柱，不作真实排盘",
      year: pillar("年柱", "戊", "辰", ["戊", "乙", "癸"], "比肩"),
      month: pillar("月柱", "戊", "午", ["丁", "己"], "比肩"),
      day: pillar("日柱", "戊", "戌", ["戊", "辛", "丁"]),
      hour: pillar("时柱", "壬", "子", ["癸"], "偏财"),
      strengthLevel: "偏旺",
      season: "午月 mock",
      summary: "结构显示火土气势偏厚，日主根气足；财星透时，需看财能否得用、是否有食伤生财或比劫争财。",
      usefulGods: ["金", "水"],
      avoidGods: ["火土再重"],
      reasoning: "先看月令火旺生土，再看辰戌土根与壬子财星。学习重点是身强能否任财，而不是见财即作好坏判断。",
    }),
    structureHint: "月令午火助土，原局土势较重，财星壬子出现但需观察通关、流通和比劫分夺。",
    learningFocus: ["身强不等于自然得财", "财旺要看日主能否承载", "食伤生财与比劫争财需要分辨"],
    scopeNote: "只做身强财旺结构学习，不推断财富结果。",
    sourceSegmentIds: [],
    termIds: ["wangshuai", "bazi-yongshen", "shishen", "dayun"],
    analysisSteps: ["先定日主戊土。", "看午月火土气势与辰戌根气。", "观察壬子财星的位置和受制关系。", "再讨论金水作为流通与取用参考。"],
    reviewQuestions: ["为什么身强仍要看财星是否清？", "比劫重时财星可能出现哪些学习问题？", "大运流年介入后应先看什么？"],
    evidenceRefs: [],
  },
  {
    id: "bazi-case-weak-self-strong-killing",
    title: "身弱杀旺案例",
    topic: "七杀、印星与身弱承压",
    pillarsLabel: "乙卯年 庚申月 甲申日 辛未时",
    chart: createCaseChart({
      id: "bazi-chart-weak-self-strong-killing",
      title: "身弱杀旺 mock",
      birthTimeLabel: "示例四柱，不作真实排盘",
      year: pillar("年柱", "乙", "卯", ["乙"], "劫财"),
      month: pillar("月柱", "庚", "申", ["庚", "壬", "戊"], "七杀"),
      day: pillar("日柱", "甲", "申", ["庚", "壬", "戊"]),
      hour: pillar("时柱", "辛", "未", ["己", "丁", "乙"], "正官"),
      strengthLevel: "偏弱",
      season: "申月 mock",
      summary: "结构显示金气当令，官杀偏重，甲木日主受压；学习重点在杀印相生、制杀与扶身条件。",
      usefulGods: ["水", "木"],
      avoidGods: ["金再重"],
      reasoning: "先看申月金旺，再看庚辛透出与甲木受制。若无印化杀或比劫扶身，结构压力较明显。",
    }),
    structureHint: "申月金旺，庚辛并见，日主甲木偏弱，需先看印星是否能化杀、生身，再谈格局可用条件。",
    learningFocus: ["七杀需看制化", "身弱先看承载能力", "印星不是口号，要看位置和力量"],
    scopeNote: "只做身弱杀旺结构拆解，不做个人命运判断。",
    sourceSegmentIds: [],
    termIds: ["shishen", "yueling", "wangshuai", "bazi-geju"],
    analysisSteps: ["确认甲木日主。", "看申月金旺与庚辛透出。", "查原局水印和木根是否足以承压。", "记录杀印相生或制杀成立条件。"],
    reviewQuestions: ["为什么杀旺不能直接下结论？", "印星在何处才更有力？", "原局与运年如何共同观察压力变化？"],
    evidenceRefs: [],
  },
  {
    id: "bazi-case-cold-wood-seeks-sun",
    title: "寒木向阳案例",
    topic: "寒暖、调候与木气生发",
    pillarsLabel: "癸亥年 甲子月 乙卯日 丙午时",
    chart: createCaseChart({
      id: "bazi-chart-cold-wood-seeks-sun",
      title: "寒木向阳 mock",
      birthTimeLabel: "示例四柱，不作真实排盘",
      year: pillar("年柱", "癸", "亥", ["壬", "甲"], "偏印"),
      month: pillar("月柱", "甲", "子", ["癸"], "劫财"),
      day: pillar("日柱", "乙", "卯", ["乙"]),
      hour: pillar("时柱", "丙", "午", ["丁", "己"], "伤官"),
      strengthLevel: "中和",
      season: "子月 mock",
      summary: "结构显示冬令水寒，乙木虽有根与印，但寒湿偏重；丙火透时，有调候向阳之意。",
      usefulGods: ["火", "木"],
      avoidGods: ["水寒过重"],
      reasoning: "先看子月寒水，再看卯根与丙午火。学习重点是寒暖燥湿对结构成败的影响。",
    }),
    structureHint: "子月寒水为背景，乙木得卯根但需火暖，丙午可作为调候与气机生发的学习点。",
    learningFocus: ["调候先看季节寒暖", "有根不等于气机已舒展", "火在寒木案例中常是关键观察点"],
    scopeNote: "只做寒木调候学习，不做性格或人生结论。",
    sourceSegmentIds: [],
    termIds: ["tiaohou", "yueling", "wuxing", "bazi-yongshen"],
    analysisSteps: ["先看子月寒湿。", "确认乙木日主与卯根。", "观察丙午火是否能暖局。", "再讨论大运流年中火土木的介入。"],
    reviewQuestions: ["为什么寒木不能只看旺衰？", "丙火在此处的作用是什么？", "若运年水再重，结构倾向会如何变化？"],
    evidenceRefs: [],
  },
  {
    id: "bazi-case-fire-dry-earth",
    title: "火炎土燥案例",
    topic: "燥热、清浊与调候",
    pillarsLabel: "丙午年 丁巳月 己未日 戊辰时",
    chart: createCaseChart({
      id: "bazi-chart-fire-dry-earth",
      title: "火炎土燥 mock",
      birthTimeLabel: "示例四柱，不作真实排盘",
      year: pillar("年柱", "丙", "午", ["丁", "己"], "正印"),
      month: pillar("月柱", "丁", "巳", ["丙", "戊", "庚"], "偏印"),
      day: pillar("日柱", "己", "未", ["己", "丁", "乙"]),
      hour: pillar("时柱", "戊", "辰", ["戊", "乙", "癸"], "劫财"),
      strengthLevel: "偏旺",
      season: "巳月 mock",
      summary: "结构显示火土偏燥，己土日主受火印生扶过多；需观察水木是否能润燥、疏土与成清。",
      usefulGods: ["水", "木"],
      avoidGods: ["火土继续加重"],
      reasoning: "先看巳月火旺，再看丙丁透出与未辰土厚。学习重点是燥湿、清浊和调候次序。",
    }),
    structureHint: "巳月火势明显，火土成片，结构偏燥，需以水润、木疏作为学习观察方向。",
    learningFocus: ["火土偏重时先看燥湿", "清浊要看五行是否流通", "调候不等于简单补水"],
    scopeNote: "只做火炎土燥结构学习，不做健康、婚姻、财务等现实判断。",
    sourceSegmentIds: [],
    termIds: ["tiaohou", "wangshuai", "bazi-yongshen", "tongguan"],
    analysisSteps: ["先定巳月火旺。", "看丙丁火与辰未土的累积。", "观察癸水藏干是否有力。", "讨论水木介入后的润燥与疏土。"],
    reviewQuestions: ["为什么火炎土燥要先谈调候？", "清浊在这个案例里如何观察？", "什么情况下水反而不易发挥作用？"],
    evidenceRefs: [],
  },
  {
    id: "bazi-case-output-generates-wealth",
    title: "食伤生财案例",
    topic: "表达、流通与财星承接",
    pillarsLabel: "庚申年 壬辰月 辛酉日 乙卯时",
    chart: createCaseChart({
      id: "bazi-chart-output-generates-wealth",
      title: "食伤生财 mock",
      birthTimeLabel: "示例四柱，不作真实排盘",
      year: pillar("年柱", "庚", "申", ["庚", "壬", "戊"], "劫财"),
      month: pillar("月柱", "壬", "辰", ["戊", "乙", "癸"], "伤官"),
      day: pillar("日柱", "辛", "酉", ["辛"]),
      hour: pillar("时柱", "乙", "卯", ["乙"], "偏财"),
      strengthLevel: "偏旺",
      season: "辰月 mock",
      summary: "结构显示辛金有根，壬水透出为食伤，乙卯财星在时柱；学习重点是食伤是否能顺生财星并形成清晰流通。",
      usefulGods: ["水", "木"],
      avoidGods: ["金土壅塞"],
      reasoning: "先看辛金根气，再看壬水食伤与乙卯财星。若水木通顺，才谈食伤生财的结构倾向。",
    }),
    structureHint: "辛金有根，壬水透出，乙卯财星有位置，重点在金水木是否顺接，避免金土过厚造成壅塞。",
    learningFocus: ["食伤生财要看流通", "财星位置与根气需要同时看", "原局清浊影响格局成败"],
    scopeNote: "只做食伤生财结构训练，不推断事业或收入结果。",
    sourceSegmentIds: [],
    termIds: ["shishen", "bazi-geju", "tongguan", "bazi-yongshen"],
    analysisSteps: ["确认辛金日主与申酉根气。", "观察壬水食伤是否透清。", "看乙卯财星是否承接有力。", "再讨论大运流年如何影响流通。"],
    reviewQuestions: ["食伤生财为什么要重视顺序？", "金土壅塞会怎样影响流通？", "如何判断财星是否可承接？"],
    evidenceRefs: [],
  },
];

function createCaseChart(input: {
  id: string;
  title: string;
  birthTimeLabel: string;
  year: BaziPillar;
  month: BaziPillar;
  day: BaziPillar;
  hour: BaziPillar;
  strengthLevel: BaziChart["dayMasterAnalysis"]["strengthLevel"];
  season: string;
  summary: string;
  usefulGods: string[];
  avoidGods: string[];
  reasoning: string;
}): BaziChart {
  return {
    id: input.id,
    subject: "bazi",
    title: input.title,
    birthTimeLabel: input.birthTimeLabel,
    year: input.year,
    month: input.month,
    day: input.day,
    hour: input.hour,
    dayMasterAnalysis: {
      dayMaster: input.day.stem,
      season: input.season,
      strengthLevel: input.strengthLevel,
      summary: input.summary,
      evidenceRefs: [],
    },
    usefulGodAnalysis: {
      usefulGods: input.usefulGods,
      avoidGods: input.avoidGods,
      reasoning: input.reasoning,
      cautions: ["第一版只做学习结构", "不做完整断命", "需结合真实排盘算法和人工校验"],
      evidenceRefs: [],
    },
    luckCycles: [
      { id: `${input.id}-luck-1`, startAge: 8, endAge: 17, stem: "甲", branch: "寅", summary: "mock 大运：用于观察原局与阶段环境的关系。" },
      { id: `${input.id}-luck-2`, startAge: 18, endAge: 27, stem: "乙", branch: "卯", summary: "mock 大运：只作学习路径展示，不作现实判断。" },
    ],
    disclaimer: "本案例仅作八字学习结构示例，不替代医学、法律、投资、心理、婚姻等专业意见。",
    createdAt: baziTime,
  };
}

function pillar(label: BaziPillar["label"], stem: BaziPillar["stem"], branch: BaziPillar["branch"], hiddenStems: BaziPillar["hiddenStems"], tenGod?: BaziPillar["tenGod"]): BaziPillar {
  return { label, stem, branch, hiddenStems, tenGod };
}
