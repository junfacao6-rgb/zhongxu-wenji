"use client";

import { useMemo, useState } from "react";
import PalaceDetailDrawer from "@/components/qimen/PalaceDetailDrawer";
import QimenPalaceCard from "@/components/qimen/QimenPalaceCard";
import type { QimenChart, QimenPalace } from "@/types/qimen";

type NinePalaceChartProps = {
  chart: QimenChart;
};

const palaceLayoutOrder = [4, 9, 2, 3, 5, 7, 8, 1, 6];

export default function NinePalaceChart({ chart }: NinePalaceChartProps) {
  const [selectedPalace, setSelectedPalace] = useState<QimenPalace | null>(null);

  const orderedPalaces = useMemo(() => {
    return palaceLayoutOrder
      .map((palaceNumber) => chart.palaces.find((palace) => palace.palaceNumber === palaceNumber))
      .filter((palace): palace is QimenPalace => Boolean(palace));
  }, [chart.palaces]);

  return (
    <section className="nine-palace-chart-panel" aria-labelledby="nine-palace-chart-title">
      <div className="nine-palace-chart-head">
        <div>
          <span>九宫盘</span>
          <h2 id="nine-palace-chart-title">{chart.title}</h2>
          <p>{chart.question}</p>
        </div>
        <strong>{chart.juType}{chart.juNumber}局</strong>
      </div>

      <div className="nine-palace-grid" aria-label="巽四、离九、坤二、震三、中五、兑七、艮八、坎一、乾六九宫布局">
        {orderedPalaces.map((palace) => (
          <QimenPalaceCard key={palace.palaceNumber} palace={palace} onSelect={setSelectedPalace} />
        ))}
      </div>

      <p className="nine-palace-disclaimer">{chart.disclaimer}</p>
      <PalaceDetailDrawer palace={selectedPalace} onClose={() => setSelectedPalace(null)} />
    </section>
  );
}
