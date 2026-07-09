"use client";

import { useMemo, useState } from "react";
import QimenReportActions from "@/components/qimen/QimenReportActions";
import QimenReportDocument from "@/components/qimen/QimenReportDocument";
import { qimenContentTimingMock, qimenMockChart, qimenReportMock, qimenTimingMock, qimenTodayMock } from "@/data/qimenMock";

type ReportType = "today" | "event" | "content";

export type QimenReportPreview = {
  id: string;
  type: ReportType;
  typeLabel: string;
  title: string;
  subtitle: string;
  query: string;
  queryTime: string;
  chartMeta: string;
  conclusion: string;
  recommendedTimes: string[];
  cautiousTimes: string[];
  evidence: string[];
  actionAdvice: string[];
  risks: string[];
  disclaimer: string;
};

const reportTypes: Array<{ key: ReportType; label: string; description: string }> = [
  { key: "today", label: "今日气机报告", description: "适合日常安排、学习复盘和低风险行动参考。" },
  { key: "event", label: "一事择时报告", description: "围绕单一事项整理推荐时辰、慎用时辰和行动建议。" },
  { key: "content", label: "内容发布择时报告", description: "面向内容发布、课程预告和私域承接的发布参考。" },
];

const qimenReports: Record<ReportType, QimenReportPreview> = {
  today: {
    id: "qimen-report-today-mock",
    type: "today",
    typeLabel: "今日气机报告",
    title: "今日气机参考报告",
    subtitle: "用于日常学习、资料整理和行动安排的结构化参考。",
    query: "今日学习、资料整理与低风险沟通",
    queryTime: formatDateTime(qimenMockChart.chartTime),
    chartMeta: `${qimenMockChart.juType}${qimenMockChart.juNumber}局 · 值符${qimenMockChart.dutyStar} · 值使${qimenMockChart.dutyDoor}`,
    conclusion: `${qimenTodayMock.summary}整体倾向适合先做资料、课程和复盘类工作，涉及外部承诺时建议放慢节奏。`,
    recommendedTimes: ["09:00 - 11:00：结构显示较适合对外说明、资料发布前确认。", "17:00 - 19:00：可作为资源整理和轻量沟通参考。"],
    cautiousTimes: ["13:00 - 15:00：慎用，适合收尾归档，不宜强推重要承诺。", "11:00 - 13:00：信息易受扰，建议先核实来源。"],
    evidence: [
      "今日 mock 盘以开门、天心作为可观察线索，较适合清晰表达和技术性判断。",
      "宫位状态中存在空亡、门迫等提示，说明部分事项仍需现实条件确认。",
      ...qimenReportMock.sections.map((section) => `${section.title}：${section.body}`),
    ],
    actionAdvice: [
      "优先处理资料整理、讲义校对、课程复盘和低风险沟通。",
      "涉及版权、合同、付款、医疗或法律事项时，先做现实核验。",
      "记录今日事项、执行时段和后续反馈，作为后续复盘样本。",
    ],
    risks: ["不宜把单日结构扩大为长期判断。", "涉及专业决策时，应以现实资料和专业意见为准。", "发布资料前需确认版权状态和展示范围。"],
    disclaimer: qimenMockChart.disclaimer,
  },
  event: {
    id: "qimen-report-event-mock",
    type: "event",
    typeLabel: "一事择时报告",
    title: "资料发布一事择时报告",
    subtitle: "围绕单一事项输出推荐时段、慎用时段、盘理依据和执行建议。",
    query: qimenTimingMock.eventType,
    queryTime: formatDateTime(qimenMockChart.chartTime),
    chartMeta: `${qimenTimingMock.timeRange} · ${qimenMockChart.title}`,
    conclusion: `结构显示“${qimenTimingMock.eventType}”较适合先做资料校对、标题确认和发布范围设置，${qimenTimingMock.suggestedTime}可作为优先参考。`,
    recommendedTimes: [`${qimenTimingMock.suggestedTime}：${qimenTimingMock.reasons[0]}。`, "17:00 - 19:00：可用于补充说明、低风险沟通和复盘记录。"],
    cautiousTimes: ["13:00 - 15:00：慎用，建议改作资料归档或授权复核。", "11:00 - 13:00：信息干扰较多，建议避免临时承诺。"],
    evidence: qimenTimingMock.reasons,
    actionAdvice: [
      "发布前先检查资料版权、摘要范围、标题口径和可见性设置。",
      "若用于公开传播，建议先发摘要、目录或短摘，不公开未授权全文。",
      "发布后记录阅读、收藏、咨询和反馈，用于后续内容复盘。",
    ],
    risks: qimenTimingMock.cautions,
    disclaimer: qimenTimingMock.disclaimer,
  },
  content: {
    id: "qimen-report-content-mock",
    type: "content",
    typeLabel: "内容发布择时报告",
    title: "内容发布择时参考报告",
    subtitle: "面向内容创作者、课程老师、命理师和私域运营者的发布参考。",
    query: qimenContentTimingMock.eventType,
    queryTime: formatDateTime(qimenMockChart.chartTime),
    chartMeta: `${qimenContentTimingMock.timeRange} · ${qimenMockChart.juType}${qimenMockChart.juNumber}局`,
    conclusion: "结构显示今日较利于公开表达与内容展示，可优先发布干货、案例、课程预告类内容。标题宜稳，不宜过度刺激。",
    recommendedTimes: [`${qimenContentTimingMock.suggestedTime}：${qimenContentTimingMock.reasons[0]}。`, "09:00 - 11:00：较适合发布价值铺垫、课程预告和资料说明。"],
    cautiousTimes: ["13:00 - 15:00：慎用，建议改为草稿校对、素材整理或评论区预案。", "23:00 - 01:00：可作为复盘参考，不建议承接强销售动作。"],
    evidence: qimenContentTimingMock.reasons,
    actionAdvice: [
      "若用于强销售，建议在推荐时段内先做价值铺垫，再引导咨询。",
      "标题方向以稳妥、清晰、可学习为主，避免夸张承诺式表达。",
      "评论区优先回答学习问题，涉及个人重大决策时提示专业意见优先。",
      "私域承接建议准备课程大纲、报告样例和服务边界说明。",
    ],
    risks: qimenContentTimingMock.cautions,
    disclaimer: qimenContentTimingMock.disclaimer,
  },
};

export default function QimenReportPreviewPanel() {
  const [selectedType, setSelectedType] = useState<ReportType>("today");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const report = qimenReports[selectedType];
  const reportText = useMemo(() => buildReportText(report), [report]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(reportText);
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 1600);
    } catch {
      setCopyStatus("failed");
      window.setTimeout(() => setCopyStatus("idle"), 1600);
    }
  }

  return (
    <div className="qimen-report-preview-panel">
      <section className="qimen-report-type-panel" aria-labelledby="qimen-report-type-title">
        <div>
          <span>报告类型</span>
          <h2 id="qimen-report-type-title">选择要预览的报告</h2>
          <p>第一阶段仅生成 mock 报告结构，用于确认内容层级、复制文本和后续导出入口。</p>
        </div>
        <div className="qimen-report-type-options" role="group" aria-label="选择报告类型">
          {reportTypes.map((item) => (
            <button
              key={item.key}
              type="button"
              className={selectedType === item.key ? "is-active" : undefined}
              onClick={() => {
                setSelectedType(item.key);
                setCopyStatus("idle");
              }}
            >
              <strong>{item.label}</strong>
              <span>{item.description}</span>
            </button>
          ))}
        </div>
      </section>

      <QimenReportActions copyStatus={copyStatus} onCopy={handleCopy} />
      <QimenReportDocument report={report} />
    </div>
  );
}

function buildReportText(report: QimenReportPreview) {
  const lines = [
    `【${report.title}】`,
    `报告类型：${report.typeLabel}`,
    `查询事项：${report.query}`,
    `查询时间：${report.queryTime}`,
    `盘面信息：${report.chartMeta}`,
    "",
    "一、核心结论",
    report.conclusion,
    "",
    "二、推荐时辰",
    ...report.recommendedTimes.map((item) => `- ${item}`),
    "",
    "三、慎用时辰",
    ...report.cautiousTimes.map((item) => `- ${item}`),
    "",
    "四、盘理依据",
    ...report.evidence.map((item) => `- ${item}`),
    "",
    "五、行动建议",
    ...report.actionAdvice.map((item) => `- ${item}`),
    "",
    "六、风险提示",
    ...report.risks.map((item) => `- ${item}`),
    "",
    "免责声明",
    report.disclaimer,
    "",
    "品牌信息：问古书斋 · 古籍资料库 + 术数学习系统 + 工具报告",
  ];

  return lines.join("\n");
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}
