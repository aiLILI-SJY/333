module.exports = [
  {
    method: 'POST',
    match: (url) => url === '/auth/login',
    handle: ({ data }) => {
      // data.code 来自 wx.login
      return {
        token: 'mock-token-' + Date.now(),
        user: {
          id: 'u-1001',
          name: 'Alex Chen',
          avatar: '',
          school: '计算机科学学院, 贵州大学',
          grade: '大三',
          major: 'AI 专业',
          role: '软件工程师 2502',
          verified: true
        }
      };
    }
  },
  {
    method: 'GET',
    match: (url) => url === '/auth/profile',
    handle: () => ({
      id: 'u-1001',
      name: 'Alex Chen',
      avatar: '',
      school: '计算机科学学院, 贵州大学',
      grade: '大三',
      major: 'AI 专业',
      role: '软件工程师 2502',
      verified: true
    })
  },
  {
    method: 'POST',
    match: (url) => url === '/auth/profile',
    handle: ({ data }) => ({
      ok: true,
      user: data
    })
  },
  {
    method: 'POST',
    match: (url) => url === '/auth/avatar',
    handle: ({ data }) => ({
      ok: true,
      avatarUrl: data.avatarUrl || ''
    })
  }
];
