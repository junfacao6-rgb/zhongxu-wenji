import type { Metadata } from "next";
import { Compass, Droplets, Lightbulb, Palette, ShieldAlert } from "lucide-react";
import QimenAdviceCard from "@/components/qimen/QimenAdviceCard";
import TimeSlotList, { type QimenTimeSlot } from "@/components/qimen/TimeSlotList";
import TodayOverview from "@/components/qimen/TodayOverview";
import { qimenMockChart, qimenTodayMock } from "@/data/qimenMock";

export const metadata: Metadata = {
  title: "今日气机 | 奇门问时 | 问古书斋",
  description: "以 mock 奇门结构展示今日气机、宜做慎做、十二时辰、方位和行动建议。",
};

const todayTimeSlots: QimenTimeSlot[] = [
  { id: "zi", ganzhi: "甲子时", timeRange: "23:00 - 01:00", door: "休门", score: 72, level: "可用", note: "今日结构偏向安静整理，较适合复盘旧资料。" },
  { id: "chou", ganzhi: "乙丑时", timeRange: "01:00 - 03:00", door: "生门", score: 78, level: "较宜", note: "较适合做资源盘点和低风险计划。" },
  { id: "yin", ganzhi: "丙寅时", timeRange: "03:00 - 05:00", door: "伤门", score: 48, level: "慎用", note: "建议慎重处理冲突性表达，先记录问题。" },
  { id: "mao", ganzhi: "丁卯时", timeRange: "05:00 - 07:00", door: "杜门", score: 58, level: "平稳", note: "可作为内部校对参考，不宜急于公开。" },
  { id: "chen", ganzhi: "戊辰时", timeRange: "07:00 - 09:00", door: "景门", score: 82, level: "较宜", note: "较适合表达、写作、汇报和内容准备。" },
  { id: "si", ganzhi: "己巳时", timeRange: "09:00 - 11:00", door: "开门", score: 86, level: "较宜", note: "今日结构偏向对外说明，可作为发布前确认时段。" },
  { id: "wu", ganzhi: "庚午时", timeRange: "11:00 - 13:00", door: "惊门", score: 46, level: "慎用", note: "建议核实信息来源，避免情绪化回复。" },
  { id: "wei", ganzhi: "辛未时", timeRange: "13:00 - 15:00", door: "死门", score: 38, level: "不建议", note: "不建议做重大启动，可用于收尾和归档。" },
  { id: "shen", ganzhi: "壬申时", timeRange: "15:00 - 17:00", door: "休门", score: 66, level: "可用", note: "适合调整节奏，处理轻量沟通和复盘。" },
  { id: "you", ganzhi: "癸酉时", timeRange: "17:00 - 19:00", door: "生门", score: 74, level: "可用", note: "可作为补充资源、整理清单的参考。" },
  { id: "xu", ganzhi: "甲戌时", timeRange: "19:00 - 21:00", door: "杜门", score: 55, level: "平稳", note: "适合闭门学习和笔记整理，不宜强推事务。" },
  { id: "hai", ganzhi: "乙亥时", timeRange: "21:00 - 23:00", door: "景门", score: 69, level: "可用", note: "适合轻量表达和复盘输出，发布前仍建议检查版权边界。" },
];

const directionAdvice = ["东南：较适合资料整理与结构梳理。", "正南：可作为表达、汇报、发布前检查参考。", "正西：今日结构显示信息易受扰，建议慎重沟通。"];
const colorAdvice = ["深墨：适合稳定心神、做长期整理。", "暗金：适合提示重点和发布节奏。", "米白：适合阅读、校对和课程笔记。"];
const actionAdvice = [
  "建议先整理资料、校对文本，再考虑对外发布。",
  "涉及授权、隐私和专业决策时，应优先做现实核验。",
  "可把今日判断作为复盘样本，记录事项、时间和后续结果。",
];

export default function QimenTodayPage() {
  return (
    <main className="qimen-today-page">
      <section className="qimen-today-hero">
        <span>今日气机</span>
        <h1>{qimenTodayMock.title}</h1>
        <p>{qimenTodayMock.summary}</p>
      </section>

      <TodayOverview
        date={qimenTodayMock.date}
        title="今日总气"
        summary="今日结构偏向资料整理、课程校对与低风险沟通；涉及外部承诺、版权公开和高风险事项时，建议多做一轮确认。"
        bestTime="09:00 - 11:00"
        cautiousTime="13:00 - 15:00"
        suitable={qimenTodayMock.suitable}
        cautious={qimenTodayMock.cautious}
      />

      <TimeSlotList slots={todayTimeSlots} />

      <section className="qimen-advice-grid" aria-label="今日参考建议">
        <QimenAdviceCard title="方位参考" subtitle="空间取向" items={directionAdvice} icon={Compass} tone="ink" />
        <QimenAdviceCard title="颜色参考" subtitle="视觉取象" items={colorAdvice} icon={Palette} />
        <QimenAdviceCard title="行动建议" subtitle="复盘导向" items={actionAdvice} icon={Lightbulb} />
        <QimenAdviceCard title="慎重提醒" subtitle="边界说明" items={["不使用必然、保证、必成等话术。", "命理和择时内容只作为传统文化学习参考。", "现实事务仍以法律、医学、投资等专业意见为准。"]} icon={ShieldAlert} tone="caution" />
      </section>

      <section className="qimen-today-disclaimer" aria-label="免责声明">
        <Droplets aria-hidden="true" />
        <div>
          <strong>免责声明</strong>
          <p>{qimenMockChart.disclaimer}</p>
        </div>
      </section>
    </main>
  );
}
