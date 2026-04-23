const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

// 导入种子数据到云数据库。
// 调用方式：在云开发控制台 - 云函数 - seedData - "云端测试" - 传 { reset: true } 即可。
// reset=true 会先清空各集合再写入。
exports.main = async (event) => {
  const reset = !!event.reset;
  const report = {};

  const collections = {
    hotspots: HOTSPOTS,
    discussions: DISCUSSIONS,
    skills: SKILLS,
    search_hot: SEARCH_HOT,
    growth_template: GROWTH_TEMPLATE,
    ai_paths: AI_PATHS
  };

  for (const [name, data] of Object.entries(collections)) {
    try {
      if (reset) await clearCollection(name);
      let n = 0;
      for (const doc of data) {
        // add 一次性最多 1000，这里数据量小，循环即可
        await db.collection(name).add({ data: doc });
        n++;
      }
      report[name] = { ok: true, inserted: n };
    } catch (err) {
      report[name] = { ok: false, error: err.message || String(err) };
    }
  }
  return { ok: true, report };
};

async function clearCollection(name) {
  // 云数据库没有一键清空，分批取 100 条删
  while (true) {
    const { data } = await db.collection(name).limit(100).get();
    if (data.length === 0) return;
    await Promise.all(data.map((d) => db.collection(name).doc(d._id).remove()));
    if (data.length < 100) return;
  }
}

// ==================== 种子数据 ====================

const HOTSPOTS = [
  {
    hotspotId: 'llm-orchestration',
    sort: 1,
    title: 'LLM 编排框架',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbwJj1Kg3fzrLrROaWTyk5ycfxDZJxnYM_p15JBcIe6ZgjbVoRP-bqcUT6VFApDN239D0N1n-ejHZi4ftQB2SfmrEdLK73kboB1sCwpghp9udDHBNWQdBgbctP1bZoygxb9-5UUzWPAaJD9Np6roD4t_6Vrk1EjewVNOeQVJBfAjYjRF_zi4A4GmY1GHGDBdxDUQ3BBddg9zFsxxuuevaprhUg4ZxtQOYA5K97G_Nj5-19dfh06K7zyqiX3ZZl_TVHGldqPNx7EhM',
    badge: '趋势',
    badgeType: 'fire',
    badgeIcon: '🔥',
    tags: ['LangChain', 'AI 摘要']
  },
  {
    hotspotId: 'rust-backend',
    sort: 2,
    title: 'Rust 后端系统',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt28ZOM15EH6zvbi0jP2sD5UfgloDGdUTSJpFVqoI6rmYf0T6aOy31qzyC2yQWIptsx3kjlPBxcBk1Z2Q9tq8tWOSyGPPvT-THT-HSojYJJ-eD-k8uKpS6lzAnjXO1FOdgnUBsUQx7rYk56qvuwoXhbJJBuTIw4C5M2q_ezcAjatzIPAvcD2kWxBXbik6w-mDFyHIV9OgkG4UGcYxk9bGKhD0FreXKI0GZ_GEfhQXWZ4QX8-8Lm2-11yrJs2_daDwOE41d4x5x81k',
    badge: '上升',
    badgeType: 'up',
    badgeIcon: '📈',
    tags: ['性能', '内存安全']
  },
  {
    hotspotId: 'edge-ai',
    sort: 3,
    title: '边缘侧 AI 推理',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbwJj1Kg3fzrLrROaWTyk5ycfxDZJxnYM_p15JBcIe6ZgjbVoRP-bqcUT6VFApDN239D0N1n-ejHZi4ftQB2SfmrEdLK73kboB1sCwpghp9udDHBNWQdBgbctP1bZoygxb9-5UUzWPAaJD9Np6roD4t_6Vrk1EjewVNOeQVJBfAjYjRF_zi4A4GmY1GHGDBdxDUQ3BBddg9zFsxxuuevaprhUg4ZxtQOYA5K97G_Nj5-19dfh06K7zyqiX3ZZl_TVHGldqPNx7EhM',
    badge: '新',
    badgeType: 'fire',
    badgeIcon: '✨',
    tags: ['WebGPU', 'ONNX']
  }
];

const DISC_TEMPLATES = [
  { category: '大厂动态', chipTone: 'primary', iconTone: 'primary', iconText: '🔌',
    title: '大型应用向服务端驱动 UI 的转变',
    desc: '分析企业如何减少客户端逻辑以加快迭代速度，并统一移动端与Web端体验。',
    readTime: '3分钟阅读' },
  { category: '架构设计', chipTone: '', iconTone: 'neutral', iconText: '{}',
    title: '微前端：它们值得增加的复杂性成本吗？',
    desc: '深入探讨将单体前端代码库跨自治团队拆分的利弊。',
    readTime: '5分钟阅读' },
  { category: '性能优化', chipTone: 'success', iconTone: 'success', iconText: '⚡',
    title: 'WebAssembly 渗透主流企业工具',
    desc: 'Wasm 如何在浏览器内直接为重计算任务实现接近原生性能。',
    readTime: '2分钟阅读' },
  { category: 'AI 工程', chipTone: 'primary', iconTone: 'primary', iconText: '🧠',
    title: 'RAG 架构在企业知识库的落地实践',
    desc: '从向量库选型到召回-精排的全链路取舍。',
    readTime: '6分钟阅读' },
  { category: '开发者体验', chipTone: '', iconTone: 'neutral', iconText: '⚙',
    title: 'Monorepo 在中小团队是否值得？',
    desc: 'Turborepo / Nx 的取舍清单。',
    readTime: '4分钟阅读' }
];
const DISCUSSIONS = [];
for (let i = 0; i < 20; i++) {
  const t = DISC_TEMPLATES[i % DISC_TEMPLATES.length];
  DISCUSSIONS.push({
    discId: `disc-${i + 1}`,
    ...t,
    createdAt: new Date(Date.now() - i * 3600e3)
  });
}

const SKILLS = [
  { name: 'PyTorch', level: 'high' },
  { name: 'Docker', level: 'high' },
  { name: 'Python', level: 'high' },
  { name: 'Cloud Native', level: 'mid' },
  { name: 'Kubernetes', level: 'mid' },
  { name: 'React', level: 'mid' },
  { name: 'TensorFlow', level: 'mid' },
  { name: 'Go', level: 'mid' },
  { name: 'GraphQL', level: 'low' },
  { name: 'Rust', level: 'low' },
  { name: 'CUDA', level: 'low' },
  { name: 'Kafka', level: 'low' },
  { name: 'MongoDB', level: 'low' }
];

const SEARCH_HOT = [
  { keyword: 'PyTorch' },
  { keyword: 'LLM' },
  { keyword: 'Rust 后端' },
  { keyword: 'Kubernetes' },
  { keyword: 'RAG' },
  { keyword: '服务端驱动 UI' }
];

const GROWTH_TEMPLATE = [
  {
    nodeId: 'foundation',
    order: 1,
    title: '基础开发基石',
    tag: '已完成',
    tagTone: 'neutral',
    dotIcon: '✓',
    desc: '核心算法、数据结构和基础编程范式。',
    defaultStatus: 'done'
  },
  {
    nodeId: 'ai-adaptation',
    order: 2,
    title: 'AI 场景适配',
    tag: '高优先级',
    tagTone: 'warn',
    dotIcon: '→',
    desc: '将大语言模型（LLM）、提示词工程和基础神经网络概念整合到标准工作流中。',
    defaultStatus: 'progress',
    defaultProgress: 65,
    eta: '4 周'
  },
  {
    nodeId: 'ai-engineering',
    order: 3,
    title: 'AI 工程化实战',
    tag: '下一阶段',
    tagTone: 'neutral',
    dotIcon: '🔒',
    desc: '构建自定义模型、高级微调以及可扩展的机器学习基础设施。',
    defaultStatus: 'locked'
  },
  {
    nodeId: 'ai-leadership',
    order: 4,
    title: 'AI 工程领导力',
    tag: '远期',
    tagTone: 'neutral',
    dotIcon: '🔒',
    desc: '主导跨职能 AI 项目，设计评估体系与团队协作流程。',
    defaultStatus: 'locked'
  }
];

const AI_PATHS = [{
  primary: {
    id: 'python',
    title: '优先学习 Python 工程化',
    desc: '基于依赖关系分析，Python 是连接后端编排与新兴 AI 工具链的关键桥梁。掌握它可解锁增加 68% 的相关职业发展路径。',
    icon: '⌨',
    cta: '开始学习'
  },
  secondary: [
    { id: 'sql', step: 2, icon: '🗄', tone: 'success', title: '高级 SQL 建模', progress: 33 },
    { id: 'bedrock', step: 3, icon: '☁', tone: 'tertiary', title: 'AWS Bedrock 基础', progress: 0 }
  ]
}];
