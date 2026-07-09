import type { QimenDeity, QimenDoor, QimenStar } from "@/types/qimen";

export type QimenEventCategory = "事业工作" | "财务经营" | "学习考试" | "内容创作" | "人际沟通" | "出行行动";

export interface QimenEventScoringWeights {
  base: number;
  door: number;
  star: number;
  deity: number;
  positivePattern: number;
  negativePattern: number;
}

export interface EventRule {
  id: string;
  category: QimenEventCategory;
  name: string;
  description: string;
  favorableDoors: QimenDoor[];
  unfavorableDoors: QimenDoor[];
  favorableStars: QimenStar[];
  unfavorableStars: QimenStar[];
  favorableDeities: QimenDeity[];
  unfavorableDeities: QimenDeity[];
  mainUseGods: string[];
  positivePatterns: string[];
  negativePatterns: string[];
  scoringWeights: QimenEventScoringWeights;
  plainAdviceTemplate: string;
  professionalExplanationTemplate: string;
  riskDisclaimer: string;
}

type EventRuleSeed = {
  name: string;
  description: string;
  favorableDoors?: QimenDoor[];
  unfavorableDoors?: QimenDoor[];
  favorableStars?: QimenStar[];
  unfavorableStars?: QimenStar[];
  favorableDeities?: QimenDeity[];
  unfavorableDeities?: QimenDeity[];
  mainUseGods?: string[];
  positivePatterns?: string[];
  negativePatterns?: string[];
  scoringWeights?: Partial<QimenEventScoringWeights>;
  riskNote?: string;
};

type CategoryDefaults = Omit<EventRuleSeed, "name" | "description" | "riskNote"> & {
  idPrefix: string;
  scoringWeights: QimenEventScoringWeights;
  plainAdviceTemplate: string;
  professionalExplanationTemplate: string;
  riskDisclaimer: string;
};

const standardWeights: QimenEventScoringWeights = {
  base: 50,
  door: 14,
  star: 10,
  deity: 8,
  positivePattern: 10,
  negativePattern: 12,
};

const categoryDefaults: Record<QimenEventCategory, CategoryDefaults> = {
  事业工作: {
    idPrefix: "career",
    favorableDoors: ["开门", "生门", "休门"],
    unfavorableDoors: ["死门", "惊门"],
    favorableStars: ["天心", "天辅", "天任"],
    unfavorableStars: ["天蓬", "天芮"],
    favorableDeities: ["值符", "六合", "九天", "太阴"],
    unfavorableDeities: ["白虎", "玄武", "腾蛇"],
    mainUseGods: ["日干", "值使门", "开门", "所往方位"],
    positivePatterns: ["结构可用"],
    negativePatterns: ["慎动宜察", "条件待明"],
    scoringWeights: standardWeights,
    plainAdviceTemplate: "今日结构偏向以沟通、推进和条件确认作为重点，较适合先把{{eventName}}的目标、对象和边界写清楚。",
    professionalExplanationTemplate: "{{eventName}}以门为行动入口，以星看事务状态，以神看外部配合度；当前参考宫为{{palaceName}}，需结合{{door}}、{{star}}、{{deity}}综合判断。",
    riskDisclaimer: "事业工作类事项仍应以现实岗位、合同、组织流程和专业意见为准，奇门结果只作传统文化学习参考。",
  },
  财务经营: {
    idPrefix: "finance",
    favorableDoors: ["生门", "开门", "休门"],
    unfavorableDoors: ["死门", "惊门"],
    favorableStars: ["天任", "天心", "天辅"],
    unfavorableStars: ["天蓬", "天芮", "天柱"],
    favorableDeities: ["值符", "六合", "九地", "太阴"],
    unfavorableDeities: ["白虎", "玄武", "腾蛇"],
    mainUseGods: ["生门", "日干", "财务方位", "交易对象"],
    positivePatterns: ["结构可用"],
    negativePatterns: ["慎动宜察", "条件待明"],
    scoringWeights: { ...standardWeights, door: 16, negativePattern: 14 },
    plainAdviceTemplate: "今日结构偏向先做账目、授权和交易边界核对，{{eventName}}可作为参考安排，但不宜忽略现实风险。",
    professionalExplanationTemplate: "{{eventName}}重视生门、开门与稳定星神的配合；当前参考宫{{palaceName}}显示{{door}}、{{star}}、{{deity}}共同构成可观察条件。",
    riskDisclaimer: "财务、投资、买房、付款等事项不构成投资或交易建议，必须以合同、现金流、法律和专业财务意见为准。",
  },
  学习考试: {
    idPrefix: "study",
    favorableDoors: ["景门", "休门", "杜门", "开门"],
    unfavorableDoors: ["死门", "惊门"],
    favorableStars: ["天辅", "天心", "天英"],
    unfavorableStars: ["天蓬", "天芮"],
    favorableDeities: ["值符", "太阴", "六合"],
    unfavorableDeities: ["白虎", "玄武", "腾蛇"],
    mainUseGods: ["景门", "天辅", "文书材料", "本人日干"],
    positivePatterns: ["结构可用"],
    negativePatterns: ["慎动宜察", "条件待明"],
    scoringWeights: { ...standardWeights, star: 12 },
    plainAdviceTemplate: "今日结构偏向安静学习、材料整理和表达校准，{{eventName}}宜先看准备程度，再看时机。",
    professionalExplanationTemplate: "{{eventName}}以天辅、景门、文书信息为重点；当前参考宫{{palaceName}}可用于观察学习、表达和材料递交条件。",
    riskDisclaimer: "考试、面试、提交材料等结果取决于真实准备、规则和评审标准，奇门结果只作复盘和行动参考。",
  },
  内容创作: {
    idPrefix: "content",
    favorableDoors: ["景门", "开门", "生门"],
    unfavorableDoors: ["死门", "惊门"],
    favorableStars: ["天英", "天辅", "天心"],
    unfavorableStars: ["天蓬", "天芮", "天柱"],
    favorableDeities: ["九天", "六合", "值符", "太阴"],
    unfavorableDeities: ["白虎", "玄武", "腾蛇"],
    mainUseGods: ["景门", "开门", "平台方位", "受众"],
    positivePatterns: ["结构可用"],
    negativePatterns: ["慎动宜察", "条件待明"],
    scoringWeights: { ...standardWeights, door: 16, star: 12 },
    plainAdviceTemplate: "今日结构偏向表达、展示和内容整理，{{eventName}}较适合先检查标题、版权和受众边界。",
    professionalExplanationTemplate: "{{eventName}}以景门、天英和九天等传播象为重点；当前参考宫{{palaceName}}显示传播条件需要结合门星神干判断。",
    riskDisclaimer: "内容发布不得使用夸张承诺或绝对化预测话术，涉及版权、医疗、法律、投资等内容必须保持合规边界。",
  },
  人际沟通: {
    idPrefix: "relationship",
    favorableDoors: ["开门", "休门", "生门", "景门"],
    unfavorableDoors: ["死门"],
    favorableStars: ["天辅", "天心", "天任"],
    unfavorableStars: ["天蓬", "天芮"],
    favorableDeities: ["六合", "太阴", "值符"],
    unfavorableDeities: ["白虎", "玄武", "腾蛇"],
    mainUseGods: ["日干", "对方", "开门", "六合"],
    positivePatterns: ["结构可用"],
    negativePatterns: ["慎动宜察", "条件待明"],
    scoringWeights: standardWeights,
    plainAdviceTemplate: "今日结构偏向先降低误会、明确立场，{{eventName}}建议使用温和、可回旋的表达。",
    professionalExplanationTemplate: "{{eventName}}需看自身、对方和沟通入口；当前参考宫{{palaceName}}的{{door}}、{{star}}、{{deity}}可作为沟通条件参考。",
    riskDisclaimer: "人际、情感、矛盾处理不替代心理、法律、婚姻或专业调解意见，行动前应尊重对方边界和现实规则。",
  },
  出行行动: {
    idPrefix: "travel",
    favorableDoors: ["开门", "休门", "生门"],
    unfavorableDoors: ["死门", "惊门", "杜门"],
    favorableStars: ["天心", "天任", "天辅"],
    unfavorableStars: ["天蓬", "天芮", "天柱"],
    favorableDeities: ["九天", "六合", "值符", "九地"],
    unfavorableDeities: ["白虎", "玄武", "腾蛇"],
    mainUseGods: ["开门", "马星", "所往方位", "日干"],
    positivePatterns: ["结构可用"],
    negativePatterns: ["慎动宜察", "条件待明"],
    scoringWeights: { ...standardWeights, door: 15 },
    plainAdviceTemplate: "今日结构偏向先核实路线、预约和安全条件，{{eventName}}可作为参考安排，不宜冒进。",
    professionalExplanationTemplate: "{{eventName}}重视开门、马星、方位和外部配合；当前参考宫{{palaceName}}用于观察行动顺畅度和风险提示。",
    riskDisclaimer: "出行、求医、重要会面等事项应以交通、天气、医疗和现实安全规则为准，奇门结果只作行动参考。",
  },
};

const eventSeeds: Record<QimenEventCategory, EventRuleSeed[]> = {
  事业工作: [
    { name: "求职面试", description: "用于安排求职面试、复试沟通和自我展示。", favorableDoors: ["开门", "景门", "休门"], favorableStars: ["天辅", "天英", "天心"], mainUseGods: ["本人日干", "面试方", "景门", "开门"] },
    { name: "谈合作", description: "用于合作洽谈、初步共识和资源协同。", favorableDoors: ["开门", "生门", "休门"], favorableDeities: ["六合", "值符", "太阴"], mainUseGods: ["合作方", "开门", "六合"] },
    { name: "见客户", description: "用于客户拜访、需求沟通和方案说明。", favorableDoors: ["开门", "景门", "生门"], favorableStars: ["天英", "天辅", "天心"], mainUseGods: ["客户", "开门", "景门"] },
    { name: "拜访领导", description: "用于向上沟通、汇报、请示和争取支持。", favorableDoors: ["开门", "休门", "景门"], favorableDeities: ["值符", "太阴", "六合"], mainUseGods: ["值符", "领导", "本人日干"] },
    { name: "递交方案", description: "用于提交计划书、方案和正式材料。", favorableDoors: ["景门", "开门", "杜门"], favorableStars: ["天辅", "天心", "天英"], mainUseGods: ["文书材料", "景门", "天辅"] },
    { name: "签约合同", description: "用于签署协议、合同和关键承诺。", favorableDoors: ["开门", "生门", "休门"], unfavorableDoors: ["死门", "惊门", "伤门"], favorableStars: ["天心", "天任", "天辅"], mainUseGods: ["合同", "开门", "日干"], riskNote: "签约必须以法律文本、授权主体和真实条款为准。" },
    { name: "谈加薪", description: "用于薪酬沟通、岗位价值表达和待遇协商。", favorableDoors: ["开门", "生门", "景门"], favorableStars: ["天英", "天心", "天辅"], mainUseGods: ["本人日干", "领导", "开门", "生门"] },
    { name: "启动项目", description: "用于项目启动、立项和第一阶段推进。", favorableDoors: ["开门", "生门", "休门"], favorableDeities: ["九天", "值符", "六合"], mainUseGods: ["项目", "开门", "值使门"] },
    { name: "开业开工", description: "用于开业、开工、正式启动和对外宣布。", favorableDoors: ["开门", "生门", "景门"], unfavorableDoors: ["死门", "惊门", "杜门"], favorableDeities: ["九天", "值符", "六合"], mainUseGods: ["开门", "生门", "所往方位"] },
    { name: "竞标竞聘", description: "用于竞标、竞聘、公开竞争和展示实力。", favorableDoors: ["开门", "景门", "伤门"], unfavorableDoors: ["死门", "杜门"], favorableStars: ["天英", "天心", "天辅"], mainUseGods: ["景门", "竞争方", "本人日干"] },
  ],
  财务经营: [
    { name: "收款催款", description: "用于款项提醒、回款沟通和账期推进。", favorableDoors: ["开门", "生门", "伤门"], favorableStars: ["天心", "天任"], mainUseGods: ["生门", "对方", "账款"] },
    { name: "发售卖文案", description: "用于发布销售文案、转化说明和促销内容。", favorableDoors: ["景门", "开门", "生门"], favorableStars: ["天英", "天辅"], favorableDeities: ["九天", "六合"], mainUseGods: ["景门", "受众", "产品"] },
    { name: "上架产品", description: "用于产品上架、店铺更新和商品展示。", favorableDoors: ["生门", "开门", "景门"], favorableStars: ["天任", "天英", "天心"], mainUseGods: ["产品", "生门", "平台"] },
    { name: "开课售卖", description: "用于课程开售、招生说明和付费转化。", favorableDoors: ["景门", "生门", "开门"], favorableStars: ["天英", "天辅", "天心"], mainUseGods: ["课程", "景门", "受众"] },
    { name: "合伙沟通", description: "用于合伙事项、权益边界和合作规则沟通。", favorableDoors: ["开门", "休门", "生门"], favorableDeities: ["六合", "太阴", "值符"], mainUseGods: ["合伙方", "合同", "六合"] },
    { name: "投资决策", description: "用于投资前的信息核验和风险评估。", favorableDoors: ["休门", "杜门", "开门"], unfavorableDoors: ["惊门", "死门", "伤门"], favorableStars: ["天心", "天任"], mainUseGods: ["资金", "风险", "日干"], scoringWeights: { door: 10, star: 12, negativePattern: 16 }, riskNote: "投资决策必须以专业投资意见、风险承受能力和真实数据为准。" },
    { name: "买房看房", description: "用于看房、选房、谈价和居住条件观察。", favorableDoors: ["生门", "休门", "开门"], favorableStars: ["天任", "天心"], favorableDeities: ["九地", "六合"], mainUseGods: ["房屋", "土地", "资金"] },
    { name: "重要付款", description: "用于较大金额付款、押金和尾款确认。", favorableDoors: ["休门", "生门", "开门"], unfavorableDoors: ["惊门", "死门", "伤门"], favorableStars: ["天心", "天任"], mainUseGods: ["资金", "合同", "对方"], riskNote: "付款前应确认合同、发票、授权和收款主体。" },
    { name: "账务整理", description: "用于账目核对、票据归档和财务清理。", favorableDoors: ["休门", "杜门", "生门"], favorableStars: ["天心", "天辅", "天任"], favorableDeities: ["太阴", "九地"], mainUseGods: ["账目", "资料", "生门"] },
  ],
  学习考试: [
    { name: "考试", description: "用于考试、测验和集中答题。", favorableDoors: ["景门", "休门", "开门"], favorableStars: ["天辅", "天心", "天英"], mainUseGods: ["景门", "试卷", "本人日干"] },
    { name: "面试", description: "用于升学面试、答辩面谈和表达展示。", favorableDoors: ["景门", "开门", "休门"], favorableStars: ["天英", "天辅", "天心"], mainUseGods: ["景门", "面试方", "本人日干"] },
    { name: "交作业", description: "用于提交作业、作品和阶段成果。", favorableDoors: ["景门", "杜门", "休门"], favorableStars: ["天辅", "天心"], mainUseGods: ["文书材料", "景门", "老师"] },
    { name: "写论文", description: "用于论文写作、资料整理和论证推进。", favorableDoors: ["杜门", "休门", "景门"], favorableStars: ["天辅", "天心"], favorableDeities: ["太阴", "值符"], mainUseGods: ["文书", "资料", "天辅"] },
    { name: "提交材料", description: "用于报名材料、申请材料和证明递交。", favorableDoors: ["景门", "开门", "杜门"], favorableStars: ["天辅", "天心"], mainUseGods: ["材料", "窗口", "景门"] },
    { name: "学习计划", description: "用于制定计划、排课和复习安排。", favorableDoors: ["休门", "杜门", "生门"], favorableStars: ["天辅", "天任"], favorableDeities: ["太阴", "九地"], mainUseGods: ["计划", "时间", "本人日干"] },
    { name: "拜师学习", description: "用于拜师、请教和进入课程体系。", favorableDoors: ["休门", "开门", "景门"], favorableStars: ["天辅", "天心"], favorableDeities: ["值符", "六合", "太阴"], mainUseGods: ["老师", "课程", "本人日干"] },
  ],
  内容创作: [
    { name: "发抖音", description: "用于短视频发布、曝光和互动测试。", favorableDoors: ["景门", "开门", "生门"], favorableStars: ["天英", "天辅"], favorableDeities: ["九天", "六合"], mainUseGods: ["景门", "平台", "受众"] },
    { name: "发小红书", description: "用于图文笔记、种草内容和学习分享。", favorableDoors: ["景门", "生门", "开门"], favorableStars: ["天英", "天辅"], mainUseGods: ["景门", "平台", "受众"] },
    { name: "发公众号", description: "用于长文发布、讲义分享和专业表达。", favorableDoors: ["景门", "开门", "杜门"], favorableStars: ["天英", "天辅", "天心"], mainUseGods: ["文章", "景门", "读者"] },
    { name: "写文章", description: "用于文章写作、选题展开和资料整理。", favorableDoors: ["杜门", "景门", "休门"], favorableStars: ["天辅", "天心", "天英"], favorableDeities: ["太阴", "值符"], mainUseGods: ["文书", "景门", "素材"] },
    { name: "投稿", description: "用于投稿、作品递交和外部审核。", favorableDoors: ["景门", "开门", "休门"], favorableStars: ["天英", "天辅"], mainUseGods: ["稿件", "平台", "景门"] },
    { name: "直播", description: "用于直播开场、课程直播和公开表达。", favorableDoors: ["景门", "开门", "生门"], favorableStars: ["天英", "天心"], favorableDeities: ["九天", "六合"], mainUseGods: ["景门", "观众", "开门"] },
    { name: "发布课程", description: "用于课程上线、讲义发布和学员通知。", favorableDoors: ["景门", "生门", "开门"], favorableStars: ["天辅", "天英", "天心"], mainUseGods: ["课程", "学员", "景门"] },
    { name: "发朋友圈", description: "用于轻量公告、个人表达和私域提醒。", favorableDoors: ["景门", "休门", "开门"], favorableStars: ["天英", "天辅"], mainUseGods: ["景门", "熟人关系", "内容"] },
    { name: "私域群发", description: "用于私域通知、社群发布和活动提醒。", favorableDoors: ["景门", "开门", "生门"], unfavorableDoors: ["死门", "惊门", "伤门"], favorableDeities: ["六合", "九天", "值符"], mainUseGods: ["社群", "景门", "受众"] },
    { name: "上架资料", description: "用于资料、讲义、课程附件上架。", favorableDoors: ["景门", "生门", "杜门"], favorableStars: ["天辅", "天心"], mainUseGods: ["资料", "版权", "景门"], riskNote: "上架资料必须确认版权状态，未授权资料不得公开全文。" },
  ],
  人际沟通: [
    { name: "表白", description: "用于表达心意、关系推进和柔性沟通。", favorableDoors: ["景门", "休门", "开门"], unfavorableDoors: ["死门", "惊门", "伤门"], favorableDeities: ["六合", "太阴"], mainUseGods: ["本人日干", "对方", "六合"] },
    { name: "道歉", description: "用于修复关系、说明误会和承担责任。", favorableDoors: ["休门", "开门", "景门"], unfavorableDoors: ["伤门", "惊门", "死门"], favorableDeities: ["六合", "太阴"], mainUseGods: ["对方", "开门", "六合"] },
    { name: "谈判", description: "用于利益边界、条件交换和争议协商。", favorableDoors: ["开门", "伤门", "休门"], unfavorableDoors: ["死门"], favorableStars: ["天心", "天辅"], mainUseGods: ["对方", "条件", "开门"] },
    { name: "维权", description: "用于权益维护、证据沟通和正式交涉。", favorableDoors: ["伤门", "开门", "惊门"], unfavorableDoors: ["死门", "杜门"], favorableStars: ["天心", "天辅"], unfavorableDeities: ["玄武", "腾蛇"], mainUseGods: ["证据", "对方", "伤门"], riskNote: "维权事项应优先咨询法律专业人士，保留证据并遵守程序。" },
    { name: "投诉", description: "用于反馈问题、投诉处理和责任确认。", favorableDoors: ["伤门", "惊门", "开门"], unfavorableDoors: ["死门", "杜门"], favorableStars: ["天心", "天辅"], mainUseGods: ["证据", "投诉对象", "开门"] },
    { name: "处理矛盾", description: "用于冲突降温、边界说明和复盘沟通。", favorableDoors: ["休门", "开门", "伤门"], unfavorableDoors: ["死门", "惊门"], favorableDeities: ["六合", "太阴", "值符"], mainUseGods: ["双方", "开门", "六合"] },
    { name: "求助贵人", description: "用于请教、求助和争取资源支持。", favorableDoors: ["开门", "休门", "生门"], favorableDeities: ["值符", "六合", "太阴"], mainUseGods: ["值符", "贵人", "本人日干"] },
    { name: "见重要人物", description: "用于重要会面、引荐和正式拜访。", favorableDoors: ["开门", "景门", "休门"], favorableDeities: ["值符", "六合", "太阴"], mainUseGods: ["对方", "值符", "本人日干"] },
  ],
  出行行动: [
    { name: "出门办事", description: "用于外出办理事务、窗口沟通和短途行动。", favorableDoors: ["开门", "休门", "生门"], favorableDeities: ["九天", "六合"], mainUseGods: ["开门", "所往方位", "马星"] },
    { name: "搬家", description: "用于搬迁、入宅和空间转换。", favorableDoors: ["生门", "开门", "休门"], unfavorableDoors: ["死门", "惊门", "伤门"], favorableStars: ["天任", "天心"], favorableDeities: ["九地", "六合"], mainUseGods: ["住所", "方位", "生门"] },
    { name: "看房", description: "用于看房、验房和居住条件观察。", favorableDoors: ["生门", "休门", "开门"], favorableStars: ["天任", "天心"], favorableDeities: ["九地", "六合"], mainUseGods: ["房屋", "方位", "日干"] },
    { name: "旅行", description: "用于旅行、远行和行程安排。", favorableDoors: ["开门", "休门", "生门"], unfavorableDoors: ["死门", "惊门", "杜门"], favorableDeities: ["九天", "六合"], mainUseGods: ["马星", "路线", "开门"] },
    { name: "参加活动", description: "用于出席活动、会议和公开场合。", favorableDoors: ["开门", "景门", "休门"], favorableStars: ["天英", "天辅", "天心"], mainUseGods: ["活动方", "景门", "本人日干"] },
    { name: "求医问诊", description: "用于问诊、复查和医疗咨询。", favorableDoors: ["休门", "开门", "生门"], mainUseGods: ["医生", "病症", "天心"], favorableStars: ["天心", "天辅"], favorableDeities: ["值符", "太阴"], unfavorableDoors: ["死门", "惊门", "伤门"], riskNote: "求医问诊必须以正规医疗机构和医生意见为准，奇门只作行动安排参考。" },
    { name: "重要会面", description: "用于关键人物会面、正式拜访和事务沟通。", favorableDoors: ["开门", "景门", "休门"], favorableStars: ["天心", "天辅", "天英"], favorableDeities: ["值符", "六合"], mainUseGods: ["对方", "开门", "本人日干"] },
  ],
};

export const eventCategories = Object.keys(eventSeeds) as QimenEventCategory[];

export const eventRules: EventRule[] = eventCategories.flatMap((category) =>
  eventSeeds[category].map((seed, index) => buildEventRule(category, seed, index + 1)),
);

export const eventRulesByCategory: Record<QimenEventCategory, EventRule[]> = eventCategories.reduce(
  (accumulator, category) => {
    accumulator[category] = eventRules.filter((rule) => rule.category === category);
    return accumulator;
  },
  {} as Record<QimenEventCategory, EventRule[]>,
);

export function getEventRuleById(ruleId: string) {
  return eventRules.find((rule) => rule.id === ruleId);
}

export function getEventRulesByCategory(category: QimenEventCategory) {
  return eventRulesByCategory[category];
}

function buildEventRule(category: QimenEventCategory, seed: EventRuleSeed, order: number): EventRule {
  const defaults = categoryDefaults[category];

  return {
    id: `${defaults.idPrefix}-${String(order).padStart(2, "0")}`,
    category,
    name: seed.name,
    description: seed.description,
    favorableDoors: seed.favorableDoors ?? defaults.favorableDoors ?? [],
    unfavorableDoors: seed.unfavorableDoors ?? defaults.unfavorableDoors ?? [],
    favorableStars: seed.favorableStars ?? defaults.favorableStars ?? [],
    unfavorableStars: seed.unfavorableStars ?? defaults.unfavorableStars ?? [],
    favorableDeities: seed.favorableDeities ?? defaults.favorableDeities ?? [],
    unfavorableDeities: seed.unfavorableDeities ?? defaults.unfavorableDeities ?? [],
    mainUseGods: seed.mainUseGods ?? defaults.mainUseGods ?? [],
    positivePatterns: seed.positivePatterns ?? defaults.positivePatterns ?? [],
    negativePatterns: seed.negativePatterns ?? defaults.negativePatterns ?? [],
    scoringWeights: { ...defaults.scoringWeights, ...seed.scoringWeights },
    plainAdviceTemplate: defaults.plainAdviceTemplate,
    professionalExplanationTemplate: defaults.professionalExplanationTemplate,
    riskDisclaimer: seed.riskNote ? `${defaults.riskDisclaimer} ${seed.riskNote}` : defaults.riskDisclaimer,
  };
}
