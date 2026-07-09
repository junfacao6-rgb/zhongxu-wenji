"use client";

import { UploadCloud, X } from "lucide-react";

type DocumentUploadDialogProps = {
  open: boolean;
  onClose: () => void;
};

const subjectOptions = [
  ["qimen", "奇门遁甲"],
  ["bazi", "八字命理"],
  ["liuyao", "六爻纳甲"],
  ["meihua", "梅花易数"],
  ["dao", "道家经典"],
  ["yixue", "易学基础"],
] as const;

const copyrightOptions = [
  ["private_study", "private_study / 仅后台学习整理"],
  ["public_domain", "public_domain / 公版古籍"],
  ["self_owned", "self_owned / 自有讲义"],
  ["authorized", "authorized / 已授权"],
  ["excerpt_only", "excerpt_only / 仅短摘"],
  ["hidden", "hidden / 隐藏"],
] as const;

const visibilityOptions = [
  ["private", "private / 私密"],
  ["public", "public / 公开"],
  ["members", "members / 会员可见"],
  ["course", "course / 课程可见"],
  ["hidden", "hidden / 隐藏"],
] as const;

export default function DocumentUploadDialog({ open, onClose }: DocumentUploadDialogProps) {
  if (!open) return null;

  return (
    <div className="document-dialog-backdrop" role="presentation">
      <section className="document-dialog" role="dialog" aria-modal="true" aria-labelledby="document-upload-title">
        <header>
          <div>
            <span>上传资料</span>
            <h2 id="document-upload-title">新增 SourceDocument</h2>
            <p>第一阶段仅做 UI，不接真实文件存储。默认版权状态为 private_study，可见性为 private。</p>
          </div>
          <button type="button" onClick={onClose} aria-label="关闭上传弹窗">
            <X aria-hidden="true" />
          </button>
        </header>

        <form className="document-upload-form">
          <label>
            <span>标题</span>
            <input placeholder="例如：奇门讲义第二讲" />
          </label>

          <label>
            <span>学科</span>
            <select defaultValue="qimen">
              {subjectOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="document-file-input">
            <span>文件</span>
            <input type="file" />
          </label>

          <label>
            <span>作者</span>
            <input placeholder="作者或整理者" />
          </label>

          <label>
            <span>朝代/年代</span>
            <input placeholder="例如：清 / 现代讲义" />
          </label>

          <label className="is-wide">
            <span>来源说明</span>
            <textarea placeholder="填写来源、授权范围、是否可公开展示等信息" rows={3} />
          </label>

          <label>
            <span>版权状态</span>
            <select defaultValue="private_study">
              {copyrightOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>可见性</span>
            <select defaultValue="private">
              {visibilityOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>标签</span>
            <input placeholder="奇门, 九宫, 入门" />
          </label>

          <label>
            <span>备注</span>
            <input placeholder="内部整理备注" />
          </label>
        </form>

        <footer>
          <p>版权提醒：只有管理员确认授权范围后，才能手动改为 public / members / course。</p>
          <div>
            <button type="button" onClick={onClose}>取消</button>
            <button type="button" className="is-primary" onClick={onClose}>
              <UploadCloud aria-hidden="true" />
              保存 mock 资料
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}
