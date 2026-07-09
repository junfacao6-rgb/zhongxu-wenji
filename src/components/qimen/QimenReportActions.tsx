"use client";

import { Check, Copy, Download, FileImage, Save } from "lucide-react";

interface QimenReportActionsProps {
  copyStatus: "idle" | "copied" | "failed";
  onCopy: () => void;
}

export default function QimenReportActions({ copyStatus, onCopy }: QimenReportActionsProps) {
  return (
    <div className="qimen-report-actions" aria-label="报告操作">
      <button type="button" onClick={onCopy}>
        {copyStatus === "copied" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        {copyStatus === "copied" ? "已复制" : copyStatus === "failed" ? "复制失败" : "复制报告文本"}
      </button>
      <button type="button">
        <Download aria-hidden="true" />
        下载 PDF
      </button>
      <button type="button">
        <FileImage aria-hidden="true" />
        生成长图
      </button>
      <button type="button">
        <Save aria-hidden="true" />
        保存到我的报告
      </button>
    </div>
  );
}
