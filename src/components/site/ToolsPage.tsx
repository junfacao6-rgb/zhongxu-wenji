"use client";

import { useMemo, useState } from "react";
import type { ComponentType } from "react";
import { siteContent } from "@/lib/site-content";
import GanZhiLookupPanel from "@/components/site/tools/GanZhiLookupPanel";
import TenGodLookupPanel from "@/components/site/tools/TenGodLookupPanel";
import WuxingLookupPanel from "@/components/site/tools/WuxingLookupPanel";

type ToolMeta = {
  title: string;
  description: string;
  status: string;
};

const toolRenderers: Record<string, ComponentType> = {
  "five-elements": WuxingLookupPanel,
  "ten-stems-god": TenGodLookupPanel,
  "gan-zhi": GanZhiLookupPanel,
};

const toolFallback: Record<string, ToolMeta> = {
  "five-elements": {
    title: "五行生克",
    description: "快速判断两个五行之间的生成、克制关系，并给出建议。",
    status: "可用",
  },
  "ten-stems-god": {
    title: "十神速查",
    description: "基于日主与对象天干关系，显示十神与解释。",
    status: "可用",
  },
  "gan-zhi": {
    title: "干支信息",
    description: "快速查看天干地支五行、阴阳、藏干与季节信息。",
    status: "可用",
  },
  hexagrams: {
    title: "卦象速查（建设中）",
    description: "后续接入。",
    status: "建设中",
  },
};

export default function ToolsPage() {
  const activeToolIds = Object.keys(toolRenderers);
  const firstAvailableId = activeToolIds[0] ?? siteContent.tools[0]?.id ?? "";
  const [activeToolId, setActiveToolId] = useState(firstAvailableId);

  const ActiveRenderer = useMemo(() => {
    const Renderer = activeToolId ? toolRenderers[activeToolId] : null;
    return Renderer ?? null;
  }, [activeToolId]);

  const activeFallback = useMemo(
    () => toolFallback[activeToolId],
    [activeToolId],
  );

  return (
    <section className="knowledge-shell pb-10 pt-10 md:pb-14 md:pt-14">
      <header className="light-page-hero">
        <p className="eyebrow-line">TOOLS</p>
        <h1 className="mt-4 text-4xl font-semibold text-[#2f1d0c]">传统工具</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6a5238]">
          先从传统内容中挑一个工具进入交互区：选参数、看结构、得结论。后续工具可持续扩展，优先保持每次可直接查到结果。
        </p>
      </header>

      <div className="mt-8 grid gap-3 md:grid-cols-3">
        {siteContent.tools.map((tool) => {
          const fallback = toolFallback[tool.id];
          const status = fallback?.status ?? "建设中";
          const isUsable = Boolean(toolRenderers[tool.id]);
          const isActive = tool.id === activeToolId;
          return (
            <button
              key={tool.id}
              type="button"
              disabled={!isUsable}
              onClick={isUsable ? () => setActiveToolId(tool.id) : undefined}
              className={`directory-card flex items-center justify-between gap-4 p-4 text-left transition ${
                isActive ? "border-[rgba(159,63,47,0.28)] bg-[#fffaf0] shadow-[0_16px_34px_rgba(68,43,13,0.08)]" : ""
              } ${isUsable ? "" : "cursor-not-allowed opacity-70"}`}
            >
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-[#2f1d0c]">
                  {fallback?.title ?? tool.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#7a6042]">
                  {fallback?.description ?? tool.description}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="rounded-full bg-[#f8eee3] px-2 py-1 text-[11px] text-[#9f3f2f]">{status}</span>
                <span className="text-sm text-[#9f3f2f]">→</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="paper-card mt-8 rounded-lg p-5 md:p-6">
        {ActiveRenderer ? (
          <>
            <h2 className="text-xl font-semibold text-[#3a2209]">
              {activeFallback?.title ?? "工具"}
            </h2>
            <ActiveRenderer />
          </>
        ) : (
          <div className="rounded-lg border border-[#ceb38a] bg-white/55 p-4 text-sm leading-7 text-[#6a5238]">
            <p className="font-semibold text-[#3a2209]">建设中</p>
            <p className="mt-2">该工具尚未对外开放，后续会继续补齐后发布。</p>
          </div>
        )}
      </div>

      <div className="paper-card mt-8 rounded-lg p-5">
        <h2 className="text-xl font-semibold text-[#3a2209]">使用说明</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7 text-[#6a4f33]">
          <li>先选中卡片。</li>
          <li>在下方区域设置参数并查看结果。</li>
          <li>该页面仅展示本地计算结果，无需网络请求。</li>
        </ol>
      </div>
    </section>
  );
}
