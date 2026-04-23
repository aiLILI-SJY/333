# 见世界 · 微信小程序

基于 `stitch_seeworld_tech_growth_platform` UI 稿实现的软工学生技术成长平台。

## 目录结构

```
miniprogram/
├─ app.js / app.json / app.wxss       全局入口、tabBar、设计系统 CSS 变量
├─ sitemap.json / project.config.json 小程序配置
├─ components/top-bar/                顶部栏（头像 + 见世界 + 搜索）共享组件
├─ pages/
│  ├─ trends/          趋势摘要（首页）
│  ├─ ai-analysis/     AI 分析（DeepSeek 深度解读）
│  ├─ dataviz/         就业数据可视化（折线 / 条形 / 技能热力）
│  ├─ growth/          个性化技能路径树
│  └─ profile/         个人中心（头像 / 学习记录 / 雷达图）
├─ assets/tab/         tabBar 图标占位（需手动放入 PNG，见此目录 README）
├─ FEATURES.md         功能清单（第二步要实现的功能）
└─ README.md
```

## 运行

1. 打开 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)。
2. 选择"导入项目" → 目录指向本文件夹 `D:\Users\Lenovo\Desktop\project\miniprogram`。
3. AppID 可勾选"测试号"或使用自己的 AppID。
4. 首次编译前在 `assets/tab/` 放置 10 个 PNG 占位图标（见 `assets/tab/README.md`），否则 tabBar 会报图标缺失。

## 设计系统

所有 token 统一在 `app.wxss` 的 `page {}` 中以 CSS 变量形式暴露：

```
--color-primary: #1A73E8
--color-secondary: #006e2a (Growth Green)
--color-bg: #F8F9FA
--color-surface: #FFFFFF
--color-text-secondary: #5F6368
...
```

文字样式工具类：`.h1 / .h2 / .h3 / .body-lg / .body-md / .body-sm / .label-caps`。

## 第一步（已完成）

- [x] 项目骨架（app.json / tabBar / 全局样式变量）
- [x] 5 个页面 UI：趋势 / AI 分析 / 数据 / 成长 / 我的
- [x] 共享顶部栏组件
- [x] 折线图 / 雷达图（canvas 2d 动态绘制）
- [x] 条形图 / 路径树 / 热力图（view + wxss 实现）
- [x] 功能清单文档 `FEATURES.md`

## 第二步（待开发）

详见 `FEATURES.md` — 按编号逐项接入后端接口与真实交互。
