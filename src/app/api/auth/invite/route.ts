import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { quotaForPlan } from "@/lib/server-helpers";

export async function POST(request: Request) {
  const body = (await request.json()) as { code?: string; nickname?: string };
  const expected = process.env.INVITE_CODE || "ZXWJ-TEST";

  if ((body.code || "").trim() !== expected) {
    return NextResponse.json({ error: "邀请码不正确" }, { status: 401 });
  }

  const nickname = (body.nickname || "体验用户").trim().slice(0, 24);
  const user = await prisma.user.create({
    data: {
      nickname,
      memberships: {
        create: {
          planType: "free",
          status: "active",
          liuyaoQuotaMonthly: quotaForPlan("free"),
          liuyaoQuotaUsed: 0,
        },
      },
    },
    include: { memberships: true },
  });

  await prisma.adminLog.create({
    data: {
      adminId: "system",
      action: "invite_login",
      targetType: "user",
      targetId: user.id,
    },
  });

  return NextResponse.json({
    userId: user.id,
    nickname: user.nickname,
    membership: user.memberships[0],
  });
}
