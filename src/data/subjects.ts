import type { SubjectKey } from "@/types/platform";

export interface SubjectMock {
  key: SubjectKey;
  name: string;
  subtitle: string;
  description: string;
  route: string;
  icon: string;
  colorTone: string;
  features: string[];
  recommendedPath: string[];
}

export const subjects: SubjectMock[] = [
  {
    key: "qimen",
    name: "奇门遁甲",
    subtitle: "时空结构、格局判断与择时参考",
    description: "从九宫、八门、九星、八神入手，先建立盘面结构，再进入案例、择时和复盘。",
    route: "/subjects/qimen",
    icon: "compass",
    colorTone: "teal",
    features: ["九宫八门", "专业排盘", "一事择时", "报告预览"],
    recommendedPath: ["九宫定位", "八门象意", "格局条件", "择时复盘"],
  },
  {
    key: "bazi",
    name: "八字命理",
    subtitle: "从五行十神到格局用神",
    description: "以阴阳五行、天干地支、十神、月令为基础，逐步进入旺衰、格局、调候和案例学习。",
    route: "/subjects/bazi",
    icon: "calendar-days",
    colorTone: "cinnabar",
    features: ["阴阳五行", "十神体系", "格局用神", "案例学习"],
    recommendedPath: ["五行基础", "十神关系", "月令旺衰", "格局调候"],
  },
  {
    key: "liuyao",
    name: "六爻纳甲",
    subtitle: "问事流程、用神动变与复盘",
    description: "围绕起卦、装卦、六亲、世应、用神、动变和应期建立可复盘的问事路径。",
    route: "/subjects/liuyao",
    icon: "hexagon",
    colorTone: "ochre",
    features: ["起卦装卦", "六亲六神", "用神动变", "应期复盘"],
    recommendedPath: ["明确所问", "装卦基础", "取用神", "动变应期"],
  },
  {
    key: "meihua",
    name: "梅花易数",
    subtitle: "象数体用、触机与案例",
    description: "以象数、体用、动静、触机为学习线索，强调条件、场景和复盘，不做神秘化包装。",
    route: "/subjects/meihua",
    icon: "flower",
    colorTone: "plum",
    features: ["象数基础", "体用关系", "触机方法", "案例复盘"],
    recommendedPath: ["象数入门", "体用动静", "断例拆解", "复盘记录"],
  },
  {
    key: "dao",
    name: "道家经典",
    subtitle: "原典阅读、白话注解与日用实践",
    description: "从《道德经》《庄子》等经典进入道、无为、守中、心斋等概念，建立安静的阅读与修身路径。",
    route: "/subjects/dao",
    icon: "scroll-text",
    colorTone: "ink",
    features: ["经典阅读", "白话注解", "术语卡", "日用实践"],
    recommendedPath: ["道德经短读", "庄子选读", "术语理解", "日课省察"],
  },
  {
    key: "yixue",
    name: "易学基础",
    subtitle: "阴阳、五行、八卦、干支的底层地图",
    description: "把传统术数共用的基础概念整理成可检索、可练习、可回看的学习地图。",
    route: "/subjects/yixue",
    icon: "map",
    colorTone: "jade",
    features: ["阴阳五行", "八卦河洛", "干支节气", "基础术语"],
    recommendedPath: ["阴阳两仪", "五行生克", "八卦方位", "干支节气"],
  },
];
