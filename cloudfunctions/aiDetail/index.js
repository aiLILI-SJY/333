const cloud = require('wx-server-sdk');
const https = require('https');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

const CACHE_TTL_MS = 7 * 24 * 3600 * 1000; // 7 天缓存，过期会重新生成

// ============ DeepSeek 调用 ============
function callDeepSeek(messages, maxTokens = 1200) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'deepseek-chat',
      messages,
      temperature: 0.75,
      max_tokens: maxTokens
    });
    const req = https.request({
      hostname: 'api.deepseek.com',
      path: '/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'Authorization': `Bearer ${process.env.DEEPSEEK_KEY}`
      },
      timeout: 30000
    }, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) return reject(new Error(parsed.error.message));
          resolve(parsed.choices[0].message.content || '');
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('deepseek timeout')));
    req.write(body);
    req.end();
  });
}

// ============ 根据 type 拼提示词 ============
function buildPrompt(type, meta) {
  if (type === 'hotspot') {
    return `作为技术媒体编辑，请为"${meta.title}"这个技术热点撰写一篇 300-400 字的深度解读文章。
技术标签：${(meta.tags || []).join('、') || '无'}

请严格按以下 JSON 格式输出，不要 markdown 代码块：
{
  "subtitle": "副标题（15字内，有吸引力）",
  "sections": [
    { "heading": "背景", "body": "50-80字段落" },
    { "heading": "核心价值", "body": "60-100字段落" },
    { "heading": "适合谁", "body": "40-60字，说明哪些角色应该关注" },
    { "heading": "学习建议", "body": "50-80字，给出 2-3 个具体的入门路径" }
  ],
  "keywords": ["5-8 个核心关键词"],
  "relatedSkills": ["相关的 3-5 个技术栈"]
}`;
  }

  if (type === 'discussion') {
    return `作为资深软件工程师，请针对"${meta.title}"这个话题写一篇观点文章。
话题摘要：${meta.desc || ''}
分类：${meta.category || ''}

请严格按以下 JSON 格式输出：
{
  "hook": "30字内引子，吸引读者",
  "sections": [
    { "heading": "现象观察", "body": "80-120字描述现状" },
    { "heading": "核心争论", "body": "80-120字给出正反观点" },
    { "heading": "我的判断", "body": "60-100字给出倾向性结论" }
  ],
  "takeaways": ["3-5 条可直接行动的启示"],
  "readingTime": "${meta.readTime || '5分钟阅读'}"
}`;
  }

  if (type === 'skill') {
    return `作为技术学习导师，请为"${meta.title}"这门技术写一份学习简介。
当前需求热度：${meta.level || 'mid'}

请严格按以下 JSON 格式输出：
{
  "subtitle": "一句话说明这是什么",
  "sections": [
    { "heading": "它解决什么问题", "body": "80-100字" },
    { "heading": "典型应用场景", "body": "3-5 个具体案例" },
    { "heading": "学习路径", "body": "入门到进阶的 3 个阶段描述" }
  ],
  "prerequisites": ["前置技能，2-4 个"],
  "careerFit": ["适合的 3-5 种岗位"],
  "estimatedWeeks": 8
}`;
  }

  if (type === 'path') {
    return `作为 AI 技术学习规划师，请为"${meta.title}"这条学习路径生成详细课程大纲。
路径定位：${meta.desc || ''}

请严格按以下 JSON 格式输出：
{
  "overview": "80字内的路径整体介绍",
  "modules": [
    {
      "name": "模块1名称",
      "weeks": 2,
      "topics": ["知识点1", "知识点2", "知识点3"],
      "project": "产出物描述"
    },
    { "name": "模块2名称", "weeks": 3, "topics": ["..."], "project": "..." },
    { "name": "模块3名称", "weeks": 3, "topics": ["..."], "project": "..." },
    { "name": "模块4名称", "weeks": 2, "topics": ["..."], "project": "..." }
  ],
  "totalWeeks": 10,
  "outcome": "完成后能做什么（60字）"
}`;
  }

  return '';
}

// ============ 容错 JSON 解析 ============
function safeParseJSON(text) {
  if (!text) return null;
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    return JSON.parse(match[0]);
  } catch (e) { return null; }
}

// ============ 主入口 ============
exports.main = async (event) => {
  try {
    const { type, id, meta, force } = event;
    if (!type || !id) return { __error: '缺少 type 或 id 参数' };
    if (!['hotspot', 'discussion', 'skill', 'path'].includes(type)) {
      return { __error: '不支持的 type: ' + type };
    }

    // 1. 查缓存
    if (!force) {
      try {
        const cached = await db.collection('details')
          .where({ itemType: type, itemId: id })
          .limit(1)
          .get();
        if (cached.data.length > 0) {
          const doc = cached.data[0];
          const age = Date.now() - (new Date(doc.generatedAt).getTime() || 0);
          if (age < CACHE_TTL_MS) {
            return { ...doc.content, __cached: true, generatedAt: doc.generatedAt };
          }
        }
      } catch (e) { /* 集合可能不存在，忽略 */ }
    }

    // 2. 调 DeepSeek
    if (!process.env.DEEPSEEK_KEY) {
      return { __error: '云函数 aiDetail 未配置 DEEPSEEK_KEY 环境变量' };
    }
    const prompt = buildPrompt(type, meta || {});
    const rawText = await callDeepSeek([
      { role: 'system', content: '你是一位面向中国大学生软件工程师的资深技术导师，语言精准简洁。' },
      { role: 'user', content: prompt }
    ], 1500);

    const parsed = safeParseJSON(rawText);
    const content = parsed || { error: 'AI 返回格式异常', raw: rawText.slice(0, 500) };

    // 3. 落库
    try {
      const existing = await db.collection('details')
        .where({ itemType: type, itemId: id }).get();
      if (existing.data.length > 0) {
        await db.collection('details').doc(existing.data[0]._id).update({
          data: { content, generatedAt: db.serverDate() }
        });
      } else {
        await db.collection('details').add({
          data: {
            itemType: type,
            itemId: id,
            meta: meta || {},
            content,
            generatedAt: db.serverDate()
          }
        });
      }
    } catch (e) { /* 记录失败不阻塞 */ }

    return { ...content, __cached: false, generatedAt: Date.now() };
  } catch (err) {
    return { __error: err.message || String(err) };
  }
};
