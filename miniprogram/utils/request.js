// 统一请求层：mock / cloud / http 三模式切换
const config = require('../config/index.js');
const storage = require('./storage.js');
const mockRouter = require('../mocks/router.js');
const cloudRouter = require('./cloudRouter.js');

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay() {
  const { min, max } = config.mockDelay;
  return Math.floor(min + Math.random() * (max - min));
}

async function request({ url, method = 'GET', data = {}, header = {}, showLoading = false }) {
  if (showLoading) wx.showLoading({ title: '加载中', mask: true });

  try {
    // ---------- MOCK ----------
    if (config.mode === 'mock') {
      await delay(randomDelay());
      return await mockRouter({ url, method, data });
    }

    // ---------- CLOUD ----------
    if (config.mode === 'cloud') {
      return await cloudRouter({ url, method, data });
    }

    // ---------- HTTP (自建后端) ----------
    const token = storage.get('token');
    const finalHeader = Object.assign({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    }, header);

    return await new Promise((resolve, reject) => {
      wx.request({
        url: config.baseURL + url,
        method,
        data,
        header: finalHeader,
        timeout: config.timeout,
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            if (res.data && res.data.code === 0) {
              resolve(res.data.data);
            } else {
              reject(res.data || { message: '请求失败' });
            }
          } else if (res.statusCode === 401) {
            storage.remove('token');
            reject({ message: '登录已过期' });
          } else {
            reject({ message: `HTTP ${res.statusCode}` });
          }
        },
        fail: (err) => reject({ message: err.errMsg || '网络错误' })
      });
    });
  } finally {
    if (showLoading) wx.hideLoading();
  }
}

module.exports = {
  request,
  get: (url, data, opts) => request(Object.assign({ url, method: 'GET', data }, opts)),
  post: (url, data, opts) => request(Object.assign({ url, method: 'POST', data }, opts))
};
