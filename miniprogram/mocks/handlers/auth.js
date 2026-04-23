// mock 模式：用户资料改动通过 wx.storage 持久化
const storage = require('../../utils/storage.js');

const KEY_OVERRIDE = 'mock_user_override';

const DEFAULT_USER = {
  id: 'u-1001',
  name: 'Alex Chen',
  avatar: '',
  school: '计算机科学学院, 贵州大学',
  grade: '大三',
  major: 'AI 专业',
  role: '软件工程师 2502',
  verified: true
};

function mergedUser() {
  const override = storage.get(KEY_OVERRIDE) || {};
  return { ...DEFAULT_USER, ...override };
}

function writeOverride(patch) {
  const current = storage.get(KEY_OVERRIDE) || {};
  storage.set(KEY_OVERRIDE, { ...current, ...patch });
}

module.exports = [
  {
    method: 'POST',
    match: (url) => url === '/auth/login',
    handle: () => ({
      token: 'mock-token-' + Date.now(),
      user: mergedUser()
    })
  },
  {
    method: 'GET',
    match: (url) => url === '/auth/profile',
    handle: () => mergedUser()
  },
  {
    method: 'POST',
    match: (url) => url === '/auth/profile',
    handle: ({ data }) => {
      const patch = {};
      ['name', 'avatar', 'school', 'grade', 'major', 'role'].forEach((k) => {
        if (typeof data[k] === 'string') patch[k] = data[k];
      });
      writeOverride(patch);
      return { ok: true, user: mergedUser() };
    }
  },
  {
    method: 'POST',
    match: (url) => url === '/auth/avatar',
    handle: ({ data }) => {
      const avatarUrl = data.avatarUrl || '';
      writeOverride({ avatar: avatarUrl });
      return { ok: true, avatarUrl };
    }
  }
];
