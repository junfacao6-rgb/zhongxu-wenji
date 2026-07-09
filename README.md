# 中虚书斋

传统术数知识库网站 MVP。当前版本重点是先把「首页、书架、学习、图解、工具、文章」做成可本地运行、可手机访问、可部署分享的 H5 站点。

## 项目定位

中虚书斋不是普通 SaaS 官网，而是面向八字、六爻、奇门与传统文化学习者的知识库网站。

当前模块：

- 首页：品牌入口、统计、书籍/文章/工具概览
- 书架：八字、六爻、奇门、古籍导读等资料卡片
- 学习：分阶段学习路线
- 图解：五行、十天干、十二地支、十神等图解入口
- 工具：五行生克、十神速查、干支信息查询
- 文章：主题文章列表与详情页

第一阶段不做登录、支付、论坛和复杂后台。内容先使用本地数据，后续再逐步接数据库和管理系统。

## 技术栈

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma + SQLite（为后续后台/会员保留）
- 本地 JSON / TS 常量作为第一阶段内容源

## 目录约定

- `src/app`：页面路由
- `src/components/site`：站点页面组件
- `src/data/site-content.json`：首页、文章、图解、工具、学习路径的示例内容
- `src/data/books.ts`：书架数据
- `src/data/diagrams.ts`：图解模块数据
- `src/data/tools.ts`：工具模块本地查询数据和计算逻辑
- `content/articles`：后续 Markdown/MDX 文章内容目录
- `PROJECT_RULES.md`：产品与研发约束
- `DEPLOY.md`：部署和分享说明

## 本地运行

项目自带 Windows Node 运行时：

```powershell
cd D:\我的项目\命理小程序\zhongxu-wenji
$env:Path = (Join-Path (Get-Location) ".tools\node-v24.14.0-win-x64") + ";" + $env:Path
```

安装依赖：

```powershell
npm install
```

启动开发服务：

```powershell
npm run dev
```

默认访问：

```text
http://127.0.0.1:3000
```

## 给别人临时看

同一个 Wi-Fi 下，用局域网模式启动：

```powershell
npm run dev:lan
```

然后把本机内网 IP 发给对方，例如：

```text
http://192.168.1.23:3000
```

注意：

- 手机和电脑必须在同一个 Wi-Fi。
- 电脑不能休眠或断网。
- 如果打不开，优先检查 Windows 防火墙是否允许 Node.js 访问专用网络。

## 构建检查

上线或分享前执行：

```powershell
npm run deploy:check
```

该命令会生成 Prisma Client 并执行 Next.js 生产构建。

## 生产启动

先构建：

```powershell
npm run deploy:check
```

再启动：

```powershell
npm run start
```

如果使用 standalone 部署，需要确保 `.next/static` 和 `public` 一起带到运行目录；详见 `DEPLOY.md`。

## 页面清单

- `/`
- `/library`
- `/library/[id]`
- `/learn`
- `/diagrams`
- `/diagrams/wuxing`
- `/tools`
- `/articles`
- `/articles/[slug]`

## 当前交付状态

- 第一阶段页面已具备静态内容。
- `/tools` 已完成五行生克、十神速查、干支信息查询。
- 所有工具使用前端本地数据，不接后端。
- 后续重点应是移动端细节、内容系统、部署上线和真实资料接入。
