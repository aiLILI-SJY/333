const app = getApp();

Component({
  properties: {
    avatar: { type: String, value: '' },
    letter: { type: String, value: 'A' }
  },
  lifetimes: {
    attached() {
      this.syncFromGlobal();
      this._listener = () => this.syncFromGlobal();
      app.on('userChanged', this._listener);
    },
    detached() {
      if (this._listener) app.off('userChanged', this._listener);
    }
  },
  methods: {
    syncFromGlobal() {
      const user = (app.globalData && app.globalData.userInfo) || null;
      if (!user) return;
      this.setData({
        avatar: user.avatar || '',
        letter: (user.name || 'A').slice(0, 1)
      });
    },
    onAvatarTap() {
      // 跳到个人中心 tab
      wx.switchTab({ url: '/pages/profile/profile' });
    },
    onSearch() {
      this.triggerEvent('search');
      wx.navigateTo({ url: '/pkg-search/pages/search/search' });
    }
  }
});
