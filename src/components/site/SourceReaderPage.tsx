"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ExternalLink, FileText, ScrollText } from "lucide-react";
import type { BookItem } from "@/lib/site-content";
import { writeWenguReadingRecord } from "@/lib/wengu-reading-progress";
import { getBookAttribution, getWenguCategory } from "@/lib/wengu-library";

type SourceMode = "original" | "text";

type PdfViewport = {
  width: number;
  height: number;
};

type PdfPage = {
  getViewport: (options: { scale: number }) => PdfViewport;
  render: (options: {
    canvasContext: CanvasRenderingContext2D;
    viewport: PdfViewport;
  }) => { promise: Promise<void>; cancel?: () => void };
};

type PdfDocument = {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PdfPage>;
};

type SourceReaderPageProps = {
  book: BookItem;
};

export default function SourceReaderPage({ book }: SourceReaderPageProps) {
  const category = getWenguCategory(book);
  const attribution = getBookAttribution(book);
  const isPdf = book.sourceFile?.format === "PDF";
  const [mode, setMode] = useState<SourceMode>("original");
  const [loadedText, setLoadedText] = useState<{ href: string; text: string } | null>(null);
  const [textLoading, setTextLoading] = useState(false);
  const [pdfDocument, setPdfDocument] = useState<PdfDocument | null>(null);
  const [pdfPage, setPdfPage] = useState(1);
  const [pdfPageCount, setPdfPageCount] = useState(0);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [renderTick, setRenderTick] = useState(0);
  const pdfShellRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const savedPdfPageRef = useRef<number | null>(null);
  const sourcePageStorageKey = `wengu-source-page:${book.id}`;

  const activeTextFile = useMemo(() => {
    if (mode === "text") return book.extractedTextFile;
    if (!isPdf && book.sourceFile?.format === "TXT") {
      return {
        label: book.sourceFile.label,
        href: book.sourceFile.href,
        sizeLabel: book.sourceFile.sizeLabel,
        status: "ready" as const,
      };
    }
    return undefined;
  }, [book.extractedTextFile, book.sourceFile, isPdf, mode]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedMode = params.get("mode");
    const requestedPage = Number(params.get("page"));
    const savedPage = Number(window.localStorage.getItem(sourcePageStorageKey));

    if (requestedMode === "text" && book.extractedTextFile) {
      setMode("text");
    }

    if (Number.isFinite(requestedPage) && requestedPage >= 1) {
      savedPdfPageRef.current = requestedPage;
    } else if (Number.isFinite(savedPage) && savedPage >= 1) {
      savedPdfPageRef.current = savedPage;
    }
  }, [book.extractedTextFile, sourcePageStorageKey]);

  useEffect(() => {
    const progressPercent = mode === "original" && pdfPageCount
      ? Math.round((pdfPage / pdfPageCount) * 100)
      : undefined;

    writeWenguReadingRecord({
      bookId: book.id,
      title: book.title,
      chapterIndex: mode === "original" ? pdfPage - 1 : 0,
      chapterTitle: mode === "original" ? "原书影像" : "提取文字",
      progressPercent,
      updatedAt: new Date().toISOString(),
    });

    if (mode === "original" && isPdf && pdfPage > 0) {
      window.localStorage.setItem(sourcePageStorageKey, String(pdfPage));
    }
  }, [book.id, book.title, isPdf, mode, pdfPage, pdfPageCount, sourcePageStorageKey]);

  const selectMode = (nextMode: SourceMode) => {
    setMode(nextMode);
    const nextUrl = nextMode === "text" ? `/library/${book.id}/source?mode=text` : `/library/${book.id}/source`;
    window.history.replaceState(null, "", nextUrl);
  };

  useEffect(() => {
    if (!isPdf || !book.sourceFile || mode !== "original") return;

    let cancelled = false;
    setPdfLoading(true);
    setPdfError(null);

    import("pdfjs-dist")
      .then((pdfjs) => {
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        return pdfjs.getDocument(book.sourceFile!.href).promise as unknown as Promise<PdfDocument>;
      })
      .then((document) => {
        if (cancelled) return;
        setPdfDocument(document);
        setPdfPageCount(document.numPages);
        setPdfPage(Math.min(document.numPages, savedPdfPageRef.current ?? 1));
      })
      .catch(() => {
        if (!cancelled) setPdfError("原书影像暂时无法展开，可以先打开原文件或切换提取文字。");
      })
      .finally(() => {
        if (!cancelled) setPdfLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [book.sourceFile, isPdf, mode]);

  useEffect(() => {
    if (!pdfDocument || mode !== "original") return;

    let cancelled = false;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    pdfDocument.getPage(pdfPage)
      .then((page) => {
        if (cancelled) return null;
        const baseViewport = page.getViewport({ scale: 1 });
        const shellWidth = pdfShellRef.current?.clientWidth ?? baseViewport.width;
        const scale = Math.min(2, Math.max(0.45, (shellWidth - 28) / baseViewport.width));
        const viewport = page.getViewport({ scale });
        const dpr = window.devicePixelRatio || 1;

        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        context.clearRect(0, 0, viewport.width, viewport.height);

        return page.render({ canvasContext: context, viewport });
      })
      .then((task) => task?.promise)
      .catch(() => {
        if (!cancelled) setPdfError("当前页暂时无法渲染，请稍后重试。");
      });

    return () => {
      cancelled = true;
    };
  }, [mode, pdfDocument, pdfPage, renderTick]);

  useEffect(() => {
    if (mode !== "original") return;
    const handleResize = () => setRenderTick((tick) => tick + 1);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mode]);

  useEffect(() => {
    if (!activeTextFile) return;

    const controller = new AbortController();
    setTextLoading(true);
    fetch(activeTextFile.href, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load text: ${response.status}`);
        return response.text();
      })
      .then((text) => setLoadedText({ href: activeTextFile.href, text }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLoadedText({
          href: activeTextFile.href,
          text: "提取文字暂时无法加载，请稍后重试。",
        });
      })
      .finally(() => setTextLoading(false));

    return () => controller.abort();
  }, [activeTextFile]);

  const textContent = loadedText && loadedText.href === activeTextFile?.href ? loadedText.text : "";

  return (
    <section className="wen-gu-source-reader-page">
      <header className="wen-gu-reader-top wen-gu-source-reader-top">
        <Link href={`/library/${book.id}`} className="wen-gu-back-link">
          <ArrowLeft className="h-4 w-4" />
          返回书目
        </Link>
        <div>
          <p>{category.label}</p>
          <h1>{book.title}</h1>
        </div>
        {book.sourceFile ? (
          <Link className="wen-gu-source-plain-link" href={book.sourceFile.href} target="_blank" rel="noreferrer">
            <ExternalLink className="h-4 w-4" />
            原文件
          </Link>
        ) : null}
      </header>

      <div className="wen-gu-source-reader-intro">
        <div>
          <p>原书阅读</p>
          <h2>{book.sourceFile?.label ?? book.title}</h2>
          <span>
            可在原书影像和提取文字之间切换：原书保留底本样貌，文字版便于手机阅读、检索和后续校注。
          </span>
        </div>
        <dl className="wen-gu-source-reader-facts" aria-label="书籍信息">
          <div>
            <dt>门类</dt>
            <dd>{category.label}</dd>
          </div>
          <div>
            <dt>作者</dt>
            <dd>{attribution}</dd>
          </div>
          <div>
            <dt>底本</dt>
            <dd>{book.sourceFile?.format ?? "导读"}</dd>
          </div>
        </dl>
      </div>

      <div className="wen-gu-source-tabs" role="tablist" aria-label="原书阅读模式">
        <button className={mode === "original" ? "active" : undefined} onClick={() => selectMode("original")} type="button">
          <ScrollText className="h-4 w-4" />
          原书影像
        </button>
        <button
          className={mode === "text" ? "active" : undefined}
          disabled={!book.extractedTextFile}
          onClick={() => selectMode("text")}
          type="button"
        >
          <FileText className="h-4 w-4" />
          提取文字
        </button>
      </div>

      {mode === "original" ? (
        isPdf ? (
          <div className="wen-gu-pdf-canvas-shell" ref={pdfShellRef}>
            <div className="wen-gu-pdf-canvas-toolbar">
              <button disabled={pdfPage <= 1 || pdfLoading} onClick={() => setPdfPage((page) => Math.max(1, page - 1))} type="button">
                上一页
              </button>
              <span>{pdfLoading ? "展开中" : `${pdfPage} / ${pdfPageCount || "-"}`}</span>
              <button disabled={pdfPage >= pdfPageCount || pdfLoading} onClick={() => setPdfPage((page) => Math.min(pdfPageCount, page + 1))} type="button">
                下一页
              </button>
              {book.sourceFile ? (
                <Link href={book.sourceFile.href} target="_blank" rel="noreferrer">
                  原文件
                </Link>
              ) : null}
            </div>
            <div className="wen-gu-pdf-canvas-stage">
              {pdfError ? <p>{pdfError}</p> : null}
              {pdfLoading ? <p>正在展开原书...</p> : null}
              <canvas ref={canvasRef} aria-label={`${book.title}第 ${pdfPage} 页原书影像`} />
            </div>
          </div>
        ) : (
          <article className="wen-gu-text-reader-shell">
            <div className="wen-gu-text-reader-head">
              <span>原始文本底本</span>
              {book.sourceFile ? (
                <Link href={book.sourceFile.href} target="_blank" rel="noreferrer">
                  打开文件
                </Link>
              ) : null}
            </div>
            <pre>{textLoading ? "正在读取文本..." : textContent}</pre>
          </article>
        )
      ) : (
        <article className="wen-gu-text-reader-shell">
          <div className="wen-gu-text-reader-head">
            <span>{book.extractedTextFile?.status === "needs_ocr" ? "待 OCR" : "提取文字"}</span>
            {book.extractedTextFile ? (
              <Link href={book.extractedTextFile.href} target="_blank" rel="noreferrer">
                {book.extractedTextFile.label} · {book.extractedTextFile.sizeLabel}
              </Link>
            ) : null}
          </div>
          <pre>{textLoading ? "正在读取提取文字..." : textContent}</pre>
        </article>
      )}
    </section>
  );
}
