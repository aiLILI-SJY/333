const config = require('./config/index.js');
const api = require('./api/index.js');
const storage = require('./utils/storage.js');

App({
  onLaunch() {
    const systemInfo = wx.getSystemInfoSync();
    this.globalData.systemInfo = systemInfo;
    this.globalData.statusBarHeight = systemInfo.statusBarHeight;

    // 云开发初始化（mode==='cloud' 时才生效）
    if (config.mode === 'cloud') {
      if (!wx.cloud) {
        console.error('请使用 2.2.3 或以上基础库以使用云能力');
      } else if (!config.cloudEnv) {
        console.error('[cloud] 请在 config/index.js 填入 cloudEnv');
      } else {
        wx.cloud.init({ env: config.cloudEnv, traceUser: true });
      }
    }

    const token = storage.get('token');
    const cachedUser = storage.get('user');
    if (token) this.globalData.token = token;
    if (cachedUser) this.globalData.userInfo = cachedUser;

    this.ensureLogin();
  },

  async ensureLogin() {
    try {
      if (config.mode === 'cloud') {
        // 云开发模式下 openid 由云函数返回；本地 token 没用
        const user = await api.auth.login();
        this.globalData.userInfo = user;
        this.globalData.openid = user.openid;
        storage.set('user', user, 1000 * 60 * 60 * 24 * 7);
      } else if (!this.globalData.token) {
        const { code } = await new Promise((resolve, reject) => {
          wx.login({ success: resolve, fail: reject });
        });
        const res = await api.auth.login(code);
        this.globalData.token = res.token;
        this.globalData.userInfo = res.user;
        storage.set('token', res.token, 1000 * 60 * 60 * 24 * 7);
        storage.set('user', res.user, 1000 * 60 * 60 * 24 * 7);
      } else {
        const user = await api.auth.getProfile();
        this.globalData.userInfo = user;
        storage.set('user', user, 1000 * 60 * 60 * 24 * 7);
      }
      this.notify('userChanged');
    } catch (e) {
      console.warn('[login] failed', e);
    }
  },

  _listeners: {},
  on(event, fn) {
    (this._listeners[event] = this._listeners[event] || []).push(fn);
  },
  off(event, fn) {
    const arr = this._listeners[event];
    if (!arr) return;
    this._listeners[event] = arr.filter((f) => f !== fn);
  },
  notify(event, data) {
    (this._listeners[event] || []).forEach((fn) => {
      try { fn(data); } catch (e) {}
    });
  },

  globalData: {
    userInfo: null,
    token: '',
    openid: '',
    systemInfo: null,
    statusBarHeight: 20
  }
});
