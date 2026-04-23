const { details, applyPlaceholders } = require('../data/details.js');

module.exports = [
  {
    method: 'GET',
    match: (url) => url === '/ai/summary',
    handle: () => ({
      generatedAt: Date.now(),
      model: 'deepseek-v3',
      items: [
        { strong: 'Python 在编排层的主导地位不断巩固',
          rest: '，这主要是由 AI 整合需求驱动的，而非纯粹的后端服务架构。' },
        { strong: '前端复杂度趋于平稳',
          rest: '；市场正转向元框架（如 Next.js, Nuxt），以减少客户端状态管理的认知负荷。' },
        { strong: '数据工程混合角色',
          rest: '正在显现，成为中级软件工程师向领导层过渡的最高增长矢量。' }
      ]
    })
  },
  {
    method: 'GET',
    match: (url) => url === '/ai/paths',
    handle: () => ({
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
    })
  },
  {
    method: 'POST',
    match: (url) => url === '/ai/challenge',
    handle: () => ({
      id: 'chal-' + Date.now(),
      title: '基于 LLM 的代码依赖分析工具',
      outline: [
        '目标：使用 Python + LangChain 搭建依赖图生成器',
        '技术栈：PyTorch 可选 / Graphviz / FastAPI',
        '产出：学生可提交到大学生软件工程竞赛的题解文档 + 原型',
        '评估：依赖覆盖率、图结构可读性、AI 洞察质量'
      ],
      estimatedWeeks: 6
    })
  },
  {
    method: 'POST',
    match: (url) => url === '/ai/detail',
    handle: ({ data }) => {
      const { type, id, meta } = data || {};
      if (!type || !id) return { __error: '缺少 type 或 id 参数' };

      const bucket = details[type] || {};
      // id 可能被 encodeURIComponent 过（如技能名），做一次 decode 兜底
      let content = bucket[id] || bucket[decodeURIComponent(id)];

      if (!content) {
        const tmpl = details._fallback[type] || details._fallback.skill;
        content = applyPlaceholders(tmpl, {
          title: (meta && meta.title) || id,
          id
        });
      }

      return {
        ...content,
        generatedAt: Date.now(),
        __cached: false,
        model: 'demo-preset'
      };
    }
  }
];
