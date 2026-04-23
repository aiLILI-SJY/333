// 封装 wx.storage，带过期与 try/catch
const KEY_PREFIX = 'stw_';

function k(key) { return KEY_PREFIX + key; }

function set(key, value, ttl) {
  try {
    const payload = { v: value, t: ttl ? Date.now() + ttl : 0 };
    wx.setStorageSync(k(key), payload);
  } catch (e) {}
}

function get(key) {
  try {
    const payload = wx.getStorageSync(k(key));
    if (!payload) return null;
    if (payload.t && payload.t < Date.now()) {
      wx.removeStorageSync(k(key));
      return null;
    }
    return payload.v;
  } catch (e) {
    return null;
  }
}

function remove(key) {
  try { wx.removeStorageSync(k(key)); } catch (e) {}
}

module.exports = { set, get, remove };
