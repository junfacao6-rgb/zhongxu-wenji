# 问古书斋开发执行清单

本清单用于把「问古书斋」从现有古籍阅读站，逐步升级为传统文化术数学堂平台。执行原则是小步推进、mock 优先、保留现有 `/library` 和阅读器能力，不一次性重构整个项目。

全阶段共同约束：

- 不公开未授权资料。
- 不接真实支付。
- 不接真实 AI API。
- 不实现真实复杂排盘算法。
- 不把预测、择时、命理解释包装成确定性承诺。
- 所有工具结果只作传统文化学习与行动参考。

## Phase 0：项目检查

### 目标

确认当前技术栈、目录结构、已有页面、已有数据来源、已有后台/API/数据库雏形，建立后续改造边界。

### 新增页面

无。

### 新增组件

无。

### 新增数据结构

无。

### 验收标准

- 明确项目是否为 Next.js。
- 明确是否使用 TypeScript。
- 明确是否使用 Tailwind CSS。
- 找到 `/library` 页面、全局布局、导航组件、数据文件、样式文件。
- 判断已有数据库、登录、后台和 API route 状态。

### 不做什么

- 不修改业务代码。
- 不安装依赖。
- 不重构目录。
- 不调整视觉样式。

## Phase 1：文档与信息架构

### 目标

建立平台 PRD、开发 Roadmap 和基础信息架构，统一「问古书斋」的平台边界、阶段目标和开发纪律。

### 新增页面

无。

### 新增组件

无。

### 新增数据结构

- 平台模块清单。
- 导航结构草案。
- 阶段任务清单。
- 合规字段说明。

### 验收标准

- `docs/PLATFORM_PRD.md` 存在。
- `docs/ROADMAP.md` 存在。
- 文档明确 MVP 范围、后续阶段和不做事项。
- 文档明确版权、审核、AI evidence 和免责声明原则。

### 不做什么

- 不改页面。
- 不改现有导航。
- 不接数据库。
- 不接真实 AI。

## Phase 2：路由和导航

### 目标

建立综合平台的一级导航和基础路由骨架，让用户能看到首页、藏书、学科、奇门工具、术语库、课程、我的书斋、管理后台等入口。

### 新增页面

- `/subjects`
- `/qimen`
- `/terms`
- `/courses`
- `/me`
- `/admin`

### 新增组件

- `PlatformNav`
- `MobileNav`
- `NavGroup`
- `PlatformShell`
- `SectionEntryCard`

### 新增数据结构

- `NavItem`
- `PlatformModule`
- `RouteStatus`

### 验收标准

- 现有 `/library` 保持可访问。
- 新路由均能打开。
- 移动端导航不溢出。
- 导航文案统一为「问古书斋」。

### 不做什么

- 不删除现有 `/library`。
- 不重写阅读器。
- 不实现后台真实权限。
- 不把所有历史页面一次性接入主导航。

## Phase 3：数据类型和 mock 数据

### 目标

建立平台底层信息结构的 TypeScript 类型和 mock 数据，为后续页面和数据库迁移做准备。

### 新增页面

无。

### 新增组件

无。

### 新增数据结构

- `SourceDocument`
- `SourceSegment`
- `Term`
- `KnowledgeUnit`
- `Lesson`
- `Quiz`
- `CaseStudy`
- `ToolRule`
- `Report`
- `StudyProgress`
- `CopyrightStatus`
- `PublishStatus`
- `Evidence`

### 验收标准

- 所有类型使用 TypeScript。
- mock 数据可被页面直接引用。
- 每份资料都有 `copyrightStatus`。
- AI 生成内容结构预留 `evidence`。

### 不做什么

- 不接 Prisma。
- 不迁移现有真实数据。
- 不公开未授权资料。
- 不把 mock 当成真实发布内容。

## Phase 4：藏书库升级

### 目标

在保留现有藏书体验的基础上，增加版权状态、公开状态、资料类型和学科归属展示。

### 新增页面

无，继续使用 `/library` 和 `/library/[id]`。

### 新增组件

- `CopyrightBadge`
- `SourceTypeBadge`
- `SubjectBadge`
- `LibraryFilterPanel`

### 新增数据结构

- `LibrarySourceMeta`
- `LibraryFilterState`
- `SourceAccessLevel`

### 验收标准

- `/library` 不退化。
- 可按学科和资料状态筛选。
- 未授权资料不显示全文阅读入口。
- 页面移动端可用。

### 不做什么

- 不提供未授权全文下载。
- 不批量导入所有本地资料。
- 不重写现有书籍卡片系统。

## Phase 5：阅读器

### 目标

巩固现有阅读器，预留原文、白话、注解、术语、笔记和证据链展示能力。

### 新增页面

- 继续使用 `/library/[id]/read`
- 继续使用 `/library/[id]/source`

### 新增组件

- `ReaderToolbar`
- `ReaderModeTabs`
- `AnnotationPanel`
- `EvidencePanel`
- `ReaderNoteBox`

### 新增数据结构

- `ReaderMode`
- `ReaderAnnotation`
- `ReaderNote`
- `SegmentEvidence`

### 验收标准

- 原阅读路径可用。
- 文本阅读和 PDF/TXT 原书入口不被破坏。
- 可展示 mock 注解和术语。
- 移动端阅读不遮挡正文。

### 不做什么

- 不实现复杂 OCR。
- 不自动翻译全书。
- 不公开 private_study 资料全文。

## Phase 6：学科中心

### 目标

建立奇门、八字、六爻、梅花、道家经典、易学基础六大学科首页。

### 新增页面

- `/subjects`
- `/subjects/qimen`
- `/subjects/bazi`
- `/subjects/liuyao`
- `/subjects/meihua`
- `/subjects/daoist`
- `/subjects/yixue`

### 新增组件

- `SubjectIndexPage`
- `SubjectHero`
- `SubjectModuleGrid`
- `SubjectLearningMap`
- `SubjectResourceList`

### 新增数据结构

- `Subject`
- `SubjectModule`
- `SubjectResourceLink`
- `SubjectLearningStage`

### 验收标准

- 六大学科均有入口。
- 每个学科展示资料、课程、术语、案例和工具入口。
- 所有内容使用 mock 数据。
- 移动端结构清楚。

### 不做什么

- 不写完整课程内容。
- 不接真实学习进度。
- 不实现真实排盘。

## Phase 7：术语库

### 目标

建立统一术语库，支持按学科、难度、关键词检索术语卡。

### 新增页面

- `/terms`
- `/terms/[id]`

### 新增组件

- `TermSearch`
- `TermCard`
- `TermDetail`
- `RelatedTerms`
- `TermEvidenceList`

### 新增数据结构

- `Term`
- `TermCategory`
- `TermDifficulty`
- `TermRelation`
- `TermEvidence`

### 验收标准

- 可浏览术语列表。
- 可进入术语详情。
- 每个术语展示白话解释、误区、关联术语和来源证据。
- 无来源的 AI 解释不得标为已发布内容。

### 不做什么

- 不生成大量伪术语。
- 不把术语解释写成绝对结论。
- 不接真实 AI 自动扩写。

## Phase 8：资料上传后台

### 目标

建立后台资料上传 UI，支持录入资料元信息、版权状态和访问级别。

### 新增页面

- `/admin/sources`
- `/admin/sources/upload`

### 新增组件

- `SourceUploadForm`
- `CopyrightStatusSelect`
- `SourceMetaForm`
- `UploadDropzoneMock`
- `AccessLevelNotice`

### 新增数据结构

- `SourceUploadDraft`
- `CopyrightStatus`
- `SourceFileType`
- `SourceVisibility`

### 验收标准

- 上传 UI 可填写资料名称、学科、类型、版权状态、来源说明。
- 默认状态为草稿或私有。
- 前端明确提示未授权资料不得公开。
- mock 上传不真正保存文件到服务器。

### 不做什么

- 不实现真实文件上传。
- 不公开上传内容。
- 不接对象存储。
- 不做自动 OCR。

## Phase 9：资料整理草稿后台

### 目标

建立资料整理草稿后台，用于查看文本抽取、章节识别、术语提取、白话翻译、讲义整理和审核状态。

### 新增页面

- `/admin/intake`
- `/admin/intake/[id]`

### 新增组件

- `DraftQueue`
- `DraftStatusBadge`
- `SegmentReviewPanel`
- `ExtractionPreview`
- `AdminReviewActions`

### 新增数据结构

- `SourceDraft`
- `SegmentDraft`
- `DraftReviewStatus`
- `ExtractionIssue`
- `ReviewAction`

### 验收标准

- 可查看 mock 草稿列表。
- 可查看单个草稿的章节、术语和整理状态。
- 草稿未审核前不进入前台发布列表。
- 页面有版权和审核提示。

### 不做什么

- 不自动发布。
- 不接真实 OCR。
- 不接真实 AI 整理。
- 不允许未授权全文前台展示。

## Phase 10：AI 整理接口抽象

### 目标

建立 AI 整理服务接口和 mock 实现，为后续白话翻译、术语解释、课程生成、练习题生成和报告润色预留边界。

### 新增页面

无。

### 新增组件

无。

### 新增数据结构

- `AiTask`
- `AiTaskType`
- `AiDraftResult`
- `AiEvidence`
- `AiReviewStatus`

### 验收标准

- 有统一 AI service interface。
- 有 mock provider。
- 输出结构必须带 `evidence`。
- AI 内容默认是草稿。

### 不做什么

- 不读取真实 API key。
- 不调用真实 AI API。
- 不把 AI 输出直接发布。
- 不让 AI 生成排盘核心结果。

## Phase 11：奇门工具 UI

### 目标

建立奇门工具区的前端 UI，包括今日气机、专业排盘、一事择时、内容发布择时、未来 7 天择时、报告生成、排盘历史和复盘记录。

### 新增页面

- `/qimen`
- `/qimen/today`
- `/qimen/chart`
- `/qimen/timing`
- `/qimen/content-timing`
- `/qimen/next-7-days`
- `/qimen/reports`
- `/qimen/history`
- `/qimen/review`

### 新增组件

- `QimenToolHome`
- `QimenToolCard`
- `QimenInputForm`
- `QimenResultPanel`
- `ToolDisclaimer`

### 新增数据结构

- `QimenTool`
- `QimenInput`
- `QimenMockResult`
- `QimenHistoryItem`

### 验收标准

- 所有奇门工具页面可打开。
- 所有结果均为 mock。
- 所有工具页展示免责声明。
- 移动端表单可用。

### 不做什么

- 不实现真实排盘。
- 不生成真实择时结论。
- 不接用户真实历史数据库。

## Phase 12：奇门规则引擎 mock

### 目标

建立奇门规则引擎的 mock 层，明确未来真实算法的输入输出，不依赖 AI 随机生成盘面。

### 新增页面

无。

### 新增组件

无。

### 新增数据结构

- `QimenChartInput`
- `QimenChart`
- `QimenPalace`
- `QimenSymbol`
- `QimenRuleResult`
- `QimenRuleTrace`

### 验收标准

- mock 引擎输出稳定。
- 输入相同则结果相同。
- 输出包含规则说明和 trace。
- AI 不参与盘面生成。

### 不做什么

- 不写真实奇门算法。
- 不接历法库。
- 不输出绝对吉凶。
- 不把 mock 标成真实结果。

## Phase 13：一事择时

### 目标

建立一事择时的 mock 流程，帮助用户输入事项、目标、时间范围和限制条件，得到可复盘的建议格式。

### 新增页面

- `/qimen/timing`
- `/qimen/timing/result`

### 新增组件

- `TimingIntentForm`
- `TimingWindowPicker`
- `TimingMockResult`
- `TimingRiskNotice`
- `TimingReviewPrompt`

### 新增数据结构

- `TimingIntent`
- `TimingWindow`
- `TimingSuggestion`
- `TimingRisk`
- `TimingEvidence`

### 验收标准

- 可输入事项类型和时间范围。
- mock 结果使用“较适合、慎用、建议”表达。
- 显示免责声明。
- 结果可进入报告预览。

### 不做什么

- 不接真实奇门排盘。
- 不承诺结果必然有效。
- 不处理医学、法律、投资等高风险决策。

## Phase 14：报告生成

### 目标

建立报告预览 mock 版，用于把工具结果、资料证据、解释文本和行动建议组织成可分享的结构化报告。

### 新增页面

- `/reports`
- `/reports/[id]`
- `/qimen/reports/new`

### 新增组件

- `ReportPreview`
- `ReportSection`
- `EvidenceCitation`
- `ReportDisclaimer`
- `ReportExportMockButton`

### 新增数据结构

- `Report`
- `ReportSection`
- `ReportEvidence`
- `ReportStatus`
- `ReportAudience`

### 验收标准

- 可查看 mock 报告。
- 报告包含依据、分析、建议、注意事项和免责声明。
- 报告状态默认为草稿。
- 不提供未授权资料全文下载。

### 不做什么

- 不生成 PDF。
- 不接真实 AI 润色。
- 不输出绝对判断。
- 不做付费报告交付。

## Phase 15：八字学习系统

### 目标

建立八字学习系统的课程骨架、术语路径、案例入口和后续排盘工具预留。

### 新增页面

- `/subjects/bazi`
- `/subjects/bazi/lessons`
- `/subjects/bazi/cases`
- `/subjects/bazi/tools`

### 新增组件

- `BaziLearningMap`
- `BaziLessonCard`
- `BaziConceptGrid`
- `BaziCaseList`
- `BaziToolPlaceholder`

### 新增数据结构

- `BaziConcept`
- `BaziLesson`
- `BaziCaseStudy`
- `BaziToolPlaceholder`

### 验收标准

- 覆盖阴阳五行、天干地支、十神、月令、旺衰、格局、调候、用神、大运流年。
- 每个模块有学习目标。
- 案例为 mock。
- 明确后续预留八字排盘工具。

### 不做什么

- 不实现真实八字排盘。
- 不做个人命运断语。
- 不输出改命、暴富、保证类承诺。

## Phase 16：六爻学习系统

### 目标

建立六爻学习系统的问事路径、基础概念、案例学习和后续起卦工具预留。

### 新增页面

- `/subjects/liuyao`
- `/subjects/liuyao/lessons`
- `/subjects/liuyao/cases`
- `/subjects/liuyao/tools`

### 新增组件

- `LiuyaoLearningMap`
- `LiuyaoLessonCard`
- `LiuyaoQuestionFlow`
- `LiuyaoCaseList`
- `LiuyaoToolPlaceholder`

### 新增数据结构

- `LiuyaoConcept`
- `LiuyaoLesson`
- `LiuyaoCaseStudy`
- `LiuyaoQuestionType`

### 验收标准

- 覆盖起卦、装卦、六亲、六神、世应、用神、动爻变爻、月建日辰、冲合刑害、应期。
- 所有案例强调复盘。
- 保留后续六爻起卦工具入口。
- 展示免责声明。

### 不做什么

- 不实现真实起卦算法。
- 不自动断事。
- 不输出绝对应期。

## Phase 17：梅花易数学习系统

### 目标

建立梅花易数学习系统，覆盖象数、体用、动静、触机、断例和案例复盘。

### 新增页面

- `/subjects/meihua`
- `/subjects/meihua/lessons`
- `/subjects/meihua/cases`

### 新增组件

- `MeihuaLearningMap`
- `MeihuaLessonCard`
- `MeihuaImageNumberPanel`
- `MeihuaCaseList`

### 新增数据结构

- `MeihuaConcept`
- `MeihuaLesson`
- `MeihuaCaseStudy`
- `MeihuaTrigger`

### 验收标准

- 学习路径清楚。
- 案例均为 mock。
- 内容表达克制，不神秘化。
- 可关联术语库。

### 不做什么

- 不实现真实起卦工具。
- 不把触机解释成绝对预测。
- 不接 AI 自动断卦。

## Phase 18：我的书斋

### 目标

建立用户个人学习空间，集中展示阅读进度、笔记、收藏、报告、排盘记录和复盘记录。

### 新增页面

- `/me`
- `/me/progress`
- `/me/notes`
- `/me/favorites`
- `/me/reports`
- `/me/history`

### 新增组件

- `StudyProgressSummary`
- `MyNotesList`
- `FavoriteList`
- `MyReportList`
- `PracticeHistoryList`

### 新增数据结构

- `StudyProgress`
- `UserNote`
- `FavoriteItem`
- `UserReport`
- `PracticeHistory`

### 验收标准

- 页面使用 mock 用户数据。
- 可展示最近阅读、课程进度、笔记和报告。
- 移动端可用。
- 不要求登录即可预览 mock 状态。

### 不做什么

- 不接真实用户认证。
- 不保存真实个人数据。
- 不接云同步。

## Phase 19：会员和邀请码

### 目标

建立会员和邀请码的前端管理骨架，为后续课程权限、工具额度和私域转化预留。

### 新增页面

- `/member`
- `/admin/invites`
- `/admin/members`

### 新增组件

- `MembershipPlanCard`
- `InviteCodeTable`
- `MemberStatusBadge`
- `QuotaPreview`

### 新增数据结构

- `MembershipPlan`
- `InviteCode`
- `MemberProfile`
- `QuotaRule`

### 验收标准

- 可展示 mock 会员方案。
- 可展示 mock 邀请码列表。
- 权益文案合规，不承诺预测效果。
- 不影响免费阅读路径。

### 不做什么

- 不接支付。
- 不接真实订单。
- 不强制登录才能阅读公开内容。
- 不做分销系统。

## Phase 20：数据库接入

### 目标

把已验证的 mock 数据模型迁移到 Prisma 数据模型，逐步接入真实数据库。

### 新增页面

无，优先替换数据来源。

### 新增组件

无，除非需要加载态或空状态组件。

### 新增数据结构

- Prisma `SourceDocument`
- Prisma `SourceSegment`
- Prisma `Term`
- Prisma `KnowledgeUnit`
- Prisma `Lesson`
- Prisma `Quiz`
- Prisma `CaseStudy`
- Prisma `ToolRule`
- Prisma `Report`
- Prisma `StudyProgress`

### 验收标准

- 数据库 schema 覆盖核心平台对象。
- 现有 mock 页面可逐步切换到数据库读取。
- 上传资料默认私有。
- 发布状态和版权状态可审计。

### 不做什么

- 不一次性迁移全部页面。
- 不直接上 PostgreSQL 前破坏 SQLite 本地开发。
- 不删除现有 mock 数据。
- 不公开未授权资料。

## Phase 21：部署准备

### 目标

整理部署前检查项，确保构建、环境变量、静态资源、版权策略、后台入口和免责声明达到可上线预览标准。

### 新增页面

无。

### 新增组件

无。

### 新增数据结构

- `DeploymentChecklist`
- `EnvRequirement`
- `ReleaseRisk`

### 验收标准

- `lint` 通过。
- `typecheck` 通过。
- `build` 通过。
- 环境变量文档清楚。
- 未授权资料不进入公开页面。
- 免责声明在工具和报告页可见。

### 不做什么

- 不上线真实支付。
- 不上线真实 AI 整理。
- 不上线真实复杂算法。
- 不公开后台私有资料。
