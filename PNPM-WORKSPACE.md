# pnpm Workspace 常用命令指南

本文档介绍在 shadcn-cascader monorepo 项目中使用 pnpm workspace 的常用命令。

## 📦 项目结构

本项目使用 pnpm workspace 管理多个包：

```
shadcn-cascader/
├── packages/
│   ├── cascader/      # 级联选择器组件包
│   ├── button/        # 按钮组件包
│   └── utils/         # 工具函数包
├── examples/          # 示例应用
├── pnpm-workspace.yaml
└── package.json
```

## 🚀 基础命令

### 安装依赖

```bash
# 安装所有 workspace 的依赖
pnpm install

# 为特定包安装依赖
pnpm --filter <package-name> add <dependency>

# 示例：为 cascader 包添加依赖
pnpm --filter cascader add react

# 为根目录安装开发依赖
pnpm add -w -D <dependency>

# 为根目录安装生产依赖
pnpm add -w <dependency>
```

### 查看信息

```bash
# 列出所有 workspace 包
pnpm list -r

# 查看特定包的依赖树
pnpm --filter cascader list

# 查看 workspace 信息
pnpm list --depth 0

# 查看特定包的详细信息
pnpm --filter cascader list --depth 1
```

## 🎯 过滤包（Filter）

### 按包名过滤

```bash
# 精确匹配包名
pnpm --filter cascader <command>

# 使用通配符匹配
pnpm --filter "@lume/*" <command>

# 排除特定包
pnpm --filter "!examples" <command>

# 多个包
pnpm --filter "cascader" --filter "button" <command>
```

### 按依赖关系过滤

```bash
# 包含依赖的包（cascader 及其所有依赖）
pnpm --filter cascader... <command>

# 包含被依赖的包（cascader 及其所有被依赖的包）
pnpm --filter ...cascader <command>

# 包含依赖和被依赖的包
pnpm --filter ...cascader... <command>
```

### 递归执行

```bash
# 在所有包中执行命令（-r 表示 recursive）
pnpm -r <command>

# 并行执行（默认）
pnpm -r --parallel run build

# 按依赖顺序执行
pnpm -r run build

# 排除特定包
pnpm -r --filter "!examples" run build
```

## 📜 运行脚本

### 基本用法

```bash
# 在所有包中运行脚本
pnpm -r run <script>

# 示例：构建所有包
pnpm -r run build

# 在特定包中运行脚本
pnpm --filter cascader run build

# 在多个包中运行脚本
pnpm --filter "cascader" --filter "button" run build
```

### 并行和顺序执行

```bash
# 并行执行（默认，适合独立任务）
pnpm -r --parallel run build

# 按拓扑顺序执行（考虑依赖关系）
pnpm -r run build

# 串行执行（一个接一个）
pnpm -r --sequential run build
```

## 🔧 常用操作

### 构建相关

```bash
# 构建所有包
pnpm -r run build

# 构建特定包
pnpm --filter cascader run build

# 构建并监听变化（如果包支持）
pnpm --filter cascader run dev

# 清理所有构建产物
pnpm -r run clean
```

### 开发相关

```bash
# 启动示例应用开发服务器
pnpm dev
# 等同于：pnpm --filter examples dev

# 在特定包中启动开发模式
pnpm --filter cascader run dev

# 类型检查所有包
pnpm type-check
# 等同于：pnpm -r type-check

# 代码检查所有包
pnpm lint
# 等同于：pnpm -r lint
```

### 执行命令

```bash
# 在所有包中执行命令
pnpm -r exec <command>

# 示例：在所有包中执行 echo
pnpm -r exec echo "Hello from package"

# 在特定包中执行命令
pnpm --filter cascader exec <command>

# 示例：查看包的 package.json
pnpm --filter cascader exec cat package.json
```

## 📦 依赖管理

### 添加依赖

```bash
# 为特定包添加生产依赖
pnpm --filter cascader add react

# 为特定包添加开发依赖
pnpm --filter cascader add -D @types/react

# 为所有包添加依赖
pnpm -r add <dependency>

# 使用 workspace 协议链接本地包
pnpm --filter examples add cascader@workspace:*
```

### 移除依赖

```bash
# 从特定包移除依赖
pnpm --filter cascader remove react

# 从所有包移除依赖
pnpm -r remove <dependency>
```

### 更新依赖

```bash
# 更新所有包的依赖
pnpm update -r

# 更新特定包的依赖
pnpm --filter cascader update

# 更新到最新版本
pnpm update -r --latest
```

## 🎨 项目特定命令

根据本项目的 `package.json` 配置，以下命令可直接使用：

```bash
# 启动示例应用开发服务器
pnpm dev

# 构建所有组件包
pnpm build

# 构建示例应用
pnpm build:demo

# 在所有包中运行 lint
pnpm lint

# 类型检查所有包
pnpm type-check

# 清理所有构建产物
pnpm clean
```

## 🔍 高级用法

### 条件执行

```bash
# 只在有变更的包中运行（需要 git）
pnpm -r --filter "[HEAD^1]" run build

# 按变更文件过滤
pnpm -r --filter "[HEAD]" run build
```

### 查看变更

```bash
# 查看哪些包需要发布
pnpm -r exec pnpm publish --dry-run

# 查看包的变更日志
pnpm --filter cascader exec cat CHANGELOG.md
```

### 清理操作

```bash
# 清理所有 node_modules
pnpm -r exec rm -rf node_modules
rm -rf node_modules
pnpm install

# 清理所有构建产物
pnpm -r run clean

# 清理并重新安装
pnpm -r exec rm -rf node_modules dist
pnpm install
```

## 📋 常用命令速查表

| 命令                             | 说明               |
| -------------------------------- | ------------------ |
| `pnpm install`                   | 安装所有依赖       |
| `pnpm -r run build`              | 构建所有包         |
| `pnpm --filter <name> <cmd>`     | 在特定包中执行命令 |
| `pnpm -r exec <cmd>`             | 在所有包中执行命令 |
| `pnpm --filter <name> add <pkg>` | 为包添加依赖       |
| `pnpm list -r`                   | 列出所有包         |
| `pnpm update -r`                 | 更新所有依赖       |
| `pnpm -r --parallel <cmd>`       | 并行执行命令       |
| `pnpm --filter <name>... <cmd>`  | 包含依赖执行       |

## 💡 最佳实践

### 1. 使用 workspace 协议

在 package.json 中使用 `workspace:*` 引用本地包：

```json
{
  "dependencies": {
    "@lume-ui/cascader": "workspace:*"
  }
}
```

### 2. 统一管理依赖版本

在根目录的 `package.json` 中统一管理公共依赖版本，使用 `pnpm.overrides` 或 `resolutions`。

### 3. 按需构建

使用 `--filter` 只构建需要的包，提高开发效率：

```bash
# 只构建 cascader 包
pnpm --filter cascader run build
```

### 4. 并行执行独立任务

对于可以并行执行的任务，使用 `--parallel` 提高速度：

```bash
pnpm -r --parallel run lint
```

### 5. 考虑依赖顺序

对于有依赖关系的任务，使用默认的拓扑顺序：

```bash
# 自动按依赖顺序构建
pnpm -r run build
```

## 🐛 常见问题

### 1. 找不到包

确保包名正确，使用 `pnpm list -r` 查看所有包名。

### 2. 依赖未正确链接

运行 `pnpm install` 重新安装依赖。

### 3. 构建顺序问题

使用 `pnpm -r run build` 而不是 `--parallel`，让 pnpm 自动处理依赖顺序。

### 4. 版本冲突

检查根目录的 `package.json` 和 `.npmrc` 配置，确保依赖版本统一。

## 📚 参考资源

- [pnpm 官方文档](https://pnpm.io/)
- [pnpm workspace 文档](https://pnpm.io/workspaces)
- [pnpm 过滤文档](https://pnpm.io/filtering)
