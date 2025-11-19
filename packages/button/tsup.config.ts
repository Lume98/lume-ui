import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.ts', 'src/styles.css'],
  format: ['cjs', 'esm'], // 同时生成 CJS 和 ESM
  sourcemap: true,
  minify: true,
  target: 'esnext',
  outDir: 'dist',
  treeshake: true,
  external: ['react', 'react-dom'], // React 作为 peer dependency
  esbuildPlugins: [],
});
