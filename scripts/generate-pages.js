const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const prompts = JSON.parse(fs.readFileSync(path.join(root, "data", "prompts.json"), "utf8"));
const promptsDir = path.join(root, "prompts");
const siteUrl = "https://bauuujs-lgtm.github.io/ai-search-prompts";

fs.mkdirSync(promptsDir, { recursive: true });

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const categoryGuides = {
  "赚钱副业": {
    audience: "适合想验证副业方向、接单服务、数字产品、联盟返佣或个人小项目的人。",
    steps: ["先把你的预算、技能和每天可投入时间填进指令。", "要求 AI 搜索最近 30-90 天的信息，并标注来源日期。", "让 AI 用表格比较机会，不要只给清单。", "从风险最低、第一周能验证的方向开始。"],
    output: ["机会对比表", "启动成本和变现周期", "风险提醒", "第一周行动清单"],
    caution: "不要相信夸张收益，也不要执行刷单、虚假注册、补贴套利和平台漏洞玩法。"
  },
  "内容运营": {
    audience: "适合小红书、抖音、B站、公众号、知乎等内容创作者和运营人员。",
    steps: ["把领域、人群、平台和账号阶段填进去。", "让 AI 搜索近期内容和评论需求。", "要求输出标题、角度、脚本或文章结构。", "发布前检查平台规则和夸大表达。"],
    output: ["选题清单", "标题模板", "脚本大纲", "评论区需求总结"],
    caution: "不要直接搬运别人的内容，注意避免医疗、金融、收益承诺等高风险表达。"
  },
  "商业调研": {
    audience: "适合创业者、产品经理、运营、销售和需要做竞品/市场研究的人。",
    steps: ["明确产品、目标用户、地区和调研目的。", "要求 AI 区分官方来源、媒体报道、用户评论和推测。", "用表格比较竞品、价格、卖点和差评。", "让 AI 给出可执行结论而不是泛泛总结。"],
    output: ["竞品表", "用户痛点", "市场机会", "差异化建议"],
    caution: "公开资料可能滞后，重要商业决策要二次核验原始来源。"
  },
  "电商选品": {
    audience: "适合电商卖家、内容带货账号、跨境卖家和想做选品验证的人。",
    steps: ["填写平台、预算、品类和是否有供应链。", "要求 AI 搜索需求证据、价格带、差评和售后风险。", "让 AI 排除侵权、功效夸大和高退货品类。", "先用内容或小批量测试，不要直接压货。"],
    output: ["候选产品表", "价格带", "用户痛点", "售后和合规风险"],
    caution: "不要做侵权、假货、医疗功效夸大或平台禁止的产品。"
  },
  "AI工具": {
    audience: "适合想选择 AI 工具、搭配工作流、做工具测评或节省订阅费用的人。",
    steps: ["填入你的场景、预算和设备环境。", "要求 AI 搜索官网、价格、免费额度和限制。", "让 AI 按新手、性价比、专业三个方案推荐。", "试用前检查隐私和商用授权。"],
    output: ["工具对比表", "价格和免费额度", "推荐组合", "替代方案"],
    caution: "AI 工具价格和政策变化很快，购买前要打开官网确认。"
  },
  "购物决策": {
    audience: "适合购买显卡、电脑、手机、家电、课程、软件订阅等高决策成本商品的人。",
    steps: ["填写预算、地区、用途和可接受风险。", "让 AI 搜索最近价格、评测、投诉和替代品。", "要求 AI 标注来源日期并区分新旧款。", "最后输出买/不买/等降价三种建议。"],
    output: ["价格区间", "优缺点", "替代选择", "购买建议"],
    caution: "不要只看单一平台价格，二手和低价渠道要重点检查售后风险。"
  },
  "学习研究": {
    audience: "适合学生、研究者、自学者和需要快速搭建知识框架的人。",
    steps: ["填写主题、当前水平、目标和截止时间。", "要求 AI 优先找权威资料、论文、公开课或教材。", "让 AI 输出学习路线或研究综述。", "用原始链接核对关键信息。"],
    output: ["资料清单", "知识框架", "学习路线", "论文或案例总结"],
    caution: "论文和专业知识要核验原文，不要直接把 AI 总结当作引用依据。"
  },
  "求职职业": {
    audience: "适合准备简历、面试、转行、作品集和职业规划的人。",
    steps: ["填写目标岗位、城市、年限和当前背景。", "让 AI 搜索真实招聘 JD 和面经。", "提炼技能关键词、项目要求和作品集方向。", "生成 30-90 天准备计划。"],
    output: ["岗位需求表", "简历关键词", "面试题", "准备计划"],
    caution: "薪资和岗位信息波动很大，投递前要以最新招聘页面为准。"
  },
  "合规风险": {
    audience: "适合做项目、广告、收款、内容发布和数据采集前做风险自查的人。",
    steps: ["明确业务模式、平台、地区和会收集的数据。", "要求 AI 搜索官方规则和近期案例。", "按风险等级列出问题和替代方案。", "高风险事项咨询专业人士。"],
    output: ["风险清单", "规则来源", "可能后果", "合规替代做法"],
    caution: "这类结果不能替代律师、税务师或平台官方解释。"
  },
  "生活决策": {
    audience: "适合旅行、租房、装修、保险、教育、健康设备等生活决策前做资料整理的人。",
    steps: ["填写城市、预算、时间、家庭情况或具体限制。", "要求 AI 搜索近期信息和用户评价。", "让 AI 输出清单、预算和避坑点。", "涉及医疗、法律、保险时咨询专业人士。"],
    output: ["决策表", "预算估算", "避坑清单", "行动计划"],
    caution: "生活信息有地域和时间差，出行、价格、政策要以官方或现场信息为准。"
  }
};

function guideFor(item) {
  return categoryGuides[item.category] || {
    audience: "适合需要把模糊问题变成 AI 可执行搜索任务的人。",
    steps: ["填入你的具体场景。", "要求 AI 联网搜索并标注来源。", "让 AI 用表格输出。", "核验关键来源。"],
    output: ["资料清单", "对比表", "结论", "行动建议"],
    caution: "重要决策要核验原始来源。"
  };
}

function page(item) {
  const title = `${item.title} - AI 搜索指令库`;
  const description = `${item.summary} 复制这条指令给 DeepSeek、Kimi、豆包、ChatGPT 或秘塔 AI 搜索使用。`;
  const url = `${siteUrl}/prompts/${item.id}.html`;
  const tags = [...item.tags, item.category, ...item.tools].map(tag => `<span class="pill">${escapeHtml(tag)}</span>`).join("");
  const guide = guideFor(item);
  const steps = guide.steps.map((step, index) => `<li><strong>第 ${index + 1} 步：</strong>${escapeHtml(step)}</li>`).join("");
  const outputs = guide.output.map(output => `<li>${escapeHtml(output)}</li>`).join("");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": item.title,
    "description": item.summary,
    "keywords": item.tags.join(", "),
    "url": url,
    "inLanguage": "zh-CN"
  };

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${escapeHtml(url)}">
  <meta name="twitter:card" content="summary">
  <link rel="canonical" href="${escapeHtml(url)}">
  <link rel="stylesheet" href="../styles.css">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
  <header class="site-header compact">
    <nav class="nav" aria-label="主导航">
      <a class="brand" href="../index.html">AI 搜索指令库</a>
      <div class="nav-links">
        <a href="../index.html#prompts">指令库</a>
        <a href="../index.html#sponsor">赞助</a>
        <a href="../about.html">关于</a>
      </div>
    </nav>
  </header>
  <main class="prompt-detail">
    <p class="eyebrow">${escapeHtml(item.category)}</p>
    <h1>${escapeHtml(item.title)}</h1>
    <p class="hero-text">${escapeHtml(item.summary)}</p>
    <div class="detail-meta">${tags}</div>
    <section class="detail-prompt">
      ${escapeHtml(item.prompt)}
    </section>
    <section class="detail-section">
      <h2>适合谁用</h2>
      <p>${escapeHtml(guide.audience)}</p>
    </section>
    <section class="detail-section">
      <h2>使用方案</h2>
      <ol>${steps}</ol>
    </section>
    <section class="detail-section">
      <h2>建议让 AI 输出</h2>
      <ul>${outputs}</ul>
    </section>
    <section class="detail-section">
      <h2>注意事项</h2>
      <p>${escapeHtml(guide.caution)}</p>
    </section>
    <div class="hero-actions">
      <a class="primary-action" href="../index.html#prompts">返回指令库</a>
      <a class="secondary-action" href="mailto:2315827339@qq.com?subject=${encodeURIComponent("定制 AI 搜索词包")}">定制类似指令</a>
    </div>
    <section class="detail-cta">
      <strong>赞助收录 / 定制词包</strong>
      <p>AI 工具、效率软件、课程和数据服务可以申请赞助收录。需要行业专属 AI 搜索词包，也可以联系定制。</p>
      <a href="mailto:2315827339@qq.com?subject=${encodeURIComponent("AI 搜索指令库合作")}">2315827339@qq.com</a>
    </section>
  </main>
</body>
</html>
`;
}

for (const item of prompts) {
  fs.writeFileSync(path.join(promptsDir, `${item.id}.html`), page(item), "utf8");
}

const urls = [
  ["", "daily", "1.0"],
  ["about.html", "monthly", "0.5"],
  ...prompts.map(item => [`prompts/${item.id}.html`, "weekly", "0.8"])
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([loc, changefreq, priority]) => `  <url>
    <loc>${siteUrl}/${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join("\n")}
</urlset>
`;

fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap, "utf8");
console.log(`Generated ${prompts.length} prompt pages and sitemap.`);
