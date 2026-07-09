import Link from "next/link";
import { diagramCategories } from "@/data/diagrams";

export default function DiagramsPage() {
  const available = diagramCategories.filter((diagram) => diagram.status === "available");
  const planned = diagramCategories.filter((diagram) => diagram.status !== "available");

  return (
    <section className="knowledge-shell pb-10 pt-10 md:pb-14 md:pt-14">
      <header className="light-page-hero">
        <p className="eyebrow-line">DIAGRAMS</p>
        <h1 className="mt-4 text-4xl font-semibold text-[#2f1d0c]">图示中心</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6a5238]">
          以「传统文化图示」为入口，构建按结构、关系、要点三层展开的可学可用目录。当前先开启五行图谱，并保留其余模块的规划入口。
        </p>
      </header>

      <div className="mt-8 space-y-8">
        {[
          { label: "已开放", list: available },
          { label: "规划中", list: planned },
        ].map((group) => (
          <section key={group.label} className="border-t border-[rgba(92,61,28,0.1)] pt-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-full bg-[#f5e1d9] px-3 py-1 text-xs font-semibold text-[#9f3f2f]">{group.label}</span>
              <h2 className="text-xl font-semibold text-[#2f1d0c]">图谱目录</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {group.list.map((diagram) => {
                const isAvailable = diagram.status === "available";
                const content = (
                  <>
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-[#2f1d0c]">{diagram.title}</h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#7a6042]">{diagram.description}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="rounded-full bg-[#f8eee3] px-2 py-1 text-[11px] text-[#9f3f2f]">
                        {isAvailable ? "可用" : "建设中"}
                      </span>
                      <span className="text-sm text-[#9f3f2f]">→</span>
                    </div>
                  </>
                );

                return isAvailable ? (
                  <Link key={diagram.id} href={diagram.href} className="directory-card group flex items-center justify-between gap-4 p-4">
                    {content}
                  </Link>
                ) : (
                  <div key={diagram.id} className="directory-card flex items-center justify-between gap-4 p-4 opacity-75">
                    {content}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
