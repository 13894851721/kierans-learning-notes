# Kieran's Learning Notes

这是一个部署在 GitHub Pages 上的个人博客和公开学习笔记网站。

网站风格：清爽、克制、偏传统个人博客，适合长期写文章、保存学习笔记、记录生活和展示相册。

## 网站用途

网站用于记录 Kieran 的长期学习和生活内容，包括：

- 语言学习
- AI 智能
- 人文历史
- 社会时政
- 政治经济
- 日常记录
- 我的相册
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
├── gallery.html
├── about.html
├── admin.html
├── post.html
├── posts.json
├── admin.js
├── script.js
├── style.css
├── README.md
├── english.html              # 旧链接跳转到 language.html
├── ai-tools.html             # 旧链接跳转到 ai-intelligence.html
├── history-geography.html    # 旧链接跳转到 humanities-history.html
├── growth.html               # 旧链接跳转到 daily.html
└── assets/
    ├── gallery/
    └── images/
```

## 本地预览

这个网站不需要数据库、不需要后台服务器，也不需要构建工具。

直接打开 `index.html` 可以预览。也可以在项目根目录运行：

```bash
python -m http.server 8000
```

然后打开：

```text
http://localhost:8000
```

## 部署到 GitHub Pages

1. 把文件推送到 GitHub 仓库。
2. 进入仓库 `Settings` -> `Pages`。
3. 选择 `Deploy from a branch`。
4. 选择 `main` 分支和根目录。
5. 等待 GitHub Pages 自动发布。

当前线上地址：

```text
https://13894851721.github.io/kierans-learning-notes/
```

## 网页写文章

后台页面：

```text
admin.html
```

线上后台：

```text
https://13894851721.github.io/kierans-learning-notes/admin.html
```

后台会把文章保存到 `posts.json`。首页、分类页和文章详情页会自动读取这个文件。

### GitHub Token

因为 GitHub Pages 是静态网站，没有服务器后台，所以保存文章需要使用 GitHub API。

建议创建 Fine-grained personal access token：

1. GitHub -> `Settings`
2. `Developer settings`
3. `Personal access tokens` -> `Fine-grained tokens`
4. 只选择仓库：`kierans-learning-notes`
5. 权限只开启：
   - `Contents`: Read and write
   - `Metadata`: Read-only
6. 生成 token 后，在 `admin.html` 页面输入。

不要把 token 写进代码，也不要提交到 GitHub 仓库。

## 首页小组件

首页包含：

- 日期
- 农历日期
- 轻量黄历
- 天气

说明：

- 日期和农历使用浏览器本地能力生成。
- 天气使用 Open-Meteo 免费接口，不需要 API key。
- 如果浏览器定位失败，会默认显示上海天气。
- 轻量黄历只是生活化提示，不是严肃万年历。

## 如何更新相册

相册页是：

```text
gallery.html
```

真实照片可以放到：

```text
assets/gallery/
```

然后把 `gallery.html` 中的图片路径替换成你的照片文件名即可。

## 推荐文章模板

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

- 增加相册后台管理。
- 增加站内搜索。
- 增加标签页。
- 增加 RSS 或更新日志。
- 绑定自定义域名。
