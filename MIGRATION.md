# 迁移指南

## v0.1.0 样式导入变更

### 问题描述

在之前的版本中，`shadcn-cascader` 组件包含了完整的 Tailwind CSS 样式文件，这会导致：

1. 与使用者项目中的 Tailwind CSS 样式冲突
2. 样式覆盖和优先级问题
3. 不必要的重复样式加载

### 解决方案

从 v0.1.0 开始，`shadcn-cascader` 不再包含独立的 CSS 文件。组件完全依赖于使用者项目中的 Tailwind CSS 配置。

### 迁移步骤

#### 1. 移除样式导入

如果你之前在代码中导入了组件样式，请删除以下导入语句：

```tsx
// ❌ 删除这行
import 'shadcn-cascader/style.css';
```

#### 2. 确保 Tailwind CSS 配置正确

确保你的项目已经正确配置了 Tailwind CSS 和 shadcn/ui：

**tailwind.config.js/ts:**

```js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    // 如果使用本地引用，添加组件库路径
    './node_modules/shadcn-cascader/dist/**/*.{js,mjs}',
  ],
  theme: {
    extend: {
      // shadcn/ui 所需的颜色和变量配置
    },
  },
  plugins: [],
};
```

**globals.css:**
确保包含 shadcn/ui 所需的 CSS 变量：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    /* 其他 shadcn/ui 变量... */
  }
}
```

#### 3. 更新 package.json

如果你的 `package.json` 中有任何关于样式的配置，请更新：

```json
{
  "dependencies": {
    "shadcn-cascader": "^0.1.0",
    "tailwindcss": "^3.0.0"
  }
}
```

### 完整示例

**Before (旧版本):**

```tsx
// layout.tsx
import './globals.css';
import 'shadcn-cascader/style.css'; // ❌ 需要删除

export default function RootLayout({ children }) {
  return <html>{children}</html>;
}
```

**After (新版本):**

```tsx
// layout.tsx
import './globals.css'; // ✅ 只需要这一行

export default function RootLayout({ children }) {
  return <html>{children}</html>;
}
```

### 常见问题

**Q: 为什么移除了样式文件？**

A: shadcn/ui 的设计理念是组件完全基于 Tailwind CSS 类名，不需要额外的 CSS 文件。这样可以避免样式冲突，并让使用者完全控制样式定制。

**Q: 组件样式显示不正确怎么办？**

A: 请检查：

1. Tailwind CSS 是否正确配置
2. `tailwind.config.js` 的 `content` 字段是否包含组件路径
3. 项目中是否正确配置了 shadcn/ui 的 CSS 变量

**Q: 需要导入什么吗？**

A: 只需要导入组件本身：

```tsx
import { Cascader } from 'shadcn-cascader';
```

不需要导入任何样式文件。

### 获取帮助

如果在迁移过程中遇到问题，请：

1. 检查 [README.md](./README.md) 中的前置要求
2. 参考 [demo 示例](./packages/demo)
3. 提交 Issue 到 GitHub 仓库
