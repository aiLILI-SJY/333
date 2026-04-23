const app = getApp();
const api = require('../../api/index.js');

Page({
  data: {
    statusBarHeight: 20,
    summary: [],
    primaryPath: null,
    secondaryPaths: [],
    summaryGeneratedAt: 0,
    summaryLoading: true,
    convertLoading: false
  },

  onLoad() {
    this.setData({ statusBarHeight: app.globalData.statusBarHeight || 20 });
    this.fetchAll();
  },

  onPullDownRefresh() {
    this.fetchAll().finally(() => wx.stopPullDownRefresh());
  },

  async fetchAll() {
    try {
      this.setData({ summaryLoading: true });
      const [summary, paths] = await Promise.all([
        api.ai.summary(),
        api.ai.paths()
      ]);
      this.setData({
        summary: summary.items,
        summaryGeneratedAt: summary.generatedAt,
        primaryPath: paths.primary,
        secondaryPaths: paths.secondary,
        summaryLoading: false
      });
    } catch (e) {
      wx.showToast({ title: 'AI 分析加载失败', icon: 'none' });
      this.setData({ summaryLoading: false });
    }
  },

  onSearch() {},

  onPathTap(e) {
    const id = e.currentTarget.dataset.id;
    let meta;
    if (this.data.primaryPath && this.data.primaryPath.id === id) {
      meta = { title: this.data.primaryPath.title, desc: this.data.primaryPath.desc };
    } else {
      const sec = this.data.secondaryPaths.find((x) => x.id === id);
      meta = sec ? { title: sec.title, desc: `步骤 ${sec.step} · 进度 ${sec.progress}%` } : { title: id };
    }
    wx.navigateTo({
      url: `/pages/detail/detail?type=path&id=${id}&meta=${encodeURIComponent(JSON.stringify(meta))}`
    });
  },

  onShareAppMessage() {
    return { title: 'AI 为你解读今日技术生态', path: '/pages/ai-analysis/ai-analysis' };
  },
  onShareTimeline() {
    return { title: '见世界 · DeepSeek 深度解读' };
  },

  onConvertToChallenge() {
    if (this.data.convertLoading) return;
    wx.showModal({
      title: '转化为竞赛选题',
      content: '将当前AI分析内容转化为大学生软件工程竞赛选题？',
      success: async (res) => {
        if (!res.confirm) return;
        this.setData({ convertLoading: true });
        wx.showLoading({ title: 'AI 生成中', mask: true });
        try {
          const challenge = await api.ai.convertChallenge();
          wx.hideLoading();
          const outline = challenge.outline.join('\n');
          wx.showModal({
            title: challenge.title,
            content: `预计 ${challenge.estimatedWeeks} 周\n\n${outline}`,
            confirmText: '知道了',
            showCancel: false
          });
        } catch (e) {
          wx.hideLoading();
          wx.showToast({ title: '生成失败', icon: 'none' });
        } finally {
          this.setData({ convertLoading: false });
        }
      }
    });
  }
});
