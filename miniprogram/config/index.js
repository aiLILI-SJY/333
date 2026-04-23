// 运行模式：
//   'mock'  — 本地静态数据，无需任何后端（开发期默认）
//   'cloud' — 微信云开发（比赛演示/线上）
//   'http'  — 自建后端（预留，暂未启用）
//
// 切模式只需改下面一行。cloud 模式还需要填 cloudEnv。
module.exports = {
  mode: 'mock',

  // 微信云开发环境 ID（在开发者工具"云开发"控制台新建环境后可看到）
  // 例如: 'cloud1-4g9xxxxxxxxxxxxx'
  cloudEnv: '',

  // http 模式用（暂未启用）
  baseURL: 'https://api.seetheworld.example.com',

  timeout: 15000,
  mockDelay: { min: 200, max: 600 }
};
