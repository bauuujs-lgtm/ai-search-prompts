const state = {
  prompts: [],
  category: "全部",
  query: ""
};

const grid = document.querySelector("#promptGrid");
const tabs = document.querySelector("#categoryTabs");
const searchInput = document.querySelector("#searchInput");

async function loadPrompts() {
  const response = await fetch("./data/prompts.json");
  state.prompts = await response.json();
  renderTabs();
  renderPrompts();
}

function categories() {
  return ["全部", ...new Set(state.prompts.map(item => item.category))];
}

function renderTabs() {
  tabs.innerHTML = categories().map(category => `
    <button class="tab-button ${category === state.category ? "active" : ""}" data-category="${category}">
      ${category}
    </button>
  `).join("");
}

function filteredPrompts() {
  const query = state.query.trim().toLowerCase();
  return state.prompts.filter(item => {
    const inCategory = state.category === "全部" || item.category === state.category;
    const text = `${item.title} ${item.summary} ${item.prompt} ${item.tags.join(" ")} ${item.tools.join(" ")}`.toLowerCase();
    return inCategory && (!query || text.includes(query));
  });
}

function renderPrompts() {
  const items = filteredPrompts();
  if (!items.length) {
    grid.innerHTML = `<p class="summary">没有找到匹配的指令，换个词试试。</p>`;
    return;
  }

  grid.innerHTML = items.map(item => `
    <article class="prompt-card">
      <div class="meta">
        <span class="pill">${item.category}</span>
        ${item.tools.slice(0, 3).map(tool => `<span class="pill">${tool}</span>`).join("")}
      </div>
      <h3>${item.title}</h3>
      <p class="summary">${item.summary}</p>
      <div class="prompt-text">${item.prompt}</div>
      <button class="copy-button" data-copy="${encodeURIComponent(item.prompt)}">复制给 AI</button>
    </article>
  `).join("");
}

tabs.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  state.category = button.dataset.category;
  renderTabs();
  renderPrompts();
});

searchInput.addEventListener("input", event => {
  state.query = event.target.value;
  renderPrompts();
});

grid.addEventListener("click", async event => {
  const button = event.target.closest("[data-copy]");
  if (!button) return;
  const text = decodeURIComponent(button.dataset.copy);
  await navigator.clipboard.writeText(text);
  const original = button.textContent;
  button.textContent = "已复制";
  setTimeout(() => {
    button.textContent = original;
  }, 1400);
});

loadPrompts();
