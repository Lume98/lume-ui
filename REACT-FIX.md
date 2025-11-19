# React 多实例冲突修复指南

## 🔴 问题描述

在运行 demo 项目时出现错误：
```
TypeError: Cannot read properties of undefined (reading 'ReactCurrentDispatcher')
```

这是典型的 **React 多实例冲突**问题。

## 🎯 问题根源

在 monorepo 中，存在多个不同版本的 React 实例：

```
demo 项目: React 19.2.0 ← 运行时使用
shadcn-cascader devDependencies: React 18.3.1 ← 构建时使用
```

当组件库被导入时，它使用的是自己的 React 实例，而 demo 项目使用另一个 React 实例，导致 `ReactCurrentDispatcher` 上下文丢失。

## ✅ 解决方案

### 1. 配置 pnpm 依赖提升

**修改文件**: `.npmrc`

```ini
shamefully-hoist=true
strict-peer-dependencies=false
link-workspace-packages=true
public-hoist-pattern[]=*react*  # ← 新增：提升所有 React 相关包
```

### 2. 在根目录统一管理 React

**修改文件**: `package.json`

```json
{
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "typescript": "^5.3.3"
  }
}
```

### 3. 从组件库移除 React 依赖

**修改文件**: `packages/shadcn-cascader/package.json`

```json
{
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0",
    "tailwindcss": ">=3.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    // ❌ 移除了 "react" 和 "react-dom"
    "typescript": "^5.3.3",
    "vite": "^5.0.8",
    "vite-plugin-dts": "^3.6.4"
  }
}
```

### 4. 更新 lucide-react 版本

**修改文件**: `packages/shadcn-cascader/package.json`

```json
{
  "dependencies": {
    "lucide-react": "^0.468.0"  // 从 0.303.0 更新，支持 React 19
  }
}
```

## 🔧 应用修复

### 1. 重新安装依赖

```bash
pnpm install
```

这会：
- 将 React 19.2.0 提升到 `node_modules/` 根目录
- 所有子包共享同一个 React 实例
- 更新 lucide-react 到支持 React 19 的版本

### 2. 重新构建组件库

```bash
pnpm --filter shadcn-cascader build
```

### 3. 重启 demo 服务器

```bash
pnpm dev
```

## 📊 修复前后对比

### 修复前
```
node_modules/
├── react@19.2.0                    # demo 使用
└── .pnpm/
    └── shadcn-cascader/node_modules/
        └── react@18.3.1            # 组件库使用 ❌ 冲突！
```

### 修复后
```
node_modules/
├── react@19.2.0                    # 所有包共享 ✅
├── demo/                           # 使用提升的 React
└── shadcn-cascader/                # 使用提升的 React
```

## ✅ 验证修复

访问 http://localhost:3001/cascader，应该能看到：
- ✅ 页面正常加载
- ✅ Cascader 组件正常渲染
- ✅ 无 React 相关错误

## 🎓 原理说明

### 为什么会发生 React 多实例问题？

React 使用全局上下文（如 `ReactCurrentDispatcher`）来管理 Hooks 和组件状态。当存在多个 React 实例时：

1. **组件库**在构建时使用 React A 创建组件
2. **应用**在运行时使用 React B
3. 组件尝试访问 React B 的上下文，但它是用 React A 的上下文创建的
4. 上下文不匹配导致 `undefined` 错误

### pnpm 的依赖管理

pnpm 默认使用严格的依赖隔离：
- 每个包有自己的 `node_modules`
- 这在大多数情况下是好的，但 React 是个例外

**解决方案**：
- `public-hoist-pattern[]=*react*`：将所有 React 相关包提升到根目录
- 确保整个 monorepo 共享同一个 React 实例

### peerDependencies 的作用

```json
"peerDependencies": {
  "react": "^18.0.0 || ^19.0.0"
}
```

含义：
- "我需要 React，但不自己安装"
- "请使用者提供 React"
- "我兼容 React 18 或 19"

这正是组件库的正确做法。

## 🚨 常见陷阱

### ❌ 错误做法 1：在组件库的 dependencies 中包含 React
```json
{
  "dependencies": {
    "react": "^19.0.0"  // ❌ 错误！会导致多实例
  }
}
```

### ❌ 错误做法 2：在组件库的 devDependencies 中包含 React
```json
{
  "devDependencies": {
    "react": "^18.0.0"  // ❌ 会与使用者的 React 冲突
  }
}
```

### ✅ 正确做法：只在 peerDependencies 中声明
```json
{
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0"  // ✅ 正确！
  }
}
```

## 🔍 调试技巧

### 检查 React 实例数量

```bash
# 在 Windows PowerShell
Get-ChildItem -Recurse -Filter "react" -Path node_modules | Where-Object { $_.PSIsContainer }

# 在 Linux/Mac
find node_modules -name "react" -type d
```

应该只看到一个 React 目录（在根 `node_modules/` 中）。

### 验证依赖提升

```bash
pnpm list react
```

输出应该显示所有包都使用相同的 React 版本。

## 📚 相关文档

- [React - Invalid Hook Call Warning](https://react.dev/warnings/invalid-hook-call-warning)
- [pnpm - .npmrc](https://pnpm.io/npmrc)
- [pnpm - Workspace](https://pnpm.io/workspaces)
- [npm - peerDependencies](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#peerdependencies)

## 💡 最佳实践

1. **组件库开发**：
   - 永远不要在 dependencies 或 devDependencies 中包含 React
   - 只在 peerDependencies 中声明
   - 构建时使用宿主提供的 React

2. **Monorepo 配置**：
   - 使用 `public-hoist-pattern` 提升关键依赖
   - 在根目录统一管理版本
   - 定期检查依赖树

3. **版本兼容性**：
   - 使用宽松的 peerDependencies 版本范围
   - 及时更新依赖支持新版本
   - 做好向后兼容

## ✅ 检查清单

修复 React 多实例问题时，确保：

- [ ] `.npmrc` 配置了 `public-hoist-pattern[]=*react*`
- [ ] 根目录 `package.json` 包含 React 作为 devDependencies
- [ ] 组件库 `package.json` 的 devDependencies 不包含 React
- [ ] 组件库 `package.json` 的 peerDependencies 正确声明 React
- [ ] 运行 `pnpm install` 重新安装依赖
- [ ] 重新构建组件库
- [ ] 重启 dev 服务器
- [ ] 验证页面无错误

完成以上步骤后，React 多实例问题应该彻底解决！🎉

