import type { Metadata } from "next";
import ContentTimingPanel from "@/components/qimen/ContentTimingPanel";

export const metadata: Metadata = {
  title: "内容发布择时 | 奇门问时 | 问古书斋",
  description: "面向内容创作者、课程老师、命理师和私域运营者的内容发布择时 mock 页面。",
};

export default function QimenContentTimingPage() {
  return (
    <main className="qimen-content-timing-page">
      <section className="qimen-content-timing-hero">
        <span>内容发布择时</span>
        <h1>为内容发布、课程预告和私域承接选择参考时段</h1>
        <p>
          面向内容创作者、课程老师、命理师和私域运营者，结合平台、内容目的与 mock 盘面结构，
          输出发布时间、标题方向、表达风格、评论区注意事项和私域转化建议。
        </p>
      </section>

      <ContentTimingPanel />
    </main>
  );
}
