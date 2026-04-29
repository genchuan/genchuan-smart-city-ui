/**
 * 时间格式化工具函数
 * 将时间戳转换为可读的日期时间格式
 */
export function formatTime(cellValue) {
  if (!cellValue) return '';

  // 如果是时间戳（数字），转换为日期时间格式
  if (typeof cellValue === 'number') {
    return new Date(cellValue)
      .toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      .replaceAll('/', '-');
  }

  // 如果已经是字符串格式，直接返回
  return cellValue;
}

/**
 * 创建时间字段的formatter
 */
export function createTimeFormatter() {
  return ({ cellValue }) => formatTime(cellValue);
}
