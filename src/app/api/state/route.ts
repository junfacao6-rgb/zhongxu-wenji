import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { birthProfileToClient, membershipPayload } from "@/lib/server-helpers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "缺少 userId" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      birthProfiles: { orderBy: { createdAt: "desc" }, take: 1 },
      memberships: { orderBy: { createdAt: "desc" }, take: 1 },
      liuyaoRecords: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "用户不存在" }, { status: 404 });
  }

  const latestProfile = user.birthProfiles[0];
  const converted = latestProfile ? birthProfileToClient(latestProfile) : null;

  return NextResponse.json({
    user: { id: user.id, nickname: user.nickname, gender: user.gender },
    birth: converted?.birth ?? null,
    profile: converted?.profile ?? null,
    membership: membershipPayload(user.memberships[0]),
    recentLiuyao: user.liuyaoRecords.map((record) => ({
      id: record.id,
      questionType: record.questionType,
      questionText: record.questionText,
      baseHexagram: record.baseHexagram,
      changedHexagram: record.changedHexagram,
      createdAt: record.createdAt,
    })),
  });
}
