const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

// 聚合当前用户的学习记录 / 雷达 / 职业画像
exports.main = async () => {
  try {
    const { OPENID } = cloud.getWXContext();

    // 阅读记录：直接 count
    const readRes = await db.collection('read_history')
      .where({ _openid: OPENID })
      .count();
    const readCount = readRes.total;
    const readTarget = 200;

    // 雷达 / 职业画像：从 users.profile 读，没写过就给默认
    const userRes = await db.collection('users').where({ _openid: OPENID }).get();
    const user = userRes.data[0] || {};

    const radar = user.radar || [
      { label: '算法', value: 0.85 },
      { label: '系统设计', value: 0.7 },
      { label: '数据可视化', value: 0.4 },
      { label: '机器学习', value: 0.6 },
      { label: '云原生', value: 0.75 }
    ];

    const career = user.career || {
      title: 'AI 算法工程师',
      tags: ['PyTorch', 'Computer Vision', 'LLMs', 'Optimization']
    };

    // 简单计算同比增长：读最近 7 天 vs 更早 7 天
    const now = Date.now();
    const sevenDaysAgo = new Date(now - 7 * 86400e3);
    const fourteenDaysAgo = new Date(now - 14 * 86400e3);
    const [recentRes, prevRes] = await Promise.all([
      db.collection('read_history').where({
        _openid: OPENID,
        readAt: db.command.gte(sevenDaysAgo)
      }).count(),
      db.collection('read_history').where({
        _openid: OPENID,
        readAt: db.command.and(db.command.gte(fourteenDaysAgo), db.command.lt(sevenDaysAgo))
      }).count()
    ]);
    const deltaPct = prevRes.total === 0
      ? (recentRes.total > 0 ? 100 : 0)
      : Math.round(((recentRes.total - prevRes.total) / prevRes.total) * 100);

    return {
      read: { count: readCount, target: readTarget, deltaPct },
      radar,
      career
    };
  } catch (err) {
    return { __error: err.message || String(err) };
  }
};
