const cloud = require('wx-server-sdk');
const https = require('https');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

// 调用 DeepSeek Chat Completions
function callDeepSeek(messages) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'deepseek-chat',
      messages,
      temperature: 0.7,
      max_tokens: 800
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
      timeout: 20000
    }, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) return reject(new Error(parsed.error.message || 'deepseek error'));
          const content = parsed.choices && parsed.choices[0] && parsed.choices[0].message.content;
          resolve(content || '');
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('deepseek timeout')));
    req.write(body);
    req.end();
  });
}

// 把 DeepSeek 返回的文本切成 3 条摘要要点
function parseBullets(text) {
  const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const bullets = [];
  for (const line of lines) {
    const cleaned = line.replace(/^[\-\*\d\.\s、)]+/, '').trim();
    if (!cleaned) continue;
    // 取首个"，/；/："之前的短语当 strong
    const match = cleaned.match(/^(.+?)[，；,:：]\s*(.*)$/);
    if (match) bullets.push({ strong: match[1].slice(0, 30), rest: '，' + match[2] });
    else bullets.push({ strong: cleaned.slice(0, 30), rest: cleaned.slice(30) });
    if (bullets.length >= 3) break;
  }
  return bullets;
}

exports.main = async () => {
  try {
    if (!process.env.DEEPSEEK_KEY) {
      return { __error: '未配置 DEEPSEEK_KEY 环境变量' };
    }

    const prompt = `请作为技术生态分析师，基于当前中国软件工程就业市场，给出 3 条简洁的核心观察。要求：
1. 每条一句话，以一个粗体短语开头（比如"Python 在编排层的主导地位不断巩固"），后接分析
2. 聚焦 AI/后端/前端/数据工程的最新演进
3. 输出 3 行即可，不要编号、不要多余解释`;

    const content = await callDeepSeek([
      { role: 'system', content: '你是一位面向软工学生的资深技术顾问，回答简洁、精准、有洞察。' },
      { role: 'user', content: prompt }
    ]);

    const items = parseBullets(content);
    const result = {
      generatedAt: Date.now(),
      model: 'deepseek-chat',
      items: items.length > 0 ? items : [
        { strong: 'AI 整合需求推动 Python 主导', rest: '编排层的协同压力大于纯后端服务' },
        { strong: '前端元框架稳居主流', rest: 'Next.js / Nuxt 降低状态管理认知负荷' },
        { strong: '数据工程混合角色崛起', rest: '成为中级→领导层的最高增长矢量' }
      ]
    };

    // 可选：把本次 AI 调用记录存入 ai_conversations（审计/回放）
    try {
      const { OPENID } = cloud.getWXContext();
      await db.collection('ai_conversations').add({
        data: {
          type: 'summary',
          input: prompt,
          output: content,
          openid: OPENID,
          createdAt: db.serverDate()
        }
      });
    } catch (e) { /* 集合可能没建，忽略 */ }

    return result;
  } catch (err) {
    return { __error: err.message || String(err) };
  }
};
