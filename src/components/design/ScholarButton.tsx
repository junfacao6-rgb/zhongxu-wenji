import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/components/design/utils";

type ScholarButtonProps = {
  children: ReactNode;
  href?: string;
  icon?: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "qimen";
  size?: "sm" | "md" | "lg";
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

const variantClass = {
  primary:
    "border-bronze-600 bg-bronze-600 text-paper-50 hover:border-bronze-700 hover:bg-bronze-700 focus-visible:outline-bronze-600",
  secondary:
    "border-bronze-300 bg-paper-100 text-ink-800 hover:border-bronze-600 hover:bg-paper-200 focus-visible:outline-bronze-600",
  ghost:
    "border-transparent bg-transparent text-ink-700 hover:border-bronze-300 hover:bg-paper-100 focus-visible:outline-bronze-600",
  qimen:
    "border-qimen-line bg-qimen-gold text-qimen-bg hover:bg-qimen-goldSoft focus-visible:outline-qimen-gold",
};

const sizeClass = {
  sm: "min-h-10 px-3 text-sm",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-5 text-base",
};

export default function ScholarButton({
  children,
  href,
  icon,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...buttonProps
}: ScholarButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-md border font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-55",
    variantClass[variant],
    sizeClass[size],
    className,
  );

  const content = (
    <>
      {icon ? <span className="inline-flex shrink-0 items-center" aria-hidden="true">{icon}</span> : null}
      <span>{children}</span>
    </>
  );

  if (href) {
    return (
      <Link className={classes} href={href}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} type={type} {...buttonProps}>
      {content}
    </button>
  );
}
