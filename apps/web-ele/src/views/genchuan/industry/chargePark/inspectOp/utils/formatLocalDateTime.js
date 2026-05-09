import dayjs from 'dayjs';

/**
 * 使用本地时区格式化时间（避免共用 formatDate 使用 UTC 导致与东八区显示差 8 小时）
 * @param {any} value 秒/毫秒时间戳、Date、或可解析的时间字符串
 * @param {string} [format='YYYY-MM-DD HH:mm:ss']
 * @returns {string}
 */
export function formatLocalDateTime(value, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!value && value !== 0) return '';
  const text = String(value);
  const ms = /^\d{10}$/.test(text) ? Number(text) * 1000 : Number(text);
  if (Number.isFinite(ms)) {
    const local = dayjs(ms);
    return local.isValid() ? local.format(format) : text;
  }
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format(format) : text;
}
