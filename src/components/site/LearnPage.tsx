import { siteContent } from "@/lib/site-content";

export default function LearnPage() {
  return (
    <section className="knowledge-shell pb-10 pt-10 md:pb-14 md:pt-14">
      <header className="light-page-hero">
        <p className="eyebrow-line">LEARNING</p>
        <h1 className="mt-4 text-4xl font-semibold text-[#2f1d0c]">学习路径</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6a5238]">
          学习路径按基础、实盘、工具三条线设计，建议按自己的节奏逐周推进，保留每一步的复盘记录。
        </p>
      </header>
      <div className="mt-8 flex flex-wrap gap-3">
        <span className="soft-tab-active inline-flex min-h-10 items-center rounded-full px-5 text-sm font-semibold">本周重点</span>
        <span className="soft-tab inline-flex min-h-10 items-center rounded-full px-5 text-sm font-semibold">课程路径</span>
        <span className="soft-tab inline-flex min-h-10 items-center rounded-full px-5 text-sm font-semibold">复盘模板</span>
      </div>
      <div className="mt-8 grid gap-3 md:grid-cols-3">
        {siteContent.learningPaths.map((path) => (
          <article key={path.id} className="directory-card p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-[#2f1d0c]">{path.title}</h2>
              <span className="rounded-full bg-[#f8eee3] px-2 py-1 text-[11px] text-[#9f3f2f]">{path.items.length} 步</span>
            </div>
            <p className="text-sm leading-7 text-[#6a5238]">{path.summary}</p>
            <ul className="mt-4 space-y-2 text-sm text-[#6a4f33]">
              {path.items.map((item) => (
                <li key={item} className="list-disc pl-1 marker:text-[#74440f]">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
