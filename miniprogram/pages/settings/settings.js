const app = getApp();

Page({
  data: {
    version: '1.0.0',
    cacheSizeText: '—'
  },

  onLoad() {
    this.refreshCacheSize();
  },
  onShow() { this.refreshCacheSize(); },

  refreshCacheSize() {
    try {
      const info = wx.getStorageInfoSync();
      const kb = info.currentSize || 0;
      this.setData({
        cacheSizeText: kb < 1024 ? `${kb} KB` : `${(kb / 1024).toFixed(1)} MB`
      });
    } catch (e) {}
  },

  onGoEdit() {
    wx.navigateTo({ url: '/pages/edit-profile/edit-profile' });
  },

  onLogout() {
    wx.showModal({
      title: '退出登录',
      content: '将清除本地缓存并重新登录',
      success: (res) => {
        if (!res.confirm) return;
        try { wx.clearStorageSync(); } catch (e) {}
        app.globalData.userInfo = null;
        app.globalData.token = '';
        app.notify('userChanged');
        wx.showToast({ title: '已退出', icon: 'success' });
        setTimeout(() => {
          wx.switchTab({ url: '/pages/trends/trends' });
        }, 600);
      }
    });
  },

  onClearCache() {
    wx.showModal({
      title: '清理缓存',
      content: '会清除所有本地缓存，包括用户信息、搜索历史等',
      success: (res) => {
        if (!res.confirm) return;
        try { wx.clearStorageSync(); } catch (e) {}
        wx.showToast({ title: '已清理', icon: 'success' });
        this.refreshCacheSize();
      }
    });
  },

  onClearHistory() {
    wx.showModal({
      title: '清空搜索历史',
      content: '仅清除本地搜索历史记录',
      success: (res) => {
        if (!res.confirm) return;
        try { wx.removeStorageSync('stw_search_history'); } catch (e) {}
        wx.showToast({ title: '已清空', icon: 'success' });
      }
    });
  },

  onAbout() {
    wx.showModal({
      title: '关于见世界',
      content: '面向软工学生的技术成长平台。\n架构：小程序 + 微信云开发 + DeepSeek。\n版本 1.0.0',
      confirmText: '知道了',
      showCancel: false
    });
  },

  onPrivacy() {
    wx.showModal({
      title: '隐私政策',
      content: '本小程序仅存储你主动填写的资料、阅读/收藏/学习进度数据，用于提供个性化内容推荐。数据存储于腾讯云开发，仅你本人可读写。',
      confirmText: '知道了',
      showCancel: false
    });
  },

  onAgreement() {
    wx.showModal({
      title: '用户协议',
      content: '本小程序为技术交流与学习辅助工具，AI 生成内容仅供参考，不构成专业建议。禁止商业性爬取内容。',
      confirmText: '知道了',
      showCancel: false
    });
  }
});
