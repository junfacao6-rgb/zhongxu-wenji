import { cn } from "@/components/design/utils";

type TextureOverlayProps = {
  variant?: "paper" | "qimen" | "admin" | "minimal";
  className?: string;
};

const variantClass = {
  paper:
    "bg-[linear-gradient(90deg,rgba(124,88,53,0.035)_1px,transparent_1px),linear-gradient(0deg,rgba(124,88,53,0.025)_1px,transparent_1px),radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.52),transparent_32%)] bg-[length:32px_32px,32px_32px,auto]",
  qimen:
    "bg-[linear-gradient(90deg,rgba(126,97,56,0.22)_1px,transparent_1px),linear-gradient(0deg,rgba(126,97,56,0.16)_1px,transparent_1px),radial-gradient(circle_at_82%_8%,rgba(208,168,104,0.16),transparent_34%)] bg-[length:42px_42px,42px_42px,auto]",
  admin:
    "bg-[linear-gradient(90deg,rgba(36,33,28,0.035)_1px,transparent_1px),linear-gradient(0deg,rgba(36,33,28,0.025)_1px,transparent_1px)] bg-[length:28px_28px,28px_28px]",
  minimal:
    "bg-[radial-gradient(circle_at_12%_10%,rgba(255,255,255,0.42),transparent_34%)]",
};

export default function TextureOverlay({ variant = "paper", className }: TextureOverlayProps) {
  return <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 opacity-70", variantClass[variant], className)} />;
}
