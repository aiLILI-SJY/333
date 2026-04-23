const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

// 切换收藏状态：已收藏→取消；未收藏→添加
exports.main = async (event) => {
  try {
    const { OPENID } = cloud.getWXContext();
    const { itemType, itemId, title } = event;
    if (!itemType || !itemId) return { __error: '缺少参数' };

    const existing = await db.collection('favorites')
      .where({ _openid: OPENID, itemType, itemId })
      .get();

    if (existing.data.length > 0) {
      await db.collection('favorites').doc(existing.data[0]._id).remove();
      return { favored: false };
    }
    await db.collection('favorites').add({
      data: { itemType, itemId, title: title || '', createdAt: db.serverDate() }
    });
    return { favored: true };
  } catch (err) {
    return { __error: err.message || String(err) };
  }
};
