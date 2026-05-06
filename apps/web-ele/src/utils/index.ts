import type { Recordable } from '@vben/types';

export * from './rangePickerProps';
export * from './routerHelper';

/**
 * 查找数组对象的某个下标
 * @param {Array} ary 查找的数组
 * @param {Function} fn 判断的方法
 */
type Fn<T = any> = (item: T, index: number, array: Array<T>) => boolean;

export const findIndex = <T = Recordable<any>>(
  ary: Array<T>,
  fn: Fn<T>,
): number => {
  if (ary.findIndex) {
    return ary.findIndex((item, index, array) => fn(item, index, array));
  }
  let index = -1;
  ary.some((item: T, i: number, ary: Array<T>) => {
    const ret: boolean = fn(item, i, ary);
    if (ret) {
      index = i;
      return true;
    }
    return false;
  });
  return index;
};
/**
 * 毫秒时间戳转换为 YYYY-MM-DD HH:mm:ss 格式
 * @param {number} timestamp - 毫秒级时间戳（如 1768442344000）
 * @returns {string} 格式化后的日期字符串
 */
export function formatTimestamp(timestamp:string) {
  if(!timestamp) {return '--'}
  // 1. 创建 Date 对象（处理无效时间戳）
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    return '无效时间戳';
  }

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  // 3. 拼接成目标格式
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
