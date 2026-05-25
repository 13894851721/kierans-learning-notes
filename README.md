# Kieran's Learning Notes

这是一个纯静态的个人学习笔记网站，适合部署到 GitHub Pages 或 Cloudflare Pages。

网站定位是：清爽、克制、知识感、个人品牌风，适合长期记录和持续更新。

## 网站用途

这个网站用于记录 Kieran 的长期学习内容，包括：

- 英语学习
- AI 工具
- 历史地理
- 成长记录
- 关于我

## 项目结构

```text
kierans-learning-notes/
├── index.html
├── english.html
├── ai-tools.html
├── history-geography.html
├── growth.html
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

第一版可以先在对应分类页面里新增文章卡片。

卡片包含：

- 分类标签
- 标题
- 简短描述
- 日期
- 继续阅读链接

示例：

```html
<article class="note-card">
  <span class="card-tag">发音笔记</span>
  <h2>我的新英语笔记标题</h2>
  <p>这里写一段简短说明，告诉读者这篇笔记记录了什么。</p>
  <div class="card-meta">
    <time datetime="2026-05-25">2026 年 5 月 25 日</time>
    <a href="#note-template">继续阅读</a>
  </div>
</article>
```

后续如果笔记越来越多，可以新建 `notes/` 文件夹，为每篇文章创建独立 HTML 页面。

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
