import * as React from 'react';
import { Check, ChevronsUpDown, ChevronRight, X } from 'lucide-react';

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
  const [selectedPath, setSelectedPath] = React.useState<CascaderOption[]>([]);
  const [hoverPath, setHoverPath] = React.useState<CascaderOption[]>([]);
  const [selectedValues, setSelectedValues] = React.useState<Set<string>>(
    new Set()
  );
  const [selectedPaths, setSelectedPaths] = React.useState<string[][]>([]);

  // 根据模式确定合适的默认值
  const normalizedValue = React.useMemo(() => {
    if (value !== undefined) return value;
    if (multiple) {
      return showFullPath ? [] : [];
    } else {
      return showFullPath ? [] : '';
    }
  }, [value, multiple, showFullPath]);

  // 查找选项路径的辅助函数
  const findOptionPath = React.useCallback(
    (targetValue: string): CascaderOption[] | null => {
      function findPath(
        opts: CascaderOption[],
        path: CascaderOption[] = []
      ): CascaderOption[] | null {
        for (const opt of opts) {
          const currentPath = [...path, opt];
          if (opt.value === targetValue) {
            return currentPath;
          }
          if (opt.children) {
            const found = findPath(opt.children, currentPath);
            if (found) return found;
          }
        }
        return null;
      }
      return findPath(options);
    },
    [options]
  );

  // 根据 value 初始化状态
  React.useEffect(() => {
    if (multiple) {
      // 多选模式
      if (showFullPath) {
        const vals = normalizedValue as string[][];
        if (vals.length > 0) {
          // 收集所有选中的值（仅叶子节点）
          const flatValues = new Set<string>();
          vals.forEach(path => {
            // 只添加叶子节点的值
            flatValues.add(path[path.length - 1]);
          });
          setSelectedValues(flatValues);
          setSelectedPaths(vals);
        } else {
          setSelectedValues(new Set());
          setSelectedPaths([]);
        }
      } else {
        // 只有最后节点值
        const vals = normalizedValue as string[];
        if (vals.length > 0) {
          const paths: string[][] = [];
          const valuesSet = new Set<string>();
          vals.forEach(val => {
            const path = findOptionPath(val);
            if (path) {
              const pathValues = path.map(p => p.value);
              paths.push(pathValues);
              // 只添加叶子节点的值
              valuesSet.add(val);
            }
          });
          setSelectedPaths(paths);
          setSelectedValues(valuesSet);
        } else {
          setSelectedValues(new Set());
          setSelectedPaths([]);
        }
      }
    } else {
      // 单选模式
      if (showFullPath) {
        const vals = normalizedValue as string[];
        if (vals.length > 0) {
          const path = findPathByValues(options, vals);
          if (path) {
            setSelectedPath(path);
          }
        } else {
          setSelectedPath([]);
        }
      } else {
        // 只有最后节点值
        const val = normalizedValue as string;
        if (val) {
          const path = findOptionPath(val);
          if (path) {
            setSelectedPath(path);
          }
        } else {
          setSelectedPath([]);
        }
      }
    }
  }, [normalizedValue, options, multiple, showFullPath, findOptionPath]);

  // 查找路径
  function findPathByValues(
    opts: CascaderOption[],
    values: string[]
  ): CascaderOption[] | null {
    if (values.length === 0) return null;

    for (const opt of opts) {
      if (opt.value === values[0]) {
        if (values.length === 1) {
          return [opt];
        }
        if (opt.children) {
          const childPath = findPathByValues(opt.children, values.slice(1));
          if (childPath) {
            return [opt, ...childPath];
          }
        }
      }
    }
    return null;
  }

  // 收集所有子节点的值
  const collectChildValues = React.useCallback(
    (option: CascaderOption): string[] => {
      const values: string[] = [];
      function collect(opt: CascaderOption) {
        values.push(opt.value);
        if (opt.children) {
          opt.children.forEach(collect);
        }
      }
      collect(option);
      return values;
    },
    []
  );

  // 收集所有父节点的值
  // const getParentValues = React.useCallback(
  //   (path: CascaderOption[]): string[] => {
  //     return path.slice(0, -1).map(p => p.value);
  //   },
  //   []
  // );

  // 生成显示文本
  const displayText = React.useMemo(() => {
    if (multiple) {
      if (selectedPaths.length === 0) return placeholder;
      return null; // 使用 badges 显示
    } else {
      if (selectedPath.length === 0) return placeholder;
      return selectedPath.map(item => item.label).join(' / ');
    }
  }, [selectedPath, selectedPaths, placeholder, multiple]);

  // 生成面板数据
  const panels = React.useMemo(() => {
    const result: CascaderOption[][] = [options];
    const pathToUse = open ? hoverPath : selectedPath;

    let currentOptions = options;
    for (const item of pathToUse) {
      const found = currentOptions.find(opt => opt.value === item.value);
      if (found?.children && found.children.length > 0) {
        result.push(found.children);
        currentOptions = found.children;
      }
    }

    return result;
  }, [options, hoverPath, selectedPath, open]);

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
        selectedValues.has(v)
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
  }, [options, selectedValues, multiple, checkStrictly, collectChildValues]);

  // 处理多选
  const handleMultipleSelect = (option: CascaderOption, level: number) => {
    if (option.disabled) return;

    const currentPath = [...hoverPath.slice(0, level), option];
    const pathValues = currentPath.map(p => p.value);
    const optionValue = option.value;

    const newSelectedValues = new Set(selectedValues);
    const newSelectedPaths = [...selectedPaths];

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

    setSelectedValues(newSelectedValues);
    setSelectedPaths(newSelectedPaths);

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
    const newPath = [...hoverPath.slice(0, level), option];

    if (option.disabled) return;

    if (multiple) {
      handleMultipleSelect(option, level);
      // 多选模式下如果有子节点，也更新 hover path
      if (option.children && option.children.length > 0) {
        setHoverPath(newPath);
      }
    } else {
      // 单选模式
      const hasChildren = option.children && option.children.length > 0;

      // checkStrictly=true 时，可以选择任意层级
      // checkStrictly=false 时，只能选择叶子节点
      if (hasChildren && !checkStrictly) {
        // 有子选项且父子关联，只更新 hover path
        setHoverPath(newPath);
      } else {
        // 可以选择：叶子节点 或 checkStrictly=true 时的任意节点
        setSelectedPath(newPath);
        const values = newPath.map(item => item.value);
        const returnValue = showFullPath ? values : values[values.length - 1];
        onChange?.(returnValue, newPath[newPath.length - 1]);
        setOpen(false);
        setHoverPath([]);
      }
    }
  };

  // 处理鼠标悬停
  const handleMouseEnter = (option: CascaderOption, level: number) => {
    if (option.disabled) return;
    const newPath = [...hoverPath.slice(0, level), option];
    setHoverPath(newPath);
  };

  // 当 popover 打开时，初始化 hoverPath
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setHoverPath(multiple ? [] : selectedPath);
    } else {
      setHoverPath([]);
    }
  };

  // 移除单个选中项（多选模式）
  const handleRemoveTag = (e: React.MouseEvent, pathToRemove: string[]) => {
    e.stopPropagation();
    const valueToRemove = pathToRemove[pathToRemove.length - 1];
    const newSelectedValues = new Set(selectedValues);
    const newSelectedPaths = selectedPaths.filter(
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

    setSelectedValues(newSelectedValues);
    setSelectedPaths(newSelectedPaths);

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
  const getFilteredPaths = React.useMemo(() => {
    if (!multiple || checkStrictly || showCheckedStrategy === 'all') {
      return selectedPaths;
    }

    if (showCheckedStrategy === 'child') {
      // 只显示叶子节点
      return selectedPaths.filter(path => {
        const lastValue = path[path.length - 1];
        const optionPath = findOptionPath(lastValue);
        if (!optionPath) return false;
        const lastOption = optionPath[optionPath.length - 1];
        return !lastOption.children || lastOption.children.length === 0;
      });
    }

    if (showCheckedStrategy === 'parent') {
      // 只显示父节点（如果所有子节点都被选中）
      const pathsToShow: string[][] = [];
      const processedValues = new Set<string>();

      // 按路径长度从短到长排序，优先处理父节点
      const sortedPaths = [...selectedPaths].sort(
        (a, b) => a.length - b.length
      );

      for (const path of sortedPaths) {
        const lastValue = path[path.length - 1];
        if (processedValues.has(lastValue)) continue;

        const optionPath = findOptionPath(lastValue);
        if (!optionPath) continue;

        const option = optionPath[optionPath.length - 1];

        if (option.children && option.children.length > 0) {
          // 检查是否所有子节点都被选中
          const allChildValues = collectChildValues(option);
          const allSelected = allChildValues.every(v => selectedValues.has(v));

          if (allSelected) {
            // 所有子节点都被选中，只显示父节点
            pathsToShow.push(path);
            allChildValues.forEach(v => processedValues.add(v));
          } else {
            // 部分子节点被选中，显示被选中的子节点
            if (selectedValues.has(lastValue)) {
              pathsToShow.push(path);
              processedValues.add(lastValue);
            }
          }
        } else {
          // 叶子节点，直接显示
          if (selectedValues.has(lastValue)) {
            pathsToShow.push(path);
            processedValues.add(lastValue);
          }
        }
      }

      return pathsToShow;
    }

    return selectedPaths;
  }, [
    selectedPaths,
    multiple,
    checkStrictly,
    showCheckedStrategy,
    selectedValues,
    findOptionPath,
    collectChildValues,
  ]);

  // 获取显示的路径标签
  const getDisplayPaths = React.useMemo(() => {
    return getFilteredPaths.map(pathValues => {
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
  }, [getFilteredPaths, options]);

  // 处理标签显示（考虑 maxTagCount）
  const displayTags = React.useMemo(() => {
    if (!maxTagCount || getDisplayPaths.length <= maxTagCount) {
      return {
        visible: getDisplayPaths,
        hidden: [],
        omittedCount: 0,
      };
    }

    return {
      visible: getDisplayPaths.slice(0, maxTagCount),
      hidden: getDisplayPaths.slice(maxTagCount),
      omittedCount: getDisplayPaths.length - maxTagCount,
    };
  }, [getDisplayPaths, maxTagCount]);

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
              {getDisplayPaths.length === 0 ? (
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
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={(e: React.MouseEvent<SVGSVGElement>) =>
                          handleRemoveTag(e, item.pathValues)
                        }
                      />
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
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {options.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
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
                          hoverPath[panelIndex]?.value === option.value;
                        const hasChildren =
                          option.children && option.children.length > 0;

                        // 判断是否显示选中状态
                        const isFinalSelected = multiple
                          ? selectedValues.has(option.value)
                          : checkStrictly
                          ? selectedPath[panelIndex]?.value === option.value
                          : selectedPath[panelIndex]?.value === option.value &&
                            panelIndex === selectedPath.length - 1;

                        // 计算选中状态（用于父子关联模式）
                        const isChecked = selectedValues.has(option.value);
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
