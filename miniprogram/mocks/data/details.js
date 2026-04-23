// 演示版预置详情内容 —— 字段严格匹配 pages/detail/detail.wxml 的 wx:if 分支
// hotspot:    subtitle / sections[{heading, body}] / keywords / relatedSkills
// discussion: hook / sections / takeaways / readingTime
// skill:      subtitle / sections / prerequisites / careerFit / estimatedWeeks
// path:       overview / modules[{name, weeks, topics, project}] / totalWeeks / outcome

const HOTSPOT = {
  'llm-orchestration': {
    subtitle: 'LangChain、LlamaIndex、Agno —— 编排层正在取代框架层',
    sections: [
      { heading: '背景', body: 'LLM 应用不再是"写一个 Prompt"那么简单，RAG、工具调用、多步推理都需要结构化编排。LangChain 在 2023 年一度成为事实标准，但因 API 过度抽象被诟病，新一代框架 LlamaIndex、DSPy、Agno 更聚焦检索与评测。' },
      { heading: '核心价值', body: '编排层把"模型-提示-检索-工具-评测"拉成一条可观测、可热替换的管道，让企业能快速把 GPT / Claude / DeepSeek 等模型替换验证，而不改业务代码。' },
      { heading: '适合谁', body: '后端工程师想转 AI 方向、算法工程师需要工程化部署、创业团队的全栈开发者都应学习。' },
      { heading: '学习建议', body: '1) 先用 LangChain 跑通一个 RAG Demo；2) 理解 DSPy 的"编程范式代替 Prompt 写作"；3) 学会用 LangSmith/Langfuse 做可观测。' }
    ],
    keywords: ['LangChain', 'RAG', 'Agent', 'DSPy', '工具调用', 'LangSmith'],
    relatedSkills: ['Python', 'PyTorch', '向量数据库', 'FastAPI']
  },
  'rust-backend': {
    subtitle: 'Rust 正从系统语言走向企业级后端主流',
    sections: [
      { heading: '背景', body: 'Cloudflare、Discord、字节跳动等公司在延迟敏感链路上把 Go 甚至 Java 替换为 Rust，实证了其在吞吐与内存安全上的双重优势。' },
      { heading: '核心价值', body: '所有权系统消除了整类内存错误，Tokio 异步运行时使得单机 QPS 能逼近 C++ 水平，同时享受现代包管理与类型系统。' },
      { heading: '适合谁', body: '对性能有极致追求的后端工程师、基础设施 SRE、区块链/金融系统开发者。' },
      { heading: '学习建议', body: '从 rustlings 练所有权 → 用 Axum 写 REST API → 读 tokio-rs/mini-redis 学异步设计。' }
    ],
    keywords: ['Tokio', 'Axum', '所有权', '零成本抽象', 'WASM', 'gRPC'],
    relatedSkills: ['Rust', 'Linux 系统编程', 'gRPC', '性能调优']
  },
  'edge-ai': {
    subtitle: '浏览器和手机正在成为新的 AI 运行时',
    sections: [
      { heading: '背景', body: 'WebGPU、ONNX Runtime Web、MediaPipe 让端侧推理变得真实可用。Apple Silicon 的 NPU、Qualcomm 的 Hexagon 也提供了专门加速。' },
      { heading: '核心价值', body: '边缘推理解决了三大痛点：隐私（数据不离端）、延迟（<50ms）、成本（不付 API token 费）。适合摄像头、语音、个性化推荐等场景。' },
      { heading: '适合谁', body: '前端工程师想拓宽到 AI、移动端开发者、做隐私敏感应用的产品团队。' },
      { heading: '学习建议', body: '用 transformers.js 在浏览器跑一个 BERT → 用 TensorFlow Lite 在 Android 部署图像分类 → 研究模型量化（int8/int4）。' }
    ],
    keywords: ['WebGPU', 'ONNX', 'transformers.js', '量化', 'NPU'],
    relatedSkills: ['JavaScript', 'TensorFlow', 'PyTorch', '模型压缩']
  },
  'sdui': {
    subtitle: '服务端驱动 UI：客户端越来越薄',
    sections: [
      { heading: '背景', body: 'Airbnb、字节、Spotify 等公司采用服务端下发 UI 描述（JSON Schema）以避免 App 发版拖慢业务迭代。' },
      { heading: '核心价值', body: '业务逻辑集中在后端，一次修改全端生效；A/B 实验可以在 UI 颗粒度做；端侧只维护渲染器与少量本地能力。' },
      { heading: '适合谁', body: '大型 App 的架构师、B 端工具团队、跨端业务团队。' },
      { heading: '学习建议', body: '读 Airbnb 的 Epoxy/GraphQL 演进文章 → 设计一个极简 DSL（JSON → 基础组件）→ 考虑渲染性能与可调试性。' }
    ],
    keywords: ['Server-Driven UI', 'JSON Schema', '灰度发布', 'Jetpack Compose'],
    relatedSkills: ['GraphQL', 'Design System', '跨端框架']
  }
};

const DISCUSSION = {
  'disc-1': {
    hook: '客户端越来越薄，服务端越来越"懂 UI"',
    sections: [
      { heading: '现象观察', body: '国内头部 App 都在扩大服务端驱动 UI 的占比。原因一是 App Store 审核拖慢迭代；二是多端一致性压力；三是 A/B 实验需要更细的颗粒度。' },
      { heading: '核心争论', body: '正方：SDUI 降低发版依赖、让产品经理几乎能实时调页面。反方：协议设计过于复杂，端侧要维护庞大的渲染器，调试困难，性能也不如原生。' },
      { heading: '我的判断', body: '适合"营销活动、列表流、表单"三类高频变动场景；不适合核心交易链路与强交互动画。选择时务必先评估"每月变更次数"。' }
    ],
    takeaways: ['用 JSON Schema 约束渲染节点', '保留关键交互在本地', '建立 UI 版本灰度与回滚'],
    readingTime: '3 分钟阅读'
  },
  'disc-2': {
    hook: '微前端不是"银弹"，是"协调剂"',
    sections: [
      { heading: '现象观察', body: '微前端解决的核心问题是：多团队在同一个页面里各自发版。代价是 bundle 体积、样式隔离、路由协调。' },
      { heading: '核心争论', body: '正方：团队自治，技术栈自由选择。反方：公共依赖难共享，运行时开销大，用户体验可能降级。' },
      { heading: '我的判断', body: '团队规模 < 20 人的单产品不要上微前端。超过 3 个独立团队 + 明确业务边界时，qiankun / wujie 才值得。' }
    ],
    takeaways: ['衡量标准：团队数 + 变更独立性', '优先考虑"包隔离"而不是"运行时隔离"', '公共依赖走 externals'],
    readingTime: '5 分钟阅读'
  },
  'disc-3': {
    hook: 'WebAssembly 成为"加速器"而不是"平台"',
    sections: [
      { heading: '现象观察', body: 'Figma、Photoshop Web、Autodesk 都在关键计算路径用 Wasm。Wasm 现在的角色更像"浏览器里的 C++ 插件"，而不是"要取代 JS"。' },
      { heading: '核心争论', body: '正方：接近原生性能，多语言编译。反方：与 DOM 交互仍需桥接，生态成熟度不足。' },
      { heading: '我的判断', body: '数据密集型（压缩、图像、加密、物理模拟）必选 Wasm；业务逻辑仍应留在 JS/TS。' }
    ],
    takeaways: ['识别"纯计算"瓶颈再上 Wasm', 'Rust / Zig 是主流编译源', '注意 bundle 体积与下载成本'],
    readingTime: '2 分钟阅读'
  },
  'disc-4': {
    hook: 'RAG 的瓶颈不在向量库，在召回策略',
    sections: [
      { heading: '现象观察', body: '早期大家以为"买一个向量库就能 RAG"，实际产品化时发现：召回率、Rerank、Query 改写才是质量关键。' },
      { heading: '核心争论', body: '正方：纯向量检索足够简单。反方：混合检索（BM25 + 向量）+ 二次排序 + 查询重写才是工业级方案。' },
      { heading: '我的判断', body: '生产环境至少要 3 路召回 + 一次 LLM Rerank。向量库选型反而次要。' }
    ],
    takeaways: ['先 BM25 摸底，再引入向量', '必做 Query Rewrite', '用"召回 @ K"评估而不是"命中即可"'],
    readingTime: '6 分钟阅读'
  },
  'disc-5': {
    hook: 'Monorepo：小团队的甜，中团队的坑',
    sections: [
      { heading: '现象观察', body: 'Turborepo、Nx、pnpm workspace 让 Monorepo 易上手，但随代码量增长，CI 时间、依赖图爆炸、权限管理都成了问题。' },
      { heading: '核心争论', body: '正方：代码共享、原子提交、工具链统一。反方：构建慢、仓库膨胀、git 操作卡顿。' },
      { heading: '我的判断', body: '2-5 人团队用 pnpm workspace 足够；10+ 人且跨产品的建议引入 Nx 的远程缓存与 affected graph。' }
    ],
    takeaways: ['必用远程缓存', '依赖边界必须显式声明', 'CI 走 affected 子图'],
    readingTime: '4 分钟阅读'
  }
};

const SKILL = {
  'PyTorch': {
    subtitle: '深度学习事实标准 · 研究与生产的首选',
    sections: [
      { heading: '它解决什么问题', body: 'PyTorch 用动态图 + Pythonic API 让模型定义、训练、调试比 TensorFlow 1.x 直观得多，几乎统治了学术界与大模型研发。' },
      { heading: '典型应用场景', body: 'CV（检测、分割）、NLP（BERT、Llama）、多模态（CLIP）、强化学习、扩散模型（Stable Diffusion）。' },
      { heading: '学习路径', body: '① 60 分钟官方 Tutorial 跑通 MNIST；② 读 transformers 源码理解分布式训练；③ 用 torch.compile / FSDP 优化大模型。' }
    ],
    prerequisites: ['Python 扎实', '线性代数 + 概率', 'Numpy'],
    careerFit: ['AI 算法工程师', 'LLM 研究员', 'CV/NLP 工程师'],
    estimatedWeeks: 10
  },
  'Docker': {
    subtitle: '应用打包与交付的通用语言',
    sections: [
      { heading: '它解决什么问题', body: '一次构建、到处运行。把代码 + 运行时 + 依赖打包成镜像，消除"在我机器上是好的"问题。' },
      { heading: '典型应用场景', body: '本地开发环境、CI/CD、微服务部署、K8s 运行时、AI 模型服务容器化。' },
      { heading: '学习路径', body: '① docker run 把 nginx 跑起来；② 写 Dockerfile 打包自己的 Node/Python 应用；③ 学多阶段构建 + 最小基础镜像 + 安全扫描。' }
    ],
    prerequisites: ['Linux 基础命令', '了解进程与网络'],
    careerFit: ['后端工程师', '运维 SRE', 'DevOps'],
    estimatedWeeks: 3
  },
  'Python': {
    subtitle: 'AI 时代的胶水语言，也是主流语言',
    sections: [
      { heading: '它解决什么问题', body: 'Python 在 AI、数据、Web、脚本、运维领域几乎无处不在。上手门槛低但生态极丰富。' },
      { heading: '典型应用场景', body: '机器学习建模（PyTorch/TF）、数据分析（pandas）、Web 后端（FastAPI/Django）、自动化脚本。' },
      { heading: '学习路径', body: '① 官方 Tutorial → 掌握类型注解与 dataclass；② 学 asyncio；③ 用 poetry/uv 做现代包管理；④ 写一个 FastAPI + SQLAlchemy 项目。' }
    ],
    prerequisites: ['编程基础（任何语言）'],
    careerFit: ['AI 工程师', '后端', '数据工程师', '自动化测试'],
    estimatedWeeks: 6
  },
  'Cloud Native': {
    subtitle: '云原生 · 现代软件交付的标准范式',
    sections: [
      { heading: '它解决什么问题', body: '容器化 + 微服务 + 声明式 API + 可观测，让应用能弹性扩缩、自愈、灰度发布。' },
      { heading: '典型应用场景', body: '企业级 SaaS、金融交易系统、大型电商、AI 推理服务。' },
      { heading: '学习路径', body: '① 学 Docker；② 上 K8s 跑 Deployment/Service；③ Prometheus + Grafana 搞可观测；④ 了解 Istio/Linkerd 服务网格。' }
    ],
    prerequisites: ['Docker', 'Linux 网络', '基本的分布式概念'],
    careerFit: ['架构师', 'SRE', 'DevOps'],
    estimatedWeeks: 12
  },
  'Kubernetes': {
    subtitle: '容器编排的事实标准',
    sections: [
      { heading: '它解决什么问题', body: 'K8s 抽象了资源调度、服务发现、滚动升级、配置管理，让大规模容器化应用可运维。' },
      { heading: '典型应用场景', body: '企业集群、公有云托管（EKS/GKE/ACK）、AI 训练平台、大数据平台。' },
      { heading: '学习路径', body: '① kubectl 玩熟 Pod/Deployment/Service；② Helm 做包管理；③ 学 Operator 模式；④ 理解 CNI/CSI/CRI。' }
    ],
    prerequisites: ['Docker', 'Linux', 'YAML 语法'],
    careerFit: ['SRE', '平台工程师', '云架构师'],
    estimatedWeeks: 8
  },
  'React': {
    subtitle: '前端组件化开发的王者',
    sections: [
      { heading: '它解决什么问题', body: '声明式组件 + 虚拟 DOM + 单向数据流，让复杂 UI 可组合、可测试、可维护。' },
      { heading: '典型应用场景', body: 'Web 应用、管理后台、React Native 跨端 App、Next.js 服务端渲染。' },
      { heading: '学习路径', body: '① 掌握 JSX + Hooks；② 学 Context/Reducer；③ 用 Next.js 做一个带路由和 SSR 的项目；④ 学性能优化（memo/lazy）。' }
    ],
    prerequisites: ['JavaScript ES6+', 'HTML/CSS'],
    careerFit: ['前端工程师', '全栈工程师'],
    estimatedWeeks: 6
  },
  'TensorFlow': {
    subtitle: 'Google 出品的端到端机器学习平台',
    sections: [
      { heading: '它解决什么问题', body: 'TF 覆盖从训练到移动端/Web 部署的完整链路，生态中 TF Lite、TF.js、TFX 在工业界特别受青睐。' },
      { heading: '典型应用场景', body: '移动端 AI（TF Lite）、浏览器 AI（TF.js）、企业级推荐系统、Google 生态深度整合场景。' },
      { heading: '学习路径', body: '① Keras 高层 API 跑一个分类模型；② 学 tf.data 数据管道；③ 用 TF Lite 做端侧部署。' }
    ],
    prerequisites: ['Python', '机器学习基础'],
    careerFit: ['机器学习工程师', '移动端 AI'],
    estimatedWeeks: 8
  },
  'Go': {
    subtitle: 'Google 出品的云原生后端语言',
    sections: [
      { heading: '它解决什么问题', body: 'Go 用极简语法、内置并发（goroutine）、快速编译，成为云基础设施的首选语言（Docker/K8s/etcd 都是 Go 写的）。' },
      { heading: '典型应用场景', body: '微服务后端、CLI 工具、云原生组件、网关、RPC 服务。' },
      { heading: '学习路径', body: '① Tour of Go 通读；② 写一个 HTTP + Redis 小服务；③ 学 goroutine / channel / context；④ 用 gRPC + buf 做服务间通信。' }
    ],
    prerequisites: ['任何一门编程语言'],
    careerFit: ['后端工程师', '云基础设施', 'DevOps'],
    estimatedWeeks: 4
  },
  'GraphQL': {
    subtitle: '一种查询语言 · 一种前后端契约',
    sections: [
      { heading: '它解决什么问题', body: '让前端按需查询字段，避免 REST 的过度/不足获取；Schema 即文档即类型。' },
      { heading: '典型应用场景', body: '多端共享 API（Web + iOS + Android）、复杂聚合数据、BFF 层。' },
      { heading: '学习路径', body: '① 写一个 Apollo Server；② 前端用 urql 或 Apollo Client；③ 学 DataLoader 解决 N+1；④ 研究 Federation 做微服务聚合。' }
    ],
    prerequisites: ['REST API 经验', 'Node.js 或等效语言'],
    careerFit: ['全栈', 'BFF 工程师', 'API 架构师'],
    estimatedWeeks: 4
  },
  'Rust': {
    subtitle: '系统级语言 · 内存安全与高并发的交集',
    sections: [
      { heading: '它解决什么问题', body: '所有权系统在编译期消除整类内存错误，同时保留 C++ 级性能。是近年 StackOverflow 最受喜爱的语言。' },
      { heading: '典型应用场景', body: '系统编程、嵌入式、浏览器引擎（Servo/Firefox）、区块链、WASM、高性能后端（Discord 用 Rust 重写 Go 服务）。' },
      { heading: '学习路径', body: '① rustlings 练所有权；② 读 Rust Book；③ 用 Tokio + Axum 写后端；④ 学 unsafe 与 FFI。' }
    ],
    prerequisites: ['C/C++ 或 Go 基础', '理解堆栈与指针'],
    careerFit: ['基础架构', '区块链 SDK', '嵌入式', '高性能后端'],
    estimatedWeeks: 12
  },
  'CUDA': {
    subtitle: 'NVIDIA GPU 上的并行计算编程模型',
    sections: [
      { heading: '它解决什么问题', body: 'CUDA 让开发者能直接写 GPU 核函数，把深度学习训练/推理吞吐量提升 10-100x。' },
      { heading: '典型应用场景', body: '深度学习训练框架底层（PyTorch ATen）、科学计算、LLM 推理优化（FlashAttention）。' },
      { heading: '学习路径', body: '① 读 CUDA C++ Programming Guide；② 写 vector add / matrix mul；③ 学共享内存与 warp；④ 读 FlashAttention 论文 + 代码。' }
    ],
    prerequisites: ['C/C++', '并行计算基础', '线性代数'],
    careerFit: ['AI Infra', '高性能计算', 'GPU 开发'],
    estimatedWeeks: 10
  },
  'Kafka': {
    subtitle: '分布式事件流平台',
    sections: [
      { heading: '它解决什么问题', body: '高吞吐 + 持久化 + 可回放的消息总线，是现代数据管道的骨干。' },
      { heading: '典型应用场景', body: '日志聚合、用户行为埋点、CDC、事件溯源、实时数仓（Kafka → Flink → OLAP）。' },
      { heading: '学习路径', body: '① 本地起一个 Kafka；② 写 Producer/Consumer；③ 理解 Partition 与 Offset；④ 用 Kafka Connect + Kafka Streams。' }
    ],
    prerequisites: ['Linux', '分布式基础'],
    careerFit: ['数据工程师', '后端架构师', 'SRE'],
    estimatedWeeks: 5
  },
  'MongoDB': {
    subtitle: '最流行的文档型数据库',
    sections: [
      { heading: '它解决什么问题', body: '用 JSON 文档代替表结构，Schema 灵活，适合迭代快的业务。内置分片与副本集支持水平扩展。' },
      { heading: '典型应用场景', body: '内容管理、IoT 时序、移动应用后端、日志存储、游戏数据。' },
      { heading: '学习路径', body: '① 掌握基本 CRUD 与聚合管道；② 学索引设计；③ 理解事务限制；④ 搭一个副本集。' }
    ],
    prerequisites: ['数据库基础', 'JSON'],
    careerFit: ['后端工程师', '全栈'],
    estimatedWeeks: 3
  }
};

const PATH = {
  'python': {
    overview: '6 阶段从脚本到工程化的 Python 进阶线路，总计 16 周，覆盖现代语法、包管理、异步、Web、AI 编排到上线部署。',
    modules: [
      { name: '现代语法与类型', weeks: 2, topics: ['PEP 484 类型注解', 'dataclass / Pydantic', '模块化组织'], project: '重构一段老脚本为带类型的包' },
      { name: '包管理与构建', weeks: 2, topics: ['uv / poetry', 'pyproject.toml', 'wheel 发布'], project: '发布一个 PyPI 包' },
      { name: '异步与并发', weeks: 3, topics: ['asyncio', 'trio', 'GIL 与线程池'], project: '高并发爬虫' },
      { name: 'Web 服务', weeks: 3, topics: ['FastAPI', 'SQLAlchemy 2.x', '鉴权与 OpenAPI'], project: 'REST API + JWT' },
      { name: 'AI 编排', weeks: 3, topics: ['LangChain', '向量库', 'RAG 评测'], project: '企业知识库问答' },
      { name: '工程化与部署', weeks: 3, topics: ['Docker 多阶段', 'Prometheus', 'CI/CD'], project: '上线一个 SaaS Demo' }
    ],
    totalWeeks: 16,
    outcome: '具备独立交付 AI Agent 后端服务的能力，可胜任后端 + AI 工程化复合岗。'
  },
  'sql': {
    overview: '从基础查询到性能优化的 SQL 高阶路径，重点建模能力与执行计划理解。',
    modules: [
      { name: '关系代数与标准 SQL', weeks: 2, topics: ['JOIN 原理', '窗口函数', 'CTE 递归'], project: '完成 LeetCode 数据库 50 题' },
      { name: '建模与范式', weeks: 2, topics: ['第三范式', '反范式权衡', '维度建模'], project: '为电商平台设计订单+商品+用户表' },
      { name: '索引与执行计划', weeks: 2, topics: ['B+Tree 原理', 'EXPLAIN 解读', '慢查询'], project: '诊断并优化 10 个慢查询' },
      { name: '分析型 SQL', weeks: 2, topics: ['OLAP', 'ClickHouse', 'DuckDB'], project: '用 DuckDB 跑一份用户留存分析' }
    ],
    totalWeeks: 8,
    outcome: '能独立为业务系统设计表结构、定位并优化慢查询、写复杂分析 SQL。'
  },
  'bedrock': {
    overview: 'AWS Bedrock 为核心的企业 AI 集成路径，聚焦多模型路由与合规。',
    modules: [
      { name: 'Bedrock 基础', weeks: 2, topics: ['模型市场', 'Playground', 'SDK 调用'], project: '调用 Claude/Llama 完成对话 Demo' },
      { name: 'Knowledge Bases', weeks: 2, topics: ['向量索引', 'S3 集成', '检索评估'], project: '构建企业 FAQ 知识库' },
      { name: 'Agents', weeks: 2, topics: ['Action Groups', 'Lambda 集成', '权限控制'], project: '实现可调用 API 的 Agent' },
      { name: '生产部署', weeks: 2, topics: ['VPC 私网', 'PrivateLink', '审计日志'], project: '合规化上线一个企业 AI 助手' }
    ],
    totalWeeks: 8,
    outcome: '具备在 AWS 生态里落地企业级 AI 应用的架构能力。'
  },
  'foundation': {
    overview: '软件工程师基础能力建设，确保算法、数据结构、编程范式扎实。',
    modules: [
      { name: '数据结构', weeks: 3, topics: ['数组/链表/栈队列', '树/图/堆', '哈希'], project: 'LeetCode 100 题' },
      { name: '算法', weeks: 3, topics: ['排序/搜索', '动态规划', '图算法'], project: '手写 10 个经典算法' },
      { name: '编程范式', weeks: 2, topics: ['面向对象', '函数式', '并发模型'], project: '用三种范式实现同一业务' }
    ],
    totalWeeks: 8,
    outcome: '通过一线大厂的算法面试，具备独立阅读开源项目源码的能力。'
  },
  'ai-adaptation': {
    overview: '把 LLM、Prompt Engineering、基础神经网络整合到日常工作流的进阶路径。',
    modules: [
      { name: 'Prompt 工程', weeks: 2, topics: ['Few-shot', 'CoT 思维链', '结构化输出'], project: '用 Prompt 做一个 SQL 生成器' },
      { name: 'LLM API', weeks: 2, topics: ['OpenAI/Claude/DeepSeek', 'Streaming', '函数调用'], project: '做一个聊天机器人' },
      { name: 'RAG 基础', weeks: 2, topics: ['分块', '向量', '召回'], project: '构建文档问答' },
      { name: 'Agent 入门', weeks: 2, topics: ['ReAct', '工具调用', '多步规划'], project: '做一个能查天气的 Agent' }
    ],
    totalWeeks: 8,
    outcome: '能把 AI 能力融入已有产品，显著提升开发效率与用户体验。'
  },
  'ai-engineering': {
    overview: 'AI 工程化实战，从模型微调到可扩展基础设施。',
    modules: [
      { name: '模型微调', weeks: 3, topics: ['LoRA', 'QLoRA', 'PEFT'], project: '在一个开源 LLM 上做领域适配' },
      { name: '推理优化', weeks: 3, topics: ['量化', 'vLLM', 'TensorRT-LLM'], project: '把推理 latency 降 50%' },
      { name: 'MLOps', weeks: 3, topics: ['MLflow', 'Airflow', '模型监控'], project: '搭建模型训练 → 评测 → 部署管道' },
      { name: '评测体系', weeks: 3, topics: ['离线指标', '在线 A/B', '红蓝对抗'], project: '为 RAG 系统建立评测' }
    ],
    totalWeeks: 12,
    outcome: '具备端到端构建企业级 AI 系统的能力，可担任 AI Tech Lead。'
  },
  'ai-leadership': {
    overview: 'AI 工程领导力：主导跨职能 AI 项目、设计评估体系、团队协作流程。',
    modules: [
      { name: '项目治理', weeks: 3, topics: ['OKR 制定', '里程碑拆解', '风险评估'], project: '主导一个为期 3 个月的 AI 项目' },
      { name: '团队组建', weeks: 3, topics: ['角色设计', '招聘面试', '代码规范'], project: '从 0 搭建 5 人 AI 团队' },
      { name: '跨职能协作', weeks: 3, topics: ['PM/设计对接', '数据工程协同', '合规'], project: '推动一次跨部门 AI 功能上线' },
      { name: '技术演进', weeks: 3, topics: ['技术选型', '架构演进', '技术品牌'], project: '发表一篇技术博客 + 公司内部分享' }
    ],
    totalWeeks: 12,
    outcome: '能胜任 AI 工程 Tech Lead / EM 角色，具备从 0 到 1 组建团队与交付业务的综合能力。'
  }
};

// ============ Fallback 模板（含 %TITLE% 占位符） ============
const FALLBACK = {
  hotspot: {
    subtitle: '%TITLE% · AI 生成的概览',
    sections: [
      { heading: '背景', body: '%TITLE% 是当前软件工程领域值得关注的技术方向，其热度反映了行业对效率、性能或工程化能力的持续追求。' },
      { heading: '核心价值', body: '%TITLE% 的核心价值在于降低复杂度、提升可维护性，让团队能够以更少的资源交付更高质量的产品。' },
      { heading: '适合谁', body: '对架构决策有影响力的工程师、创业团队技术负责人、希望把握前沿方向的学生。' },
      { heading: '学习建议', body: '先看官方文档建立整体认知，再跑一个最小 Demo，最后读 1-2 个开源项目加深理解。' }
    ],
    keywords: ['%TITLE%', '工程化', '最佳实践', '开源生态'],
    relatedSkills: ['系统设计', '软件工程', '技术选型']
  },
  discussion: {
    hook: '关于"%TITLE%"，有两派观点正在交锋',
    sections: [
      { heading: '现象观察', body: '%TITLE% 是近年软工社区讨论热度很高的话题，既有热情拥抱者也有理性质疑者。' },
      { heading: '核心争论', body: '一派认为这是范式升级；另一派认为是过度工程，小团队不必跟风。' },
      { heading: '我的判断', body: '应视团队规模、业务阶段、运维能力综合决策，而不是盲目追热。' }
    ],
    takeaways: ['先评估团队规模与变更频率', '用最小可行方案验证', '避免"技术栈博物馆"'],
    readingTime: '4 分钟阅读'
  },
  skill: {
    subtitle: '%TITLE% · AI 生成的学习概览',
    sections: [
      { heading: '它解决什么问题', body: '%TITLE% 是当前具有一定市场需求的技术，在相关岗位招聘中频繁出现。' },
      { heading: '典型应用场景', body: '企业级应用、创业项目、开源贡献、以及跨领域集成等多种场景。' },
      { heading: '学习路径', body: '① 读官方文档并跑通 Hello World；② 完成 1 个完整小项目；③ 阅读优质源码以加深理解。' }
    ],
    prerequisites: ['编程基础', '基本的计算机科学概念'],
    careerFit: ['软件工程师', '后端 / 前端 / AI 方向'],
    estimatedWeeks: 6
  },
  path: {
    overview: '%TITLE% 学习路径的通用版本，聚焦从入门到能产出的 4 个阶段。',
    modules: [
      { name: '基础概念', weeks: 2, topics: ['理论认知', '核心术语', '生态全景'], project: '读 1 本入门书 + 1 篇综述' },
      { name: '动手实操', weeks: 3, topics: ['环境搭建', '最小 Demo', '常见陷阱'], project: '完成 Hello World 级项目' },
      { name: '进阶应用', weeks: 3, topics: ['性能优化', '工程化', '最佳实践'], project: '重构一个已有项目' },
      { name: '综合产出', weeks: 2, topics: ['整合已学', '输出总结', '面向实战'], project: '发布一个完整作品或技术博客' }
    ],
    totalWeeks: 10,
    outcome: '掌握 %TITLE% 的核心原理与工程实践，具备独立交付相关功能的能力。'
  }
};

// ============ 占位符替换（支持字符串 / 数组 / 对象深层递归） ============
function applyPlaceholders(obj, vars) {
  if (typeof obj === 'string') {
    return obj
      .replace(/%TITLE%/g, vars.title || vars.id || '主题')
      .replace(/%ID%/g, vars.id || '');
  }
  if (Array.isArray(obj)) return obj.map((x) => applyPlaceholders(x, vars));
  if (obj && typeof obj === 'object') {
    const out = {};
    for (const k of Object.keys(obj)) out[k] = applyPlaceholders(obj[k], vars);
    return out;
  }
  return obj;
}

module.exports = {
  details: {
    hotspot: HOTSPOT,
    discussion: DISCUSSION,
    skill: SKILL,
    path: PATH,
    _fallback: FALLBACK
  },
  applyPlaceholders
};
