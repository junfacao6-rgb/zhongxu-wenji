import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SourceReaderPage from "@/components/site/SourceReaderPage";
import { getBookById, siteContent } from "@/lib/site-content";

export function generateStaticParams() {
  return siteContent.books
    .filter((book) => book.sourceFile)
    .map((book) => ({ id: book.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const book = getBookById(id);

  if (!book?.sourceFile) {
    return {
      title: "原书不存在 | 问古书斋",
      description: "该书暂未接入原书底本。",
    };
  }

  return {
    title: `${book.title} 原书阅读 | 问古书斋`,
    description: `阅读 ${book.sourceFile.label}`,
  };
}

export default async function LibrarySourceRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = getBookById(id);

  if (!book?.sourceFile) {
    notFound();
  }

  return <SourceReaderPage book={book} />;
}
