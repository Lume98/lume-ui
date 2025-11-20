import { createViteConfig } from '../../internal/build/vite.config.base';
import { resolve } from 'path';

/**
 * Cascader 组件构建配置
 * 使用 internal/build 中的基础配置
 */
export default createViteConfig({
  name: 'Cascader',
  entry: 'src/index.ts',
  dts: true,
  viteConfig: {
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    css: {
      postcss: './postcss.config.js',
    },
  },
});
