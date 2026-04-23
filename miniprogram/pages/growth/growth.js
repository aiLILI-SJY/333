const app = getApp();
const api = require('../../api/index.js');

Page({
  data: {
    statusBarHeight: 20,
    pathNodes: [],
    refreshedAt: 0,
    loading: true
  },

  onLoad() {
    this.setData({ statusBarHeight: app.globalData.statusBarHeight || 20 });
    this.fetchPath();
  },

  onPullDownRefresh() {
    this.fetchPath().finally(() => wx.stopPullDownRefresh());
  },

  async fetchPath() {
    try {
      this.setData({ loading: true });
      const res = await api.growth.path();
      this.setData({
        pathNodes: res.nodes,
        refreshedAt: res.refreshedAt,
        loading: false
      });
    } catch (e) {
      wx.showToast({ title: '加载失败', icon: 'none' });
      this.setData({ loading: false });
    }
  },

  onSearch() {},

  onShareAppMessage() {
    return { title: '我的 AI 学习路径', path: '/pages/growth/growth' };
  },
  onShareTimeline() {
    return { title: '见世界 · AI 驱动的技能路径' };
  },

  onNodeTap(e) {
    const { id, status } = e.currentTarget.dataset;
    if (status === 'locked') {
      wx.showToast({ title: '完成上一阶段后解锁', icon: 'none' });
    } else if (status === 'done') {
      wx.showToast({ title: `已掌握: ${id}`, icon: 'success' });
    } else {
      wx.showToast({ title: `查看节点: ${id}`, icon: 'none' });
    }
  },

  async onContinueLearn(e) {
    const id = e.currentTarget.dataset.id;
    wx.showLoading({ title: '启动学习会话' });
    try {
      const res = await api.growth.continueLearning(id);
      wx.hideLoading();
      wx.showToast({ title: `会话 ${res.sessionId.slice(-6)} 已创建`, icon: 'success' });
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: '启动失败', icon: 'none' });
    }
  }
});
