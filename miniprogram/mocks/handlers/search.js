const CORPUS = [
  { type: 'trend', id: 'llm-orchestration', title: 'LLM 编排框架', desc: 'LangChain、LlamaIndex 的对比' },
  { type: 'trend', id: 'rust-backend', title: 'Rust 后端系统', desc: 'Axum/Actix 的生产实践' },
  { type: 'discussion', id: 'disc-1', title: '服务端驱动 UI 的转变', desc: '减少客户端逻辑加快迭代' },
  { type: 'discussion', id: 'disc-3', title: 'WebAssembly 渗透主流企业工具', desc: '重计算接近原生性能' },
  { type: 'skill', id: 'pytorch', title: 'PyTorch', desc: '深度学习主流框架' },
  { type: 'skill', id: 'kubernetes', title: 'Kubernetes', desc: '云原生编排' },
  { type: 'path', id: 'python', title: 'Python 工程化路径', desc: '68% 相关职业路径' }
];
const HOT = ['PyTorch', 'LLM', 'Rust 后端', 'Kubernetes', 'RAG', '服务端驱动 UI'];

module.exports = [
  {
    method: 'GET',
    match: (url) => url === '/search/hot',
    handle: () => ({ list: HOT })
  },
  {
    method: 'GET',
    match: (url) => url.startsWith('/search'),
    handle: ({ data }) => {
      const kw = (data.keyword || '').toLowerCase();
      if (!kw) return { list: [] };
      const list = CORPUS.filter((x) =>
        x.title.toLowerCase().includes(kw) || x.desc.toLowerCase().includes(kw)
      );
      return { list };
    }
  }
];
