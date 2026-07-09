export type DiagramCategoryStatus = "available" | "coming-soon";

export interface DiagramCategory {
  id: string;
  title: string;
  description: string;
  href: string;
  status: DiagramCategoryStatus;
}

export interface WuxingElement {
  id: string;
  name: string;
  alias: string;
  color: string;
  climate: string;
  focus: string;
  produce: string;
  restrain: string;
}

export interface WuxingRelation {
  from: string;
  to: string;
  type: "生" | "克";
  label: string;
}

export const diagramCategories: DiagramCategory[] = [
  {
    id: "wuxing",
    title: "五行",
    description: "木火土金水五行的结构、气象与生克关系。",
    href: "/diagrams/wuxing",
    status: "available",
  },
  {
    id: "heavenly-stems",
    title: "十天干",
    description: "十天干的定位、阴阳属性与在命理中的基础作用。",
    href: "/diagrams/tiangan",
    status: "coming-soon",
  },
  {
    id: "earthly-branches",
    title: "十二地支",
    description: "地支的地支藏干、节令、方位与关系切片。",
    href: "/diagrams/dizhi",
    status: "coming-soon",
  },
  {
    id: "ten-gods",
    title: "十神",
    description: "十神关系映射和结构化阅读路径。",
    href: "/diagrams/ten-gods",
    status: "coming-soon",
  },
  {
    id: "patterns",
    title: "格局",
    description: "常见格局识别与结构对照，先上轮廓再细化。",
    href: "/diagrams/patterns",
    status: "coming-soon",
  },
  {
    id: "liuyao",
    title: "六爻",
    description: "六爻取象、变爻与问事流程图。",
    href: "/diagrams/liuyao",
    status: "coming-soon",
  },
  {
    id: "qimen",
    title: "奇门",
    description: "九宫、九星、八门、奇门流程快速理解。",
    href: "/diagrams/qimen",
    status: "coming-soon",
  },
];

export const wuxingElements: WuxingElement[] = [
  {
    id: "mu",
    name: "木",
    alias: "阳木",
    color: "#4d7c2f",
    climate: "春气，生发成长，重在舒展与往生。",
    focus: "偏向向上、向外、向外拓展，象征生长、计划、秩序展开。",
    produce: "生火，转化为行动热度。",
    restrain: "克土，抑制沉滞。",
  },
  {
    id: "huo",
    name: "火",
    alias: "阳火",
    color: "#c05f2a",
    climate: "夏季、热烈，象征照明与外化。",
    focus: "偏向显性表达、传播和决断。",
    produce: "生土，凝聚为形体。",
    restrain: "克金，推动裁决与分离。",
  },
  {
    id: "tu",
    name: "土",
    alias: "黄土",
    color: "#a98a3f",
    climate: "季节转换中的承载，重在缓冲与整合。",
    focus: "偏向包容、稳定、接地与结构。",
    produce: "生金，提取与收束。",
    restrain: "克水，阻断过度沉没。",
  },
  {
    id: "jin",
    name: "金",
    alias: "阳金",
    color: "#d4b37a",
    climate: "秋凉，收敛与斩断。",
    focus: "偏向规则、判断、定型与分边。",
    produce: "生水，入润回流。",
    restrain: "克木，收束过盛扩张。",
  },
  {
    id: "shui",
    name: "水",
    alias: "阴水",
    color: "#2c6ca4",
    climate: "冬藏，流通与涵养。",
    focus: "偏向流转、贮存与柔韧。",
    produce: "生木，润育生机。",
    restrain: "克火，熄灭过强外向。",
  },
];

export const wuxingRelations: WuxingRelation[] = [
  { from: "mu", to: "huo", type: "生", label: "木生火" },
  { from: "huo", to: "tu", type: "生", label: "火生土" },
  { from: "tu", to: "jin", type: "生", label: "土生金" },
  { from: "jin", to: "shui", type: "生", label: "金生水" },
  { from: "shui", to: "mu", type: "生", label: "水生木" },
  { from: "mu", to: "tu", type: "克", label: "木克土" },
  { from: "tu", to: "shui", type: "克", label: "土克水" },
  { from: "shui", to: "huo", type: "克", label: "水克火" },
  { from: "huo", to: "jin", type: "克", label: "火克金" },
  { from: "jin", to: "mu", type: "克", label: "金克木" },
];
