# 见世界 · 云开发部署指南

你现在已经拥有了完整的云开发代码。**按顺序做下面 8 步**，即可让小程序真的跑在云端。第一次做大概 30 分钟。

---

## 目录结构说明

```
project/                          ← 用开发者工具导入这个目录
├─ project.config.json            ← 根目录的（含 cloudfunctionRoot）
├─ miniprogram/                   ← 小程序代码
└─ cloudfunctions/                ← 云函数代码（10 个函数）
   ├─ login/
   ├─ updateProfile/
   ├─ profileStats/
   ├─ aiSummary/
   ├─ aiPaths/
   ├─ aiChallenge/
   ├─ seedData/
   ├─ getGrowthPath/
   ├─ continueLearning/
   ├─ search/
   ├─ favoriteToggle/
   └─ readRecord/
```

---

## Step 1：用开发者工具导入项目

1. 打开微信开发者工具 → "导入项目"
2. 目录选 `D:\Users\Lenovo\Desktop\project\`（**不是** miniprogram 子目录）
3. AppID 会自动读到 `wxaa0ccea31d50bcda`
4. 名称随意（如"见世界"）

---

## Step 2：开通云开发环境

1. 左侧工具栏 → 点"**云开发**"按钮 → 开通
2. 新建环境：名字随意（如 `see-the-world-dev`），选"按量付费"里的**免费额度**
3. 创建完后，页面顶部会显示**环境 ID**（类似 `cloud1-4g9xxxxxxx`），**复制下来**
4. 回到代码，编辑 `miniprogram/config/index.js`：
   ```js
   mode: 'cloud',                       // 改成 cloud
   cloudEnv: 'cloud1-4g9xxxxxxx',       // 粘贴你的环境 ID
   ```

---

## Step 3：创建 10 个集合

在云开发控制台 → 数据库 → 点"+"新建集合（每个都要建）：

- `users`
- `hotspots`
- `discussions`
- `skills`
- `search_hot`
- `growth_template`
- `growth_progress`
- `ai_paths`
- `ai_conversations`
- `favorites`
- `read_history`
- `details`           ← 详情页 AI 生成内容缓存（7天TTL）

### 权限规则（每个集合都要设置）

点集合名 → "权限设置" → 选"自定义安全规则"：

**用户私有数据**（`users` / `growth_progress` / `favorites` / `read_history` / `ai_conversations`）：
```json
{
  "read": "doc._openid == auth.openid",
  "write": "doc._openid == auth.openid"
}
```

**公共只读数据**（`hotspots` / `discussions` / `skills` / `search_hot` / `growth_template` / `ai_paths` / `details`）：
```json
{
  "read": true,
  "write": false
}
```

写入通过云函数的管理员权限即可（云函数绕过规则）。

---

## Step 4：上传并部署所有云函数

回到开发者工具：

1. 右键 `cloudfunctions` 目录 → 选择要绑定的云环境（第一次会让你选）
2. **第一个函数慢一点**：右键 `cloudfunctions/login/` → "上传并部署：云端安装依赖"
3. 等待大约 30 秒到 1 分钟，下方"云开发"面板会显示"上传成功"
4. 重复对其余 14 个函数做同样操作：
   - `updateProfile`
   - `profileStats`
   - `aiSummary`
   - `aiPaths`
   - `aiChallenge`
   - `aiDetail`              ← 详情页 AI 实时生成（需配 DEEPSEEK_KEY）
   - `seedData`
   - `getGrowthPath`
   - `continueLearning`
   - `search`
   - `favoriteToggle`
   - `readRecord`
   - `listFavorites`         ← 收藏列表
   - `listReadHistory`       ← 阅读历史

> 如果忘了选择环境，右键 `cloudfunctions` 目录会有"更多设置"里的"当前环境"。

---

## Step 5：给 AI 云函数配置 DeepSeek Key（**关键，不要跳过**）

> 你已经知道之前在对话里暴露过一次 key，先去 https://platform.deepseek.com 把旧的删掉，生成新的。

云开发控制台 → 云函数 → 点 `aiSummary` → "函数配置" → 环境变量 → 添加：

| Key | Value |
|---|---|
| `DEEPSEEK_KEY` | `sk-你新生成的key` |

**同样的操作对 `aiChallenge` 和 `aiDetail` 也做一次**（三个 AI 函数都需要同一个 key）。

保存后会自动热加载，无需重新上传代码。

---

## Step 6：跑种子数据

1. 云开发控制台 → 云函数 → 点 `seedData`
2. 切到"**云端测试**"标签
3. 测试参数填：
   ```json
   { "reset": true }
   ```
4. 点"运行测试"。等几秒，返回 `{ ok: true, report: {...} }` 即种子数据导入成功。

回到 `数据库` → 每个集合应该能看到数据：
- hotspots: 3 条
- discussions: 20 条
- skills: 13 条
- search_hot: 6 条
- growth_template: 4 条
- ai_paths: 1 条

---

## Step 7：小程序端验证

1. 在开发者工具里 `Ctrl+S` 重新编译
2. 点"编译" → 小程序启动
3. 五个 tab 应该都能拉到真实数据：
   - **趋势**：看到 3 个热点卡 + 讨论列表 + 收藏按钮（☆/★）
   - **AI 分析**：综述/路径从云函数拉取；下拉刷新会重新调 DeepSeek
   - **数据可视化**：折线/条形/热力图从云数据库读
   - **成长**：路径从 `growth_template` + 当前用户的 `growth_progress` 合并
   - **我的**：阅读计数 = `read_history` count；雷达 = `users.radar` 字段

---

## Step 8：测试"转化为竞赛选题"

1. AI 分析页右下 FAB → "转化为竞赛选题"
2. 确认 → 会调 `aiChallenge` → DeepSeek 实时生成
3. 成功后弹 Modal 显示标题 + 大纲 + 预计周数
4. 云开发控制台 `ai_conversations` 集合会看到这次对话记录

---

## 回切 mock 模式

开发期不想联网？改 `miniprogram/config/index.js`：
```js
mode: 'mock'
```
立即所有页面走本地数据，不调任何云函数。

---

## 常见问题

### Q: `[cloud] 请在 config/index.js 填入 cloudEnv`
→ Step 2 没做。补上 `cloudEnv`。

### Q: 云函数返回 `{ __error: 'xxx permission denied' }`
→ 集合权限没设。Step 3 检查"自定义安全规则"。

### Q: `aiSummary` 超时
→ DeepSeek 网络慢或 key 错。去云函数日志看错误。

### Q: `tabBar icon 未找到`
→ `miniprogram/assets/tab/` 下需要有 10 个 PNG。之前已生成，检查是否在。

### Q: seedData 报 `collection not found`
→ Step 3 的集合还没建完。补建后再跑。

### Q: 种子数据想重跑
→ `seedData` 测试参数 `{ "reset": true }` 会先清空再插。`{}` 则是追加。

---

## 比赛答辩亮点（照着讲）

1. **三模式架构**（`config.mode`）：mock 快速迭代 → cloud 演示 → http 预留商业部署
2. **Serverless**：无服务器运维，11 个云函数自动弹性
3. **零信任密钥管理**：DeepSeek Key 仅云函数可见，前端代码 grep 不到
4. **数据权限原生隔离**：`_openid` 自动注入 + 集合安全规则，0 行权限代码
5. **AI 审计**：每次 AI 调用进 `ai_conversations` 集合，支持回放与质量评估
6. **增量式切换**：mock 和 cloud 共用同一套 `api/*`，切换只改 1 行

---

## 成本估算（满打满算）

| 资源 | 免费额度/月 | 你的典型用量 |
|---|---|---|
| 云函数调用 | 40 万次 | 比赛 3 个月 < 1 万次 |
| 云数据库读 | 50 万次 | < 5 万次 |
| 云数据库写 | 30 万次 | < 5 千次 |
| 云存储 | 5 GB | < 100 MB |
| DeepSeek API | — | ¥0.001/次，充 10 元够答辩几十次 |

**总成本：DeepSeek 10 元，其余全免费。**
