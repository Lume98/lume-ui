# @lume-ui/shared

内部共享工具和类型定义包，参考 Element Plus 的 `@element-plus/utils`。

## 目录结构

```
shared/
├── types/          # 类型定义
│   ├── global.d.ts       # 全局类型
│   └── components.d.ts   # 组件通用类型
└── utils/          # 工具函数
    └── logger.ts         # 日志工具
```

## types/ - 类型定义

### global.d.ts

全局类型定义，包括模块声明等。

### components.d.ts

组件通用类型定义，包括：

- `BaseComponentProps` - 基础组件 Props
- `FormComponentProps` - 表单组件 Props
- `ClickableComponentProps` - 可点击组件 Props
- `IconComponentProps` - 带图标组件 Props
- `SearchableComponentProps` - 可搜索组件 Props
- `ClearableComponentProps` - 可清空组件 Props
- `PopoverComponentProps` - 弹出层组件 Props

**使用示例**:

```tsx
import type {
  BaseComponentProps,
  ClickableComponentProps,
} from '../../internal/shared/types/components';

interface ButtonProps extends BaseComponentProps, ClickableComponentProps {
  variant?: 'default' | 'primary';
}
```

## utils/ - 工具函数

### logger.ts

统一的日志工具，用于构建脚本和开发工具。

**使用示例**:

```ts
import { logger } from '../../internal/shared/utils/logger';

logger.info('Building packages...');
logger.success('Build completed!');
logger.warn('Missing peer dependency');
logger.error('Build failed', error);
```

## 设计原则

参考 Element Plus 的设计：

1. **不对外发布**: 仅供内部使用，不发布到 npm
2. **类型优先**: 提供完善的 TypeScript 支持
3. **轻量级**: 只包含必要的工具和类型
4. **可扩展**: 随着项目发展持续补充

## 参考

- [Element Plus Utils](https://github.com/element-plus/element-plus/tree/dev/packages/utils)
- [Element Plus Constants](https://github.com/element-plus/element-plus/tree/dev/packages/constants)
