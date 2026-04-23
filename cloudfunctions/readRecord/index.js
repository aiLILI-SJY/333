const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

// 上报一次阅读。同一 itemId 只累计一次（用于 profile 页的阅读计数）
exports.main = async (event) => {
  try {
    const { OPENID } = cloud.getWXContext();
    const { itemType, itemId } = event;
    if (!itemType || !itemId) return { __error: '缺少参数' };

    const existing = await db.collection('read_history')
      .where({ _openid: OPENID, itemType, itemId })
      .get();
    if (existing.data.length > 0) {
      // 已读过：更新时间戳
      await db.collection('read_history').doc(existing.data[0]._id).update({
        data: { readAt: db.serverDate() }
      });
    } else {
      await db.collection('read_history').add({
        data: { itemType, itemId, readAt: db.serverDate() }
      });
    }

    const count = await db.collection('read_history').where({ _openid: OPENID }).count();
    return { ok: true, count: count.total };
  } catch (err) {
    return { __error: err.message || String(err) };
  }
};
