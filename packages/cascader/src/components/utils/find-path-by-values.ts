import { CascaderOption } from '../cascader';

// 查找路径
export const findPathByValues = (
  opts: CascaderOption[],
  values: string[]
): CascaderOption[] | null => {
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
};
