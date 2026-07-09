import type { Metadata, Viewport } from "next";
import PageShell from "@/components/layout/PageShell";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "问古书斋",
  description: "一处安静读古籍的地方。按分类寻找古籍，按章节慢慢阅读。",
  icons: {
    icon: [
      { url: "/brand/wengu-seal.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <PageShell>{children}</PageShell>
      </body>
    </html>
  );
}
