import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BirthInput, makeEventAdvice, makeProfile } from "@/lib/rules";

export async function POST(request: Request) {
  const body = (await request.json()) as { userId?: string; profileId?: string; birth?: BirthInput; targetDate?: string; eventName?: string };
  if (!body.userId || !body.birth || !body.targetDate || !body.eventName) {
    return NextResponse.json({ error: "缺少择机信息" }, { status: 400 });
  }

  const profile = makeProfile(body.birth);
  const advice = makeEventAdvice(profile, body.targetDate, body.eventName);

  const record = await prisma.eventQuery.create({
    data: {
      userId: body.userId,
      profileId: body.profileId || "local",
      targetDate: new Date(`${body.targetDate}T12:00:00+08:00`),
      eventType: "general",
      eventName: advice.eventName,
      suitabilityLevel: advice.level,
      reason: advice.reason,
      actionAdvice: advice.action,
      caution: advice.caution,
      recommendedTime: advice.recommendedTime,
    },
  });

  return NextResponse.json({ record });
}
