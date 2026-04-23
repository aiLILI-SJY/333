const api = require('../../api/index.js');
const storage = require('../../utils/storage.js');

const HISTORY_KEY = 'search_history';
const MAX_HISTORY = 10;

Page({
  data: {
    keyword: '',
    autoFocus: true,
    loading: false,
    hot: [],
    history: [],
    results: [],
    typeLabel: {
      trend: '趋势',
      discussion: '讨论',
      skill: '技能',
      path: '路径'
    }
  },

  _debounceTimer: null,

  onLoad(options) {
    this.setData({ history: storage.get(HISTORY_KEY) || [] });
    this.fetchHot();
    if (options && options.kw) {
      const kw = decodeURIComponent(options.kw);
      this.setData({ keyword: kw, loading: true, autoFocus: false });
      this.runSearch(kw);
      this.pushHistory(kw);
    }
  },

  async fetchHot() {
    try {
      const res = await api.search.hot();
      this.setData({ hot: res.list });
    } catch (e) {}
  },

  onInput(e) {
    const kw = e.detail.value;
    this.setData({ keyword: kw });
    clearTimeout(this._debounceTimer);
    if (!kw) {
      this.setData({ results: [], loading: false });
      return;
    }
    this.setData({ loading: true });
    this._debounceTimer = setTimeout(() => this.runSearch(kw), 250);
  },

  onConfirm(e) {
    const kw = e.detail.value;
    if (!kw) return;
    this.runSearch(kw);
    this.pushHistory(kw);
  },

  async runSearch(kw) {
    try {
      const res = await api.search.query(kw);
      // 避免用户继续输入后覆盖新结果
      if (this.data.keyword !== kw) return;
      this.setData({ results: res.list, loading: false });
    } catch (e) {
      this.setData({ loading: false });
    }
  },

  pushHistory(kw) {
    const history = this.data.history.filter((x) => x !== kw);
    history.unshift(kw);
    const trimmed = history.slice(0, MAX_HISTORY);
    this.setData({ history: trimmed });
    storage.set(HISTORY_KEY, trimmed);
  },

  onUseKeyword(e) {
    const kw = e.currentTarget.dataset.kw;
    this.setData({ keyword: kw, loading: true });
    this.runSearch(kw);
    this.pushHistory(kw);
  },

  onClear() {
    this.setData({ keyword: '', results: [], loading: false });
  },

  onClearHistory() {
    wx.showModal({
      title: '清空搜索历史',
      content: '确定清空？',
      success: (res) => {
        if (res.confirm) {
          storage.remove(HISTORY_KEY);
          this.setData({ history: [] });
        }
      }
    });
  },

  onResultTap(e) {
    const item = e.currentTarget.dataset.item;
    const meta = { title: item.title, desc: item.desc };
    // search 返回的 type 与 detail 页 type 完全一致：trend/discussion/skill/path
    // 注意：trend → hotspot 映射
    const type = item.type === 'trend' ? 'hotspot' : item.type;
    wx.navigateTo({
      url: `/pages/detail/detail?type=${type}&id=${item.id}&meta=${encodeURIComponent(JSON.stringify(meta))}`
    });
  }
});
