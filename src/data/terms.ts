import type { Term } from "@/types/content";
import type { SubjectKey } from "@/types/platform";

type TermSeed = {
  id: string;
  name: string;
  subject: SubjectKey;
  category: string;
  plain: string;
  aliases?: string[];
  related?: string[];
  tags?: string[];
  original?: string;
  advanced?: string;
};

const termSeeds: TermSeed[] = [
  { id: "yinyang", name: "阴阳", subject: "yixue", category: "通用基础", plain: "观察事物动静、内外、消长和互根关系的基础框架。", related: ["五行", "太极"] },
  { id: "wuxing", name: "五行", subject: "yixue", category: "通用基础", plain: "木火土金水五类状态，用来描述生发、扩张、承载、收敛与流动。", related: ["阴阳", "生克"] },
  { id: "tiangan", name: "天干", subject: "yixue", category: "通用基础", plain: "甲乙丙丁戊己庚辛壬癸十个符号，用来表达时间和气的外显状态。", related: ["地支", "六十甲子"] },
  { id: "dizhi", name: "地支", subject: "yixue", category: "通用基础", plain: "子丑寅卯辰巳午未申酉戌亥十二个符号，承载季节、方位和藏干关系。", related: ["天干", "节气"] },
  { id: "bagua", name: "八卦", subject: "yixue", category: "通用基础", plain: "乾兑离震巽坎艮坤八个基本卦象，用来组织方位、象意和变化。", related: ["河图", "洛书"] },
  { id: "hetu", name: "河图", subject: "yixue", category: "通用基础", plain: "传统数理图式之一，常用于理解生成、五行和数的对应关系。", related: ["洛书", "五行"] },
  { id: "luoshu", name: "洛书", subject: "yixue", category: "通用基础", plain: "九宫数理图式，是奇门、风水等体系理解空间秩序的重要基础。", related: ["河图", "九宫"] },
  { id: "liushijiazi", name: "六十甲子", subject: "yixue", category: "通用基础", plain: "十天干与十二地支组合成六十个循环单位，用于纪年、纪月、纪日、纪时。", related: ["天干", "地支"] },
  { id: "taiji", name: "太极", subject: "yixue", category: "通用基础", plain: "表示一体未分而含万象的总根，常作为阴阳分化的起点。", related: ["阴阳", "两仪"] },
  { id: "liangyi", name: "两仪", subject: "yixue", category: "通用基础", plain: "太极分化出的阴阳两面，用来观察一件事的基本对待关系。", related: ["太极", "四象"] },
  { id: "sixiang", name: "四象", subject: "yixue", category: "通用基础", plain: "少阳、太阳、少阴、太阴四种状态，帮助理解阴阳的阶段变化。", related: ["两仪", "八卦"] },
  { id: "nayin", name: "纳音", subject: "yixue", category: "通用基础", plain: "六十甲子配属五行音律的一套传统分类，适合做辅助参考。", related: ["六十甲子", "五行"] },
  { id: "jieqi", name: "节气", subject: "yixue", category: "通用基础", plain: "二十四节气标示太阳运行与季节变化，是理解月令和时气的重要依据。", related: ["月令", "地支"] },
  { id: "fangwei", name: "方位", subject: "yixue", category: "通用基础", plain: "空间方向的基础语言，常与八卦、九宫、五行和奇门宫位对应。", related: ["八卦", "九宫"] },
  { id: "shengke", name: "生克", subject: "yixue", category: "通用基础", plain: "五行之间生成与制约的关系，用来观察力量流通和约束。", related: ["五行", "通关"] },
  { id: "jiugong", name: "九宫", subject: "qimen", category: "奇门遁甲", plain: "奇门盘中承载方位、宫位和空间关系的骨架。", related: ["洛书", "八门"] },
  { id: "bamen", name: "八门", subject: "qimen", category: "奇门遁甲", plain: "休生伤杜景死惊开八门，常用于观察行动方式与事件状态。", related: ["九宫", "值使"] },
  {
    id: "jingmen",
    name: "景门",
    subject: "qimen",
    category: "奇门遁甲",
    plain: "适合表达、曝光、考试、发文、直播、汇报等和信息展示有关的事项。",
    related: ["八门", "九宫", "门迫", "空亡"],
    tags: ["奇门遁甲", "八门", "传播", "展示"],
    original: "景门为八门之一，主文书、信息、光明、传播、展示，也常关联考试、文章、影像与公开表达。",
    advanced: "盘理上，景门若得生、临吉星吉格，则较利传播展示；若受克、入墓、空亡，则表达受阻、信息不明或成效偏弱，需结合宫位、星神和用神一并参考。",
  },
  { id: "jiuxing", name: "九星", subject: "qimen", category: "奇门遁甲", plain: "奇门盘中表达天时、气象和倾向的一组符号。", related: ["值符", "九宫"] },
  { id: "bashen", name: "八神", subject: "qimen", category: "奇门遁甲", plain: "值符、腾蛇、太阴、六合、白虎、玄武、九地、九天，辅助观察象意。", related: ["值符", "九宫"] },
  { id: "sanqi", name: "三奇", subject: "qimen", category: "奇门遁甲", plain: "乙、丙、丁三奇，常用于观察可用之机和特殊组合。", related: ["六仪", "格局"] },
  { id: "liuyi", name: "六仪", subject: "qimen", category: "奇门遁甲", plain: "戊、己、庚、辛、壬、癸六仪，和三奇一起构成奇门干的基础。", related: ["三奇", "天盘"] },
  { id: "zhifu", name: "值符", subject: "qimen", category: "奇门遁甲", plain: "奇门盘中的主星或八神之首，常作为全局重点参考。", related: ["九星", "八神"] },
  { id: "zhishi", name: "值使", subject: "qimen", category: "奇门遁甲", plain: "值使门代表当局中需要重点观察的门，常关联行动入口。", related: ["八门", "值符"] },
  { id: "kongwang", name: "空亡", subject: "qimen", category: "奇门遁甲", plain: "表示某些信息或力量暂时落空，判断时应谨慎确认条件。", related: ["旬空", "九宫"] },
  { id: "maxing", name: "马星", subject: "qimen", category: "奇门遁甲", plain: "提示移动、变动、奔走和时机转移的辅助符号。", related: ["方位", "择时"] },
  { id: "menpo", name: "门迫", subject: "qimen", category: "奇门遁甲", plain: "门与宫之间出现受迫状态，常提示行动受限或成本增加。", related: ["八门", "九宫"] },
  { id: "rumu", name: "入墓", subject: "qimen", category: "奇门遁甲", plain: "符号落入墓地状态，常用于提示收束、迟滞或不宜强行推进。", related: ["天干", "九宫"] },
  { id: "fanyin", name: "反吟", subject: "qimen", category: "奇门遁甲", plain: "盘面呈现反复或对冲之象，适合提示调整节奏。", related: ["伏吟", "格局"] },
  { id: "fuyin", name: "伏吟", subject: "qimen", category: "奇门遁甲", plain: "盘面呈现停滞或重复之象，常建议先稳住而非急动。", related: ["反吟", "格局"] },
  { id: "tianpan", name: "天盘", subject: "qimen", category: "奇门遁甲", plain: "奇门盘中用于表达上层变化和天时信息的层面。", related: ["地盘", "人盘"] },
  { id: "dipan", name: "地盘", subject: "qimen", category: "奇门遁甲", plain: "奇门盘中相对稳定的底层位置，可辅助判断落点。", related: ["天盘", "九宫"] },
  { id: "renpan", name: "人盘", subject: "qimen", category: "奇门遁甲", plain: "多用于观察人事行动层面的关系，需结合门星神共同判断。", related: ["天盘", "八门"] },
  { id: "shenpan", name: "神盘", subject: "qimen", category: "奇门遁甲", plain: "以八神为核心的象意层，适合辅助观察态势和风险。", related: ["八神", "值符"] },
  { id: "qimen-yongshen", name: "用神", subject: "qimen", category: "奇门遁甲", plain: "在奇门问题中选取的观察中心，需根据所问对象和场景确定。", related: ["九宫", "八门"] },
  { id: "qimen-geju", name: "格局", subject: "qimen", category: "奇门遁甲", plain: "奇门符号之间形成的组合关系，用于提示结构倾向和可用条件。", related: ["三奇", "六仪"] },
  { id: "rizhu", name: "日主", subject: "bazi", category: "八字命理", plain: "八字日干，常作为观察命局结构的中心点。", related: ["十神", "月令"] },
  { id: "yueling", name: "月令", subject: "bazi", category: "八字命理", plain: "出生月份对应的节令之气，是判断旺衰和格局的重要依据。", related: ["节气", "旺衰"] },
  { id: "shishen", name: "十神", subject: "bazi", category: "八字命理", plain: "以日主为中心建立的十类关系，用于观察人事、资源和行动倾向。", related: ["日主", "天干"] },
  { id: "bazi-geju", name: "格局", subject: "bazi", category: "八字命理", plain: "命局力量形成的主要结构，不宜只看名称，应看条件是否成立。", related: ["月令", "用神"] },
  { id: "tiaohou", name: "调候", subject: "bazi", category: "八字命理", plain: "处理寒暖燥湿和季节状态，使五行关系更容易流通。", related: ["月令", "五行"] },
  { id: "bazi-yongshen", name: "用神", subject: "bazi", category: "八字命理", plain: "命局中为成局、平衡或解决问题而重点观察的作用点。", related: ["格局", "月令"] },
  { id: "xishen", name: "喜神", subject: "bazi", category: "八字命理", plain: "对结构有帮助的倾向性力量，应结合命局条件判断。", related: ["用神", "忌神"] },
  { id: "jishen", name: "忌神", subject: "bazi", category: "八字命理", plain: "对结构形成干扰或加重偏失的力量，不能脱离全局单看。", related: ["喜神", "用神"] },
  { id: "wangshuai", name: "旺衰", subject: "bazi", category: "八字命理", plain: "观察力量强弱和时令支持程度的基础，不等于简单数量统计。", related: ["月令", "气势"] },
  { id: "tongguan", name: "通关", subject: "bazi", category: "八字命理", plain: "在相克或阻滞关系中引入中介力量，使气势较顺畅。", related: ["生克", "五行"] },
  { id: "congge", name: "从格", subject: "bazi", category: "八字命理", plain: "命局顺从某一类强势力量的特殊结构，需要严格条件判断。", related: ["格局", "旺衰"] },
  { id: "dayun", name: "大运", subject: "bazi", category: "八字命理", plain: "较长周期的运势背景，用于观察阶段性环境变化。", related: ["流年", "干支"] },
  { id: "liunian", name: "流年", subject: "bazi", category: "八字命理", plain: "一年时间中的干支气象，需结合原局和大运参考。", related: ["大运", "六十甲子"] },
  { id: "canggan", name: "藏干", subject: "bazi", category: "八字命理", plain: "地支中所藏天干，帮助理解地支内部力量。", related: ["地支", "透干"] },
  { id: "tougan", name: "透干", subject: "bazi", category: "八字命理", plain: "藏于地支的力量显露在天干，常提示信息更外显。", related: ["藏干", "天干"] },
  { id: "shiying", name: "世应", subject: "liuyao", category: "六爻纳甲", plain: "六爻卦中表示自身与对象关系的两个关键位置。", related: ["用神", "六亲"] },
  { id: "liuqin", name: "六亲", subject: "liuyao", category: "六爻纳甲", plain: "父母、兄弟、子孙、妻财、官鬼五类关系，用于定位所问对象。", related: ["用神", "世应"] },
  { id: "liushen", name: "六神", subject: "liuyao", category: "六爻纳甲", plain: "青龙、朱雀、勾陈、腾蛇、白虎、玄武，用于辅助观察象意。", related: ["六亲", "动爻"] },
  { id: "liuyao-yongshen", name: "用神", subject: "liuyao", category: "六爻纳甲", plain: "围绕具体问题选取的核心观察对象，先明所问再取用神。", related: ["六亲", "世应"] },
  { id: "dongyao", name: "动爻", subject: "liuyao", category: "六爻纳甲", plain: "卦中发生变化的爻，提示事件中正在变化的环节。", related: ["变爻", "应期"] },
  { id: "bianyao", name: "变爻", subject: "liuyao", category: "六爻纳甲", plain: "动爻变化后的结果位置，可辅助观察后续倾向。", related: ["动爻", "变卦"] },
  { id: "yuejian", name: "月建", subject: "liuyao", category: "六爻纳甲", plain: "月令在六爻中的时间力量，用于观察旺衰和环境支持。", related: ["日辰", "旺衰"] },
  { id: "richen", name: "日辰", subject: "liuyao", category: "六爻纳甲", plain: "起卦当天的日支力量，常用于判断冲合、生克和应期。", related: ["月建", "应期"] },
  { id: "xunkong", name: "旬空", subject: "liuyao", category: "六爻纳甲", plain: "在旬内暂为空亡的地支状态，判断时需看填实和出空条件。", related: ["空亡", "日辰"] },
  { id: "yingqi", name: "应期", subject: "liuyao", category: "六爻纳甲", plain: "事情可能显现或验证的时间线索，只作参考并需要复盘。", related: ["动爻", "日辰"] },
];

export const terms: Term[] = termSeeds.map((seed) => ({
  id: seed.id,
  name: seed.name,
  subject: seed.subject,
  category: seed.category,
  aliases: seed.aliases ?? [],
  originalExplanation: seed.original ?? `${seed.name}是${seed.category}中的核心术语之一，需要结合原文、场景和条件理解。`,
  plainExplanation: seed.plain,
  advancedExplanation: seed.advanced ?? `进阶学习时，应把${seed.name}放回所属体系中观察，重点记录成立条件、限制条件和可复盘证据。`,
  relatedTerms: seed.related ?? [],
  relatedSources: [],
  tags: seed.tags ?? [seed.category, seed.name],
  visibility: "public",
}));
