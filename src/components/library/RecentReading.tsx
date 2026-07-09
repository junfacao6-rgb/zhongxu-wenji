import Link from "next/link";
import type { WenguReadingRecord } from "@/lib/wengu-reading-progress";

function getRecordHref(record: WenguReadingRecord) {
  if (record.chapterTitle === "原书影像" || record.chapterTitle === "提取文字") {
    return `/library/${record.bookId}/source`;
  }
  return `/library/${record.bookId}/read?chapter=${record.chapterIndex + 1}`;
}

const fallbackRecords = [
  { title: "子平真诠", detail: "格局与用神 · 原典入口" },
  { title: "奇门入门正义", detail: "九宫八门 · 学习路径" },
  { title: "道德经", detail: "道家经典 · 短读" },
];

export default function RecentReading({ records }: { records: WenguReadingRecord[] }) {
  return (
    <aside className="wen-gu-section library-recent-reading" id="reading-record">
      <div className="wen-gu-section-head library-recent-head">
        <div>
          <p>本机</p>
          <h2>最近阅读</h2>
        </div>
        <Link href="/me/books">查看全部</Link>
      </div>

      {records.length ? (
        <div className="wen-gu-record-list">
          {records.slice(0, 6).map((record) => (
            <Link href={getRecordHref(record)} key={record.bookId}>
              <span>{record.title}</span>
              <small>
                {record.chapterTitle ?? `读到第 ${record.chapterIndex + 1} 章`}
                {typeof record.progressPercent === "number" ? ` · ${record.progressPercent}%` : ""}
              </small>
            </Link>
          ))}
        </div>
      ) : (
        <div className="library-recent-empty">
          <p>开始阅读后，进度会保存在当前设备。</p>
          {fallbackRecords.map((item) => (
            <span key={item.title}>
              <strong>{item.title}</strong>
              <small>{item.detail}</small>
            </span>
          ))}
        </div>
      )}
    </aside>
  );
}
