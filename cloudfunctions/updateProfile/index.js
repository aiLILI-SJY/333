const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

// 更新当前用户资料 / 头像
exports.main = async (event) => {
  try {
    const { OPENID } = cloud.getWXContext();
    const update = {};
    ['name', 'avatar', 'school', 'grade', 'major', 'role'].forEach((k) => {
      if (typeof event[k] === 'string') update[k] = event[k];
    });
    update.updatedAt = db.serverDate();

    const existing = await db.collection('users').where({ _openid: OPENID }).get();
    if (existing.data.length === 0) {
      const added = await db.collection('users').add({
        data: { ...update, createdAt: db.serverDate() }
      });
      return { ok: true, id: added._id };
    }
    await db.collection('users').doc(existing.data[0]._id).update({ data: update });
    return { ok: true, id: existing.data[0]._id, user: { ...existing.data[0], ...update } };
  } catch (err) {
    return { __error: err.message || String(err) };
  }
};
