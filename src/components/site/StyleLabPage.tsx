import Link from "next/link";
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  Boxes,
  Compass,
  Library,
  Search,
  Sparkles,
} from "lucide-react";
import BrandMark from "@/components/site/BrandMark";

const sampleItems = [
  { title: "八字格局通论", meta: "古籍重排", status: "已上线" },
  { title: "六爻手写札记", meta: "讲义", status: "已上线" },
  { title: "奇门入门课", meta: "课程", status: "建设中" },
];

const routes = [
  { title: "书架", desc: "典籍与讲义", icon: Library },
  { title: "学习", desc: "入门到进阶", icon: BookOpen },
  { title: "图解", desc: "结构关系", icon: Compass },
  { title: "工具", desc: "术语速查", icon: Search },
];

function DirectionNotes({
  best,
  avoid,
  merge,
}: {
  best: string;
  avoid: string;
  merge: string;
}) {
  return (
    <div className="style-notes">
      <p>
        <span>适合</span>
        {best}
      </p>
      <p>
        <span>不适合</span>
        {avoid}
      </p>
      <p>
        <span>可融合</span>
        {merge}
      </p>
    </div>
  );
}

function CatalogDirection() {
  return (
    <section className="style-option style-option-catalog">
      <div className="style-option-head">
        <div>
          <p className="style-kicker">方向 B</p>
          <h2>高级学习中心感</h2>
        </div>
        <span className="style-badge">最像参考图</span>
      </div>

      <div className="catalog-preview">
        <div className="catalog-nav">
          <BrandMark size={32} />
          <span>观复书阁</span>
          <nav>
            <span>学习</span>
            <span>书架</span>
            <span>图解</span>
            <span>工具</span>
          </nav>
        </div>
        <div className="catalog-hero">
          <p className="eyebrow-line">系统学习 · 目录入口</p>
          <h3>学习中心</h3>
          <p>
            以条目、章节和路径组织内容。少装饰，多留白，让用户先看到清晰的目录。
          </p>
        </div>
        <div className="catalog-tabs">
          <span className="active">本周重点</span>
          <span>课程体系</span>
          <span>入门路径</span>
          <span>未读目录</span>
        </div>
        <div className="catalog-list">
          {sampleItems.map((item) => (
            <div key={item.title} className="catalog-row">
              <div>
                <h4>{item.title}</h4>
                <p>{item.meta}</p>
              </div>
              <span>{item.status}</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          ))}
        </div>
      </div>

      <DirectionNotes
        best="想要简单、高级、第一眼就像学习中心。"
        avoid="如果想要更强的传统书斋记忆点，会稍显通用。"
        merge="可以拿它的大标题、胶囊分类、轻卡片和细线分组。"
      />
    </section>
  );
}

function StudyDirection() {
  return (
    <section className="style-option style-option-study">
      <div className="style-option-head">
        <div>
          <p className="style-kicker">方向 A</p>
          <h2>古籍书斋感</h2>
        </div>
        <span className="style-badge">气质最稳</span>
      </div>

      <div className="study-preview">
        <div className="study-brand">
          <BrandMark size={82} />
          <div>
            <p>观复书阁</p>
            <h3>以书架立体系</h3>
          </div>
        </div>
        <p className="study-copy">
          把古籍、讲义、图解和工具放入同一个书斋结构。先辨门类，再循路径。
        </p>
        <div className="study-shelf">
          {[
            ["格局", "八字格局课", "入门框架"],
            ["六爻", "断卦札记", "实操复盘"],
            ["奇门", "九宫初阶", "结构入门"],
          ].map(([tag, title, desc]) => (
            <div key={title} className="study-book">
              <span>{tag}</span>
              <div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="study-actions">
          <Link href="/library">
            <BookMarked className="h-4 w-4" />
            入藏书架
          </Link>
          <Link href="/learn">查看目录</Link>
        </div>
      </div>

      <DirectionNotes
        best="想要像书房、古籍、藏书、纸本目录，传统感更强。"
        avoid="如果希望极简轻盈，会觉得稍厚、稍有仪式感。"
        merge="可以拿它的印章、藏书签、书架和古籍气质。"
      />
    </section>
  );
}

function KnowledgeDirection() {
  return (
    <section className="style-option style-option-knowledge">
      <div className="style-option-head">
        <div>
          <p className="style-kicker">方向 C</p>
          <h2>东方知识库感</h2>
        </div>
        <span className="style-badge">最能扩展</span>
      </div>

      <div className="knowledge-preview">
        <div className="knowledge-top">
          <div>
            <p>Knowledge Index</p>
            <h3>术数知识库</h3>
          </div>
          <div className="knowledge-search">
            <Search className="h-4 w-4" />
            <span>搜索五行、十神、格局...</span>
          </div>
        </div>

        <div className="knowledge-metrics">
          {[
            ["04", "书籍"],
            ["05", "文章"],
            ["03", "路径"],
          ].map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div className="knowledge-grid">
          {routes.map((route) => (
            <div key={route.title} className="knowledge-tile">
              <route.icon className="h-5 w-5" />
              <h4>{route.title}</h4>
              <p>{route.desc}</p>
            </div>
          ))}
        </div>

        <div className="knowledge-focus">
          <Boxes className="h-5 w-5" />
          <div>
            <h4>今日复盘</h4>
            <p>从概念检索到案例记录，保持证据链清楚。</p>
          </div>
        </div>
      </div>

      <DirectionNotes
        best="想要以后做搜索、案例库、工具库、会员资料体系。"
        avoid="如果只想做安静的阅读站，会显得信息感偏强。"
        merge="可以拿它的信息密度、搜索入口、模块秩序和扩展性。"
      />
    </section>
  );
}

export default function StyleLabPage() {
  return (
    <div className="style-lab-shell">
      <section className="style-lab-intro">
        <Link href="/" className="style-back-link">
          返回首页
        </Link>
        <div className="style-lab-title">
          <p className="eyebrow-line">视觉探索 · 不覆盖正式首页</p>
          <h1>三种首页气质</h1>
          <p>
            先不要用文字描述感觉。直接看三版首屏，选更接近的方向，再把它合并到正式首页。
          </p>
        </div>
        <div className="style-lab-reminder">
          <Sparkles className="h-5 w-5" />
          <span>看完只需要说：A、B、C，或者 A 的气质加 B 的结构。</span>
        </div>
      </section>

      <div className="style-lab-grid">
        <StudyDirection />
        <CatalogDirection />
        <KnowledgeDirection />
      </div>
    </div>
  );
}
