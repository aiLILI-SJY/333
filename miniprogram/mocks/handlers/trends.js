const HOTSPOTS_ALL = [
  {
    id: 'llm-orchestration',
    title: 'LLM 编排框架',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbwJj1Kg3fzrLrROaWTyk5ycfxDZJxnYM_p15JBcIe6ZgjbVoRP-bqcUT6VFApDN239D0N1n-ejHZi4ftQB2SfmrEdLK73kboB1sCwpghp9udDHBNWQdBgbctP1bZoygxb9-5UUzWPAaJD9Np6roD4t_6Vrk1EjewVNOeQVJBfAjYjRF_zi4A4GmY1GHGDBdxDUQ3BBddg9zFsxxuuevaprhUg4ZxtQOYA5K97G_Nj5-19dfh06K7zyqiX3ZZl_TVHGldqPNx7EhM',
    badge: '趋势',
    badgeType: 'fire',
    badgeIcon: '🔥',
    tags: ['LangChain', 'AI 摘要']
  },
  {
    id: 'rust-backend',
    title: 'Rust 后端系统',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt28ZOM15EH6zvbi0jP2sD5UfgloDGdUTSJpFVqoI6rmYf0T6aOy31qzyC2yQWIptsx3kjlPBxcBk1Z2Q9tq8tWOSyGPPvT-THT-HSojYJJ-eD-k8uKpS6lzAnjXO1FOdgnUBsUQx7rYk56qvuwoXhbJJBuTIw4C5M2q_ezcAjatzIPAvcD2kWxBXbik6w-mDFyHIV9OgkG4UGcYxk9bGKhD0FreXKI0GZ_GEfhQXWZ4QX8-8Lm2-11yrJs2_daDwOE41d4x5x81k',
    badge: '上升',
    badgeType: 'up',
    badgeIcon: '📈',
    tags: ['性能', '内存安全']
  },
  {
    id: 'edge-ai',
    title: '边缘侧 AI 推理',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbwJj1Kg3fzrLrROaWTyk5ycfxDZJxnYM_p15JBcIe6ZgjbVoRP-bqcUT6VFApDN239D0N1n-ejHZi4ftQB2SfmrEdLK73kboB1sCwpghp9udDHBNWQdBgbctP1bZoygxb9-5UUzWPAaJD9Np6roD4t_6Vrk1EjewVNOeQVJBfAjYjRF_zi4A4GmY1GHGDBdxDUQ3BBddg9zFsxxuuevaprhUg4ZxtQOYA5K97G_Nj5-19dfh06K7zyqiX3ZZl_TVHGldqPNx7EhM',
    badge: '新',
    badgeType: 'fire',
    badgeIcon: '✨',
    tags: ['WebGPU', 'ONNX']
  },
  {
    id: 'sdui',
    title: '服务端驱动 UI',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt28ZOM15EH6zvbi0jP2sD5UfgloDGdUTSJpFVqoI6rmYf0T6aOy31qzyC2yQWIptsx3kjlPBxcBk1Z2Q9tq8tWOSyGPPvT-THT-HSojYJJ-eD-k8uKpS6lzAnjXO1FOdgnUBsUQx7rYk56qvuwoXhbJJBuTIw4C5M2q_ezcAjatzIPAvcD2kWxBXbik6w-mDFyHIV9OgkG4UGcYxk9bGKhD0FreXKI0GZ_GEfhQXWZ4QX8-8Lm2-11yrJs2_daDwOE41d4x5x81k',
    badge: '上升',
    badgeType: 'up',
    badgeIcon: '📈',
    tags: ['Figma-to-Code', '动态渲染']
  }
];

const DISCUSSIONS_ALL = [];
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
// 生成 30 条讨论数据用来分页
for (let i = 0; i < 30; i++) {
  const t = DISC_TEMPLATES[i % DISC_TEMPLATES.length];
  DISCUSSIONS_ALL.push(Object.assign({ id: `disc-${i + 1}` }, t));
}

module.exports = [
  {
    method: 'GET',
    match: (url) => url.startsWith('/trends/hotspots'),
    handle: ({ data }) => {
      const page = Number(data.page || 1);
      const pageSize = Number(data.pageSize || 10);
      const start = (page - 1) * pageSize;
      const slice = HOTSPOTS_ALL.slice(start, start + pageSize);
      return { list: slice, total: HOTSPOTS_ALL.length, page, pageSize };
    }
  },
  {
    method: 'GET',
    match: (url) => url.startsWith('/trends/discussions'),
    handle: ({ data }) => {
      const page = Number(data.page || 1);
      const pageSize = Number(data.pageSize || 10);
      const start = (page - 1) * pageSize;
      const slice = DISCUSSIONS_ALL.slice(start, start + pageSize);
      return {
        list: slice,
        total: DISCUSSIONS_ALL.length,
        page,
        pageSize,
        hasMore: start + pageSize < DISCUSSIONS_ALL.length
      };
    }
  }
];
