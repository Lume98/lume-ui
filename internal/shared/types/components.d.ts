/**
 * 组件通用类型定义
 * 参考 Element Plus 的组件类型系统
 */

import type { CSSProperties, ReactNode } from 'react';

/**
 * 基础组件 Props
 */
export interface BaseComponentProps {
  /**
   * 自定义 className
   */
  className?: string;
  /**
   * 自定义样式
   */
  style?: CSSProperties;
  /**
   * 子元素
   */
  children?: ReactNode;
}

/**
 * 尺寸类型
 */
export type Size = 'small' | 'medium' | 'large';

/**
 * 变体类型（常用于按钮等组件）
 */
export type Variant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'destructive';

/**
 * 组件状态
 */
export interface ComponentState {
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 是否只读
   */
  readonly?: boolean;
  /**
   * 是否加载中
   */
  loading?: boolean;
}

/**
 * 表单组件 Props
 */
export interface FormComponentProps extends BaseComponentProps, ComponentState {
  /**
   * 表单项名称
   */
  name?: string;
  /**
   * 值
   */
  value?: any;
  /**
   * 默认值
   */
  defaultValue?: any;
  /**
   * 值变化回调
   */
  onChange?: (value: any) => void;
  /**
   * 失焦回调
   */
  onBlur?: () => void;
  /**
   * 聚焦回调
   */
  onFocus?: () => void;
}

/**
 * 可点击组件 Props
 */
export interface ClickableComponentProps extends BaseComponentProps {
  /**
   * 点击事件
   */
  onClick?: (event: React.MouseEvent) => void;
  /**
   * 是否禁用
   */
  disabled?: boolean;
}

/**
 * 带图标的组件 Props
 */
export interface IconComponentProps {
  /**
   * 左侧图标
   */
  icon?: ReactNode;
  /**
   * 右侧图标
   */
  iconRight?: ReactNode;
}

/**
 * 可搜索组件 Props
 */
export interface SearchableComponentProps {
  /**
   * 是否可搜索
   */
  searchable?: boolean;
  /**
   * 搜索占位符
   */
  searchPlaceholder?: string;
  /**
   * 搜索回调
   */
  onSearch?: (value: string) => void;
  /**
   * 自定义搜索函数
   */
  filterOption?: (inputValue: string, option: any) => boolean;
}

/**
 * 可清空组件 Props
 */
export interface ClearableComponentProps {
  /**
   * 是否可清空
   */
  clearable?: boolean;
  /**
   * 清空回调
   */
  onClear?: () => void;
}

/**
 * 弹出层组件 Props
 */
export interface PopoverComponentProps {
  /**
   * 是否打开
   */
  open?: boolean;
  /**
   * 默认是否打开
   */
  defaultOpen?: boolean;
  /**
   * 打开状态变化回调
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * 弹出层位置
   */
  placement?:
    | 'top'
    | 'right'
    | 'bottom'
    | 'left'
    | 'top-start'
    | 'top-end'
    | 'right-start'
    | 'right-end'
    | 'bottom-start'
    | 'bottom-end'
    | 'left-start'
    | 'left-end';
}
