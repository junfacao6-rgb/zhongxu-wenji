# 问古书斋路由地图

本文件定义问古书斋平台目标路由。当前阶段只作为信息架构与开发执行依据，不代表所有路由已经在代码中实现。

## 路由字段说明

- 页面用途：该页面解决什么问题。
- 面向用户：游客、注册用户、会员用户、课程学员、命理师/咨询师、管理员。
- 主要数据：页面需要读取或展示的核心数据对象。
- 是否需要登录：访问页面是否需要登录。
- 是否会员可见：是否属于会员权益或会员增强功能。
- MVP 是否实现：第一阶段是否需要实现页面骨架或 mock 版。

## 公开页面

| 路由 | 页面用途 | 面向用户 | 主要数据 | 是否需要登录 | 是否会员可见 | MVP 是否实现 |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 平台首页，展示问古书斋定位、藏书入口、学科入口和核心学习路径。 | 游客、注册用户、会员用户 | `PlatformModule`、`FeaturedBook`、`Subject`、`CoursePreview` | 否 | 否 | 是 |
| `/library` | 藏书库首页，按分类、关键词、版权状态浏览公开馆藏。 | 游客、注册用户、会员用户 | `SourceDocument`、`Book`、`CopyrightStatus`、`LibraryFilter` | 否 | 否 | 是 |
| `/library/[category]` | 指定分类藏书页，如奇门、八字、六爻、梅花、道家经典。 | 游客、注册用户、会员用户 | `SourceDocument`、`Subject`、`BookCategory` | 否 | 否 | 是 |
| `/book/[bookId]` | 书籍详情页，展示简介、目录、版权状态、阅读入口和关联术语。 | 游客、注册用户、会员用户 | `Book`、`SourceDocument`、`SourceSegment`、`Term` | 否 | 部分会员内容可见 | 是 |
| `/book/[bookId]/read` | 阅读器页面，阅读原文、白话、注解、术语和笔记。 | 游客、注册用户、会员用户 | `Book`、`SourceSegment`、`ReaderNote`、`Evidence` | 否，保存笔记需登录 | 部分会员内容可见 | 是 |
| `/subjects` | 学科中心首页，展示六大学科入口和学习结构。 | 游客、注册用户、会员用户、课程学员 | `Subject`、`SubjectModule`、`LearningPath` | 否 | 否 | 是 |
| `/subjects/qimen` | 奇门遁甲学科页，聚合资料、课程、术语、案例和工具入口。 | 游客、注册用户、会员用户、课程学员 | `Subject`、`Lesson`、`Term`、`CaseStudy`、`ToolRule` | 否 | 部分会员内容可见 | 是 |
| `/subjects/bazi` | 八字命理学科页，展示八字学习路径、核心概念和案例入口。 | 游客、注册用户、会员用户、课程学员 | `Subject`、`KnowledgeUnit`、`Lesson`、`CaseStudy` | 否 | 部分会员内容可见 | 是 |
| `/subjects/liuyao` | 六爻纳甲学科页，展示问事路径、基础概念和案例入口。 | 游客、注册用户、会员用户、课程学员 | `Subject`、`KnowledgeUnit`、`Lesson`、`CaseStudy` | 否 | 部分会员内容可见 | 是 |
| `/subjects/meihua` | 梅花易数学科页，展示象数、体用、断例和案例复盘。 | 游客、注册用户、会员用户、课程学员 | `Subject`、`KnowledgeUnit`、`Lesson`、`CaseStudy` | 否 | 部分会员内容可见 | 是 |
| `/subjects/dao` | 道家经典学科页，展示道德经、庄子、修身和日用实践内容。 | 游客、注册用户、会员用户、课程学员 | `Subject`、`Book`、`Lesson`、`Term` | 否 | 部分会员内容可见 | 是 |
| `/terms` | 术语库首页，支持按学科、难度、关键词检索术语卡。 | 游客、注册用户、会员用户、课程学员 | `Term`、`TermCategory`、`TermRelation` | 否 | 否 | 是 |
| `/terms/[termId]` | 术语详情页，展示白话解释、常见误区、关联术语和来源证据。 | 游客、注册用户、会员用户、课程学员 | `Term`、`TermEvidence`、`SourceSegment`、`KnowledgeUnit` | 否 | 部分会员内容可见 | 是 |
| `/courses` | 课程列表页，展示公开课、会员课、专题课和学习路径。 | 游客、注册用户、会员用户、课程学员 | `Course`、`Lesson`、`LearningPath`、`MembershipPlan` | 否 | 部分会员内容可见 | 是 |
| `/courses/[courseId]` | 课程详情页，展示课程介绍、课时目录、适合人群和学习进度。 | 游客、注册用户、会员用户、课程学员 | `Course`、`Lesson`、`Quiz`、`StudyProgress` | 否，学习进度需登录 | 部分会员内容可见 | 是 |

## 奇门工具

| 路由 | 页面用途 | 面向用户 | 主要数据 | 是否需要登录 | 是否会员可见 | MVP 是否实现 |
| --- | --- | --- | --- | --- | --- | --- |
| `/qimen` | 奇门工具首页，展示今日气机、排盘、择时、报告和历史入口。 | 游客、注册用户、会员用户、命理师/咨询师 | `QimenTool`、`ToolRule`、`ToolDisclaimer` | 否 | 部分工具会员可见 | 是 |
| `/qimen/today` | 今日气机 mock 页，展示当日传统文化参考提示。 | 游客、注册用户、会员用户 | `DailyQiMock`、`QimenMockResult`、`ToolDisclaimer` | 否 | 否 | 是 |
| `/qimen/chart` | 专业排盘 UI，输入时间、地点和事项，展示 mock 盘面。 | 注册用户、会员用户、命理师/咨询师 | `QimenChartInput`、`QimenChart`、`QimenRuleTrace` | 是 | 部分会员可见 | 是 |
| `/qimen/select-time` | 一事择时页，输入目标事项和时间范围，输出 mock 建议。 | 注册用户、会员用户、命理师/咨询师 | `TimingIntent`、`TimingWindow`、`TimingSuggestion` | 是 | 部分会员可见 | 是 |
| `/qimen/content-timing` | 内容发布择时页，用于短视频、文章、直播、上架等发布节奏参考。 | 注册用户、会员用户、命理师/咨询师 | `ContentTimingIntent`、`TimingSuggestion`、`ReportEvidence` | 是 | 是 | 是 |
| `/qimen/report/preview` | 奇门报告预览页，把工具结果组织为可交付报告结构。 | 注册用户、会员用户、命理师/咨询师 | `Report`、`ReportSection`、`ReportEvidence`、`ToolDisclaimer` | 是 | 部分会员可见 | 是 |
| `/qimen/history` | 排盘历史与择时记录页，展示历史 mock 记录和复盘入口。 | 注册用户、会员用户、命理师/咨询师 | `QimenHistoryItem`、`PracticeHistory`、`Report` | 是 | 部分会员可见 | 是 |

## 用户中心

| 路由 | 页面用途 | 面向用户 | 主要数据 | 是否需要登录 | 是否会员可见 | MVP 是否实现 |
| --- | --- | --- | --- | --- | --- | --- |
| `/me` | 我的书斋首页，汇总阅读、课程、笔记、报告、工具记录和上传草稿。 | 注册用户、会员用户、课程学员、命理师/咨询师 | `StudyProgress`、`ReaderNote`、`UserReport`、`PracticeHistory` | 是 | 否 | 是 |
| `/me/books` | 我的藏书与最近阅读，展示阅读记录、收藏和继续阅读入口。 | 注册用户、会员用户、课程学员 | `ReadingProgress`、`FavoriteItem`、`Book` | 是 | 否 | 是 |
| `/me/notes` | 我的笔记，管理阅读笔记、术语笔记和案例复盘笔记。 | 注册用户、会员用户、课程学员 | `UserNote`、`SourceSegment`、`Term` | 是 | 否 | 是 |
| `/me/progress` | 学习进度页，展示课程进度、学科进度和练习完成情况。 | 注册用户、会员用户、课程学员 | `StudyProgress`、`CourseProgress`、`QuizResult` | 是 | 部分会员可见 | 是 |
| `/me/charts` | 我的排盘记录，展示奇门排盘、择时和后续八字/六爻工具记录。 | 注册用户、会员用户、命理师/咨询师 | `QimenHistoryItem`、`ChartRecord`、`PracticeHistory` | 是 | 部分会员可见 | 是 |
| `/me/reports` | 我的报告，展示报告草稿、预览和历史报告。 | 注册用户、会员用户、命理师/咨询师 | `Report`、`ReportStatus`、`ReportEvidence` | 是 | 部分会员可见 | 是 |
| `/me/uploads` | 我的上传资料，展示用户上传的私有资料和整理状态。 | 注册用户、会员用户、命理师/咨询师 | `SourceDocument`、`SourceDraft`、`CopyrightStatus` | 是 | 部分会员可见 | 是 |
| `/me/settings` | 用户设置页，管理昵称、偏好、隐私和账号基础设置。 | 注册用户、会员用户 | `UserProfile`、`UserPreference`、`PrivacySetting` | 是 | 否 | 是 |

## 后台

| 路由 | 页面用途 | 面向用户 | 主要数据 | 是否需要登录 | 是否会员可见 | MVP 是否实现 |
| --- | --- | --- | --- | --- | --- | --- |
| `/admin` | 管理后台首页，展示资料、课程、术语、工具规则、用户和审核概况。 | 管理员 | `AdminSummary`、`ReviewQueue`、`SystemMetric` | 是，管理员 | 否 | 是 |
| `/admin/books` | 书籍管理，维护公开藏书、书籍详情、分类、阅读入口和版权状态。 | 管理员 | `Book`、`SourceDocument`、`CopyrightStatus` | 是，管理员 | 否 | 是 |
| `/admin/documents` | 资料管理，维护上传资料、来源、版权状态、访问级别和处理状态。 | 管理员 | `SourceDocument`、`SourceFile`、`CopyrightStatus`、`PublishStatus` | 是，管理员 | 否 | 是 |
| `/admin/imports` | 导入任务管理，查看上传、抽取、清洗、术语提取和 AI mock 整理任务。 | 管理员 | `ImportJob`、`AiTask`、`SourceDraft` | 是，管理员 | 否 | 是 |
| `/admin/segments` | 章节与片段管理，校对原文、白话、注解、证据和发布状态。 | 管理员 | `SourceSegment`、`SegmentDraft`、`Evidence`、`ReviewAction` | 是，管理员 | 否 | 是 |
| `/admin/terms` | 术语管理，维护术语卡、关联术语、学科归属和来源证据。 | 管理员 | `Term`、`TermRelation`、`TermEvidence` | 是，管理员 | 否 | 是 |
| `/admin/knowledge` | 知识点管理，把资料片段整理为知识点并关联课程、术语和案例。 | 管理员 | `KnowledgeUnit`、`SourceSegment`、`Term`、`Lesson` | 是，管理员 | 否 | 是 |
| `/admin/lessons` | 课时管理，维护讲义、练习题、证据引用和发布状态。 | 管理员 | `Lesson`、`Quiz`、`Evidence`、`PublishStatus` | 是，管理员 | 否 | 是 |
| `/admin/courses` | 课程管理，维护课程目录、权限、学科归属和学习路径。 | 管理员 | `Course`、`Lesson`、`LearningPath`、`MembershipPlan` | 是，管理员 | 否 | 是 |
| `/admin/qimen-rules` | 奇门规则管理，维护 mock 规则、后续真实规则引擎字段和免责声明。 | 管理员 | `ToolRule`、`QimenRuleTrace`、`RuleVersion` | 是，管理员 | 否 | 是 |
| `/admin/invites` | 邀请码管理，维护邀请码、权益、有效期和使用记录。 | 管理员 | `InviteCode`、`InviteUsage`、`MembershipPlan` | 是，管理员 | 否 | 是 |
| `/admin/users` | 用户管理，查看用户、会员状态、学习记录和风险操作记录。 | 管理员 | `UserProfile`、`Membership`、`StudyProgress`、`AdminLog` | 是，管理员 | 否 | 后续 |
| `/admin/reports` | 报告管理，查看报告草稿、审核状态、证据链和发布/交付状态。 | 管理员 | `Report`、`ReportEvidence`、`ReportStatus`、`ReviewAction` | 是，管理员 | 否 | 是 |

## MVP 路由优先级

第一阶段优先实现页面骨架和 mock 数据的路由：

1. `/`
2. `/library`
3. `/book/[bookId]`
4. `/book/[bookId]/read`
5. `/subjects`
6. `/subjects/qimen`
7. `/subjects/bazi`
8. `/subjects/liuyao`
9. `/subjects/meihua`
10. `/subjects/dao`
11. `/terms`
12. `/courses`
13. `/qimen`
14. `/qimen/today`
15. `/qimen/chart`
16. `/qimen/select-time`
17. `/qimen/report/preview`
18. `/me`
19. `/admin`
20. `/admin/documents`
21. `/admin/imports`
22. `/admin/reports`

暂缓或后续补全：

- `/admin/users`
- 真实会员权限控制
- 真实文件上传
- 真实 AI 整理
- 真实奇门、八字、六爻算法
- 支付和订单
