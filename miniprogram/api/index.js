const { get, post } = require('../utils/request.js');

module.exports = {
  auth: {
    login: (code) => post('/auth/login', { code }),
    getProfile: () => get('/auth/profile'),
    updateProfile: (data) => post('/auth/profile', data),
    uploadAvatar: (avatarUrl) => post('/auth/avatar', { avatarUrl })
  },
  trends: {
    hotspots: (page = 1, pageSize = 10) => get('/trends/hotspots', { page, pageSize }),
    discussions: (page = 1, pageSize = 10) => get('/trends/discussions', { page, pageSize })
  },
  ai: {
    summary: () => get('/ai/summary'),
    paths: () => get('/ai/paths'),
    convertChallenge: () => post('/ai/challenge', {}),
    // 通用详情生成（DeepSeek 实时 + 7 天缓存）
    detail: (type, id, meta, force = false) => post('/ai/detail', { type, id, meta, force })
  },
  dataviz: {
    trend: (city, exp) => get('/dataviz/trend', { city, exp }),
    salary: (city, exp) => get('/dataviz/salary', { city, exp }),
    skills: () => get('/dataviz/skills')
  },
  growth: {
    path: () => get('/growth/path'),
    continueLearning: (id) => post('/growth/continue', { id })
  },
  profile: {
    stats: () => get('/profile/stats')
  },
  search: {
    hot: () => get('/search/hot'),
    query: (keyword) => get('/search', { keyword })
  },
  favorites: {
    toggle: (itemType, itemId, title) => post('/favorites/toggle', { itemType, itemId, title }),
    list: () => get('/favorites')
  },
  read: {
    record: (itemType, itemId, title) => post('/read/record', { itemType, itemId, title }),
    history: (page = 1, pageSize = 20) => get('/read/history', { page, pageSize })
  }
};
