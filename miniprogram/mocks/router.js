// Mock 路由表：匹配 url 去调用对应处理器
const handlers = [
  require('./handlers/auth.js'),
  require('./handlers/trends.js'),
  require('./handlers/ai.js'),
  require('./handlers/dataviz.js'),
  require('./handlers/growth.js'),
  require('./handlers/profile.js'),
  require('./handlers/search.js'),
  require('./handlers/user_data.js')
];

async function mockRouter({ url, method, data }) {
  for (const h of handlers) {
    for (const route of h) {
      if (route.method === method && route.match(url)) {
        return route.handle({ url, method, data });
      }
    }
  }
  throw new Error(`[mock] 未定义路由: ${method} ${url}`);
}

module.exports = mockRouter;
