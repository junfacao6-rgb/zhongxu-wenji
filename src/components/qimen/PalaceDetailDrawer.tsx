import { BookOpen, X } from "lucide-react";
import Link from "next/link";
import type { QimenDoor, QimenPalace } from "@/types/qimen";

type PalaceDetailDrawerProps = {
  palace: QimenPalace | null;
  onClose: () => void;
};

const doorSuitableMap: Record<QimenDoor, string[]> = {
  休门: ["休整调息", "资料复盘", "低压力沟通"],
  生门: ["资源整理", "课程规划", "稳健推进"],
  伤门: ["问题清理", "技术修正", "旧案复盘"],
  杜门: ["内部研究", "闭门校对", "隐私事项"],
  景门: ["展示表达", "发布内容", "考试汇报"],
  死门: ["收束整理", "归档复盘", "停止消耗"],
  惊门: ["风险提醒", "预案检查", "信息核实"],
  开门: ["公开沟通", "协作推进", "事务启动"],
};

const doorCautionMap: Record<QimenDoor, string[]> = {
  休门: ["避免拖延过久", "不宜急于承诺"],
  生门: ["慎防只看收益", "需确认资源边界"],
  伤门: ["慎用强硬表达", "避免情绪化处理"],
  杜门: ["不宜强求曝光", "需防信息不透明"],
  景门: ["避免夸张宣传", "授权未明不公开全文"],
  死门: ["慎做重大启动", "不宜冒进扩张"],
  惊门: ["慎防误读消息", "重要事项需二次核实"],
  开门: ["避免无准备公开", "需先明确责任边界"],
};

export default function PalaceDetailDrawer({ palace, onClose }: PalaceDetailDrawerProps) {
  if (!palace) return null;

  const statusExplanations = getStatusExplanations(palace);
  const relatedTerms = getRelatedTerms(palace);

  return (
    <div className="palace-drawer-backdrop" role="presentation" onClick={onClose}>
      <aside className="palace-detail-drawer" role="dialog" aria-modal="true" aria-label={`${palace.palaceName}详情`} onClick={(event) => event.stopPropagation()}>
        <header>
          <div>
            <span>宫位详情</span>
            <h2>{palace.palaceName}</h2>
            <p>{palace.direction} · {palace.element} · {palace.trigram}</p>
          </div>
          <button type="button" aria-label="关闭宫位详情" onClick={onClose}>
            <X aria-hidden="true" />
          </button>
        </header>

        <section>
          <h3>宫位基本信息</h3>
          <dl className="palace-detail-grid">
            <div><dt>宫数</dt><dd>{palace.palaceNumber}</dd></div>
            <div><dt>方位</dt><dd>{palace.direction}</dd></div>
            <div><dt>五行</dt><dd>{palace.element}</dd></div>
            <div><dt>地支</dt><dd>{palace.branches.length > 0 ? palace.branches.join("、") : "中宫"}</dd></div>
          </dl>
        </section>

        <section>
          <h3>门星神干</h3>
          <dl className="palace-detail-grid">
            <div><dt>天盘干</dt><dd>{palace.heavenlyStem}</dd></div>
            <div><dt>地盘干</dt><dd>{palace.earthlyStem}</dd></div>
            <div><dt>八门</dt><dd>{palace.door}</dd></div>
            <div><dt>九星</dt><dd>{palace.star}</dd></div>
            <div><dt>八神</dt><dd>{palace.deity}</dd></div>
          </dl>
        </section>

        <section>
          <h3>十干克应</h3>
          <p>天盘{palace.heavenlyStem}临地盘{palace.earthlyStem}，mock 结构显示此宫可用于观察事项的应象线索。后续需由规则引擎输出明确克应文本。</p>
        </section>

        <section>
          <h3>状态解释</h3>
          <ul className="palace-detail-list">
            {statusExplanations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3>适合事项</h3>
          <div className="palace-chip-list">
            {doorSuitableMap[palace.door].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>

        <section>
          <h3>慎用事项</h3>
          <div className="palace-chip-list is-caution">
            {doorCautionMap[palace.door].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>

        <section>
          <h3>相关术语</h3>
          <div className="palace-term-links">
            {relatedTerms.map((term) => (
              <Link key={term.href} href={term.href}>{term.label}</Link>
            ))}
          </div>
        </section>

        <footer>
          <button type="button">
            <BookOpen aria-hidden="true" />
            查看古籍依据
          </button>
          <p>第一阶段仅做 UI。古籍依据后续需关联 evidenceRefs、页码和章节。</p>
        </footer>
      </aside>
    </div>
  );
}

function getStatusExplanations(palace: QimenPalace) {
  const items: string[] = [];
  if (palace.isEmpty) items.push("空亡：信息或力量暂时落空，建议先核实条件。");
  if (palace.isTomb) items.push("入墓：事项有收束、迟滞或不宜强推的倾向。");
  if (palace.isDoorForced) items.push("门迫：行动入口受宫位制约，推进成本可能增加。");
  if (palace.isPunishment) items.push("击刑：结构中有冲突或压力信号，宜谨慎处理。");
  palace.patterns.forEach((pattern) => {
    items.push(`${pattern.name}：${pattern.summary}`);
  });
  return items.length > 0 ? items : ["当前宫位以参考观察为主，需结合事项和用神进一步判断。"];
}

function getRelatedTerms(palace: QimenPalace) {
  const terms = [
    { label: "九宫", href: "/terms/jiugong" },
    { label: "八门", href: "/terms/bamen" },
    { label: "九星", href: "/terms/jiuxing" },
    { label: "八神", href: "/terms/bashen" },
    { label: "三奇", href: "/terms/sanqi" },
    { label: "六仪", href: "/terms/liuyi" },
  ];

  if (palace.door === "景门") {
    return [{ label: "景门", href: "/terms/jingmen" }, ...terms].slice(0, 6);
  }

  return terms;
}
