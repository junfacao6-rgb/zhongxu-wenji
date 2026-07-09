import type { ReactNode } from "react";
import { cn } from "@/components/design/utils";

type SealBadgeProps = {
  children: ReactNode;
  tone?: "cinnabar" | "bronze" | "jade" | "muted" | "danger" | "success";
  className?: string;
};

const toneClass = {
  cinnabar: "border-cinnabar-700 bg-cinnabar-100 text-cinnabar-700",
  bronze: "border-bronze-600 bg-paper-100 text-bronze-700",
  jade: "border-jade-500 bg-jade-100 text-jade-700",
  muted: "border-paper-300 bg-paper-100 text-ink-500",
  danger: "border-admin-red bg-cinnabar-100 text-admin-red",
  success: "border-admin-green bg-jade-100 text-admin-green",
};

export default function SealBadge({ children, tone = "cinnabar", className }: SealBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center justify-center rounded px-2 py-0.5 text-xs font-medium leading-none tracking-wide",
        "border",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
