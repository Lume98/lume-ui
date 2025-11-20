# TypeScript 配置指南

> 参考 Element Plus 的 TypeScript Project References 配置

## 📋 项目引用（Project References）

本项目使用 TypeScript Project References 来管理 Monorepo 中的多个包，这带来以下优势：

### 优势

1. **更快的编译速度** - TypeScript 只重新编译修改的包
2. **更好的编辑器体验** - 跨包导航和类型提示
3. **强制架构边界** - 防止循环依赖
4. **并行构建** - 可以并行编译独立的包

## 🏗️ 配置结构

### 根 tsconfig.json

```json
{
  "compilerOptions": {
    // 基础配置...
  },
  "references": [
    { "path": "./packages/button" },
    { "path": "./packages/cascader" },
    { "path": "./packages/utils" },
    { "path": "./play" }
  ]
}
```

### 包级 tsconfig.json

每个包的 `tsconfig.json` 必须：

1. **继承根配置**: `"extends": "../../tsconfig.json"`
2. **启用 composite**: `"composite": true`
3. **指定输入输出**: `"rootDir"` 和 `"outDir"`

**示例**（packages/button/tsconfig.json）:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "rootDir": "./src",
    "outDir": "./dist",
    "noEmit": false,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

**注意**: 必须设置 `"noEmit": false` 来覆盖根配置的 `noEmit: true`，因为被引用的项目需要生成输出文件。

## 📦 各包配置说明

### packages/button/ ✅

- ✅ `"composite": true`
- ✅ `"extends": "../../tsconfig.json"`
- ✅ `"rootDir": "./src"`
- ✅ `"outDir": "./dist"`
- ✅ `"noEmit": false` (覆盖根配置)

### packages/cascader/ ✅

- ✅ `"composite": true`
- ✅ `"extends": "../../tsconfig.json"`
- ✅ `"rootDir": "./src"`
- ✅ `"outDir": "./dist"`
- ✅ `"noEmit": false` (覆盖根配置)

### packages/utils/ ✅

- ✅ `"composite": true`
- ✅ `"extends": "../../tsconfig.json"`
- ✅ `"rootDir": "./src"`
- ✅ `"outDir": "./dist"`
- ✅ `"noEmit": false` (覆盖根配置)

### play/ ✅

- ✅ `"composite": true`
- ✅ `"extends": "../tsconfig.json"`
- ⚠️ Next.js 特殊配置（有自己的插件）

## 🔧 常见问题

### Q1: 为什么需要 "composite": true？

**A**: 当使用 Project References 时，被引用的项目必须启用 `composite` 模式。这会：

- 生成 `.d.ts` 声明文件
- 生成 `.tsbuildinfo` 文件用于增量编译
- 强制使用 `outDir`

### Q2: rootDir 和 outDir 的作用？

**A**:

- `rootDir`: TypeScript 源代码的根目录（通常是 `./src`）
- `outDir`: 编译产物的输出目录（通常是 `./dist`）

这确保了编译产物的目录结构清晰。

### Q3: 为什么要 extends 根配置？

**A**: 统一管理通用的 TypeScript 配置，包括：

- 编译目标（target）
- 模块系统（module）
- 严格模式（strict）
- 类型检查选项

### Q4: 如何添加新的包？

**步骤**：

1. 创建包目录和 tsconfig.json:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "rootDir": "./src",
    "outDir": "./dist"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

2. 在根 tsconfig.json 中添加引用:

```json
{
  "references": [
    // ...现有引用
    { "path": "./packages/new-package" }
  ]
}
```

## 🚀 构建命令

### 构建所有引用的项目

```bash
# 使用 TypeScript 编译器
tsc --build

# 或使用 -b 简写
tsc -b

# 清理构建产物
tsc -b --clean

# 强制重新构建
tsc -b --force
```

### 构建特定包

```bash
# 构建 button 包
tsc -b packages/button

# 构建多个包
tsc -b packages/button packages/utils
```

## 📊 与 Element Plus 的对比

| 特性                   | Element Plus   | Lume UI        | 说明                 |
| ---------------------- | -------------- | -------------- | -------------------- |
| **Project References** | ✅             | ✅             | 使用 TS 项目引用     |
| **Composite**          | ✅             | ✅             | 所有包启用 composite |
| **Monorepo 结构**      | pnpm workspace | pnpm workspace | 相同的包管理         |
| **增量编译**           | ✅             | ✅             | 利用 .tsbuildinfo    |

## 🎯 最佳实践

### 1. 保持配置继承

```json
// ✅ 好的做法
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    // 只覆盖必要的选项
  }
}

// ❌ 不好的做法
{
  "compilerOptions": {
    // 重复定义所有选项
    "target": "ES2020",
    "strict": true,
    // ...
  }
}
```

### 2. 明确指定 include/exclude

```json
{
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### 3. 使用 paths 映射

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@lume-ui/utils": ["../utils/src"]
    }
  }
}
```

## 🔍 故障排查

### 错误：必须拥有设置 "composite": true

**原因**: 被引用的项目没有启用 composite 模式

**解决**: 在该包的 tsconfig.json 中添加 `"composite": true`

### 错误：rootDir 配置不正确

**原因**: composite 项目需要明确的 rootDir

**解决**: 添加 `"rootDir": "./src"`

### 错误：引用的项目可能不会禁用发出

**原因**: 根配置中设置了 `"noEmit": true`，但被引用的项目需要生成输出文件

**解决**: 在各包的 tsconfig.json 中添加 `"noEmit": false` 来覆盖根配置

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "noEmit": false // 覆盖根配置的 noEmit: true
  }
}
```

### 编辑器类型提示不工作

**解决**:

1. 重启 TypeScript 服务器（VSCode: Cmd/Ctrl + Shift + P → "Restart TS Server"）
2. 运行 `tsc -b` 生成声明文件
3. 检查 paths 映射是否正确

### 错误：找不到 "vite/client" 的类型定义文件

**原因**: 根配置中包含了 `"vite/client"` 类型，但不是所有包都使用 Vite

**解决**:

1. 从根 tsconfig.json 中移除 `"vite/client"`
2. 只在使用 Vite 的包（button、cascader）中添加该类型

```json
// packages/button/tsconfig.json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "types": ["vite/client"] // 只在使用 Vite 的包中添加
  }
}
```

## 📚 参考资源

- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [TypeScript Handbook - tsconfig.json](https://www.typescriptlang.org/tsconfig)
- [Element Plus TypeScript Config](https://github.com/element-plus/element-plus/blob/dev/tsconfig.json)

---

**最后更新**: 2025-11-20  
**维护者**: Lume UI Team
