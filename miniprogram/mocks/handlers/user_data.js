// mock 模式下的收藏/阅读历史，存内存即可（刷新小程序会丢）
const favorites = new Map();    // key: itemType+itemId
const readHistory = new Set();  // key: itemType+itemId

module.exports = [
  {
    method: 'POST',
    match: (url) => url === '/favorites/toggle',
    handle: ({ data }) => {
      const key = `${data.itemType}:${data.itemId}`;
      if (favorites.has(key)) {
        favorites.delete(key);
        return { favored: false };
      }
      favorites.set(key, { ...data, createdAt: Date.now() });
      return { favored: true };
    }
  },
  {
    method: 'GET',
    match: (url) => url === '/favorites',
    handle: () => ({
      list: Array.from(favorites.values()).sort((a, b) => b.createdAt - a.createdAt)
    })
  },
  {
    method: 'POST',
    match: (url) => url === '/read/record',
    handle: ({ data }) => {
      readHistory.add(`${data.itemType}:${data.itemId}`);
      return { ok: true, count: readHistory.size };
    }
  }
];
