# 见世界 · See the World

面向软工学生的**技术成长平台**小程序 —— 用 AI 帮学生理解技术趋势、选型、就业与学习路径。

> 大学生软件工程大赛参赛项目 · 微信云开发 + DeepSeek

---

## ✨ 核心亮点

| 模块 | 能力 |
|---|---|
| 🧠 AI 实时生成 | 点开任意热点 / 讨论 / 技能 / 学习路径 → 调用 **DeepSeek** 实时生成深度解读（带 7 天缓存） |
| 📊 数据可视化 | Canvas 2D 绘制的折线图 + 条形图 + 技能热力图，支持城市/经验筛选联动 |
| 🎯 个性化成长 | AI 驱动的技能路径树，随学习进度动态解锁 |
| 🔒 Serverless | 微信云开发 + 15 个云函数，零运维、API Key 零泄露 |
| 💾 三模式切换 | `mock / cloud / http` 一键切换，本地开发也能完整演示 |

---

## 🏗 技术架构

```
小程序前端 (WXML/WXSS/JS)
   │
   ├─ api/index.js        统一接口门面
   └─ utils/
      ├─ request.js       mock / cloud / http 三模式路由
      └─ cloudRouter.js   云数据库 + 云函数调用
         │
         ▼
   微信云开发
   ├─ 12 个集合  (users / hotspots / discussions / skills / details ...)
   └─ 15 个云函数 (login / aiSummary / aiDetail / aiChallenge / seedData ...)
                  │
                  ▼
            DeepSeek Chat API
            (API Key 仅在云函数环境变量)
```

---

## 📱 页面结构

| Tab | 页面 | 说明 |
|---|---|---|
| 趋势 | `pages/trends` | 今日热点横滑卡 + 最新讨论列表 + 收藏按钮 |
| AI 分析 | `pages/ai-analysis` | DeepSeek 深度综述 + 技术依赖图 + 推荐学习路径 + 转竞赛选题 |
| 数据 | `pages/dataviz` | AI 岗位需求折线 + 角色薪资条形 + 技能热力图 |
| 成长 | `pages/growth` | AI 驱动的个性化技能路径（4 个节点动态解锁） |
| 我的 | `pages/profile` | 头像(云存储) + 学习记录 + 雷达图 + 职业画像 |

**衍生页**
- `pages/detail` — 通用详情页，按 type 实时调 AI 生成内容
- `pages/edit-profile` — 编辑资料（支持微信原生昵称）
- `pages/favorites` — 收藏列表（按类型筛选）
- `pages/history` — 浏览历史（按日期分组时间线）
- `pages/settings` — 设置（退出/清缓存/关于）
- `pkg-search/pages/search` — 搜索（分包，预加载）

---

## 🚀 如何运行

### 方式 A：本地 mock（秒启动，无需云端）
1. 微信开发者工具导入本仓库根目录
2. `miniprogram/config/index.js` 保持 `mode: 'mock'`
3. 直接编译运行 —— 所有功能都能点（数据走内存 mock）

### 方式 B：接入真实云端 + AI
详见 [`CLOUD_SETUP.md`](./CLOUD_SETUP.md) —— 30 分钟完成：
1. 开通云开发环境
2. 创建 12 个集合 + 设权限规则
3. 上传 15 个云函数
4. 给 AI 函数配 `DEEPSEEK_KEY` 环境变量
5. 跑 `seedData` 导入种子数据
6. `config/index.js` 切 `mode: 'cloud'`

---

## 📂 目录结构

```
project/
├─ project.config.json          微信开发者工具配置
├─ CLOUD_SETUP.md              云开发部署指南（30 分钟）
├─ miniprogram/                 小程序代码
│  ├─ app.js / app.json / app.wxss
│  ├─ config/index.js           mock / cloud / http 三模式入口
│  ├─ api/                      接口门面
│  ├─ utils/                    request / cloudRouter / storage
│  ├─ mocks/                    本地 mock 数据
│  ├─ components/               共享组件（top-bar / skeleton）
│  ├─ pages/                    主包页面
│  ├─ pkg-search/               搜索分包
│  └─ assets/tab/               tabBar 图标
└─ cloudfunctions/              云函数（15 个）
   ├─ login / updateProfile / profileStats
   ├─ aiSummary / aiPaths / aiChallenge / aiDetail
   ├─ seedData
   ├─ getGrowthPath / continueLearning
   ├─ search
   ├─ favoriteToggle / readRecord
   └─ listFavorites / listReadHistory
```

---

## 🔐 安全说明

- **不要把 DeepSeek API Key 提交到代码**。本项目所有 AI 云函数都读 `process.env.DEEPSEEK_KEY`，Key 只在云函数控制台的环境变量里。
- 用户数据通过 `_openid` + 集合安全规则实现原生隔离。
- 本仓库 `appid` 是公开信息（小程序包体本就能看到），无敏感性。

---

## 📝 License

MIT
