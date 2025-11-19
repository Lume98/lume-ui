import * as React from 'react';
import {
  Check,
  ChevronsUpDown,
  ChevronRight,
  X,
  ChevronsDownUp,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { filterPaths } from './utils';
import useSelected from '@/hooks/use-selected';
import { collectChildValues } from '@/lib/collect-child-values';

export interface CascaderOption {
  label: string;
  value: string;
  children?: CascaderOption[];
  disabled?: boolean;
}

export interface CascaderProps {
  options: CascaderOption[];
  value?: string[] | string[][] | string;
  onChange?: (
    value: string[] | string[][] | string,
    selectedOptions: CascaderOption | CascaderOption[]
  ) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  multiple?: boolean;
  checkStrictly?: boolean;
  showCheckedStrategy?: 'all' | 'parent' | 'child';
  maxTagCount?: number;
  maxTagPlaceholder?: (omittedCount: number) => React.ReactNode;
  /** 是否返回完整路径，false 时只返回最后一个节点的值 */
  showFullPath?: boolean;
}

export function Cascader({
  options,
  value,
  onChange,
  placeholder = '请选择...',
  className,
  disabled = false,
  multiple = false,
  checkStrictly = false,
  showCheckedStrategy = 'all',
  maxTagCount,
  maxTagPlaceholder,
  showFullPath = true,
}: CascaderProps) {
  const [open, setOpen] = React.useState(false);
  const { state, dispatch, findOptionPath } = useSelected({
    options,
    multiple,
    showFullPath,
    value,
  });

  // 收集所有父节点的值
  // const getParentValues = React.useCallback(
  //   (path: CascaderOption[]): string[] => {
  //     return path.slice(0, -1).map(p => p.value);
  //   },
  //   []
  // );

  // 单选时的显示文本
  const displayText = React.useMemo(() => {
    if (multiple) {
      if (state.paths.length === 0) return placeholder;
      return null; // 使用 badges 显示
    } else {
      if (state.path.length === 0) return placeholder;
      return state.path.map(item => item.label).join(' / ');
    }
  }, [state.path, state.paths, placeholder, multiple]);

  // 生成面板数据
  const panels = React.useMemo(() => {
    const result: CascaderOption[][] = [options];
    const pathToUse = open ? state.hoverPath : state.path;

    let currentOptions = options;
    for (const item of pathToUse) {
      // 寻找当前选项的子选项
      const found = currentOptions.find(opt => opt.value === item.value);
      if (found?.children && found.children.length > 0) {
        // 如果当前选项有子选项，则将子选项添加到结果中
        result.push(found.children);
        currentOptions = found.children;
      }
    }

    return result;
  }, [options, state.hoverPath, state.path, open]);

  // 计算所有选项的半选状态（优化性能）
  const indeterminateMap = React.useMemo(() => {
    if (!multiple || checkStrictly) return new Map<string, boolean>();

    const map = new Map<string, boolean>();

    function checkIndeterminate(option: CascaderOption): boolean {
      if (!option.children || option.children.length === 0) {
        return false;
      }

      const allChildValues = collectChildValues(option);
      const checkedCount = allChildValues.filter(v =>
        state.values.has(v)
      ).length;

      const isIndeterminate =
        checkedCount > 0 && checkedCount < allChildValues.length;
      map.set(option.value, isIndeterminate);

      return isIndeterminate;
    }

    function traverse(opts: CascaderOption[]) {
      opts.forEach(opt => {
        checkIndeterminate(opt);
        if (opt.children) {
          traverse(opt.children);
        }
      });
    }

    traverse(options);
    return map;
  }, [options, state.values, multiple, checkStrictly, collectChildValues]);

  // 处理多选
  const handleMultipleSelect = (option: CascaderOption, level: number) => {
    if (option.disabled) return;

    const currentPath = [...state.hoverPath.slice(0, level), option];
    const pathValues = currentPath.map(p => p.value);
    const optionValue = option.value;

    const newSelectedValues = new Set(state.values);
    const newSelectedPaths = [...state.paths];

    if (checkStrictly) {
      // 父子不关联模式
      if (newSelectedValues.has(optionValue)) {
        newSelectedValues.delete(optionValue);
        const pathIndex = newSelectedPaths.findIndex(
          p => p[p.length - 1] === optionValue
        );
        if (pathIndex !== -1) {
          newSelectedPaths.splice(pathIndex, 1);
        }
      } else {
        newSelectedValues.add(optionValue);
        newSelectedPaths.push(pathValues);
      }
    } else {
      // 父子关联模式
      const childValues = collectChildValues(option);
      const isSelected = newSelectedValues.has(optionValue);

      if (isSelected) {
        // 取消选中：移除当前节点和所有子节点
        childValues.forEach(v => newSelectedValues.delete(v));
        // 移除相关路径
        const filteredPaths = newSelectedPaths.filter(
          p => !childValues.includes(p[p.length - 1])
        );
        newSelectedPaths.length = 0;
        newSelectedPaths.push(...filteredPaths);
      } else {
        // 选中：添加当前节点和所有子节点
        childValues.forEach(v => newSelectedValues.add(v));
        // 添加所有子叶子节点的路径
        function addLeafPaths(opt: CascaderOption, path: CascaderOption[]) {
          const currentFullPath = [...path, opt];
          if (!opt.children || opt.children.length === 0) {
            newSelectedPaths.push(currentFullPath.map(p => p.value));
          } else {
            opt.children.forEach(child => addLeafPaths(child, currentFullPath));
          }
        }
        addLeafPaths(option, currentPath.slice(0, -1));
      }
    }
    dispatch({ type: 'updateValues', payload: newSelectedValues });
    dispatch({ type: 'updatePaths', payload: newSelectedPaths });
    // 根据 showFullPath 返回不同格式的值
    const returnValue = showFullPath
      ? newSelectedPaths
      : newSelectedPaths.map(path => path[path.length - 1]);

    onChange?.(
      returnValue,
      Array.from(newSelectedValues)
        .map(v => {
          const path = findOptionPath(v);
          return path ? path[path.length - 1] : null;
        })
        .filter(Boolean) as CascaderOption[]
    );
  };

  // 处理单选
  const handleSelect = (option: CascaderOption, level: number) => {
    const newPath = [...state.hoverPath.slice(0, level), option];

    if (option.disabled) return;

    if (multiple) {
      handleMultipleSelect(option, level);
      // 多选模式下如果有子节点，也更新 hover path
      if (option.children && option.children.length > 0) {
        dispatch({ type: 'updateHoverPath', payload: newPath });
      }
    } else {
      // 单选模式
      const hasChildren = option.children && option.children.length > 0;

      // checkStrictly=true 时，可以选择任意层级
      // checkStrictly=false 时，只能选择叶子节点
      if (hasChildren && !checkStrictly) {
        // 有子选项且父子关联，只更新 hover path
        dispatch({ type: 'updateHoverPath', payload: newPath });
      } else {
        // 可以选择：叶子节点 或 checkStrictly=true 时的任意节点
        dispatch({ type: 'updatePath', payload: newPath });
        const values = newPath.map(item => item.value);
        const returnValue = showFullPath ? values : values[values.length - 1];
        onChange?.(returnValue, newPath[newPath.length - 1]);
        setOpen(false);
        dispatch({ type: 'updateHoverPath', payload: [] });
      }
    }
  };

  // 处理鼠标悬停
  const handleMouseEnter = (option: CascaderOption, level: number) => {
    if (option.disabled) return;
    const newPath = [...state.hoverPath.slice(0, level), option];
    dispatch({ type: 'updateHoverPath', payload: newPath });
  };

  // 当 popover 打开时，初始化 state.hoverPath
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      dispatch({
        type: 'updateHoverPath',
        payload: multiple ? [] : state.path,
      });
    } else {
      dispatch({ type: 'updateHoverPath', payload: [] });
    }
  };

  // 移除单个选中项（多选模式）
  const handleRemoveTag = (e: React.MouseEvent, pathToRemove: string[]) => {
    e.stopPropagation();
    const valueToRemove = pathToRemove[pathToRemove.length - 1];
    const newSelectedValues = new Set(state.values);
    const newSelectedPaths = state.paths.filter(
      p => p[p.length - 1] !== valueToRemove
    );

    if (checkStrictly) {
      newSelectedValues.delete(valueToRemove);
    } else {
      // 父子关联模式，需要移除所有相关的子节点
      const path = findOptionPath(valueToRemove);
      if (path) {
        const option = path[path.length - 1];
        const childValues = collectChildValues(option);
        childValues.forEach(v => newSelectedValues.delete(v));
      }
    }
    dispatch({ type: 'updateValues', payload: newSelectedValues });
    dispatch({ type: 'updatePaths', payload: newSelectedPaths });
    // 根据 showFullPath 返回不同格式的值
    const returnValue = showFullPath
      ? newSelectedPaths
      : newSelectedPaths.map(path => path[path.length - 1]);

    onChange?.(
      returnValue,
      Array.from(newSelectedValues)
        .map(v => {
          const path = findOptionPath(v);
          return path ? path[path.length - 1] : null;
        })
        .filter(Boolean) as CascaderOption[]
    );
  };

  // 根据 showCheckedStrategy 过滤要显示的路径
  const filteredPaths = React.useMemo(
    () =>
      filterPaths({
        selectedPaths: state.paths,
        multiple,
        checkStrictly,
        showCheckedStrategy,
        selectedValues: state.values,
        findOptionPath,
        collectChildValues,
      }),
    [
      state.paths,
      multiple,
      checkStrictly,
      showCheckedStrategy,
      state.values,
      findOptionPath,
      collectChildValues,
    ]
  );

  // 获取显示的路径标签
  const pathLabels = React.useMemo(() => {
    return filteredPaths.map(pathValues => {
      const labels: string[] = [];
      let currentOptions = options;

      for (const val of pathValues) {
        const found = currentOptions.find(opt => opt.value === val);
        if (found) {
          labels.push(found.label);
          currentOptions = found.children || [];
        }
      }
      return {
        pathValues,
        label: labels.join(' / '),
      };
    });
  }, [filteredPaths, options]);

  // 处理标签显示（考虑 maxTagCount）
  const displayTags = React.useMemo(() => {
    if (!maxTagCount || pathLabels.length <= maxTagCount) {
      return {
        visible: pathLabels,
        hidden: [],
        omittedCount: 0,
      };
    }
    return {
      visible: pathLabels.slice(0, maxTagCount),
      hidden: pathLabels.slice(maxTagCount),
      omittedCount: pathLabels.length - maxTagCount,
    };
  }, [pathLabels, maxTagCount]);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            'w-[300px] justify-between',
            multiple && 'h-auto min-h-10 py-2',
            className
          )}
        >
          {multiple ? (
            <div className="flex flex-wrap gap-1 flex-1">
              {pathLabels.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                <>
                  {displayTags.visible.map((item, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      <span className="max-w-[200px] truncate">
                        {item.label}
                      </span>
                      <div
                        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                          e.stopPropagation();
                          handleRemoveTag(e, item.pathValues);
                        }}
                      >
                        <X className="h-3 w-3 cursor-pointer hover:text-destructive" />
                      </div>
                    </Badge>
                  ))}
                  {displayTags.omittedCount > 0 && (
                    <Badge variant="secondary" className="cursor-default">
                      {maxTagPlaceholder
                        ? maxTagPlaceholder(displayTags.omittedCount)
                        : `+${displayTags.omittedCount}`}
                    </Badge>
                  )}
                </>
              )}
            </div>
          ) : (
            <span className="truncate">{displayText}</span>
          )}
          {open ? (
            <ChevronsDownUp className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        {options.length === 0 ? (
          <div className="p-4 text-center min-w-[180px] text-sm text-muted-foreground">
            暂无数据
          </div>
        ) : (
          <div className="flex">
            {panels.map((panel, panelIndex) => (
              <div
                key={panelIndex}
                className="border-r last:border-r-0 min-w-[180px]"
              >
                <ScrollArea className="h-[280px]">
                  <div className="p-1">
                    {panel.length === 0 ? (
                      <div className="p-4 text-center text-xs text-muted-foreground">
                        无选项
                      </div>
                    ) : (
                      panel.map(option => {
                        const isSelected =
                          state.hoverPath[panelIndex]?.value === option.value;
                        const hasChildren =
                          option.children && option.children.length > 0;

                        // 判断是否显示选中状态
                        const isFinalSelected = multiple
                          ? state.values.has(option.value)
                          : checkStrictly
                          ? state.path[panelIndex]?.value === option.value
                          : state.path[panelIndex]?.value === option.value &&
                            panelIndex === state.path.length - 1;

                        // 计算选中状态（用于父子关联模式）
                        const isChecked = state.values.has(option.value);
                        const isIndeterminate =
                          !isChecked &&
                          (indeterminateMap.get(option.value) || false);

                        return (
                          <div
                            key={option.value}
                            onClick={() => handleSelect(option, panelIndex)}
                            onMouseEnter={() =>
                              handleMouseEnter(option, panelIndex)
                            }
                            className={cn(
                              'relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
                              isSelected && 'bg-accent text-accent-foreground',
                              option.disabled &&
                                'pointer-events-none opacity-50'
                            )}
                          >
                            {multiple && (
                              <Checkbox
                                checked={
                                  isIndeterminate ? 'indeterminate' : isChecked
                                }
                                onCheckedChange={() =>
                                  handleSelect(option, panelIndex)
                                }
                                onClick={e => e.stopPropagation()}
                                className="pointer-events-none"
                              />
                            )}
                            <span className="flex-1 truncate">
                              {option.label}
                            </span>
                            {!multiple &&
                              isFinalSelected &&
                              (checkStrictly || !hasChildren) && (
                                <Check className="h-4 w-4 shrink-0" />
                              )}
                            {hasChildren && (
                              <ChevronRight className="h-4 w-4 shrink-0 opacity-50" />
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </ScrollArea>
              </div>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
