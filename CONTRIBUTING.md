# 贡献指南

感谢你考虑为 Lume UI 做出贡献！

## 🌟 贡献方式

- 报告 Bug
- 提交功能建议
- 改进文档
- 提交代码

## 🚀 开发环境设置

### 前置要求

- Node.js >= 18
- pnpm >= 8

### 初始化项目

```bash
# 克隆仓库
git clone https://github.com/Lume98/shadcn-cascader.git
cd shadcn-cascader

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

详细设置说明请查看 [SETUP.md](./SETUP.md)

## 📝 开发流程

### 1. 创建分支

```bash
git checkout -b feature/my-feature
# 或
git checkout -b fix/my-bug-fix
```

分支命名规范：

- `feature/` - 新功能
- `fix/` - Bug 修复
- `docs/` - 文档更新
- `refactor/` - 代码重构
- `test/` - 测试相关

### 2. 开发

```bash
# 实时预览
pnpm dev

# 构建测试
pnpm build

# 类型检查
pnpm type-check
```

### 3. 提交代码

提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
git commit -m "feat(cascader): 添加搜索功能"
git commit -m "fix(button): 修复禁用状态样式"
git commit -m "docs: 更新安装文档"
```

类型说明：

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具相关

### 4. 推送并创建 PR

```bash
git push origin feature/my-feature
```

然后在 GitHub 上创建 Pull Request。

## 📦 添加新组件

参考 Element Plus 的组件开发规范：

### 1. 创建组件包

```bash
# 在 packages/ 下创建新目录
mkdir -p packages/my-component/src
cd packages/my-component
```

### 2. 初始化 package.json

```json
{
  "name": "@lume-ui/my-component",
  "version": "0.1.0",
  "description": "组件描述",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./styles.css": "./dist/styles.css"
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  }
}
```

### 3. 创建构建配置

```ts
// vite.config.ts
import { createViteConfig } from '../../internal/build/vite.config.base';

export default createViteConfig({
  name: 'MyComponent',
  entry: 'src/index.ts',
  dts: true,
});
```

### 4. 实现组件

```tsx
// src/my-component.tsx
import React from 'react';

export interface MyComponentProps {
  // Props 定义
}

export const MyComponent: React.FC<MyComponentProps> = props => {
  // 组件实现
  return <div>MyComponent</div>;
};
```

```ts
// src/index.ts
export { MyComponent } from './my-component';
export type { MyComponentProps } from './my-component';
```

### 5. 添加到 play 测试

```tsx
// play/app/my-component/page.tsx
'use client';

import { MyComponent } from '@lume-ui/my-component';

export default function MyComponentDemo() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">MyComponent Demo</h1>
      <MyComponent />
    </div>
  );
}
```

### 6. 更新 workspace 配置

确保在根目录 `pnpm-workspace.yaml` 中包含了 `packages/*`。

## 🧪 测试

```bash
# 运行测试（待实现）
pnpm test

# 类型检查
pnpm type-check

# 构建检查
pnpm build
```

## 📚 文档

为你的组件编写文档：

1. 在组件包内添加 `README.md`
2. 包含使用示例和 API 说明
3. 添加类型注释和 JSDoc

## 🎯 代码规范

- 使用 TypeScript
- 遵循项目的 ESLint 配置
- 使用 Prettier 格式化代码
- 添加必要的类型注释
- 编写清晰的注释

## 🐛 报告 Bug

提交 Bug 时请包含：

1. Bug 描述
2. 复现步骤
3. 预期行为
4. 实际行为
5. 环境信息（OS、Node 版本、浏览器等）
6. 相关代码片段或截图

## 💡 功能建议

提交功能建议时请说明：

1. 功能描述
2. 使用场景
3. 可能的实现方式
4. 是否愿意贡献代码

## ❓ 问题讨论

- GitHub Issues: 提交 Bug 和功能建议
- GitHub Discussions: 一般性讨论和问题

## 📜 许可证

贡献的代码将遵循项目的许可证（MIT/Apache 2.0）。

## 🙏 致谢

感谢所有为 Lume UI 做出贡献的开发者！

---

参考资料：

- [Element Plus 贡献指南](https://github.com/element-plus/element-plus/blob/dev/.github/CONTRIBUTING.md)
- [Conventional Commits](https://www.conventionalcommits.org/)
