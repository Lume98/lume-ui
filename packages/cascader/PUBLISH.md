# 发布指南

本文档说明如何将 @lume-ui/cascader 发布到 npm。

## 发布前检查清单

### 1. 确认包信息

- [x] package.json 中的包名正确：`@lume-ui/cascader`
- [x] 版本号符合语义化版本规范
- [x] description、keywords、author 等字段完整
- [x] repository、homepage、bugs 链接正确

### 2. 确认构建配置

- [x] tsconfig.json 配置正确
- [x] tsup.config.ts 构建配置完整
- [x] postcss.config.js 和 tailwind.config.ts 存在

### 3. 确认文件

- [x] README.md 文档完整
- [x] CHANGELOG.md 记录版本变更
- [x] 所有依赖已安装
- [x] 构建成功，dist 目录包含所有必要文件

### 4. 测试

```bash
# 在包目录下运行
cd packages/cascader

# 安装依赖
pnpm install

# 构建
pnpm build

# 检查构建产物
ls dist/
```

## 发布步骤

### 方式一：手动发布到 npm

1. **登录 npm**

```bash
npm login
```

2. **构建包**

```bash
cd packages/cascader
pnpm build
```

3. **发布**

```bash
npm publish --access public
```

### 方式二：使用 pnpm 发布

1. **登录 npm**

```bash
pnpm login
```

2. **构建并发布**

```bash
cd packages/cascader
pnpm build
pnpm publish --access public
```

## 发布后

1. **验证发布**

```bash
npm view @lume-ui/cascader
```

2. **测试安装**

```bash
pnpm add @lume-ui/cascader
```

3. **更新 GitHub Release**

   - 创建新的 Git tag
   - 创建 GitHub Release
   - 附加 CHANGELOG

4. **更新文档**
   - 更新主 README.md
   - 更新示例代码

## 版本管理

遵循语义化版本规范：

- **MAJOR** (1.0.0)：不兼容的 API 更改
- **MINOR** (0.1.0)：向后兼容的功能新增
- **PATCH** (0.0.1)：向后兼容的问题修正

## 发布示例

```bash
# 更新版本号
cd packages/cascader
npm version patch  # 或 minor / major

# 构建
pnpm build

# 发布
pnpm publish --access public

# 创建 Git tag
git tag @lume-ui/cascader@0.1.1
git push origin @lume-ui/cascader@0.1.1
```

## 注意事项

1. **首次发布**：确保包名未被占用
2. **作用域包**：@lume-ui 作用域需要 `--access public` 标志
3. **构建检查**：发布前确认 dist 目录内容正确
4. **依赖版本**：确认 peerDependencies 版本范围合理
5. **文档更新**：每次发布都要更新 CHANGELOG.md

## 故障排查

### 发布失败：权限不足

```bash
# 确认已登录
npm whoami

# 重新登录
npm login
```

### 发布失败：包名已存在

- 更改包名或联系 npm 支持

### 构建失败

- 检查 tsconfig.json
- 检查依赖是否完整安装
- 清理 dist 目录重新构建

## 相关命令

```bash
# 检查包内容
npm pack --dry-run

# 本地测试链接
pnpm link

# 在其他项目中使用
pnpm link @lume-ui/cascader
```
