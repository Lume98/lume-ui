# Lume UI

一个现代化的 React 组件库 Monorepo，基于 Radix UI 和 Tailwind CSS 构建。

## ✨ 特性

- 🎨 **现代化设计** - 简洁美观的默认样式
- ♿ **可访问性优先** - 基于 Radix UI，符合 WAI-ARIA 标准
- 🎯 **TypeScript** - 完整的类型支持
- 🌲 **Tree-shaking** - 按需加载，优化包体积
- 🎭 **主题定制** - 基于 Tailwind CSS，灵活定制
- 📦 **Monorepo** - 清晰的代码组织，参考 Element Plus 架构

## 📦 包列表

| 包名                                     | 版本  | 说明           |
| ---------------------------------------- | ----- | -------------- |
| [@lume-ui/button](./packages/button)     | -     | 按钮组件       |
| [@lume-ui/cascader](./packages/cascader) | 0.2.0 | 级联选择器组件 |
| [@lume-ui/utils](./packages/utils)       | -     | 工具函数       |

## 🚀 快速开始

### 安装

```bash
# 安装级联选择器
pnpm add @lume-ui/cascader

# 或使用 npm
npm install @lume-ui/cascader
```

### 使用

```tsx
import { Cascader } from '@lume-ui/cascader';

function App() {
  const options = [
    {
      label: '浙江省',
      value: 'zhejiang',
      children: [
        { label: '杭州市', value: 'hangzhou' },
        { label: '宁波市', value: 'ningbo' },
      ],
    },
  ];

  return <Cascader options={options} placeholder="请选择地区" />;
}
```

## 🏗️ 项目结构

参考 [Element Plus](https://github.com/element-plus/element-plus) 的优秀架构：

```
lume-ui/
├── packages/           # 组件包
│   ├── button/        # 按钮组件
│   ├── cascader/      # 级联选择器
│   └── utils/         # 工具函数
├── internal/          # 内部工具
│   ├── build/        # 构建配置
│   └── shared/       # 共享工具
├── play/              # 开发测试环境
├── docs/              # 文档（规划中）
├── scripts/           # 构建脚本
└── typings/           # 类型定义
```

详细架构说明请查看 [ARCHITECTURE.md](./ARCHITECTURE.md)

## 💻 开发

### 环境要求

- Node.js >= 18
- pnpm >= 8

### 安装依赖

```bash
pnpm install
```

### 开发模式

启动开发服务器，实时预览组件：

```bash
pnpm dev
```

访问 http://localhost:3000 查看演示页面。

### 构建

```bash
# 构建所有组件包
pnpm build

# 构建演示站点
pnpm build:play
```

### 脚本说明

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 构建所有组件包
pnpm build:play   # 构建演示站点
pnpm lint         # 代码检查
pnpm type-check   # 类型检查
pnpm clean        # 清理构建产物
```

## 📖 文档

- [架构文档](./ARCHITECTURE.md) - 项目架构设计
- [开发指南](./SETUP.md) - 开发环境设置
- [Workspace 指南](./PNPM-WORKSPACE.md) - pnpm workspace 使用

## 🤝 贡献

欢迎贡献！请先阅读 [贡献指南](./CONTRIBUTING.md)（待完善）。

### 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m '添加某个很棒的特性'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 更新日志

查看 [CHANGELOG.md](./packages/cascader/CHANGELOG.md) 了解版本更新历史。

## 📄 许可证

- Button: Apache 2.0
- Cascader: MIT
- Utils: Apache 2.0

## 🙏 致谢

本项目的架构和设计参考了以下优秀项目：

- [Element Plus](https://element-plus.org/) - Monorepo 架构设计和构建系统
- [Radix UI](https://www.radix-ui.com/) - 无障碍组件基础
- [shadcn/ui](https://ui.shadcn.com/) - 组件设计理念
- [Tailwind CSS](https://tailwindcss.com/) - 样式系统

## 📮 联系方式

- GitHub Issues: [提交问题](https://github.com/Lume98/shadcn-cascader/issues)
- NPM: [@lume-ui](https://www.npmjs.com/org/lume-ui)

---

**Built with ❤️ by Lume UI Team**
