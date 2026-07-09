import { Hexagon, ShieldAlert } from "lucide-react";

export default function LiuyaoHexagramPlaceholder() {
  return (
    <section className="liuyao-hexagram-placeholder" aria-labelledby="liuyao-hexagram-placeholder-title">
      <div>
        <span>后续起卦工具占位</span>
        <h2 id="liuyao-hexagram-placeholder-title">六爻起卦暂不开放真实计算</h2>
        <p>
          第一版只做学习系统。后续起卦必须由明确算法或用户手动输入生成卦象，不能由 AI 随机生成。
          当前占位用于说明起卦、装卦、取用、动变与复盘字段。
        </p>
      </div>
      <div className="liuyao-hexagram-placeholder-grid" aria-label="六爻起卦字段占位">
        {["起卦方式", "本卦", "变卦", "世应", "六亲", "六神"].map((item) => (
          <div key={item}>
            <Hexagon aria-hidden="true" />
            <span>{item}</span>
            <strong>待规则输出</strong>
          </div>
        ))}
      </div>
      <div className="liuyao-hexagram-placeholder-warning">
        <ShieldAlert aria-hidden="true" />
        <p>六爻学习内容仅作传统文化学习与结构参考，不替代医学、法律、投资、心理、婚姻等专业意见。</p>
      </div>
    </section>
  );
}
