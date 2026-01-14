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
