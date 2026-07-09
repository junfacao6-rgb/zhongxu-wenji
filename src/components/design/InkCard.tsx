import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/components/design/utils";

type InkCardProps = {
  children: ReactNode;
  variant?: "paper" | "elevated" | "qimen" | "admin";
  hoverable?: boolean;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

const variantClass = {
  paper: "border-bronze-300/50 bg-paper-100/85 text-ink-800 shadow-[0_12px_30px_rgba(67,42,14,0.06)]",
  elevated: "border-bronze-300/60 bg-paper-50 text-ink-800 shadow-[0_18px_48px_rgba(67,42,14,0.1)]",
  qimen: "border-qimen-line bg-qimen-panel text-qimen-text shadow-[0_18px_48px_rgba(0,0,0,0.22)]",
  admin: "border-admin-line bg-admin-panel text-admin-text shadow-[0_10px_28px_rgba(36,33,28,0.06)]",
};

export default function InkCard({ children, variant = "paper", hoverable = false, className, ...props }: InkCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-5",
        variantClass[variant],
        hoverable && "transition-colors hover:border-bronze-600",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
