"use client";

import { useState } from "react";
import { getTenGodLookup, heavenlyStems, getWuxingElementLabel, type YinYang, type FiveElement } from "@/data/tools";

const yinYangLabels: Record<YinYang, string> = {
  yang: "阳",
  yin: "阴",
};

export default function TenGodLookupPanel() {
  const [dayStemId, setDayStemId] = useState(heavenlyStems[0]!.id);
  const [targetStemId, setTargetStemId] = useState(heavenlyStems[2]!.id);
  const lookup = getTenGodLookup(dayStemId, targetStemId);

  return (
    <section className="rounded-lg border border-[rgba(73,58,34,0.16)] bg-[rgba(250,244,223,0.76)] p-4">
      <h2 className="text-xl font-semibold text-[#3a2209]">十神速查</h2>
      <p className="mt-2 text-sm leading-7 text-[#6a5238]">
        选择日主天干与对象天干，读取关系类型、十神含义、阴阳状态和建议动作。
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="text-sm text-[#5e4329]">
          <span className="mb-2 block">日主天干</span>
          <select
            aria-label="日主天干"
            value={dayStemId}
            onChange={(event) => setDayStemId(event.target.value)}
            className="w-full rounded-lg border border-[#b89261] bg-white/80 px-3 py-2 text-sm text-[#4a2f1a]"
          >
            {heavenlyStems.map((stem) => (
              <option key={stem.id} value={stem.id}>
                {stem.symbol}（{stem.pinyin}）/{getWuxingElementLabel(stem.element as FiveElement)}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-[#5e4329]">
          <span className="mb-2 block">对象天干</span>
          <select
            aria-label="对象天干"
            value={targetStemId}
            onChange={(event) => setTargetStemId(event.target.value)}
            className="w-full rounded-lg border border-[#b89261] bg-white/80 px-3 py-2 text-sm text-[#4a2f1a]"
          >
            {heavenlyStems.map((stem) => (
              <option key={stem.id} value={stem.id}>
                {stem.symbol}（{stem.pinyin}）/{getWuxingElementLabel(stem.element as FiveElement)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 rounded-lg border border-[#ceb38a] bg-white/60 p-4">
        <p className="text-sm text-[#6d4f2c]">
          查到：<strong>{lookup.god}</strong>（{lookup.relationLabel}）
        </p>
        <dl className="mt-3 space-y-2 text-sm leading-7 text-[#5d462c]">
          <div className="grid gap-1 md:grid-cols-2">
            <dt className="text-[#7d5d2f]">日主</dt>
            <dd>{lookup.dayStem.symbol}</dd>
          </div>
          <div className="grid gap-1 md:grid-cols-2">
            <dt className="text-[#7d5d2f]">对象</dt>
            <dd>{lookup.targetStem.symbol}</dd>
          </div>
            <div className="grid gap-1 md:grid-cols-2">
              <dt className="text-[#7d5d2f]">五行</dt>
              <dd>
                {getWuxingElementLabel(lookup.dayStem.element as FiveElement)} /{" "}
                {getWuxingElementLabel(lookup.targetStem.element as FiveElement)}
              </dd>
            </div>
          <div className="grid gap-1 md:grid-cols-2">
            <dt className="text-[#7d5d2f]">阴阳</dt>
            <dd>
              {lookup.dayStem.symbol} {yinYangLabels[lookup.dayStem.yinYang]} / {lookup.targetStem.symbol}{" "}
              {yinYangLabels[lookup.targetStem.yinYang]}
            </dd>
          </div>
        </dl>
        <p className="mt-3 text-sm leading-7 text-[#5d462c]">{lookup.interpretation}</p>
        <p className="mt-3 text-sm text-[#5d462c]">{lookup.polarity}</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-7 text-[#5d462c]">
          {lookup.signs.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
