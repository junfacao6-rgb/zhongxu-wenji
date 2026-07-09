import type { QimenChart, QimenPalace, QimenReport, QimenTimingResult } from "@/types/qimen";

const qimenTime = "2026-07-07T09:00:00.000Z";

const palaceNames = ["坎一宫", "坤二宫", "震三宫", "巽四宫", "中五宫", "乾六宫", "兑七宫", "艮八宫", "离九宫"];
const trigrams = ["坎", "坤", "震", "巽", "中", "乾", "兑", "艮", "离"];
const directions = ["正北", "西南", "正东", "东南", "中央", "西北", "正西", "东北", "正南"];
const elements = ["水", "土", "木", "木", "土", "金", "金", "土", "火"] as const;
const stems = ["壬", "己", "乙", "丁", "戊", "辛", "庚", "癸", "丙"] as const;
const doors = ["休门", "死门", "伤门", "杜门", "生门", "开门", "惊门", "艮门", "景门"] as const;
const normalizedDoors = ["休门", "死门", "伤门", "杜门", "生门", "开门", "惊门", "生门", "景门"] as const;
const stars = ["天蓬", "天芮", "天冲", "天辅", "天禽", "天心", "天柱", "天任", "天英"] as const;
const deities = ["玄武", "白虎", "六合", "太阴", "值符", "九天", "腾蛇", "九地", "朱雀"] as const;

export const qimenMockPalaces: QimenPalace[] = palaceNames.map((palaceName, index) => ({
  palaceNumber: index + 1,
  palaceName,
  trigram: trigrams[index],
  direction: directions[index],
  element: elements[index],
  heavenlyStem: stems[index],
  earthlyStem: stems[(index + 3) % stems.length],
  door: normalizedDoors[index],
  star: stars[index],
  deity: deities[index] === "朱雀" ? "九天" : deities[index],
  branches: [["子"], ["未", "申"], ["卯"], ["辰", "巳"], [], ["戌", "亥"], ["酉"], ["丑", "寅"], ["午"]][index],
  isEmpty: index === 1 || index === 6,
  isTomb: index === 4,
  isDoorForced: index === 2,
  isPunishment: index === 7,
  patterns: [
    {
      id: `mock-pattern-${index + 1}`,
      name: index % 3 === 0 ? "结构可用" : index % 3 === 1 ? "条件待明" : "慎动宜察",
      level: index % 3 === 0 ? "较适合" : index % 3 === 1 ? "参考" : "慎用",
      summary: "此处为 mock 格局说明，用于验证九宫信息展示和报告引用。",
      evidenceRefs: [],
    },
  ],
  score: 62 + index * 3,
  explanation: `${palaceName}显示当前事项在${directions[index]}方位有可观察线索，建议结合问题对象和时间窗口参考。`,
}));

export const qimenMockChart: QimenChart = {
  id: "qimen-chart-mock-20260707",
  title: "奇门九宫 mock 盘",
  chartTime: qimenTime,
  question: "今日学习与内容发布节奏参考",
  juType: "阳遁",
  juNumber: 3,
  dutyStar: "天心",
  dutyDoor: "开门",
  palaces: qimenMockPalaces,
  disclaimer: "本盘仅作传统文化学习与行动参考，不替代医学、法律、投资、心理、婚姻等专业意见。",
  createdAt: qimenTime,
};

export const qimenTodayMock = {
  date: "2026-07-07",
  title: "今日气机参考",
  summary: "结构显示今日适合整理资料、校对文本和复盘旧案例；涉及承诺或外部发布时，建议多做一轮确认。",
  suitable: ["资料整理", "课程校对", "复盘记录", "低风险沟通"],
  cautious: ["临时承诺", "高风险投资", "情绪化决策"],
  evidenceRefs: [],
  disclaimer: qimenMockChart.disclaimer,
};

export const qimenTimingMock: QimenTimingResult = {
  id: "qimen-timing-mock-1",
  eventType: "资料发布",
  timeRange: "未来 7 天",
  suggestedTime: "上午 9:00 - 11:00",
  level: "较适合",
  reasons: ["结构显示更适合清晰表达和对外说明", "开门与天心 mock 组合用于表示发布条件相对顺畅"],
  cautions: ["仍需检查标题、版权状态和发布范围", "不建议在资料授权未确认前公开全文"],
  chartId: qimenMockChart.id,
  evidenceRefs: [],
  disclaimer: qimenMockChart.disclaimer,
};

export const qimenContentTimingMock: QimenTimingResult = {
  id: "qimen-content-timing-mock-1",
  eventType: "内容发布",
  timeRange: "本周工作日",
  suggestedTime: "周三或周五上午",
  level: "可参考",
  reasons: ["mock 结构倾向于先发布讲义摘要，再引导进入藏书与课程", "适合做低承诺、可复盘的内容测试"],
  cautions: ["不要使用夸张承诺式标题", "命理内容需保留学习参考口径"],
  chartId: qimenMockChart.id,
  evidenceRefs: [],
  disclaimer: qimenMockChart.disclaimer,
};

export const qimenReportMock: QimenReport = {
  id: "qimen-report-mock-1",
  title: "资料发布节奏参考报告",
  chartId: qimenMockChart.id,
  timingResultId: qimenTimingMock.id,
  summary: "本报告基于 mock 盘面生成，用于验证报告结构。结论只作传统文化学习与行动参考。",
  sections: [
    {
      title: "结构摘要",
      body: "盘面 mock 结构显示，当前更适合做资料整理、讲义校对和低风险发布测试。",
      evidenceRefs: [],
    },
    {
      title: "行动建议",
      body: "建议先发布摘要、目录和短摘，不公开未授权全文；发布后记录阅读、收藏和咨询反馈。",
      evidenceRefs: [],
    },
    {
      title: "注意事项",
      body: "涉及版权、隐私、医疗、法律、投资和婚姻等问题时，应交由专业人士判断。",
      evidenceRefs: [],
    },
  ],
  visibility: "private",
  createdAt: qimenTime,
};
