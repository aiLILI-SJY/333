const app = getApp();
const api = require('../../api/index.js');

Page({
  data: {
    statusBarHeight: 20,
    searchKeyword: '',
    welcomeRole: '软件工程师 2502',
    hotspots: [],
    discussions: [],
    discussionPage: 1,
    hasMore: true,
    loadingMore: false,
    firstLoading: true,
    favMap: {}     // itemId -> bool
  },

  onLoad() {
    this.setData({ statusBarHeight: app.globalData.statusBarHeight || 20 });
    this.syncUser();
    this._userListener = () => this.syncUser();
    app.on('userChanged', this._userListener);
    this.refreshAll();
  },

  onShow() {
    // 从详情/收藏返回时可能有变化
    this.syncFavorites();
  },

  onUnload() {
    if (this._userListener) app.off('userChanged', this._userListener);
  },

  syncUser() {
    const user = app.globalData.userInfo;
    if (user && user.role) this.setData({ welcomeRole: user.role });
  },

  async refreshAll() {
    await Promise.all([this.fetchHotspots(), this.fetchDiscussions(1)]);
    await this.syncFavorites();
    this.setData({ firstLoading: false });
  },

  onPullDownRefresh() {
    this.refreshAll().finally(() => wx.stopPullDownRefresh());
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loadingMore) {
      this.fetchDiscussions(this.data.discussionPage + 1);
    }
  },

  async fetchHotspots() {
    try {
      const res = await api.trends.hotspots(1, 10);
      const list = (res.list || []).map((x) => ({
        id: x.hotspotId || x._id || x.id,
        title: x.title,
        cover: x.cover,
        badge: x.badge,
        badgeType: x.badgeType,
        badgeIcon: x.badgeIcon,
        tags: x.tags
      }));
      this.setData({ hotspots: list });
    } catch (e) {
      wx.showToast({ title: '热点加载失败', icon: 'none' });
    }
  },

  async fetchDiscussions(page) {
    if (this.data.loadingMore) return;
    this.setData({ loadingMore: true });
    try {
      const res = await api.trends.discussions(page, 10);
      const normalized = (res.list || []).map((x) => ({
        id: x.discId || x._id || x.id,
        title: x.title,
        desc: x.desc,
        category: x.category,
        chipTone: x.chipTone,
        iconTone: x.iconTone,
        iconText: x.iconText,
        readTime: x.readTime
      }));
      const list = page === 1 ? normalized : this.data.discussions.concat(normalized);
      this.setData({
        discussions: list,
        discussionPage: page,
        hasMore: res.hasMore !== undefined ? res.hasMore : list.length < (res.total || list.length),
        loadingMore: false
      });
    } catch (e) {
      this.setData({ loadingMore: false });
      wx.showToast({ title: '讨论加载失败', icon: 'none' });
    }
  },

  async syncFavorites() {
    try {
      const res = await api.favorites.list();
      const map = {};
      (res.list || []).forEach((f) => { map[f.itemId] = true; });
      this.setData({ favMap: map });
    } catch (e) { /* 无权限或未登录时静默 */ }
  },

  onSearch() {},

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  onSearchConfirm(e) {
    const kw = e.detail.value;
    if (!kw) return;
    wx.navigateTo({ url: `/pkg-search/pages/search/search?kw=${encodeURIComponent(kw)}` });
  },

  onMoreHotspots() {
    wx.showToast({ title: '敬请期待全部列表', icon: 'none' });
  },

  onHotspotTap(e) {
    const id = e.currentTarget.dataset.id;
    const hotspot = this.data.hotspots.find((x) => x.id === id);
    const meta = hotspot ? { title: hotspot.title, tags: hotspot.tags } : { title: id };
    wx.navigateTo({
      url: `/pages/detail/detail?type=hotspot&id=${id}&meta=${encodeURIComponent(JSON.stringify(meta))}`
    });
  },

  onDiscussionTap(e) {
    const { id } = e.currentTarget.dataset;
    const disc = this.data.discussions.find((x) => x.id === id);
    const meta = disc
      ? { title: disc.title, desc: disc.desc, category: disc.category, readTime: disc.readTime }
      : { title: id };
    wx.navigateTo({
      url: `/pages/detail/detail?type=discussion&id=${id}&meta=${encodeURIComponent(JSON.stringify(meta))}`
    });
  },

  onShareAppMessage() {
    return { title: '见世界 · 看技术趋势，知你所向', path: '/pages/trends/trends' };
  },
  onShareTimeline() {
    return { title: '见世界 · 软工学生的技术成长平台' };
  },

  async onFavoriteTap(e) {
    const { id, title } = e.currentTarget.dataset;
    try {
      const res = await api.favorites.toggle('discussion', id, title);
      const favMap = { ...this.data.favMap };
      if (res.favored) favMap[id] = true;
      else delete favMap[id];
      this.setData({ favMap });
      wx.showToast({
        title: res.favored ? '已收藏' : '已取消',
        icon: res.favored ? 'success' : 'none',
        duration: 800
      });
    } catch (err) {
      wx.showToast({ title: '操作失败', icon: 'none' });
    }
  }
});
