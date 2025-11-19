# shadcn-cascader

一个基于 shadcn/ui 的级联选择器组件。

## 项目结构

这是一个 monorepo 项目，使用 pnpm workspace 管理。

```
.
├── packages/
│   ├── shadcn-cascader/    # 组件包
│   └── demo/               # 开发演示
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.json
```

## 开发

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建组件

```bash
pnpm build
```

### 构建演示

```bash
pnpm build:demo
```

## 技术栈

- TypeScript
- React
- pnpm workspace

