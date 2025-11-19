// import { findPathByValues } from '@/lib/find-path-by-values';
// import { CascaderOption } from '../cascader';

// const findOptionPath = (
//   options: CascaderOption[],
//   targetValue: string
// ): CascaderOption[] | null => {
//   function findPath(
//     opts: CascaderOption[],
//     path: CascaderOption[] = []
//   ): CascaderOption[] | null {
//     for (const opt of opts) {
//       const currentPath = [...path, opt];
//       if (opt.value === targetValue) {
//         return currentPath;
//       }
//       if (opt.children) {
//         const found = findPath(opt.children, currentPath);
//         if (found) return found;
//       }
//     }
//     return null;
//   }
//   return findPath(options);
// };

// interface SelectedPathValueProps {
//   multiple: boolean;
//   showFullPath: boolean;
//   normalizedValue: string[] | string[][];
//   setSelectedValues: (values: Set<string>) => void;
//   setSelectedPaths: (paths: string[][]) => void;
//   options: CascaderOption[];
//   setSelectedPath: (path: CascaderOption[]) => void;
// }

// export const selectedPathValue = (props: SelectedPathValueProps) => {
//   const {
//     multiple,
//     showFullPath,
//     normalizedValue,
//     options,
//     setSelectedPath,
//     setSelectedValues,
//     setSelectedPaths,
//   } = props;

//   if (multiple) {
//     // 多选模式
//     if (showFullPath) {
//       const vals = normalizedValue as string[][];
//       if (vals.length > 0) {
//         // 收集所有选中的值（仅叶子节点）
//         const flatValues = new Set<string>();
//         vals.forEach(path => {
//           // 只添加叶子节点的值
//           flatValues.add(path[path.length - 1]);
//         });
//         setSelectedValues(flatValues);
//         setSelectedPaths(vals);
//       } else {
//         setSelectedValues(new Set());
//         setSelectedPaths([]);
//       }
//     } else {
//       // 只有最后节点值
//       const vals = normalizedValue as string[];
//       if (vals.length > 0) {
//         const paths: string[][] = [];
//         const valuesSet = new Set<string>();
//         vals.forEach(val => {
//           const path = findOptionPath(options, val);
//           if (path) {
//             const pathValues = path.map(p => p.value);
//             paths.push(pathValues);
//             // 只添加叶子节点的值
//             valuesSet.add(val);
//           }
//         });
//         setSelectedPaths(paths);
//         setSelectedValues(valuesSet);
//       } else {
//         setSelectedValues(new Set());
//         setSelectedPaths([]);
//       }
//     }
//   } else {
//     // 单选模式
//     if (showFullPath) {
//       const vals = normalizedValue as string[];
//       if (vals.length > 0) {
//         const path = findPathByValues(options, vals);
//         if (path) {
//           setSelectedPath(path);
//         }
//       } else {
//         setSelectedPath([]);
//       }
//     } else {
//       // 只有最后节点值
//       const val = normalizedValue as string;
//       if (val) {
//         const path = findOptionPath(val);
//         if (path) {
//           setSelectedPath(path);
//         }
//       } else {
//         setSelectedPath([]);
//       }
//     }
//   }
// };
