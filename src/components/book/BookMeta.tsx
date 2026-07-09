import { BadgeCheck, BookMarked, Copyright, Eye, Layers, UserRound } from "lucide-react";
import type { Book } from "@/types/content";
import type { CopyrightStatus, SubjectKey, Visibility } from "@/types/platform";

const subjectLabels: Record<SubjectKey, string> = {
  qimen: "奇门遁甲",
  bazi: "八字命理",
  liuyao: "六爻纳甲",
  meihua: "梅花易数",
  dao: "道家经典",
  yixue: "易学基础",
};

const copyrightLabels: Record<CopyrightStatus, string> = {
  public_domain: "公版古籍",
  self_owned: "自有讲义",
  authorized: "已授权",
  excerpt_only: "仅摘录",
  private_study: "私密学习",
  hidden: "隐藏",
};

const visibilityLabels: Record<Visibility, string> = {
  public: "公开",
  members: "会员可见",
  course: "课程可见",
  private: "私密",
  hidden: "隐藏",
};

function formatReadCount(readCount: number) {
  if (readCount >= 10000) return `${(readCount / 10000).toFixed(1)} 万`;
  return `${readCount}`;
}

export default function BookMeta({ book }: { book: Book }) {
  const items = [
    { label: "作者", value: book.author || "待考", icon: UserRound },
    { label: "朝代", value: book.dynasty || "待考", icon: BookMarked },
    { label: "学科", value: subjectLabels[book.subject], icon: Layers },
    { label: "难度", value: book.difficulty, icon: BadgeCheck },
    { label: "版权", value: copyrightLabels[book.copyrightStatus], icon: Copyright },
    { label: "可见性", value: visibilityLabels[book.visibility], icon: Eye },
  ];

  return (
    <section className="book-detail-card book-meta-card" aria-labelledby="book-meta-title">
      <div className="book-section-head">
        <span>书籍信息</span>
        <h2 id="book-meta-title">基本档案</h2>
      </div>

      <dl className="book-meta-grid">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="book-meta-item">
              <dt>
                <Icon aria-hidden="true" />
                {item.label}
              </dt>
              <dd>{item.value}</dd>
            </div>
          );
        })}
        <div className="book-meta-item">
          <dt>分类</dt>
          <dd>{book.category}</dd>
        </div>
        <div className="book-meta-item">
          <dt>阅读人数</dt>
          <dd>{formatReadCount(book.readCount)} 人读过</dd>
        </div>
      </dl>
    </section>
  );
}
