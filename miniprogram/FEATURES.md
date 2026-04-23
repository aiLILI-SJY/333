# 见世界（See the World）— 功能清单

> 基于 `stitch_seeworld_tech_growth_platform` UI 稿整理。
> 第一步：UI 已按以下结构完成搭建，所有交互均为占位（Toast/Modal）。
> 第二步：按功能编号逐项替换为真实业务逻辑 + 后端对接。

## 全局

| 编号 | 功能 | 当前状态 | 第二步计划 |
| --- | --- | --- | --- |
| G-1 | 底部 tabBar 5 宫格（趋势 / AI 分析 / 数据 / 成长 / 我的） | UI 完成；需放置 PNG 图标 | 设计完成后替换 `assets/tab/*.png` |
| G-2 | 顶部栏（头像 + 见世界 + 搜索） | 组件 `components/top-bar` 通用化 | 搜索跳转全局搜索页；头像点击跳我的 |
| G-3 | 全局配色/字体 Design Token | 在 `app.wxss` 以 CSS 变量承载 | 支持夜间主题（后续） |
| G-4 | 用户信息（名字、学校、年级） | `app.js globalData.userInfo` 静态 | 登录后拉取 `wx.login` + 服务端用户资料 |

---

## 页 1 · 趋势 Trends (`pages/trends`)

源：`_1/code.html`

| 编号 | 模块 | 交互 | 第二步计划 |
| --- | --- | --- | --- |
| T-1 | 欢迎信息 | 展示"软件工程师 2502" | 从用户资料读取班级/身份 |
| T-2 | 搜索框 | 输入、回车触发 `onSearchConfirm` | 调用搜索接口，跳转结果页 |
| T-3 | 今日热点（横向滑动卡片） | 卡片点击 `onHotspotTap(id)` | 跳转 `pages/hotspot-detail?id=` |
| T-4 | 查看全部（热点） | `onMoreHotspots` | 跳转热点列表页 |
| T-5 | 最新讨论列表 | `onDiscussionTap(id)` | 跳转讨论详情；支持下拉刷新/分页 |

---

## 页 2 · AI 分析 (`pages/ai-analysis`)

源：`ai/code.html`

| 编号 | 模块 | 交互 | 第二步计划 |
| --- | --- | --- | --- |
| A-1 | 核心综述（AI 摘要） | 静态三条要点 | 接入 DeepSeek API 动态生成 |
| A-2 | 技术依赖图 | 静态结构 | 接入后端依赖分析 JSON，转为动态节点渲染；可用 canvas 重绘 |
| A-3 | 推荐学习路径（主路径） | `onPathTap('python')` | 跳详情/打开学习计划 |
| A-4 | 推荐学习路径（副路径） | `onPathTap(id)` | 同上 |
| A-5 | FAB：转化为竞赛选题 | `onConvertToChallenge` 弹窗确认 | 调用服务端生成竞赛选题接口 |

---

## 页 3 · 数据可视化 (`pages/dataviz`)

源：`_2/code.html`

| 编号 | 模块 | 交互 | 第二步计划 |
| --- | --- | --- | --- |
| D-1 | 城市筛选 Picker | `onCityChange` 切换索引 | 触发图表数据重新请求 |
| D-2 | 经验筛选 Picker | `onExpChange` | 同上 |
| D-3 | AI 岗位需求增长（折线图） | Canvas 2D 绘制静态折线 + 渐变填充 | 接入真实时间序列 API，带 tooltip/缩放 |
| D-4 | 各角色平均薪资（条形图） | view 拼接的水平条 | 后端返回排序数据；支持分维度切换 |
| D-5 | 热门技能热力图 | 三级等级 chip，点击 `onSkillTap(name)` | 跳转技能详情页；等级由岗位频率动态计算 |

---

## 页 4 · 成长（技能路径树）(`pages/growth`)

源：`_4/code.html`

| 编号 | 模块 | 交互 | 第二步计划 |
| --- | --- | --- | --- |
| GR-1 | AI 驱动技能路径头 | 静态文案 | 按用户画像生成个性化导语 |
| GR-2 | 自动刷新指示器（脉动小圆点） | CSS 动画 | 与后端 WebSocket/轮询同步刷新状态 |
| GR-3 | 节点：已完成 | 点击 Toast | 跳转技能总结页 |
| GR-4 | 节点：进行中（带进度条、预计时间、继续学习） | `onContinueLearn(id)` | 进入学习会话/打开课程 |
| GR-5 | 节点：未解锁 | 锁定 Toast 提示 | 引导完成前置任务 |

---

## 页 5 · 我的 Profile (`pages/profile`)

源：`_3/code.html`

| 编号 | 模块 | 交互 | 第二步计划 |
| --- | --- | --- | --- |
| P-1 | 头像 + 姓名 + 学校 | 静态字段 | `wx.login` 后回填；头像支持 `wx.chooseMedia` 上传 |
| P-2 | 身份标签（年级/专业） | 静态 chip | 后端字段 |
| P-3 | 学习记录（142/200） | 静态数字 + 进度条 | 阅读行为埋点聚合 |
| P-4 | 技能雷达图 | Canvas 2D 动态绘制 | 从"阅读/完成课程/项目"数据建模 |
| P-5 | 职业发展轨迹（AI 算法工程师 + 标签云） | 静态 | 后端返回匹配画像 + 置信度 |
| P-6 | 菜单（编辑资料/收藏/历史/设置） | `onMenuTap(id)` Toast | 每项独立子页面 |

---

## 第二步实现进度 ✅ 全部完成

1. ✅ **数据与登录**：G-4 + P-1 —— `app.js ensureLogin()`（wx.login + mock `/auth/login`），头像通过 `wx.chooseMedia` + `api.auth.uploadAvatar`；`app._listeners` 事件总线跨组件同步用户信息。
2. ✅ **数据接口层**：`utils/request.js` 封装 wx.request，支持 `config.useMock` 切换；所有 mock 数据迁到 `mocks/handlers/*.js`；API 门面在 `api/index.js`。
3. ✅ **核心图表**：折线图 `bindtouchstart/touchmove` 找最近数据点弹 tooltip；雷达图 `bindtap` 反推 atan2 命中维度，下方显示"掌握度 xx%"。
4. ✅ **AI 相关**：A-1/A-3/A-4 全部从 `/ai/summary` 和 `/ai/paths` 拉取；A-5 竞赛选题走 `/ai/challenge`，带 loading 状态、成功后 Modal 展示标题 + 预计周数 + 大纲。
5. ✅ **路径树动态化**：`/growth/path` 返回节点数组，wxml 按 `status` (done/progress/locked) 渲染；继续学习调 `/growth/continue` 建会话。
6. ✅ **搜索**：独立分包 `pkg-search/pages/search`，带历史（storage）+ 热门 + 结果类型标签；防抖 250ms；顶栏搜索图标一键跳入。
7. ✅ **列表分页**：trends 页 `onReachBottom` 翻页、`onPullDownRefresh` 刷新；mock 端共 30 条讨论可翻 3 页；footer 显示"加载中 / 没有更多了"。
8. ✅ **性能优化**：搜索页分包 + `preloadRule` 后台预加载；图片 `lazy-load`；首屏 `components/skeleton` 骨架屏；`lazyCodeLoading: "requiredComponents"`。

## 如何切换到真实后端

1. 打开 `config/index.js`：
   ```js
   useMock: false,
   baseURL: 'https://你的域名'
   ```
2. 在微信公众平台配置小程序合法域名（request、uploadFile）。
3. 后端接口按 `mocks/handlers/*.js` 的路由和返回约定实现；统一响应：`{ code: 0, data: ..., message: '' }`。
4. 鉴权 Header：`Authorization: Bearer <token>`；401 时前端自动清 token。

## 约定

- 单位：`rpx`（750rpx = 屏宽）。
- 字体：优先系统字体栈；标题用 Space Grotesk 语义（通过字重模拟）。
- 颜色：全部从 `page` 级 CSS 变量读取；新增颜色先加到 `app.wxss`。
- 图片：目前 `_1` 热点图用 Google 远程链接，上线需替换为己方 CDN。
- 图标：暂以 Unicode 符号/Emoji 占位，正式版本引入 iconfont。
