export type FiveElement = "wood" | "fire" | "earth" | "metal" | "water";

export type YinYang = "yang" | "yin";

export interface WuxingElement {
  id: FiveElement;
  symbol: string;
  color: string;
  climate: string;
  focus: string;
  produces: string;
  restrains: string;
  note: string;
}

export interface WuxingRelationResult {
  relation: "same" | "generate" | "control";
  label: string;
  direction: string;
  interpretation: string;
  advice: string[];
}

export interface HeavenlyStemInfo {
  id: string;
  symbol: string;
  pinyin: string;
  element: FiveElement;
  yinYang: YinYang;
  description: string;
}

export interface EarthlyBranchInfo {
  id: string;
  symbol: string;
  pinyin: string;
  element: FiveElement;
  yinYang: YinYang;
  hiddenStems: string[];
  season: string;
  climate: string;
  summary: string;
}

const wuxingCycle: FiveElement[] = ["wood", "fire", "earth", "metal", "water"];

export const wuxingElements: WuxingElement[] = [
  {
    id: "wood",
    symbol: "木",
    color: "#4d7c2f",
    climate: "风，春。",
    focus: "生发、连接、扩展。",
    produces: "生火",
    restrains: "克土",
    note: "木气向上，偏向增长与沟通。",
  },
  {
    id: "fire",
    symbol: "火",
    color: "#c05f2a",
    climate: "热，夏。",
    focus: "上升、照耀、行动。",
    produces: "生土",
    restrains: "克金",
    note: "火性外放，偏向传播与表现。",
  },
  {
    id: "earth",
    symbol: "土",
    color: "#a98a3f",
    climate: "湿、四季转换。",
    focus: "承载、转化、稳定。",
    produces: "生金",
    restrains: "克水",
    note: "土居中，重在联结与化解。",
  },
  {
    id: "metal",
    symbol: "金",
    color: "#d4b37a",
    climate: "秋风清。",
    focus: "收敛、判断、定界。",
    produces: "生水",
    restrains: "克木",
    note: "金性坚毅，偏向归纳与边界。",
  },
  {
    id: "water",
    symbol: "水",
    color: "#2c6ca4",
    climate: "寒、冬。",
    focus: "下行、流动、滋润。",
    produces: "生木",
    restrains: "克火",
    note: "水可下沉，偏向韧性与持续。",
  },
];

const generateMap = new Map<FiveElement, FiveElement>(
  wuxingElements.map((element, index) => {
    const nextIndex = (index + 1) % wuxingCycle.length;
    return [element.id, wuxingElements[nextIndex].id] as [FiveElement, FiveElement];
  }),
);

const controlMap = new Map<FiveElement, FiveElement>(
  wuxingElements.map((element, index) => {
    const restrainIndex = (index + 2) % wuxingCycle.length;
    return [element.id, wuxingElements[restrainIndex].id] as [FiveElement, FiveElement];
  }),
);

export function getWuxingElementLabel(id: FiveElement): string {
  return wuxingElements.find((entry) => entry.id === id)?.symbol ?? id;
}

export function getWuxingRelation(from: FiveElement, to: FiveElement): WuxingRelationResult {
  if (from === to) {
    return {
      relation: "same",
      label: "同类",
      direction: `${getWuxingElementLabel(from)} ↔ ${getWuxingElementLabel(to)}`,
      interpretation: "同类相生相助，结构稳定，但也会放大同类的特性。",
      advice: ["先看能量是否平衡", "引入第三项调和", "避免重复叠加强化偏差"],
    };
  }

  const producesTo = generateMap.get(from);
  if (producesTo === to) {
    return {
      relation: "generate",
      label: "生",
      direction: `${getWuxingElementLabel(from)} → ${getWuxingElementLabel(to)}`,
      interpretation: "有生助关系，前者支持后者；但过强时会被后端拉消耗。",
      advice: ["适合用来启动", "关注是否有疲劳累积", "避免单向过度加码"],
    };
  }

  const isControlledByFrom = controlMap.get(from);
  if (isControlledByFrom === to) {
    return {
      relation: "control",
      label: "克",
      direction: `${getWuxingElementLabel(from)} ─| ${getWuxingElementLabel(to)}`,
      interpretation: "存在抑制关系，前者会压制后者，需观察替代通道。",
      advice: ["先识别哪一方承担主导", "通过中和项降低摩擦", "不建议持续加码对抗"],
    };
  }

  return {
    relation: "control",
    label: "被克",
    direction: `${getWuxingElementLabel(from)} ⇢ ${getWuxingElementLabel(to)}`,
    interpretation: "后者对前者形成克制，当前结构更偏压力场。",
    advice: ["先稳定主项", "降低外部干预频率", "用节奏而非强度来化解"],
  };
}

export const heavenlyStems: HeavenlyStemInfo[] = [
  { id: "jia", symbol: "甲", pinyin: "jiǎ", element: "wood", yinYang: "yang", description: "阳木，偏向开启与推进。" },
  { id: "yi", symbol: "乙", pinyin: "yǐ", element: "wood", yinYang: "yin", description: "阴木，偏向布局与柔韧处理。" },
  { id: "bing", symbol: "丙", pinyin: "bǐng", element: "fire", yinYang: "yang", description: "阳火，偏向展示与表达。" },
  { id: "ding", symbol: "丁", pinyin: "dīng", element: "fire", yinYang: "yin", description: "阴火，偏向温和引导。" },
  { id: "wu", symbol: "戊", pinyin: "wù", element: "earth", yinYang: "yang", description: "阳土，偏向承载与组织。" },
  { id: "ji", symbol: "己", pinyin: "jǐ", element: "earth", yinYang: "yin", description: "阴土，偏向整合和修复。" },
  { id: "geng", symbol: "庚", pinyin: "gēng", element: "metal", yinYang: "yang", description: "阳金，偏向决断与收束。" },
  { id: "xin", symbol: "辛", pinyin: "xīn", element: "metal", yinYang: "yin", description: "阴金，偏向规整与审查。" },
  { id: "ren", symbol: "壬", pinyin: "rén", element: "water", yinYang: "yang", description: "阳水，偏向扩散与行动。" },
  { id: "gui", symbol: "癸", pinyin: "guǐ", element: "water", yinYang: "yin", description: "阴水，偏向包容与沉淀。" },
];

export interface TenGodLookup {
  dayStem: HeavenlyStemInfo;
  targetStem: HeavenlyStemInfo;
  relationLabel: string;
  god: string;
  polarity: string;
  interpretation: string;
  signs: string[];
}

function getTenGodByStemRelation(
  relation: "same" | "selfGenerates" | "generatesSelf" | "selfControls" | "controlsSelf",
  samePolarity: boolean,
) {
  if (relation === "same") {
    return {
      god: samePolarity ? "比肩" : "劫财",
      interpretation: samePolarity
        ? "日主与对象同类同阴阳，容易并进也容易争抢。"
        : "同类异阴阳，常见竞争、争议，需要看情境。",
      signs: ["常见于协作与并行", "易出现比较与立场重叠", "看第三方是否可作为调节"],
    };
  }

  if (relation === "selfGenerates") {
    return {
      god: samePolarity ? "食神" : "伤官",
      interpretation: samePolarity
        ? "日主生对方，且同类，表达和输出更顺。"
        : "日主生对方且阴阳不同，输出更明显，但波动更大。",
      signs: ["适合创作、宣讲、学习分享", "可见结果可见但变动快", "避免耗泄过快"],
    };
  }

  if (relation === "generatesSelf") {
    return {
      god: samePolarity ? "正印" : "偏印",
      interpretation: samePolarity
        ? "对方生我，偏支持与资源补给。"
        : "对方生我但异类，通常表现为环境加持与保护。",
      signs: ["有利于接纳与修正", "适合做系统性的补位", "注意节奏和边界"],
    };
  }

  if (relation === "selfControls") {
    return {
      god: samePolarity ? "偏财" : "正财",
      interpretation: samePolarity
        ? "日主克对方，控制与收获并存。"
        : "日主克对方，执行感强，但回拉也会更快。",
      signs: ["适合资源整合与计划", "注意替代风险", "别把压力转成硬压"],
    };
  }

  return {
    god: samePolarity ? "偏官" : "正官",
    interpretation: samePolarity
      ? "对方克我，结构压力升高。"
      : "对方克我，多为制度、规范、外部要求增强。",
    signs: ["先认清压力来源", "先立规则再执行", "必要时设置缓冲环节"],
  };
}

const relationMap: Record<
  "same" | "selfGenerates" | "generatesSelf" | "selfControls" | "controlsSelf",
  string
> = {
  same: "同我",
  selfGenerates: "我生他",
  generatesSelf: "他生我",
  selfControls: "我克他",
  controlsSelf: "他克我",
};

export function getTenGodLookup(dayStemId: string, targetStemId: string): TenGodLookup {
  const dayStem = heavenlyStems.find((stem) => stem.id === dayStemId);
  const targetStem = heavenlyStems.find((stem) => stem.id === targetStemId);

  if (!dayStem || !targetStem) {
    return {
      dayStem: heavenlyStems[0]!,
      targetStem: heavenlyStems[1]!,
      relationLabel: "请选择",
      god: "未定义",
      polarity: "未配置",
      interpretation: "请先选择有效天干。",
      signs: ["先补齐参数再计算"],
    };
  }

  let relation: "same" | "selfGenerates" | "generatesSelf" | "selfControls" | "controlsSelf";
  if (dayStem.element === targetStem.element) {
    relation = "same";
  } else if (generateMap.get(dayStem.element) === targetStem.element) {
    relation = "selfGenerates";
  } else if (generateMap.get(targetStem.element) === dayStem.element) {
    relation = "generatesSelf";
  } else if (controlMap.get(dayStem.element) === targetStem.element) {
    relation = "selfControls";
  } else {
    relation = "controlsSelf";
  }

  const samePolarity = dayStem.yinYang === targetStem.yinYang;
  const mapped = getTenGodByStemRelation(relation, samePolarity);

  return {
    dayStem,
    targetStem,
    relationLabel: relationMap[relation],
    god: mapped.god,
    polarity: `${dayStem.symbol}-${dayStem.yinYang} ↔ ${targetStem.symbol}-${targetStem.yinYang}`,
    interpretation: mapped.interpretation,
    signs: mapped.signs,
  };
}

export const earthBranches: EarthlyBranchInfo[] = [
  { id: "zi", symbol: "子", pinyin: "zǐ", element: "water", yinYang: "yang", hiddenStems: ["gui"], season: "冬", climate: "寒", summary: "阳水主启始，偏向静化准备。"},
  { id: "chou", symbol: "丑", pinyin: "chǒu", element: "earth", yinYang: "yin", hiddenStems: ["ji", "gui", "xin"], season: "冬", climate: "阴湿", summary: "阴土为主，承载与转译并行。"},
  { id: "yin", symbol: "寅", pinyin: "yín", element: "wood", yinYang: "yang", hiddenStems: ["jia", "bing", "wu"], season: "春", climate: "温", summary: "阳木初发，重在启动与联结。"},
  { id: "mao", symbol: "卯", pinyin: "mǎo", element: "wood", yinYang: "yin", hiddenStems: ["yi"], season: "春", climate: "和润", summary: "阴木偏柔，适合蓄势和秩序化。"},
  { id: "chen", symbol: "辰", pinyin: "chén", element: "earth", yinYang: "yang", hiddenStems: ["wu", "yi", "gui"], season: "春", climate: "转温", summary: "阳土联接季节过渡，偏承接。"},
  { id: "si", symbol: "巳", pinyin: "sì", element: "fire", yinYang: "yin", hiddenStems: ["bing", "wu", "geng"], season: "夏", climate: "炎热", summary: "阴火渐旺，偏表现与外放。"},
  { id: "wu", symbol: "午", pinyin: "wǔ", element: "fire", yinYang: "yang", hiddenStems: ["ding", "ji"], season: "夏", climate: "高温", summary: "阳火最盛，外部扩张明显。"},
  { id: "wei", symbol: "未", pinyin: "wèi", element: "earth", yinYang: "yin", hiddenStems: ["ji", "yi", "ding"], season: "夏", climate: "湿热", summary: "阴土中转，重在整合与缓和。"},
  { id: "shen", symbol: "申", pinyin: "shēn", element: "metal", yinYang: "yang", hiddenStems: ["geng", "ren", "wu"], season: "秋", climate: "清凉", summary: "阳金收敛，适合收口和规范。"},
  { id: "you", symbol: "酉", pinyin: "yǒu", element: "metal", yinYang: "yin", hiddenStems: ["xin"], season: "秋", climate: "凉爽", summary: "阴金坚实，偏向规则化处理。"},
  { id: "xu", symbol: "戌", pinyin: "xū", element: "earth", yinYang: "yang", hiddenStems: ["wu", "xin", "ding"], season: "秋", climate: "晚秋", summary: "阳土回落，重整与修复并行。"},
  { id: "hai", symbol: "亥", pinyin: "hài", element: "water", yinYang: "yin", hiddenStems: ["ren", "jia"], season: "冬", climate: "寒湿", summary: "阴水内润，适合回流与沉淀。"},
];

export function getStemById(id: string): HeavenlyStemInfo | undefined {
  return heavenlyStems.find((stem) => stem.id === id || stem.symbol === id);
}

export function getEarthlyBranchById(id: string): EarthlyBranchInfo | undefined {
  return earthBranches.find((branch) => branch.id === id || branch.symbol === id);
}

export function getStemLabel(stemId: string): string {
  return getStemById(stemId)?.symbol ?? stemId;
}

export function getEarthlyBranchLabel(branchId: string): string {
  return getEarthlyBranchById(branchId)?.symbol ?? branchId;
}

export function getEarthlyBranchHiddenSummary(branchId: string): string {
  const branch = getEarthlyBranchById(branchId);
  if (!branch) return "无数据";
  if (!branch.hiddenStems.length) return "无藏干";
  return branch.hiddenStems.map((stemId) => getStemLabel(stemId)).join("、");
}

export function getYinYangLabel(value: YinYang): string {
  return value === "yang" ? "阳" : "阴";
}
