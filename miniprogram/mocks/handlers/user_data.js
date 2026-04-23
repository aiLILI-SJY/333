// mock 模式：收藏 / 阅读历史通过 wx.storage 持久化，关闭小程序重开仍在
const storage = require('../../utils/storage.js');

const KEY_FAV = 'favorites';          // [{itemType, itemId, title, createdAt}]
const KEY_HISTORY = 'read_history';   // [{itemType, itemId, title, readAt}] 倒序
const MAX_HISTORY = 300;

function readFav() { return storage.get(KEY_FAV) || []; }
function writeFav(list) { storage.set(KEY_FAV, list); }
function readHistory() { return storage.get(KEY_HISTORY) || []; }
function writeHistory(list) { storage.set(KEY_HISTORY, list); }

module.exports = [
  // 切换收藏
  {
    method: 'POST',
    match: (url) => url === '/favorites/toggle',
    handle: ({ data }) => {
      const { itemType, itemId, title } = data || {};
      if (!itemType || !itemId) return { __error: '缺少参数' };

      const list = readFav();
      const idx = list.findIndex((x) => x.itemType === itemType && x.itemId === itemId);
      if (idx >= 0) {
        list.splice(idx, 1);
        writeFav(list);
        return { favored: false };
      }
      list.unshift({ itemType, itemId, title: title || '', createdAt: new Date().toISOString() });
      writeFav(list);
      return { favored: true };
    }
  },

  // 列出收藏
  {
    method: 'GET',
    match: (url) => url === '/favorites',
    handle: () => ({
      list: readFav()
    })
  },

  // 上报阅读
  {
    method: 'POST',
    match: (url) => url === '/read/record',
    handle: ({ data }) => {
      const { itemType, itemId, title } = data || {};
      if (!itemType || !itemId) return { __error: '缺少参数' };

      const list = readHistory();
      // 如果已经读过，更新时间戳并移到最前面
      const existIdx = list.findIndex((x) => x.itemType === itemType && x.itemId === itemId);
      if (existIdx >= 0) list.splice(existIdx, 1);

      list.unshift({
        itemType,
        itemId,
        title: title || '',
        readAt: new Date().toISOString()
      });

      // 限长
      const trimmed = list.slice(0, MAX_HISTORY);
      writeHistory(trimmed);
      return { ok: true, count: trimmed.length };
    }
  },

  // 查询阅读历史（分页）
  {
    method: 'GET',
    match: (url) => url === '/read/history',
    handle: ({ data }) => {
      const list = readHistory();
      const page = Number((data && data.page) || 1);
      const pageSize = Number((data && data.pageSize) || 20);
      const start = (page - 1) * pageSize;
      const slice = list.slice(start, start + pageSize);
      return {
        list: slice,
        total: list.length,
        page,
        pageSize,
        hasMore: start + pageSize < list.length
      };
    }
  }
];
