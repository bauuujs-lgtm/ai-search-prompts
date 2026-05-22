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

function page(item) {
  const title = `${item.title} - AI 搜索指令库`;
  const description = `${item.summary} 复制这条指令给 DeepSeek、Kimi、豆包、ChatGPT 或秘塔 AI 搜索使用。`;
  const url = `${siteUrl}/prompts/${item.id}.html`;
  const tags = [...item.tags, item.category, ...item.tools].map(tag => `<span class="pill">${escapeHtml(tag)}</span>`).join("");
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
