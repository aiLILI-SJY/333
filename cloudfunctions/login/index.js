const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

// 登录 / 获取或创建用户资料
exports.main = async (event, context) => {
  try {
    const { OPENID, APPID, UNIONID } = cloud.getWXContext();

    const col = db.collection('users');
    const existing = await col.where({ _openid: OPENID }).get();

    if (existing.data.length > 0) {
      const user = existing.data[0];
      return {
        openid: OPENID,
        id: user._id,
        name: user.name || 'Alex Chen',
        avatar: user.avatar || '',
        school: user.school || '计算机科学学院, 贵州大学',
        grade: user.grade || '大三',
        major: user.major || 'AI 专业',
        role: user.role || '软件工程师 2502',
        verified: !!user.verified
      };
    }

    // 首次登录 → 创建默认用户
    const defaultUser = {
      name: 'Alex Chen',
      avatar: '',
      school: '计算机科学学院, 贵州大学',
      grade: '大三',
      major: 'AI 专业',
      role: '软件工程师 2502',
      verified: true,
      createdAt: db.serverDate()
    };
    const added = await col.add({ data: defaultUser });
    return {
      openid: OPENID,
      id: added._id,
      ...defaultUser
    };
  } catch (err) {
    return { __error: err.message || String(err) };
  }
};
