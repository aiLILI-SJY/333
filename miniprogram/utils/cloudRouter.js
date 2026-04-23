// Cloud 模式的路由：把 api/index.js 里的 URL 转成云函数调用或云数据库查询
// 保持与 mocks/router 相同的入参/返回，业务代码无感知切换

function db() { return wx.cloud.database(); }

async function call(name, data) {
  const res = await wx.cloud.callFunction({ name, data: data || {} });
  if (res.result && res.result.__error) {
    throw new Error(res.result.__error);
  }
  return res.result;
}

async function cloudRouter({ url, method, data }) {
  const q = data || {};

  // ---------- Auth ----------
  if (method === 'POST' && url === '/auth/login') {
    return call('login');
  }
  if (method === 'GET' && url === '/auth/profile') {
    return call('login'); // 登录同时返回用户资料
  }
  if (method === 'POST' && url === '/auth/profile') {
    return call('updateProfile', q);
  }
  if (method === 'POST' && url === '/auth/avatar') {
    return call('updateProfile', { avatar: q.avatarUrl });
  }

  // ---------- Trends ----------
  if (method === 'GET' && url.startsWith('/trends/hotspots')) {
    const page = Number(q.page || 1);
    const pageSize = Number(q.pageSize || 10);
    const list = await db().collection('hotspots')
      .orderBy('sort', 'asc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get();
    const total = await db().collection('hotspots').count();
    return { list: list.data, total: total.total, page, pageSize };
  }
  if (method === 'GET' && url.startsWith('/trends/discussions')) {
    const page = Number(q.page || 1);
    const pageSize = Number(q.pageSize || 10);
    const list = await db().collection('discussions')
      .orderBy('createdAt', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get();
    const total = await db().collection('discussions').count();
    const hasMore = page * pageSize < total.total;
    return { list: list.data, total: total.total, page, pageSize, hasMore };
  }

  // ---------- AI ----------
  if (method === 'GET' && url === '/ai/summary') {
    return call('aiSummary');
  }
  if (method === 'GET' && url === '/ai/paths') {
    return call('aiPaths');
  }
  if (method === 'POST' && url === '/ai/challenge') {
    return call('aiChallenge');
  }
  if (method === 'POST' && url === '/ai/detail') {
    return call('aiDetail', q);
  }

  // ---------- Dataviz ----------
  if (method === 'GET' && url.startsWith('/dataviz/trend')) {
    return buildTrend(q.city, q.exp);
  }
  if (method === 'GET' && url.startsWith('/dataviz/salary')) {
    return { list: buildBars(q.city, q.exp) };
  }
  if (method === 'GET' && url.startsWith('/dataviz/skills')) {
    const { data: list } = await db().collection('skills').get();
    return { list };
  }

  // ---------- Growth ----------
  if (method === 'GET' && url === '/growth/path') {
    return call('getGrowthPath');
  }
  if (method === 'POST' && url === '/growth/continue') {
    return call('continueLearning', q);
  }

  // ---------- Profile ----------
  if (method === 'GET' && url === '/profile/stats') {
    return call('profileStats');
  }

  // ---------- Favorites / Read ----------
  if (method === 'POST' && url === '/favorites/toggle') {
    return call('favoriteToggle', q);
  }
  if (method === 'GET' && url === '/favorites') {
    return call('listFavorites');
  }
  if (method === 'POST' && url === '/read/record') {
    return call('readRecord', q);
  }
  if (method === 'GET' && url === '/read/history') {
    return call('listReadHistory', q);
  }

  // ---------- Search ----------
  if (method === 'GET' && url === '/search/hot') {
    const { data: list } = await db().collection('search_hot').get();
    return { list: list.map((x) => x.keyword) };
  }
  if (method === 'GET' && url.startsWith('/search')) {
    return call('search', q);
  }

  throw new Error(`[cloudRouter] 未定义路由: ${method} ${url}`);
}

// ====== 数据可视化的联动计算（从 mock 沿用） ======
function buildTrend(city, exp) {
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

module.exports = cloudRouter;
