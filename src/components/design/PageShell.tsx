import type { ReactNode } from "react";
import TextureOverlay from "@/components/design/TextureOverlay";
import { cn } from "@/components/design/utils";

type PageShellProps = {
  children: ReactNode;
  variant?: "default" | "qimen" | "admin";
  width?: "md" | "lg" | "xl" | "full";
  withTexture?: boolean;
  className?: string;
  contentClassName?: string;
};

const variantClass = {
  default: "bg-paper text-ink",
  qimen: "bg-qimen",
  admin: "bg-admin-bg text-admin-text",
};

const textureVariant = {
  default: "paper",
  qimen: "qimen",
  admin: "admin",
} as const;

const widthClass = {
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-[1360px]",
  full: "max-w-none",
};

export default function PageShell({
  children,
  variant = "default",
  width = "xl",
  withTexture = true,
  className,
  contentClassName,
}: PageShellProps) {
  return (
    <section className={cn("relative isolate min-h-screen overflow-hidden", variantClass[variant], className)}>
      {withTexture ? <TextureOverlay variant={textureVariant[variant]} /> : null}
      <div className={cn("relative z-10 mx-auto w-full px-4 py-8 sm:px-6 lg:px-8", widthClass[width], contentClassName)}>
        {children}
      </div>
    </section>
  );
}
