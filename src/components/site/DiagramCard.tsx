import Link from "next/link";
import type { DiagramCategory } from "@/data/diagrams";

export default function DiagramCard({ diagram }: { diagram: DiagramCategory }) {
  const isComingSoon = diagram.status !== "available";
  const statusText = isComingSoon ? "建设中" : "可用";

  return (
    <article className="paper-card flex h-full flex-col justify-between rounded-lg p-5">
      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.16em] text-[#9f3f2f]">{diagram.title}</p>
          <span
            className={`rounded-full border px-2 py-1 text-[11px] ${
              isComingSoon
                ? "border-[#b17e4e] bg-[#f4e2c5] text-[#6a4527]"
                : "border-[#6a8448] bg-[#e2f0db] text-[#345a2d]"
            }`}
          >
            {statusText}
          </span>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-[#6a5238]">{diagram.description}</p>
      </div>
      {isComingSoon ? (
        <button
          type="button"
          disabled
          className="ghost-button mt-2 inline-flex w-full px-4 py-2 text-sm opacity-70 sm:w-fit"
        >
          即将上线
        </button>
      ) : (
        <Link
          href={diagram.href}
          className="ghost-button mt-2 inline-flex w-full px-4 py-2 text-sm sm:w-fit"
        >
          进入图谱
        </Link>
      )}
    </article>
  );
}
