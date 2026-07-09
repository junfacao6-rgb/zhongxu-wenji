import type { BookItem } from "@/lib/site-content";

export const wenguBrand = {
  name: "问古书斋",
  subtitle: "一处安静读古籍的地方",
  description:
    "不做复杂功能，只留一方书案。在这里，按分类阅读古籍，按章节慢慢翻看，把散落的经典重新放回一条清楚的读书路径里。",
};

export const wenguCategories = [
  {
    id: "bazi",
    label: "八字古籍",
    description: "命理纲要 子平术数精要",
    keywords: ["八字", "命理", "子平", "三命", "滴天髓", "穷通", "四柱"],
  },
  {
    id: "qimen",
    label: "奇门古籍",
    description: "奇门遁甲 时空演算秘典",
    keywords: ["奇门", "遁甲"],
  },
  {
    id: "liuyao",
    label: "六爻古籍",
    description: "六爻占卜 断事明理之术",
    keywords: ["六爻", "卜筮", "断易", "八卦六爻", "黄金策"],
  },
  {
    id: "meihua",
    label: "梅花易数",
    description: "心易占断之学",
    keywords: ["梅花", "易数"],
  },
  {
    id: "daoist",
    label: "道家经典",
    description: "道法自然 修真养性之要",
    keywords: ["道家", "丹道", "参同契", "周易", "易经", "丹经", "道德经", "庄子", "老子"],
  },
  {
    id: "other",
    label: "其他典籍",
    description: "更多典籍 持续整理中",
    keywords: [],
  },
] as const;

export type WenguCategoryId = typeof wenguCategories[number]["id"];

export function getWenguCategory(book: BookItem) {
  const text = [book.title, book.subtitle, book.category, book.description, ...book.tags].join(" ");
  const matched = wenguCategories.find((category) => {
    if (category.id === "other") return false;
    return category.keywords.some((keyword) => text.includes(keyword));
  });

  return matched ?? wenguCategories[wenguCategories.length - 1];
}

export function getWenguCategoryCounts(books: BookItem[]) {
  return wenguCategories.map((category) => ({
    ...category,
    count: books.filter((book) => getWenguCategory(book).id === category.id).length,
  }));
}

export function getBooksByWenguCategory(books: BookItem[], categoryId: WenguCategoryId | "all") {
  if (categoryId === "all") return books;
  return books.filter((book) => getWenguCategory(book).id === categoryId);
}

export function getRecommendedBooks(books: BookItem[]) {
  const preferredIds = [
    "ziping-zhenquan",
    "ditiansui-chanwei",
    "sanming-tonghui",
    "huangjin-ce",
    "qimen-mingcha-zhenben",
    "daodejing",
  ];
  const preferred = preferredIds
    .map((id) => books.find((book) => book.id === id))
    .filter((book): book is BookItem => Boolean(book));
  const fallback = books.filter((book) => !preferredIds.includes(book.id));

  return [...preferred, ...fallback].slice(0, 6);
}

export function getBookReadHref(book: BookItem) {
  return `/library/${book.id}/read`;
}

export function getBookPrimaryReadHref(book: BookItem) {
  return book.sourceFile ? `/library/${book.id}/source` : getBookReadHref(book);
}

export function getReadingRecordStorageKey(bookId: string) {
  return `wengu-reading-progress:${bookId}`;
}

export function getBookAttribution(book: BookItem) {
  const known: Record<string, string> = {
    "ziping-zhenquan": "清 · 沈孝瞻",
    "ditiansui-chanwei": "明 · 刘基旧题",
    "sanming-tonghui": "明 · 万民英",
    "yuanhai-ziping": "宋 · 徐升旧题",
    "huangjin-ce": "明 · 刘基旧题",
    "bushi-zhengzong": "清 · 王洪绪旧题",
    "meihua-yishu": "宋 · 邵雍旧题",
    "qimen-mingcha-zhenben": "明刻旧本",
    "daliuren-zhinan": "六壬古籍辑本",
    "daodejing": "先秦 · 老子旧题",
    "zhuangzi": "先秦 · 庄周旧题",
  };

  return known[book.id] ?? "古籍 · 佚名辑本";
}
