# Hermes UI

Hermes Agent 的桌面客户端，提供聊天、文件管理、代码编辑、任务管理一体化界面。

## 技术栈

- **框架：** Electron
- **前端：** HTML / CSS / JavaScript
- **代码编辑器：** Monaco Editor（VS Code 同款）
- **后端通信：** Node.js child_process 调用 hermes CLI

## 界面布局

```
┌─────────────┬────────────────────┬─────────────────┐
│   侧边栏     │     聊天区域        │   右侧面板       │
│             │                    │                 │
│  📁 文件树   │   对话消息列表       │  📝 代码编辑器   │
│             │                    │   (Monaco)      │
│  ✅ 任务列表 │                    │                 │
│             │                    │  📋 任务面板     │
│             ├────────────────────┤                 │
│             │   输入框            │                 │
└─────────────┴────────────────────┴─────────────────┘
```

## 功能模块

### 1. 聊天
- 类似微信的简洁对话界面
- 支持文本输入和发送
- 显示对话历史
- 支持 Markdown 渲染
- 通过 hermes CLI 与 Agent 交互

### 2. 文件管理
- 左侧文件树，浏览项目目录
- 点击文件在右侧 Monaco 编辑器中打开
- 支持文件创建、重命名、删除

### 3. 代码编辑器
- Monaco Editor，支持语法高亮
- 支持自动补全
- 支持多标签页打开文件
- 支持保存文件

### 4. 任务管理
- 简单的待办列表
- 支持添加、完成、删除任务
- 任务状态：待办 / 进行中 / 已完成

## 设计风格

- **配色：** 微信风格，白底绿点缀
- **字体：** 系统默认中文字体
- **布局：** 简洁清爽，无多余装饰
- **语言：** 中文界面

## 目录结构

```
hermes-ui/
├── package.json
├── README.md
├── src/
│   ├── main.js            # Electron 主进程
│   ├── preload.js         # 预加载脚本
│   ├── index.html         # 主页面
│   ├── styles/
│   │   └── main.css       # 全局样式
│   ├── components/
│   │   ├── chat.js        # 聊天模块
│   │   ├── fileTree.js    # 文件树模块
│   │   ├── editor.js      # 代码编辑器模块
│   │   └── task.js        # 任务管理模块
│   └── utils/
│       └── hermes.js      # hermes CLI 调用封装
└── assets/
    └── icon.png           # 应用图标
```

## 运行方式

```bash
# 安装依赖
npm install

# 启动开发模式
npm start

# 打包
npm run build
```

## 连接方式

通过 Node.js `child_process.spawn` 调用 hermes CLI：

```javascript
const { spawn } = require('child_process');
const hermes = spawn('hermes', ['chat'], { shell: true });
```

## 后续扩展

- 主题切换（深色/浅色）
- 快捷键支持
- 文件拖拽上传
- 通知提醒
- 历史记录搜索
- 多窗口支持
