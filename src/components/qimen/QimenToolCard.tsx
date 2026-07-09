import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type QimenToolCardProps = {
  title: string;
  subtitle: string;
  href: string;
  icon: LucideIcon;
  meta: string;
};

export default function QimenToolCard({ title, subtitle, href, icon: Icon, meta }: QimenToolCardProps) {
  return (
    <Link className="qimen-tool-card" href={href}>
      <div className="qimen-tool-card-icon">
        <Icon aria-hidden="true" />
      </div>
      <div>
        <span>{meta}</span>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <small>
        进入
        <ArrowRight aria-hidden="true" />
      </small>
    </Link>
  );
}
