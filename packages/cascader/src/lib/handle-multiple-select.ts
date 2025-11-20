import { CascaderOption } from '@/components/cascader';
import { collectChildValues } from '@/lib/collect-child-values';

interface HandleMultipleSelectParams {
  option: CascaderOption;
  level: number;
  hoverPath: CascaderOption[];
  selectedValues: Set<string>;
  selectedPaths: string[][];
  checkStrictly: boolean;
  emitPath: boolean;
  findOptionPath: (value: string) => CascaderOption[] | null;
}

interface HandleMultipleSelectResult {
  newSelectedValues: Set<string>;
  newSelectedPaths: string[][];
  returnValue: string[] | string[][];
  selectedOptions: CascaderOption[];
}

/**
 * 处理多选逻辑
 */
export const handleMultipleSelect = (
  params: HandleMultipleSelectParams
): HandleMultipleSelectResult => {
  const {
    option,
    level,
    hoverPath,
    selectedValues,
    selectedPaths,
    checkStrictly,
    emitPath,
    findOptionPath,
  } = params;

  if (option.disabled) {
    return {
      newSelectedValues: selectedValues,
      newSelectedPaths: selectedPaths,
      returnValue: emitPath
        ? selectedPaths
        : selectedPaths.map(p => p[p.length - 1]),
      selectedOptions: [],
    };
  }
  // 当前的路径 A>B>C
  const currentPath = [...hoverPath.slice(0, level), option];
  const pathValues = currentPath.map(p => p.value);
  const optionValue = option.value;

  const newSelectedValues = new Set(selectedValues);
  const newSelectedPaths = [...selectedPaths];

  if (checkStrictly) {
    // 父子不关联模式
    if (newSelectedValues.has(optionValue)) {
      // 已有选中，则删除
      newSelectedValues.delete(optionValue);
      const pathIndex = newSelectedPaths.findIndex(
        p => p[p.length - 1] === optionValue
      );
      if (pathIndex !== -1) {
        newSelectedPaths.splice(pathIndex, 1); // 删除路径
      }
    } else {
      newSelectedValues.add(optionValue); // 添加选中
      newSelectedPaths.push(pathValues); // 添加路径
    }
  } else {
    // 父子关联模式
    const childValues = collectChildValues(option); // 获取当前选项的所有子选项，方便取消
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

  // 根据 emitPath 返回不同格式的值
  const returnValue = emitPath
    ? newSelectedPaths
    : newSelectedPaths.map(path => path[path.length - 1]);

  const selectedOptions = Array.from(newSelectedValues)
    .map(v => {
      const path = findOptionPath(v);
      return path ? path[path.length - 1] : null;
    })
    .filter(Boolean) as CascaderOption[];

  return {
    newSelectedValues,
    newSelectedPaths,
    returnValue,
    selectedOptions,
  };
};
