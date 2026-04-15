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
  
  // 处理数组格式的日期 [2026, 4, 10]
  if (timestamp.startsWith('[') && timestamp.endsWith(']')) {
    try {
      const dateArray = JSON.parse(timestamp);
      if (Array.isArray(dateArray) && dateArray.length >= 3) {
        const year = dateArray[0];
        const month = String(dateArray[1]).padStart(2, '0');
        const day = String(dateArray[2]).padStart(2, '0');
        return `${year}-${month}-${day} 00:00:00`;
      }
    } catch (e) {
      // 解析失败，继续按原逻辑处理
    }
  }
  
  // 1. 创建 Date 对象（处理无效时间戳）
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    return '无效时间戳';
  }

  // 2. 提取年月日时分秒（补零处理：确保两位数）
  const year = date.getFullYear();
  // 月份从 0 开始，需 +1
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // 3. 拼接成目标格式
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
