# 问古书斋：第一批古籍与原书阅读器

## 选书原则

- 只选知名度高、古籍属性明确、适合安静阅读的文本。
- 第一批控制在十本左右，避免把本地资料库批量倾倒到前台。
- 优先选择 PDF 或 TXT，暂不接入 DOC/DOCX 作为前台原书。
- 敏感民俗、符咒、现代讲义、营销型资料暂不进入第一批。

## 当前第一批馆藏

1. 《子平真诠》：`/classics/ziping-zhenquan-benyi.pdf`
2. 《三命通会》：`/classics/sanming-tonghui-classic.pdf`
3. 《原注滴天髓》：`/classics/yuanzhu-ditiansui.pdf`
4. 《渊海子平》：`/classics/yuanhai-ziping.pdf`
5. 《黄金策》：`/classics/huangjin-ce.pdf`
6. 《卜筮正宗》：`/classics/bushi-zhengzong.txt`
7. 《梅花易数》：`/classics/meihua-yishu.txt`
8. 《奇门遁甲》明朝真本：`/classics/qimen-mingcha-zhenben.pdf`
9. 《大六壬指南》：`/classics/daliuren-zhinan.pdf`
10. 《道德经》：`/classics/daodejing.txt`
11. 《庄子》：`/classics/zhuangzi.txt`

## NYPL Web Reader 接入方式

- `@nypl/web-reader` 已作为 PDF 原书阅读内核引入，保持 MIT 许可来源。
- 外层仍使用问古书斋自己的阅读页和纸感 UI，不使用第三方默认页面风格替换整站。
- PDF 原书页为 `/library/[id]/source`。
- Webpub manifest 由 `/api/library/[id]/manifest` 动态生成。
- TXT 底本暂不走 NYPL，继续使用本站简洁入口；后续可转为章节化正文。

## 原书影像与提取文字

- `/library/[id]/source` 已支持 `原书影像` / `提取文字` 两种模式切换。
- 提取文字统一放在 `public/classics/extracted/`。
- 已生成可读提取文字：`子平真诠`、`三命通会`、`卜筮正宗`、`梅花易数`、`大六壬指南`、`道德经`、`庄子`。
- 当前需要 OCR：`原注滴天髓`、`渊海子平`、`黄金策`、`奇门遁甲`。这些 PDF 已有原书影像，但没有可直接提取的文字层。

## 依赖边界

- NYPL Web Reader 当前 peer dependency 标注 React 18，本项目是 React 19。已通过 `pnpm run lint` 和 `pnpm run build`，但后续升级依赖时需要重点回归 `/library/[id]/source`。
- `canvas` 是传递依赖里的 Node 原生构建项，当前浏览器 PDF 阅读不需要它，已在 `pnpm-workspace.yaml` 中明确禁止构建。
