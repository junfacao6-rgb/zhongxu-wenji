import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BirthInput, makeHourAdvice, makeLesson, makeProfile } from "@/lib/rules";

export async function POST(request: Request) {
  const body = (await request.json()) as { userId?: string; profileId?: string; birth?: BirthInput; targetDate?: string };
  if (!body.userId || !body.birth || !body.targetDate) {
    return NextResponse.json({ error: "缺少查询信息" }, { status: 400 });
  }

  const profile = makeProfile(body.birth);
  const lesson = makeLesson(profile, body.targetDate);
  const hours = makeHourAdvice(profile, body.targetDate);

  const record = await prisma.dateQuery.create({
    data: {
      userId: body.userId,
      profileId: body.profileId || "local",
      targetDate: new Date(`${body.targetDate}T12:00:00+08:00`),
      targetGanzhi: lesson.dayGanzhi,
      keyword: lesson.keyword,
      summary: lesson.summary,
      suitable: lesson.suitable.join("、"),
      unsuitable: lesson.unsuitable.join("、"),
      timeAdvice: hours.slice(0, 3).map((item) => `${item.name}${item.level}`).join("、"),
      eventAdvice: lesson.sentence,
    },
  });

  return NextResponse.json({ record });
}
