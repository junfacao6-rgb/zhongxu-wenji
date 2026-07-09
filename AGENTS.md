# Prototype Instructions

Run the local server yourself and open the preview in the in-app browser. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Current homepage direction: build a fan-facing reading platform for books uploaded by the site owner, not a generic traditional-culture landing page. The preferred style is "墨阁纸书": dark archive atmosphere for the shell, warm paper cards for readable content, real book-room imagery for depth, clear collection index, search entry, continue-reading state, book cards, upload roadmap, and library grouping for 八字、六爻、奇门、方法工具. Preserve existing features, but public homepage and library should prioritize finding books, previewing books, and continuing reading before adding upload/login/payment/backend complexity.

2026-07-04 visual reference update: the user asked to apply the style of haoqi.design to this reading site. Treat it as a content-remix reference, not a brand copy: strict engineering grid, pale glass/sky-blue surfaces, black oversized headline, small monospace HUD labels, dotted/line borders, coordinate/status readouts, luminous glass-scroll imagery, and a restrained neon accent. Keep the product identity as a fan-facing Chinese book reading platform.

2026-07-04 style-principles pass: on the public homepage, reader actions outrank decorative reference imagery. Keep search, starter books, and continue-reading ahead of the glass-scroll visual; use the glass object as supporting identity, not the primary task.

2026-07-04 reading-IA pass: public navigation should present the site as a reading platform first. Keep `书架` first, followed by `文章` and `学习`, with `地图`/`图解`/`工具` as supporting routes. The persistent CTA should say `开始阅读`.

2026-07-04 warm-reading-room pass: the current stronger style candidate is a warm digital reading room, not a cold blue engineering surface. Keep haoqi's grid/glass/HUD language, but use mixed ink, jade, copper, pale green glass, and warm paper panels for lower reading fatigue. Do not reintroduce saturated blue as the dominant page atmosphere.

2026-07-04 detail-reading pass: book detail pages must use the same warm digital reading-room system as the homepage and library. The first real reading path is `/library/bazi-geju`: keep the book cover, reading entry, guide panels, table of contents, and source boundary inside the shared grid/glass/HUD language; do not let detail pages fall back to default dark-nav/plain-text styling. Real PDF/TXT reading can be enabled later after uploads are approved.

2026-07-04 style-approval status rule: before the user uploads real books, do not present missing-source books as if the original reading file is already live. Use `样式预览`, `预览这一册`, and `上传后开放阅读` for books without `sourceFile`; reserve `打开原书` / true reading language for books with an actual PDF/TXT source.

Ancient-book import rule: when using the user's local古籍资料, only select one well-known representative book per source type at first. Keep the first batch small, readable, and grouped as "古籍样本"; prefer directly readable PDF/TXT files, avoid bulk dumping large folders, and treat sensitive民俗/符籙 materials as historical documents rather than operational guidance.

2026-07-04 naming lock: the public reading platform name is `观复书阁`, from《道德经》“万物并作，吾以观复”. Do not use `中虚` as the public site name or visible brand wording for this reading platform. Existing internal storage keys, code symbols, and asset filenames may keep legacy `zhongxu` prefixes for compatibility unless a migration is explicitly requested.

2026-07-04 rejected visual direction: the user said the warm paper reading-library style was not good. Do not continue that direction as the current answer.

2026-07-04 GitHub reader-app direction: search GitHub first for comparable open-source reading/library products and borrow visual DNA rather than license-risk code. Current reference mix: ThinkRead-style simple upload/search/bookshelf flow, Readest-style app sidebar/reader controls, and ShelfHaven only as a functional bookshelf/upload reference. Keep the public name `观复书阁`; avoid visible `中虚` wording.

2026-07-04 youthful redesign request: the user rejected the GitHub reader-app visual as still unattractive and asked for a younger aesthetic. New direction should be a light content-product interface: bright neutral background, compact bento layout, vivid but controlled coral/lime/mint accents, colorful digital book-list covers, sans-serif UI, mobile-first scanning, and no large heavy dark archive banners.

2026-07-04 premium color correction: the user said the youthful version was better but too bright and lacked premium feel. Keep the lighter content-product layout, but reduce saturation heavily: use graphite, sage, clay, muted indigo, warm off-white, quieter gradients, and restrained accent color. Avoid candy coral/lime/electric-blue as large surfaces.

2026-07-04 typography/order correction: the user said typography and layout still looked ugly. Current direction is compact, clean, premium, and slightly mystical: smaller fixed heading sizes, refined Chinese font stack, no viewport-scaled giant display type, no negative letter spacing, tighter grid rhythm, 8px-or-less cards, low-saturation ink/sage/clay/indigo palette, and subtle fine-line atmosphere instead of loud gradients or oversized blocks.

2026-07-05 positioning reset: the public platform is now `问古书斋` with subtitle `一处安静读古籍的地方`. Current stage has only one frontstage function: ancient-book reading. Hide/remove frontstage upload, membership, purchase, consulting, learning paths, admin, dashboards, toolboxes, article publishing, cumulative stats, recent content, and future-upload messaging. The frontstage should be a mobile-first H5 reading site: home, library, categories, reading records, book detail, and `/library/[id]/read`. Visual direction is quiet, restrained, rice-white/paper-white/light-ink/deep-brown/ink-black, with bookish catalog and reading-table feeling. Avoid SaaS, dashboard, game, tech, fantasy, big red/gold, strong grid backgrounds, oversized buttons, and data modules.

2026-07-05 core visual reference: `docs/reference/wengu-style-target.jpg` is the design target for `问古书斋`. Use it only for overall temperament, palette, long-scroll composition, bookish cards, and cultural-museum atmosphere; do not copy its specific people, scenery, logo, text, or composition. Preferred direction is ancient-scroll study-room style: horizontal painted-scroll hero, rice-white paper, ochre/earth yellow/teal/brown/cinnabar accents, Song-style headings, seal-like marks, catalog slips, and CSS-generated thread-bound ancient book covers. Preserve reading clarity over decoration. Home should feel like entering a quiet digital cultural reading room; library like a collection catalog; detail like an ancient-book entry; reader like a clean reading desk.

2026-07-05 first-principles visual correction: the homepage hero must not read as an abstract pale wave background. It needs recognizable study-room and ancient-book cues: paper scroll boundaries, low-saturation landscape layers, pavilion or desk/book signals, seal accents, catalog-style category icons, and realistic thread-bound book-cover texture. Do not add new product features to solve visual weakness; solve it through clearer scene hierarchy, finer paper texture, and restrained cultural details.

2026-07-05 temporary hero asset rule: until an original long-scroll illustration is produced, the home hero should use `public/images/hero-scroll.webp`, cropped only from the long-scroll banner area of `docs/reference/target-home.jpg`. Do not revert to handcrafted abstract SVG wave art for the main hero. The cropped target asset is temporary style scaffolding and must be replaceable later with an original image of the same composition/ratio.

2026-07-05 temporary detail asset rule: `public/images/wengu/categories/*`, `public/images/wengu/books/*`, and `public/images/wengu/decor/*` are cropped temporary fidelity assets from `docs/reference/target-home.jpg` for matching the selected visual target. Use them to hold the current high-fidelity direction, but treat them as replaceable scaffolding; future original assets should preserve the same low-saturation ancient-book icon, thread-bound cover, plum-branch, and seal proportions.

2026-07-05 temporary brand seal rule: homepage/top navigation currently uses `public/brand/wengu-seal-reference.webp`, a crop from `docs/reference/target-home.jpg`, because the handcrafted square SVG looked too much like a modern app icon. Keep the real vertical cinnabar-seal proportion until an original seal asset is produced; do not stretch it into a square.
