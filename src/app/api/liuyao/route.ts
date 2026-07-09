import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { makeLiuyao } from "@/lib/rules";
import { membershipPayload } from "@/lib/server-helpers";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    userId?: string;
    questionType?: string;
    questionText?: string;
    method?: string;
    isLostItem?: boolean;
    lostItemName?: string;
    lostItemLastSeen?: string;
  };

  if (!body.userId || !body.questionText) {
    return NextResponse.json({ error: "缺少用户或问题" }, { status: 400 });
  }

  const membership = await prisma.membership.findFirst({
    where: { userId: body.userId, status: "active" },
    orderBy: { createdAt: "desc" },
  });
  const current = membershipPayload(membership);

  if (!membership || current.used >= current.quota) {
    return NextResponse.json({ error: "六爻次数不足", membership: current }, { status: 403 });
  }

  const result = makeLiuyao(body.questionText, body.method || "时间起卦", body.isLostItem ? body.lostItemName : undefined);

  const record = await prisma.liuyaoRecord.create({
    data: {
      userId: body.userId,
      questionType: body.questionType || (body.isLostItem ? "找东西" : "问事"),
      questionText: body.questionText,
      method: body.method || "时间起卦",
      baseHexagram: result.base,
      changedHexagram: result.changed,
      movingLines: result.moving,
      resultSummary: result.summary,
      opportunity: result.opportunity,
      obstacle: result.obstacle,
      actionAdvice: result.action,
      isLostItem: Boolean(body.isLostItem),
      lostItemName: body.lostItemName,
      lostItemLastSeen: body.lostItemLastSeen,
      lostItemHint: body.isLostItem ? result.action : undefined,
    },
  });

  const updated = await prisma.membership.update({
    where: { id: membership.id },
    data: { liuyaoQuotaUsed: { increment: 1 } },
  });

  return NextResponse.json({ record, result, membership: membershipPayload(updated) });
}
