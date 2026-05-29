/**
 * 时间格式化工具函数
 * 将时间戳转换为可读的日期时间格式
 */
export function formatTime(cellValue) {
  if (!cellValue) return '';

  let date;

  // 如果是时间戳（数字），转换为Date对象
  if (typeof cellValue === 'number') {
    date = new Date(cellValue);
  }
  // 如果是字符串格式，尝试解析为Date对象
  else if (typeof cellValue === 'string') {
    date = new Date(cellValue);
    // 如果解析失败，直接返回原字符串
    if (isNaN(date.getTime())) {
      return cellValue;
    }
  }
  // 如果已经是Date对象
  else if (cellValue instanceof Date) {
    date = cellValue;
  }
  // 其他类型直接返回
  else {
    return cellValue;
  }

  // 格式化为 YYYY-MM-DD HH:mm:ss
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 创建时间字段的formatter
 */
export function createTimeFormatter() {
  return ({ cellValue }) => formatTime(cellValue);
}

/**
 * 只显示日期的formatter
 */
export function createDateFormatter() {
  return ({ cellValue }) => {
    if (!cellValue) return '';

    let date;
    if (typeof cellValue === 'number') {
      date = new Date(cellValue);
    } else if (typeof cellValue === 'string') {
      date = new Date(cellValue);
      if (isNaN(date.getTime())) {
        return cellValue;
      }
    } else if (cellValue instanceof Date) {
      date = cellValue;
    } else {
      return cellValue;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };
}
