// 月收入报表API - 包含模拟数据
import { ElMessage } from 'element-plus';

/**
 * 模拟生成月度报表
 * @param {string} month 月份，格式：YYYY-MM
 * @returns {Promise} 模拟数据
 */
export const generateMonthlyReport = async (month) => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    success: true,
    message: `已成功生成${month}月收入报表`,
    month: month,
    generatedAt: new Date().toISOString(),
    reportUrl: `https://example.com/reports/monthly/${month}.pdf`,
  };
};

/**
 * 模拟月收入报表数据
 * @param {string} month 统计月份，格式：YYYY-MM
 * @param {string} region 区域代码：空字符串表示全部
 * @param {string} parkingType 停车场类型：空字符串表示全部
 * @param {number} page 页码
 * @param {number} pageSize 每页条数
 * @returns {Promise} 模拟数据
 */
export const getMonthlyIncomeReport = async (params) => {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 600));

  const {
    month = '2023-12',
    region = '',
    parkingType = '',
    page = 1,
    pageSize = 10
  } = params;

  // 模拟核心指标数据
  const coreIndicators = [
    {
      key: 'totalAmount',
      name: '总收费金额',
      value: 4_800_000,
      unit: '元',
      comparison: 18,
      abnormal: true,
    },
    {
      key: 'orderCount',
      name: '订单总数',
      value: 98_000,
      unit: '笔',
      comparison: 12,
      abnormal: false,
    },
    {
      key: 'avgOrderAmount',
      name: '月均客单价',
      value: 49,
      unit: '元',
      comparison: 5.4,
      abnormal: false,
    },
    {
      key: 'arrearsAmount',
      name: '欠费金额',
      value: 125_600,
      unit: '元',
      comparison: -8.2,
      abnormal: false,
    },
    {
      key: 'onlineRate',
      name: '线上支付占比',
      value: 87.5,
      unit: '%',
      comparison: 3.8,
      abnormal: false,
    },
  ];

  // 模拟趋势数据
  const trendData = {
    current: [85, 120, 150, 135, 100],
    last: [70, 105, 125, 120, 90],
  };

  // 模拟月度对比数据
  const monthlyComparison = {
    current: [4_800_000, 98_000, 4_200_000, 600_000],
    last: [4_067_796, 87_500, 3_550_000, 517_796],
    growthRate: 18,
  };

  // 模拟区域分布数据
  const regionDistribution = [
    { value: 1_680_000, name: '芗城区' },
    { value: 1_440_000, name: '龙文区' },
    { value: 960_000, name: '龙海区' },
    { value: 480_000, name: '漳浦县' },
    { value: 240_000, name: '其他区域' },
  ];

  // 模拟类型分布数据
  const typeDistribution = [
    { value: 2_640_000, name: '公共停车场' },
    { value: 1_680_000, name: '路侧停车场' },
    { value: 480_000, name: '专用停车场' },
  ];

  // 模拟完整表格数据 - 增加数据量到30条，便于分页测试
  const allTableData = [
    {
      regionName: '芗城区',
      parkingType: '公共停车场',
      parkingCount: 15,
      orderCount: 32_000,
      totalAmount: 1_440_000,
      avgOrderAmount: 45,
      cashAmount: 144_000,
      onlineAmount: 1_296_000,
      arrearsAmount: 25_000,
      onlineRate: 90,
      growthRate: 15.2,
    },
    {
      regionName: '芗城区',
      parkingType: '路侧停车场',
      parkingCount: 8,
      orderCount: 18_000,
      totalAmount: 240_000,
      avgOrderAmount: 13.33,
      cashAmount: 48_000,
      onlineAmount: 192_000,
      arrearsAmount: 8_000,
      onlineRate: 80,
      growthRate: 25.6,
    },
    {
      regionName: '龙文区',
      parkingType: '公共停车场',
      parkingCount: 12,
      orderCount: 28_000,
      totalAmount: 1_120_000,
      avgOrderAmount: 40,
      cashAmount: 112_000,
      onlineAmount: 1_008_000,
      arrearsAmount: 32_000,
      onlineRate: 90,
      growthRate: 12.8,
    },
    {
      regionName: '龙文区',
      parkingType: '专用停车场',
      parkingCount: 5,
      orderCount: 8_000,
      totalAmount: 320_000,
      avgOrderAmount: 40,
      cashAmount: 64_000,
      onlineAmount: 256_000,
      arrearsAmount: 12_000,
      onlineRate: 80,
      growthRate: 8.5,
    },
    {
      regionName: '龙海区',
      parkingType: '公共停车场',
      parkingCount: 10,
      orderCount: 24_000,
      totalAmount: 960_000,
      avgOrderAmount: 40,
      cashAmount: 96_000,
      onlineAmount: 864_000,
      arrearsAmount: 28_000,
      onlineRate: 90,
      growthRate: 18.3,
    },
    {
      regionName: '漳浦县',
      parkingType: '公共停车场',
      parkingCount: 6,
      orderCount: 12_000,
      totalAmount: 480_000,
      avgOrderAmount: 40,
      cashAmount: 96_000,
      onlineAmount: 384_000,
      arrearsAmount: 20_000,
      onlineRate: 80,
      growthRate: 10.5,
    },
    {
      regionName: '芗城区',
      parkingType: '公共停车场',
      parkingCount: 3,
      orderCount: 6_500,
      totalAmount: 312_000,
      avgOrderAmount: 48,
      cashAmount: 31_200,
      onlineAmount: 280_800,
      arrearsAmount: 5_000,
      onlineRate: 90,
      growthRate: 14.7,
    },
    {
      regionName: '龙文区',
      parkingType: '路侧停车场',
      parkingCount: 6,
      orderCount: 14_000,
      totalAmount: 210_000,
      avgOrderAmount: 15,
      cashAmount: 42_000,
      onlineAmount: 168_000,
      arrearsAmount: 6_000,
      onlineRate: 80,
      growthRate: 22.4,
    },
    {
      regionName: '龙海区',
      parkingType: '路侧停车场',
      parkingCount: 7,
      orderCount: 16_500,
      totalAmount: 247_500,
      avgOrderAmount: 15,
      cashAmount: 49_500,
      onlineAmount: 198_000,
      arrearsAmount: 7_500,
      onlineRate: 80,
      growthRate: 19.8,
    },
    {
      regionName: '漳浦县',
      parkingType: '路侧停车场',
      parkingCount: 4,
      orderCount: 9_000,
      totalAmount: 135_000,
      avgOrderAmount: 15,
      cashAmount: 27_000,
      onlineAmount: 108_000,
      arrearsAmount: 4_000,
      onlineRate: 80,
      growthRate: 11.2,
    },
    {
      regionName: '其他区域',
      parkingType: '公共停车场',
      parkingCount: 8,
      orderCount: 19_200,
      totalAmount: 768_000,
      avgOrderAmount: 40,
      cashAmount: 76_800,
      onlineAmount: 691_200,
      arrearsAmount: 24_000,
      onlineRate: 90,
      growthRate: 9.3,
    },
    {
      regionName: '其他区域',
      parkingType: '专用停车场',
      parkingCount: 3,
      orderCount: 5_500,
      totalAmount: 220_000,
      avgOrderAmount: 40,
      cashAmount: 44_000,
      onlineAmount: 176_000,
      arrearsAmount: 8_500,
      onlineRate: 80,
      growthRate: 7.8,
    },
    // 额外数据用于分页测试
    {
      regionName: '芗城区',
      parkingType: '公共停车场',
      parkingCount: 4,
      orderCount: 8_500,
      totalAmount: 425_000,
      avgOrderAmount: 50,
      cashAmount: 42_500,
      onlineAmount: 382_500,
      arrearsAmount: 6_500,
      onlineRate: 90,
      growthRate: 12.3,
    },
    {
      regionName: '龙文区',
      parkingType: '公共停车场',
      parkingCount: 7,
      orderCount: 16_000,
      totalAmount: 720_000,
      avgOrderAmount: 45,
      cashAmount: 72_000,
      onlineAmount: 648_000,
      arrearsAmount: 18_000,
      onlineRate: 90,
      growthRate: 14.5,
    },
    {
      regionName: '龙海区',
      parkingType: '专用停车场',
      parkingCount: 3,
      orderCount: 6_000,
      totalAmount: 270_000,
      avgOrderAmount: 45,
      cashAmount: 54_000,
      onlineAmount: 216_000,
      arrearsAmount: 9_000,
      onlineRate: 80,
      growthRate: 8.7,
    },
    {
      regionName: '漳浦县',
      parkingType: '专用停车场',
      parkingCount: 2,
      orderCount: 4_500,
      totalAmount: 202_500,
      avgOrderAmount: 45,
      cashAmount: 40_500,
      onlineAmount: 162_000,
      arrearsAmount: 7_500,
      onlineRate: 80,
      growthRate: 6.9,
    },
    {
      regionName: '芗城区',
      parkingType: '路侧停车场',
      parkingCount: 9,
      orderCount: 20_000,
      totalAmount: 300_000,
      avgOrderAmount: 15,
      cashAmount: 60_000,
      onlineAmount: 240_000,
      arrearsAmount: 9_500,
      onlineRate: 80,
      growthRate: 28.3,
    },
    {
      regionName: '龙文区',
      parkingType: '路侧停车场',
      parkingCount: 8,
      orderCount: 18_500,
      totalAmount: 277_500,
      avgOrderAmount: 15,
      cashAmount: 55_500,
      onlineAmount: 222_000,
      arrearsAmount: 8_200,
      onlineRate: 80,
      growthRate: 24.1,
    },
    {
      regionName: '龙海区',
      parkingType: '路侧停车场',
      parkingCount: 9,
      orderCount: 20_000,
      totalAmount: 300_000,
      avgOrderAmount: 15,
      cashAmount: 60_000,
      onlineAmount: 240_000,
      arrearsAmount: 11_000,
      onlineRate: 80,
      growthRate: 21.5,
    },
    {
      regionName: '漳浦县',
      parkingType: '路侧停车场',
      parkingCount: 5,
      orderCount: 11_000,
      totalAmount: 165_000,
      avgOrderAmount: 15,
      cashAmount: 33_000,
      onlineAmount: 132_000,
      arrearsAmount: 6_000,
      onlineRate: 80,
      growthRate: 13.8,
    },
    {
      regionName: '其他区域',
      parkingType: '路侧停车场',
      parkingCount: 6,
      orderCount: 13_500,
      totalAmount: 202_500,
      avgOrderAmount: 15,
      cashAmount: 40_500,
      onlineAmount: 162_000,
      arrearsAmount: 8_800,
      onlineRate: 80,
      growthRate: 10.2,
    },
    {
      regionName: '芗城区',
      parkingType: '专用停车场',
      parkingCount: 2,
      orderCount: 4_000,
      totalAmount: 180_000,
      avgOrderAmount: 45,
      cashAmount: 36_000,
      onlineAmount: 144_000,
      arrearsAmount: 5_500,
      onlineRate: 80,
      growthRate: 7.2,
    },
    {
      regionName: '龙文区',
      parkingType: '专用停车场',
      parkingCount: 3,
      orderCount: 7_000,
      totalAmount: 315_000,
      avgOrderAmount: 45,
      cashAmount: 63_000,
      onlineAmount: 252_000,
      arrearsAmount: 9_500,
      onlineRate: 80,
      growthRate: 9.8,
    },
    {
      regionName: '龙海区',
      parkingType: '公共停车场',
      parkingCount: 11,
      orderCount: 26_000,
      totalAmount: 1_040_000,
      avgOrderAmount: 40,
      cashAmount: 104_000,
      onlineAmount: 936_000,
      arrearsAmount: 30_000,
      onlineRate: 90,
      growthRate: 19.2,
    },
    {
      regionName: '漳浦县',
      parkingType: '公共停车场',
      parkingCount: 7,
      orderCount: 14_000,
      totalAmount: 560_000,
      avgOrderAmount: 40,
      cashAmount: 112_000,
      onlineAmount: 448_000,
      arrearsAmount: 22_000,
      onlineRate: 80,
      growthRate: 12.4,
    },
    {
      regionName: '其他区域',
      parkingType: '公共停车场',
      parkingCount: 9,
      orderCount: 21_600,
      totalAmount: 864_000,
      avgOrderAmount: 40,
      cashAmount: 86_400,
      onlineAmount: 777_600,
      arrearsAmount: 28_000,
      onlineRate: 90,
      growthRate: 10.5,
    },
    {
      regionName: '其他区域',
      parkingType: '专用停车场',
      parkingCount: 4,
      orderCount: 7_000,
      totalAmount: 280_000,
      avgOrderAmount: 40,
      cashAmount: 56_000,
      onlineAmount: 224_000,
      arrearsAmount: 9_800,
      onlineRate: 80,
      growthRate: 8.6,
    },
    {
      regionName: '芗城区',
      parkingType: '公共停车场',
      parkingCount: 6,
      orderCount: 14_000,
      totalAmount: 630_000,
      avgOrderAmount: 45,
      cashAmount: 63_000,
      onlineAmount: 567_000,
      arrearsAmount: 12_000,
      onlineRate: 90,
      growthRate: 13.8,
    },
    {
      regionName: '龙文区',
      parkingType: '公共停车场',
      parkingCount: 8,
      orderCount: 18_000,
      totalAmount: 810_000,
      avgOrderAmount: 45,
      cashAmount: 81_000,
      onlineAmount: 729_000,
      arrearsAmount: 20_000,
      onlineRate: 90,
      growthRate: 15.6,
    },
    {
      regionName: '龙海区',
      parkingType: '专用停车场',
      parkingCount: 4,
      orderCount: 8_000,
      totalAmount: 360_000,
      avgOrderAmount: 45,
      cashAmount: 72_000,
      onlineAmount: 288_000,
      arrearsAmount: 11_500,
      onlineRate: 80,
      growthRate: 9.3,
    },
    {
      regionName: '漳浦县',
      parkingType: '专用停车场',
      parkingCount: 3,
      orderCount: 6_500,
      totalAmount: 292_500,
      avgOrderAmount: 45,
      cashAmount: 58_500,
      onlineAmount: 234_000,
      arrearsAmount: 8_800,
      onlineRate: 80,
      growthRate: 7.5,
    },
  ];

  // 根据筛选条件过滤数据
  let filteredData = [...allTableData];

  // 区域筛选
  if (region) {
    const regionMap = {
      'xiangcheng': '芗城区',
      'longwen': '龙文区',
      'longhai': '龙海区',
      'zhangpu': '漳浦县',
    };
    const targetRegion = regionMap[region] || region;
    filteredData = filteredData.filter(item => item.regionName === targetRegion);
  }

  // 停车场类型筛选
  if (parkingType) {
    const typeMap = {
      'public': '公共停车场',
      'roadside': '路侧停车场',
      'special': '专用停车场',
    };
    const targetType = typeMap[parkingType] || parkingType;
    filteredData = filteredData.filter(item => item.parkingType === targetType);
  }

  // 分页处理 - 修复分页参数
  const total = filteredData.length;
  const actualPage = page || 1;
  const actualPageSize = pageSize || 10;
  const startIndex = (actualPage - 1) * actualPageSize;
  const endIndex = Math.min(startIndex + actualPageSize, total);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return {
    month,
    region,
    parkingType,
    coreIndicators,
    trendData,
    monthlyComparison,
    regionDistribution,
    typeDistribution,
    tableData: paginatedData,
    total: total,
    page: actualPage,
    pageSize: actualPageSize,
    generatedAt: new Date().toISOString(),
  };
};

/**
 * 生成月收入报表CSV文件
 * @param {object} params 导出参数
 * @returns {Promise} 模拟导出
 */
export const exportMonthlyIncomeReport = async (params) => {
  try {
    const data = await getMonthlyIncomeReport({
      ...params,
      page: 1,
      pageSize: 10000,
    });

    // 生成CSV内容
    const headers = [
      '行政区划',
      '停车场类型',
      '停车场数',
      '订单总数',
      '总收费金额(元)',
      '月均客单价(元)',
      '现金收入(元)',
      '线上收入(元)',
      '欠费金额(元)',
      '线上占比(%)',
      '环比增长(%)',
    ];

    const csvRows = data.tableData.map((item) => [
      item.regionName,
      item.parkingType,
      item.parkingCount,
      item.orderCount,
      item.totalAmount,
      item.avgOrderAmount,
      item.cashAmount,
      item.onlineAmount,
      item.arrearsAmount,
      item.onlineRate,
      item.growthRate,
    ]);

    const csvContent = [
      headers.join(','),
      ...csvRows.map((row) => row.join(',')),
    ].join('\n');

    // 创建Blob并下载
    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `月收入报表_${params.month || '当前月'}.csv`;

    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    ElMessage.success('导出成功（CSV格式）');

    return {
      success: true,
      message: '导出成功',
      filename: link.download,
      data,
      exportTime: new Date().toISOString(),
    };
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error(`导出失败: ${error.message}`);
    throw error;
  }
};

/**
 * 获取可用的月份列表
 * @returns {Promise} 月份列表
 */
export const getMonthList = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const months = [];
  const now = new Date();

  // 生成最近12个月的列表
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const label = `${year}年${month}月`;
    const value = `${year}-${month}`;

    months.push({ label, value });
  }

  return {
    data: months,
    success: true,
  };
};

/**
 * 获取区域列表
 * @returns {Promise} 区域列表
 */
export const getRegionList = async () => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const regions = [
    { value: '', label: '全部区域' },
    { value: 'xiangcheng', label: '芗城区' },
    { value: 'longwen', label: '龙文区' },
    { value: 'longhai', label: '龙海区' },
    { value: 'zhangpu', label: '漳浦县' },
    { value: 'other', label: '其他区域' },
  ];

  return {
    data: regions,
    success: true,
  };
};

/**
 * 获取停车场类型列表
 * @returns {Promise} 类型列表
 */
export const getParkingTypeList = async () => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const types = [
    { value: '', label: '全部类型' },
    { value: 'public', label: '公共停车场' },
    { value: 'roadside', label: '路侧停车场' },
    { value: 'special', label: '专用停车场' },
  ];

  return {
    data: types,
    success: true,
  };
};

/**
 * 获取月收入趋势分析数据
 * @param {string} month 统计月份
 * @param {string} region 区域
 * @returns {Promise} 趋势分析数据
 */
export const getMonthlyTrendAnalysis = async (params) => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const { month = '2023-12', region = '' } = params;

  // 模拟日趋势数据
  const dailyTrend = [];
  const monthDays = 30;

  for (let i = 1; i <= monthDays; i++) {
    const day = String(i).padStart(2, '0');
    const date = `${month}-${day}`;
    const revenue = 80000 + Math.random() * 40000;

    dailyTrend.push({
      date,
      revenue: Math.round(revenue),
      orderCount: Math.round(1600 + Math.random() * 800),
      onlineRate: 85 + Math.random() * 10,
    });
  }

  // 模拟周趋势数据
  const weeklyTrend = [
    { week: '第1周', revenue: 850000, orderCount: 17000, avgAmount: 50 },
    { week: '第2周', revenue: 1200000, orderCount: 24000, avgAmount: 50 },
    { week: '第3周', revenue: 1500000, orderCount: 30000, avgAmount: 50 },
    { week: '第4周', revenue: 1350000, orderCount: 27000, avgAmount: 50 },
  ];

  return {
    month,
    region,
    dailyTrend,
    weeklyTrend,
    generatedAt: new Date().toISOString(),
  };
};

/**
 * 获取月收入异常监控数据
 * @param {string} month 统计月份
 * @returns {Promise} 异常监控数据
 */
export const getMonthlyAbnormalData = async (month = '2023-12') => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 模拟异常数据
  const abnormalItems = [
    {
      id: 1,
      type: 'revenue',
      name: '总收费金额',
      currentValue: 4800000,
      lastMonthValue: 4067796,
      comparison: 18,
      threshold: 15,
      isAbnormal: true,
      description: '本月收入较上月增长18%，超过15%的预警阈值',
      suggestion: '检查是否有新增停车场或促销活动',
    },
    {
      id: 2,
      type: 'arrears',
      name: '欠费金额',
      currentValue: 125600,
      lastMonthValue: 136800,
      comparison: -8.2,
      threshold: -10,
      isAbnormal: false,
      description: '本月欠费金额下降8.2%，在正常范围内',
      suggestion: '继续保持催缴力度',
    },
    {
      id: 3,
      type: 'onlineRate',
      name: '线上支付占比',
      currentValue: 87.5,
      lastMonthValue: 83.7,
      comparison: 4.5,
      threshold: 5,
      isAbnormal: false,
      description: '线上支付占比提升4.5%，接近5%的预警阈值',
      suggestion: '关注现金支付用户转化情况',
    },
  ];

  // 模拟异常停车场
  const abnormalParkings = [
    {
      parkingName: '芗城区政府路侧停车场',
      region: '芗城区',
      type: '路侧停车场',
      indicator: '收入增长率',
      currentValue: 45.6,
      avgValue: 18.2,
      deviation: 150,
      reason: '附近商业区促销活动',
      status: 'warning',
    },
    {
      parkingName: '龙文区体育中心停车场',
      region: '龙文区',
      type: '公共停车场',
      indicator: '线上支付占比',
      currentValue: 75.2,
      avgValue: 90.3,
      deviation: -16.7,
      reason: '设备故障影响线上支付',
      status: 'error',
    },
  ];

  return {
    month,
    abnormalItems,
    abnormalParkings,
    totalAbnormalCount: 2,
    warningCount: 1,
    errorCount: 1,
    generatedAt: new Date().toISOString(),
  };
};

/**
 * 获取月收入预测数据
 * @param {string} month 统计月份
 * @returns {Promise} 预测数据
 */
export const getMonthlyForecast = async (month = '2023-12') => {
  await new Promise((resolve) => setTimeout(resolve, 700));

  // 模拟预测数据
  const forecastData = {
    currentMonth: {
      actual: 4800000,
      forecast: 4650000,
      accuracy: 96.8,
    },
    nextMonth: {
      forecast: 5200000,
      growthRate: 8.3,
      confidence: 85,
    },
    quarterly: {
      forecast: 15000000,
      growthRate: 12.5,
      confidence: 78,
    },
  };

  // 模拟影响因素
  const factors = [
    {
      name: '节假日因素',
      impact: 'positive',
      strength: 'high',
      description: '元旦假期将带来客流增长',
      estimatedImpact: '+8%',
    },
    {
      name: '天气因素',
      impact: 'negative',
      strength: 'medium',
      description: '预计下月有连续降雨天气',
      estimatedImpact: '-3%',
    },
    {
      name: '新停车场',
      impact: 'positive',
      strength: 'high',
      description: '2个新建停车场将投入使用',
      estimatedImpact: '+5%',
    },
  ];

  return {
    month,
    forecastData,
    factors,
    generatedAt: new Date().toISOString(),
  };
};

/**
 * 获取月收入对比分析数据
 * @param {string} month 本月月份
 * @param {string} compareMonth 对比月份
 * @returns {Promise} 对比分析数据
 */
export const getMonthlyComparison = async (params) => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const { month = '2023-12', compareMonth = '2023-11' } = params;

  // 模拟对比数据
  const comparisonData = {
    currentMonth: {
      totalAmount: 4800000,
      orderCount: 98000,
      avgAmount: 49,
      onlineRate: 87.5,
      cashAmount: 600000,
      onlineAmount: 4200000,
    },
    compareMonth: {
      totalAmount: 4067796,
      orderCount: 87500,
      avgAmount: 46.5,
      onlineRate: 83.7,
      cashAmount: 517796,
      onlineAmount: 3550000,
    },
    growth: {
      totalAmount: 18.0,
      orderCount: 12.0,
      avgAmount: 5.4,
      onlineRate: 4.5,
      cashAmount: 15.9,
      onlineAmount: 18.3,
    },
  };

  // 模拟增长贡献度
  const growthContribution = [
    { region: '芗城区', contribution: 35.2, growth: 20.5 },
    { region: '龙文区', contribution: 28.6, growth: 15.8 },
    { region: '龙海区', contribution: 19.1, growth: 18.3 },
    { region: '漳浦县', contribution: 10.0, growth: 10.5 },
    { region: '其他', contribution: 7.1, growth: 8.2 },
  ];

  // 模拟类型贡献度
  const typeContribution = [
    { type: '公共停车场', contribution: 55.0, growth: 16.8 },
    { type: '路侧停车场', contribution: 35.0, growth: 22.4 },
    { type: '专用停车场', contribution: 10.0, growth: 8.5 },
  ];

  return {
    month,
    compareMonth,
    comparisonData,
    growthContribution,
    typeContribution,
    generatedAt: new Date().toISOString(),
  };
};
