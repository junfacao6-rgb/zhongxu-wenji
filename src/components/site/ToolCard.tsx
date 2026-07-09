import type { ToolItem } from "@/lib/site-content";

type ToolActionStyle = "default" | "active" | "disabled";

type ToolCardProps = {
  tool: ToolItem;
  isActive?: boolean;
  actionLabel?: string;
  onActivate?: () => void;
};

export default function ToolCard({ tool, isActive = false, actionLabel, onActivate }: ToolCardProps) {
  const isDisabled = !onActivate;
  const style: ToolActionStyle = isDisabled ? "disabled" : isActive ? "active" : "default";

  const cardClass =
    style === "active"
      ? "border-[rgba(139,101,49,0.62)] bg-[rgba(245,229,190,0.82)] shadow-[0_16px_36px_rgba(58,34,9,0.13)]"
      : "";

  const buttonClass =
    style === "active"
      ? "ink-button border-transparent text-[#f6ebce]"
      : "ghost-button";

  return (
    <article className={`paper-card flex h-full flex-col justify-between rounded-lg p-5 ${cardClass}`}>
      <div>
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="text-xl font-semibold text-[#2f1d0c]">{tool.title}</h3>
          <span className="shrink-0 rounded-full border border-[rgba(128,80,33,0.28)] bg-white/35 px-2 py-1 text-xs text-[#9f3f2f]">{tool.status}</span>
        </div>
        <p className="text-sm leading-relaxed text-[#6a5238]">{tool.description}</p>
      </div>
      <button
        type="button"
        onClick={onActivate}
        disabled={isDisabled}
        className={`mt-4 inline-flex w-full px-4 py-2 text-sm sm:w-fit ${buttonClass} ${
          isDisabled ? "cursor-not-allowed opacity-60" : ""
        }`}
      >
        {actionLabel ?? (isDisabled ? "开发中" : "进入工具")}
      </button>
    </article>
  );
}
