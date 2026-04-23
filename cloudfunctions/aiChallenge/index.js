const cloud = require('wx-server-sdk');
const https = require('https');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

function callDeepSeek(messages) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'deepseek-chat',
      messages,
      temperature: 0.8,
      max_tokens: 1000
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

exports.main = async () => {
  try {
    if (!process.env.DEEPSEEK_KEY) {
      return { __error: '未配置 DEEPSEEK_KEY 环境变量' };
    }
    const { OPENID } = cloud.getWXContext();

    const prompt = `请为一名正在学习 AI 工程化的大学生，生成 1 个适合参加"大学生软件工程大赛"的选题。

请严格按以下 JSON 格式输出，不要任何额外解释，不要 markdown 代码块：
{
  "title": "题目名称（20字内）",
  "outline": [
    "目标：一句话",
    "技术栈：列出 3-4 个关键组件",
    "产出：交付物和评审物",
    "评估：评价指标"
  ],
  "estimatedWeeks": 6
}`;

    const content = await callDeepSeek([
      { role: 'system', content: '你是一位大学生创新创业导师。' },
      { role: 'user', content: prompt }
    ]);

    // 容错解析 JSON
    let parsed = null;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
    } catch (e) {}

    const result = parsed && parsed.title ? {
      id: 'chal-' + Date.now(),
      title: parsed.title,
      outline: Array.isArray(parsed.outline) ? parsed.outline : [],
      estimatedWeeks: parsed.estimatedWeeks || 6
    } : {
      id: 'chal-' + Date.now(),
      title: '基于 LLM 的代码依赖分析工具',
      outline: [
        '目标：用 LangChain 搭建依赖图生成器',
        '技术栈：Python + Graphviz + FastAPI',
        '产出：原型 + 竞赛题解文档',
        '评估：依赖覆盖率 + AI 洞察质量'
      ],
      estimatedWeeks: 6
    };

    try {
      await db.collection('ai_conversations').add({
        data: {
          type: 'challenge',
          input: prompt,
          output: content,
          openid: OPENID,
          createdAt: db.serverDate()
        }
      });
    } catch (e) {}

    return result;
  } catch (err) {
    return { __error: err.message || String(err) };
  }
};
