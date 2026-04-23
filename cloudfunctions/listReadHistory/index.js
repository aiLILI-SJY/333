const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

// 查当前用户的阅读历史（时间线）
exports.main = async (event) => {
  try {
    const { OPENID } = cloud.getWXContext();
    const page = Number(event.page || 1);
    const pageSize = Math.min(50, Number(event.pageSize || 20));

    const res = await db.collection('read_history')
      .where({ _openid: OPENID })
      .orderBy('readAt', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get();

    const total = await db.collection('read_history')
      .where({ _openid: OPENID }).count();

    // 联查 item 原始数据（可选）
    const items = await Promise.all(res.data.map(async (h) => {
      try {
        if (h.itemType === 'discussion') {
          const q = await db.collection('discussions').where({ discId: h.itemId }).limit(1).get();
          if (q.data[0]) return { ...h, title: q.data[0].title, desc: q.data[0].desc };
        }
        if (h.itemType === 'hotspot') {
          const q = await db.collection('hotspots').where({ hotspotId: h.itemId }).limit(1).get();
          if (q.data[0]) return { ...h, title: q.data[0].title, tags: q.data[0].tags };
        }
      } catch (e) {}
      return h;
    }));

    return {
      list: items,
      total: total.total,
      page,
      pageSize,
      hasMore: page * pageSize < total.total
    };
  } catch (err) {
    return { __error: err.message || String(err) };
  }
};
