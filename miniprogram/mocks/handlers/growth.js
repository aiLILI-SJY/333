module.exports = [
  {
    method: 'GET',
    match: (url) => url === '/growth/path',
    handle: () => ({
      refreshedAt: Date.now(),
      nodes: [
        {
          id: 'foundation',
          title: '基础开发基石',
          tag: '已完成',
          tagTone: 'neutral',
          status: 'done',
          dotIcon: '✓',
          desc: '核心算法、数据结构和基础编程范式。'
        },
        {
          id: 'ai-adaptation',
          title: 'AI 场景适配',
          tag: '高优先级',
          tagTone: 'warn',
          status: 'progress',
          dotIcon: '→',
          desc: '将大语言模型（LLM）、提示词工程和基础神经网络概念整合到标准工作流中。',
          progress: 65,
          eta: '4 周'
        },
        {
          id: 'ai-engineering',
          title: 'AI 工程化实战',
          tag: '下一阶段',
          tagTone: 'neutral',
          status: 'locked',
          dotIcon: '🔒',
          desc: '构建自定义模型、高级微调以及可扩展的机器学习基础设施。'
        },
        {
          id: 'ai-leadership',
          title: 'AI 工程领导力',
          tag: '远期',
          tagTone: 'neutral',
          status: 'locked',
          dotIcon: '🔒',
          desc: '主导跨职能 AI 项目，设计评估体系与团队协作流程。'
        }
      ]
    })
  },
  {
    method: 'POST',
    match: (url) => url === '/growth/continue',
    handle: ({ data }) => ({
      ok: true,
      sessionId: 'sess-' + Date.now(),
      nodeId: data.id
    })
  }
];
