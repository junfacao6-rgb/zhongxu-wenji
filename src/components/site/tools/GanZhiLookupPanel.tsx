"use client";

import { useMemo, useState } from "react";
import {
  earthBranches,
  getEarthlyBranchById,
  getEarthlyBranchHiddenSummary,
  getEarthlyBranchLabel,
  getStemById,
  getYinYangLabel,
  getWuxingElementLabel,
  heavenlyStems,
  type FiveElement,
} from "@/data/tools";

type GanZhiTab = "stem" | "branch";

type GanZhiRecord = {
  id: string;
  symbol: string;
  element: FiveElement;
  yinYang: "yang" | "yin";
  season?: string;
  climate?: string;
  summary: string;
  description?: string;
};

export default function GanZhiLookupPanel() {
  const [tab, setTab] = useState<GanZhiTab>("stem");
  const [stemId, setStemId] = useState(heavenlyStems[0]!.id);
  const [branchId, setBranchId] = useState(earthBranches[0]!.id);

  const selected = useMemo<GanZhiRecord | null>(() => {
    if (tab === "stem") {
      const stem = getStemById(stemId);
      if (!stem) return null;
      return {
        id: stem.id,
        symbol: stem.symbol,
        element: stem.element,
        yinYang: stem.yinYang,
        summary: stem.description,
      };
    }

    const branch = getEarthlyBranchById(branchId);
    if (!branch) return null;
    return {
      id: branch.id,
      symbol: branch.symbol,
      element: branch.element,
      yinYang: branch.yinYang,
      season: branch.season,
      climate: branch.climate,
      summary: branch.summary,
    };
  }, [branchId, stemId, tab]);

  return (
    <section className="rounded-lg border border-[rgba(73,58,34,0.16)] bg-[rgba(250,244,223,0.76)] p-4">
      <h2 className="text-xl font-semibold text-[#3a2209]">干支信息查询</h2>
      <p className="mt-2 text-sm leading-7 text-[#6a5238]">
        快速查看天干或地支的五行属性、阴阳、藏干与简要解释，适合排盘前快速核对。
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTab("stem")}
          className={`rounded-full border px-3 py-1 text-sm ${tab === "stem" ? "border-[#6b4d2f] bg-[#3a2209] text-[#f6ebce]" : "border-[#b89261] text-[#4a2f1a]"}`}
        >
          天干查询
        </button>
        <button
          type="button"
          onClick={() => setTab("branch")}
          className={`rounded-full border px-3 py-1 text-sm ${tab === "branch" ? "border-[#6b4d2f] bg-[#3a2209] text-[#f6ebce]" : "border-[#b89261] text-[#4a2f1a]"}`}
        >
          地支查询
        </button>
      </div>

      <div className="mt-4">
        {tab === "stem" ? (
          <label className="text-sm text-[#5e4329]">
            <span className="mb-2 block">选择天干</span>
            <select
              aria-label="天干列表"
              value={stemId}
              onChange={(event) => setStemId(event.target.value)}
              className="w-full rounded-lg border border-[#b89261] bg-white/80 px-3 py-2 text-sm text-[#4a2f1a]"
            >
              {heavenlyStems.map((stem) => (
                <option key={stem.id} value={stem.id}>
                  {stem.symbol}（{stem.pinyin}）/{getWuxingElementLabel(stem.element)}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <label className="text-sm text-[#5e4329]">
            <span className="mb-2 block">选择地支</span>
            <select
              aria-label="地支列表"
              value={branchId}
              onChange={(event) => setBranchId(event.target.value)}
              className="w-full rounded-lg border border-[#b89261] bg-white/80 px-3 py-2 text-sm text-[#4a2f1a]"
            >
              {earthBranches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.symbol}（{branch.pinyin}）/{getWuxingElementLabel(branch.element)}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {selected && (
        <div className="mt-5 rounded-lg border border-[#ceb38a] bg-white/60 p-4">
          <p className="text-sm text-[#6d4f2c]">
            {tab === "stem" ? `天干 ${selected.symbol}` : `地支 ${getEarthlyBranchLabel(selected.id)}`} 信息
          </p>
          <dl className="mt-3 space-y-2 text-sm leading-7 text-[#5d462c]">
            <div className="grid gap-1 md:grid-cols-2">
              <dt className="text-[#7d5d2f]">五行</dt>
              <dd>{getWuxingElementLabel(selected.element)}</dd>
            </div>
            <div className="grid gap-1 md:grid-cols-2">
              <dt className="text-[#7d5d2f]">阴阳</dt>
              <dd>{getYinYangLabel(selected.yinYang)}</dd>
            </div>
            {tab === "stem" ? (
              <div className="grid gap-1 md:grid-cols-2">
                <dt className="text-[#7d5d2f]">解释</dt>
                <dd>{selected.summary}</dd>
              </div>
            ) : (
              <>
                <div className="grid gap-1 md:grid-cols-2">
                  <dt className="text-[#7d5d2f]">藏干</dt>
                  <dd>{getEarthlyBranchHiddenSummary(selected.id)}</dd>
                </div>
                <div className="grid gap-1 md:grid-cols-2">
                  <dt className="text-[#7d5d2f]">节气季节</dt>
                  <dd>{selected.season}</dd>
                </div>
                <div className="grid gap-1 md:grid-cols-2">
                  <dt className="text-[#7d5d2f]">候气</dt>
                  <dd>{selected.climate}</dd>
                </div>
                <div className="grid gap-1 md:grid-cols-2">
                  <dt className="text-[#7d5d2f]">解释</dt>
                  <dd>{selected.summary}</dd>
                </div>
              </>
            )}
          </dl>
        </div>
      )}
    </section>
  );
}
