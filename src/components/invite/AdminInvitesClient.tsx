"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Clock3, KeyRound, Plus, UsersRound } from "lucide-react";
import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";
import StatCard from "@/components/admin/StatCard";
import {
  inviteCodeMocks,
  inviteStatusLabels,
  inviteStatusTone,
  inviteTypeLabels,
  inviteTypeNames,
  type InviteCodeMock,
  type InviteStatus,
  type InviteType,
} from "@/data/inviteMock";

const defaultDays: Record<InviteType, number> = {
  trial: 7,
  monthly: 30,
  yearly: 365,
  course: 180,
};

const typePrefix: Record<InviteType, string> = {
  trial: "TRIAL",
  monthly: "MONTH",
  yearly: "YEAR",
  course: "COURSE",
};

export default function AdminInvitesClient() {
  const [invites, setInvites] = useState<InviteCodeMock[]>(inviteCodeMocks);
  const [type, setType] = useState<InviteType>("trial");
  const [validDays, setValidDays] = useState(defaultDays.trial);
  const [maxUses, setMaxUses] = useState(20);

  const activeCount = invites.filter((invite) => invite.status === "active").length;
  const totalUses = invites.reduce((sum, invite) => sum + invite.usedCount, 0);
  const capacity = invites.reduce((sum, invite) => sum + invite.maxUses, 0);

  const columns = useMemo<DataTableColumn<InviteCodeMock>[]>(
    () => [
      {
        key: "code",
        header: "邀请码",
        render: (row) => (
          <div className="grid gap-1">
            <strong>{row.code}</strong>
            <small>{row.note}</small>
          </div>
        ),
      },
      {
        key: "type",
        header: "类型",
        render: (row) => (
          <div className="grid gap-1">
            <StatusPill>{inviteTypeLabels[row.type]}</StatusPill>
            <small>{inviteTypeNames[row.type]}</small>
          </div>
        ),
      },
      { key: "validDays", header: "有效天数", render: (row) => `${row.validDays} 天` },
      {
        key: "uses",
        header: "使用次数",
        render: (row) => (
          <div className="grid gap-2">
            <span>
              {row.usedCount}/{row.maxUses}
            </span>
            <span className="h-1.5 overflow-hidden rounded-full bg-[rgba(62,97,115,0.12)]">
              <i className="block h-full rounded-full bg-[var(--admin-blue)]" style={{ width: `${Math.min(100, (row.usedCount / row.maxUses) * 100)}%` }} />
            </span>
          </div>
        ),
      },
      { key: "status", header: "状态", render: (row) => <StatusPill tone={inviteStatusTone[row.status]}>{inviteStatusLabels[row.status]}</StatusPill> },
      { key: "expiresAt", header: "到期", render: (row) => row.expiresAt },
    ],
    [],
  );

  function generateInvite() {
    const now = new Date();
    const createdAt = now.toISOString().slice(0, 10);
    const expiresAt = new Date(now.getTime() + validDays * 86400000).toISOString().slice(0, 10);
    const suffix = `${invites.length + 1}`.padStart(3, "0");
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    const next: InviteCodeMock = {
      id: `invite-generated-${Date.now()}`,
      code: `WENGU-${typePrefix[type]}-${suffix}-${random}`,
      type,
      title: inviteTypeNames[type],
      validDays,
      usedCount: 0,
      maxUses,
      status: "active",
      createdAt,
      expiresAt,
      note: "当前页面生成的 mock 邀请码，刷新后不会保留。",
    };

    setInvites((current) => [next, ...current]);
  }

  function handleTypeChange(nextType: InviteType) {
    setType(nextType);
    setValidDays(defaultDays[nextType]);
  }

  return (
    <div className="grid gap-6">
      <section className="admin-stat-grid is-compact" aria-label="邀请码统计">
        <StatCard label="邀请码总数" value={invites.length} note="第一阶段 mock 列表" icon={KeyRound} />
        <StatCard label="可用邀请码" value={activeCount} note="状态为 active" icon={CheckCircle2} tone="success" />
        <StatCard label="已使用次数" value={totalUses} note={`容量 ${capacity} 次`} icon={UsersRound} />
        <StatCard label="默认有效期" value={`${validDays} 天`} note={inviteTypeLabels[type]} icon={Clock3} tone="warning" />
      </section>

      <section className="admin-table-card">
        <div className="admin-table-head">
          <div>
            <h2>生成邀请码</h2>
            <p>当前只在页面内生成 mock 数据，不写入数据库，也不影响真实会员。</p>
          </div>
          <span>mock</span>
        </div>

        <div className="grid gap-3 p-5 md:grid-cols-[1fr_1fr_1fr_auto]">
          <label className="grid gap-2 text-sm text-[var(--admin-muted)]">
            类型
            <select className="h-11 rounded-md border border-[var(--admin-line)] bg-white px-3 text-[var(--admin-text)] outline-none" value={type} onChange={(event) => handleTypeChange(event.target.value as InviteType)}>
              <option value="trial">trial</option>
              <option value="monthly">monthly</option>
              <option value="yearly">yearly</option>
              <option value="course">course</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm text-[var(--admin-muted)]">
            有效天数
            <input
              className="h-11 rounded-md border border-[var(--admin-line)] bg-white px-3 text-[var(--admin-text)] outline-none"
              type="number"
              min={1}
              value={validDays}
              onChange={(event) => setValidDays(Math.max(1, Number(event.target.value) || 1))}
            />
          </label>

          <label className="grid gap-2 text-sm text-[var(--admin-muted)]">
            使用次数
            <input
              className="h-11 rounded-md border border-[var(--admin-line)] bg-white px-3 text-[var(--admin-text)] outline-none"
              type="number"
              min={1}
              value={maxUses}
              onChange={(event) => setMaxUses(Math.max(1, Number(event.target.value) || 1))}
            />
          </label>

          <button
            type="button"
            onClick={generateInvite}
            className="inline-flex h-11 items-center justify-center gap-2 self-end rounded-md bg-[var(--admin-text)] px-4 text-sm font-semibold text-white"
          >
            <Plus size={17} aria-hidden="true" />
            生成邀请码
          </button>
        </div>
      </section>

      <DataTable title="邀请码列表" description="类型、有效天数、使用次数和状态均为第一阶段 mock 字段。" columns={columns} rows={invites} />
    </div>
  );
}

function StatusPill({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "warning" | "success" | "danger" }) {
  return <span className={`admin-status-pill is-${tone}`}>{children}</span>;
}
