const app = getApp();
const api = require('../../api/index.js');
const storage = require('../../utils/storage.js');

const GRADE_OPTIONS = ['大一', '大二', '大三', '大四', '研一', '研二', '研三', '已毕业'];

Page({
  data: {
    form: { name: '', school: '', grade: '', major: '', role: '' },
    gradeOptions: GRADE_OPTIONS,
    gradeIndex: 0,
    saving: false
  },

  onLoad() {
    const user = app.globalData.userInfo || {};
    const form = {
      name: user.name || '',
      school: user.school || '',
      grade: user.grade || '',
      major: user.major || '',
      role: user.role || ''
    };
    const gradeIndex = Math.max(0, GRADE_OPTIONS.indexOf(form.grade));
    this.setData({ form, gradeIndex });
  },

  onInput(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ [`form.${key}`]: e.detail.value });
  },

  // 微信昵称合规审查回调（微信侧自动判违规）
  onNickReview(e) {
    if (e.detail && e.detail.pass === false) {
      wx.showToast({ title: '昵称含违规内容', icon: 'none' });
    }
  },

  onGradeChange(e) {
    const idx = Number(e.detail.value);
    this.setData({ gradeIndex: idx, 'form.grade': GRADE_OPTIONS[idx] });
  },

  onCancel() { wx.navigateBack(); },

  async onSave() {
    if (this.data.saving) return;
    const { name } = this.data.form;
    if (!name || !name.trim()) {
      wx.showToast({ title: '请填写昵称', icon: 'none' });
      return;
    }
    this.setData({ saving: true });
    try {
      const res = await api.auth.updateProfile(this.data.form);
      if (res.__error) throw new Error(res.__error);

      // 更新全局 + 本地缓存
      const user = Object.assign({}, app.globalData.userInfo, this.data.form);
      app.globalData.userInfo = user;
      storage.set('user', user, 1000 * 60 * 60 * 24 * 7);
      app.notify('userChanged');

      wx.showToast({ title: '已保存', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 600);
    } catch (e) {
      wx.showToast({ title: '保存失败：' + (e.message || ''), icon: 'none' });
    } finally {
      this.setData({ saving: false });
    }
  }
});
