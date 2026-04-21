/**
 * 大屏日期工具函数
 * 用于计算从指定开始日期到当前日期的天数
 */

// 开始日期：2025/9/12
const START_DATE = new Date('2025-09-12');

/**
 * 计算从 2025/9/12 到当前日期的天数
 * @returns {number} 天数
 */
export function calculateRunningDays() {
  const now = new Date();
  // 重置时间部分，只比较日期
  const start = new Date(START_DATE.getFullYear(), START_DATE.getMonth(), START_DATE.getDate());
  const current = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // 计算时间差（毫秒）
  const diffTime = current - start;
  // 转换为天数
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // 如果当前日期早于开始日期，返回 0
  return diffDays > 0 ? diffDays : 0;
}

/**
 * 获取格式化的运行天数（用于显示）
 * @returns {string} 天数字符串
 */
export function getRunningDaysText() {
  return String(calculateRunningDays());
}

/**
 * 获取大屏标题天数配置对象
 * @param {string} name - 标题名称，默认为'安全运行天数：'
 * @returns {Object} 包含 name, runningDays, tail 的对象
 */
export function getRunningDaysConfig(name = '安全运行天数：') {
  return {
    name: name,
    runningDays: getRunningDaysText(),
    tail: '天',
  };
}
