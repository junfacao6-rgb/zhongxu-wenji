import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BirthInput, makeBracelet, makeLesson, makeProfile } from "@/lib/rules";

export async function POST(request: Request) {
  const body = (await request.json()) as { userId?: string; birth?: BirthInput };

  if (!body.userId || !body.birth) {
    return NextResponse.json({ error: "缺少用户或出生信息" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: body.userId } });
  if (!user) {
    return NextResponse.json({ error: "用户不存在" }, { status: 404 });
  }

  const profile = makeProfile(body.birth);
  const birthDate = new Date(`${body.birth.birthDate}T12:00:00+08:00`);
  const lesson = makeLesson(profile, new Date().toISOString().slice(0, 10));
  const bracelet = makeBracelet(profile);

  const saved = await prisma.birthProfile.create({
    data: {
      userId: body.userId,
      name: profile.nickname,
      gender: profile.gender,
      birthDate,
      birthTime: profile.birthHour,
      birthPlace: profile.birthPlace,
      calendarType: "solar",
      yearPillar: profile.yearPillar,
      monthPillar: profile.monthPillar,
      dayPillar: profile.dayPillar,
      hourPillar: profile.hourPillar,
      dayMaster: profile.dayMaster,
    },
  });

  await prisma.user.update({
    where: { id: body.userId },
    data: { nickname: profile.nickname, gender: profile.gender },
  });

  await prisma.dailyLesson.create({
    data: {
      userId: body.userId,
      profileId: saved.id,
      lessonDate: new Date(`${lesson.dateText}T12:00:00+08:00`),
      dayGanzhi: lesson.dayGanzhi,
      keyword: lesson.keyword,
      summary: lesson.summary,
      suitable: lesson.suitable.join("、"),
      unsuitable: lesson.unsuitable.join("、"),
      careerAdvice: lesson.career,
      moneyAdvice: lesson.money,
      emotionAdvice: lesson.emotion,
      relationshipAdvice: lesson.relation,
      contentAdvice: lesson.content,
      luckyColor: lesson.colors.join("、"),
      suitableDirection: lesson.direction,
      suitableTimeRange: lesson.timeRange,
      oneSentence: lesson.sentence,
    },
  });

  await prisma.braceletRecommendation.create({
    data: {
      userId: body.userId,
      profileId: saved.id,
      dayPillar: profile.dayPillar,
      braceletName: bracelet.name,
      keywords: bracelet.keywords,
      description: bracelet.description,
    },
  });

  return NextResponse.json({ profile, birthProfileId: saved.id });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "缺少 userId" }, { status: 400 });
  }

  await prisma.birthProfile.deleteMany({ where: { userId } });
  await prisma.dailyLesson.deleteMany({ where: { userId } });
  await prisma.dateQuery.deleteMany({ where: { userId } });
  await prisma.eventQuery.deleteMany({ where: { userId } });
  await prisma.liuyaoRecord.deleteMany({ where: { userId } });
  await prisma.braceletRecommendation.deleteMany({ where: { userId } });

  await prisma.adminLog.create({
    data: {
      adminId: "system",
      action: "delete_user_profile_data",
      targetType: "user",
      targetId: userId,
    },
  });

  return NextResponse.json({ ok: true });
}
