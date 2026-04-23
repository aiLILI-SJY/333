const app = getApp();
const api = require('../../api/index.js');

Page({
  data: {
    statusBarHeight: 20,
    cityOptions: ['全部城市', '北京', '上海', '深圳', '贵阳', '杭州'],
    cityIndex: 0,
    expOptions: ['全部经验', '实习', '应届生', '1-3年', '3-5年'],
    expIndex: 0,
    yAxisLabels: ['100k', '75k', '50k', '25k', '0'],
    xAxisLabels: ['1月', '3月', '5月', '7月', '9月', '11月'],
    linePointsPct: [],
    trendYoY: 0,
    salaryBars: [],
    loadingBars: true,
    skills: [],
    lineTooltip: { visible: false, x: 0, y: 0, label: '', value: 0 }
  },

  onLoad() {
    this.setData({ statusBarHeight: app.globalData.statusBarHeight || 20 });
    this.fetchAll();
  },

  onReady() {
    this._canvasReady = true;
    if (this.data.linePointsPct.length) this.drawLineChart();
  },

  cityCode() {
    const map = ['all', '北京', '上海', '深圳', '贵阳', '杭州'];
    return map[this.data.cityIndex];
  },
  expCode() {
    const map = ['all', '实习', '应届生', '1-3年', '3-5年'];
    return map[this.data.expIndex];
  },

  async fetchAll() {
    try {
      const [trend, salary, skills] = await Promise.all([
        api.dataviz.trend(this.cityCode(), this.expCode()),
        api.dataviz.salary(this.cityCode(), this.expCode()),
        api.dataviz.skills()
      ]);
      this.setData({
        linePointsPct: trend.points,
        trendYoY: trend.yoy,
        salaryBars: salary.list,
        loadingBars: false,
        skills: skills.list
      });
      if (this._canvasReady) this.drawLineChart();
    } catch (e) {
      wx.showToast({ title: '数据加载失败', icon: 'none' });
      this.setData({ loadingBars: false });
    }
  },

  async fetchTrendAndSalary() {
    try {
      this.setData({ loadingBars: true });
      const [trend, salary] = await Promise.all([
        api.dataviz.trend(this.cityCode(), this.expCode()),
        api.dataviz.salary(this.cityCode(), this.expCode())
      ]);
      this.setData({
        linePointsPct: trend.points,
        trendYoY: trend.yoy,
        salaryBars: salary.list,
        loadingBars: false
      });
      this.drawLineChart();
    } catch (e) {
      this.setData({ loadingBars: false });
    }
  },

  drawLineChart() {
    const query = wx.createSelectorQuery().in(this);
    query.select('#lineCanvas')
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

        const padLeft = 40;
        const padRight = 10;
        const padTop = 10;
        const padBottom = 20;
        const chartW = w - padLeft - padRight;
        const chartH = h - padTop - padBottom;

        // 保留给 touch 用
        this._lineGeom = { padLeft, padRight, padTop, padBottom, chartW, chartH, w, h };

        ctx.clearRect(0, 0, w, h);

        ctx.strokeStyle = '#F1F3F4';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padTop + (chartH / 4) * i;
          ctx.beginPath();
          ctx.moveTo(padLeft, y);
          ctx.lineTo(padLeft + chartW, y);
          ctx.stroke();
        }

        ctx.fillStyle = '#727785';
        ctx.font = '10px monospace';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        this.data.yAxisLabels.forEach((label, i) => {
          const y = padTop + (chartH / (this.data.yAxisLabels.length - 1)) * i;
          ctx.fillText(label, padLeft - 6, y);
        });

        const points = this.data.linePointsPct.map((p) => ({
          x: padLeft + (p.xp / 100) * chartW,
          y: padTop + (p.yp / 100) * chartH,
          yp: p.yp
        }));
        this._linePoints = points;

        const grad = ctx.createLinearGradient(0, padTop, 0, padTop + chartH);
        grad.addColorStop(0, 'rgba(26,115,232,0.25)');
        grad.addColorStop(1, 'rgba(26,115,232,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(points[0].x, padTop + chartH);
        points.forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.lineTo(points[points.length - 1].x, padTop + chartH);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#1A73E8';
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();
        points.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();

        points.forEach((p, i) => {
          const isLast = i === points.length - 1;
          ctx.beginPath();
          ctx.fillStyle = isLast ? '#1A73E8' : '#FFFFFF';
          ctx.strokeStyle = isLast ? '#FFFFFF' : '#1A73E8';
          ctx.lineWidth = 2;
          ctx.arc(p.x, p.y, isLast ? 5 : 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        });
      });
  },

  onLineTouch(e) {
    if (!this._linePoints) return;
    const touch = e.touches[0];
    if (!touch) return;
    const x = touch.x;
    // 找最近的数据点
    let nearest = this._linePoints[0];
    let minDist = Infinity;
    let nearestIdx = 0;
    this._linePoints.forEach((p, i) => {
      const d = Math.abs(p.x - x);
      if (d < minDist) { minDist = d; nearest = p; nearestIdx = i; }
    });
    // 推导近似职位数：yp=0 顶部 100k, yp=100 底部 0
    const value = Math.round(100 - nearest.yp);
    // 月份标签：使用 xAxisLabels
    const labels = this.data.xAxisLabels;
    const labelIdx = Math.min(labels.length - 1, Math.round(nearestIdx / (this._linePoints.length - 1) * (labels.length - 1)));
    this.setData({
      lineTooltip: {
        visible: true,
        x: nearest.x,
        y: nearest.y,
        label: labels[labelIdx],
        value
      }
    });
  },

  onLineTouchEnd() {
    setTimeout(() => {
      this.setData({ 'lineTooltip.visible': false });
    }, 1500);
  },

  onSearch() {},

  onShareAppMessage() {
    return { title: '软工岗位数据：谁在涨薪？', path: '/pages/dataviz/dataviz' };
  },
  onShareTimeline() {
    return { title: '见世界 · 就业数据可视化' };
  },

  onCityChange(e) {
    this.setData({ cityIndex: Number(e.detail.value) });
    this.fetchTrendAndSalary();
  },

  onExpChange(e) {
    this.setData({ expIndex: Number(e.detail.value) });
    this.fetchTrendAndSalary();
  },

  onBarTap(e) {
    const { name, value } = e.currentTarget.dataset;
    wx.showToast({ title: `${name}: ${value}k`, icon: 'none' });
  },

  onSkillTap(e) {
    const name = e.currentTarget.dataset.name;
    const skill = this.data.skills.find((x) => x.name === name);
    const meta = { title: name, level: skill ? skill.level : 'mid' };
    wx.navigateTo({
      url: `/pages/detail/detail?type=skill&id=${encodeURIComponent(name)}&meta=${encodeURIComponent(JSON.stringify(meta))}`
    });
  }
});
