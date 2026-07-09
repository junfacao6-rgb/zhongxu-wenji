# 问古书斋部署与手机演示说明

当前项目适合先作为 H5 原型分享。首页、藏书、课程、奇门 mock、邀请码 UI 已可用于演示；会员、邀请码、报告和数据库写入仍属于第一阶段 mock/占位。

## 推荐分享入口

公开演示入口：

```text
https://zhongxu-wenji.vercel.app/demo
```

演示页只收拢当前适合对外展示的路径：

- `/` 首页
- `/library` 藏书
- `/courses` 课程
- `/qimen` 奇门 mock
- `/invite` 邀请码 UI

测试邀请码：

```text
WENGU-TRIAL-7
WENGU-MONTH-30
WENGU-YEAR-365
WENGU-COURSE-180
```

## 当前阶段边界

- 页面主体可以给别人看原型。
- 数据库模型已经切到 Prisma + PostgreSQL，但不连接生产数据库。
- 线上演示仍以静态数据和 mock 数据为主。
- 不要把当前版本当作正式收费产品。
- 动态 API、真实会员、真实邀请码、报告持久化，需要接入托管 PostgreSQL 后再开放。

## 手机打不开时的处理

优先让对方复制链接到手机系统浏览器、Safari 或 Chrome，不要只在微信内置浏览器里打开。

如果 `.vercel.app` 在部分手机网络里不稳定，建议绑定正式域名到 Vercel。正式给外部用户长期查看时，不建议长期只发 `.vercel.app` 域名。

## 局域网临时预览

适合同一 Wi-Fi 下给身边人看手机版。

```powershell
cd D:\我的项目\命理小程序\zhongxu-wenji
$nodeDir = Join-Path (Get-Location) ".tools\node-v24.14.0-win-x64"
$env:Path = $nodeDir + ";" + $env:Path
npm run dev:lan
```

查看本机内网 IP：

```powershell
Get-NetIPAddress -AddressFamily IPv4 |
  Where-Object { $_.IPAddress -notlike "127.*" -and $_.PrefixOrigin -ne "WellKnown" } |
  Select-Object InterfaceAlias,IPAddress
```

把地址发给同 Wi-Fi 的手机：

```text
http://你的内网IP:3000/demo
```

注意：

- 必须使用 `http://`，不是 `https://`。
- 电脑必须保持开机和联网。
- Windows 网络如果是 Public，防火墙可能拦截手机访问本机端口。
- 如果被拦，需要用管理员权限允许 Node.js 或 TCP 3000 入站，仅限本地子网更安全。

## Vercel 部署

适合拿到公开链接。项目已经可以用 Vercel 部署 Next.js。

推荐配置：

```text
Framework Preset: Next.js
Build Command: npm run build
Output Directory: 默认
Install Command: 默认
Root Directory: zhongxu-wenji
```

第一阶段 mock 演示可以只提供可通过 Prisma generate 的占位环境变量：

```text
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/zhongxu_wenji_dev?schema=public"
INVITE_CODE="ZXWJ-TEST"
ADMIN_TOKEN="ZX-ADMIN-TEST"
APP_BASE_URL="https://你的域名"
```

说明：

- 这个 `DATABASE_URL` 只是占位，不是生产数据库。
- 如果开放动态 API，需要换成 Neon、Supabase、Vercel Postgres、腾讯云 PostgreSQL 等托管数据库。
- 不要把真实生产密钥写入 `.env.example`。

## 正式域名

稳定分享建议绑定自己的域名：

1. 在 Vercel Project 中进入 Settings -> Domains。
2. 添加域名，例如 `demo.your-domain.com`。
3. 按 Vercel 提示配置 DNS。
4. 等待 HTTPS 生效。
5. 把 `APP_BASE_URL` 改成正式域名。

绑定域名后，对外分享：

```text
https://你的域名/demo
```

## 上线前检查

每次对外发链接前至少检查：

```powershell
npx prisma generate
npm run lint
npm run build
```

重点页面：

- `/demo`
- `/`
- `/library`
- `/courses`
- `/qimen`
- `/invite`

检查项：

- 手机端无横向滚动。
- 首屏标题和按钮不被遮挡。
- 卡片和按钮触控区域足够大。
- 邀请码页面能用测试码显示 mock 结果。
- 奇门页面保留免责声明和 mock 边界。
- 后台页面不要作为第一阶段公开入口。

## 后续数据库路线

真实上线时再做：

- 托管 PostgreSQL
- Prisma migration
- 邀请码真实入库
- 会员状态真实保存
- 学习进度、收藏、笔记真实保存
- 报告生成依据持久化

在这些完成前，前台可以演示，不能按正式业务承诺交付。
