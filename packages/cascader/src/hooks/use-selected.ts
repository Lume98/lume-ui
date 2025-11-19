import { CascaderOption } from '@/components/cascader';
import { findPathByValues } from '@/lib/find-path-by-values';
import { useCallback, useEffect, useMemo } from 'react';
import { useImmerReducer } from 'use-immer';

type State = {
  path: CascaderOption[];
  paths: string[][];
  values: Set<string>;
  hoverPath: CascaderOption[];
};
const initialState: State = {
  path: [],
  paths: [],
  values: new Set(),
  hoverPath: [],
};

type Action =
  | { type: 'updatePaths'; payload: string[][] }
  | { type: 'updateValues'; payload: Set<string> }
  | { type: 'updatePath'; payload: CascaderOption[] }
  | { type: 'updateHoverPath'; payload: CascaderOption[] };

const reducer = (draft: State, action: Action) => {
  switch (action.type) {
    case 'updatePaths':
      draft.paths = action.payload;
      break;
    case 'updateValues':
      draft.values = action.payload;
      break;
    case 'updatePath':
      draft.path = action.payload;
      break;
    case 'updateHoverPath':
      draft.hoverPath = action.payload;
      break;
  }
  return draft;
};

interface UseSelectedProps {
  options: CascaderOption[];
  multiple: boolean;
  showFullPath: boolean;
  value?: string[] | string[][] | string;
}

const useSelected = ({
  options,
  multiple,
  showFullPath,
  value,
}: UseSelectedProps) => {
  const [state, dispatch] = useImmerReducer<State, Action>(
    reducer,
    initialState
  );

  // 根据模式确定合适的默认值
  const normalizedValue = useMemo(() => {
    if (value !== undefined) return value;
    if (multiple) {
      return showFullPath ? [] : [];
    } else {
      return showFullPath ? [] : '';
    }
  }, [value, multiple, showFullPath]);

  const findOptionPath = useCallback(
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
  useEffect(() => {
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
          dispatch({ type: 'updatePaths', payload: vals });
          dispatch({ type: 'updateValues', payload: flatValues });
        } else {
          dispatch({ type: 'updatePaths', payload: [] });
          dispatch({ type: 'updateValues', payload: new Set() });
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
          dispatch({ type: 'updatePaths', payload: paths });
          dispatch({ type: 'updateValues', payload: valuesSet });
        } else {
          dispatch({ type: 'updatePaths', payload: [] });
          dispatch({ type: 'updateValues', payload: new Set() });
        }
      }
    } else {
      // 单选模式
      if (showFullPath) {
        const vals = normalizedValue as string[];
        if (vals.length > 0) {
          const path = findPathByValues(options, vals);
          if (path) {
            dispatch({ type: 'updatePath', payload: path });
          }
        } else {
          dispatch({ type: 'updatePaths', payload: [] });
        }
      } else {
        // 只有最后节点值
        const val = normalizedValue as string;
        if (val) {
          const path = findOptionPath(val);
          if (path) {
            dispatch({ type: 'updatePath', payload: path });
          }
        } else {
          dispatch({ type: 'updatePath', payload: [] });
        }
      }
    }
  }, [normalizedValue, options, multiple, showFullPath, findOptionPath]);

  return { state, dispatch, findOptionPath };
};

export default useSelected;
