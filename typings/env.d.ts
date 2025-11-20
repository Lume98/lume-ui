/**
 * 环境变量类型定义
 * 参考 Element Plus 的 typings 目录
 */

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NODE_ENV: 'development' | 'production' | 'test';
  readonly PUBLIC_URL: string;
  // 添加其他环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
