#!/usr/bin/env node
/**
 * 构建脚本
 * 参考 Element Plus 的构建流程
 *
 * 功能：
 * 1. 清理构建产物
 * 2. 构建所有组件包
 * 3. 生成类型声明
 * 4. 验证构建结果
 */

import { execSync } from 'child_process';
import { existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { logger } from '../internal/shared/utils/logger';

interface BuildOptions {
  /**
   * 是否并行构建
   */
  parallel?: boolean;
  /**
   * 是否跳过类型检查
   */
  skipTypeCheck?: boolean;
  /**
   * 指定要构建的包
   */
  packages?: string[];
}

/**
 * 执行命令
 */
function exec(command: string, cwd?: string): void {
  try {
    execSync(command, {
      stdio: 'inherit',
      cwd: cwd || process.cwd(),
    });
  } catch (error) {
    logger.error(`Command failed: ${command}`, error as Error);
    process.exit(1);
  }
}

/**
 * 获取所有组件包
 */
function getPackages(): string[] {
  const packagesDir = join(process.cwd(), 'packages');

  if (!existsSync(packagesDir)) {
    logger.warn('packages 目录不存在');
    return [];
  }

  return readdirSync(packagesDir).filter(name => {
    const pkgPath = join(packagesDir, name);
    const stat = statSync(pkgPath);

    if (!stat.isDirectory()) return false;

    const pkgJsonPath = join(pkgPath, 'package.json');
    if (!existsSync(pkgJsonPath)) return false;

    const pkgJson = require(pkgJsonPath);
    // 跳过私有包
    return !pkgJson.private;
  });
}

/**
 * 清理构建产物
 */
function clean(): void {
  logger.info('清理构建产物...');
  exec('pnpm -r exec rm -rf dist');
  logger.success('清理完成');
}

/**
 * 类型检查
 */
function typeCheck(): void {
  logger.info('执行类型检查...');
  exec('pnpm -r type-check');
  logger.success('类型检查通过');
}

/**
 * 构建包
 */
function buildPackages(options: BuildOptions = {}): void {
  const { parallel = false, packages } = options;

  logger.group('开始构建组件包');

  const targetPackages = packages || getPackages();

  if (targetPackages.length === 0) {
    logger.warn('没有找到需要构建的包');
    return;
  }

  logger.info(`构建包: ${targetPackages.join(', ')}`);

  for (const pkg of targetPackages) {
    logger.info(`构建 @lume-ui/${pkg}...`);

    const command = parallel
      ? 'pnpm --filter @lume-ui/* build'
      : `pnpm --filter @lume-ui/${pkg} build`;

    exec(command);

    if (!parallel) {
      logger.success(`@lume-ui/${pkg} 构建完成`);
    }
  }

  if (parallel) {
    logger.success('所有包构建完成');
  }

  logger.groupEnd();
}

/**
 * 验证构建结果
 */
function validateBuild(): void {
  logger.info('验证构建结果...');

  const packages = getPackages();
  let hasError = false;

  for (const pkg of packages) {
    const distPath = join(process.cwd(), 'packages', pkg, 'dist');

    if (!existsSync(distPath)) {
      logger.error(`${pkg} 的 dist 目录不存在`);
      hasError = true;
      continue;
    }

    const requiredFiles = ['index.js', 'index.mjs', 'index.d.ts'];

    for (const file of requiredFiles) {
      const filePath = join(distPath, file);
      if (!existsSync(filePath)) {
        logger.error(`${pkg} 缺少文件: ${file}`);
        hasError = true;
      }
    }
  }

  if (hasError) {
    logger.error('构建验证失败');
    process.exit(1);
  }

  logger.success('构建验证通过');
}

/**
 * 主函数
 */
async function main(): Promise<void> {
  const startTime = Date.now();

  logger.info('🚀 开始构建 Lume UI');

  try {
    // 1. 清理
    clean();

    // 2. 类型检查
    // typeCheck() // 可选，视情况启用

    // 3. 构建
    buildPackages({
      parallel: false, // 可以改为 true 以加速构建
    });

    // 4. 验证
    validateBuild();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    logger.success(`✨ 构建完成！耗时 ${duration}s`);
  } catch (error) {
    logger.error('构建失败', error as Error);
    process.exit(1);
  }
}

// 运行
if (require.main === module) {
  main();
}

export { buildPackages, clean, typeCheck, validateBuild };
