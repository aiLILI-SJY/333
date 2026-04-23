const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

// 点击"继续学习"：创建学习会话 + 给对应节点 progress +5
exports.main = async (event) => {
  try {
    const { OPENID } = cloud.getWXContext();
    const nodeId = event.id;
    if (!nodeId) return { __error: '缺少 id 参数' };

    // upsert growth_progress
    const existing = await db.collection('growth_progress')
      .where({ _openid: OPENID, nodeId })
      .get();

    if (existing.data.length > 0) {
      const cur = existing.data[0];
      const next = Math.min(100, (cur.progress || 0) + 5);
      await db.collection('growth_progress').doc(cur._id).update({
        data: {
          progress: next,
          status: next >= 100 ? 'done' : 'progress',
          updatedAt: db.serverDate()
        }
      });
    } else {
      await db.collection('growth_progress').add({
        data: {
          nodeId,
          progress: 5,
          status: 'progress',
          createdAt: db.serverDate()
        }
      });
    }

    const sessionId = 'sess-' + Date.now();
    return { ok: true, sessionId, nodeId };
  } catch (err) {
    return { __error: err.message || String(err) };
  }
};
