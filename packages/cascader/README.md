# @lume-ui/cascader

一个功能强大的级联选择器组件，基于 React、Radix UI 和 Tailwind CSS 构建。支持单选/多选、搜索、自定义渲染等功能。

## 特性

- ✨ 支持单选和多选模式
- 🔍 内置搜索功能
- 🎯 支持父子节点独立选择（checkStrictly）
- 📦 支持多种选中策略（all、parent、child）
- 🎨 使用 Tailwind CSS 构建，支持亮色/暗色主题
- ♿️ 完全可访问，支持键盘导航
- 📏 可自定义标签数量限制
- 🔄 支持完整路径或仅返回最后节点值
- 🎭 可自定义占位符和渲染
- 📦 使用 TypeScript 编写，提供完整的类型支持

## 安装

```bash
pnpm add @lume-ui/cascader
```

### 依赖

此组件依赖以下库：

```json
{
  "@radix-ui/react-checkbox": "^1.3.3",
  "@radix-ui/react-popover": "^1.1.15",
  "@radix-ui/react-scroll-area": "^1.2.10",
  "@radix-ui/react-slot": "^1.2.4",
  "clsx": "^2.1.1",
  "lucide-react": "^0.468.0",
  "tailwind-merge": "^2.6.0"
}
```

## 使用

### 基础用法

```tsx
import { Cascader } from '@lume-ui/cascader';

const options = [
  {
    label: '浙江',
    value: 'zhejiang',
    children: [
      {
        label: '杭州',
        value: 'hangzhou',
        children: [
          { label: '西湖区', value: 'xihu' },
          { label: '滨江区', value: 'binjiang' },
        ],
      },
    ],
  },
  {
    label: '江苏',
    value: 'jiangsu',
    children: [
      {
        label: '南京',
        value: 'nanjing',
        children: [
          { label: '玄武区', value: 'xuanwu' },
          { label: '秦淮区', value: 'qinhuai' },
        ],
      },
    ],
  },
];

export default function App() {
  const [value, setValue] = React.useState([]);

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

### 多选模式

```tsx
<Cascader
  options={options}
  value={selectedValues}
  onChange={setSelectedValues}
  multiple={true}
  placeholder="请选择多个地区"
/>
```

### 父子节点独立选择

```tsx
<Cascader
  options={options}
  value={value}
  onChange={setValue}
  multiple={true}
  checkStrictly={true}
  placeholder="可独立选择父子节点"
/>
```

### 自定义选中策略

控制多选模式下显示哪些节点：

```tsx
// 显示所有选中节点
<Cascader
  options={options}
  multiple={true}
  showCheckedStrategy="all"
/>

// 只显示父节点（当子节点全选时）
<Cascader
  options={options}
  multiple={true}
  showCheckedStrategy="parent"
/>

// 只显示叶子节点
<Cascader
  options={options}
  multiple={true}
  showCheckedStrategy="child"
/>
```

### 限制标签数量

```tsx
<Cascader
  options={options}
  multiple={true}
  maxTagCount={2}
  maxTagPlaceholder={omittedCount => `+${omittedCount}...`}
/>
```

### 仅返回最后节点值

```tsx
// 默认返回完整路径：['zhejiang', 'hangzhou', 'xihu']
<Cascader
  options={options}
  value={value}
  onChange={setValue}
  emitPath={true}
/>

// 只返回最后一个节点：'xihu'
<Cascader
  options={options}
  value={value}
  onChange={setValue}
  emitPath={false}
/>
```

### 禁用选项

```tsx
const optionsWithDisabled = [
  {
    label: '浙江',
    value: 'zhejiang',
    children: [
      {
        label: '杭州',
        value: 'hangzhou',
        disabled: true, // 禁用此选项
        children: [{ label: '西湖区', value: 'xihu' }],
      },
    ],
  },
];

<Cascader options={optionsWithDisabled} value={value} onChange={setValue} />;
```

### 禁用整个组件

```tsx
<Cascader options={options} value={value} onChange={setValue} disabled={true} />
```

## API

### CascaderProps

| 属性                  | 类型                                  | 默认值        | 描述                         |
| --------------------- | ------------------------------------- | ------------- | ---------------------------- |
| `options`             | `CascaderOption[]`                    | -             | 级联选择器的选项数据（必填） |
| `value`               | `string[] \| string[][] \| string`    | -             | 当前选中的值                 |
| `onChange`            | `(value, selectedOptions) => void`    | -             | 值变化时的回调函数           |
| `placeholder`         | `string`                              | `'请选择...'` | 占位符文本                   |
| `className`           | `string`                              | -             | 自定义类名                   |
| `disabled`            | `boolean`                             | `false`       | 是否禁用                     |
| `multiple`            | `boolean`                             | `false`       | 是否支持多选                 |
| `checkStrictly`       | `boolean`                             | `false`       | 是否严格的父子节点独立选择   |
| `showCheckedStrategy` | `'all' \| 'parent' \| 'child'`        | `'all'`       | 多选模式下的选中策略         |
| `maxTagCount`         | `number`                              | -             | 最多显示的标签数量           |
| `maxTagPlaceholder`   | `(omittedCount: number) => ReactNode` | -             | 超出标签数量时的占位内容     |
| `emitPath`        | `boolean`                             | `true`        | 是否返回完整路径             |

### CascaderOption

```typescript
interface CascaderOption {
  label: string; // 显示的标签
  value: string; // 选项的值
  children?: CascaderOption[]; // 子选项
  disabled?: boolean; // 是否禁用
}
```

## 值的格式

### 单选模式

**emitPath = true（默认）**：

```typescript
value: string[]  // 例如：['zhejiang', 'hangzhou', 'xihu']
```

**emitPath = false**：

```typescript
value: string; // 例如：'xihu'
```

### 多选模式

**emitPath = true（默认）**：

```typescript
value: string[][]  // 例如：[['zhejiang', 'hangzhou', 'xihu'], ['jiangsu', 'nanjing', 'xuanwu']]
```

**emitPath = false**：

```typescript
value: string[]  // 例如：['xihu', 'xuanwu']
```

## 样式定制

### 使用自定义类名

```tsx
<Cascader
  className="w-full"
  options={options}
  value={value}
  onChange={setValue}
/>
```

### 主题变量

组件使用 CSS 变量来支持主题定制。你可以在你的 CSS 中覆盖这些变量：

```css
:root {
  --primary: /* 主色调 */ ;
  --background: /* 背景色 */ ;
  --border: /* 边框色 */ ;
  --popover: /* 弹出层背景 */ ;
  /* 更多变量... */
}
```

## 示例

### 完整示例：地区选择器

```tsx
import React from 'react';
import { Cascader } from '@lume-ui/cascader';

const regionOptions = [
  {
    label: '中国',
    value: 'china',
    children: [
      {
        label: '浙江',
        value: 'zhejiang',
        children: [
          {
            label: '杭州',
            value: 'hangzhou',
            children: [
              { label: '西湖区', value: 'xihu' },
              { label: '滨江区', value: 'binjiang' },
              { label: '余杭区', value: 'yuhang' },
            ],
          },
          {
            label: '宁波',
            value: 'ningbo',
            children: [
              { label: '海曙区', value: 'haishu' },
              { label: '江北区', value: 'jiangbei' },
            ],
          },
        ],
      },
      {
        label: '江苏',
        value: 'jiangsu',
        children: [
          {
            label: '南京',
            value: 'nanjing',
            children: [
              { label: '玄武区', value: 'xuanwu' },
              { label: '秦淮区', value: 'qinhuai' },
            ],
          },
        ],
      },
    ],
  },
];

export default function RegionSelector() {
  const [value, setValue] = React.useState<string[]>([]);

  return (
    <div className="w-full max-w-md">
      <Cascader
        options={regionOptions}
        value={value}
        onChange={(newValue, selectedOptions) => {
          setValue(newValue as string[]);
          console.log('选中的值:', newValue);
          console.log('选中的选项:', selectedOptions);
        }}
        placeholder="请选择地区"
      />
    </div>
  );
}
```

## 注意事项

1. **value 类型**：确保传入的 `value` 类型与 `multiple` 和 `emitPath` 设置相匹配
2. **性能**：对于大量数据，建议使用虚拟滚动或分页加载
3. **样式导入**：样式会自动导入，如需单独导入：`import '@lume-ui/cascader/styles.css'`

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

## 相关链接

- [GitHub 仓库](https://github.com/Lume98/shadcn-cascader)
- [问题反馈](https://github.com/Lume98/shadcn-cascader/issues)
