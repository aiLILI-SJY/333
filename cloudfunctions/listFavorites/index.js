const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

// 查当前用户的收藏列表（按收藏时间倒序）
exports.main = async () => {
  try {
    const { OPENID } = cloud.getWXContext();
    const res = await db.collection('favorites')
      .where({ _openid: OPENID })
      .orderBy('createdAt', 'desc')
      .limit(200)
      .get();

    return { list: res.data, total: res.data.length };
  } catch (err) {
    return { __error: err.message || String(err) };
  }
};
