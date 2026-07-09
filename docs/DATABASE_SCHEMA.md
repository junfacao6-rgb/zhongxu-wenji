# 问古书斋数据库设计文档

> 当前文档是目标数据库设计说明，不接真实数据库，不修改 `prisma/schema.prisma`。
> 第一阶段仍以 mock 数据和静态 UI 为主；后续接数据库时，以本文作为建模、权限和审核边界参考。

## 设计原则

1. 所有上传资料默认不公开，`SourceDocument.visibility` 默认必须为 `private`。
2. `SourceSegment` 以及由片段生成的白话、注解、课程、练习、报告，必须保留 `evidenceRefs`。
3. 未授权资料不得设置为 `public`，不得公开全文，不得提供下载。
4. AI 生成内容必须有 `reviewStatus`，未审核前只能处于草稿或后台可见状态。
5. 报告必须保存生成依据，包括输入、规则版本、盘面、引用片段、生成 prompt 或规则 trace。
6. 所有工具和报告只作为传统文化学习与行动参考，不能输出医疗、法律、投资、婚恋等现实专业决策结论。

## 通用字段类型

| 类型 | 说明 |
| --- | --- |
| `String` | 短文本、ID、枚举值、标题、URL。 |
| `Text` | 长文本、正文、说明、分析内容。 |
| `Int` | 整数、排序、计数、分数。 |
| `Boolean` | 布尔值。 |
| `DateTime` | ISO 时间。 |
| `Json` | 结构化对象或数组，如 `evidenceRefs`、题目数组、盘面结构。 |
| `Enum<T>` | 固定枚举。实际落库可用字符串或数据库 enum。 |

## 通用枚举

| 枚举 | 值 |
| --- | --- |
| `Visibility` | `public`、`members`、`course`、`private`、`hidden` |
| `CopyrightStatus` | `public_domain`、`self_owned`、`authorized`、`excerpt_only`、`private_study`、`hidden` |
| `ReviewStatus` | `pending`、`needs_review`、`approved`、`rejected` |
| `PublishStatus` | `draft`、`reviewing`、`published`、`archived`、`rejected` |
| `SubjectKey` | `qimen`、`bazi`、`liuyao`、`meihua`、`dao`、`yixue` |
| `InviteType` | `trial`、`monthly`、`yearly`、`course` |
| `InviteStatus` | `active`、`used_up`、`expired`、`paused` |

## 通用 EvidenceRef

`evidenceRefs` 用 `Json` 保存数组，每条至少应支持：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `sourceDocumentId` | `String` | 来源资料 ID。 |
| `sourceFileId` | `String?` | 来源文件 ID。 |
| `sourceSegmentId` | `String?` | 来源片段 ID。 |
| `quoteId` | `String?` | 引用 ID。 |
| `pageStart` | `Int?` | 起始页。 |
| `pageEnd` | `Int?` | 结束页。 |
| `chapterTitle` | `String?` | 章节名。 |
| `quote` | `Text?` | 短摘原文，避免存整段未授权全文。 |
| `reason` | `Text?` | 为什么引用该证据。 |

## User

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `String` | 主键。 |
| `nickname` | `String` | 昵称。 |
| `avatarUrl` | `String?` | 头像。 |
| `phone` | `String?` | 手机号，敏感字段。 |
| `email` | `String?` | 邮箱，敏感字段。 |
| `role` | `Enum<guest,user,member,student,consultant,admin>` | 用户角色。 |
| `status` | `Enum<active,paused,banned,deleted>` | 账号状态。 |
| `createdAt` | `DateTime` | 创建时间。 |
| `updatedAt` | `DateTime` | 更新时间。 |

关联关系：
- `User` 1:n `Membership`、`UserNote`、`UserBookmark`、`StudyProgress`、`UserUpload`、`UserReport`。
- `User` 可拥有多条 `QimenTimingRecord` 和用户侧案例记录。

权限注意事项：
- 普通用户只能读写自己的个人资料、笔记、收藏、进度、上传和报告。
- 手机号、邮箱不进入公开接口和日志。
- 管理员查看用户数据需要后台权限，并记录审计日志。

## Membership

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `String` | 主键。 |
| `userId` | `String` | 关联用户。 |
| `plan` | `Enum<free,member,course,consultant,admin>` | 权益层级。 |
| `status` | `Enum<active,expired,paused,cancelled>` | 会员状态。 |
| `startedAt` | `DateTime` | 开始时间。 |
| `expiresAt` | `DateTime?` | 到期时间。 |
| `benefits` | `Json` | 权益清单。 |
| `sourceInviteCodeId` | `String?` | 来源邀请码。 |
| `qimenQuotaMonthly` | `Int` | 奇门工具月额度。 |
| `reportQuotaMonthly` | `Int` | 报告月额度。 |
| `createdAt` | `DateTime` | 创建时间。 |
| `updatedAt` | `DateTime` | 更新时间。 |

关联关系：
- n:1 `User`。
- n:1 `InviteCode` 可选，用于追踪开通来源。

权限注意事项：
- 用户只可读取自己的会员状态，不可自行写入。
- 会员状态变更必须由支付、邀请码验证或管理员动作产生。
- 后台手动调整会员必须记录操作者和原因。

## InviteCode

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `String` | 主键。 |
| `code` | `String` | 唯一邀请码。 |
| `type` | `Enum<trial,monthly,yearly,course>` | 邀请码类型。 |
| `plan` | `Enum<free,member,course>` | 兑换后的权益层级。 |
| `validDays` | `Int` | 兑换后有效天数。 |
| `maxUses` | `Int` | 最大使用次数。 |
| `usedCount` | `Int` | 已使用次数。 |
| `status` | `Enum<active,used_up,expired,paused>` | 状态。 |
| `expiresAt` | `DateTime?` | 邀请码本身过期时间。 |
| `createdByUserId` | `String?` | 创建管理员。 |
| `createdAt` | `DateTime` | 创建时间。 |
| `updatedAt` | `DateTime` | 更新时间。 |

关联关系：
- `InviteCode` 1:n `Membership`。
- `InviteCode.createdByUserId` n:1 `User`，仅管理员。

权限注意事项：
- 邀请码明文只在后台和兑换入口短暂展示，不应进入公开页面源码或日志。
- 生成、暂停、作废、批量导出都属于管理员操作。
- 兑换时必须原子更新 `usedCount`，避免并发超发。

## Book

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `String` | 主键。 |
| `title` | `String` | 书名。 |
| `subtitle` | `String?` | 副标题。 |
| `author` | `String?` | 作者。 |
| `dynasty` | `String?` | 朝代。 |
| `subject` | `Enum<SubjectKey>` | 学科。 |
| `category` | `String` | 分类。 |
| `coverUrl` | `String?` | 封面。 |
| `description` | `Text` | 简介。 |
| `difficulty` | `String` | 难度。 |
| `tags` | `Json` | 标签。 |
| `copyrightStatus` | `Enum<CopyrightStatus>` | 版权状态。 |
| `visibility` | `Enum<Visibility>` | 可见范围。 |
| `sourceDocumentId` | `String?` | 主要来源资料。 |
| `publishStatus` | `Enum<PublishStatus>` | 发布状态。 |
| `reviewStatus` | `Enum<ReviewStatus>` | 审核状态。 |
| `readCount` | `Int` | 阅读量。 |
| `createdAt` | `DateTime` | 创建时间。 |
| `updatedAt` | `DateTime` | 更新时间。 |

关联关系：
- `Book` 1:n `Chapter`。
- `Book` n:1 `SourceDocument` 可选。
- `Book` 可被 `UserBookmark` 收藏。

权限注意事项：
- `visibility=public` 仅允许 `public_domain`、`self_owned`、`authorized` 且审核通过的内容。
- 未授权资料关联的书只能隐藏、私密或短摘展示。
- 封面和简介也要避免复制未授权完整内容。

## Chapter

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `String` | 主键。 |
| `bookId` | `String` | 所属书籍。 |
| `title` | `String` | 章节标题。 |
| `order` | `Int` | 排序。 |
| `summary` | `Text?` | 章节摘要。 |
| `segmentIds` | `Json` | 关联片段 ID 列表。 |
| `visibility` | `Enum<Visibility>` | 可见范围。 |
| `reviewStatus` | `Enum<ReviewStatus>` | 审核状态。 |
| `createdAt` | `DateTime` | 创建时间。 |
| `updatedAt` | `DateTime` | 更新时间。 |

关联关系：
- n:1 `Book`。
- n:n `SourceSegment`，可通过中间表或 `segmentIds` 实现。

权限注意事项：
- 章节可见范围不得高于 `Book` 和来源资料的可见范围。
- 章节摘要若由 AI 生成，必须审核后发布。
- 未授权资料章节不展示全文。

## SourceDocument

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `String` | 主键。 |
| `title` | `String` | 资料标题。 |
| `subject` | `Enum<SubjectKey>` | 学科。 |
| `sourceType` | `Enum<classic,lecture,case,note,tool-rule,report-source,other>` | 来源类型。 |
| `copyrightStatus` | `Enum<CopyrightStatus>` | 版权状态。 |
| `visibility` | `Enum<Visibility>` | 可见范围，默认 `private`。 |
| `ownerUserId` | `String?` | 上传者或所属用户。 |
| `uploadStatus` | `String` | 上传状态。 |
| `processStatus` | `String` | 处理状态。 |
| `extractedTextStatus` | `String` | 文本抽取状态。 |
| `aiDraftStatus` | `String` | AI 草稿状态。 |
| `reviewStatus` | `Enum<ReviewStatus>` | 审核状态。 |
| `sourceNote` | `Text?` | 来源说明。 |
| `createdAt` | `DateTime` | 创建时间。 |
| `updatedAt` | `DateTime` | 更新时间。 |

关联关系：
- `SourceDocument` 1:n `SourceFile`、`SourceSegment`。
- `SourceDocument` 可关联 `Book`、`Course`、`CaseStudy`、`QimenReport`。
- n:1 `User` 可选，用于个人上传资料。

权限注意事项：
- 默认 `visibility=private`，任何导入流程不得自动公开。
- `copyrightStatus` 为 `private_study`、`excerpt_only`、`hidden` 时，不得设置 `public`。
- 进入公开阅读前必须通过管理员审核。

## SourceFile

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `String` | 主键。 |
| `documentId` | `String` | 所属资料。 |
| `fileName` | `String` | 原文件名。 |
| `fileType` | `String` | 文件类型。 |
| `storageKey` | `String` | 存储路径或对象 key。 |
| `fileUrl` | `String?` | 内部访问 URL。 |
| `sizeBytes` | `Int` | 文件大小。 |
| `checksum` | `String?` | 校验值。 |
| `mimeType` | `String?` | MIME 类型。 |
| `uploadedByUserId` | `String?` | 上传者。 |
| `uploadedAt` | `DateTime` | 上传时间。 |

关联关系：
- n:1 `SourceDocument`。
- n:1 `User` 可选。

权限注意事项：
- 原始文件默认不提供公开下载。
- 文件 URL 不应直接暴露真实存储私有路径。
- 删除或替换文件必须保留审计记录。

## SourceSegment

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `String` | 主键。 |
| `documentId` | `String` | 所属资料。 |
| `sourceFileId` | `String?` | 来源文件。 |
| `chapterTitle` | `String?` | 章节标题。 |
| `pageStart` | `Int?` | 起始页。 |
| `pageEnd` | `Int?` | 结束页。 |
| `order` | `Int` | 片段顺序。 |
| `originalText` | `Text` | 原文片段。 |
| `cleanedText` | `Text?` | 清洗文本。 |
| `modernTranslation` | `Text?` | 白话翻译。 |
| `notes` | `Json` | 注解数组。 |
| `tags` | `Json` | 标签。 |
| `evidenceRefs` | `Json` | 证据引用，生成内容必须保留。 |
| `reviewStatus` | `Enum<ReviewStatus>` | 审核状态。 |
| `createdAt` | `DateTime` | 创建时间。 |
| `updatedAt` | `DateTime` | 更新时间。 |

关联关系：
- n:1 `SourceDocument`。
- `SourceSegment` 1:n `Quote`、`Annotation`。
- 可被 `Term`、`KnowledgeUnit`、`LessonBlock`、`CaseStudy`、`QimenReport` 引用。

权限注意事项：
- `evidenceRefs` 是硬性必填，不能生成无来源的白话、注解、课程或报告。
- 未授权资料片段不得公开全文展示。
- AI 生成的 `cleanedText`、`modernTranslation`、`notes` 必须审核。

## Quote

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `String` | 主键。 |
| `sourceSegmentId` | `String` | 来源片段。 |
| `text` | `Text` | 短摘原文。 |
| `translation` | `Text?` | 白话翻译。 |
| `pageLabel` | `String?` | 页码说明。 |
| `evidenceRefs` | `Json` | 证据引用。 |
| `reviewStatus` | `Enum<ReviewStatus>` | 审核状态。 |
| `createdAt` | `DateTime` | 创建时间。 |
| `updatedAt` | `DateTime` | 更新时间。 |

关联关系：
- n:1 `SourceSegment`。
- 可被 `LessonBlock`、`Term`、`Annotation`、`QimenReport` 引用。

权限注意事项：
- `excerpt_only` 和未授权资料只允许短摘，不得拼接成全文。
- 翻译若由 AI 生成，需要审核。
- 公开引用必须带来源说明。

## Annotation

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `String` | 主键。 |
| `sourceSegmentId` | `String` | 来源片段。 |
| `type` | `Enum<term,translation,context,warning,case-link>` | 注解类型。 |
| `title` | `String` | 标题。 |
| `body` | `Text` | 注解正文。 |
| `termIds` | `Json` | 关联术语 ID。 |
| `evidenceRefs` | `Json` | 证据引用。 |
| `reviewStatus` | `Enum<ReviewStatus>` | 审核状态。 |
| `createdAt` | `DateTime` | 创建时间。 |
| `updatedAt` | `DateTime` | 更新时间。 |

关联关系：
- n:1 `SourceSegment`。
- n:n `Term`。

权限注意事项：
- 注解不能脱离原文证据单独发布为确定结论。
- AI 注解必须审核。
- 涉及操作性建议时应使用学习参考口径。

## Term

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `String` | 主键。 |
| `name` | `String` | 术语名。 |
| `subject` | `Enum<SubjectKey>` | 学科。 |
| `category` | `String` | 分类。 |
| `aliases` | `Json` | 别名。 |
| `originalExplanation` | `Text?` | 原典或传统解释。 |
| `plainExplanation` | `Text` | 白话解释。 |
| `advancedExplanation` | `Text?` | 进阶解释。 |
| `relatedTermIds` | `Json` | 关联术语。 |
| `relatedSources` | `Json` | 来源证据。 |
| `visibility` | `Enum<Visibility>` | 可见范围。 |
| `reviewStatus` | `Enum<ReviewStatus>` | 审核状态。 |
| `tags` | `Json` | 标签。 |
| `createdAt` | `DateTime` | 创建时间。 |
| `updatedAt` | `DateTime` | 更新时间。 |

关联关系：
- n:n `SourceSegment`、`KnowledgeUnit`、`Lesson`、`Flashcard`。
- 可被 `UserBookmark` 收藏。

权限注意事项：
- 高级术语可设为 `members` 或 `course`。
- AI 生成解释必须保留来源并审核。
- 术语解释不得作为现实断事承诺。

## KnowledgeUnit

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `String` | 主键。 |
| `subject` | `Enum<SubjectKey>` | 学科。 |
| `title` | `String` | 知识点标题。 |
| `summary` | `Text` | 摘要。 |
| `level` | `String` | 难度。 |
| `sourceSegmentIds` | `Json` | 来源片段。 |
| `termIds` | `Json` | 关联术语。 |
| `lessonIds` | `Json` | 关联课时。 |
| `evidenceRefs` | `Json` | 证据引用。 |
| `visibility` | `Enum<Visibility>` | 可见范围。 |
| `reviewStatus` | `Enum<ReviewStatus>` | 审核状态。 |
| `createdAt` | `DateTime` | 创建时间。 |
| `updatedAt` | `DateTime` | 更新时间。 |

关联关系：
- n:n `SourceSegment`、`Term`、`Lesson`。
- 可被 `CaseStudy` 和 `Quiz` 引用。

权限注意事项：
- AI 生成知识点必须审核。
- 公开知识点引用的资料必须允许公开。
- 来源不完整时只能保留为后台草稿。

## Course

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `String` | 主键。 |
| `subject` | `Enum<SubjectKey>` | 学科。 |
| `title` | `String` | 课程名。 |
| `subtitle` | `String?` | 副标题。 |
| `description` | `Text` | 课程说明。 |
| `difficulty` | `String` | 难度。 |
| `visibility` | `Enum<Visibility>` | 可见范围。 |
| `publishStatus` | `Enum<PublishStatus>` | 发布状态。 |
| `reviewStatus` | `Enum<ReviewStatus>` | 审核状态。 |
| `sourceDocumentIds` | `Json` | 课程来源资料。 |
| `createdAt` | `DateTime` | 创建时间。 |
| `updatedAt` | `DateTime` | 更新时间。 |

关联关系：
- `Course` 1:n `Module`、`Lesson`。
- `Course` 1:n `StudyProgress`。
- 可关联多个 `SourceDocument`。

权限注意事项：
- 课程可见范围由版权、会员权益和审核状态共同决定。
- AI 课程草稿不得直接发布。
- 未授权资料只能做后台索引、摘要或私密课程草稿。

## Module

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `String` | 主键。 |
| `courseId` | `String` | 所属课程。 |
| `title` | `String` | 模块标题。 |
| `summary` | `Text?` | 模块说明。 |
| `order` | `Int` | 排序。 |
| `visibility` | `Enum<Visibility>` | 可见范围。 |
| `createdAt` | `DateTime` | 创建时间。 |
| `updatedAt` | `DateTime` | 更新时间。 |

关联关系：
- n:1 `Course`。
- `Module` 1:n `Lesson`。

权限注意事项：
- 模块可见范围不得高于课程可见范围。
- 模块摘要若 AI 生成，需要审核后随课程发布。
- 课程学员专属模块使用 `course` 可见范围。

## Lesson

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `String` | 主键。 |
| `courseId` | `String` | 所属课程。 |
| `moduleId` | `String?` | 所属模块。 |
| `subject` | `Enum<SubjectKey>` | 学科。 |
| `title` | `String` | 课时标题。 |
| `summary` | `Text` | 课时摘要。 |
| `order` | `Int` | 排序。 |
| `estimatedMinutes` | `Int` | 预计学习时间。 |
| `visibility` | `Enum<Visibility>` | 可见范围。 |
| `publishStatus` | `Enum<PublishStatus>` | 发布状态。 |
| `reviewStatus` | `Enum<ReviewStatus>` | 审核状态。 |
| `knowledgeUnitIds` | `Json` | 关联知识点。 |
| `createdAt` | `DateTime` | 创建时间。 |
| `updatedAt` | `DateTime` | 更新时间。 |

关联关系：
- n:1 `Course`、n:1 `Module`。
- `Lesson` 1:n `LessonBlock`、`Quiz`。
- `Lesson` 1:n `StudyProgress` 可选。

权限注意事项：
- 课时发布必须审核通过。
- 引用资料的权限决定课时可见范围。
- 课程用户专属课时不得公开。

## LessonBlock

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `String` | 主键。 |
| `lessonId` | `String` | 所属课时。 |
| `type` | `Enum<text,quote,translation,image,diagram,table,term-list,quiz,case,tool-link,note>` | 内容块类型。 |
| `title` | `String?` | 标题。 |
| `body` | `Text?` | 正文。 |
| `payload` | `Json` | 类型相关数据。 |
| `order` | `Int` | 排序。 |
| `evidenceRefs` | `Json` | 证据引用。引用/翻译/案例类必填。 |
| `reviewStatus` | `Enum<ReviewStatus>` | 审核状态。 |
| `createdAt` | `DateTime` | 创建时间。 |
| `updatedAt` | `DateTime` | 更新时间。 |

关联关系：
- n:1 `Lesson`。
- 可引用 `Quote`、`Term`、`Quiz`、`CaseStudy`、`SourceSegment`。

权限注意事项：
- AI 生成块必须审核。
- 原文引用块必须保留 `evidenceRefs`。
- 未授权资料不得通过多个 block 拼成全文公开。

## Quiz

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `String` | 主键。 |
| `lessonId` | `String` | 所属课时。 |
| `title` | `String` | 测验标题。 |
| `questions` | `Json` | 题目数组。 |
| `passingScore` | `Int` | 通过分数。 |
| `evidenceRefs` | `Json` | 题目来源。 |
| `reviewStatus` | `Enum<ReviewStatus>` | 审核状态。 |
| `createdAt` | `DateTime` | 创建时间。 |
| `updatedAt` | `DateTime` | 更新时间。 |

关联关系：
- n:1 `Lesson`。
- 可关联 `KnowledgeUnit`、`Term`、`SourceSegment`。

权限注意事项：
- AI 生成题目必须审核。
- 题目解释必须保留 evidence。
- 题目不能泄露未授权原文长段落。

## Flashcard

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `String` | 主键。 |
| `subject` | `Enum<SubjectKey>` | 学科。 |
| `front` | `Text` | 正面。 |
| `back` | `Text` | 背面。 |
| `termIds` | `Json` | 关联术语。 |
| `knowledgeUnitIds` | `Json` | 关联知识点。 |
| `evidenceRefs` | `Json` | 来源证据。 |
| `visibility` | `Enum<Visibility>` | 可见范围。 |
| `reviewStatus` | `Enum<ReviewStatus>` | 审核状态。 |
| `createdAt` | `DateTime` | 创建时间。 |
| `updatedAt` | `DateTime` | 更新时间。 |

关联关系：
- n:n `Term`、`KnowledgeUnit`。
- 可被课程复习系统引用。

权限注意事项：
- AI 卡片必须审核。
- 背面解释不得脱离来源。
- 高级卡片可设为会员或课程可见。

## CaseStudy

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `String` | 主键。 |
| `subject` | `Enum<SubjectKey>` | 学科。 |
| `title` | `String` | 案例标题。 |
| `caseType` | `String` | 案例类型。 |
| `summary` | `Text` | 案例摘要。 |
| `background` | `Text?` | 背景，需脱敏。 |
| `analysisSteps` | `Json` | 分析步骤。 |
| `reviewQuestions` | `Json` | 复盘问题。 |
| `sourceSegmentIds` | `Json` | 来源片段。 |
| `termIds` | `Json` | 关联术语。 |
| `evidenceRefs` | `Json` | 证据引用。 |
| `visibility` | `Enum<Visibility>` | 可见范围。 |
| `reviewStatus` | `Enum<ReviewStatus>` | 审核状态。 |
| `createdAt` | `DateTime` | 创建时间。 |
| `updatedAt` | `DateTime` | 更新时间。 |

关联关系：
- 可关联 `LessonBlock`、`KnowledgeUnit`、`Term`、`SourceSegment`。
- 学科专用案例表可作为其扩展表。

权限注意事项：
- 真实案例必须脱敏。
- AI 整理案例必须审核。
- 不输出绝对结论，不暴露个人隐私。

## QimenChart

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `String` | 主键。 |
| `userId` | `String?` | 创建用户。 |
| `title` | `String` | 盘名。 |
| `chartTime` | `DateTime` | 起盘时间。 |
| `question` | `Text?` | 所问事项。 |
| `juType` | `Enum<阳遁,阴遁>` | 局类型。 |
| `juNumber` | `Int` | 局数。 |
| `dutyStar` | `String` | 值符或值星。 |
| `dutyDoor` | `String` | 值使门。 |
| `palaces` | `Json` | 九宫结构。 |
| `ruleVersion` | `String` | 排盘规则版本。 |
| `inputSnapshot` | `Json` | 输入快照。 |
| `disclaimer` | `Text` | 免责声明。 |
| `createdAt` | `DateTime` | 创建时间。 |

关联关系：
- n:1 `User` 可选。
- `QimenChart` 1:n `QimenReport`、`QimenTimingRecord`。

权限注意事项：
- 用户只能看自己的盘或公开教学盘。
- 排盘算法必须来自明确规则引擎，不由 AI 随机生成。
- 输入和盘面快照应保存，便于复盘。

## QimenReport

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `String` | 主键。 |
| `userId` | `String?` | 所属用户。 |
| `chartId` | `String?` | 来源盘。 |
| `timingRecordId` | `String?` | 来源择时记录。 |
| `title` | `String` | 报告标题。 |
| `summary` | `Text` | 摘要。 |
| `sections` | `Json` | 报告章节，每节含 evidenceRefs。 |
| `generationBasis` | `Json` | 生成依据，必须保存。 |
| `promptSnapshot` | `Text?` | 生成 prompt 快照。 |
| `ruleTrace` | `Json` | 规则命中记录。 |
| `visibility` | `Enum<Visibility>` | 可见范围。 |
| `status` | `Enum<draft,ready,archived>` | 报告状态。 |
| `reviewStatus` | `Enum<ReviewStatus>` | 审核状态。 |
| `disclaimer` | `Text` | 免责声明。 |
| `createdAt` | `DateTime` | 创建时间。 |
| `updatedAt` | `DateTime` | 更新时间。 |

关联关系：
- n:1 `User` 可选。
- n:1 `QimenChart` 可选。
- n:1 `QimenTimingRecord` 可选。
- 可引用 `SourceSegment`、`QimenEventRule`。

权限注意事项：
- 报告必须保存生成依据，不允许只存成品文本。
- AI 润色报告必须有 `reviewStatus`。
- 用户报告默认 `private`，公开前必须脱敏并审核。

## QimenEventRule

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `String` | 主键。 |
| `eventType` | `String` | 事件类型。 |
| `title` | `String` | 规则名。 |
| `description` | `Text` | 规则说明。 |
| `suitablePatterns` | `Json` | 适合格局。 |
| `cautionPatterns` | `Json` | 慎用格局。 |
| `scoringConfig` | `Json` | 评分配置。 |
| `evidenceRefs` | `Json` | 规则来源证据。 |
| `version` | `String` | 版本号。 |
| `isActive` | `Boolean` | 是否启用。 |
| `reviewStatus` | `Enum<ReviewStatus>` | 审核状态。 |
| `createdAt` | `DateTime` | 创建时间。 |
| `updatedAt` | `DateTime` | 更新时间。 |

关联关系：
- `QimenEventRule` 1:n `QimenTimingRecord`。
- 可引用 `SourceSegment`、`KnowledgeUnit`。

权限注意事项：
- 规则变更必须审核和版本化。
- 未审核规则不得参与正式报告。
- 规则说明使用参考口径，避免绝对承诺。

## QimenTimingRecord

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `String` | 主键。 |
| `userId` | `String` | 所属用户。 |
| `chartId` | `String?` | 关联盘。 |
| `eventRuleId` | `String?` | 命中规则。 |
| `eventType` | `String` | 事件类型。 |
| `eventName` | `String` | 具体事项。 |
| `targetDate` | `DateTime` | 目标日期。 |
| `timeRange` | `String` | 候选时间范围。 |
| `suggestedTime` | `String` | 推荐时间。 |
| `level` | `Enum<较适合,可参考,慎用>` | 建议等级。 |
| `reasons` | `Json` | 理由。 |
| `cautions` | `Json` | 注意事项。 |
| `evidenceRefs` | `Json` | 证据引用。 |
| `ruleTrace` | `Json` | 规则命中记录。 |
| `disclaimer` | `Text` | 免责声明。 |
| `createdAt` | `DateTime` | 创建时间。 |

关联关系：
- n:1 `User`。
- n:1 `QimenChart` 可选。
- n:1 `QimenEventRule` 可选。
- `QimenTimingRecord` 可生成 `QimenReport`。

权限注意事项：
- 用户只能查看自己的择时记录。
- 记录不得作为现实保证，只能保存参考建议。
- 未来 7 天择时可先作为占位记录，仍需规则依据。

## BaziCase

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `String` | 主键。 |
| `title` | `String` | 案例标题。 |
| `topic` | `String` | 主题。 |
| `pillarsLabel` | `String?` | 四柱标签，教学用。 |
| `chartPayload` | `Json?` | 八字盘结构。 |
| `structureHint` | `Text?` | 结构提示。 |
| `learningFocus` | `Json` | 学习重点。 |
| `analysisSteps` | `Json` | 分析步骤。 |
| `reviewQuestions` | `Json` | 复盘问题。 |
| `scopeNote` | `Text` | 边界说明。 |
| `sourceSegmentIds` | `Json` | 来源片段。 |
| `termIds` | `Json` | 关联术语。 |
| `evidenceRefs` | `Json` | 证据引用。 |
| `visibility` | `Enum<Visibility>` | 可见范围。 |
| `reviewStatus` | `Enum<ReviewStatus>` | 审核状态。 |
| `createdAt` | `DateTime` | 创建时间。 |
| `updatedAt` | `DateTime` | 更新时间。 |

关联关系：
- 可关联通用 `CaseStudy`。
- n:n `Term`、`SourceSegment`、`KnowledgeUnit`。

权限注意事项：
- 八字案例必须脱敏。
- 不输出确定性人生结论。
- AI 分析步骤必须审核并保留 evidence。

## LiuyaoCase

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `String` | 主键。 |
| `title` | `String` | 案例标题。 |
| `questionType` | `String` | 问题类型。 |
| `question` | `Text` | 问题文本，需脱敏。 |
| `hexagramPayload` | `Json` | 六爻卦结构。 |
| `yongshenAnalysis` | `Json` | 用神分析。 |
| `movingLineAnalysis` | `Json` | 动爻分析。 |
| `learningFocus` | `Json` | 学习重点。 |
| `resultReview` | `Text?` | 结果复盘。 |
| `scopeNote` | `Text` | 边界说明。 |
| `sourceSegmentIds` | `Json` | 来源片段。 |
| `termIds` | `Json` | 关联术语。 |
| `evidenceRefs` | `Json` | 证据引用。 |
| `visibility` | `Enum<Visibility>` | 可见范围。 |
| `reviewStatus` | `Enum<ReviewStatus>` | 审核状态。 |
| `createdAt` | `DateTime` | 创建时间。 |
| `updatedAt` | `DateTime` | 更新时间。 |

关联关系：
- 可关联通用 `CaseStudy`。
- n:n `Term`、`SourceSegment`、`KnowledgeUnit`。

权限注意事项：
- 真实问事案例必须脱敏。
- 六爻案例强调取用、条件、复盘，不输出武断结论。
- AI 生成分析必须审核。

## MeihuaCase

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `String` | 主键。 |
| `title` | `String` | 案例标题。 |
| `triggerContext` | `Text` | 触机背景，需脱敏。 |
| `guaPayload` | `Json` | 卦象结构。 |
| `tiYongAnalysis` | `Json` | 体用分析。 |
| `imageNumberAnalysis` | `Json?` | 象数分析。 |
| `learningFocus` | `Json` | 学习重点。 |
| `resultReview` | `Text?` | 复盘。 |
| `scopeNote` | `Text` | 边界说明。 |
| `sourceSegmentIds` | `Json` | 来源片段。 |
| `termIds` | `Json` | 关联术语。 |
| `evidenceRefs` | `Json` | 证据引用。 |
| `visibility` | `Enum<Visibility>` | 可见范围。 |
| `reviewStatus` | `Enum<ReviewStatus>` | 审核状态。 |
| `createdAt` | `DateTime` | 创建时间。 |
| `updatedAt` | `DateTime` | 更新时间。 |

关联关系：
- 可关联通用 `CaseStudy`。
- n:n `Term`、`SourceSegment`、`KnowledgeUnit`。

权限注意事项：
- 触机背景和人物信息必须脱敏。
- 不将案例包装为必然预测。
- AI 整理必须审核并保留来源。

## UserNote

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `String` | 主键。 |
| `userId` | `String` | 所属用户。 |
| `title` | `String` | 笔记标题。 |
| `body` | `Text` | 笔记正文。 |
| `noteType` | `Enum<reading,course,chart,case,general>` | 笔记类型。 |
| `sourceSegmentId` | `String?` | 来源片段。 |
| `lessonId` | `String?` | 来源课时。 |
| `termId` | `String?` | 来源术语。 |
| `chartId` | `String?` | 来源盘。 |
| `tags` | `Json` | 标签。 |
| `visibility` | `Enum<private,hidden>` | 用户笔记默认私密。 |
| `createdAt` | `DateTime` | 创建时间。 |
| `updatedAt` | `DateTime` | 更新时间。 |

关联关系：
- n:1 `User`。
- 可关联 `SourceSegment`、`Lesson`、`Term`、`QimenChart`。

权限注意事项：
- 默认仅本人可见。
- 不允许其他用户读取。
- 若后续支持分享，必须显式授权并过滤隐私信息。

## UserBookmark

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `String` | 主键。 |
| `userId` | `String` | 所属用户。 |
| `targetType` | `Enum<book,chapter,segment,term,lesson,course,report,case>` | 收藏对象类型。 |
| `targetId` | `String` | 收藏对象 ID。 |
| `title` | `String` | 收藏标题快照。 |
| `createdAt` | `DateTime` | 创建时间。 |

关联关系：
- n:1 `User`。
- 多态关联到 `Book`、`Chapter`、`SourceSegment`、`Term`、`Lesson`、`Course`、`UserReport`、`CaseStudy`。

权限注意事项：
- 用户只能管理自己的收藏。
- 收藏项读取时仍需校验目标内容权限。
- 目标内容被隐藏或撤回后，收藏入口也应不可见。

## StudyProgress

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `String` | 主键。 |
| `userId` | `String` | 所属用户。 |
| `courseId` | `String?` | 课程。 |
| `moduleId` | `String?` | 模块。 |
| `lessonId` | `String?` | 课时。 |
| `subject` | `Enum<SubjectKey>?` | 学科。 |
| `progressPercent` | `Int` | 进度百分比。 |
| `completedLessonIds` | `Json` | 已完成课时。 |
| `quizScores` | `Json` | 测验成绩。 |
| `lastStudiedAt` | `DateTime` | 最近学习时间。 |
| `createdAt` | `DateTime` | 创建时间。 |
| `updatedAt` | `DateTime` | 更新时间。 |

关联关系：
- n:1 `User`。
- n:1 `Course`、`Module`、`Lesson` 可选。

权限注意事项：
- 用户只能读取自己的学习进度。
- 后台统计只能使用脱敏聚合数据。
- 课程权限过期后，保留进度但限制访问付费内容。

## UserUpload

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `String` | 主键。 |
| `userId` | `String` | 上传用户。 |
| `title` | `String` | 上传标题。 |
| `fileName` | `String` | 文件名。 |
| `fileType` | `String` | 文件类型。 |
| `sourceDocumentId` | `String?` | 关联资料。 |
| `copyrightStatus` | `Enum<CopyrightStatus>` | 版权状态。 |
| `visibility` | `Enum<Visibility>` | 默认 `private`。 |
| `uploadStatus` | `String` | 上传状态。 |
| `processStatus` | `String` | 处理状态。 |
| `note` | `Text?` | 用户说明。 |
| `createdAt` | `DateTime` | 创建时间。 |

关联关系：
- n:1 `User`。
- 1:1 或 n:1 `SourceDocument`。

权限注意事项：
- 用户上传默认私密。
- 未经用户和管理员确认不得公开。
- 私人资料不得进入公开训练、公开阅读或下载入口。

## UserReport

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `String` | 主键。 |
| `userId` | `String` | 所属用户。 |
| `title` | `String` | 报告标题。 |
| `reportType` | `Enum<qimen,bazi,liuyao,learning,general>` | 报告类型。 |
| `status` | `Enum<draft,ready,archived>` | 报告状态。 |
| `visibility` | `Enum<Visibility>` | 默认 `private`。 |
| `reportId` | `String?` | 关联具体报告，如 `QimenReport`。 |
| `summary` | `Text?` | 摘要。 |
| `generationBasis` | `Json` | 生成依据，必须保存。 |
| `evidenceRefs` | `Json` | 来源证据。 |
| `reviewStatus` | `Enum<ReviewStatus>` | 审核状态。 |
| `createdAt` | `DateTime` | 创建时间。 |
| `updatedAt` | `DateTime` | 更新时间。 |

关联关系：
- n:1 `User`。
- 可关联 `QimenReport`，后续可扩展 `BaziReport`、`LiuyaoReport`。

权限注意事项：
- 用户报告默认私密。
- 报告必须保存生成依据，不允许只存最终文案。
- AI 生成或润色内容必须审核；公开分享前必须脱敏。
