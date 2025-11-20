# Typings - 全局类型定义

> 参考 Element Plus 的 `typings` 目录，集中管理全局类型

## 📁 目录结构

```
typings/
├── env.d.ts      # 环境变量类型
├── global.d.ts   # 全局类型声明
└── README.md     # 说明文档
```

## 📝 文件说明

### env.d.ts

定义环境变量的类型，包括：

- `ImportMetaEnv` - Vite 环境变量接口
- `ImportMeta` - import.meta 类型扩展

**使用示例**:

```ts
// 在任何 .ts/.tsx 文件中直接使用
const env = import.meta.env.NODE_ENV;
// TypeScript 会自动提示类型
```

### global.d.ts

定义全局类型声明，包括：

- CSS/SCSS 模块声明
- 图片资源模块声明
- Node.js 全局类型扩展

**使用示例**:

```ts
// 导入 CSS 模块
import styles from './styles.module.css';
// styles 会有正确的类型

// 导入图片
import logo from './logo.svg';
// logo 会有正确的类型
```

## 🔧 配置

在 `tsconfig.json` 中引用这些类型：

```json
{
  "compilerOptions": {
    "types": ["vite/client", "node"]
  },
  "include": ["typings/**/*", "src/**/*"]
}
```

## 🎯 与 Element Plus 的对比

| Element Plus     | Lume UI        | 说明         |
| ---------------- | -------------- | ------------ |
| `typings/`       | `typings/`     | 全局类型目录 |
| Vue 相关类型     | React 相关类型 | 框架差异     |
| 组件类型自动生成 | 计划中         | 未来功能     |

## 📚 参考

- [Element Plus Typings](https://github.com/element-plus/element-plus/tree/dev/typings)
- [TypeScript Declaration Files](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
