import {
  studyPathRecords,
  termIndexRecords,
  type ClassicCategory,
  type StudyPathRecord,
  type TermRecord,
} from "@/lib/culture-content";

export type DraftChapter = {
  order: string;
  title: string;
  original: string;
};

export type IntakeCheck = {
  label: string;
  ok: boolean;
  detail: string;
};

export type PathSuggestion = {
  path: StudyPathRecord;
  score: number;
  reason: string;
};

export type IntakePayloadParams = {
  title: string;
  category: ClassicCategory;
  sourceType: string;
  author?: string;
  dynasty?: string;
  edition?: string;
  sourceNote?: string;
  chapters: DraftChapter[];
  cjkCount: number;
  allKeywords: string[];
  matchedTerms: TermRecord[];
  pathSuggestions: PathSuggestion[];
  readyScore: number;
  intakeChecks: IntakeCheck[];
};

export function splitChapters(rawText: string): DraftChapter[] {
  const allLines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const headingPattern = /^(第?[一二三四五六七八九十百\d]+[章节篇卷]|卷[一二三四五六七八九十百\d]+|[0-9]{1,2}[\.、])\s*(.+)?$/;
  const firstHeadingIndex = allLines.findIndex((line) => headingPattern.test(line));
  const lines = firstHeadingIndex > 0 ? allLines.slice(firstHeadingIndex) : allLines;

  const chapters: DraftChapter[] = [];
  let current: DraftChapter | null = null;

  for (const line of lines) {
    const match = line.match(headingPattern);
    if (match) {
      if (current) chapters.push(current);
      current = {
        order: String(chapters.length + 1).padStart(2, "0"),
        title: match[2]?.trim() || match[1],
        original: line,
      };
      continue;
    }

    if (!current) {
      current = {
        order: "01",
        title: "未分章文本",
        original: line,
      };
    } else {
      current.original += `\n${line}`;
    }
  }

  if (current) chapters.push(current);
  return chapters;
}

export function countCjk(text: string) {
  return (text.match(/[\u4e00-\u9fff]/g) || []).length;
}

export function getMatchedTerms(rawText: string, detectedKeywords: readonly string[]): TermRecord[] {
  const text = rawText.toLowerCase();
  return termIndexRecords.filter((term) => {
    const values = [term.term, ...term.keywords, ...term.relatedTerms];
    return values.some((value) => text.includes(value.toLowerCase()) || detectedKeywords.includes(value));
  });
}

export function getPathSuggestions(category: ClassicCategory, matchedTerms: TermRecord[], detectedKeywords: readonly string[]): PathSuggestion[] {
  const matchedTermIds = new Set(matchedTerms.map((term) => term.id));
  const matchedPathIds = new Set(matchedTerms.flatMap((term) => term.pathIds));
  const keywordSet = new Set([...detectedKeywords, ...matchedTerms.flatMap((term) => [term.term, ...term.keywords])]);

  return studyPathRecords
    .map((path) => {
      let score = 0;
      const reasons: string[] = [];

      if (matchedPathIds.has(path.id)) {
        score += 4;
        reasons.push("术语命中");
      }

      const keywordHits = path.keywords.filter((keyword) => keywordSet.has(keyword));
      if (keywordHits.length) {
        score += keywordHits.length * 2;
        reasons.push(keywordHits.slice(0, 3).join(" / "));
      }

      if (category === "道家经典" && path.id === "dao-root") {
        score += 3;
        reasons.push("道家经典");
      }
      if (category === "命理典籍" && path.id === "bazi-spine") {
        score += 3;
        reasons.push("命理典籍");
      }
      if (category === "术数方法" && (path.id === "liuyao-question" || path.id === "qimen-archive")) {
        score += 2;
        reasons.push("术数方法");
      }
      if ((matchedTermIds.has("jiugong") || matchedTermIds.has("bamen")) && path.id === "qimen-archive") {
        score += 3;
      }

      return {
        path,
        score,
        reason: reasons.length ? reasons.join(" · ") : "可作为后续归档候选",
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export function buildIntakeChecks(title: string, category: ClassicCategory, cjkCount: number, chapters: DraftChapter[], matchedTerms: TermRecord[]): IntakeCheck[] {
  return [
    {
      label: "书名",
      ok: Boolean(title.trim()),
      detail: title.trim() ? "已填写，可进入书目索引。" : "需要先补书名。",
    },
    {
      label: "分类",
      ok: category !== "全部",
      detail: category !== "全部" ? `已归入${category}。` : "需要选择道家、命理、术数或修习分类。",
    },
    {
      label: "正文",
      ok: cjkCount >= 80,
      detail: cjkCount >= 80 ? `${cjkCount} 个汉字，适合初步拆章。` : "正文偏短，建议补足一段完整原文。",
    },
    {
      label: "章节",
      ok: chapters.length > 1,
      detail: chapters.length > 1 ? `识别到 ${chapters.length} 章。` : "暂时只有一段，后续需要人工确认卷章。",
    },
    {
      label: "术语",
      ok: matchedTerms.length > 0,
      detail: matchedTerms.length ? `命中 ${matchedTerms.length} 个术语，可进入术语玄览。` : "暂未命中术语，可手动补关键词。",
    },
  ];
}

export function getReadyScore(intakeChecks: IntakeCheck[]) {
  return Math.round((intakeChecks.filter((check) => check.ok).length / intakeChecks.length) * 100);
}

export function buildIntakeKeywords(detectedKeywords: readonly string[], matchedTerms: TermRecord[], limit = 18) {
  return Array.from(new Set([...detectedKeywords, ...matchedTerms.flatMap((term) => [term.term, ...term.keywords])])).slice(0, limit);
}

export function buildIntakePayload({
  title,
  category,
  sourceType,
  author = "",
  dynasty = "",
  edition = "",
  sourceNote = "",
  chapters,
  cjkCount,
  allKeywords,
  matchedTerms,
  pathSuggestions,
  readyScore,
  intakeChecks,
}: IntakePayloadParams) {
  return {
    book: {
      title,
      category,
      author,
      dynasty,
      edition,
    },
    source: {
      type: sourceType,
      file: "待关联本地文件",
      note: sourceNote,
    },
    index: {
      keywords: allKeywords,
      chapterCount: chapters.length,
      cjkCount,
      matchedTerms: matchedTerms.map((term) => ({
        id: term.id,
        term: term.term,
        category: term.category,
      })),
      suggestedPaths: pathSuggestions.map((item) => ({
        id: item.path.id,
        title: item.path.title,
        score: item.score,
        reason: item.reason,
      })),
      readiness: {
        score: readyScore,
        checks: intakeChecks.map((check) => ({
          label: check.label,
          ok: check.ok,
          detail: check.detail,
        })),
      },
    },
    chapters: chapters.map((chapter) => ({
      order: chapter.order,
      title: chapter.title,
      content: {
        original: chapter.original,
        translation: "待补白话",
        notes: ["待补术语、条件、误区与现代场景"],
      },
    })),
  };
}
