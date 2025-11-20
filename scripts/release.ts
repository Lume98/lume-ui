#!/usr/bin/env node
/**
 * 发布脚本
 * 参考 Element Plus 的发布流程
 *
 * 功能：
 * 1. 版本检查
 * 2. 构建验证
 * 3. 发布到 npm
 * 4. 创建 Git 标签
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';
import { logger } from '../internal/shared/utils/logger';

interface ReleaseOptions {
  /**
   * 是否为 dry-run 模式
   */
  dryRun?: boolean;
  /**
   * npm tag (latest, beta, alpha, etc.)
   */
  tag?: string;
  /**
   * 是否跳过构建
   */
  skipBuild?: boolean;
  /**
   * 是否跳过 Git 检查
   */
  skipGit?: boolean;
}

/**
 * 执行命令
 */
function exec(command: string, options?: { silent?: boolean }): string {
  try {
    return execSync(command, {
      encoding: 'utf-8',
      stdio: options?.silent ? 'pipe' : 'inherit',
    });
  } catch (error) {
    logger.error(`Command failed: ${command}`, error as Error);
    process.exit(1);
  }
}

/**
 * 检查 Git 工作区状态
 */
function checkGitStatus(): void {
  logger.info('检查 Git 工作区状态...');

  const status = exec('git status --porcelain', { silent: true });

  if (status.trim()) {
    logger.error('Git 工作区不干净，请先提交或暂存更改');
    logger.info('运行以下命令查看状态：');
    logger.info('  git status');
    process.exit(1);
  }

  logger.success('Git 工作区干净');
}

/**
 * 检查当前分支
 */
function checkGitBranch(): void {
  logger.info('检查 Git 分支...');

  const branch = exec('git rev-parse --abbrev-ref HEAD', {
    silent: true,
  }).trim();

  if (branch !== 'main' && branch !== 'master') {
    logger.warn(`当前分支是 ${branch}，建议在 main/master 分支发布`);
    // 可以选择要求必须在 main 分支
    // process.exit(1)
  }

  logger.success(`当前分支: ${branch}`);
}

/**
 * 获取包版本
 */
function getPackageVersion(packageName: string): string {
  const pkgPath = join(process.cwd(), 'packages', packageName, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  return pkg.version;
}

/**
 * 检查版本是否已发布
 */
function checkVersionPublished(packageName: string, version: string): boolean {
  try {
    const result = exec(`npm view @lume-ui/${packageName}@${version} version`, {
      silent: true,
    });
    return result.trim() === version;
  } catch {
    return false;
  }
}

/**
 * 构建所有包
 */
function build(): void {
  logger.info('构建所有包...');
  exec('pnpm run build');
  logger.success('构建完成');
}

/**
 * 发布单个包
 */
function publishPackage(packageName: string, options: ReleaseOptions): void {
  const { dryRun = false, tag = 'latest' } = options;

  const version = getPackageVersion(packageName);

  logger.info(`发布 @lume-ui/${packageName}@${version}...`);

  // 检查版本是否已发布
  if (checkVersionPublished(packageName, version)) {
    logger.warn(`版本 ${version} 已发布，跳过`);
    return;
  }

  const publishCmd = [
    'npm publish',
    `--access public`,
    `--tag ${tag}`,
    dryRun ? '--dry-run' : '',
  ]
    .filter(Boolean)
    .join(' ');

  exec(`cd packages/${packageName} && ${publishCmd}`);

  if (dryRun) {
    logger.info('Dry-run 模式，未实际发布');
  } else {
    logger.success(`@lume-ui/${packageName}@${version} 发布成功`);
  }
}

/**
 * 发布所有包
 */
function publishAll(options: ReleaseOptions): void {
  logger.group('发布所有包');

  // 这里列出需要发布的包
  const packages = ['button', 'cascader', 'utils'];

  for (const pkg of packages) {
    publishPackage(pkg, options);
  }

  logger.groupEnd();
}

/**
 * 创建 Git 标签
 */
function createGitTag(version: string, options: ReleaseOptions): void {
  const { dryRun = false } = options;

  logger.info(`创建 Git 标签 v${version}...`);

  if (dryRun) {
    logger.info('Dry-run 模式，跳过创建标签');
    return;
  }

  exec(`git tag -a v${version} -m "Release v${version}"`);
  exec('git push origin --tags');

  logger.success(`Git 标签 v${version} 创建成功`);
}

/**
 * 主函数
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  const options: ReleaseOptions = {
    dryRun: args.includes('--dry-run'),
    skipBuild: args.includes('--skip-build'),
    skipGit: args.includes('--skip-git'),
    tag: args.find(arg => arg.startsWith('--tag='))?.split('=')[1] || 'latest',
  };

  logger.info('🚀 开始发布流程');

  if (options.dryRun) {
    logger.warn('Dry-run 模式，不会实际发布');
  }

  try {
    // 1. Git 检查
    if (!options.skipGit) {
      checkGitStatus();
      checkGitBranch();
    }

    // 2. 构建
    if (!options.skipBuild) {
      build();
    }

    // 3. 发布
    publishAll(options);

    // 4. 创建标签
    if (!options.skipGit) {
      const version = getPackageVersion('cascader'); // 使用主包的版本
      createGitTag(version, options);
    }

    logger.success('✨ 发布完成！');

    if (!options.dryRun) {
      logger.info('请访问以下链接查看：');
      logger.info('  https://www.npmjs.com/org/lume-ui');
    }
  } catch (error) {
    logger.error('发布失败', error as Error);
    process.exit(1);
  }
}

// 运行
if (require.main === module) {
  main();
}

export { publishPackage, publishAll };
