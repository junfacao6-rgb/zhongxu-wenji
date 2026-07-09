import type { Metadata } from "next";
import QimenReportPreviewPanel from "@/components/qimen/QimenReportPreviewPanel";

export const metadata: Metadata = {
  title: "奇门报告预览 | 奇门问时 | 问古书斋",
  description: "预览今日气机、一事择时和内容发布择时的奇门报告结构。",
};

export default function QimenReportPreviewPage() {
  return (
    <main className="qimen-report-preview-page">
      <section className="qimen-report-preview-hero">
        <span>报告预览</span>
        <h1>把盘面结构整理成可读、可复制、可复盘的报告</h1>
        <p>
          当前页面提供今日气机报告、一事择时报告和内容发布择时报告三种 mock 预览。
          后续可接入真实规则引擎、evidence 审核、PDF 导出和长图生成。
        </p>
      </section>

      <QimenReportPreviewPanel />
    </main>
  );
}
