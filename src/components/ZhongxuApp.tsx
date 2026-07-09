"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Gem, Home, KeyRound, LayoutDashboard, Search, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import {
  BirthInput,
  PlanType,
  Profile,
  eventOptions,
  makeBracelet,
  makeEventAdvice,
  makeHourAdvice,
  makeLesson,
  makeLiuyao,
  makeProfile,
  planLabels,
} from "@/lib/rules";

type View = "home" | "login" | "birth" | "chart" | "daily" | "date" | "event" | "liuyao" | "lost" | "member" | "admin" | "terms" | "privacy";

const todayText = new Date().toISOString().slice(0, 10);
const defaultBirth: BirthInput = {
  nickname: "明心",
  gender: "female",
  birthDate: "2001-04-14",
  birthHour: "9",
  birthPlace: "杭州",
  accurateTime: true,
};

type ApiMembership = {
  plan: PlanType;
  quota: number;
  used: number;
  status: string;
};

type ApiState = {
  user: { id: string; nickname: string; gender?: string | null };
  birth: BirthInput | null;
  profile: Profile | null;
  membership: ApiMembership;
};

type AdminStats = {
  users: number;
  profiles: number;
  liuyaoRecords: number;
  logs: { action: string; targetType: string; createdAt: string }[];
};

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-[28px] border border-gold/15 bg-panel/88 p-5 shadow-glow ${className}`}>{children}</section>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold tracking-[0.12em] text-gold">
      <span className="h-7 w-1 rounded-full bg-gold" />
      {children}
    </h2>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm text-mist">
      {label}
      {children}
    </label>
  );
}

const inputClass = "h-12 rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-rice outline-none focus:border-gold/60";

export default function ZhongxuApp({ initialView = "home" }: { initialView?: View }) {
  const [view, setView] = useState<View>(initialView);
  const [userId, setUserId] = useState<string | null>(null);
  const [birth, setBirth] = useState<BirthInput>(defaultBirth);
  const [profile, setProfile] = useState<Profile>(() => makeProfile(defaultBirth));
  const [plan, setPlan] = useState<PlanType>("free");
  const [quota, setQuota] = useState(1);
  const [targetDate, setTargetDate] = useState(todayText);
  const [eventName, setEventName] = useState("提交方案");
  const [question, setQuestion] = useState("这件合作现在是否适合继续推进？");
  const [lostItem, setLostItem] = useState("钥匙");
  const [liuyaoUsed, setLiuyaoUsed] = useState(0);
  const [inviteCode, setInviteCode] = useState("ZXWJ-TEST");
  const [adminToken, setAdminToken] = useState("ZX-ADMIN-TEST");
  const [syncNote, setSyncNote] = useState("未登录时仅为本机演示；邀请码登录后会保存到 SQLite。");
  const [isBusy, setIsBusy] = useState(false);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [adminNote, setAdminNote] = useState("后台已接入 SQLite，可手动调整当前用户会员。");

  useEffect(() => {
    const storedUserId = window.localStorage.getItem("zhongxu-user-id");
    const storedAdminToken = window.localStorage.getItem("zhongxu-admin-token");
    if (storedAdminToken) setAdminToken(storedAdminToken);
    if (storedUserId) {
      void fetchState(storedUserId);
      return;
    }

    const saved = window.localStorage.getItem("zhongxu-state");
    if (saved) {
      const parsed = JSON.parse(saved) as { birth: BirthInput; plan: PlanType; liuyaoUsed: number };
      setBirth(parsed.birth);
      setProfile(makeProfile(parsed.birth));
      setPlan(parsed.plan);
      setLiuyaoUsed(parsed.liuyaoUsed ?? 0);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("zhongxu-state", JSON.stringify({ birth, plan, liuyaoUsed, userId }));
  }, [birth, plan, liuyaoUsed, userId]);

  useEffect(() => {
    window.localStorage.setItem("zhongxu-admin-token", adminToken);
  }, [adminToken]);

  useEffect(() => {
    if (view === "admin") {
      void loadAdminStats();
    }
  }, [view]);

  const lesson = useMemo(() => makeLesson(profile, todayText), [profile]);
  const dateLesson = useMemo(() => makeLesson(profile, targetDate), [profile, targetDate]);
  const eventAdvice = useMemo(() => makeEventAdvice(profile, targetDate, eventName), [profile, targetDate, eventName]);
  const hours = useMemo(() => makeHourAdvice(profile, targetDate), [profile, targetDate]);
  const bracelet = useMemo(() => makeBracelet(profile), [profile]);
  const isMember = plan !== "free";

  async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "请求失败");
    }
    return data as T;
  }

  async function fetchState(nextUserId: string) {
    try {
      const data = await requestJson<ApiState>(`/api/state?userId=${encodeURIComponent(nextUserId)}`);
      setUserId(data.user.id);
      window.localStorage.setItem("zhongxu-user-id", data.user.id);
      if (data.birth && data.profile) {
        setBirth(data.birth);
        setProfile(data.profile);
      }
      setPlan(data.membership.plan);
      setQuota(data.membership.quota);
      setLiuyaoUsed(data.membership.used);
      setSyncNote(`已登录：${data.user.nickname}。数据会保存到 SQLite。`);
    } catch (error) {
      window.localStorage.removeItem("zhongxu-user-id");
      setUserId(null);
      setSyncNote(error instanceof Error ? error.message : "读取用户状态失败");
    }
  }

  async function loginWithInvite() {
    setIsBusy(true);
    try {
      const data = await requestJson<{ userId: string }>("/api/auth/invite", {
        method: "POST",
        body: JSON.stringify({ code: inviteCode, nickname: birth.nickname }),
      });
      setUserId(data.userId);
      window.localStorage.setItem("zhongxu-user-id", data.userId);
      await fetchState(data.userId);
      setView("birth");
    } catch (error) {
      setSyncNote(error instanceof Error ? error.message : "邀请码验证失败");
    } finally {
      setIsBusy(false);
    }
  }

  async function submitBirth() {
    if (!userId) {
      setSyncNote("请先用邀请码进入体验，再保存命盘。");
      setView("login");
      return;
    }

    const next = makeProfile(birth);
    setProfile(next);
    setIsBusy(true);
    try {
      const data = await requestJson<{ profile: Profile }>("/api/profile", {
        method: "POST",
        body: JSON.stringify({ userId, birth }),
      });
      setProfile(data.profile);
      setSyncNote("命盘、今日日课和手串推荐已保存。");
      setView("chart");
    } catch (error) {
      setSyncNote(error instanceof Error ? error.message : "保存命盘失败");
    } finally {
      setIsBusy(false);
    }
  }

  async function useLiuyao(isLost: boolean) {
    if (!userId) {
      setSyncNote("请先用邀请码进入体验，再保存六爻记录。");
      setView("login");
      return;
    }
    if (liuyaoUsed >= quota) {
      setView("member");
      return;
    }
    const questionText = isLost ? `寻找${lostItem}` : question;
    setIsBusy(true);
    try {
      const data = await requestJson<{ membership: ApiMembership }>("/api/liuyao", {
        method: "POST",
        body: JSON.stringify({
          userId,
          questionType: isLost ? "找东西" : "问事",
          questionText,
          method: "时间起卦",
          isLostItem: isLost,
          lostItemName: isLost ? lostItem : undefined,
          lostItemLastSeen: isLost ? "书桌旁边或包里" : undefined,
        }),
      });
      setPlan(data.membership.plan);
      setQuota(data.membership.quota);
      setLiuyaoUsed(data.membership.used);
      setSyncNote("六爻记录已保存，并已扣减本月次数。");
      setView(isLost ? "lost" : "liuyao");
    } catch (error) {
      setSyncNote(error instanceof Error ? error.message : "六爻记录保存失败");
      setView("member");
    } finally {
      setIsBusy(false);
    }
  }

  async function updateMembership(nextPlan: PlanType, resetLiuyao = false) {
    if (!userId) {
      setPlan(nextPlan);
      setQuota(nextPlan === "premium" ? 10 : nextPlan === "yearly" ? 3 : 1);
      setAdminNote("未登录，当前只调整本机演示状态。");
      return;
    }
    try {
      const data = await requestJson<{ membership: ApiMembership }>("/api/admin/membership", {
        method: "PATCH",
        headers: { "x-admin-token": adminToken },
        body: JSON.stringify({ userId, plan: nextPlan, resetLiuyao }),
      });
      setPlan(data.membership.plan);
      setQuota(data.membership.quota);
      setLiuyaoUsed(data.membership.used);
      setAdminNote(resetLiuyao ? "已重置六爻使用次数。" : "已手动调整会员状态。");
      await loadAdminStats();
    } catch (error) {
      setAdminNote(error instanceof Error ? error.message : "会员调整失败");
    }
  }

  async function saveDateQuery() {
    if (!userId) {
      setSyncNote("请先登录后保存目标日期查询。");
      setView("login");
      return;
    }
    try {
      await requestJson("/api/records/date", {
        method: "POST",
        body: JSON.stringify({ userId, birth, targetDate }),
      });
      setSyncNote("目标日期查询已保存到后台记录。");
    } catch (error) {
      setSyncNote(error instanceof Error ? error.message : "保存目标查询失败");
    }
  }

  async function saveEventQuery() {
    if (!userId) {
      setSyncNote("请先登录后保存事件择机。");
      setView("login");
      return;
    }
    try {
      await requestJson("/api/records/event", {
        method: "POST",
        body: JSON.stringify({ userId, birth, targetDate, eventName }),
      });
      setSyncNote("事件择机已保存到后台记录。");
    } catch (error) {
      setSyncNote(error instanceof Error ? error.message : "保存事件择机失败");
    }
  }

  async function deleteProfileData() {
    if (!userId) {
      window.localStorage.removeItem("zhongxu-state");
      setAdminNote("已删除本机演示资料。");
      return;
    }
    try {
      await requestJson(`/api/profile?userId=${encodeURIComponent(userId)}`, { method: "DELETE" });
      setBirth(defaultBirth);
      setProfile(makeProfile(defaultBirth));
      setLiuyaoUsed(0);
      setAdminNote("已删除当前用户命盘、日课、查询和六爻记录。");
      await fetchState(userId);
    } catch (error) {
      setAdminNote(error instanceof Error ? error.message : "删除资料失败");
    }
  }

  async function loadAdminStats() {
    try {
      const data = await requestJson<AdminStats>("/api/admin/summary", {
        headers: { "x-admin-token": adminToken },
      });
      setAdminStats(data);
      return true;
    } catch {
      setAdminStats(null);
      return false;
    }
  }

  async function loadAdminStatsWithToken() {
    const ok = await loadAdminStats();
    setAdminNote(ok ? "后台统计已刷新。" : "管理员口令不正确，无法读取后台统计。");
  }

  const liuyao = makeLiuyao(question, "时间起卦");
  const lost = makeLiuyao(`寻找${lostItem}`, "时间起卦", lostItem);

  return (
    <main className="phone-shell soft-scroll pb-24">
      <header className="sticky top-0 z-20 border-b border-white/8 bg-ink/85 px-5 py-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <button onClick={() => setView("home")} className="text-left">
            <p className="text-[10px] uppercase tracking-[0.55em] text-gold/70">GUANFU WENJI</p>
            <h1 className="gold-text text-2xl font-semibold tracking-[0.18em]">观复问机</h1>
          </button>
          <button onClick={() => setView("member")} className="rounded-full border border-gold/25 px-3 py-2 text-xs text-gold">
            {planLabels[plan]}
          </button>
        </div>
      </header>

      <div className="space-y-5 px-4 py-5">
        <div className="rounded-2xl border border-gold/10 bg-white/[0.035] px-4 py-3 text-xs leading-5 text-mist">
          <span className="text-gold">{userId ? "已连接后台" : "未登录体验"}</span>
          <span className="ml-2">{syncNote}</span>
        </div>

        {view === "home" && (
          <>
            <section className="grid min-h-[560px] place-items-center text-center">
              <div>
                <div className="ring-asset mx-auto mb-8 h-36 w-36 rounded-full border border-gold/25 shadow-glow" />
                <p className="mb-3 text-xs uppercase tracking-[0.6em] text-gold/60">MINGLI H5 MVP</p>
                <h2 className="gold-text text-5xl font-semibold leading-tight tracking-[0.16em]">观复问机</h2>
                <p className="mt-5 text-lg leading-8 text-rice">八字看长期节奏，六爻问当下机宜。</p>
                <p className="mx-auto mt-4 max-w-[22rem] text-sm leading-7 text-mist">每天一条属于你的命理提醒，看清什么时候该动，什么时候该稳。</p>
                <div className="mt-8 grid gap-3">
                  <button onClick={() => setView(userId ? "birth" : "login")} className="h-14 rounded-2xl bg-gradient-to-r from-[#efc94f] to-[#a87817] font-semibold text-black">生成我的日课</button>
                  <button onClick={() => setView("date")} className="h-12 rounded-2xl border border-gold/30 text-gold">查询某天适合做什么</button>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setView("liuyao")} className="h-12 rounded-2xl bg-white/[0.06] text-rice">六爻问一事</button>
                    <button onClick={() => setView("lost")} className="h-12 rounded-2xl bg-white/[0.06] text-rice">六爻找东西</button>
                  </div>
                </div>
              </div>
            </section>
            <Card>
              <SectionTitle>今日示例</SectionTitle>
              <LessonSummary lesson={lesson} compact={!isMember} />
            </Card>
            <Card>
              <SectionTitle>转化入口</SectionTitle>
              <div className="grid grid-cols-2 gap-3">
                <Feature icon={<Gem size={18} />} title="手串推荐" text={bracelet.name} onClick={() => setView("chart")} />
                <Feature icon={<UserRound size={18} />} title="人工详批" text="八字单项 / 全盘详批" onClick={() => setView("member")} />
              </div>
            </Card>
          </>
        )}

        {view === "login" && (
          <Card>
            <SectionTitle>邀请码验证</SectionTitle>
            <p className="mb-4 text-sm leading-7 text-mist">第一版暂不接微信登录，可用邀请码进入体验。默认测试码：ZXWJ-TEST。</p>
            <div className="grid gap-3">
              <Field label="体验昵称"><input className={inputClass} value={birth.nickname} onChange={(event) => setBirth({ ...birth, nickname: event.target.value })} /></Field>
              <Field label="邀请码"><input className={inputClass} placeholder="请输入邀请码" value={inviteCode} onChange={(event) => setInviteCode(event.target.value)} /></Field>
            </div>
            <button disabled={isBusy} onClick={loginWithInvite} className="mt-4 h-12 w-full rounded-2xl bg-gold font-semibold text-black disabled:opacity-60">
              {isBusy ? "验证中..." : "进入体验并创建用户"}
            </button>
          </Card>
        )}

        {view === "birth" && (
          <Card>
            <SectionTitle>出生信息</SectionTitle>
            <div className="grid gap-4">
              <Field label="昵称"><input className={inputClass} value={birth.nickname} onChange={(e) => setBirth({ ...birth, nickname: e.target.value })} /></Field>
              <Field label="性别">
                <select className={inputClass} value={birth.gender} onChange={(e) => setBirth({ ...birth, gender: e.target.value })}>
                  <option value="female">女</option>
                  <option value="male">男</option>
                  <option value="unknown">不填写</option>
                </select>
              </Field>
              <Field label="出生日期（第一版仅公历）"><input className={inputClass} type="date" value={birth.birthDate} onChange={(e) => setBirth({ ...birth, birthDate: e.target.value })} /></Field>
              <Field label="出生小时"><input className={inputClass} type="number" min="0" max="23" value={birth.birthHour} onChange={(e) => setBirth({ ...birth, birthHour: e.target.value })} /></Field>
              <Field label="出生地（第一版仅记录）"><input className={inputClass} value={birth.birthPlace} onChange={(e) => setBirth({ ...birth, birthPlace: e.target.value })} /></Field>
              <button disabled={isBusy} onClick={submitBirth} className="h-14 rounded-2xl bg-gradient-to-r from-[#efc94f] to-[#a87817] font-semibold text-black disabled:opacity-60">
                {isBusy ? "保存中..." : "生成我的八字日课"}
              </button>
              <p className="text-xs leading-6 text-mist">信息仅用于日课计算，你可以在后台/资料区删除。农历输入与真太阳时留到第二版。</p>
            </div>
          </Card>
        )}

        {view === "chart" && (
          <>
            <Card>
              <SectionTitle>我的命盘</SectionTitle>
              <div className="grid grid-cols-4 gap-2">
                {[
                  ["年柱", profile.yearPillar],
                  ["月柱", profile.monthPillar],
                  ["日柱", profile.dayPillar],
                  ["时柱", profile.hourPillar],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-gold/15 bg-white/[0.04] p-3 text-center">
                    <p className="text-xs text-mist">{label}</p>
                    <p className="gold-text mt-2 text-2xl font-semibold">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl bg-white/[0.04] p-4 text-sm leading-7 text-rice">
                <p>你的日主：<span className="text-gold">{profile.dayMaster}{profile.dayElement}</span></p>
                <p>命盘关键词：表达力、感受力、行动欲、压力转化。</p>
                <p>{isMember ? "当前状态适合把压力转化为作品、内容、服务或实际成果。" : "免费版显示简析，开通会员可看事业、情绪与流年扩展。"}</p>
              </div>
            </Card>
            <Card>
              <SectionTitle>手串推荐</SectionTitle>
              <p className="text-lg text-gold">{bracelet.name}</p>
              <p className="mt-2 text-sm leading-7 text-mist">{bracelet.description}</p>
              <button onClick={() => setView("member")} className="mt-4 h-11 w-full rounded-2xl border border-gold/25 text-gold">咨询购买 / 查看详情</button>
            </Card>
          </>
        )}

        {view === "daily" && (
          <Card>
            <SectionTitle>今日日课</SectionTitle>
            <LessonSummary lesson={lesson} compact={!isMember} />
          </Card>
        )}

        {view === "date" && (
          <>
            <Card>
              <SectionTitle>目标日期查询</SectionTitle>
              <Field label="目标日期"><input className={inputClass} type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} /></Field>
              <div className="mt-5"><LessonSummary lesson={dateLesson} compact={!isMember} /></div>
              <button onClick={saveDateQuery} className="mt-4 h-11 w-full rounded-2xl border border-gold/25 text-gold">保存本次目标查询</button>
            </Card>
            <Card>
              <SectionTitle>十二时辰简析</SectionTitle>
              <div className="grid gap-2">
                {hours.map((item) => (
                  <div key={item.name} className="rounded-2xl bg-white/[0.04] p-3">
                    <div className="flex items-center justify-between">
                      <strong className="text-gold">{item.name}</strong>
                      <span className="text-xs text-mist">{item.hour} · {item.level}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-mist">{item.state}。{item.caution}</p>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {view === "event" && (
          <Card>
            <SectionTitle>事件择机</SectionTitle>
            <div className="grid gap-4">
              <Field label="目标日期"><input className={inputClass} type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} /></Field>
              <Field label="选择事情">
                <select className={inputClass} value={eventName} onChange={(e) => setEventName(e.target.value)}>
                  {eventOptions.map((event) => <option key={event}>{event}</option>)}
                </select>
              </Field>
              <div className="rounded-2xl border border-gold/15 bg-white/[0.04] p-4">
                <p className="text-sm text-mist">适配等级</p>
                <p className="mt-1 text-2xl font-semibold text-gold">{eventAdvice.level}</p>
                <p className="mt-3 text-sm leading-7 text-rice">{eventAdvice.reason}</p>
                <p className="mt-2 text-sm leading-7 text-mist">{eventAdvice.action}</p>
                <p className="mt-2 text-xs leading-6 text-cinnabar">{eventAdvice.caution}</p>
              </div>
              <button onClick={saveEventQuery} className="h-11 rounded-2xl border border-gold/25 text-gold">保存本次择机记录</button>
            </div>
          </Card>
        )}

        {view === "liuyao" && (
          <Card>
            <SectionTitle>六爻问一事</SectionTitle>
            <textarea className={`${inputClass} h-28 py-3`} value={question} onChange={(e) => setQuestion(e.target.value)} />
            <button disabled={isBusy} onClick={() => useLiuyao(false)} className="mt-4 h-12 w-full rounded-2xl bg-gold font-semibold text-black disabled:opacity-60">
              {isBusy ? "保存中..." : "时间起卦"}
            </button>
            <LiuyaoResult data={liuyao} used={liuyaoUsed} quota={quota} />
          </Card>
        )}

        {view === "lost" && (
          <Card>
            <SectionTitle>六爻找东西</SectionTitle>
            <div className="grid gap-4">
              <Field label="丢了什么"><input className={inputClass} value={lostItem} onChange={(e) => setLostItem(e.target.value)} /></Field>
              <Field label="最后一次看到在哪里"><input className={inputClass} defaultValue="书桌旁边或包里" /></Field>
              <button disabled={isBusy} onClick={() => useLiuyao(true)} className="h-12 rounded-2xl bg-gold font-semibold text-black disabled:opacity-60">
                {isBusy ? "保存中..." : "时间起卦找物"}
              </button>
              <LiuyaoResult data={lost} used={liuyaoUsed} quota={quota} />
            </div>
          </Card>
        )}

        {view === "member" && (
          <Card>
            <SectionTitle>会员中心</SectionTitle>
            <div className="grid gap-3">
              {(["free", "trial", "yearly", "premium"] as PlanType[]).map((item) => (
                <button key={item} onClick={() => setSyncNote("正式支付暂未接入，请通过人工咨询或后台手动开通会员。")} className={`rounded-2xl border p-4 text-left ${plan === item ? "border-gold bg-gold/10" : "border-white/10 bg-white/[0.04]"}`}>
                  <div className="flex items-center justify-between">
                    <strong className="text-gold">{planLabels[item]}</strong>
                    <span className="text-sm text-mist">{item === "free" ? "0 元" : item === "trial" ? "19.9 / 7天" : item === "yearly" ? "199 / 年" : "699 / 年"}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-mist">当前为展示和权限模拟，第一版后台手动开通，不接微信支付。</p>
                </button>
              ))}
            </div>
            <button onClick={() => setView("admin")} className="mt-4 h-11 w-full rounded-2xl border border-gold/25 text-gold">后台手动开通 / 人工处理</button>
          </Card>
        )}

        {view === "admin" && (
          <Card>
            <SectionTitle>后台管理</SectionTitle>
            <div className="grid gap-3 text-sm">
              <Field label="管理员口令">
                <input className={inputClass} value={adminToken} onChange={(event) => setAdminToken(event.target.value)} placeholder="请输入 ADMIN_TOKEN" />
              </Field>
              <button onClick={loadAdminStatsWithToken} className="h-11 rounded-2xl border border-gold/25 text-gold">验证口令并刷新统计</button>
              <AdminRow label="用户" value={profile.nickname} />
              <AdminRow label="命盘" value={`${profile.yearPillar} ${profile.monthPillar} ${profile.dayPillar} ${profile.hourPillar}`} />
              <AdminRow label="会员" value={planLabels[plan]} />
              <AdminRow label="六爻次数" value={`${liuyaoUsed}/${quota}`} />
              {adminStats && (
                <div className="grid grid-cols-3 gap-2">
                  <AdminStat label="用户" value={adminStats.users} />
                  <AdminStat label="命盘" value={adminStats.profiles} />
                  <AdminStat label="六爻" value={adminStats.liuyaoRecords} />
                </div>
              )}
              <select className={inputClass} value={plan} onChange={(e) => void updateMembership(e.target.value as PlanType)}>
                <option value="free">免费用户</option>
                <option value="trial">体验会员</option>
                <option value="yearly">年会员</option>
                <option value="premium">高级会员</option>
              </select>
              <button onClick={() => void updateMembership(plan, true)} className="h-11 rounded-2xl border border-gold/25 text-gold">增加 / 重置六爻次数</button>
              <button onClick={deleteProfileData} className="h-11 rounded-2xl border border-cinnabar/40 text-cinnabar">删除用户资料</button>
              <p className="text-mist">{adminNote}</p>
              {adminStats?.logs.length ? (
                <div className="rounded-2xl bg-white/[0.04] p-3">
                  <p className="mb-2 text-gold">最近后台日志</p>
                  {adminStats.logs.map((log, index) => (
                    <p key={`${log.action}-${index}`} className="text-xs leading-5 text-mist">{log.action} · {log.targetType}</p>
                  ))}
                </div>
              ) : null}
            </div>
          </Card>
        )}

        {(view === "terms" || view === "privacy") && (
          <Card>
            <SectionTitle>{view === "terms" ? "用户协议" : "隐私政策"}</SectionTitle>
            <p className="text-sm leading-7 text-mist">
              本工具仅作为传统文化参考、每日节奏提醒和行事建议，不构成医疗、法律、金融投资或其他专业决策建议。系统仅收集生成命盘所需信息，不收集身份证号和详细住址，用户可在后台删除本地资料。
            </p>
          </Card>
        )}
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto grid max-w-[430px] grid-cols-5 border-t border-gold/15 bg-ink/92 px-2 pb-3 pt-2 backdrop-blur">
        <Nav icon={<Home size={18} />} label="首页" active={view === "home"} onClick={() => setView("home")} />
        <Nav icon={<CalendarDays size={18} />} label="日课" active={view === "daily"} onClick={() => setView("daily")} />
        <Nav icon={<Search size={18} />} label="择机" active={view === "event"} onClick={() => setView("event")} />
        <Nav icon={<Sparkles size={18} />} label="六爻" active={view === "liuyao"} onClick={() => setView("liuyao")} />
        <Nav icon={<LayoutDashboard size={18} />} label="后台" active={view === "admin"} onClick={() => setView("admin")} />
      </nav>
    </main>
  );
}

function LessonSummary({ lesson, compact }: { lesson: ReturnType<typeof makeLesson>; compact: boolean }) {
  return (
    <div>
      <div className="flex items-center justify-between rounded-2xl bg-white/[0.04] p-4">
        <div>
          <p className="text-xs text-mist">{lesson.dayGanzhi} · {lesson.tenGod}</p>
          <p className="mt-1 text-2xl font-semibold text-gold">{lesson.keyword}</p>
        </div>
        <ShieldCheck className="text-gold" size={26} />
      </div>
      <p className="mt-4 text-sm leading-7 text-rice">{compact ? lesson.sentence : lesson.summary}</p>
      <div className="mt-4 grid gap-3">
        <Tags title="今日适合" items={compact ? lesson.suitable.slice(0, 1) : lesson.suitable} />
        {!compact && <Tags title="今日不宜" items={lesson.unsuitable} muted />}
      </div>
      {!compact ? (
        <div className="mt-4 grid gap-3 text-sm leading-7 text-mist">
          <p><span className="text-gold">事业：</span>{lesson.career}</p>
          <p><span className="text-gold">财务：</span>{lesson.money}</p>
          <p><span className="text-gold">情绪：</span>{lesson.emotion}</p>
          <p><span className="text-gold">人际：</span>{lesson.relation}</p>
          <p><span className="text-gold">内容：</span>{lesson.content}</p>
          <p><span className="text-gold">颜色：</span>{lesson.colors.join(" / ")}　<span className="text-gold">方位：</span>{lesson.direction}</p>
        </div>
      ) : (
        <p className="mt-4 rounded-2xl border border-gold/20 bg-gold/10 p-3 text-sm text-gold">开通会员可查看完整事业、财务、情绪、人际、内容发布建议与适配色。</p>
      )}
    </div>
  );
}

function Tags({ title, items, muted = false }: { title: string; items: readonly string[]; muted?: boolean }) {
  return (
    <div>
      <p className={`mb-2 text-sm ${muted ? "text-cinnabar" : "text-jade"}`}>{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-rice">{item}</span>
        ))}
      </div>
    </div>
  );
}

function LiuyaoResult({ data, used, quota }: { data: ReturnType<typeof makeLiuyao>; used: number; quota: number }) {
  return (
    <div className="mt-5 rounded-2xl bg-white/[0.04] p-4 text-sm leading-7 text-mist">
      <div className="mb-3 grid grid-cols-3 gap-2 text-center">
        <span className="rounded-xl bg-black/20 p-2"><b className="text-gold">{data.base}</b><br />本卦</span>
        <span className="rounded-xl bg-black/20 p-2"><b className="text-gold">{data.changed}</b><br />变卦</span>
        <span className="rounded-xl bg-black/20 p-2"><b className="text-gold">{data.moving}</b><br />动爻</span>
      </div>
      <p>{data.summary}</p>
      <p><span className="text-gold">机会点：</span>{data.opportunity}</p>
      <p><span className="text-gold">阻力点：</span>{data.obstacle}</p>
      <p><span className="text-gold">行动建议：</span>{data.action}</p>
      <p className="mt-3 text-xs text-cinnabar">本月体验次数：{used}/{quota}。不输出绝对结论，不涉及医疗、寿命、赌博或投资买卖建议。</p>
    </div>
  );
}

function Feature({ icon, title, text, onClick }: { icon: React.ReactNode; title: string; text: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-2xl border border-gold/15 bg-white/[0.04] p-4 text-left">
      <span className="text-gold">{icon}</span>
      <strong className="mt-3 block text-rice">{title}</strong>
      <span className="mt-1 block text-xs leading-5 text-mist">{text}</span>
    </button>
  );
}

function Nav({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`grid justify-items-center gap-1 rounded-2xl py-2 text-[11px] ${active ? "bg-gold/12 text-gold" : "text-mist"}`}>
      {icon}
      {label}
    </button>
  );
}

function AdminRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between rounded-2xl bg-white/[0.04] p-3">
      <span className="text-mist">{label}</span>
      <span className="text-rice">{value}</span>
    </div>
  );
}

function AdminStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-gold/10 bg-white/[0.04] p-3 text-center">
      <p className="text-xs text-mist">{label}</p>
      <p className="mt-1 text-xl font-semibold text-gold">{value}</p>
    </div>
  );
}
