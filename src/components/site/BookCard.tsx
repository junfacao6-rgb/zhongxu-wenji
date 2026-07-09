import Link from "next/link";
import type { BookItem } from "@/lib/site-content";

const coverTheme: Record<string, { panel: string; strip: string; badge: string }> = {
  amber: {
    panel: "from-[#f4d7a9] via-[#f8e7c3] to-[#e7b87e]",
    strip: "from-[#a87940] to-[#6e4324]",
    badge: "text-[#57341a]",
  },
  jade: {
    panel: "from-[#d9efe0] via-[#ebf5ec] to-[#bddfcb]",
    strip: "from-[#2f6f5c] to-[#1d463e]",
    badge: "text-[#154138]",
  },
  ink: {
    panel: "from-[#dde1eb] via-[#eff1f6] to-[#c6cfdd]",
    strip: "from-[#364d6e] to-[#1e3048]",
    badge: "text-[#20324b]",
  },
  copper: {
    panel: "from-[#ead1a9] via-[#f1e0c2] to-[#d6a67c]",
    strip: "from-[#7a4e2a] to-[#57331a]",
    badge: "text-[#4e3020]",
  },
  rust: {
    panel: "from-[#ecd4bc] via-[#f0e2d2] to-[#dbb089]",
    strip: "from-[#8f4f32] to-[#6b2f1b]",
    badge: "text-[#542712]",
  },
  default: {
    panel: "from-[#efe8d9] via-[#f6efd8] to-[#e4cfb5]",
    strip: "from-[#6f5f4a] to-[#483c2f]",
    badge: "text-[#3e3122]",
  },
};

export default function BookCard({ book }: { book: BookItem }) {
  const theme = coverTheme[book.coverStyle] ?? coverTheme.default;

  return (
    <article className="paper-card group relative overflow-hidden rounded-lg">
      <div className="grid gap-4 p-4 md:p-5">
        <div className={`book-spine relative rounded-lg border border-[rgba(94,68,43,0.25)] bg-gradient-to-b ${theme.panel} p-5 pb-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]`}>
          <div className={`absolute left-0 top-0 h-full w-2 bg-gradient-to-b ${theme.strip} opacity-90`} />
          <div className="ml-3">
            <p className={`mb-2 text-xs uppercase tracking-[0.12em] ${theme.badge}`}>{book.category}</p>
            <h3 className="text-xl font-semibold text-[#352014]">{book.title}</h3>
            <p className="mt-1 text-sm leading-snug text-[#52351f]">{book.subtitle}</p>
          </div>
        </div>
        <div>
          <p className="mb-3 text-sm leading-relaxed text-[#5a4430]">{book.description}</p>
          <p className="mb-3 text-xs text-[#6d5940]">{book.summary}</p>
          <div className="mb-3 flex flex-wrap gap-2">
            {book.tags.map((tag) => (
              <span
                key={`${book.id}-${tag}`}
                className="rounded-full border border-[rgba(95,69,46,0.28)] bg-[rgba(255,255,255,0.5)] px-2 py-1 text-[11px] text-[#5c3e24]"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mb-4 flex items-center gap-3 text-xs text-[#5e4b38]">
            <span className="rounded-full border border-[rgba(88,64,38,0.24)] bg-white/45 px-2 py-1">共 {book.totalPages} 页</span>
            <span className={`rounded-full border border-[rgba(88,64,38,0.24)] bg-white/45 px-2 py-1 ${theme.badge}`}>{book.status}</span>
          </div>
          <div className="h-px bg-[linear-gradient(90deg,rgba(108,77,46,0.3),rgba(108,77,46,0))]" />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#6f5840]">点击查看书库详情，按章节学习</p>
          <Link
            href={`/library/${book.id}`}
            className="ink-button inline-flex shrink-0 px-4 py-2 text-xs sm:w-auto"
          >
            查看详情
          </Link>
        </div>
      </div>
    </article>
  );
}
