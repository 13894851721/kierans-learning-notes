const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const currentFile = window.location.pathname.split("/").pop() || "index.html";
const pageMap = {
  "index.html": "home",
  "english.html": "english",
  "ai-tools.html": "ai-tools",
  "history-geography.html": "history",
  "growth.html": "growth",
  "about.html": "about",
  "admin.html": "admin"
};

document.querySelectorAll("[data-page]").forEach((link) => {
  if (link.dataset.page === pageMap[currentFile]) {
    link.classList.add("is-active");
    link.setAttribute("aria-current", "page");
  }
});

const categoryLabels = {
  english: "英语学习",
  "ai-tools": "AI 工具",
  history: "历史地理",
  growth: "成长记录"
};

function escapeHTML(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return escapeHTML(value);
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}

function normalizePosts(posts) {
  return [...posts].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
}

function createPostCard(post) {
  const label = categoryLabels[post.category] || "学习笔记";
  const url = `post.html?slug=${encodeURIComponent(post.slug)}`;
  return `
    <article class="note-card">
      <span class="card-tag">${escapeHTML(label)}</span>
      <h2>${escapeHTML(post.title)}</h2>
      <p>${escapeHTML(post.summary)}</p>
      <div class="card-meta">
        <time datetime="${escapeHTML(post.date)}">${formatDate(post.date)}</time>
        <a href="${url}">继续阅读</a>
      </div>
    </article>
  `;
}

function inlineMarkdown(text) {
  return escapeHTML(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" rel="noopener">$1</a>');
}

function markdownToHTML(markdown) {
  const lines = String(markdown || "").replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let inList = false;
  let inCode = false;
  let codeLines = [];

  function closeList() {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  }

  lines.forEach((line) => {
    if (line.trim().startsWith("```")) {
      if (inCode) {
        html.push(`<pre><code>${escapeHTML(codeLines.join("\n"))}</code></pre>`);
        codeLines = [];
        inCode = false;
      } else {
        closeList();
        inCode = true;
      }
      return;
    }

    if (inCode) {
      codeLines.push(line);
      return;
    }

    const trimmed = line.trim();
    if (!trimmed) {
      closeList();
      return;
    }

    if (trimmed.startsWith("### ")) {
      closeList();
      html.push(`<h3>${inlineMarkdown(trimmed.slice(4))}</h3>`);
    } else if (trimmed.startsWith("## ")) {
      closeList();
      html.push(`<h2>${inlineMarkdown(trimmed.slice(3))}</h2>`);
    } else if (trimmed.startsWith("# ")) {
      closeList();
      html.push(`<h1>${inlineMarkdown(trimmed.slice(2))}</h1>`);
    } else if (trimmed.startsWith("- ")) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${inlineMarkdown(trimmed.slice(2))}</li>`);
    } else if (trimmed.startsWith("> ")) {
      closeList();
      html.push(`<blockquote>${inlineMarkdown(trimmed.slice(2))}</blockquote>`);
    } else {
      closeList();
      html.push(`<p>${inlineMarkdown(trimmed)}</p>`);
    }
  });

  closeList();
  if (inCode) {
    html.push(`<pre><code>${escapeHTML(codeLines.join("\n"))}</code></pre>`);
  }
  return html.join("\n");
}

async function loadPosts() {
  const response = await fetch(`posts.json?v=${Date.now()}`, { cache: "no-store" });
  if (!response.ok) throw new Error("无法读取文章数据");
  return normalizePosts(await response.json());
}

function renderPostLists(posts) {
  document.querySelectorAll("[data-post-list]").forEach((container) => {
    const listType = container.dataset.postList;
    const limit = Number(container.dataset.limit || 0);
    let filtered = listType === "recent"
      ? posts
      : posts.filter((post) => post.category === listType);

    if (limit > 0) filtered = filtered.slice(0, limit);
    if (!filtered.length) return;
    container.innerHTML = filtered.map(createPostCard).join("");
  });
}

function renderPostPage(posts) {
  const root = document.querySelector("[data-post-root]");
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    root.innerHTML = `
      <div class="container narrow article-template">
        <p class="eyebrow">没有找到文章</p>
        <h1>这篇笔记暂时不存在</h1>
        <p>可能是链接错误，或者 GitHub Pages 还在发布新内容。</p>
        <a class="text-link" href="index.html">返回首页</a>
      </div>
    `;
    document.title = "文章不存在 | Kieran's Learning Notes";
    return;
  }

  const label = categoryLabels[post.category] || "学习笔记";
  document.title = `${post.title} | Kieran's Learning Notes`;
  root.innerHTML = `
    <article class="container narrow post-article">
      <a class="text-link back-link" href="${escapeHTML(post.categoryUrl || "index.html")}">返回${escapeHTML(label)}</a>
      <p class="eyebrow">${escapeHTML(label)}</p>
      <h1>${escapeHTML(post.title)}</h1>
      <p class="post-summary">${escapeHTML(post.summary)}</p>
      <div class="post-meta">
        <time datetime="${escapeHTML(post.date)}">${formatDate(post.date)}</time>
      </div>
      <div class="post-body">${markdownToHTML(post.content)}</div>
    </article>
  `;
}

if (document.querySelector("[data-post-list]") || document.querySelector("[data-post-root]")) {
  loadPosts()
    .then((posts) => {
      renderPostLists(posts);
      renderPostPage(posts);
    })
    .catch((error) => {
      console.warn(error.message);
    });
}
