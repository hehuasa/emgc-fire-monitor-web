## 环境变量设置

1. 安装 nvm https://github.com/coreybutler/nvm-windows/releases ，以及设置镜像

   nvm node_mirror https://npmmirror.com/mirrors/node/
   nvm npm_mirror https://npmmirror.com/mirrors/npm/

2. 使用 nvm 安装 nodejs， 默认安装 v18 的稳定版
3. 设置 npm 镜像
   npm config set registry https://registry.npmmirror.com

4. 安装 pnpm

## 编辑器环境

1. 安装 vscoded 的 Prettier、 ESLint 插件

2. 打开 vscode/settings.json,添加以下 配置：

"editor.codeActionsOnSave": { "source.fixAll.eslint": true },

"editor.formatOnSave": true,

"editor.defaultFormatter": "esbenp.prettier-vscode",

"[javascript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },

"[typescript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },

"[typescriptreact]": { "editor.defaultFormatter": "esbenp.prettier-vscode" }

## 运行项目

1. 安装依赖
   pnpm install

2. 配置环境变量文件 .env.local .env.development .env.production

3. 配置 server.mjs

4. 运行
   pnpm dev
