"use client";

import { CheckCircle2, Edit3, RotateCcw, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import DocumentStatusBadge from "@/components/admin/documents/DocumentStatusBadge";
import SegmentEditor from "@/components/admin/segments/SegmentEditor";
import type { AdminSegmentMock } from "@/data/adminMock";

type SegmentReviewTableProps = {
  segments: AdminSegmentMock[];
};

export default function SegmentReviewTable({ segments }: SegmentReviewTableProps) {
  const [selectedId, setSelectedId] = useState(segments[0]?.id ?? "");

  const selectedSegment = useMemo(() => segments.find((segment) => segment.id === selectedId) ?? segments[0], [segments, selectedId]);

  return (
    <section className="segment-admin-panel">
      <div className="segment-admin-intro">
        <div>
          <span>SourceSegment 审核</span>
          <h2>资料片段列表</h2>
          <p>片段中的原文、清洗文本、白话翻译、注解和相关术语均为 mock 草稿；通过审核后才可用于课程或公开内容。</p>
        </div>
        <strong>{segments.length} 个片段</strong>
      </div>

      <div className="segment-review-layout">
        <div className="segment-table-card">
          <div className="segment-table-head">
            <span>片段审核队列</span>
            <small>操作按钮仅为 UI，不接真实 AI 或发布流程。</small>
          </div>

          <div className="segment-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>所属资料</th>
                  <th>页码</th>
                  <th>章节</th>
                  <th>原文</th>
                  <th>清洗文本</th>
                  <th>白话翻译</th>
                  <th>注解</th>
                  <th>相关术语</th>
                  <th>审核状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {segments.map((segment) => (
                  <tr key={segment.id} className={selectedId === segment.id ? "is-selected" : ""}>
                    <td>
                      <strong>{segment.documentTitle}</strong>
                      <small>{segment.id}</small>
                    </td>
                    <td>{segment.pageLabel}</td>
                    <td>{segment.chapterTitle}</td>
                    <td className="segment-text-cell">{segment.originalText}</td>
                    <td className="segment-text-cell">{segment.cleanedText}</td>
                    <td className="segment-text-cell">{segment.modernTranslation}</td>
                    <td>
                      <ul>
                        {segment.notes.map((note) => (
                          <li key={note}>{note}</li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      <div className="segment-term-list">
                        {segment.relatedTerms.map((term) => (
                          <em key={term}>{term}</em>
                        ))}
                      </div>
                    </td>
                    <td><DocumentStatusBadge value={segment.reviewStatus} /></td>
                    <td>
                      <div className="segment-action-stack">
                        <button type="button" onClick={() => setSelectedId(segment.id)}>
                          <Edit3 aria-hidden="true" />
                          编辑
                        </button>
                        <button type="button">
                          <CheckCircle2 aria-hidden="true" />
                          通过
                        </button>
                        <button type="button">
                          <RotateCcw aria-hidden="true" />
                          退回
                        </button>
                        <button type="button">
                          <Sparkles aria-hidden="true" />
                          生成课程
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedSegment ? <SegmentEditor segment={selectedSegment} /> : null}
      </div>
    </section>
  );
}
