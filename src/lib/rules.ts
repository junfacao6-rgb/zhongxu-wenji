export type PlanType = "free" | "trial" | "yearly" | "premium";

export type BirthInput = {
  nickname: string;
  gender: string;
  birthDate: string;
  birthHour: string;
  birthPlace?: string;
  accurateTime: boolean;
};

export type Profile = BirthInput & {
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  hourPillar: string;
  dayMaster: string;
  dayElement: string;
  tenGod: string;
};

const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const stemElements: Record<string, string> = {
  甲: "木",
  乙: "木",
  丙: "火",
  丁: "火",
  戊: "土",
  己: "土",
  庚: "金",
  辛: "金",
  壬: "水",
  癸: "水",
};
const branchElements: Record<string, string> = {
  子: "水",
  丑: "土",
  寅: "木",
  卯: "木",
  辰: "土",
  巳: "火",
  午: "火",
  未: "土",
  申: "金",
  酉: "金",
  戌: "土",
  亥: "水",
};
const produces: Record<string, string> = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
const controls: Record<string, string> = { 木: "土", 土: "水", 水: "火", 火: "金", 金: "木" };

const lessonMap = {
  财星: {
    keyword: "资源兑现",
    suitable: ["整理资源", "处理账目", "谈合作", "产品展示"],
    unsuitable: ["冲动消费", "贪快求利", "情绪化交易", "为面子花钱"],
    summary: "今天更适合看清现实资源和价值交换，先把手里的条件盘清楚，再决定下一步。",
    career: "适合把成果、报价、案例和合作条件讲清楚，不宜为了快成交而过度让步。",
    money: "重在守住现金流和判断力，消费或投资类决定建议多留一轮确认。",
    emotion: "容易被现实压力牵动，先处理具体事项，情绪会跟着稳定。",
    relation: "合作关系可以推进，但要把边界、费用、交付说清楚。",
    content: "适合发布产品介绍、成交案例、价值展示型内容。",
    sentence: "把价值讲清楚，比急着证明自己更有力量。",
  },
  官杀: {
    keyword: "规则推进",
    suitable: ["处理责任", "做计划", "见上级客户", "推进正式事项"],
    unsuitable: ["硬刚权威", "违规冒进", "情绪对抗", "临时冲动"],
    summary: "今天有压力也有秩序，适合把事情放进规则里推进，不适合硬碰硬。",
    career: "适合提交方案、整理流程、明确职责，重要事项按规范来更稳。",
    money: "财务上谨慎签字和确认条款，避免因赶进度忽略细节。",
    emotion: "压力感会更明显，把任务拆小，比反复内耗更有效。",
    relation: "沟通里少用对抗语气，多用事实、规则和边界。",
    content: "适合发布专业型、规则型、方法论型内容。",
    sentence: "先立边界，再谈推进。",
  },
  印星: {
    keyword: "静中蓄势",
    suitable: ["学习", "复盘", "休息", "整理资料"],
    unsuitable: ["懒散拖延", "过度依赖", "想太多不行动", "逃避沟通"],
    summary: "今天不适合急着证明自己，更适合整理思路、修正计划、处理旧事。",
    career: "适合做准备工作，不适合强行推进结果。结构理顺后，后面更容易打开。",
    money: "财务上重在守，不适合因为焦虑临时下单。",
    emotion: "容易想得多、行动慢。不要急着否定自己，先把事情拆小。",
    relation: "重要沟通尽量说清楚，不要靠猜。少一点解释，多一点观察。",
    content: "适合发布复盘型、经验型、知识整理型内容。",
    sentence: "先稳住自己，机会自然会清楚。",
  },
  食伤: {
    keyword: "表达成形",
    suitable: ["表达", "发布内容", "创作", "沟通写作"],
    unsuitable: ["口快伤人", "过度输出", "顶撞规则", "情绪化表达"],
    summary: "今天适合把想法说出来、写出来、做成作品，但表达要留余地。",
    career: "适合提案、展示、内容产出和客户沟通，注意不要说得太满。",
    money: "可以展示价值，但成交动作不宜过急。",
    emotion: "灵感会比较活跃，先记录，再筛选。",
    relation: "表达欲增强，适合说清需求，也要给对方回应空间。",
    content: "适合发观点型、表达型、才华展示型内容。",
    sentence: "好表达不是用力，而是说到点上。",
  },
  比劫: {
    keyword: "主动聚力",
    suitable: ["行动", "竞争", "社交", "推进个人计划"],
    unsuitable: ["意气用事", "盲目竞争", "朋友牵扯", "冲动花钱"],
    summary: "今天行动力较强，适合主动出手，但要避免把精力花在无谓比较上。",
    career: "适合启动小任务、组局沟通、拉齐节奏，不宜硬拼消耗。",
    money: "容易因人情、面子或冲动产生支出，先看预算。",
    emotion: "自我感较强，遇到不同意见时先停一下。",
    relation: "适合社交互动和寻求协作，但边界要清楚。",
    content: "适合发互动型、个人状态型、社群型内容。",
    sentence: "主动很好，但别让消耗抢走方向。",
  },
} as const;

const colorsByElement: Record<string, string[]> = {
  木: ["青绿色", "松绿色", "米色"],
  火: ["朱砂红", "紫色", "暖橙色"],
  土: ["黄色", "棕色", "卡其色"],
  金: ["米白色", "金色", "银灰色"],
  水: ["黑色", "深蓝色", "青灰色"],
};

const directions = ["东方", "东南方", "南方", "西南方", "西方", "西北方", "北方", "东北方"];
const hexagrams = ["乾为天", "坤为地", "水雷屯", "山水蒙", "水天需", "天水讼", "地水师", "水地比", "风天小畜", "天泽履", "地天泰", "天地否"];
const events = ["谈合作", "见客户", "签合同", "发作品", "开直播", "面试", "提交方案", "启动项目", "整理账目", "谈价格", "收款催款", "表白", "约会", "解释误会", "求助贵人", "请客吃饭", "搬家", "出行", "剪发", "断舍离"];

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function hashText(text: string) {
  return Array.from(text).reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

export function ganzhi(index: number) {
  return `${stems[mod(index, 10)]}${branches[mod(index, 12)]}`;
}

export function dayGanzhi(dateText: string) {
  const date = new Date(`${dateText}T12:00:00+08:00`);
  const base = new Date("1984-02-02T12:00:00+08:00");
  const diff = Math.floor((date.getTime() - base.getTime()) / 86400000);
  return ganzhi(diff);
}

function yearGanzhi(dateText: string) {
  const year = new Date(`${dateText}T12:00:00+08:00`).getFullYear();
  return ganzhi(year - 1984);
}

function monthGanzhi(dateText: string) {
  const date = new Date(`${dateText}T12:00:00+08:00`);
  // TODO: Replace with exact solar-term month boundary calculation in phase 2.
  return ganzhi((date.getFullYear() - 1984) * 12 + date.getMonth() + 2);
}

function hourGanzhi(dayPillar: string, hourText: string) {
  const hour = Number(hourText);
  const branchIndex = mod(Math.floor((hour + 1) / 2), 12);
  const dayStemIndex = stems.indexOf(dayPillar[0]);
  return `${stems[mod(dayStemIndex * 2 + branchIndex, 10)]}${branches[branchIndex]}`;
}

export function tenGodFor(dayElement: string, flowElement: string) {
  if (flowElement === dayElement) return "比劫";
  if (produces[dayElement] === flowElement) return "食伤";
  if (produces[flowElement] === dayElement) return "印星";
  if (controls[dayElement] === flowElement) return "财星";
  return "官杀";
}

export function makeProfile(input: BirthInput): Profile {
  const dayPillar = dayGanzhi(input.birthDate);
  const dayMaster = dayPillar[0];
  const dayElement = stemElements[dayMaster];
  const flowElement = branchElements[dayPillar[1]];
  return {
    ...input,
    yearPillar: yearGanzhi(input.birthDate),
    monthPillar: monthGanzhi(input.birthDate),
    dayPillar,
    hourPillar: hourGanzhi(dayPillar, input.birthHour),
    dayMaster,
    dayElement,
    tenGod: tenGodFor(dayElement, flowElement),
  };
}

export function makeLesson(profile: Profile, dateText: string) {
  const gz = dayGanzhi(dateText);
  const flowElement = stemElements[gz[0]];
  const tenGod = tenGodFor(profile.dayElement, flowElement);
  const rule = lessonMap[tenGod as keyof typeof lessonMap];
  const branch = gz[1];
  const userBranch = profile.dayPillar[1];
  const relation =
    branches[mod(branches.indexOf(branch) + 6, 12)] === userBranch
      ? "今日地支冲动你的日支，容易有临时变化，重要决定建议慢一点。"
      : branch === userBranch
        ? "今日与日支同气，个人感受更明显，适合把节奏握在自己手里。"
        : "今日节奏相对平稳，适合按计划观察推进。";
  const colors = colorsByElement[flowElement];
  const direction = directions[hashText(profile.dayPillar + dateText) % directions.length];
  return {
    dateText,
    dayGanzhi: gz,
    tenGod,
    keyword: rule.keyword,
    summary: `${rule.summary}${relation}`,
    suitable: rule.suitable,
    unsuitable: rule.unsuitable,
    career: rule.career,
    money: rule.money,
    emotion: rule.emotion,
    relation: rule.relation,
    content: rule.content,
    colors,
    direction,
    timeRange: "09:00-11:00 / 15:00-17:00",
    sentence: rule.sentence,
  };
}

export function makeEventAdvice(profile: Profile, dateText: string, eventName: string) {
  const lesson = makeLesson(profile, dateText);
  const score = (hashText(`${profile.dayPillar}${dateText}${eventName}`) % 4);
  const levels = ["适合推进", "较适合", "可做但宜谨慎", "不宜冲动推进"];
  const selected = eventName || "提交方案";
  return {
    eventName: selected,
    level: levels[score],
    reason: `${selected}会受到“${lesson.keyword}”节奏影响，宜结合现实条件、沟通对象和时间安排判断。`,
    action: score < 2 ? "可以优先安排关键沟通，先小范围确认，再推进正式动作。" : "建议先补充信息、降低承诺强度，把准备做足再行动。",
    caution: "不要用绝对结果替代现实判断，重要事项请保留证据和备选方案。",
    recommendedTime: lesson.timeRange,
  };
}

export function makeHourAdvice(profile: Profile, dateText: string) {
  return branches.map((branch, index) => {
    const hour = `${String((index * 2 + 23) % 24).padStart(2, "0")}:00-${String((index * 2 + 1) % 24).padStart(2, "0")}:00`;
    const level = (index + hashText(profile.dayPillar + dateText)) % 3;
    return {
      name: `${stems[mod(index + hashText(dateText), 10)]}${branch}时`,
      hour,
      level: ["适合", "平稳", "谨慎"][level],
      state: level === 0 ? "适合推进小事项" : level === 1 ? "适合观察和整理" : "不宜临时争论",
      suitable: level === 0 ? "沟通、整理、确认安排" : "复盘、记录、轻量推进",
      caution: level === 2 ? "避免情绪化回应，重要决定慢一点。" : "保持节奏，不必过度用力。",
    };
  });
}

export function makeLiuyao(question: string, method: string, lostItem?: string) {
  const seed = hashText(`${question}${method}${lostItem ?? ""}${new Date().toDateString()}`);
  const base = hexagrams[seed % hexagrams.length];
  const changed = hexagrams[(seed + 5) % hexagrams.length];
  const moving = `${(seed % 6) + 1}爻`;
  const isLost = Boolean(lostItem);
  return {
    base,
    changed,
    moving,
    summary: isLost
      ? "象上偏向先近后远，优先从熟悉空间和被遮挡的位置排查。"
      : "当前事情不是完全没有机会，但过程需要补充信息，不宜马上把话说满。",
    opportunity: isLost ? "最后出现过的区域、柜边、包袋、布料或木质物附近。" : "对方或环境仍有可沟通空间，适合先确认真实意图。",
    obstacle: isLost ? "容易被压住、夹住或被其他物件遮挡。" : "信息不完整，直接推进容易产生误解或反复。",
    action: isLost
      ? "先按最后使用路径复查一遍，再看东南方、低处、角落和夹层。贵重物品请同步做现实排查，必要时报警。"
      : "先观察态度、补充信息、降低承诺强度，再决定是否继续推进。",
  };
}

export function makeBracelet(profile: Profile) {
  const element = profile.dayElement;
  const material: Record<string, string> = {
    木: "绿幽灵、东陵玉、木质珠",
    火: "南红、红玛瑙、紫水晶",
    土: "黄水晶、虎眼石、陶瓷珠",
    金: "白水晶、砗磲、银灰矿石",
    水: "黑曜石、青金石、海蓝宝",
  };
  return {
    name: `${profile.dayPillar}日柱手串`,
    keywords: `${element}气、节奏提醒、个人象征物`,
    description: `${profile.dayPillar}日主适合用${material[element]}作为日常提醒物，重点不是“改命”，而是提醒自己回到稳定节奏。`,
  };
}

export const eventOptions = events;
export const planLabels: Record<PlanType, string> = {
  free: "免费用户",
  trial: "体验会员",
  yearly: "年会员",
  premium: "高级会员",
};
