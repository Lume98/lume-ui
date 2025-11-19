# shadcn-cascader 项目设置指南

## 📦 项目结构

```
shadcn-cascader/
├── packages/
│   ├── shadcn-cascader/    # 组件库源码
│   │   ├── src/
│   │   └── dist/           # 构建产物
│   └── demo/               # 演示项目
├── pnpm-workspace.yaml
└── package.json
```

## 🚀 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 构建组件库

在第一次运行 demo 之前，需要先构建组件库：

```bash
pnpm --filter shadcn-cascader build
```

或者使用 monorepo 根目录的脚本：

```bash
pnpm build
```

### 3. 启动 demo 项目

```bash
pnpm dev
```

访问 http://localhost:3000 查看 demo

### 4. 访问 cascader 示例页面

http://localhost:3000/cascader

## 🔧 已修复的问题

### 组件库问题修复

1. **删除重复代码**

   - 移除了重复的 `getOptionPath` 函数
   - 统一使用 `findOptionPath`

2. **类型安全性改进**

   - 修复了 `value` 类型不一致问题
   - 添加 `normalizedValue` 处理默认值

3. **性能优化**

   - 使用 `useMemo` 优化 `indeterminate` 状态计算
   - 减少不必要的重新渲染

4. **功能完善**
   - 实现了 `showCheckedStrategy` 功能（all/parent/child）
   - 添加空状态处理
   - 修复 `showFullPath=false` 时的状态管理问题

### Demo 项目问题修复

1. **组件库构建配置**

   - 移除了 `@tailwindcss/vite` 插件（组件库不应该在构建时处理 Tailwind）
   - 清理了不必要的依赖（`tw-animate-css`）
   - 更新了 `peerDependencies` 以支持 React 18 和 19

2. **Next.js 配置**

   - 添加了 `transpilePackages: ['shadcn-cascader']` 配置
   - 支持 monorepo workspace 包的转译

3. **样式导入**

   - 在 `globals.css` 中导入了组件库样式
   - 配置正确的 CSS 处理链

4. **TypeScript 配置**
   - 添加 `skipLibCheck: true` 避免 React 类型版本冲突

## 📝 组件库依赖说明

### peerDependencies

- `react`: ^18.0.0 || ^19.0.0
- `react-dom`: ^18.0.0 || ^19.0.0
- `tailwindcss`: >=3.0.0

### dependencies

组件库包含以下核心依赖：

- `@radix-ui/react-*`: UI 基础组件
- `lucide-react`: 图标库
- `class-variance-authority`: CSS 类管理
- `clsx` & `tailwind-merge`: 样式工具

## 🛠️ 开发命令

### 构建相关

```bash
# 构建组件库
pnpm build

# 清理构建产物
pnpm --filter shadcn-cascader clean

# 监听模式构建
pnpm --filter shadcn-cascader dev
```

### 开发相关

```bash
# 启动 demo 开发服务器
pnpm dev

# 构建 demo
pnpm build:demo

# 类型检查
pnpm type-check

# 代码检查
pnpm lint
```

## ⚠️ 注意事项

### 1. 首次运行必须先构建

在首次运行 demo 项目前，必须先构建组件库：

```bash
pnpm --filter shadcn-cascader build
```

### 2. 组件库修改后需重新构建

如果修改了 `packages/shadcn-cascader/src` 中的代码，需要重新构建：

```bash
pnpm build
```

或者在开发时使用监听模式：

```bash
pnpm --filter shadcn-cascader dev
```

### 3. 样式问题

如果样式不生效，确保：

- demo 项目的 `globals.css` 中已导入 `shadcn-cascader/style.css`
- demo 项目已配置 Tailwind CSS
- Next.js 配置了 `transpilePackages`

## 🎨 使用示例

```tsx
import { Cascader } from 'shadcn-cascader';
import 'shadcn-cascader/style.css';

const options = [
  {
    label: '浙江省',
    value: 'zhejiang',
    children: [
      {
        label: '杭州市',
        value: 'hangzhou',
        children: [{ label: '西湖区', value: 'xihu' }],
      },
    ],
  },
];

function App() {
  const [value, setValue] = useState([]);

  return (
    <Cascader
      options={options}
      value={value}
      onChange={setValue}
      placeholder="请选择地区"
    />
  );
}
```

## 📚 更多示例

访问 http://localhost:3000/cascader 查看完整的示例，包括：

- 单选模式
- 多选模式（父子关联）
- 多选模式（父子不关联）
- 限制标签数量
- 自定义标签显示
- 选中策略控制
- 仅返回叶子节点值

## 🐛 故障排除

### 1. "Cannot read properties of undefined (reading 'ReactCurrentDispatcher')"

这是 **React 多实例冲突**问题。已通过以下方式修复：

- ✅ 配置 `.npmrc` 的 `public-hoist-pattern[]=*react*`
- ✅ 在根目录统一管理 React 版本
- ✅ 从组件库移除 React devDependencies

如果遇到此问题，运行：
```bash
pnpm install
pnpm --filter shadcn-cascader build
pnpm dev
```

详细说明见 [REACT-FIX.md](./REACT-FIX.md)

### 2. "Cannot find module 'shadcn-cascader'"

确保已经构建了组件库：

```bash
pnpm --filter shadcn-cascader build
```

### 3. 样式不生效

检查是否导入了样式文件：

```css
@import 'shadcn-cascader/style.css';
```

### 4. Next.js 报错 "Module not found"

确保 `next.config.ts` 中配置了：

```ts
transpilePackages: ['shadcn-cascader'];
```

### 5. 类型错误

确保 tsconfig.json 中包含：

```json
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```

## 📦 发布到 npm

如需发布组件库到 npm：

1. 构建组件库

```bash
pnpm --filter shadcn-cascader build
```

2. 发布

```bash
cd packages/shadcn-cascader
npm publish
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
