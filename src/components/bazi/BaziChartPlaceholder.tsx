import { CalendarDays, ShieldAlert } from "lucide-react";

export default function BaziChartPlaceholder() {
  return (
    <section className="bazi-chart-placeholder" aria-labelledby="bazi-chart-placeholder-title">
      <div>
        <span>后续排盘工具占位</span>
        <h2 id="bazi-chart-placeholder-title">八字排盘暂不开放真实计算</h2>
        <p>
          第一版只做学习系统。后续排盘必须接入明确历法、节气和干支算法，不能由 AI 随机生成。
          当前占位用于说明字段结构和合规边界。
        </p>
      </div>
      <div className="bazi-chart-placeholder-grid" aria-label="八字排盘字段占位">
        {["年柱", "月柱", "日柱", "时柱"].map((item) => (
          <div key={item}>
            <CalendarDays aria-hidden="true" />
            <span>{item}</span>
            <strong>待算法输出</strong>
          </div>
        ))}
      </div>
      <div className="bazi-chart-placeholder-warning">
        <ShieldAlert aria-hidden="true" />
        <p>八字学习内容仅作传统文化学习与结构参考，不替代医学、法律、投资、心理、婚姻等专业意见。</p>
      </div>
    </section>
  );
}
