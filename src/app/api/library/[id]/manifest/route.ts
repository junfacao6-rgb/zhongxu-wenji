import { NextResponse } from "next/server";
import { getBookById } from "@/lib/site-content";
import { getBookAttribution } from "@/lib/wengu-library";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = getBookById(id);

  if (!book?.sourceFile || book.sourceFile.format !== "PDF") {
    return NextResponse.json({ error: "PDF source not found" }, { status: 404 });
  }

  const requestUrl = new URL(request.url);
  const requestedOrigin = requestUrl.searchParams.get("origin");
  const origin = requestedOrigin?.startsWith("http://") || requestedOrigin?.startsWith("https://")
    ? requestedOrigin
    : requestUrl.origin;
  const manifestUrl = new URL(`/api/library/${book.id}/manifest?origin=${encodeURIComponent(origin)}`, origin).toString();
  const sourceUrl = new URL(book.sourceFile.href, origin).toString();
  const manifest = {
    "@context": "https://readium.org/webpub-manifest/context.jsonld",
    metadata: {
      title: book.title,
      subtitle: book.subtitle,
      author: getBookAttribution(book),
      language: "zh-CN",
    },
    links: [
      {
        rel: "self",
        href: manifestUrl,
        type: "application/webpub+json",
      },
    ],
    readingOrder: [
      {
        href: sourceUrl,
        type: "application/pdf",
        title: book.sourceFile.label,
      },
    ],
    toc: book.tableOfContents.map((chapter, index) => ({
      title: chapter,
      href: sourceUrl,
      children: [],
      position: index + 1,
    })),
  };

  return NextResponse.json(manifest);
}
