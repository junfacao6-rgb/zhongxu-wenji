import type { Metadata } from "next";
import ProfileSummary from "@/components/me/ProfileSummary";
import { meSettings, mockMembership, mockUserProfile } from "@/data/userMock";

export const metadata: Metadata = {
  title: "书斋设置 | 问古书斋",
  description: "我的书斋基础设置 mock 页面。",
};

export default function MeSettingsPage() {
  return (
    <main className="me-page">
      <ProfileSummary user={mockUserProfile} membership={mockMembership} learningDays="28 天" readingProgress="46%" compact />

      <section className="me-panel" aria-labelledby="me-settings-title">
        <div className="me-section-head">
          <span>基础设置</span>
          <h2 id="me-settings-title">账号、隐私与学习偏好</h2>
          <p>第一阶段不接真实登录和设置保存，只展示未来结构。</p>
        </div>
        <div className="me-settings-list">
          {meSettings.map((group) => (
            <article key={group.id}>
              <header>
                <h3>{group.title}</h3>
                <p>{group.description}</p>
              </header>
              <dl>
                {group.items.map((item) => (
                  <div key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                    <small>{item.helper}</small>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
