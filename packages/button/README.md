# @lume-ui/button

一个灵活且易于访问的按钮组件，基于 React 和 Radix UI 构建，使用 Tailwind CSS 进行样式设置。

## 特性

- ✨ 多种按钮变体（default、secondary、destructive、outline、ghost、link）
- 📏 多种尺寸选项（sm、default、lg、icon 变体）
- ♿️ 完全可访问，支持键盘导航和焦点状态
- 🎨 使用 Tailwind CSS 构建，支持亮色/暗色主题
- 🔄 支持 `asChild` 属性，可以渲染为其他元素
- 📦 使用 TypeScript 编写，提供完整的类型支持
- 🎯 支持所有原生 button 属性

## 安装

```bash
pnpm add @lume-ui/button
```

## 使用

### 基础用法

```tsx
import { Button } from '@lume-ui/button';

export default function App() {
  return <Button>点击我</Button>;
}
```

### 变体

Button 组件支持 6 种不同的视觉变体：

```tsx
<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

### 尺寸

Button 组件支持多种尺寸：

```tsx
<Button size="sm">小按钮</Button>
<Button size="default">默认按钮</Button>
<Button size="lg">大按钮</Button>
```

### 图标按钮

使用 icon 尺寸创建正方形的图标按钮：

```tsx
<Button size="icon-sm" variant="outline">
  <Icon />
</Button>

<Button size="icon" variant="outline">
  <Icon />
</Button>

<Button size="icon-lg" variant="outline">
  <Icon />
</Button>
```

### 带图标的按钮

在按钮文本旁边添加图标：

```tsx
<Button>
  <Icon />
  按钮文本
</Button>

<Button variant="secondary">
  按钮文本
  <Icon />
</Button>
```

### 禁用状态

```tsx
<Button disabled>禁用按钮</Button>
```

### Loading 状态

```tsx
<Button disabled>
  <SpinnerIcon className="animate-spin" />
  加载中...
</Button>
```

### AsChild 属性

使用 `asChild` 属性将按钮样式应用到其他元素：

```tsx
<Button asChild>
  <a href="/about">关于我们</a>
</Button>
```

### 自定义样式

使用 `className` 属性添加自定义样式：

```tsx
<Button className="w-full">全宽按钮</Button>
```

## API

### ButtonProps

Button 组件接受所有原生 `button` 元素的属性，以及以下额外属性：

| 属性        | 类型                                                                          | 默认值      | 描述                                     |
| ----------- | ----------------------------------------------------------------------------- | ----------- | ---------------------------------------- |
| `variant`   | `'default' \| 'secondary' \| 'destructive' \| 'outline' \| 'ghost' \| 'link'` | `'default'` | 按钮的视觉变体                           |
| `size`      | `'sm' \| 'default' \| 'lg' \| 'icon' \| 'icon-sm' \| 'icon-lg'`               | `'default'` | 按钮的尺寸                               |
| `asChild`   | `boolean`                                                                     | `false`     | 是否将样式应用到子元素而不是 button 元素 |
| `className` | `string`                                                                      | -           | 额外的 CSS 类名                          |

## 导出

```tsx
import { Button, buttonVariants, type ButtonProps } from '@lume-ui/button';
```

- `Button` - 按钮组件
- `buttonVariants` - CVA 变体函数，用于生成按钮类名
- `ButtonProps` - TypeScript 类型定义

## 样式导入

样式会在导入组件时自动加载。如果需要单独导入样式：

```tsx
import '@lume-ui/button/styles.css';
```

## 许可证

Apache 2.0
