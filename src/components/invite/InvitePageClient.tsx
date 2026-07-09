"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, GraduationCap, KeyRound, ShieldAlert, Sparkles, TicketCheck, UserRound } from "lucide-react";
import {
  inviteTypeNames,
  memberBenefitTiers,
  validateMockInviteCode,
  type BenefitTier,
  type InviteValidationResult,
} from "@/data/inviteMock";

const tierIcons = {
  free: UserRound,
  member: Sparkles,
  course: GraduationCap,
} satisfies Record<BenefitTier, typeof UserRound>;

export default function InvitePageClient() {
  const [code, setCode] = useState("WENGU-TRIAL-7");
  const [result, setResult] = useState<InviteValidationResult | null>(null);

  const activeTier = result?.state === "valid" ? result.tier : "free";
  const resultTone = useMemo(() => {
    if (!result) return "border-ink-900/10 bg-white/72 text-ink-800";
    if (result.state === "valid") return "border-jade-700/30 bg-jade-100/70 text-jade-700";
    return "border-cinnabar-700/25 bg-cinnabar-100/70 text-cinnabar-700";
  }, [result]);

  function verifyInvite() {
    setResult(validateMockInviteCode(code));
  }

  return (
    <div className="invite-page mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:py-10">
      <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-lg border border-bronze-300/55 bg-paper-50/88 p-5 shadow-[0_16px_38px_rgba(67,42,14,0.08)]">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-bronze-300/60 bg-paper-100 text-cinnabar-700">
              <KeyRound size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-bronze-700">INVITE ACCESS</p>
              <h1 className="mt-2 font-brand text-3xl font-semibold text-ink-900 sm:text-4xl">邀请码与会员权益</h1>
              <p className="mt-3 text-sm leading-7 text-ink-500">
                第一阶段使用本地 mock 校验，先确认入口、权益层级和状态展示；不会写入真实账号或扣减邀请码次数。
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            <label className="grid gap-2 text-sm font-medium text-ink-800">
              输入邀请码
              <input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") verifyInvite();
                }}
                className="h-12 rounded-md border border-bronze-300/65 bg-white/78 px-3 text-base text-ink-900 outline-none transition focus:border-cinnabar-700 focus:ring-2 focus:ring-cinnabar-700/10"
                placeholder="请输入邀请码"
              />
            </label>

            <button
              type="button"
              onClick={verifyInvite}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-ink-900 px-4 text-sm font-semibold text-paper-50 transition hover:bg-ink-800"
            >
              <TicketCheck size={18} aria-hidden="true" />
              验证邀请码
            </button>
          </div>
        </div>

        <div className={`rounded-lg border p-5 shadow-[0_16px_38px_rgba(67,42,14,0.06)] ${resultTone}`} aria-live="polite">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-white/56">
              {result?.state === "valid" ? <CheckCircle2 size={20} aria-hidden="true" /> : <AlertTriangle size={20} aria-hidden="true" />}
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] opacity-70">MOCK RESULT</p>
              <h2 className="mt-2 font-brand text-2xl font-semibold">{result?.title ?? "等待验证"}</h2>
              <p className="mt-2 text-sm leading-7 opacity-85">{result?.message ?? "输入邀请码后点击验证，页面会显示 mock 验证结果。"}</p>
            </div>
          </div>

          {result?.invite ? (
            <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-md bg-white/46 p-3">
                <dt className="opacity-70">邀请码类型</dt>
                <dd className="mt-1 font-semibold">{inviteTypeNames[result.invite.type]}</dd>
              </div>
              <div className="rounded-md bg-white/46 p-3">
                <dt className="opacity-70">有效天数</dt>
                <dd className="mt-1 font-semibold">{result.invite.validDays} 天</dd>
              </div>
              <div className="rounded-md bg-white/46 p-3">
                <dt className="opacity-70">使用次数</dt>
                <dd className="mt-1 font-semibold">
                  {result.invite.usedCount}/{result.invite.maxUses}
                </dd>
              </div>
              <div className="rounded-md bg-white/46 p-3">
                <dt className="opacity-70">mock 到期</dt>
                <dd className="mt-1 font-semibold">{result.invite.expiresAt}</dd>
              </div>
            </dl>
          ) : null}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3" aria-label="会员权益分层">
        {memberBenefitTiers.map((tier) => {
          const Icon = tierIcons[tier.id];
          const isActive = activeTier === tier.id || (activeTier === "course" && tier.id === "member");
          return (
            <article
              key={tier.id}
              className={`rounded-lg border p-5 shadow-[0_14px_32px_rgba(67,42,14,0.06)] ${
                isActive ? "border-cinnabar-700/45 bg-white/90" : "border-bronze-300/45 bg-paper-50/76"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`grid h-10 w-10 place-items-center rounded-md ${isActive ? "bg-cinnabar-100 text-cinnabar-700" : "bg-paper-100 text-jade-700"}`}>
                  <Icon size={20} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-brand text-xl font-semibold text-ink-900">{tier.title}</h2>
                  <p className="mt-1 text-xs leading-5 text-ink-500">{tier.subtitle}</p>
                </div>
              </div>

              <ul className="mt-5 grid gap-2 text-sm leading-6 text-ink-700">
                {tier.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-jade-700" size={16} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </section>

      <section className="flex gap-3 rounded-lg border border-cinnabar-700/20 bg-cinnabar-100/55 p-4 text-cinnabar-700">
        <ShieldAlert className="mt-0.5 shrink-0" size={20} aria-hidden="true" />
        <div>
          <h2 className="font-brand text-lg font-semibold">免责声明</h2>
          <p className="mt-2 text-sm leading-7">
            本页面的会员和邀请码均为第一阶段 mock。奇门、择时、报告与课程内容只作为传统文化学习、资料整理和复盘参考，不构成医疗、法律、投资、婚恋或其他现实专业决策依据。
          </p>
        </div>
      </section>
    </div>
  );
}
