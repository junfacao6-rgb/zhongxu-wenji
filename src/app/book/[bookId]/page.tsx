import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Compass, FileText, ShieldCheck, Target, UsersRound } from "lucide-react";
import BookHero, { type BookAccess } from "@/components/book/BookHero";
import BookMeta from "@/components/book/BookMeta";
import BookToc from "@/components/book/BookToc";
import RelatedCourses from "@/components/book/RelatedCourses";
import RelatedTerms from "@/components/book/RelatedTerms";
import { platformMockBooks } from "@/data/books";
import { courses } from "@/data/courses";
import { terms } from "@/data/terms";
import type { Book, Term } from "@/types/content";
import type { CopyrightStatus, SubjectKey } from "@/types/platform";

type RelatedTool = {
  title: string;
  href: string;
  description: string;
};

type BookDetailMock = {
  suitableAudience: string[];
  learningFocus: string[];
  toc: string[];
  excerpt: string;
  relatedTools: RelatedTool[];
};

const readableCopyrightStatuses: CopyrightStatus[] = ["public_domain", "self_owned", "authorized"];

const detailBySubject: Record<SubjectKey, BookDetailMock> = {
  qimen: {
    suitableAudience: ["想从九宫、八门、九星建立奇门基础的人", "需要把古籍术语和现代讲义对应起来的学习者", "希望结合案例与工具做复盘的人"],
    learningFocus: ["先分清宫、门、星、神、干的层次", "记录格局成立条件和限制条件", "用案例复盘验证判断链"],
    toc: ["资料边界与阅读方法", "九宫与洛书骨架", "八门九星八神", "三奇六仪与常见格局", "案例摘读与复盘提示"],
    excerpt: "短摘样例：奇门学习宜先定宫位与用神，再观察门、星、神、干之间的结构倾向。相关判断只作传统文化学习与行动参考。",
    relatedTools: [
      { title: "今日气机", href: "/qimen/today", description: "用 mock 盘面观察当天行动节奏，适合练习术语和复盘。" },
      { title: "专业排盘", href: "/qimen/chart", description: "预留九宫盘式入口，后续接规则引擎输出。" },
      { title: "一事择时", href: "/qimen/select-time", description: "围绕一件具体事项生成参考时段，不作绝对承诺。" },
      { title: "报告预览", href: "/qimen/report/preview", description: "查看结构化报告样式，后续接 evidence 和审核流程。" },
    ],
  },
  bazi: {
    suitableAudience: ["刚开始学习八字基础语言的人", "需要梳理阴阳五行、十神和月令关系的人", "希望通过案例学习结构分析的人"],
    learningFocus: ["以日主、月令、十神建立观察中心", "区分旺衰、格局、调候与用神", "把结论写成可复盘的条件链"],
    toc: ["阴阳五行与干支", "日主与十神关系", "月令、旺衰与格局", "调候与用神参考", "案例拆解与复盘"],
    excerpt: "短摘样例：八字学习先看结构，再看用神与岁运影响。所有解释都应回到原局、大运、流年的条件组合中参考。",
    relatedTools: [
      { title: "八字学科中心", href: "/subjects/bazi", description: "查看八字学习地图和后续排盘工具预留区。" },
      { title: "术语库", href: "/terms", description: "检索日主、月令、十神、格局、用神等基础术语。" },
      { title: "八字入门课", href: "/courses/bazi-intro-course", description: "按课程路径学习基础结构，第一阶段使用 mock 内容。" },
    ],
  },
  liuyao: {
    suitableAudience: ["想学习六爻问事流程的人", "需要梳理起卦、装卦、取用神的人", "希望把断语改写为条件化分析的人"],
    learningFocus: ["明确所问事项，再取用神", "观察世应、六亲、六神和动变", "把月建日辰作为时间条件参考"],
    toc: ["起卦方法与问题边界", "装卦、六亲与六神", "世应与用神", "动爻、变爻与应期", "案例复盘"],
    excerpt: "短摘样例：六爻判断需要先明所问，再定用神，并结合月建、日辰、动变关系形成参考判断。",
    relatedTools: [
      { title: "六爻学科中心", href: "/subjects/liuyao", description: "查看六爻学习路径，后续预留起卦工具。" },
      { title: "术语库", href: "/terms", description: "检索世应、六亲、六神、用神、动爻等术语。" },
      { title: "六爻入门课", href: "/courses/liuyao-intro-course", description: "通过 mock 课时建立问事流程。" },
    ],
  },
  meihua: {
    suitableAudience: ["想理解象数、体用和触机关系的人", "需要从案例入手学习梅花易数的人", "希望把直觉判断整理为可复盘记录的人"],
    learningFocus: ["先建立八卦象意与体用关系", "记录触发条件和取象依据", "用案例复盘校正判断语言"],
    toc: ["象数基础", "体用关系", "动静与触机", "取象和断例", "复盘记录方法"],
    excerpt: "短摘样例：梅花易数学习应把起例、取象、体用和断语分开记录，减少只凭印象下结论的情况。",
    relatedTools: [
      { title: "梅花学科中心", href: "/subjects/meihua", description: "查看梅花易数学习入口和案例路径。" },
      { title: "易学基础", href: "/subjects", description: "回到阴阳、五行、八卦等共同基础。" },
      { title: "术语库", href: "/terms", description: "检索八卦、五行、方位等基础术语。" },
    ],
  },
  dao: {
    suitableAudience: ["希望安静阅读道家原典的人", "需要白话提示和章句索引的人", "想把经典阅读和日用省察结合的人"],
    learningFocus: ["先读原文短章，再看白话提示", "区分原典语境和现代延伸", "把术语、章句和札记关联起来"],
    toc: ["原文短读", "白话提示", "关键词索引", "章句札记", "日用省察"],
    excerpt: "短摘样例：道家经典阅读宜保留原文语气，同时用现代白话说明语境，不把章句包装成神秘承诺。",
    relatedTools: [
      { title: "道家经典中心", href: "/subjects/dao", description: "查看道德经、庄子等原典学习路径。" },
      { title: "术语库", href: "/terms", description: "检索阴阳、太极、两仪等共通术语。" },
      { title: "课程入口", href: "/courses/dao-intro-course", description: "按短读课程进入经典学习。" },
    ],
  },
  yixue: {
    suitableAudience: ["需要补齐术数共同基础的人", "学习奇门、八字、六爻前想先建立概念地图的人", "希望把术语做成可检索卡片的人"],
    learningFocus: ["理解阴阳、五行、八卦、干支的对应关系", "把基础术语连接到不同学科", "用卡片和练习题做长期复习"],
    toc: ["阴阳两仪", "五行生克", "八卦与方位", "天干地支", "节气与六十甲子"],
    excerpt: "短摘样例：易学基础是多门术数学科的共同语言，学习时应先理解关系，再进入具体工具。",
    relatedTools: [
      { title: "学科中心", href: "/subjects", description: "从共同基础进入奇门、八字、六爻等方向。" },
      { title: "术语库", href: "/terms", description: "按术语卡片复习基础概念。" },
      { title: "易学入门课", href: "/courses/yixue-intro-course", description: "按课程路径完成基础概念学习。" },
    ],
  },
};

export function generateStaticParams() {
  return platformMockBooks.map((book) => ({ bookId: book.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ bookId: string }>;
}): Promise<Metadata> {
  const { bookId } = await params;
  const book = getBook(bookId);

  if (!book) {
    return {
      title: "书籍不存在 | 问古书斋",
      description: "该书籍不存在或暂未发布。",
    };
  }

  return {
    title: `${book.title} | 问古书斋`,
    description: book.description,
  };
}

export default async function BookDetailRoute({ params }: { params: Promise<{ bookId: string }> }) {
  const { bookId } = await params;
  const book = getBook(bookId);

  if (!book) {
    notFound();
  }

  const access = getBookAccess(book);
  const detail = detailBySubject[book.subject];
  const relatedTerms = getRelatedTerms(book);
  const relatedCourses = courses.filter((course) => course.subject === book.subject && course.isPublished);
  const canShowStudyDetail = access !== "restricted";

  return (
    <main className="book-detail-page">
      <BookHero book={book} access={access} />

      <div className="book-detail-layout">
        <div className="book-detail-main">
          <BookMeta book={book} />

          <section className="book-detail-card" aria-labelledby="book-summary-title">
            <div className="book-section-head">
              <span>内容摘要</span>
              <h2 id="book-summary-title">简介</h2>
            </div>
            <p className="book-long-copy">{book.description}</p>
            <div id="book-excerpt" className={`book-excerpt is-${access}`}>
              <FileText aria-hidden="true" />
              <p>{access === "restricted" ? "该资料为后台私密学习材料，当前只显示基础档案，不展示正文、短摘或阅读入口。" : detail.excerpt}</p>
            </div>
          </section>

          <section className="book-detail-card book-learning-card" aria-labelledby="book-learning-title">
            <div className="book-section-head">
              <span>学习安排</span>
              <h2 id="book-learning-title">适合人群与学习重点</h2>
            </div>
            {canShowStudyDetail ? (
              <div className="book-learning-grid">
                <div>
                  <h3>
                    <UsersRound aria-hidden="true" />
                    适合人群
                  </h3>
                  <ul>
                    {detail.suitableAudience.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3>
                    <Target aria-hidden="true" />
                    学习重点
                  </h3>
                  <ul>
                    {detail.learningFocus.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="book-empty-copy">该资料的适合人群、学习重点和正文整理仅后台可见。</p>
            )}
          </section>

          <BookToc items={detail.toc} access={access} />
          {access !== "restricted" ? <RelatedTerms terms={relatedTerms} /> : null}
        </div>

        <aside className="book-detail-side" aria-label="书籍关联内容">
          {access !== "restricted" ? <RelatedCourses courses={relatedCourses} /> : null}

          <section className="book-detail-card book-tools-card" aria-labelledby="book-tools-title">
            <div className="book-section-head">
              <span>工具衔接</span>
              <h2 id="book-tools-title">相关工具</h2>
            </div>
            {access === "restricted" ? (
              <p className="book-empty-copy">私密资料暂不展示关联工具。</p>
            ) : (
              <div className="book-tool-list">
                {detail.relatedTools.map((tool) => (
                  <a key={tool.href} className="book-tool-link" href={tool.href}>
                    <span>
                      <Compass aria-hidden="true" />
                      {tool.title}
                    </span>
                    <p>{tool.description}</p>
                    <small>
                      进入
                      <ArrowRight aria-hidden="true" />
                    </small>
                  </a>
                ))}
              </div>
            )}
          </section>

          <section className="book-detail-card book-compliance-card" aria-labelledby="book-compliance-title">
            <div className="book-section-head">
              <span>版权与合规</span>
              <h2 id="book-compliance-title">阅读边界</h2>
            </div>
            <p>
              未授权资料不公开全文，不提供下载。所有术数内容仅作传统文化学习、资料整理与行动参考，不替代医学、法律、投资、心理等专业意见。
            </p>
            <span>
              <ShieldCheck aria-hidden="true" />
              当前阶段使用 mock 权限判断
            </span>
          </section>
        </aside>
      </div>
    </main>
  );
}

function getBook(bookId: string) {
  return platformMockBooks.find((book) => book.id === bookId);
}

function getBookAccess(book: Book): BookAccess {
  if (book.visibility === "private" || book.visibility === "hidden") return "restricted";
  if (book.copyrightStatus === "excerpt_only") return "excerpt";
  if (readableCopyrightStatuses.includes(book.copyrightStatus)) return "readable";
  return "restricted";
}

function getRelatedTerms(book: Book) {
  const directMatches = terms.filter((term) => isTermRelatedToBook(term, book));
  const fallbackMatches = book.subject === "meihua" || book.subject === "dao" ? terms.filter((term) => term.subject === "yixue") : [];
  const uniqueTerms = new Map([...directMatches, ...fallbackMatches].map((term) => [term.id, term]));

  return Array.from(uniqueTerms.values()).slice(0, 8);
}

function isTermRelatedToBook(term: Term, book: Book) {
  if (term.subject === book.subject) return true;
  return book.tags.some((tag) => term.name.includes(tag) || term.category.includes(tag) || term.tags.includes(tag) || term.relatedTerms.includes(tag));
}
