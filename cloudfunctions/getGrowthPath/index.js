const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

// 把 growth_template（公共模板）和当前用户的 growth_progress 合并，得到每个节点的当前状态
exports.main = async () => {
  try {
    const { OPENID } = cloud.getWXContext();

    const [templateRes, progressRes] = await Promise.all([
      db.collection('growth_template').orderBy('order', 'asc').get(),
      db.collection('growth_progress').where({ _openid: OPENID }).get()
    ]);

    const progressMap = {};
    progressRes.data.forEach((p) => { progressMap[p.nodeId] = p; });

    const nodes = templateRes.data.map((t) => {
      const progress = progressMap[t.nodeId];
      return {
        id: t.nodeId,
        title: t.title,
        tag: t.tag,
        tagTone: t.tagTone,
        dotIcon: t.dotIcon,
        desc: t.desc,
        status: (progress && progress.status) || t.defaultStatus || 'locked',
        progress: (progress && progress.progress) || t.defaultProgress || 0,
        eta: t.eta || undefined
      };
    });

    return {
      refreshedAt: Date.now(),
      nodes
    };
  } catch (err) {
    return { __error: err.message || String(err) };
  }
};
