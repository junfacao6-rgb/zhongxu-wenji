"use client";

import { useState } from "react";
import { getWuxingElementLabel, getWuxingRelation, wuxingElements, type FiveElement } from "@/data/tools";

export default function WuxingLookupPanel() {
  const [fromElement, setFromElement] = useState(wuxingElements[0]!.id);
  const [toElement, setToElement] = useState(wuxingElements[1]!.id);

  const relation = getWuxingRelation(fromElement, toElement);

  return (
    <section className="rounded-lg border border-[rgba(73,58,34,0.16)] bg-[rgba(250,244,223,0.76)] p-4">
      <h2 className="text-xl font-semibold text-[#3a2209]">五行生克查询</h2>
      <p className="mt-2 text-sm leading-7 text-[#6a5238]">
        选择两个五行，快速判断生克关系并给出建议。先确认起始与目标，再切换组合。
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="text-sm text-[#5e4329]">
          <span className="mb-2 block">起始五行</span>
            <select
            aria-label="起始五行"
            value={fromElement}
            onChange={(event) => setFromElement(event.target.value as FiveElement)}
            className="w-full rounded-lg border border-[#b89261] bg-white/80 px-3 py-2 text-sm text-[#4a2f1a]"
          >
            {wuxingElements.map((item) => (
              <option key={item.id} value={item.id}>
                {getWuxingElementLabel(item.id)}（{item.symbol}）
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-[#5e4329]">
          <span className="mb-2 block">目标五行</span>
            <select
            aria-label="目标五行"
            value={toElement}
            onChange={(event) => setToElement(event.target.value as FiveElement)}
            className="w-full rounded-lg border border-[#b89261] bg-white/80 px-3 py-2 text-sm text-[#4a2f1a]"
          >
            {wuxingElements.map((item) => (
              <option key={item.id} value={item.id}>
                {getWuxingElementLabel(item.id)}（{item.symbol}）
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-5 rounded-lg border border-[#ceb38a] bg-white/60 p-4">
        <p className="text-sm text-[#6d4f2c]">
          关系结果：{getWuxingElementLabel(fromElement)} → {getWuxingElementLabel(toElement)} ={" "}
          <strong>{relation.label}</strong>
        </p>
        <p className="mt-2 text-sm leading-7 text-[#5d462c]">方向：{relation.direction}</p>
        <p className="mt-3 text-sm leading-7 text-[#5d462c]">{relation.interpretation}</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-7 text-[#5d462c]">
          {relation.advice.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
