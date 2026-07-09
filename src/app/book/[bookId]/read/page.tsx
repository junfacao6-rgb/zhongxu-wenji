import type { Metadata } from "next";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { notFound } from "next/navigation";
import ReaderLayout, { type ReaderChapter } from "@/components/reader/ReaderLayout";
import { platformMockBooks } from "@/data/books";
import { terms } from "@/data/terms";
import type { Book } from "@/types/content";
import type { CopyrightStatus, SubjectKey } from "@/types/platform";

type ReaderChapterSeed = Omit<ReaderChapter, "id" | "order">;

const readableCopyrightStatuses: CopyrightStatus[] = ["public_domain", "self_owned", "authorized"];

const mockChaptersBySubject: Record<SubjectKey, ReaderChapterSeed[]> = {
  qimen: [
    {
      title: "九宫为骨",
      subtitle: "先把空间结构看清楚",
      termIds: ["jiugong", "luoshu", "bamen", "jiuxing"],
      originalParagraphs: [
        "奇门之学，先明九宫。九宫依洛书而立，宫中再布八门、九星、八神与三奇六仪，方可言格局。",
        "初学不可先求断语，须知门有门义，星有星情，宫有宫气。若九宫未明，则用神无所安顿。",
      ],
      plainParagraphs: [
        "学习奇门时，先把九宫当成地图。洛书提供空间顺序，八门、九星、八神和天干等信息都要落在这个地图上观察。",
        "第一步不是直接判断事情，而是知道每个符号所在的位置和层次。用神也必须放回九宫结构中看，才有讨论基础。",
      ],
      noteParagraphs: [
        "本章练习：画出九宫，标注洛书数、方位和常见八门名称。",
        "复盘提示：每次看盘先写明用神落宫，再记录门、星、神之间的结构倾向。",
      ],
    },
    {
      title: "门星神干",
      subtitle: "把符号分层，不混成一句断语",
      termIds: ["bamen", "jiuxing", "bashen", "sanqi", "liuyi"],
      originalParagraphs: [
        "八门主行动之门，九星主天时之象，八神辅其情状，三奇六仪为干上机括。",
        "门星神干同临一宫，宜分层而观。可用者言其条件，受制者言其限制，不可一见吉名便作定论。",
      ],
      plainParagraphs: [
        "八门更偏行动方式，九星更偏环境和气象，八神帮助看状态，三奇六仪则提供天干层面的组合信息。",
        "同一个宫里有很多符号，阅读时要分层记录。看到有利符号只表示有可用条件，还要看是否受制、空亡或入墓。",
      ],
      noteParagraphs: [
        "术语卡建议：把八门、九星、八神分别做成卡片，不要混记。",
        "案例练习：任选一宫，写出门、星、神、干四层信息，再用一句谨慎语言归纳。",
      ],
    },
    {
      title: "格局与复盘",
      subtitle: "从结构倾向走向可验证记录",
      termIds: ["qimen-geju", "zhifu", "zhishi", "kongwang", "rumu"],
      originalParagraphs: [
        "值符为纲，值使为用，格局为象。见空亡、入墓，须审其时位，不可轻言成败。",
        "奇门用于学习与行动参考时，重在记录条件、倾向与后验复盘，不作绝对保证。",
      ],
      plainParagraphs: [
        "值符和值使是观察全局的重要入口，格局提示结构倾向。若出现空亡、入墓等状态，需要看具体时间和位置，不能直接下绝对结论。",
        "作为学习工具，奇门阅读更适合帮助我们整理条件、选择节奏和复盘行动，而不是给出不可验证的承诺。",
      ],
      noteParagraphs: [
        "复盘模板：问题、起盘时间、用神、关键格局、行动建议、实际结果。",
        "合规提醒：所有择时和判断仅作传统文化学习与行动参考，不替代专业意见。",
      ],
    },
  ],
  bazi: [
    {
      title: "以日主立中心",
      subtitle: "从阴阳五行进入八字语言",
      termIds: ["rizhu", "wuxing", "tiangan", "dizhi", "shishen"],
      originalParagraphs: [
        "八字之读，先定日主。天干地支布成四柱，五行生克由此见其往来，十神由日主而分。",
        "不明日主，则十神无中心；不明五行，则旺衰无所据。",
      ],
      plainParagraphs: [
        "八字阅读先找日主，也就是日干。天干地支组成四柱，五行关系说明力量如何流动，十神则是以日主为中心建立的人事关系。",
        "如果没有日主这个中心，十神就会失去参照；如果不理解五行，旺衰和格局也容易变成空话。",
      ],
      noteParagraphs: [
        "本章练习：选一个 mock 四柱，只标日主、五行和十神，不做现实判断。",
        "记录习惯：所有判断先写依据，再写倾向。",
      ],
    },
    {
      title: "月令与旺衰",
      subtitle: "季节是结构判断的重要条件",
      termIds: ["yueling", "wangshuai", "jieqi", "canggan", "tougan"],
      originalParagraphs: [
        "月令为提纲，旺衰由时令、根气、透干、藏干并参而定。",
        "旺者未必为喜，衰者未必为忌，须回到全局结构审之。",
      ],
      plainParagraphs: [
        "月令代表出生月份的节令气，是判断结构的关键条件。旺衰不能只数五行个数，还要看根气、透干、藏干等信息。",
        "某个力量强，不一定就有利；某个力量弱，也不一定就不好。要回到整个命局结构里看。",
      ],
      noteParagraphs: [
        "术语提醒：月令不是普通月份标签，而是结构判断中的时令背景。",
        "复盘问题：为什么这里说“旺者未必为喜”？请写出至少两个条件。",
      ],
    },
    {
      title: "格局与用神",
      subtitle: "把结论写成条件链",
      termIds: ["bazi-geju", "tiaohou", "bazi-yongshen", "xishen", "jishen", "dayun", "liunian"],
      originalParagraphs: [
        "格局贵在成势，用神贵在有情。调候、通关、制化，皆须视原局而定。",
        "大运流年为阶段之气，宜作参考，不可脱离原局独断。",
      ],
      plainParagraphs: [
        "格局看的是命局是否形成清楚结构，用神看的是对结构有帮助的作用点。调候、通关、制化都必须结合原局条件。",
        "大运和流年代表阶段性背景，只能和原局一起参考，不能单独拿来下结论。",
      ],
      noteParagraphs: [
        "学习重点：不要只背格局名称，要写清楚成立条件、破格条件和救应条件。",
        "合规提醒：八字学习内容不替代心理、婚姻、医学、法律或投资建议。",
      ],
    },
  ],
  liuyao: [
    {
      title: "先明所问",
      subtitle: "起卦之前先限定问题边界",
      termIds: ["shiying", "liuqin", "liuyao-yongshen"],
      originalParagraphs: [
        "六爻问事，先明所问，后取用神。世应定位己彼，六亲分其类别。",
        "若问题不明，则用神难取；用神不定，则断语无根。",
      ],
      plainParagraphs: [
        "六爻学习的第一步是把问题说清楚，然后再取用神。世应帮助区分自己和对象，六亲帮助定位事情类别。",
        "如果问题边界不清，用神就容易取错；用神不稳，后面的判断就没有基础。",
      ],
      noteParagraphs: [
        "练习：把一个问题改写成一句清楚、可复盘的问句。",
        "记录格式：问题、起卦方式、用神、世应、初步观察。",
      ],
    },
    {
      title: "动变与时间",
      subtitle: "观察正在变化的环节",
      termIds: ["dongyao", "bianyao", "yuejian", "richen", "yingqi"],
      originalParagraphs: [
        "动爻为事之机，变爻为后续之象。月建日辰参其旺衰，乃可言应期。",
        "应期只作时间线索，须待事后复盘，不宜作绝对承诺。",
      ],
      plainParagraphs: [
        "动爻提示事情正在变化的部分，变爻提示变化后的方向。月建和日辰提供时间环境，帮助观察旺衰和应期。",
        "应期只能作为参考线索，必须事后复盘，不能说成保证发生的时间。",
      ],
      noteParagraphs: [
        "本章重点：动爻、变爻、月建、日辰四个信息要分开记录。",
        "复盘提示：把预测时写下的时间线索和真实进展对照，不夸大命中。",
      ],
    },
    {
      title: "空亡与慎断",
      subtitle: "把限制条件写清楚",
      termIds: ["xunkong", "liushen", "liuqin", "richen"],
      originalParagraphs: [
        "旬空之处，须看填实、出空与日辰冲合。六神辅象，不可越六亲用神而独断。",
        "慎断者，非不判断，乃知其条件未足，故留余地。",
      ],
      plainParagraphs: [
        "遇到旬空，要看是否有填实、出空或日辰冲合等条件。六神只是辅助象意，不能越过六亲和用神单独判断。",
        "谨慎判断不是不判断，而是把条件不足的地方写出来，给结论留出边界。",
      ],
      noteParagraphs: [
        "术语卡：旬空、六神、六亲要分别理解。",
        "合规提醒：六爻问事仅作传统文化学习和行动参考，不替代专业意见。",
      ],
    },
  ],
  meihua: [
    {
      title: "象数入门",
      subtitle: "先分清取象依据",
      termIds: ["bagua", "wuxing", "fangwei"],
      originalParagraphs: [
        "梅花之法，以象数为门。八卦立象，五行通气，方位定其所指。",
        "取象贵有来处，不可凭一时之意任意牵合。",
      ],
      plainParagraphs: [
        "梅花易数学习先从象数开始。八卦提供象意，五行说明关系，方位帮助定位。",
        "取象要有依据，不能看到什么都随意联想。记录依据比追求漂亮断语更重要。",
      ],
      noteParagraphs: ["练习：为八卦各写三个稳妥象意。", "复盘：每次案例都记录触发点、取象依据和实际反馈。"],
    },
    {
      title: "体用与动静",
      subtitle: "判断前先分主客",
      termIds: ["yinyang", "bagua", "shengke"],
      originalParagraphs: [
        "体用既分，动静乃明。生克往来，宜看所问之事，不可离题泛断。",
        "象成于时，验成于事，复盘乃知取象是否得当。",
      ],
      plainParagraphs: [
        "体用帮助区分主客和重点，动静帮助判断哪里发生变化。五行生克要结合具体问题，不要泛泛而谈。",
        "一个象是否成立，要通过事情反馈来检验，所以复盘是梅花学习的重要环节。",
      ],
      noteParagraphs: ["本章重点：体用、动静、所问事项要同时记录。", "语言建议：多用“倾向、显示、建议”，少用绝对词。"],
    },
  ],
  dao: [
    {
      title: "原文短读",
      subtitle: "保留经典语气，再做白话提示",
      termIds: ["yinyang", "taiji", "liangyi"],
      originalParagraphs: [
        "道家经典之读，贵在虚静。名言虽短，其义常在反复涵泳之间。",
        "阴阳未分之先，可借太极言其总根；两仪既判，方有动静、内外、刚柔之分。",
      ],
      plainParagraphs: [
        "读道家经典时，不宜急着把每一句都变成工具结论。先保留原文的语气，再用白话说明背景。",
        "太极、阴阳、两仪这些概念可以帮助我们理解变化从整体到分化的过程。",
      ],
      noteParagraphs: ["阅读方法：一章原文、一段白话、一条札记。", "避免把经典句子包装成神秘承诺。"],
    },
    {
      title: "日用省察",
      subtitle: "把章句落到稳定行动",
      termIds: ["yinyang", "wuxing", "shengke"],
      originalParagraphs: [
        "学经典，不贵玄谈，贵能返身。动静有时，进退有度，乃可入日用。",
        "生克之理亦可作观察，不可强作吉凶断语。",
      ],
      plainParagraphs: [
        "经典学习不只是讨论玄妙概念，也要回到日常行动。什么时候推进，什么时候收束，都可以成为省察对象。",
        "五行生克可以作为观察关系的方法，但不要把它直接说成现实中的绝对吉凶。",
      ],
      noteParagraphs: ["札记问题：今天有哪些事情适合进，有哪些事情适合守？", "合规提醒：经典阅读不替代医学、心理、法律等专业帮助。"],
    },
  ],
  yixue: [
    {
      title: "阴阳五行",
      subtitle: "建立共同语言",
      termIds: ["yinyang", "wuxing", "shengke"],
      originalParagraphs: [
        "易学之基，始于阴阳，推于五行。阴阳观其对待，五行观其流行。",
        "生克非吉凶之名，乃关系与力量往来的描述。",
      ],
      plainParagraphs: [
        "阴阳用于观察事物的两面关系，五行用于描述状态和力量流动。",
        "生克不是简单说好坏，而是描述支持、制约、转化等关系。",
      ],
      noteParagraphs: ["练习：用阴阳和五行描述一个日常场景。", "记录重点：先写关系，再写倾向。"],
    },
    {
      title: "八卦干支",
      subtitle: "把空间和时间连起来",
      termIds: ["bagua", "tiangan", "dizhi", "liushijiazi", "jieqi"],
      originalParagraphs: [
        "八卦以象立，干支以时行。六十甲子循环不息，节气则明其候。",
        "学者若能通其名物，再入奇门、八字、六爻，便少隔膜。",
      ],
      plainParagraphs: [
        "八卦帮助理解象意和方位，天干地支帮助理解时间结构，六十甲子和节气则把时间循环表达出来。",
        "先掌握这些基础概念，再学习奇门、八字、六爻，会更容易理解术语和结构。",
      ],
      noteParagraphs: ["术语清单：八卦、天干、地支、六十甲子、节气。", "学习建议：先认读，再建立对应关系，不急于推断。"],
    },
  ],
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
      title: "阅读页不存在 | 问古书斋",
      description: "该阅读页不存在或暂未开放。",
    };
  }

  return {
    title: `${book.title} 阅读 | 问古书斋`,
    description: `阅读${book.title}，按原文、白话和笔记三个层次学习。`,
  };
}

export default async function BookReadRoute({ params }: { params: Promise<{ bookId: string }> }) {
  const { bookId } = await params;
  const book = getBook(bookId);

  if (!book) {
    notFound();
  }

  if (!canReadBook(book)) {
    return <ReaderRestricted book={book} />;
  }

  const chapters = getReaderChapters(book);
  const readerTerms = getReaderTerms(chapters);

  return <ReaderLayout book={book} chapters={chapters} terms={readerTerms} />;
}

function ReaderRestricted({ book }: { book: Book }) {
  return (
    <main className="reader-restricted-page">
      <section>
        <LockKeyhole aria-hidden="true" />
        <span>阅读权限受限</span>
        <h1>{book.title}</h1>
        <p>该资料当前不开放全文阅读。摘录资料仅展示摘要与短摘；私密学习资料仅后台管理员可见。</p>
        <Link href={`/book/${book.id}`}>返回书籍详情</Link>
      </section>
    </main>
  );
}

function getBook(bookId: string) {
  return platformMockBooks.find((book) => book.id === bookId);
}

function canReadBook(book: Book) {
  if (book.visibility === "private" || book.visibility === "hidden") return false;
  return readableCopyrightStatuses.includes(book.copyrightStatus);
}

function getReaderChapters(book: Book): ReaderChapter[] {
  return mockChaptersBySubject[book.subject].map((chapter, index) => ({
    ...chapter,
    id: `${book.id}-chapter-${index + 1}`,
    order: index + 1,
  }));
}

function getReaderTerms(chapters: ReaderChapter[]) {
  const termIds = new Set(chapters.flatMap((chapter) => chapter.termIds));
  return terms.filter((term) => termIds.has(term.id));
}
