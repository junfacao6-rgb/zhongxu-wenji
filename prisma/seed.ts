import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const evidenceRefs = [
  {
    sourceDocumentId: "seed-source-qimen",
    sourceSegmentId: "seed-segment-qimen-001",
    pageStart: 1,
    pageEnd: 1,
    chapterTitle: "九宫与用局基础",
    quote: "九宫者，以洛书为体，分布方隅。",
    reason: "演示资料来源链路，后续真实内容必须保留 evidenceRefs。",
  },
];

async function main() {
  const user = await prisma.user.upsert({
    where: { id: "seed-user-demo" },
    update: {
      nickname: "演示学员",
      role: "student",
      status: "active",
    },
    create: {
      id: "seed-user-demo",
      nickname: "演示学员",
      gender: "female",
      role: "student",
      status: "active",
    },
  });

  const invite = await prisma.inviteCode.upsert({
    where: { code: "WENGU-SEED-TRIAL" },
    update: {
      status: "active",
      usedCount: 0,
    },
    create: {
      id: "seed-invite-trial",
      code: "WENGU-SEED-TRIAL",
      type: "trial",
      plan: "member",
      validDays: 7,
      maxUses: 20,
      usedCount: 0,
      status: "active",
      createdByUserId: user.id,
    },
  });

  await prisma.membership.upsert({
    where: { id: "seed-membership-demo" },
    update: {
      planType: "trial",
      status: "active",
      benefits: ["完整课程 mock", "奇门工具 mock", "报告预览 mock"],
      sourceInviteCodeId: invite.id,
      liuyaoQuotaMonthly: 1,
      qimenQuotaMonthly: 3,
      reportQuotaMonthly: 1,
    },
    create: {
      id: "seed-membership-demo",
      userId: user.id,
      planType: "trial",
      status: "active",
      benefits: ["完整课程 mock", "奇门工具 mock", "报告预览 mock"],
      sourceInviteCodeId: invite.id,
      liuyaoQuotaMonthly: 1,
      liuyaoQuotaUsed: 0,
      qimenQuotaMonthly: 3,
      reportQuotaMonthly: 1,
    },
  });

  const sourceDocument = await prisma.sourceDocument.upsert({
    where: { id: "seed-source-qimen" },
    update: {
      title: "奇门讲义第一讲",
      visibility: "private",
      reviewStatus: "pending",
    },
    create: {
      id: "seed-source-qimen",
      title: "奇门讲义第一讲",
      subject: "qimen",
      sourceType: "lecture",
      copyrightStatus: "self_owned",
      visibility: "private",
      ownerUserId: user.id,
      uploadStatus: "uploaded",
      processStatus: "ready",
      extractedTextStatus: "ready",
      aiDraftStatus: "mock_ready",
      reviewStatus: "pending",
      sourceNote: "演示资料默认 private，审核前不公开。",
    },
  });

  const segment = await prisma.sourceSegment.upsert({
    where: {
      documentId_order: {
        documentId: sourceDocument.id,
        order: 1,
      },
    },
    update: {
      evidenceRefs,
      reviewStatus: "pending",
    },
    create: {
      id: "seed-segment-qimen-001",
      documentId: sourceDocument.id,
      chapterTitle: "九宫与用局基础",
      pageStart: 1,
      pageEnd: 1,
      order: 1,
      originalText: "九宫者，以洛书为体，分布方隅，以观时空之位次。",
      cleanedText: "九宫以洛书为体，分布于八方与中宫，用来观察时空位置与结构。",
      modernTranslation: "九宫可以理解为观察时空和方位的结构框架。",
      notes: ["演示片段，生成内容必须保留 evidenceRefs。"],
      tags: ["奇门", "九宫"],
      evidenceRefs,
      reviewStatus: "pending",
    },
  });

  const book = await prisma.book.upsert({
    where: { id: "seed-book-qimen" },
    update: {
      sourceDocumentId: sourceDocument.id,
      visibility: "private",
      reviewStatus: "pending",
    },
    create: {
      id: "seed-book-qimen",
      title: "奇门入门正义",
      subtitle: "演示馆藏",
      author: "问古书斋",
      subject: "qimen",
      category: "奇门遁甲",
      description: "用于验证 PostgreSQL 初版模型的演示书籍。",
      difficulty: "入门",
      tags: ["奇门", "入门"],
      copyrightStatus: "self_owned",
      visibility: "private",
      sourceDocumentId: sourceDocument.id,
      publishStatus: "draft",
      reviewStatus: "pending",
    },
  });

  await prisma.chapter.upsert({
    where: {
      bookId_order: {
        bookId: book.id,
        order: 1,
      },
    },
    update: {
      segmentIds: [segment.id],
      visibility: "private",
    },
    create: {
      id: "seed-chapter-qimen-001",
      bookId: book.id,
      title: "九宫基础",
      order: 1,
      summary: "演示章节，关联一个来源片段。",
      segmentIds: [segment.id],
      visibility: "private",
      reviewStatus: "pending",
    },
  });

  const term = await prisma.term.upsert({
    where: {
      subject_name: {
        subject: "qimen",
        name: "九宫",
      },
    },
    update: {
      relatedSources: evidenceRefs,
      reviewStatus: "pending",
    },
    create: {
      id: "seed-term-jiugong",
      name: "九宫",
      subject: "qimen",
      category: "基础结构",
      aliases: ["九宫格", "洛书九宫"],
      originalExplanation: "九宫者，以洛书为体。",
      plainExplanation: "九宫是奇门中承载门、星、神、干等信息的位置框架。",
      advancedExplanation: "进阶学习时需要结合方位、五行、门星神干和时空条件。",
      relatedTermIds: [],
      relatedSources: evidenceRefs,
      visibility: "public",
      reviewStatus: "pending",
      tags: ["奇门", "基础"],
      sourceSegments: {
        connect: [{ id: segment.id }],
      },
    },
  });

  const knowledgeUnit = await prisma.knowledgeUnit.upsert({
    where: { id: "seed-knowledge-qimen-jiugong" },
    update: {
      evidenceRefs,
      reviewStatus: "pending",
    },
    create: {
      id: "seed-knowledge-qimen-jiugong",
      subject: "qimen",
      title: "九宫是奇门结构的承载框架",
      summary: "先理解九宫，再学习八门、九星、八神与天干落宫。",
      level: "入门",
      sourceSegmentIds: [segment.id],
      termIds: [term.id],
      lessonIds: [],
      evidenceRefs,
      visibility: "private",
      reviewStatus: "pending",
      sourceDocumentId: sourceDocument.id,
      sourceSegments: {
        connect: [{ id: segment.id }],
      },
      terms: {
        connect: [{ id: term.id }],
      },
    },
  });

  const course = await prisma.course.upsert({
    where: { id: "seed-course-qimen" },
    update: {
      visibility: "members",
      reviewStatus: "pending",
    },
    create: {
      id: "seed-course-qimen",
      subject: "qimen",
      title: "奇门入门",
      subtitle: "从九宫开始",
      description: "演示课程，用于验证课程、课时和证据链模型。",
      difficulty: "入门",
      visibility: "members",
      publishStatus: "draft",
      reviewStatus: "pending",
      sourceDocumentIds: [sourceDocument.id],
    },
  });

  const lesson = await prisma.lesson.upsert({
    where: {
      courseId_order: {
        courseId: course.id,
        order: 1,
      },
    },
    update: {
      knowledgeUnitIds: [knowledgeUnit.id],
      reviewStatus: "pending",
    },
    create: {
      id: "seed-lesson-qimen-001",
      courseId: course.id,
      subject: "qimen",
      title: "认识九宫",
      summary: "学习九宫的基本位置、方位和承载关系。",
      order: 1,
      estimatedMinutes: 12,
      visibility: "members",
      publishStatus: "draft",
      reviewStatus: "pending",
      knowledgeUnitIds: [knowledgeUnit.id],
      knowledgeUnits: {
        connect: [{ id: knowledgeUnit.id }],
      },
      terms: {
        connect: [{ id: term.id }],
      },
    },
  });

  await prisma.lessonBlock.upsert({
    where: {
      lessonId_order: {
        lessonId: lesson.id,
        order: 1,
      },
    },
    update: {
      evidenceRefs,
      reviewStatus: "pending",
    },
    create: {
      id: "seed-lesson-block-qimen-001",
      lessonId: lesson.id,
      type: "quote",
      title: "原文短摘",
      body: "九宫者，以洛书为体。",
      payload: {
        sourceSegmentId: segment.id,
      },
      order: 1,
      evidenceRefs,
      reviewStatus: "pending",
    },
  });

  const chart = await prisma.qimenChart.upsert({
    where: { id: "seed-qimen-chart" },
    update: {
      inputSnapshot: {
        mode: "mock",
        note: "第一阶段演示盘，不接真实排盘。",
      },
    },
    create: {
      id: "seed-qimen-chart",
      userId: user.id,
      title: "演示奇门盘",
      chartTime: new Date("2026-07-08T09:00:00+08:00"),
      question: "今天适合整理课程吗？",
      juType: "阳遁",
      juNumber: 3,
      dutyStar: "天心",
      dutyDoor: "开门",
      palaces: {
        mode: "mock",
        center: "中宫",
      },
      ruleVersion: "mock-v1",
      inputSnapshot: {
        mode: "mock",
        note: "第一阶段演示盘，不接真实排盘。",
      },
      disclaimer: "仅作传统文化学习与行动参考。",
    },
  });

  const report = await prisma.qimenReport.upsert({
    where: { id: "seed-qimen-report" },
    update: {
      generationBasis: {
        chartId: chart.id,
        ruleVersion: "mock-v1",
        evidenceRefs,
      },
      reviewStatus: "pending",
    },
    create: {
      id: "seed-qimen-report",
      userId: user.id,
      chartId: chart.id,
      title: "演示奇门报告",
      summary: "演示报告必须保存生成依据和证据链。",
      sections: [
        {
          title: "结构摘要",
          body: "当前为 mock 结构，仅用于验证报告模型。",
          evidenceRefs,
        },
      ],
      generationBasis: {
        chartId: chart.id,
        ruleVersion: "mock-v1",
        evidenceRefs,
      },
      promptSnapshot: "请基于 mock 盘面生成学习参考报告。",
      ruleTrace: [{ rule: "mock_rule", result: "参考" }],
      visibility: "private",
      status: "draft",
      reviewStatus: "pending",
      disclaimer: "仅作传统文化学习与行动参考。",
    },
  });

  await prisma.userNote.upsert({
    where: { id: "seed-user-note" },
    update: {
      body: "学习九宫时，先确认来源片段，再写白话理解。",
    },
    create: {
      id: "seed-user-note",
      userId: user.id,
      title: "九宫学习笔记",
      body: "学习九宫时，先确认来源片段，再写白话理解。",
      noteType: "course",
      sourceSegmentId: segment.id,
      lessonId: lesson.id,
      termId: term.id,
      chartId: chart.id,
      tags: ["奇门", "九宫"],
      visibility: "private",
    },
  });

  await prisma.studyProgress.upsert({
    where: { id: "seed-study-progress" },
    update: {
      progressPercent: 25,
      completedLessonIds: [lesson.id],
      lastStudiedAt: new Date(),
    },
    create: {
      id: "seed-study-progress",
      userId: user.id,
      courseId: course.id,
      lessonId: lesson.id,
      subject: "qimen",
      progressPercent: 25,
      completedLessonIds: [lesson.id],
      quizScores: {},
      lastStudiedAt: new Date(),
    },
  });

  await prisma.userReport.upsert({
    where: { id: "seed-user-report" },
    update: {
      generationBasis: {
        qimenReportId: report.id,
        chartId: chart.id,
        evidenceRefs,
      },
    },
    create: {
      id: "seed-user-report",
      userId: user.id,
      title: "演示奇门报告",
      reportType: "qimen",
      status: "draft",
      visibility: "private",
      reportId: report.id,
      summary: "报告入口记录，默认私密。",
      generationBasis: {
        qimenReportId: report.id,
        chartId: chart.id,
        evidenceRefs,
      },
      evidenceRefs,
      reviewStatus: "pending",
    },
  });

  await prisma.adminLog.create({
    data: {
      adminId: "seed",
      action: "seed_postgres_mock_foundation",
      targetType: "user",
      targetId: user.id,
    },
  });

  console.log("Seed complete: seed-user-demo");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
