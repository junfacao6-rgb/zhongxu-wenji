import Link from "next/link";
import { FileText, LockKeyhole } from "lucide-react";
import type { MeReport } from "@/data/userMock";

interface ReportListProps {
  reports: MeReport[];
}

const statusLabel: Record<MeReport["status"], string> = {
  draft: "草稿",
  ready: "已生成",
  archived: "已归档",
};

export default function ReportList({ reports }: ReportListProps) {
  return (
    <section className="me-panel">
      <div className="me-section-head">
        <span>我的报告</span>
        <h2>报告历史与草稿</h2>
      </div>

      <div className="me-report-list">
        {reports.map((report) => (
          <Link key={report.id} href={report.href} className="me-report-card">
            <header>
              <FileText aria-hidden="true" />
              <span>{report.reportTypeLabel}</span>
              <em>{statusLabel[report.status]}</em>
            </header>
            <h3>{report.title}</h3>
            <p>{report.summary}</p>
            <footer>
              <small>
                <LockKeyhole aria-hidden="true" />
                {report.visibility === "private" ? "私密保存" : "可见"}
              </small>
              <strong>查看报告</strong>
            </footer>
          </Link>
        ))}
      </div>
    </section>
  );
}
