import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { id: "demo-user" },
    update: { nickname: "演示用户" },
    create: {
      id: "demo-user",
      nickname: "演示用户",
      gender: "female",
      memberships: {
        create: {
          planType: "trial",
          status: "active",
          liuyaoQuotaMonthly: 1,
          liuyaoQuotaUsed: 0,
        },
      },
    },
  });

  const hasProfile = await prisma.birthProfile.findFirst({ where: { userId: user.id } });
  if (!hasProfile) {
    await prisma.birthProfile.create({
      data: {
        userId: user.id,
        name: "演示用户",
        gender: "female",
        birthDate: new Date("2001-04-14T12:00:00+08:00"),
        birthTime: "9",
        birthPlace: "杭州",
        calendarType: "solar",
        yearPillar: "辛巳",
        monthPillar: "癸巳",
        dayPillar: "乙巳",
        hourPillar: "辛巳",
        dayMaster: "乙",
      },
    });
  }

  await prisma.adminLog.create({
    data: {
      adminId: "seed",
      action: "seed_demo_data",
      targetType: "user",
      targetId: user.id,
    },
  });

  console.log("Seed complete: demo-user");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
