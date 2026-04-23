const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

// 跨集合关键字搜索。云数据库用正则做模糊匹配。
exports.main = async (event) => {
  try {
    const kw = (event.keyword || '').trim();
    if (!kw) return { list: [] };

    const regex = db.RegExp({ regexp: kw, options: 'i' });

    const [hotspots, discussions, skills] = await Promise.all([
      db.collection('hotspots').where(_.or([{ title: regex }, { tags: regex }])).limit(5).get(),
      db.collection('discussions').where(_.or([{ title: regex }, { desc: regex }])).limit(10).get(),
      db.collection('skills').where({ name: regex }).limit(5).get()
    ]);

    const list = [
      ...hotspots.data.map((x) => ({
        type: 'trend',
        id: x.hotspotId || x._id,
        title: x.title,
        desc: (x.tags || []).join(' · ')
      })),
      ...discussions.data.map((x) => ({
        type: 'discussion',
        id: x.discId || x._id,
        title: x.title,
        desc: x.desc
      })),
      ...skills.data.map((x) => ({
        type: 'skill',
        id: x._id,
        title: x.name,
        desc: `${x.level} demand`
      }))
    ];

    return { list };
  } catch (err) {
    return { __error: err.message || String(err) };
  }
};
