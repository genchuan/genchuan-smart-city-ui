// 月收入报表API - 包含模拟数据
import { ElMessage } from 'element-plus';

// 区域映射关系
const regionMap = {
  'xiangcheng': '芗城区',
  'longwen': '龙文区',
  'longhai': '龙海区',
  'zhangpu': '漳浦县',
  'yunxiao': '云霄县',
  'zhaoan': '诏安县',
  'dongshan': '东山县',
  'nanjing': '南靖县',
  'pinghe': '平和县',
  'huaan': '华安县',
  'other': '其他区域'
};

// 停车场类型映射关系
const parkingTypeMap = {
  'public': '公共停车场',
  'roadside': '路侧停车场',
  'special': '专用停车场'
};

// 辅助函数：根据筛选条件计算核心指标
function calculateCoreIndicators(filteredData, month) {
  if (filteredData.length === 0) {
    return [
      {
        key: 'totalAmount',
        name: '总收费金额',
        value: 0,
        unit: '元',
        comparison: 0,
      },
      {
        key: 'orderCount',
        name: '订单总数',
        value: 0,
        unit: '笔',
        comparison: 0,
      },
      {
        key: 'avgOrderAmount',
        name: '月均客单价',
        value: 0,
        unit: '元',
        comparison: 0,
      },
      {
        key: 'arrearsAmount',
        name: '欠费金额',
        value: 0,
        unit: '元',
        comparison: 0,
      },
      {
        key: 'onlineRate',
        name: '线上支付占比',
        value: 0,
        unit: '%',
        comparison: 0,
      },
    ];
  }

  const totalAmount = filteredData.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalOrders = filteredData.reduce((sum, item) => sum + item.orderCount, 0);
  const arrearsAmount = filteredData.reduce((sum, item) => sum + item.arrearsAmount, 0);
  const onlineAmount = filteredData.reduce((sum, item) => sum + item.onlineAmount, 0);
  const onlineRate = totalAmount > 0 ? Math.round((onlineAmount / totalAmount) * 100 * 10) / 10 : 0;
  const avgOrderAmount = totalOrders > 0 ? Math.round(totalAmount / totalOrders * 100) / 100 : 0;

  // 模拟比较值，实际应该从历史数据计算
  const comparisonValues = {
    '2023-12': [18, 12, 5.4, -8.2, 3.8],
    '2023-11': [15, 10, 4.2, -6.5, 2.5],
    '2023-10': [10, 8, 3.1, -5.0, 1.8],
  };

  const comparisons = comparisonValues[month] || [0, 0, 0, 0, 0];

  return [
    {
      key: 'totalAmount',
      name: '总收费金额',
      value: totalAmount,
      unit: '元',
      comparison: comparisons[0],
    },
    {
      key: 'orderCount',
      name: '订单总数',
      value: totalOrders,
      unit: '笔',
      comparison: comparisons[1],
    },
    {
      key: 'avgOrderAmount',
      name: '月均客单价',
      value: avgOrderAmount,
      unit: '元',
      comparison: comparisons[2],
    },
    {
      key: 'arrearsAmount',
      name: '欠费金额',
      value: arrearsAmount,
      unit: '元',
      comparison: comparisons[3],
    },
    {
      key: 'onlineRate',
      name: '线上支付占比',
      value: onlineRate,
      unit: '%',
      comparison: comparisons[4],
    },
  ];
}

// 辅助函数：计算区域分布
function calculateRegionDistribution(data) {
  const regionDistribution = {};

  data.forEach(item => {
    if (!regionDistribution[item.regionName]) {
      regionDistribution[item.regionName] = {
        value: 0,
        name: item.regionName
      };
    }
    regionDistribution[item.regionName].value += item.totalAmount;
  });

  return Object.values(regionDistribution).sort((a, b) => b.value - a.value);
}

// 辅助函数：计算类型分布
function calculateTypeDistribution(data) {
  const typeDistribution = {};

  data.forEach(item => {
    if (!typeDistribution[item.parkingType]) {
      typeDistribution[item.parkingType] = {
        value: 0,
        name: item.parkingType
      };
    }
    typeDistribution[item.parkingType].value += item.totalAmount;
  });

  return Object.values(typeDistribution).sort((a, b) => b.value - a.value);
}

// 辅助函数：计算月度对比数据
function calculateMonthlyComparison(filteredData, month) {
  const totalAmount = filteredData.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalOrders = filteredData.reduce((sum, item) => sum + item.orderCount, 0);
  const onlineAmount = filteredData.reduce((sum, item) => sum + item.onlineAmount, 0);
  const cashAmount = filteredData.reduce((sum, item) => sum + item.cashAmount, 0);

  // 如果有筛选条件，重新计算比例
  const lastMonthFactor = 0.85; // 假设上月数据是当月的85%

  return {
    current: [totalAmount, totalOrders, onlineAmount, cashAmount],
    last: [
      Math.round(totalAmount * lastMonthFactor),
      Math.round(totalOrders * lastMonthFactor),
      Math.round(onlineAmount * lastMonthFactor),
      Math.round(cashAmount * lastMonthFactor)
    ],
    growthRate: Math.round((totalAmount - (totalAmount * lastMonthFactor)) / (totalAmount * lastMonthFactor) * 1000) / 10,
  };
}

// 辅助函数：计算趋势数据
function calculateTrendData(filteredData) {
  // 简单模拟趋势数据，按周分组
  const totalAmount = filteredData.reduce((sum, item) => sum + item.totalAmount, 0);
  const avgWeekly = totalAmount / 4; // 假设平均分配到4周

  const base = [0.85, 1.2, 1.5, 1.35, 1.0]; // 周权重分布

  return {
    current: base.map(value => Math.round(avgWeekly * value / 10000)), // 转换为万元
    last: base.map(value => Math.round(avgWeekly * value * 0.85 / 10000)), // 上月数据
  };
}

// 生成完整表格数据
function generateMonthlyTableData() {
  return [
    {
      regionName: '芗城区',
      parkingType: '公共停车场',
      parkingCount: 15,
      orderCount: 32000,
      totalAmount: 1440000,
      avgOrderAmount: 45,
      cashAmount: 144000,
      onlineAmount: 1296000,
      arrearsAmount: 25000,
      onlineRate: 90,
      growthRate: 15.2,
    },
    {
      regionName: '芗城区',
      parkingType: '路侧停车场',
      parkingCount: 8,
      orderCount: 18000,
      totalAmount: 240000,
      avgOrderAmount: 13.33,
      cashAmount: 48000,
      onlineAmount: 192000,
      arrearsAmount: 8000,
      onlineRate: 80,
      growthRate: 25.6,
    },
    {
      regionName: '龙文区',
      parkingType: '公共停车场',
      parkingCount: 12,
      orderCount: 28000,
      totalAmount: 1120000,
      avgOrderAmount: 40,
      cashAmount: 112000,
      onlineAmount: 1008000,
      arrearsAmount: 32000,
      onlineRate: 90,
      growthRate: 12.8,
    },
    {
      regionName: '龙文区',
      parkingType: '专用停车场',
      parkingCount: 5,
      orderCount: 8000,
      totalAmount: 320000,
      avgOrderAmount: 40,
      cashAmount: 64000,
      onlineAmount: 256000,
      arrearsAmount: 12000,
      onlineRate: 80,
      growthRate: 8.5,
    },
    {
      regionName: '龙海区',
      parkingType: '公共停车场',
      parkingCount: 10,
      orderCount: 24000,
      totalAmount: 960000,
      avgOrderAmount: 40,
      cashAmount: 96000,
      onlineAmount: 864000,
      arrearsAmount: 28000,
      onlineRate: 90,
      growthRate: 18.3,
    },
    {
      regionName: '漳浦县',
      parkingType: '公共停车场',
      parkingCount: 6,
      orderCount: 12000,
      totalAmount: 480000,
      avgOrderAmount: 40,
      cashAmount: 96000,
      onlineAmount: 384000,
      arrearsAmount: 20000,
      onlineRate: 80,
      growthRate: 10.5,
    },
    {
      regionName: '云霄县',
      parkingType: '公共停车场',
      parkingCount: 5,
      orderCount: 9500,
      totalAmount: 380000,
      avgOrderAmount: 40,
      cashAmount: 76000,
      onlineAmount: 304000,
      arrearsAmount: 18000,
      onlineRate: 80,
      growthRate: 9.2,
    },
    {
      regionName: '诏安县',
      parkingType: '公共停车场',
      parkingCount: 4,
      orderCount: 8000,
      totalAmount: 320000,
      avgOrderAmount: 40,
      cashAmount: 64000,
      onlineAmount: 256000,
      arrearsAmount: 15000,
      onlineRate: 80,
      growthRate: 8.7,
    },
    {
      regionName: '东山县',
      parkingType: '专用停车场',
      parkingCount: 3,
      orderCount: 6500,
      totalAmount: 260000,
      avgOrderAmount: 40,
      cashAmount: 52000,
      onlineAmount: 208000,
      arrearsAmount: 13000,
      onlineRate: 80,
      growthRate: 7.8,
    },
    {
      regionName: '南靖县',
      parkingType: '路侧停车场',
      parkingCount: 4,
      orderCount: 9000,
      totalAmount: 135000,
      avgOrderAmount: 15,
      cashAmount: 27000,
      onlineAmount: 108000,
      arrearsAmount: 7000,
      onlineRate: 80,
      growthRate: 12.3,
    },
    {
      regionName: '平和县',
      parkingType: '公共停车场',
      parkingCount: 3,
      orderCount: 7000,
      totalAmount: 280000,
      avgOrderAmount: 40,
      cashAmount: 56000,
      onlineAmount: 224000,
      arrearsAmount: 11000,
      onlineRate: 80,
      growthRate: 8.1,
    },
    {
      regionName: '华安县',
      parkingType: '专用停车场',
      parkingCount: 2,
      orderCount: 4500,
      totalAmount: 180000,
      avgOrderAmount: 40,
      cashAmount: 36000,
      onlineAmount: 144000,
      arrearsAmount: 9000,
      onlineRate: 80,
      growthRate: 6.5,
    },
    {
      regionName: '芗城区',
      parkingType: '公共停车场',
      parkingCount: 3,
      orderCount: 6500,
      totalAmount: 312000,
      avgOrderAmount: 48,
      cashAmount: 31200,
      onlineAmount: 280800,
      arrearsAmount: 5000,
      onlineRate: 90,
      growthRate: 14.7,
    },
    {
      regionName: '龙文区',
      parkingType: '路侧停车场',
      parkingCount: 6,
      orderCount: 14000,
      totalAmount: 210000,
      avgOrderAmount: 15,
      cashAmount: 42000,
      onlineAmount: 168000,
      arrearsAmount: 6000,
      onlineRate: 80,
      growthRate: 22.4,
    },
    {
      regionName: '龙海区',
      parkingType: '路侧停车场',
      parkingCount: 7,
      orderCount: 16500,
      totalAmount: 247500,
      avgOrderAmount: 15,
      cashAmount: 49500,
      onlineAmount: 198000,
      arrearsAmount: 7500,
      onlineRate: 80,
      growthRate: 19.8,
    },
    {
      regionName: '漳浦县',
      parkingType: '路侧停车场',
      parkingCount: 4,
      orderCount: 9000,
      totalAmount: 135000,
      avgOrderAmount: 15,
      cashAmount: 27000,
      onlineAmount: 108000,
      arrearsAmount: 4000,
      onlineRate: 80,
      growthRate: 11.2,
    },
    {
      regionName: '其他区域',
      parkingType: '公共停车场',
      parkingCount: 8,
      orderCount: 19200,
      totalAmount: 768000,
      avgOrderAmount: 40,
      cashAmount: 76800,
      onlineAmount: 691200,
      arrearsAmount: 24000,
      onlineRate: 90,
      growthRate: 9.3,
    },
    {
      regionName: '其他区域',
      parkingType: '专用停车场',
      parkingCount: 3,
      orderCount: 5500,
      totalAmount: 220000,
      avgOrderAmount: 40,
      cashAmount: 44000,
      onlineAmount: 176000,
      arrearsAmount: 8500,
      onlineRate: 80,
      growthRate: 7.8,
    },
    {
      regionName: '芗城区',
      parkingType: '公共停车场',
      parkingCount: 4,
      orderCount: 8500,
      totalAmount: 425000,
      avgOrderAmount: 50,
      cashAmount: 42500,
      onlineAmount: 382500,
      arrearsAmount: 6500,
      onlineRate: 90,
      growthRate: 12.3,
    },
    {
      regionName: '龙文区',
      parkingType: '公共停车场',
      parkingCount: 7,
      orderCount: 16000,
      totalAmount: 720000,
      avgOrderAmount: 45,
      cashAmount: 72000,
      onlineAmount: 648000,
      arrearsAmount: 18000,
      onlineRate: 90,
      growthRate: 14.5,
    },
    {
      regionName: '龙海区',
      parkingType: '专用停车场',
      parkingCount: 3,
      orderCount: 6000,
      totalAmount: 270000,
      avgOrderAmount: 45,
      cashAmount: 54000,
      onlineAmount: 216000,
      arrearsAmount: 11500,
      onlineRate: 80,
      growthRate: 8.7,
    },
    {
      regionName: '漳浦县',
      parkingType: '专用停车场',
      parkingCount: 2,
      orderCount: 4500,
      totalAmount: 202500,
      avgOrderAmount: 45,
      cashAmount: 40500,
      onlineAmount: 162000,
      arrearsAmount: 7500,
      onlineRate: 80,
      growthRate: 6.9,
    },
    {
      regionName: '芗城区',
      parkingType: '路侧停车场',
      parkingCount: 9,
      orderCount: 20000,
      totalAmount: 300000,
      avgOrderAmount: 15,
      cashAmount: 60000,
      onlineAmount: 240000,
      arrearsAmount: 9500,
      onlineRate: 80,
      growthRate: 28.3,
    },
    {
      regionName: '龙文区',
      parkingType: '路侧停车场',
      parkingCount: 8,
      orderCount: 18500,
      totalAmount: 277500,
      avgOrderAmount: 15,
      cashAmount: 55500,
      onlineAmount: 222000,
      arrearsAmount: 8200,
      onlineRate: 80,
      growthRate: 24.1,
    },
    {
      regionName: '龙海区',
      parkingType: '路侧停车场',
      parkingCount: 9,
      orderCount: 20000,
      totalAmount: 300000,
      avgOrderAmount: 15,
      cashAmount: 60000,
      onlineAmount: 240000,
      arrearsAmount: 11000,
      onlineRate: 80,
      growthRate: 21.5,
    },
    {
      regionName: '漳浦县',
      parkingType: '路侧停车场',
      parkingCount: 5,
      orderCount: 11000,
      totalAmount: 165000,
      avgOrderAmount: 15,
      cashAmount: 33000,
      onlineAmount: 132000,
      arrearsAmount: 6000,
      onlineRate: 80,
      growthRate: 13.8,
    },
    {
      regionName: '其他区域',
      parkingType: '路侧停车场',
      parkingCount: 6,
      orderCount: 13500,
      totalAmount: 202500,
      avgOrderAmount: 15,
      cashAmount: 40500,
      onlineAmount: 162000,
      arrearsAmount: 8800,
      onlineRate: 80,
      growthRate: 10.2,
    },
    {
      regionName: '芗城区',
      parkingType: '专用停车场',
      parkingCount: 2,
      orderCount: 4000,
      totalAmount: 180000,
      avgOrderAmount: 45,
      cashAmount: 36000,
      onlineAmount: 144000,
      arrearsAmount: 5500,
      onlineRate: 80,
      growthRate: 7.2,
    },
    {
      regionName: '龙文区',
      parkingType: '专用停车场',
      parkingCount: 3,
      orderCount: 7000,
      totalAmount: 315000,
      avgOrderAmount: 45,
      cashAmount: 63000,
      onlineAmount: 252000,
      arrearsAmount: 9500,
      onlineRate: 80,
      growthRate: 9.8,
    },
    {
      regionName: '龙海区',
      parkingType: '公共停车场',
      parkingCount: 11,
      orderCount: 26000,
      totalAmount: 1040000,
      avgOrderAmount: 40,
      cashAmount: 104000,
      onlineAmount: 936000,
      arrearsAmount: 30000,
      onlineRate: 90,
      growthRate: 19.2,
    },
    {
      regionName: '漳浦县',
      parkingType: '公共停车场',
      parkingCount: 7,
      orderCount: 14000,
      totalAmount: 560000,
      avgOrderAmount: 40,
      cashAmount: 112000,
      onlineAmount: 448000,
      arrearsAmount: 22000,
      onlineRate: 80,
      growthRate: 12.4,
    },
    {
      regionName: '其他区域',
      parkingType: '公共停车场',
      parkingCount: 9,
      orderCount: 21600,
      totalAmount: 864000,
      avgOrderAmount: 40,
      cashAmount: 86400,
      onlineAmount: 777600,
      arrearsAmount: 28000,
      onlineRate: 90,
      growthRate: 10.5,
    },
    {
      regionName: '其他区域',
      parkingType: '专用停车场',
      parkingCount: 4,
      orderCount: 7000,
      totalAmount: 280000,
      avgOrderAmount: 40,
      cashAmount: 56000,
      onlineAmount: 224000,
      arrearsAmount: 9800,
      onlineRate: 80,
      growthRate: 8.6,
    },
  ];
}

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

  // 获取所有模拟数据
  const allTableData = generateMonthlyTableData();

  // 根据筛选条件过滤数据
  let filteredData = allTableData.filter(item => {
    // 1. 行政区划筛选
    if (region && regionMap[region]) {
      if (item.regionName !== regionMap[region]) {
        return false;
      }
    }

    // 2. 停车场类型筛选
    if (parkingType && parkingTypeMap[parkingType]) {
      if (item.parkingType !== parkingTypeMap[parkingType]) {
        return false;
      }
    }

    return true;
  });

  // 计算核心指标
  const coreIndicators = calculateCoreIndicators(filteredData, month);

  // 计算趋势数据
  const trendData = calculateTrendData(filteredData);

  // 计算月度对比数据
  const monthlyComparison = calculateMonthlyComparison(filteredData, month);

  // 计算区域分布数据
  const regionDistribution = calculateRegionDistribution(filteredData);

  // 计算类型分布数据
  const typeDistribution = calculateTypeDistribution(filteredData);

  // 分页处理
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
    { value: 'yunxiao', label: '云霄县' },
    { value: 'zhaoan', label: '诏安县' },
    { value: 'dongshan', label: '东山县' },
    { value: 'nanjing', label: '南靖县' },
    { value: 'pinghe', label: '平和县' },
    { value: 'huaan', label: '华安县' },
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
