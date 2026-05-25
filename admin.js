const repoConfig = {
  owner: "13894851721",
  repo: "kierans-learning-notes",
  branch: "main",
  path: "posts.json"
};

const categoryUrlMap = {
  language: "language.html",
  ai: "ai-intelligence.html",
  humanities: "humanities-history.html",
  society: "society-politics.html",
  economy: "political-economy.html",
  daily: "daily.html"
};

const tokenInput = document.querySelector("#github-token");
const saveTokenButton = document.querySelector("#save-token");
const clearTokenButton = document.querySelector("#clear-token");
const existingPosts = document.querySelector("#existing-posts");
const postForm = document.querySelector("#post-form");
const statusBox = document.querySelector("#admin-status");
const previewPanel = document.querySelector("#preview-panel");

const fields = {
  editingSlug: document.querySelector("#editing-slug"),
  title: document.querySelector("#post-title"),
  category: document.querySelector("#post-category"),
  date: document.querySelector("#post-date"),
  summary: document.querySelector("#post-summary"),
  slug: document.querySelector("#post-slug"),
  content: document.querySelector("#post-content")
};

let currentPosts = [];

function setStatus(message, type = "neutral") {
  statusBox.textContent = message;
  statusBox.className = `admin-status ${type}`;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function makeSlug(title) {
  const ascii = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return ascii || `note-${new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14)}`;
}

function decodeBase64Unicode(base64) {
  const binary = atob(base64.replace(/\s/g, ""));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function encodeBase64Unicode(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

async function fetchPublishedPosts() {
  const response = await fetch(`posts.json?v=${Date.now()}`, { cache: "no-store" });
  if (!response.ok) throw new Error("无法读取已发布文章");
  currentPosts = normalizePosts(await response.json());
  renderExistingPosts();
}

function renderExistingPosts() {
  if (!currentPosts.length) {
    existingPosts.innerHTML = '<p class="admin-help">还没有文章。</p>';
    return;
  }

  existingPosts.innerHTML = currentPosts.map((post) => `
    <button class="post-list-button" type="button" data-edit-slug="${escapeHTML(post.slug)}">
      <span>${escapeHTML(post.title)}</span>
      <small>${escapeHTML(categoryLabels[post.category] || "学习笔记")} · ${formatDate(post.date)}</small>
    </button>
  `).join("");
}

function loadPostIntoForm(post) {
  fields.editingSlug.value = post.slug;
  fields.title.value = post.title;
  fields.category.value = post.category;
  fields.date.value = post.date || todayISO();
  fields.summary.value = post.summary || "";
  fields.slug.value = post.slug;
  fields.content.value = post.content || "";
  document.querySelector(".editor-heading h2").textContent = "编辑文章";
  setStatus(`正在编辑：${post.title}`);
  previewPanel.hidden = true;
}

function resetForm() {
  fields.editingSlug.value = "";
  fields.title.value = "";
  fields.category.value = "language";
  fields.date.value = todayISO();
  fields.summary.value = "";
  fields.slug.value = "";
  fields.content.value = "# 标题\n\n## 我为什么写这篇？\n\n## 核心要点\n\n## 我的笔记\n\n## 例子\n\n## 我学到了什么\n\n## 下一步\n";
  document.querySelector(".editor-heading h2").textContent = "新建文章";
  setStatus("");
  previewPanel.hidden = true;
}

function getToken() {
  return tokenInput.value.trim();
}

async function getRepoPosts(token) {
  const url = `https://api.github.com/repos/${repoConfig.owner}/${repoConfig.repo}/contents/${repoConfig.path}?ref=${repoConfig.branch}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });

  if (!response.ok) {
    throw new Error(response.status === 401 || response.status === 403
      ? "GitHub Token 无效，或没有 Contents 读写权限。"
      : "无法读取 GitHub 仓库里的 posts.json。");
  }

  const file = await response.json();
  return {
    sha: file.sha,
    posts: JSON.parse(decodeBase64Unicode(file.content || "W10="))
  };
}

async function putRepoPosts(token, posts, sha, message) {
  const url = `https://api.github.com/repos/${repoConfig.owner}/${repoConfig.repo}/contents/${repoConfig.path}`;
  const body = {
    message,
    content: encodeBase64Unicode(`${JSON.stringify(posts, null, 2)}\n`),
    sha,
    branch: repoConfig.branch
  };

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    throw new Error(detail.message || "保存失败，请检查 token 权限或稍后重试。");
  }

  return response.json();
}

function readFormPost() {
  const title = fields.title.value.trim();
  const slug = fields.slug.value.trim();
  return {
    slug,
    title,
    category: fields.category.value,
    categoryUrl: categoryUrlMap[fields.category.value],
    summary: fields.summary.value.trim(),
    date: fields.date.value,
    content: fields.content.value.trim()
  };
}

async function savePost(event) {
  event.preventDefault();

  const token = getToken();
  if (!token) {
    setStatus("请先输入 GitHub Token。", "error");
    return;
  }

  const post = readFormPost();
  if (!post.title || !post.slug || !post.summary || !post.content) {
    setStatus("请补全标题、摘要、链接标识和正文。", "error");
    return;
  }

  setStatus("正在连接 GitHub 并保存文章...", "loading");

  try {
    const repoData = await getRepoPosts(token);
    const posts = normalizePosts(repoData.posts);
    const editingSlug = fields.editingSlug.value;
    const existingIndex = posts.findIndex((item) => item.slug === editingSlug || item.slug === post.slug);

    if (existingIndex >= 0) {
      posts[existingIndex] = post;
    } else {
      posts.unshift(post);
    }

    const message = existingIndex >= 0 ? `Update note: ${post.title}` : `Add note: ${post.title}`;
    await putRepoPosts(token, normalizePosts(posts), repoData.sha, message);
    currentPosts = normalizePosts(posts);
    renderExistingPosts();
    fields.editingSlug.value = post.slug;
    setStatus(`保存成功。GitHub Pages 通常会在 30-60 秒后发布：post.html?slug=${post.slug}`, "success");
  } catch (error) {
    setStatus(error.message, "error");
  }
}

tokenInput.value = sessionStorage.getItem("kieranGithubToken") || "";
fields.date.value = todayISO();

saveTokenButton.addEventListener("click", () => {
  sessionStorage.setItem("kieranGithubToken", tokenInput.value.trim());
  setStatus("Token 已保存到本次浏览器会话。", "success");
});

clearTokenButton.addEventListener("click", () => {
  sessionStorage.removeItem("kieranGithubToken");
  tokenInput.value = "";
  setStatus("Token 已清除。");
});

document.querySelector("#generate-slug").addEventListener("click", () => {
  fields.slug.value = makeSlug(fields.title.value);
});

document.querySelector("#new-post").addEventListener("click", resetForm);

document.querySelector("#preview-post").addEventListener("click", () => {
  previewPanel.innerHTML = markdownToHTML(fields.content.value);
  previewPanel.hidden = false;
});

existingPosts.addEventListener("click", (event) => {
  const button = event.target.closest("[data-edit-slug]");
  if (!button) return;
  const post = currentPosts.find((item) => item.slug === button.dataset.editSlug);
  if (post) loadPostIntoForm(post);
});

postForm.addEventListener("submit", savePost);

fetchPublishedPosts().catch((error) => {
  existingPosts.innerHTML = `<p class="admin-help">${escapeHTML(error.message)}</p>`;
});
