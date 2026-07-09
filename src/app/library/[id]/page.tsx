import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LibraryDetailPage from "@/components/site/LibraryDetailPage";
import { getBookById, siteContent } from "@/lib/site-content";

export function generateStaticParams() {
  return siteContent.books.map((book) => ({ id: book.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const book = getBookById(id);

  if (!book) {
    return {
      title: "书籍不存在 | 问古书斋",
      description: "该书籍不存在或已下架。",
    };
  }

  return {
    title: `${book.title} | 问古书斋`,
    description: book.summary,
  };
}

export default async function LibraryDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = getBookById(id);

  if (!book) {
    notFound();
  }

  return <LibraryDetailPage id={id} />;
}
