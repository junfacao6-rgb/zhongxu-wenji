import { ArrowRight, BookOpen, CheckCircle2, Compass, GraduationCap, Home, KeyRound, Link2, MonitorSmartphone, ShieldAlert } from "lucide-react";
import Link from "next/link";

const demoEntries = [
  {
    title: "首页",
    subtitle: "第一眼看品牌、气质和主入口",
    href: "/",
    icon: Home,
    status: "静态可看",
  },
  {
    title: "藏书",
    subtitle: "看古籍分类、书目卡片和阅读入口",
    href: "/library",
    icon: BookOpen,
    status: "静态可看",
  },
  {
    title: "课程",
    subtitle: "看课程筛选、进度和课时结构",
    href: "/courses",
    icon: GraduationCap,
    status: "mock 数据",
  },
  {
    title: "奇门 mock",
    subtitle: "看奇门工具入口和第一阶段占位能力",
    href: "/qimen",
    icon: Compass,
    status: "mock 工具",
  },
  {
    title: "邀请码 UI",
    subtitle: "看邀请码验证、会员权益和免责声明",
    href: "/invite",
    icon: KeyRound,
    status: "前端 mock",
  },
];

const inviteCodes = ["WENGU-TRIAL-7", "WENGU-MONTH-30", "WENGU-YEAR-365", "WENGU-COURSE-180"];

export default function DemoPage() {
  return (
    <div className="demo-page">
      <section className="demo-hero" aria-labelledby="demo-title">
        <div className="demo-hero-art" aria-hidden="true">
          <img src="/images/hero-scroll-reference-crop-20260705.webp" alt="" />
        </div>
        <div className="demo-hero-copy">
          <span>H5 DEMO</span>
          <h1 id="demo-title">手机演示入口</h1>
          <p>给外部朋友、客户或同事试看时，直接发这个页面。这里收拢当前第一阶段最适合展示的 5 个入口，不暴露后台路径。</p>
          <div className="demo-hero-actions">
            <Link href="/library">
              进入藏书
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link href="/qimen" className="is-secondary">
              看奇门 mock
            </Link>
          </div>
        </div>
      </section>

      <section className="demo-share-panel" aria-label="分享说明">
        <div>
          <MonitorSmartphone aria-hidden="true" className="h-5 w-5" />
          <strong>手机优先</strong>
          <span>建议复制链接到手机浏览器打开；如果微信内置浏览器打不开，换 Safari、Chrome 或系统浏览器。</span>
        </div>
        <div>
          <Link2 aria-hidden="true" className="h-5 w-5" />
          <strong>公开入口</strong>
          <span>当前线上地址使用 Vercel，正式对外建议再绑定自己的域名，降低手机网络和平台拦截的不确定性。</span>
        </div>
      </section>

      <section className="demo-entry-grid" aria-label="演示入口">
        {demoEntries.map((entry, index) => {
          const Icon = entry.icon;
          return (
            <Link href={entry.href} className="demo-entry-card" key={entry.href}>
              <div className="demo-entry-index">{String(index + 1).padStart(2, "0")}</div>
              <div className="demo-entry-icon">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </div>
              <div className="demo-entry-copy">
                <span>{entry.status}</span>
                <h2>{entry.title}</h2>
                <p>{entry.subtitle}</p>
              </div>
              <ArrowRight aria-hidden="true" className="demo-entry-arrow h-5 w-5" />
            </Link>
          );
        })}
      </section>

      <section className="demo-script" aria-label="演示顺序">
        <div className="demo-section-title">
          <span>WALKTHROUGH</span>
          <h2>建议演示顺序</h2>
        </div>
        <ol>
          <li>先看首页，确认“问古书斋”的第一印象。</li>
          <li>进入藏书，展示古籍分类、书籍卡片和阅读入口。</li>
          <li>进入课程，说明课程和进度目前是 mock。</li>
          <li>进入奇门 mock，展示工具方向，不承诺真实判盘。</li>
          <li>进入邀请码 UI，用测试码展示会员权益分层。</li>
        </ol>
      </section>

      <section className="demo-invite-codes" aria-label="测试邀请码">
        <div className="demo-section-title">
          <span>INVITE CODES</span>
          <h2>测试邀请码</h2>
        </div>
        <div className="demo-code-grid">
          {inviteCodes.map((code) => (
            <code key={code}>{code}</code>
          ))}
        </div>
      </section>

      <section className="demo-boundary" aria-label="演示边界">
        <ShieldAlert aria-hidden="true" className="h-5 w-5" />
        <div>
          <strong>当前边界</strong>
          <p>
            这是第一阶段演示版：藏书、课程、奇门和邀请码页面主要使用 mock/静态数据。Prisma 和 PostgreSQL 架构已经准备好，但这里不连接生产数据库，也不用于正式收费交付。
          </p>
        </div>
        <CheckCircle2 aria-hidden="true" className="demo-boundary-check h-5 w-5" />
      </section>
    </div>
  );
}
