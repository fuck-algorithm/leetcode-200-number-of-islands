# LeetCode 200 - 岛屿数量可视化工具

🏝️ 直观可视化展示经典算法题"岛屿数量"的求解过程

## 🌐 在线演示

**[>> 立即访问在线演示 <<](https://fuck-algorithm.github.io/leetcode-200-number-of-islands/)**

## 📖 项目介绍

本项目是 [LeetCode 200. 岛屿数量](https://leetcode.com/problems/number-of-islands/) 问题的交互式可视化工具，通过动画方式展示深度优先搜索 (DFS) 和广度优先搜索 (BFS) 算法的执行过程，帮助理解算法的实现原理。

### 🔥 主要功能

- 🖼️ 直观展示DFS和BFS算法解决岛屿数量问题的过程
- ⏯️ 动画播放控制：播放/暂停、步进、速度调节
- 🎲 随机生成不同复杂度的岛屿图
- ✏️ 支持自定义输入岛屿地图
- 🔄 提供预设的示例地图
- 🌍 中英文双语支持

## 🛠️ 技术栈

- **前端框架**：React + TypeScript
- **构建工具**：Vite
- **语言支持**：react-i18next
- **样式**：CSS（自定义设计）

## 🔧 本地开发

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装与运行

1. 克隆项目仓库
   ```bash
   git clone https://github.com/fuck-algorithm/leetcode-200-number-of-islands.git
   cd leetcode-200-number-of-islands
   ```

2. 安装依赖
   ```bash
   npm install
   # 或
   yarn
   ```

3. 启动开发服务器
   ```bash
   npm run dev
   # 或
   yarn dev
   ```

4. 在浏览器中访问 http://localhost:5173/leetcode-200-number-of-islands/

### 构建部署

```bash
npm run build
# 或
yarn build
```

构建文件将输出到 `dist` 目录，可以将该目录部署到任何静态文件服务器。

## 🧩 项目结构

```
src/
├── components/        # UI组件
├── utils/             # 工具函数和算法实现
├── i18n/              # 国际化文件
├── App.tsx            # 主应用组件
└── main.tsx           # 应用入口
```

## 📚 算法详解

岛屿数量问题是经典的图搜索算法应用，本项目实现了两种解法：

1. **深度优先搜索 (DFS)**：从一个陆地格子出发，使用递归或栈访问所有相邻的陆地格子，将访问过的陆地标记为已访问，以避免重复计数。

2. **广度优先搜索 (BFS)**：同样从一个陆地格子出发，但使用队列按层访问相邻的陆地格子，适合寻找最短路径等场景。

## 🤝 贡献指南

欢迎提交问题和改进建议！请通过GitHub Issues或Pull Requests参与项目。

## 📜 许可证

[MIT](LICENSE)
