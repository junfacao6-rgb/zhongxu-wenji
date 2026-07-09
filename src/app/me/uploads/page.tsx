import type { Metadata } from "next";
import { LockKeyhole, Upload } from "lucide-react";
import ProfileSummary from "@/components/me/ProfileSummary";
import { meUploads, mockMembership, mockUserProfile } from "@/data/userMock";

const copyrightLabels = {
  public_domain: "公版",
  self_owned: "自有",
  authorized: "授权",
  excerpt_only: "摘录",
  private_study: "私密学习",
  hidden: "隐藏",
};

const visibilityLabels = {
  public: "公开",
  members: "会员",
  course: "课程",
  private: "私密",
  hidden: "隐藏",
};

export const metadata: Metadata = {
  title: "我的上传 | 问古书斋",
  description: "用户上传资料列表，默认私密保存。",
};

export default function MeUploadsPage() {
  return (
    <main className="me-page">
      <ProfileSummary user={mockUserProfile} membership={mockMembership} learningDays="28 天" readingProgress="46%" compact />

      <section className="me-disclaimer-panel">
        <LockKeyhole aria-hidden="true" />
        <p>用户上传资料默认 copyrightStatus 为 private_study，visibility 为 private。未确认版权和公开范围前，不进入公开全文展示。</p>
      </section>

      <section className="me-panel" aria-labelledby="me-uploads-title">
        <div className="me-section-head">
          <span>上传资料</span>
          <h2 id="me-uploads-title">我的资料列表</h2>
          <p>上传按钮第一阶段只做 UI 占位，后续接真实存储和后台整理流程。</p>
        </div>
        <button className="me-upload-button" type="button">
          <Upload aria-hidden="true" />
          上传资料
        </button>
        <div className="me-upload-list">
          {meUploads.map((upload) => (
            <article key={upload.id}>
              <header>
                <span>{upload.subjectName}</span>
                <em>{upload.fileType.toUpperCase()}</em>
              </header>
              <h3>{upload.title}</h3>
              <p>{upload.note}</p>
              <dl>
                <div>
                  <dt>文件名</dt>
                  <dd>{upload.fileName}</dd>
                </div>
                <div>
                  <dt>版权状态</dt>
                  <dd>{copyrightLabels[upload.copyrightStatus]}</dd>
                </div>
                <div>
                  <dt>可见性</dt>
                  <dd>{visibilityLabels[upload.visibility]}</dd>
                </div>
                <div>
                  <dt>上传状态</dt>
                  <dd>{upload.uploadStatus === "uploaded" ? "已上传" : upload.uploadStatus}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
