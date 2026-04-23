const app = getApp();
const api = require('../../api/index.js');

Page({
  data: {
    statusBarHeight: 20,
    user: { name: '', school: '', grade: '', major: '' },
    avatar: '',
    avatarInitial: 'A',
    readCount: 0,
    readTarget: 1,
    readProgress: 0,
    readDelta: 0,
    radarData: [],
    careerTitle: '',
    careerTags: [],
    loading: true,
    selectedRadar: null
  },

  onLoad() {
    this.setData({ statusBarHeight: app.globalData.statusBarHeight || 20 });
    this._userListener = () => this.syncUserFromGlobal();
    app.on('userChanged', this._userListener);
    this.syncUserFromGlobal();
    this.fetchStats();
  },

  onUnload() {
    if (this._userListener) app.off('userChanged', this._userListener);
  },

  onReady() {
    this._radarCanvasReady = true;
    if (this.data.radarData.length) this.drawRadar();
  },

  syncUserFromGlobal() {
    const user = app.globalData.userInfo;
    if (!user) return;
    this.setData({
      user,
      avatar: user.avatar || '',
      avatarInitial: (user.name || 'A').slice(0, 1)
    });
  },

  async fetchStats() {
    try {
      const stats = await api.profile.stats();
      const progress = Math.round((stats.read.count / stats.read.target) * 100);
      this.setData({
        readCount: stats.read.count,
        readTarget: stats.read.target,
        readProgress: progress,
        readDelta: stats.read.deltaPct,
        radarData: stats.radar,
        careerTitle: stats.career.title,
        careerTags: stats.career.tags,
        loading: false
      });
      if (this._radarCanvasReady) this.drawRadar();
    } catch (e) {
      wx.showToast({ title: '加载失败', icon: 'none' });
      this.setData({ loading: false });
    }
  },

  drawRadar() {
    const query = wx.createSelectorQuery().in(this);
    query.select('#radarCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0] || !res[0].node) return;
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getSystemInfoSync().pixelRatio;
        const w = res[0].width;
        const h = res[0].height;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.scale(dpr, dpr);

        const cx = w / 2;
        const cy = h / 2;
        const radius = Math.min(w, h) / 2 - 40;
        const data = this.data.radarData;
        const total = data.length;
        if (!total) return;
        const angleStep = (Math.PI * 2) / total;
        this._radarGeom = { cx, cy, radius, angleStep, total };

        ctx.strokeStyle = '#E8EAED';
        ctx.lineWidth = 1;
        for (let l = 1; l <= 3; l++) {
          const r = (radius / 3) * l;
          ctx.beginPath();
          for (let i = 0; i < total; i++) {
            const angle = -Math.PI / 2 + i * angleStep;
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.stroke();
        }

        for (let i = 0; i < total; i++) {
          const angle = -Math.PI / 2 + i * angleStep;
          const x = cx + radius * Math.cos(angle);
          const y = cy + radius * Math.sin(angle);
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(x, y);
          ctx.stroke();
        }

        ctx.fillStyle = 'rgba(26,115,232,0.2)';
        ctx.strokeStyle = '#1A73E8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        data.forEach((d, i) => {
          const angle = -Math.PI / 2 + i * angleStep;
          const r = radius * d.value;
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        data.forEach((d, i) => {
          const angle = -Math.PI / 2 + i * angleStep;
          const r = radius * d.value;
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          ctx.beginPath();
          ctx.fillStyle = '#1A73E8';
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.fillStyle = '#414754';
        ctx.font = '11px sans-serif';
        ctx.textBaseline = 'middle';
        data.forEach((d, i) => {
          const angle = -Math.PI / 2 + i * angleStep;
          const lr = radius + 18;
          const x = cx + lr * Math.cos(angle);
          const y = cy + lr * Math.sin(angle);
          if (Math.abs(Math.cos(angle)) < 0.1) ctx.textAlign = 'center';
          else if (Math.cos(angle) > 0) ctx.textAlign = 'left';
          else ctx.textAlign = 'right';
          ctx.fillText(d.label, x, y);
        });
      });
  },

  onSearch() { /* top-bar 自己处理跳转 */ },

  onRadarTap(e) {
    if (!this._radarGeom) return;
    const { x, y } = e.detail;
    const { cx, cy, angleStep, total } = this._radarGeom;
    const dx = x - cx;
    const dy = y - cy;
    // 把 x 轴右为 0，需要把上方(y<0)当 -PI/2
    let ang = Math.atan2(dy, dx);
    // 以 -PI/2 为 0 轴（第一个维度）
    let normalized = ang + Math.PI / 2;
    if (normalized < 0) normalized += Math.PI * 2;
    const idx = Math.round(normalized / angleStep) % total;
    const item = this.data.radarData[idx];
    if (!item) return;
    this.setData({
      selectedRadar: {
        label: item.label,
        percent: Math.round(item.value * 100)
      }
    });
  },

  // 点击原生 open-type=chooseAvatar 按钮的回调
  async onChooseAvatar(e) {
    const tempPath = e.detail.avatarUrl;
    if (!tempPath) return;

    wx.showLoading({ title: '上传中', mask: true });
    try {
      const config = require('../../config/index.js');
      let remoteUrl = tempPath; // mock / http 模式直接用本地路径

      if (config.mode === 'cloud' && wx.cloud) {
        // 上传到云存储
        const ext = tempPath.match(/\.(\w+)$/);
        const cloudPath = `avatars/${app.globalData.openid || 'user'}-${Date.now()}.${ext ? ext[1] : 'jpg'}`;
        const upRes = await wx.cloud.uploadFile({ cloudPath, filePath: tempPath });
        remoteUrl = upRes.fileID;  // cloud:// 开头，image 组件能直接渲染
      }

      await api.auth.uploadAvatar(remoteUrl);
      this.setData({ avatar: remoteUrl });
      const user = Object.assign({}, app.globalData.userInfo, { avatar: remoteUrl });
      app.globalData.userInfo = user;
      app.notify('userChanged');

      wx.hideLoading();
      wx.showToast({ title: '头像已更新', icon: 'success' });
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: '上传失败: ' + (err.errMsg || err.message || ''), icon: 'none' });
    }
  },

  onQuickEdit() {
    wx.navigateTo({ url: '/pages/edit-profile/edit-profile' });
  },

  onMenuTap(e) {
    const id = e.currentTarget.dataset.id;
    const urlMap = {
      edit: '/pages/edit-profile/edit-profile',
      favorites: '/pages/favorites/favorites',
      history: '/pages/history/history',
      settings: '/pages/settings/settings'
    };
    const url = urlMap[id];
    if (url) wx.navigateTo({ url });
  }
});
