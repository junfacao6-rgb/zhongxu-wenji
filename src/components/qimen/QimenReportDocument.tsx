import { BadgeCheck, QrCode } from "lucide-react";
import type { QimenReportPreview } from "@/components/qimen/QimenReportPreviewPanel";

interface QimenReportDocumentProps {
  report: QimenReportPreview;
}

export default function QimenReportDocument({ report }: QimenReportDocumentProps) {
  return (
    <article className="qimen-report-document" aria-labelledby="qimen-report-document-title">
      <header className="qimen-report-document-head">
        <div>
          <span>{report.typeLabel}</span>
          <h2 id="qimen-report-document-title">{report.title}</h2>
          <p>{report.subtitle}</p>
        </div>
        <div className="qimen-report-brand-mark" aria-label="问古书斋品牌信息">
          <BadgeCheck aria-hidden="true" />
          <strong>问古书斋</strong>
          <span>古籍资料库 · 术数学习系统 · 工具报告</span>
        </div>
      </header>

      <dl className="qimen-report-meta">
        <div>
          <dt>查询事项</dt>
          <dd>{report.query}</dd>
        </div>
        <div>
          <dt>查询时间</dt>
          <dd>{report.queryTime}</dd>
        </div>
        <div>
          <dt>盘面信息</dt>
          <dd>{report.chartMeta}</dd>
        </div>
        <div>
          <dt>报告状态</dt>
          <dd>mock 预览 · 待审核</dd>
        </div>
      </dl>

      <section className="qimen-report-section is-summary">
        <span>核心结论</span>
        <p>{report.conclusion}</p>
      </section>

      <div className="qimen-report-time-grid">
        <section className="qimen-report-section">
          <span>推荐时辰</span>
          <ul>
            {report.recommendedTimes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="qimen-report-section is-caution">
          <span>慎用时辰</span>
          <ul>
            {report.cautiousTimes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="qimen-report-section">
        <span>盘理依据</span>
        <ul>
          {report.evidence.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="qimen-report-section">
        <span>行动建议</span>
        <ul>
          {report.actionAdvice.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="qimen-report-section is-risk">
        <span>风险提示</span>
        <ul>
          {report.risks.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <footer className="qimen-report-footer">
        <section>
          <span>免责声明</span>
          <p>{report.disclaimer}</p>
        </section>
        <section className="qimen-report-qr">
          <div aria-label="二维码占位">
            <QrCode aria-hidden="true" />
          </div>
          <p>二维码占位：后续用于报告分享、私域承接或学习路径入口。</p>
        </section>
      </footer>
    </article>
  );
}
