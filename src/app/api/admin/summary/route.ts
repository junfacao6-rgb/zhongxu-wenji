import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

type SummaryLog = {
  action: string;
  targetType: string;
  createdAt: Date;
};

export async function GET(request: Request) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const [users, profiles, liuyaoRecords, logs] = await Promise.all([
    prisma.user.count(),
    prisma.birthProfile.count(),
    prisma.liuyaoRecord.count(),
    prisma.adminLog.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return NextResponse.json({
    users,
    profiles,
    liuyaoRecords,
    logs: logs.map((log: SummaryLog) => ({
      action: log.action,
      targetType: log.targetType,
      createdAt: log.createdAt,
    })),
  });
}
