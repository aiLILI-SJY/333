// 生成随机波动但趋势向上的序列
function buildSeries(city, exp) {
  // 根据筛选条件加偏移，模拟数据联动
  const cityBias = { 'all': 1, '北京': 1.2, '上海': 1.15, '深圳': 1.1, '贵阳': 0.75, '杭州': 1.05 }[city] || 1;
  const expBias = { 'all': 1, '实习': 0.6, '应届生': 0.8, '1-3年': 1, '3-5年': 1.25 }[exp] || 1;

  const base = [20, 25, 40, 35, 60, 70, 65, 90];
  const points = base.map((y, i) => ({
    xp: i * (100 / (base.length - 1)),
    yp: Math.max(5, Math.min(95, 100 - y * cityBias * expBias))
  }));

  const latest = 100 - points[points.length - 1].yp;
  const first = 100 - points[0].yp;
  const yoy = ((latest - first) / first * 100).toFixed(2);

  return { points, yoy };
}

function buildBars(city, exp) {
  const base = [
    { name: '大模型', value: 68 },
    { name: '数据工程', value: 52 },
    { name: '后端', value: 44 },
    { name: '前端', value: 36 },
    { name: '测试', value: 24 }
  ];
  const cityBias = { 'all': 1, '北京': 1.15, '上海': 1.1, '深圳': 1.08, '贵阳': 0.72, '杭州': 1.02 }[city] || 1;
  const expBias = { 'all': 1, '实习': 0.4, '应届生': 0.55, '1-3年': 0.9, '3-5年': 1.4 }[exp] || 1;
  const max = Math.max(...base.map(x => x.value)) * cityBias * expBias;
  return base.map((b, i) => {
    const v = Math.round(b.value * cityBias * expBias);
    return {
      name: b.name,
      value: v,
      width: Math.max(15, Math.round((v / max) * 95)),
      opacity: 1 - i * 0.1
    };
  });
}

function buildSkills() {
  return [
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
}

module.exports = [
  {
    method: 'GET',
    match: (url) => url.startsWith('/dataviz/trend'),
    handle: ({ data }) => {
      const city = data.city || 'all';
      const exp = data.exp || 'all';
      return buildSeries(city, exp);
    }
  },
  {
    method: 'GET',
    match: (url) => url.startsWith('/dataviz/salary'),
    handle: ({ data }) => ({
      list: buildBars(data.city || 'all', data.exp || 'all')
    })
  },
  {
    method: 'GET',
    match: (url) => url.startsWith('/dataviz/skills'),
    handle: () => ({ list: buildSkills() })
  }
];
