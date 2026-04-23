const api = require('../../api/index.js');

const TYPE_LABEL = {
  hotspot: '热点',
  discussion: '讨论',
  skill: '技能',
  path: '路径'
};

Page({
  data: {
    TYPE_LABEL,
    tabs: [
      { key: 'all', label: '全部' },
      { key: 'hotspot', label: '热点' },
      { key: 'discussion', label: '讨论' },
      { key: 'skill', label: '技能' },
      { key: 'path', label: '路径' }
    ],
    activeType: 'all',
    loading: true,
    list: [],
    filtered: [],
    counts: {}
  },

  onLoad() { this.fetch(); },
  onShow() { this.fetch(); },
  onPullDownRefresh() { this.fetch().finally(() => wx.stopPullDownRefresh()); },

  async fetch() {
    try {
      const res = await api.favorites.list();
      const list = (res.list || []).map((x) => ({
        ...x,
        _timeText: this.formatTime(x.createdAt)
      }));
      const counts = list.reduce((acc, x) => {
        acc[x.itemType] = (acc[x.itemType] || 0) + 1;
        return acc;
      }, {});
      counts.all = list.length;
      this.setData({ list, counts, loading: false });
      this.applyFilter();
    } catch (e) {
      this.setData({ loading: false });
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  formatTime(t) {
    if (!t) return '';
    const ts = typeof t === 'object' ? new Date(t).getTime() : new Date(t).getTime();
    if (Number.isNaN(ts)) return '';
    const diff = (Date.now() - ts) / 1000;
    if (diff < 60) return '刚刚';
    if (diff < 3600) return Math.floor(diff / 60) + ' 分钟前';
    if (diff < 86400) return Math.floor(diff / 3600) + ' 小时前';
    const d = new Date(ts);
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  },

  applyFilter() {
    const filtered = this.data.activeType === 'all'
      ? this.data.list
      : this.data.list.filter((x) => x.itemType === this.data.activeType);
    this.setData({ filtered });
  },

  onTabTap(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ activeType: key });
    this.applyFilter();
  },

  onItemTap(e) {
    const item = e.currentTarget.dataset.item;
    const meta = { title: item.title || item.itemId };
    wx.navigateTo({
      url: `/pages/detail/detail?type=${item.itemType}&id=${item.itemId}&meta=${encodeURIComponent(JSON.stringify(meta))}`
    });
  },

  async onRemove(e) {
    const item = e.currentTarget.dataset.item;
    try {
      await api.favorites.toggle(item.itemType, item.itemId, item.title);
      wx.showToast({ title: '已移除', icon: 'none', duration: 600 });
      this.fetch();
    } catch (err) {
      wx.showToast({ title: '移除失败', icon: 'none' });
    }
  }
});
