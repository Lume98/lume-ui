import { createTsupConfig } from '../../internal/build/tsup.config.base';

/**
 * Utils 工具包构建配置
 * 使用 internal/build 中的基础配置
 *
 * utils 是纯 TypeScript 包，不包含样式，使用 tsup 更轻量
 */
export default createTsupConfig({
  entry: ['src/index.ts'],
  minify: true,
  target: 'esnext',
});
