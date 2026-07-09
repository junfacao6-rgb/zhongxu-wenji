import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { wuxingElements, wuxingRelations, type WuxingElement } from "@/data/diagrams";

export const metadata: Metadata = {
  title: "五行图谱 | 观复书阁",
  description: "木火土金水五行图谱：五行特征、气象说明与生克关系示意。",
};

function getWuxingNodePosition(index: number, total: number, radius = 120, center = 140) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return {
    x: center + radius * Math.cos(angle),
    y: center + radius * Math.sin(angle),
  };
}

function WuxingElementCard({ element }: { element: WuxingElement }) {
  return (
    <article className="paper-card rounded-lg p-5">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          style={{ backgroundColor: element.color }}
          className="inline-block h-3 w-3 rounded-full"
        />
        <h3 className="text-lg font-semibold text-[#3a2209]">
          {element.name}（{element.alias}）
        </h3>
      </div>
      <p className="mt-2 text-sm text-[#6a5238]">{element.climate}</p>
      <dl className="mt-3 space-y-2 text-sm leading-7 text-[#5c442d]">
        <div className="rounded border border-[rgba(90,65,35,0.16)] bg-[rgba(255,255,255,0.4)] px-3 py-2">
          <dt className="text-xs uppercase tracking-[0.08em] text-[#7d5d2f]">气象要点</dt>
          <dd>{element.focus}</dd>
        </div>
        <div className="rounded border border-[rgba(90,65,35,0.16)] bg-[rgba(255,255,255,0.4)] px-3 py-2">
          <dt className="text-xs uppercase tracking-[0.08em] text-[#7d5d2f]">生</dt>
          <dd>{element.produce}</dd>
        </div>
        <div className="rounded border border-[rgba(90,65,35,0.16)] bg-[rgba(255,255,255,0.4)] px-3 py-2">
          <dt className="text-xs uppercase tracking-[0.08em] text-[#7d5d2f]">克</dt>
          <dd>{element.restrain}</dd>
        </div>
      </dl>
    </article>
  );
}

function WuxingRelationMap() {
  const center = 140;
  const nodePosition = wuxingElements.map((element, index) => ({
    ...element,
    ...getWuxingNodePosition(index, wuxingElements.length),
  }));
  const positionById = new Map(nodePosition.map((item) => [item.id, item]));

  return (
    <section className="paper-card rounded-lg p-5">
      <h2 className="text-xl font-semibold text-[#3a2209]">五行关系图（示意）</h2>
      <p className="mt-2 text-sm leading-7 text-[#6a5238]">
        采用有向关系展示：绿色为「生」，朱砂红为「克」，用于说明方向与结构，不代表严格命理计量。
      </p>
      <div className="mt-4 overflow-hidden">
        <svg viewBox="0 0 280 280" className="h-auto w-full">
          <defs>
            <marker id="sheng-arrow" markerWidth="8" markerHeight="8" refX="6.8" refY="4" orient="auto">
              <path d="M0 0 L8 4 L0 8 z" fill="#5d8b47" />
            </marker>
            <marker id="ke-arrow" markerWidth="8" markerHeight="8" refX="6.8" refY="4" orient="auto">
              <path d="M0 0 L8 4 L0 8 z" fill="#a24b2f" />
            </marker>
          </defs>

          {wuxingRelations.map((relation) => {
            const from = positionById.get(relation.from);
            const to = positionById.get(relation.to);
            if (!from || !to) return null;
            const isSheng = relation.type === "生";
            const edgeClass = isSheng ? "#5d8b47" : "#a24b2f";
            const marker = isSheng ? "url(#sheng-arrow)" : "url(#ke-arrow)";
            const midpointX = (from.x + to.x) / 2;
            const midpointY = (from.y + to.y) / 2;

            return (
              <g key={`${relation.from}-${relation.to}-${relation.type}`}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={edgeClass}
                  strokeWidth="2.2"
                  markerEnd={marker}
                  opacity="0.95"
                />
                <text
                  x={midpointX}
                  y={midpointY - 5}
                  textAnchor="middle"
                  className="fill-[#4a331e] text-[10px] font-medium"
                >
                  {relation.label}
                </text>
              </g>
              );
          })}

          {nodePosition.map((item) => (
            <g key={item.id}>
              <circle cx={item.x} cy={item.y} r="21" fill={item.color} fillOpacity="0.84" />
              <circle cx={item.x} cy={item.y} r="20" fill={item.color} fillOpacity="0.92" />
              <text x={item.x} y={item.y + 5} textAnchor="middle" className="fill-[#fff4d7] text-[13px] font-semibold">
                {item.name}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="mt-4 grid gap-2 text-xs text-[#6a5238] sm:grid-cols-2">
        <div className="rounded border border-[#5f4b2d] bg-[#f6edda] px-3 py-2">
          生：木→火→土→金→水→木。推动成长与转化。
        </div>
        <div className="rounded border border-[#5f4b2d] bg-[#f6edda] px-3 py-2">
          克：木克土，土克水，水克火，火克金，金克木。对应节制与平衡。
        </div>
      </div>
    </section>
  );
}

export default function WuxingDiagramPage() {
  return (
    <section className="knowledge-shell pb-10 pt-10 md:pb-14 md:pt-14">
      <Link
        href="/diagrams"
        className="ghost-button inline-flex min-h-0 items-center gap-2 px-3 py-1 text-xs"
      >
        <ArrowLeft size={14} />
        返回图示中心
      </Link>
      <header className="light-page-hero mt-5">
        <p className="eyebrow-line">WUXING</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#2f1d0c] md:text-5xl">木火土金水：结构与关系</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6a5238]">
          在命理里，五行不是孤立元素，而是可互促互制的气机结构。先理解其性质，再看关系方向，才会把传统图谱当作可操作的工具链。
        </p>
      </header>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {wuxingElements.map((item) => (
            <WuxingElementCard key={item.id} element={item} />
          ))}
        </div>
        <WuxingRelationMap />
      </div>
    </section>
  );
}
