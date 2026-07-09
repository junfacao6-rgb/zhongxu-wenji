import type { ReactNode } from "react";
import InkCard from "@/components/design/InkCard";
import ScholarButton from "@/components/design/ScholarButton";
import { cn } from "@/components/design/utils";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  variant?: "paper" | "qimen" | "admin";
  className?: string;
};

const iconClass = {
  paper: "border-cinnabar-100 bg-paper-50 text-cinnabar-700",
  qimen: "border-qimen-line bg-qimen-card text-qimen-gold",
  admin: "border-admin-line bg-admin-bg text-admin-blue",
};

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  variant = "paper",
  className,
}: EmptyStateProps) {
  return (
    <InkCard className={cn("flex flex-col items-center justify-center px-6 py-10 text-center", className)} variant={variant === "paper" ? "paper" : variant}>
      {icon ? <div className={cn("mb-4 flex h-12 w-12 items-center justify-center rounded-lg border", iconClass[variant])}>{icon}</div> : null}
      <h3 className={cn("font-brand text-2xl font-semibold", variant === "qimen" ? "text-qimen-text" : variant === "admin" ? "text-admin-text" : "text-ink-900")}>
        {title}
      </h3>
      {description ? (
        <p className={cn("mt-3 max-w-xl text-sm leading-7", variant === "qimen" ? "text-qimen-muted" : variant === "admin" ? "text-admin-muted" : "text-ink-500")}>
          {description}
        </p>
      ) : null}
      {actionLabel && actionHref ? (
        <ScholarButton className="mt-6" href={actionHref} variant={variant === "qimen" ? "qimen" : "secondary"}>
          {actionLabel}
        </ScholarButton>
      ) : null}
    </InkCard>
  );
}
