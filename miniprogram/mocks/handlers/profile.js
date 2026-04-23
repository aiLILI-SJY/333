module.exports = [
  {
    method: 'GET',
    match: (url) => url === '/profile/stats',
    handle: () => ({
      read: { count: 142, target: 200, deltaPct: 12 },
      radar: [
        { label: '算法', value: 0.85 },
        { label: '系统设计', value: 0.7 },
        { label: '数据可视化', value: 0.4 },
        { label: '机器学习', value: 0.6 },
        { label: '云原生', value: 0.75 }
      ],
      career: {
        title: 'AI 算法工程师',
        tags: ['PyTorch', 'Computer Vision', 'LLMs', 'Optimization']
      }
    })
  }
];
