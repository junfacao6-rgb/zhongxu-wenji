"use client";

import { useMemo, useState } from "react";
import { Info, ShieldCheck } from "lucide-react";
import ContentAdviceBoard from "@/components/qimen/ContentAdviceBoard";
import ContentPublishTimeCard from "@/components/qimen/ContentPublishTimeCard";
import ContentTimingSelector from "@/components/qimen/ContentTimingSelector";
import { qimenMockChart } from "@/data/qimenMock";
import { eventRules, type EventRule } from "@/qimen-core/eventRules";
import { scorePalaceForEvent, type TimingResult } from "@/qimen-core/scoring";
import type { QimenPalace } from "@/types/qimen";

export type ContentPurpose = "涨粉" | "成交" | "立人设" | "发干货" | "发案例" | "促咨询" | "开课";

export type ContentPlatform = {
  id: string;
  label: string;
  ruleName: string;
  note: string;
};

export type ContentTimingSlot = {
  id: string;
  timeLabel: string;
  timeRange: string;
  palace: QimenPalace;
  score: number;
  level: TimingResult["level"];
  reasons: string[];
  advice: string;
};

export type ContentAdvice = {
  contentTypes: string[];
  titleDirections: string[];
  expressionStyles: string[];
  commentNotes: string[];
  privateConversion: string[];
};

type ContentTimeSlotSeed = {
  id: string;
  timeLabel: string;
  timeRange: string;
  palaceNumber: number;
};

const contentPlatforms: ContentPlatform[] = [
  { id: "douyin", label: "发抖音", ruleName: "发抖音", note: "短视频发布、曝光和互动测试。" },
  { id: "xiaohongshu", label: "发小红书", ruleName: "发小红书", note: "图文笔记、种草内容和学习分享。" },
  { id: "wechat-article", label: "发公众号", ruleName: "发公众号", note: "长文发布、讲义分享和专业表达。" },
  { id: "moments", label: "发朋友圈", ruleName: "发朋友圈", note: "轻量公告、个人表达和私域提醒。" },
  { id: "live", label: "开直播", ruleName: "直播", note: "直播开场、课程直播和公开表达。" },
  { id: "course", label: "发布课程", ruleName: "发布课程", note: "课程上线、讲义发布和学员通知。" },
  { id: "sales-copy", label: "发售卖文案", ruleName: "发售卖文案", note: "销售文案、转化说明和促销内容。" },
  { id: "private-group", label: "私域群发", ruleName: "私域群发", note: "私域通知、社群发布和活动提醒。" },
  { id: "materials", label: "上架资料", ruleName: "上架资料", note: "资料、讲义、课程附件上架。" },
  { id: "submission", label: "投稿文章", ruleName: "投稿", note: "投稿、作品递交和外部审核。" },
];

const contentPurposes: ContentPurpose[] = ["涨粉", "成交", "立人设", "发干货", "发案例", "促咨询", "开课"];

const contentTimeSlots: ContentTimeSlotSeed[] = [
  { id: "zi", timeLabel: "甲子时", timeRange: "23:00 - 01:00", palaceNumber: 1 },
  { id: "chou", timeLabel: "乙丑时", timeRange: "01:00 - 03:00", palaceNumber: 8 },
  { id: "yin", timeLabel: "丙寅时", timeRange: "03:00 - 05:00", palaceNumber: 3 },
  { id: "mao", timeLabel: "丁卯时", timeRange: "05:00 - 07:00", palaceNumber: 4 },
  { id: "chen", timeLabel: "戊辰时", timeRange: "07:00 - 09:00", palaceNumber: 9 },
  { id: "si", timeLabel: "己巳时", timeRange: "09:00 - 11:00", palaceNumber: 6 },
  { id: "wu", timeLabel: "庚午时", timeRange: "11:00 - 13:00", palaceNumber: 7 },
  { id: "wei", timeLabel: "辛未时", timeRange: "13:00 - 15:00", palaceNumber: 2 },
  { id: "shen", timeLabel: "壬申时", timeRange: "15:00 - 17:00", palaceNumber: 5 },
  { id: "you", timeLabel: "癸酉时", timeRange: "17:00 - 19:00", palaceNumber: 1 },
  { id: "xu", timeLabel: "甲戌时", timeRange: "19:00 - 21:00", palaceNumber: 8 },
  { id: "hai", timeLabel: "乙亥时", timeRange: "21:00 - 23:00", palaceNumber: 9 },
];

const purposeAdvice: Record<ContentPurpose, ContentAdvice> = {
  涨粉: {
    contentTypes: ["干货清单", "入门误区", "可收藏的小案例"],
    titleDirections: ["直接说明用户能学到什么", "少用刺激词，多用问题和场景", "可加入“入门、避坑、看懂”这类稳妥词"],
    expressionStyles: ["开头快速给结论，再解释依据", "语言清晰，减少玄妙化表达", "结尾引导收藏或留言问题"],
    commentNotes: ["不承诺流量和结果", "遇到命理咨询问题，先提示仅作学习参考", "可把高频问题沉淀为下一条内容"],
    privateConversion: ["先提供资料目录或学习路径", "用低门槛笔记承接兴趣", "不急于强销售，优先建立可信度"],
  },
  成交: {
    contentTypes: ["课程预告", "服务边界说明", "案例复盘和常见问题"],
    titleDirections: ["突出适合人群和交付内容", "避免夸张收益和承诺式标题", "把价格、范围、限制说清楚"],
    expressionStyles: ["先讲价值，再讲适用边界", "用证据、目录和样例建立信任", "保持克制，不制造焦虑"],
    commentNotes: ["不在评论区作个人化断语", "引导用户查看详情或私信领取说明", "敏感问题转为私域合规沟通"],
    privateConversion: ["推荐先发价值铺垫，再引导咨询", "准备课程大纲、样例页和常见问题", "成交沟通中明确不替代专业意见"],
  },
  立人设: {
    contentTypes: ["学习方法", "读书笔记", "专业观点和术语解释"],
    titleDirections: ["用专业、稳重、可验证的标题", "避免神秘化和权威压迫感", "强调资料来源和学习路径"],
    expressionStyles: ["像老师讲课，少用情绪化表达", "原典依据与现代解释并置", "保留可讨论空间"],
    commentNotes: ["优先回答基础问题", "遇到争议观点时说明口径和来源", "不与用户争执预测结果"],
    privateConversion: ["承接到课程体系、读书群或资料清单", "用长期学习计划代替短期承诺", "沉淀用户问题作为后续课程素材"],
  },
  发干货: {
    contentTypes: ["术语卡片", "结构图解", "步骤清单和学习路径"],
    titleDirections: ["标题宜清楚说明知识点", "适合“从零看懂、三个层次、常见误区”", "不做夸张式结论"],
    expressionStyles: ["分点讲，少绕弯", "先定义，再举例，再提醒边界", "适合配图表或卡片"],
    commentNotes: ["鼓励用户提问具体术语", "把复杂问题拆成下一篇", "避免在评论区给个人化结论"],
    privateConversion: ["用术语库、讲义和练习题承接", "推荐学习路径而非单次判断", "适合引导加入打卡或课程试听"],
  },
  发案例: {
    contentTypes: ["复盘案例", "问题拆解", "报告样例"],
    titleDirections: ["说明案例类型和学习点", "不暗示案例结果可复制", "保护隐私，避免真实敏感细节"],
    expressionStyles: ["按背景、结构、依据、复盘展开", "多写观察依据，少写断语", "结尾强调参考性和限制"],
    commentNotes: ["不接受评论区公开排盘", "提醒用户不要套用到自身重大决策", "可收集共性问题做教学"],
    privateConversion: ["适合承接到报告预览或案例课", "提供匿名样例和交付结构", "咨询前先说明资料需求和服务边界"],
  },
  促咨询: {
    contentTypes: ["问题清单", "咨询前准备", "报告交付样例"],
    titleDirections: ["聚焦用户困惑和可准备资料", "避免制造恐惧感", "强调参考、复盘和行动建议"],
    expressionStyles: ["温和、明确、有边界", "说明能做什么，也说明不能替代什么", "先帮用户建立判断框架"],
    commentNotes: ["不在评论区处理隐私和重大决策", "引导用户先整理问题和资料", "对医疗、法律、投资等问题直接提示专业意见优先"],
    privateConversion: ["私域内先发咨询须知和案例样张", "建议用表单收集问题背景", "明确服务范围、时长和不承诺结果"],
  },
  开课: {
    contentTypes: ["课程预告", "试听片段", "学习路径和作业样例"],
    titleDirections: ["说明课程解决的学习问题", "突出路径、讲义、练习和复盘", "避免承诺速成或结果"],
    expressionStyles: ["老师感、结构化、节奏稳定", "先给一段可学习内容，再说明课程安排", "适合用清单和目录增强可信度"],
    commentNotes: ["回答适合人群和基础要求", "不承诺学完后的现实收益", "把复杂问题引导到公开答疑或课程说明"],
    privateConversion: ["推荐先发课程大纲和样课", "设置咨询前置问题，确认学习目标", "转化话术以适合人群、学习安排和交付物为主"],
  },
};

export default function ContentTimingPanel() {
  const [selectedPlatformId, setSelectedPlatformId] = useState(contentPlatforms[0].id);
  const [selectedPurpose, setSelectedPurpose] = useState<ContentPurpose>("发干货");
  const [targetDate, setTargetDate] = useState(qimenMockChart.chartTime.slice(0, 10));
  const [hasGenerated, setHasGenerated] = useState(false);

  const selectedPlatform = useMemo(
    () => contentPlatforms.find((platform) => platform.id === selectedPlatformId) ?? contentPlatforms[0],
    [selectedPlatformId],
  );

  const selectedRule = useMemo(() => {
    return eventRules.find((rule) => rule.name === selectedPlatform.ruleName) ?? eventRules.find((rule) => rule.name === "发公众号") ?? eventRules[0];
  }, [selectedPlatform.ruleName]);

  const evaluatedSlots = useMemo(() => evaluateContentSlots(selectedRule, selectedPurpose, selectedPlatform), [selectedRule, selectedPurpose, selectedPlatform]);
  const recommendedSlots = evaluatedSlots.slice(0, 3);
  const cautiousSlots = evaluatedSlots.slice(-3).reverse();
  const advice = purposeAdvice[selectedPurpose];

  return (
    <div className="content-timing-panel">
      <ContentTimingSelector
        platforms={contentPlatforms}
        purposes={contentPurposes}
        selectedPlatformId={selectedPlatformId}
        selectedPurpose={selectedPurpose}
        targetDate={targetDate}
        onPlatformChange={(platformId) => {
          setSelectedPlatformId(platformId);
          setHasGenerated(false);
        }}
        onPurposeChange={(purpose) => {
          setSelectedPurpose(purpose);
          setHasGenerated(false);
        }}
        onTargetDateChange={(date) => {
          setTargetDate(date);
          setHasGenerated(false);
        }}
        onGenerate={() => setHasGenerated(true)}
      />

      <section className="content-query-summary" aria-labelledby="content-query-summary-title">
        <div>
          <span>查询信息</span>
          <h2 id="content-query-summary-title">{selectedPlatform.label} · {selectedPurpose}</h2>
          <p>{selectedPlatform.note}</p>
        </div>
        <dl>
          <div><dt>目标日期</dt><dd>{targetDate}</dd></div>
          <div><dt>规则事项</dt><dd>{selectedRule.name}</dd></div>
          <div><dt>盘面来源</dt><dd>{qimenMockChart.title}</dd></div>
          <div><dt>输出口径</dt><dd>规则评分 + mock 建议</dd></div>
        </dl>
      </section>

      {!hasGenerated ? (
        <section className="content-empty-state" aria-label="尚未生成发布参考">
          <Info aria-hidden="true" />
          <div>
            <h2>请选择平台和目的后生成发布参考</h2>
            <p>生成后会展示推荐发布时间、不建议发布时间、内容类型、标题方向、表达风格、评论区注意事项、私域转化建议和盘理依据。</p>
          </div>
        </section>
      ) : (
        <>
          <section className="content-timing-result-section" aria-labelledby="recommended-publish-title">
            <div className="qimen-section-head">
              <span>推荐发布时间</span>
              <h2 id="recommended-publish-title">结构较利于表达和展示的时段</h2>
              <p>今日结构较利于公开表达与内容展示，可优先发布干货、案例、课程预告类内容。标题宜稳，不宜过度刺激。</p>
            </div>
            <div className="content-publish-card-grid">
              {recommendedSlots.map((slot) => (
                <ContentPublishTimeCard key={slot.id} slot={slot} />
              ))}
            </div>
          </section>

          <section className="content-timing-result-section" aria-labelledby="cautious-publish-title">
            <div className="qimen-section-head">
              <span>不建议发布时间</span>
              <h2 id="cautious-publish-title">建议放慢发布或改作内部准备</h2>
              <p>若用于强销售，建议避开结构提示较多的时段，先做价值铺垫、资料校对和评论区预案。</p>
            </div>
            <div className="content-publish-card-grid">
              {cautiousSlots.map((slot) => (
                <ContentPublishTimeCard key={slot.id} slot={slot} variant="caution" />
              ))}
            </div>
          </section>

          <ContentAdviceBoard advice={advice} />

          <section id="content-timing-evidence" className="content-timing-evidence" aria-labelledby="content-timing-evidence-title">
            <details open>
              <summary>
                <span>盘理依据</span>
                <strong id="content-timing-evidence-title">规则评分说明</strong>
              </summary>
              <div className="content-timing-evidence-body">
                <article>
                  <h3>平台取象</h3>
                  <p>
                    {selectedPlatform.label}取“{selectedRule.name}”规则，重点观察景门、开门、生门等表达与传播入口，并结合天英、天辅、天心等星象作内容状态参考。
                  </p>
                </article>
                <article>
                  <h3>推荐依据</h3>
                  <ul>
                    {recommendedSlots.flatMap((slot) => slot.reasons.slice(0, 2).map((reason) => `${slot.timeLabel}：${reason}`)).map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                </article>
                <article>
                  <h3>慎用依据</h3>
                  <ul>
                    {cautiousSlots.flatMap((slot) => slot.reasons.slice(0, 2).map((reason) => `${slot.timeLabel}：${reason}`)).map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                </article>
              </div>
            </details>
          </section>
        </>
      )}

      <section className="content-timing-disclaimer" aria-label="免责声明">
        <ShieldCheck aria-hidden="true" />
        <div>
          <strong>免责声明</strong>
          <p>本页面仅作传统文化学习、内容排期和行动参考，不承诺流量、成交、涨粉或咨询结果。</p>
          <p>{qimenMockChart.disclaimer}</p>
          <p>{selectedRule.riskDisclaimer}</p>
        </div>
      </section>
    </div>
  );
}

function evaluateContentSlots(eventRule: EventRule, purpose: ContentPurpose, platform: ContentPlatform): ContentTimingSlot[] {
  const slots = contentTimeSlots
    .map((timeSlot) => {
      const palace = qimenMockChart.palaces.find((item) => item.palaceNumber === timeSlot.palaceNumber);
      if (!palace) return null;

      const palaceScore = scorePalaceForEvent(palace, eventRule);
      const purposeScore = getPurposeScore(purpose, palace);
      const score = clampScore(palaceScore.score + purposeScore.delta);
      const level = getTimingLevel(score);
      const reasons = [...palaceScore.reasons, purposeScore.reason].filter(Boolean);

      return {
        id: timeSlot.id,
        timeLabel: timeSlot.timeLabel,
        timeRange: timeSlot.timeRange,
        palace,
        score,
        level,
        reasons,
        advice: buildPublishAdvice(platform, purpose, level, palace),
      };
    })
    .filter((slot): slot is ContentTimingSlot => Boolean(slot));

  return [...slots].sort((left, right) => right.score - left.score);
}

function getPurposeScore(purpose: ContentPurpose, palace: QimenPalace) {
  if (purpose === "涨粉" && (palace.door === "景门" || palace.star === "天英")) {
    return { delta: 8, reason: "内容目的为“涨粉”，景门或天英有助于公开表达，按 mock 目的修正加 8 分。" };
  }

  if ((purpose === "成交" || purpose === "促咨询" || purpose === "开课") && (palace.door === "生门" || palace.door === "开门")) {
    return { delta: 8, reason: `内容目的为“${purpose}”，生门或开门较利于承接和说明，按 mock 目的修正加 8 分。` };
  }

  if ((purpose === "发干货" || purpose === "立人设") && (palace.star === "天辅" || palace.star === "天心")) {
    return { delta: 7, reason: `内容目的为“${purpose}”，天辅或天心较利于知识表达和结构说明，按 mock 目的修正加 7 分。` };
  }

  if (purpose === "发案例" && (palace.door === "景门" || palace.door === "杜门")) {
    return { delta: 6, reason: "内容目的为“发案例”，景门利展示、杜门利整理，按 mock 目的修正加 6 分。" };
  }

  return { delta: 0, reason: `内容目的为“${purpose}”，当前宫位不作额外目的修正。` };
}

function buildPublishAdvice(platform: ContentPlatform, purpose: ContentPurpose, level: TimingResult["level"], palace: QimenPalace) {
  const base = `${platform.label}用于“${purpose}”时，可观察${palace.palaceName}的${palace.door}、${palace.star}和${palace.deity}组合。`;

  switch (level) {
    case "较宜":
      return `${base}结构偏向表达顺畅，建议先发布价值内容，再用温和方式引导互动或咨询。`;
    case "可用":
      return `${base}可作为参考时段，适合在标题、版权和评论区预案确认后发布。`;
    case "平稳":
      return `${base}整体偏平稳，适合常规发布或内部预热，不宜把结果预期放得过高。`;
    case "慎用":
      return `${base}结构提示需谨慎，建议改为草稿校对、素材整理或延后强销售内容。`;
    case "不建议":
      return `${base}不建议作为优先发布时间，可改为复盘数据、整理选题或准备私域承接。`;
  }
}

function getTimingLevel(score: number): TimingResult["level"] {
  if (score >= 80) return "较宜";
  if (score >= 65) return "可用";
  if (score >= 50) return "平稳";
  if (score >= 35) return "慎用";
  return "不建议";
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}
