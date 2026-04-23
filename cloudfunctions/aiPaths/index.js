const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

// aiPaths 当前直接返回预置内容（避免每次都调 AI 增加延迟）
// 进阶：可按 profileStats 的 radar 个性化，后续迭代
exports.main = async () => {
  try {
    // 优先从 ai_paths 集合读（如果有管理端维护），否则降级到硬编码
    try {
      const { data } = await db.collection('ai_paths').limit(1).get();
      if (data.length > 0) return data[0];
    } catch (e) {}

    return {
      primary: {
        id: 'python',
        title: '优先学习 Python 工程化',
        desc: '基于依赖关系分析，Python 是连接后端编排与新兴 AI 工具链的关键桥梁。掌握它可解锁增加 68% 的相关职业发展路径。',
        icon: '⌨',
        cta: '开始学习'
      },
      secondary: [
        { id: 'sql', step: 2, icon: '🗄', tone: 'success', title: '高级 SQL 建模', progress: 33 },
        { id: 'bedrock', step: 3, icon: '☁', tone: 'tertiary', title: 'AWS Bedrock 基础', progress: 0 }
      ]
    };
  } catch (err) {
    return { __error: err.message || String(err) };
  }
};
