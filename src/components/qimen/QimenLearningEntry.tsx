import { ArrowRight } from "lucide-react";
import Link from "next/link";

type QimenLearningEntryProps = {
  title: string;
  description: string;
  href: string;
};

export default function QimenLearningEntry({ title, description, href }: QimenLearningEntryProps) {
  return (
    <Link className="qimen-learning-entry" href={href}>
      <strong>{title}</strong>
      <span>{description}</span>
      <ArrowRight aria-hidden="true" />
    </Link>
  );
}
