# Hermes UI

Hermes Agent 的桌面客户端，提供聊天、文件管理、代码编辑、任务管理一体化界面。

## 技术栈

- **框架：** Electron 28
- **前端：** React 18 + TypeScript + Vite 5
- **样式：** Tailwind CSS
- **Markdown：** react-markdown + remark-gfm + react-syntax-highlighter
- **图标：** Lucide React
- **后端通信：** OpenAI 兼容 API（通过 Hermes Gateway API Server）

## 界面布局

```
┌─────────────┬────────────────────────────────────┐
│   侧边栏     │          主内容区域                  │
│             │                                    │
│  ➕ 新对话   │   📝 Hermes UI        ⚙️ 设置       │
│             │   ─────────────────────────────    │
│  📋 会话列表 │                                    │
│   - 会话1    │        ✦                          │
│   - 会话2    │    Hermes Agent                    │
│   - 会话3    │    发送消息开始对话                   │
│             │                                    │
│             │   ┌────────────────────────────┐   │
│             │   │ 输入消息...          [📎][➤] │   │
│             │   └────────────────────────────┘   │
│             │                                    │
│  ⚙️ 设置    │                                    │
└─────────────┴────────────────────────────────────┘
```

## 功能模块（已实现）

### ✅ 聊天
- 类似 ChatGPT/Claude 的简洁对话界面
- 支持文本输入和发送
- 显示对话历史
- 支持 Markdown 渲染（代码高亮、表格、链接等）
- 支持工具调用过程显示
- 流式响应（SSE）
- 通过 OpenAI 兼容 API 与 Hermes Agent 交互

### ✅ 设置
- API 地址配置
- API Key 配置（可选，localhost 免认证）
- 模型选择
- 连接测试

### ✅ 会话管理
- 创建新对话
- 会话列表
- 会话切换
- 删除会话

### 🔜 后续扩展
- 文件管理（左侧文件树）
- 代码编辑器（CodeMirror）
- 任务管理
- 主题切换（深色/浅色）
- 快捷键支持
- 文件拖拽上传
- 通知提醒
- 历史记录搜索

## 目录结构

```
hermes-ui/
├── package.json
├── README.md
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── electron/
│   ├── main.ts            # Electron 主进程
│   └── preload.ts         # 预加载脚本
├── src/
│   ├── main.tsx           # React 入口
│   ├── App.tsx            # 主应用组件
│   ├── index.css          # 全局样式
│   ├── types/
│   │   └── index.ts       # TypeScript 类型定义
│   ├── hooks/
│   │   └── useSettings.ts # 设置 Hook
│   ├── services/
│   │   └── api.ts         # Hermes API 服务
│   ├── components/
│   │   ├── Chat.tsx       # 聊天组件
│   │   ├── MessageBubble.tsx  # 消息气泡
│   │   ├── ToolCallDisplay.tsx # 工具调用显示
│   │   ├── Sidebar.tsx    # 侧边栏
│   │   └── Settings.tsx   # 设置弹窗
│   └── utils/
│       └── index.ts       # 工具函数
└── public/
    └── vite.svg           # 应用图标
```

## 运行方式

```bash
# 安装依赖
npm install

# 开发模式
npm run electron:dev

# 打包 Windows 安装包
npm run electron:build
```

## 连接方式

通过 OpenAI 兼容的 HTTP API 调用 Hermes Gateway：

1. 启动 Hermes Gateway：
   ```bash
   hermes gateway run
   ```

2. 在 Hermes UI 设置中配置 API 地址（默认 `http://localhost:8080`）

3. 开始聊天

## 配置 Hermes API Server

在 `~/.hermes/.env` 中添加：

```bash
API_SERVER_ENABLED=true
# API_SERVER_KEY=your-key  # 可选，非 localhost 需要
```

## 设计风格

- **配色：** 白底绿点缀（Hermes 品牌色 #22c55e）
- **字体：** 系统默认中文字体
- **布局：** 简洁清爽，无多余装饰
- **语言：** 中文界面

## 后续扩展

- 主题切换（深色/浅色）
- 快捷键支持
- 文件拖拽上传
- 通知提醒
- 历史记录搜索
- 多窗口支持
