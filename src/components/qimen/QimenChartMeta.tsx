import type { QimenChart } from "@/types/qimen";

type QimenChartMetaProps = {
  chart: QimenChart;
  fourPillars: string;
  solarTerm: string;
  xunShou: string;
  emptyBranches: string;
  horseStar: string;
};

export default function QimenChartMeta({ chart, fourPillars, solarTerm, xunShou, emptyBranches, horseStar }: QimenChartMetaProps) {
  const items = [
    { label: "公历时间", value: formatDateTime(chart.chartTime) },
    { label: "干支四柱", value: fourPillars },
    { label: "节气", value: solarTerm },
    { label: "遁局", value: chart.juType },
    { label: "局数", value: `${chart.juNumber}局` },
    { label: "值符", value: chart.dutyStar },
    { label: "值使", value: chart.dutyDoor },
    { label: "旬首", value: xunShou },
    { label: "空亡", value: emptyBranches },
    { label: "马星", value: horseStar },
  ];

  return (
    <section className="qimen-chart-meta" aria-label="奇门盘面信息">
      {items.map((item) => (
        <div key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </div>
      ))}
    </section>
  );
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
