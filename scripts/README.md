# Scripts - 构建和发布脚本

> 参考 Element Plus 的脚本系统，自动化常见任务

## 📁 目录结构

```
scripts/
├── build.ts       # 构建脚本
├── release.ts     # 发布脚本
└── README.md      # 说明文档
```

## 🔧 脚本说明

### build.ts - 构建脚本

构建所有组件包，生成发布产物。

**功能**:

- 清理旧的构建产物
- 执行类型检查
- 构建所有包
- 验证构建结果

**使用**:

```bash
# 使用 ts-node 运行
pnpm tsx scripts/build.ts

# 或添加到 package.json scripts
pnpm build:all
```

**特性**:

- ✅ 支持并行构建
- ✅ 自动验证产物
- ✅ 彩色日志输出
- ✅ 错误处理

### release.ts - 发布脚本

发布组件包到 npm。

**功能**:

- Git 状态检查
- 自动构建
- 发布到 npm
- 创建 Git 标签

**使用**:

```bash
# Dry-run 模式（不实际发布）
pnpm tsx scripts/release.ts --dry-run

# 发布到 latest tag
pnpm tsx scripts/release.ts

# 发布到 beta tag
pnpm tsx scripts/release.ts --tag=beta

# 跳过构建
pnpm tsx scripts/release.ts --skip-build

# 跳过 Git 检查
pnpm tsx scripts/release.ts --skip-git
```

**选项**:

- `--dry-run`: 模拟发布，不实际执行
- `--tag=<tag>`: 指定 npm tag (latest, beta, alpha 等)
- `--skip-build`: 跳过构建步骤
- `--skip-git`: 跳过 Git 检查

## 📦 依赖

脚本依赖以下工具：

```json
{
  "devDependencies": {
    "tsx": "^4.0.0",
    "@types/node": "^20.0.0"
  }
}
```

## 🎯 与 Element Plus 的对比

| Element Plus  | Lume UI         | 说明           |
| ------------- | --------------- | -------------- |
| `build/` 目录 | `scripts/`      | 构建脚本位置   |
| Gulp 任务     | TypeScript 脚本 | 更现代的工具链 |
| Monorepo 构建 | Monorepo 构建   | 相同的构建策略 |

## 🚀 最佳实践

### 1. 发布前检查清单

- [ ] 所有测试通过
- [ ] 文档已更新
- [ ] CHANGELOG 已更新
- [ ] 版本号已更新
- [ ] Git 工作区干净

### 2. 版本管理

推荐使用 [Changesets](https://github.com/changesets/changesets) 管理版本：

```bash
# 添加 changeset
pnpm changeset

# 更新版本号
pnpm changeset version

# 发布
pnpm changeset publish
```

### 3. CI/CD 集成

在 GitHub Actions 中使用这些脚本：

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: pnpm install

      - name: Build packages
        run: pnpm tsx scripts/build.ts

      - name: Publish to npm
        run: pnpm tsx scripts/release.ts --skip-build --skip-git
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 💡 扩展脚本

未来可以添加的脚本：

- `gen-types.ts` - 自动生成类型声明
- `gen-version.ts` - 生成版本文件
- `gen-docs.ts` - 自动生成文档
- `size-check.ts` - 检查包体积
- `lint-staged.ts` - Git hooks 集成

## 📚 参考

- [Element Plus Build Scripts](https://github.com/element-plus/element-plus/tree/dev/internal/build)
- [pnpm Workspace](https://pnpm.io/workspaces)
- [npm Publish](https://docs.npmjs.com/cli/v8/commands/npm-publish)
