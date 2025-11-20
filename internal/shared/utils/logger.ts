/**
 * 日志工具
 * 参考 Element Plus 的日志系统
 */

type LogLevel = 'info' | 'warn' | 'error' | 'success';

const colors = {
  info: '\x1b[36m', // cyan
  warn: '\x1b[33m', // yellow
  error: '\x1b[31m', // red
  success: '\x1b[32m', // green
  reset: '\x1b[0m',
};

/**
 * 格式化日志消息
 */
function formatMessage(level: LogLevel, message: string): string {
  const timestamp = new Date().toLocaleTimeString();
  const color = colors[level];
  const levelText = `[${level.toUpperCase()}]`.padEnd(8);

  return `${color}${timestamp} ${levelText}${colors.reset} ${message}`;
}

/**
 * 日志记录器
 */
export const logger = {
  /**
   * 普通信息
   */
  info(message: string): void {
    console.log(formatMessage('info', message));
  },

  /**
   * 警告信息
   */
  warn(message: string): void {
    console.warn(formatMessage('warn', message));
  },

  /**
   * 错误信息
   */
  error(message: string, error?: Error): void {
    console.error(formatMessage('error', message));
    if (error) {
      console.error(error);
    }
  },

  /**
   * 成功信息
   */
  success(message: string): void {
    console.log(formatMessage('success', message));
  },

  /**
   * 分组日志开始
   */
  group(title: string): void {
    console.group(formatMessage('info', title));
  },

  /**
   * 分组日志结束
   */
  groupEnd(): void {
    console.groupEnd();
  },
};
