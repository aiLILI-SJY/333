const api = require('../../api/index.js');

const TYPE_LABEL = {
  hotspot: '热点',
  discussion: '讨论',
  skill: '技能',
  path: '学习路径'
};

Page({
  data: {
    type: '',
    id: '',
    typeLabel: '',
    meta: {},
    content: null,
    loading: true,
    error: '',
    favored: false,
    cached: false,
    generatedAt: 0,
    generatedAtText: ''
  },

  onLoad(options) {
    const { type, id } = options;
    const meta = options.meta ? JSON.parse(decodeURIComponent(options.meta)) : {};
    this.setData({
      type,
      id,
      typeLabel: TYPE_LABEL[type] || '详情',
      meta
    });
    wx.setNavigationBarTitle({ title: meta.title || TYPE_LABEL[type] || '详情' });

    this.fetchDetail(false);
    this.syncFavorite();
    // 上报阅读（带标题方便历史页渲染）
    api.read.record(type, id, meta.title || '').catch(() => {});
  },

  onPullDownRefresh() {
    this.fetchDetail(false).finally(() => wx.stopPullDownRefresh());
  },

  async fetchDetail(force) {
    this.setData({ loading: true, error: '' });
    try {
      const res = await api.ai.detail(this.data.type, this.data.id, this.data.meta, force);
      if (res.__error) throw new Error(res.__error);
      this.setData({
        content: res,
        loading: false,
        cached: !!res.__cached,
        generatedAt: res.generatedAt || Date.now(),
        generatedAtText: this.formatTime(res.generatedAt || Date.now())
      });
    } catch (err) {
      this.setData({ loading: false, error: err.message || '生成失败' });
    }
  },

  formatTime(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    const now = Date.now();
    const diff = (now - ts) / 1000;
    if (diff < 60) return '刚刚';
    if (diff < 3600) return Math.floor(diff / 60) + ' 分钟前';
    if (diff < 86400) return Math.floor(diff / 3600) + ' 小时前';
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  },

  onRetry() { this.fetchDetail(false); },
  onRegenerate() {
    wx.showModal({
      title: '重新生成',
      content: '会消耗一次 DeepSeek 调用，确定？',
      success: (res) => { if (res.confirm) this.fetchDetail(true); }
    });
  },

  async syncFavorite() {
    try {
      const res = await api.favorites.list();
      const favored = (res.list || []).some(
        (f) => f.itemType === this.data.type && f.itemId === this.data.id
      );
      this.setData({ favored });
    } catch (e) {}
  },

  async onFavoriteTap() {
    try {
      const res = await api.favorites.toggle(
        this.data.type,
        this.data.id,
        this.data.meta.title || ''
      );
      this.setData({ favored: !!res.favored });
      wx.showToast({
        title: res.favored ? '已收藏' : '已取消',
        icon: res.favored ? 'success' : 'none',
        duration: 900
      });
    } catch (e) {
      wx.showToast({ title: '操作失败', icon: 'none' });
    }
  },

  // 转发到好友
  onShareAppMessage() {
    const { type, id, meta } = this.data;
    return {
      title: meta.title || '见世界 · 技术成长',
      path: `/pages/detail/detail?type=${type}&id=${id}&meta=${encodeURIComponent(JSON.stringify(meta))}`
    };
  },

  // 转发到朋友圈
  onShareTimeline() {
    const { meta } = this.data;
    return {
      title: meta.title || '见世界 · 技术成长',
      query: `type=${this.data.type}&id=${this.data.id}`
    };
  }
});
