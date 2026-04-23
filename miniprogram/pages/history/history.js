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
    loading: true,
    loadingMore: false,
    hasMore: true,
    page: 1,
    total: 0,
    groups: []     // [{ dateKey, label, items: [...] }]
  },

  onLoad() { this.fetch(1); },
  onPullDownRefresh() {
    this.fetch(1).finally(() => wx.stopPullDownRefresh());
  },
  onReachBottom() {
    if (this.data.hasMore && !this.data.loadingMore) {
      this.fetch(this.data.page + 1);
    }
  },

  async fetch(page) {
    if (page === 1) this.setData({ loading: true });
    else this.setData({ loadingMore: true });

    try {
      const res = await api.read.history(page, 20);
      const items = (res.list || []).map((x) => ({
        ...x,
        _timeText: this.formatTime(x.readAt)
      }));

      const merged = page === 1
        ? this.groupByDate(items)
        : this.mergeGroups(this.data.groups, this.groupByDate(items));

      this.setData({
        groups: merged,
        total: res.total || items.length,
        page,
        hasMore: res.hasMore !== undefined ? res.hasMore : items.length === 20,
        loading: false,
        loadingMore: false
      });
    } catch (e) {
      this.setData({ loading: false, loadingMore: false });
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  formatTime(t) {
    if (!t) return '';
    const ts = new Date(t).getTime();
    if (Number.isNaN(ts)) return '';
    const d = new Date(ts);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  },

  groupByDate(items) {
    const groups = {};
    items.forEach((x) => {
      const d = new Date(x.readAt);
      if (Number.isNaN(d.getTime())) return;
      const dateKey = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      const label = this.dateLabel(d);
      if (!groups[dateKey]) groups[dateKey] = { dateKey, label, items: [] };
      groups[dateKey].items.push(x);
    });
    return Object.values(groups);
  },

  dateLabel(d) {
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    if (sameDay) return '今天';
    const y = new Date(now.getTime() - 86400e3);
    if (d.toDateString() === y.toDateString()) return '昨天';
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  },

  mergeGroups(a, b) {
    const map = {};
    [...a, ...b].forEach((g) => {
      if (!map[g.dateKey]) map[g.dateKey] = { ...g, items: [] };
      map[g.dateKey].items = map[g.dateKey].items.concat(g.items);
    });
    return Object.values(map);
  },

  onItemTap(e) {
    const item = e.currentTarget.dataset.item;
    const meta = { title: item.title || item.itemId };
    wx.navigateTo({
      url: `/pages/detail/detail?type=${item.itemType}&id=${item.itemId}&meta=${encodeURIComponent(JSON.stringify(meta))}`
    });
  }
});
