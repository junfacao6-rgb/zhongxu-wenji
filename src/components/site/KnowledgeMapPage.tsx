import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, BookOpen, Compass, GitBranch, Layers, ScrollText } from "lucide-react";
import {
  knowledgeMapHighlights,
  knowledgeMapLanes,
  knowledgeMapRoutes,
  type KnowledgeMapNode,
  type KnowledgeMapStatus,
} from "@/data/knowledge-map";

const highlightIcons: LucideIcon[] = [Compass, Layers, ScrollText];

const statusStyles: Record<KnowledgeMapStatus, string> = {
  可用: "bg-[#eef5ed] text-[#4f7a5e]",
  已上线: "bg-[#f8eee3] text-[#9f3f2f]",
  建设中: "bg-[#f2eadb] text-[#8a6a42]",
  建议先读: "bg-[#f5e1d9] text-[#9f3f2f]",
};

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-5 flex items-center gap-4">
      <span className="section-chip">{eyebrow}</span>
      <h2 className="shrink-0 text-lg font-semibold text-[#2f1d0c] md:text-xl">{title}</h2>
      <span className="section-rule" />
    </div>
  );
}

function NodeCard({ node }: { node: KnowledgeMapNode }) {
  return (
    <Link href={node.href} className="directory-card group flex items-center justify-between gap-4 p-4">
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#f7efe1] px-2 py-1 text-[11px] font-semibold text-[#8a6a42]">
            {node.source}
          </span>
          <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${statusStyles[node.status]}`}>
            {node.status}
          </span>
        </div>
        <h3 className="truncate text-base font-semibold text-[#2f1d0c]">{node.title}</h3>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#7a6042]">{node.description}</p>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-[#9f3f2f] transition group-hover:translate-x-0.5" />
    </Link>
  );
}

export default function KnowledgeMapPage() {
  return (
    <section className="knowledge-shell pb-10 pt-10 md:pb-14 md:pt-14">
      <header className="light-page-hero">
        <p className="eyebrow-line">KNOWLEDGE MAP</p>
        <h1 className="mt-4 text-4xl font-semibold text-[#2f1d0c] md:text-5xl">
          术数知识地图
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6a5238]">
          把古籍、讲义、图解、工具和文章放到同一张学习地图里。新手先看路径，进阶者按节点补课，后续再把案例库和个人复盘接进来。
        </p>
      </header>

      <div className="mt-8 grid gap-3 md:grid-cols-3">
        {knowledgeMapHighlights.map((item, index) => {
          const Icon = highlightIcons[index] ?? Compass;
          return (
            <Link key={item.title} href={item.href} className="directory-card group flex items-start gap-4 p-5">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(159,63,47,0.16)] bg-[#fff8ed] text-[#9f3f2f]">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-base font-semibold text-[#2f1d0c]">{item.title}</span>
                  <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${statusStyles[item.status]}`}>
                    {item.status}
                  </span>
                </span>
                <span className="mt-2 block text-xs leading-6 text-[#7a6042]">{item.description}</span>
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-10">
        {knowledgeMapLanes.map((lane) => (
          <section key={lane.id} className="home-directory-section py-8">
            <SectionHeading eyebrow={lane.eyebrow} title={lane.title} />
            <p className="mb-5 max-w-3xl text-sm leading-7 text-[#6a5238]">{lane.summary}</p>
            <div className="grid gap-3 md:grid-cols-3">
              {lane.nodes.map((node) => (
                <NodeCard key={`${lane.id}-${node.title}`} node={node} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="home-directory-section py-8">
        <SectionHeading eyebrow="路线" title="三条推荐学习路线" />
        <div className="grid gap-3 md:grid-cols-3">
          {knowledgeMapRoutes.map((route, index) => {
            const RouteIcon = index === 0 ? BookOpen : index === 1 ? GitBranch : Layers;
            return (
              <article key={route.title} className="directory-card p-5">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(159,63,47,0.16)] bg-[#fff8ed] text-[#9f3f2f]">
                      <RouteIcon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#2f1d0c]">{route.title}</h3>
                  </div>
                  <span className="rounded-full bg-[#f8eee3] px-2 py-1 text-[11px] font-semibold text-[#9f3f2f]">
                    {route.steps.length} 步
                  </span>
                </div>
                <p className="text-sm leading-7 text-[#6a5238]">{route.summary}</p>
                <ol className="mt-4 space-y-2 text-sm text-[#6a4f33]">
                  {route.steps.map((step, stepIndex) => (
                    <li key={step} className="flex gap-2">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f5e1d9] text-[11px] font-semibold text-[#9f3f2f]">
                        {stepIndex + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                <Link
                  href={route.href}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#9f3f2f]"
                >
                  进入路线
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </section>
  );
}
