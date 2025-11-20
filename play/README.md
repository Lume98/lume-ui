# Play - 开发测试环境

> 参考 Element Plus 的 `play` 目录，用于快速开发和测试组件

## 用途

`play` 是一个 Next.js 应用，用于：

1. **快速开发**: 在真实环境中开发和调试组件
2. **可视化测试**: 直观地查看组件效果
3. **交互式演示**: 测试组件的各种交互场景
4. **集成测试**: 验证组件在实际应用中的表现

## 与 Element Plus 的对比

| Element Plus       | Lume UI      | 说明         |
| ------------------ | ------------ | ------------ |
| `play/`            | `play/`      | 开发测试环境 |
| Vue 3 + Vite       | Next.js      | 框架选择     |
| src/playground.vue | app/page.tsx | 主页面       |

## 目录结构

```
play/
├── app/                    # Next.js App Router
│   ├── button/            # Button 组件演示
│   ├── cascader/          # Cascader 组件演示
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   └── globals.css        # 全局样式
├── public/                # 静态资源
├── next.config.ts         # Next.js 配置
├── tsconfig.json          # TypeScript 配置
└── package.json           # 依赖配置
```

## 使用方法

### 启动开发服务器

```bash
# 在项目根目录
pnpm dev

# 或者直接在 play 目录
cd play
pnpm dev
```

访问 http://localhost:3000 查看演示。

### 添加新组件演示

1. 在 `app/` 下创建新目录，如 `app/select/`
2. 创建 `page.tsx` 文件
3. 导入并使用组件

**示例**:

```tsx
// app/select/page.tsx
'use client'

import { Select } from '@lume-ui/select'

export default function SelectDemo() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Select Demo</h1>
      <Select options={[...]} />
    </div>
  )
}
```

## 配置说明

### next.config.ts

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@lume-ui/button',
    '@lume-ui/cascader',
    // 添加其他需要转译的组件包
  ],
};

export default nextConfig;
```

**重要**: 当添加新的组件包时，需要在 `transpilePackages` 中添加包名，以便 Next.js 正确转译 workspace 包。

## 最佳实践

1. **保持简洁**: 只用于测试，不要添加复杂的业务逻辑
2. **覆盖场景**: 尽可能测试组件的各种使用场景
3. **热更新**: 利用 Next.js 的热更新能力快速迭代
4. **实时预览**: 边开发边查看效果，提高效率

## 与文档站点的区别

| 特性     | play         | docs         |
| -------- | ------------ | ------------ |
| **用途** | 内部开发测试 | 对外文档展示 |
| **访问** | 本地开发     | 线上部署     |
| **内容** | 随意测试     | 正式文档     |
| **更新** | 频繁变动     | 稳定发布     |

## 参考

- [Element Plus Play](https://github.com/element-plus/element-plus/tree/dev/play)
- [Next.js Documentation](https://nextjs.org/docs)
