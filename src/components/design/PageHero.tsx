import type { ReactNode } from "react";
import ScholarButton from "@/components/design/ScholarButton";
import TextureOverlay from "@/components/design/TextureOverlay";
import { cn } from "@/components/design/utils";

export type PageHeroAction = {
  label: string;
  href: string;
  icon?: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "qimen";
};

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: PageHeroAction[];
  visual?: ReactNode;
  variant?: "paper" | "qimen" | "minimal";
  className?: string;
};

const variantClass = {
  paper: {
    shell: "border-bronze-300/50 bg-paper-100/80 text-ink-800",
    eyebrow: "text-cinnabar-700",
    title: "text-ink-900",
    description: "text-ink-700",
    texture: "paper",
  },
  qimen: {
    shell: "border-qimen-line bg-qimen-panel text-qimen-text",
    eyebrow: "text-qimen-gold",
    title: "text-qimen-text",
    description: "text-qimen-muted",
    texture: "qimen",
  },
  minimal: {
    shell: "border-transparent bg-transparent text-ink-800",
    eyebrow: "text-cinnabar-700",
    title: "text-ink-900",
    description: "text-ink-700",
    texture: "minimal",
  },
} as const;

export default function PageHero({
  eyebrow,
  title,
  description,
  actions = [],
  visual,
  variant = "paper",
  className,
}: PageHeroProps) {
  const tone = variantClass[variant];

  return (
    <section className={cn("relative isolate overflow-hidden rounded-xl border p-6 sm:p-8 lg:p-10", tone.shell, className)}>
      <TextureOverlay variant={tone.texture} className={variant === "minimal" ? "opacity-40" : undefined} />
      <div className={cn("relative z-10 grid gap-8", visual ? "lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-center" : "")}>
        <div className="min-w-0">
          {eyebrow ? <p className={cn("mb-3 text-sm font-semibold", tone.eyebrow)}>{eyebrow}</p> : null}
          <h1 className={cn("font-brand text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl", tone.title)}>{title}</h1>
          {description ? <p className={cn("mt-5 max-w-3xl text-base leading-8", tone.description)}>{description}</p> : null}
          {actions.length > 0 ? (
            <div className="mt-7 flex flex-wrap gap-3">
              {actions.map((action) => (
                <ScholarButton
                  href={action.href}
                  icon={action.icon}
                  key={`${action.href}-${action.label}`}
                  variant={action.variant ?? (variant === "qimen" ? "qimen" : "primary")}
                >
                  {action.label}
                </ScholarButton>
              ))}
            </div>
          ) : null}
        </div>
        {visual ? <div className="relative z-10 min-w-0">{visual}</div> : null}
      </div>
    </section>
  );
}
