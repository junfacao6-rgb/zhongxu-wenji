import Link from "next/link";
import { cn } from "@/components/design/utils";

type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  variant?: "paper" | "qimen" | "admin";
  className?: string;
};

const variantClass = {
  paper: {
    eyebrow: "text-cinnabar-700",
    title: "text-ink-900",
    description: "text-ink-500",
    action: "border-bronze-300 text-bronze-700 hover:border-bronze-600 hover:bg-paper-100",
    mark: "bg-cinnabar-700",
  },
  qimen: {
    eyebrow: "text-qimen-gold",
    title: "text-qimen-text",
    description: "text-qimen-muted",
    action: "border-qimen-line text-qimen-gold hover:bg-qimen-card",
    mark: "bg-qimen-gold",
  },
  admin: {
    eyebrow: "text-admin-orange",
    title: "text-admin-text",
    description: "text-admin-muted",
    action: "border-admin-line text-admin-blue hover:bg-admin-bg",
    mark: "bg-admin-orange",
  },
};

export default function SectionTitle({
  eyebrow,
  title,
  description,
  actionLabel,
  actionHref,
  variant = "paper",
  className,
}: SectionTitleProps) {
  const tone = variantClass[variant];

  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0">
        {eyebrow ? (
          <p className={cn("mb-2 flex items-center gap-2 text-sm font-semibold", tone.eyebrow)}>
            <span className={cn("h-4 w-1 rounded-full", tone.mark)} aria-hidden="true" />
            {eyebrow}
          </p>
        ) : null}
        <h2 className={cn("font-brand text-2xl font-semibold leading-tight sm:text-3xl", tone.title)}>{title}</h2>
        {description ? <p className={cn("mt-2 max-w-3xl text-sm leading-7", tone.description)}>{description}</p> : null}
      </div>
      {actionLabel && actionHref ? (
        <Link className={cn("inline-flex min-h-10 items-center justify-center rounded-md border px-3 text-sm font-medium", tone.action)} href={actionHref}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
