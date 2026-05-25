# Kieran's Learning Notes

这是一个纯静态的个人学习笔记网站，适合部署到 GitHub Pages 或 Cloudflare Pages。

网站定位是：清爽、克制、知识感、个人品牌风，适合长期记录和持续更新。

## 网站用途

这个网站用于记录 Kieran 的长期学习内容，包括：

- 语言学习
- AI 智能
- 人文历史
- 社会时政
- 政治经济
- 日常记录
- 关于我

## 项目结构

```text
kierans-learning-notes/
├── index.html
├── language.html
├── ai-intelligence.html
├── humanities-history.html
├── society-politics.html
├── political-economy.html
├── daily.html
├── english.html              # 旧链接跳转到 language.html
├── ai-tools.html             # 旧链接跳转到 ai-intelligence.html
├── history-geography.html    # 旧链接跳转到 humanities-history.html
├── growth.html               # 旧链接跳转到 daily.html
├── about.html
├── style.css
├── script.js
├── README.md
└── assets/
    └── images/
        └── learning-map.svg
```

## 本地预览

这个网站不需要数据库、不需要后台，也不需要构建工具。

最简单的方式：

1. 直接双击打开 `index.html`
2. 使用顶部导航切换页面

如果想使用本地网址预览，可以在项目根目录运行：

```bash
python -m http.server 8000
```

然后在浏览器打开：

```text
http://localhost:8000
```

## 部署到 GitHub Pages

1. 创建一个新的 GitHub 仓库。
2. 把本项目所有文件上传到仓库。
3. 进入仓库的 `Settings` -> `Pages`。
4. 在 `Build and deployment` 中选择 `Deploy from a branch`。
5. 选择 `main` 分支和根目录。
6. 保存后等待 GitHub Pages 自动发布。

发布后会得到一个类似下面的网址：

```text
https://你的用户名.github.io/仓库名/
```

## 部署到 Cloudflare Pages

1. 把项目推送到 GitHub 仓库。
2. 打开 Cloudflare Pages，创建新项目。
3. 连接这个 GitHub 仓库。
4. 构建命令留空。
5. 输出目录使用项目根目录。
6. 点击部署。

## 如何新增一篇文章或笔记

现在网站已经包含一个轻量后台页面：

```text
admin.html
```

发布后的后台地址类似：

```text
https://你的用户名.github.io/仓库名/admin.html
```

后台会把文章保存到 `posts.json`。首页、分类页和文章详情页会自动读取这个文件。

### 准备 GitHub Token

因为 GitHub Pages 是静态网站，没有服务器后台，所以保存文章需要使用 GitHub API。

建议创建 Fine-grained personal access token：

1. 打开 GitHub。
2. 进入 `Settings` -> `Developer settings`。
3. 选择 `Personal access tokens` -> `Fine-grained tokens`。
4. 只选择这个仓库：`kierans-learning-notes`。
5. 权限只开启：
   - `Contents`: Read and write
   - `Metadata`: Read-only
6. 生成 token 后，在 `admin.html` 页面输入。

不要把 token 写进代码，也不要提交到 GitHub 仓库。

### 在网页上发布文章

1. 打开 `admin.html`。
2. 输入 GitHub Token。
3. 填写标题、分类、日期、摘要、链接标识和正文 Markdown。
4. 点击“保存并发布”。
5. 等待 GitHub Pages 自动更新，通常需要 30-60 秒。

每篇文章包含：

- 分类标签
- 标题
- 简短描述
- 日期
- Markdown 正文

示例：

```json
{
  "slug": "my-first-note",
  "title": "我的第一篇学习笔记",
  "category": "language",
  "categoryUrl": "language.html",
  "summary": "这里写一段简短说明。",
  "date": "2026-05-25",
  "content": "# 标题\n\n## 我为什么写这篇？"
}
```

## 推荐文章模板

后续完整文章可以使用这个结构：

```markdown
# 标题

## 我为什么写这篇？

## 核心要点

## 我的笔记

## 例子

## 我学到了什么

## 下一步
```

## 后续可扩展方向

- 新增 `notes/` 文件夹，存放独立文章页面。
- 增加标签和主题索引页。
- 使用少量 JavaScript 增加站内搜索。
- 增加每周学习复盘页面。
- 增加 RSS 或更新日志。
- 绑定自定义域名，例如 `notes.kieran.com`。
