import type { QimenPalace } from "@/types/qimen";

type QimenNineGridProps = {
  palaces: QimenPalace[];
};

const palaceOrder = [4, 9, 2, 3, 5, 7, 8, 1, 6];

export default function QimenNineGrid({ palaces }: QimenNineGridProps) {
  const orderedPalaces = palaceOrder
    .map((palaceNumber) => palaces.find((palace) => palace.palaceNumber === palaceNumber))
    .filter((palace): palace is QimenPalace => Boolean(palace));

  return (
    <div className="qimen-nine-grid" aria-label="九宫结构示意">
      {orderedPalaces.map((palace) => (
        <div key={palace.palaceNumber}>
          <span>{palace.palaceNumber}</span>
          <strong>{palace.trigram}</strong>
          <small>{palace.door}</small>
        </div>
      ))}
    </div>
  );
}
