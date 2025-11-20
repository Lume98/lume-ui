import { createViteConfig } from '../../internal/build/vite.config.base';
import { resolve } from 'path';

/**
 * Button 组件构建配置
 * 从 tsup 迁移到 Vite 以统一构建工具
 * 使用 internal/build 中的基础配置
 */
export default createViteConfig({
  name: 'Button',
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
