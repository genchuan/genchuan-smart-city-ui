// 报表通用工具函数

// 获取昨日日期
export function getYesterdayDate() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

// 获取上个月
export function getLastMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-11

  let targetYear = year;
  let targetMonth = month;

  if (month === 0) {
    targetYear = year - 1;
    targetMonth = 11;
  } else {
    targetMonth = month - 1;
  }

  return `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}`;
}

// 格式化金额
export function formatCurrency(value, withSymbol = true) {
  if (value >= 100_000_000) {
    return `${withSymbol ? '¥' : ''}${(value / 100_000_000).toFixed(2)}亿`;
  } else if (value >= 10_000) {
    return `${withSymbol ? '¥' : ''}${(value / 10_000).toFixed(2)}万`;
  }
  return `${withSymbol ? '¥' : ''}${value.toFixed(2)}`;
}

// 格式化百分比
export function formatPercentage(value, withSymbol = true) {
  return `${value}${withSymbol ? '%' : ''}`;
}

// 获取比较样式类 - 统一使用这个函数
export function getComparisonClass(comparison, threshold = 30) {
  if (comparison > threshold) return 'comparison-positive';
  if (comparison < -threshold) return 'comparison-negative';
  return '';
}

// 获取增长率样式类
export function getGrowthClass(growth) {
  if (growth > 0) return 'growth-positive';
  if (growth < 0) return 'growth-negative';
  return '';
}

// 获取利用率颜色
export function getUtilizationColor(rate) {
  if (rate >= 80) return '#f56c6c';
  if (rate >= 60) return '#e6a23c';
  return '#67c23a';
}

// 获取比较标签类型
export function getComparisonTagType(comparison) {
  if (comparison > 0) return 'success';
  if (comparison < 0) return 'danger';
  return 'info';
}

// 获取趋势类型
export function getTrendType(trend) {
  if (trend === 'up') return 'success';
  if (trend === 'down') return 'danger';
  return 'info';
}

// 获取趋势文本
export function getTrendText(trend) {
  if (trend === 'up') return '上升趋势';
  if (trend === 'down') return '下降趋势';
  return '平稳趋势';
}

// 获取停车场类型名称
export function getParkingTypeName(type) {
  const nameMap = {
    public: '公共停车场',
    roadside: '路侧停车场',
    special: '专用停车场',
  };
  return nameMap[type] || type;
}

// 获取停车场类型标签类型
export function getParkingTypeTagType(type) {
  const typeMap = {
    public: 'primary',
    roadside: 'success',
    special: 'info',
  };
  return typeMap[type] || '';
}

// 获取指标名称
export function getIndicatorName(indicator) {
  const nameMap = {
    revenue: '收费金额',
    enterCount: '入场车次',
    utilizationRate: '泊位利用率',
    memberRevenue: '会员消费金额',
    exitCount: '出场车次',
    warningCount: '预警数',
    faultCount: '故障设备',
  };
  return nameMap[indicator] || indicator;
}

// 获取指标单位
export function getIndicatorUnit(indicator) {
  const unitMap = {
    revenue: '元',
    enterCount: '次',
    exitCount: '次',
    utilizationRate: '%',
    memberRevenue: '元',
    warningCount: '条',
    faultCount: '台',
  };
  return unitMap[indicator] || '';
}

// 获取指标颜色
export function getIndicatorColor(indicator) {
  const colorMap = {
    revenue: '#1890ff',
    enterCount: '#52c41a',
    utilizationRate: '#fa8c16',
    memberRevenue: '#722ed1',
    exitCount: '#13c2c2',
    warningCount: '#f5222d',
    faultCount: '#fa541c',
  };
  return colorMap[indicator] || '#8c8c8c';
}

// 判断是否异常
export function isAbnormal(comparison, threshold = 30) {
  return Math.abs(comparison) > threshold;
}

// 生成核心指标标签
// export function generateIndicatorTag(
//   comparison,
//   comparisonLabel = '较近7日均值',
// ) {
//   if (comparison === undefined || comparison === null) return null;
//
//   return {
//     type: comparison > 0 ? 'success' : comparison < 0 ? 'danger' : 'info',
//     icon: comparison > 0 ? 'top' : comparison < 0 ? 'bottom' : null,
//     text: `${Math.abs(comparison)}%`,
//   };
// }

// 车流报表专用工具函数

// 获取时段名称
export function getTimeRangeName(hour) {
  if (hour >= 7 && hour < 9) return '早高峰(7-9点)';
  if (hour >= 17 && hour < 19) return '晚高峰(17-19点)';
  if (hour >= 9 && hour < 17) return '日间平峰';
  return '夜间时段';
}

// 获取车型名称
export function getVehicleTypeName(type) {
  const nameMap = {
    small: '小型车',
    medium: '中型车',
    large: '大型车',
    newEnergy: '新能源汽车',
  };
  return nameMap[type] || type;
}

// 获取车型颜色
export function getVehicleTypeColor(type) {
  const colorMap = {
    small: '#1890ff',
    medium: '#52c41a',
    large: '#fa8c16',
    newEnergy: '#722ed1',
  };
  return colorMap[type] || '#8c8c8c';
}

// 获取停留时长区间名称
export function getDurationRangeName(range) {
  const nameMap = {
    within1h: '1小时内',
    within3h: '1-3小时',
    within6h: '3-6小时',
    over6h: '6小时以上',
  };
  return nameMap[range] || range;
}

// 获取停留时长区间颜色
export function getDurationRangeColor(range) {
  const colorMap = {
    within1h: '#52c41a',
    within3h: '#1890ff',
    within6h: '#fa8c16',
    over6h: '#f5222d',
  };
  return colorMap[range] || '#8c8c8c';
}

// 计算周转率
export function calculateTurnoverRate(entryCount, exitCount, parkingCount) {
  if (!parkingCount || parkingCount === 0) return 0;
  const avgCount = (entryCount + exitCount) / 2;
  return Math.round((avgCount / parkingCount) * 10_000) / 100;
}

// 获取周转率等级
export function getTurnoverRateLevel(rate) {
  if (rate >= 90) return '优秀';
  if (rate >= 80) return '良好';
  if (rate >= 70) return '一般';
  return '较低';
}

// 获取周转率颜色
export function getTurnoverRateColor(rate) {
  if (rate >= 90) return '#52c41a';
  if (rate >= 80) return '#1890ff';
  if (rate >= 70) return '#fa8c16';
  return '#f5222d';
}

// 生成热力图数据
export function generateHeatmapData(flowData, regions) {
  return flowData.reduce((result, item) => {
    const regionCode = item.regionCode || item.region;
    if (regionCode && regions[regionCode]) {
      result[regionCode] = (result[regionCode] || 0) + item.totalFlow;
    }
    return result;
  }, {});
}

// 获取高峰时段
export function getPeakHours(timeDistribution) {
  if (!timeDistribution || timeDistribution.length === 0) return '--';

  const maxIndex = timeDistribution.indexOf(Math.max(...timeDistribution));
  const startHour = maxIndex * 2;
  const endHour = startHour + 2;

  return `${startHour}:00-${endHour}:00`;
}

// 收入报表专用工具函数

// 获取支付方式名称
export function getPaymentTypeName(type) {
  const nameMap = {
    wechat: '微信支付',
    alipay: '支付宝',
    cash: '现金支付',
    card: '刷卡支付',
    member: '会员支付',
  };
  return nameMap[type] || type;
}

// 获取支付方式颜色
export function getPaymentTypeColor(type) {
  const colorMap = {
    wechat: '#07C160',
    alipay: '#1890FF',
    cash: '#FF4D4F',
    card: '#722ED1',
    member: '#13C2C2',
  };
  return colorMap[type] || '#8C8C8C';
}

// 获取收入指标名称
export function getIncomeIndicatorName(indicator) {
  const nameMap = {
    totalAmount: '总收费金额',
    orderCount: '订单总数',
    avgOrderAmount: '平均客单价',
    cashAmount: '现金收入',
    onlineAmount: '线上支付收入',
    arrearsAmount: '欠费金额',
    onlineRate: '线上支付占比',
    memberAmount: '会员消费金额',
    couponAmount: '优惠券抵扣金额',
  };
  return nameMap[indicator] || indicator;
}

// 获取收入指标单位
export function getIncomeIndicatorUnit(indicator) {
  const unitMap = {
    totalAmount: '元',
    orderCount: '笔',
    avgOrderAmount: '元',
    cashAmount: '元',
    onlineAmount: '元',
    arrearsAmount: '元',
    onlineRate: '%',
    memberAmount: '元',
    couponAmount: '元',
  };
  return unitMap[indicator] || '';
}

// 获取收入指标颜色
export function getIncomeIndicatorColor(indicator) {
  const colorMap = {
    totalAmount: '#1890FF',
    orderCount: '#52C41A',
    avgOrderAmount: '#FA8C16',
    cashAmount: '#FF4D4F',
    onlineAmount: '#722ED1',
    arrearsAmount: '#FA541C',
    onlineRate: '#13C2C2',
    memberAmount: '#2F54EB',
    couponAmount: '#F759AB',
  };
  return colorMap[indicator] || '#8C8C8C';
}

// 格式化时间范围
export function formatTimeRange(type, value) {
  if (type === 'today') return '今日';
  if (type === 'yesterday') return '昨日';
  if (type === '7') return '近7日';
  if (type === '30') return '近30日';
  if (type === 'custom') return '自定义';
  return value;
}

// 计算收入增长率
export function calculateIncomeGrowth(current, last) {
  if (!last || last === 0) return 100;
  return ((current - last) / last) * 100;
}

// 获取收入等级标签
export function getIncomeLevelLabel(amount) {
  if (amount >= 1_000_000) return '优';
  if (amount >= 500_000) return '良';
  if (amount >= 200_000) return '中';
  return '低';
}

// 获取收入等级颜色
export function getIncomeLevelColor(amount) {
  if (amount >= 1_000_000) return '#52C41A';
  if (amount >= 500_000) return '#1890FF';
  if (amount >= 200_000) return '#FA8C16';
  return '#FF4D4F';
}

// 生成月份列表
export function generateMonthList(count = 12) {
  const months = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const label = `${year}年${month}月`;
    const value = `${year}-${month}`;

    months.push({ label, value });
  }

  return months;
}

// 获取月份名称
export function getMonthName(monthStr) {
  if (!monthStr) return '';
  const [year, month] = monthStr.split('-');
  return `${year}年${Number.parseInt(month)}月`;
}

/**
 * 获取过去N天的日期
 */
export const getLastNDays = (days = 30) => {
  const dates = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
  }

  return dates;
};

/**
 * 格式化日期时间
 */
export const formatDateTime = (datetime) => {
  if (!datetime) return '';
  // 如果已经是空格分隔的格式，直接返回
  if (datetime.includes(' ')) return datetime;
  // 如果是ISO格式，转换为可读格式
  return datetime.replace('T', ' ').substr(0, 19);
};

/**
 * 生成随机车牌
 */
export const generateRandomPlate = () => {
  const provinces = ['闽A', '闽B', '闽C', '闽D', '闽E', '闽F', '闽G', '闽H', '闽J'];
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const numbers = '0123456789';

  const province = provinces[Math.floor(Math.random() * provinces.length)];
  const letter = letters[Math.floor(Math.random() * letters.length)];
  const num1 = numbers[Math.floor(Math.random() * numbers.length)];
  const num2 = numbers[Math.floor(Math.random() * numbers.length)];
  const num3 = numbers[Math.floor(Math.random() * numbers.length)];
  const num4 = numbers[Math.floor(Math.random() * numbers.length)];

  return `${province}${letter}${num1}${num2}${num3}${num4}`;
};

/**
 * 生成随机时间
 */
export const generateRandomTime = (baseDate = new Date(), offsetDays = 30) => {
  const date = new Date(baseDate);
  date.setDate(date.getDate() - Math.floor(Math.random() * offsetDays));

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(Math.floor(Math.random() * 24)).padStart(2, '0');
  const minutes = String(Math.floor(Math.random() * 60)).padStart(2, '0');
  const seconds = String(Math.floor(Math.random() * 60)).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * 生成随机数
 */
export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * 深拷贝
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
};

/**
 * 防抖函数
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * 节流函数
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * 生成颜色
 */
export const generateColors = (count) => {
  const colors = [
    '#f5222d', '#fa8c16', '#1890ff', '#52c41a', '#722ed1',
    '#13c2c2', '#eb2f96', '#faad14', '#a0d911', '#d4380d'
  ];

  if (count <= colors.length) {
    return colors.slice(0, count);
  }

  // 如果需要更多颜色，生成随机颜色
  const result = [...colors];
  for (let i = colors.length; i < count; i++) {
    const r = Math.floor(Math.random() * 200);
    const g = Math.floor(Math.random() * 200);
    const b = Math.floor(Math.random() * 200);
    result.push(`rgb(${r}, ${g}, ${b})`);
  }

  return result;
};

/**
 * 下载文件
 */
export const downloadFile = (content, filename, type = 'text/csv;charset=utf-8;') => {
  const blob = new Blob([`\uFEFF${content}`], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

/**
 * 验证表单
 */
export const validateForm = (formData, rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const value = formData[field];
    const fieldRules = rules[field];

    if (fieldRules.required && (!value || value.toString().trim() === '')) {
      errors[field] = fieldRules.message || '该字段为必填项';
    }

    if (fieldRules.pattern && value && !fieldRules.pattern.test(value)) {
      errors[field] = fieldRules.message || '格式不正确';
    }

    if (fieldRules.minLength && value && value.length < fieldRules.minLength) {
      errors[field] = fieldRules.message || `长度不能少于${fieldRules.minLength}个字符`;
    }

    if (fieldRules.maxLength && value && value.length > fieldRules.maxLength) {
      errors[field] = fieldRules.message || `长度不能超过${fieldRules.maxLength}个字符`;
    }
  });

  return errors;
};

/**
 * 生成唯一ID
 */
export const generateId = (prefix = '') => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substr(2, 5);
  return `${prefix}${timestamp}${randomStr}`.toUpperCase();
};

/**
 * 数组去重
 */
export const uniqueArray = (arr, key) => {
  if (!key) return [...new Set(arr)];

  const seen = new Set();
  return arr.filter(item => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

/**
 * 排序数组
 */
export const sortArray = (arr, key, order = 'asc') => {
  return [...arr].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return order === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return order === 'asc'
      ? aValue - bValue
      : bValue - aValue;
  });
};

/**
 * 分页数组
 */
export const paginateArray = (arr, page = 1, pageSize = 10) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, arr.length);
  return {
    data: arr.slice(startIndex, endIndex),
    total: arr.length,
    page,
    pageSize,
    pageCount: Math.ceil(arr.length / pageSize)
  };
};

/**
 * 获取文件大小
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 获取文件扩展名
 */
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
};

/**
 * 判断文件类型
 */
export const getFileType = (filename) => {
  const ext = getFileExtension(filename);
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const documentTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
  const videoTypes = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'];
  const audioTypes = ['mp3', 'wav', 'ogg', 'aac', 'flac'];

  if (imageTypes.includes(ext)) return 'image';
  if (documentTypes.includes(ext)) return 'document';
  if (videoTypes.includes(ext)) return 'video';
  if (audioTypes.includes(ext)) return 'audio';
  return 'other';
};
