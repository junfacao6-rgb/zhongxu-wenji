import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PlanType } from "@/lib/rules";
import { normalizePlan, quotaForPlan, membershipPayload } from "@/lib/server-helpers";
import { requireAdmin } from "@/lib/admin-auth";

export async function PATCH(request: Request) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const body = (await request.json()) as { userId?: string; plan?: PlanType; resetLiuyao?: boolean };
  if (!body.userId) {
    return NextResponse.json({ error: "缺少 userId" }, { status: 400 });
  }

  const plan = normalizePlan(body.plan);
  const existing = await prisma.membership.findFirst({
    where: { userId: body.userId, status: "active" },
    orderBy: { createdAt: "desc" },
  });

  const membership = existing
    ? await prisma.membership.update({
        where: { id: existing.id },
        data: {
          planType: plan,
          liuyaoQuotaMonthly: quotaForPlan(plan),
          liuyaoQuotaUsed: body.resetLiuyao ? 0 : existing.liuyaoQuotaUsed,
        },
      })
    : await prisma.membership.create({
        data: {
          userId: body.userId,
          planType: plan,
          status: "active",
          liuyaoQuotaMonthly: quotaForPlan(plan),
          liuyaoQuotaUsed: 0,
        },
      });

  await prisma.adminLog.create({
    data: {
      adminId: "local_admin",
      action: body.resetLiuyao ? "reset_liuyao_quota" : "set_membership",
      targetType: "user",
      targetId: body.userId,
    },
  });

  return NextResponse.json({ membership: membershipPayload(membership) });
}
