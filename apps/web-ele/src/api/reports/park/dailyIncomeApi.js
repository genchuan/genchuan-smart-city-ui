// 日收入报表API - 包含模拟数据
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
  'huaan': '华安县'
};

// 停车场类型映射关系
const parkingTypeMap = {
  'public': '公共停车场',
  'roadside': '路侧停车场',
  'special': '专用停车场'
};

// 停车场ID映射关系
const parkingIdMap = {
  'park001': '漳州万达广场停车场',
  'park002': '芗城政府路侧停车场',
  'park003': '龙文区体育中心停车场',
  'park004': '龙海区商业城停车场',
  'park005': '漳浦县汽车站停车场',
  'park006': '云霄县中心停车场',
  'park007': '诏安县人民广场停车场',
  'park008': '东山县旅游中心停车场',
  'park009': '南靖县土楼停车场',
  'park010': '平和县商贸城停车场',
  'park011': '华安县体育馆停车场',
  'park012': '芗城区中山公园停车场',
  'park013': '龙文区行政服务中心停车场',
  'park014': '龙海区火车站停车场',
  'park015': '漳浦县医院停车场',
  'park016': '云霄县汽车站停车场',
  'park017': '诏安县中心停车场',
  'park018': '东山县海滨停车场',
  'park019': '南靖县云水谣停车场',
  'park020': '平和县琯溪蜜柚市场停车场'
};

// 辅助函数：计算区域分布
function calculateRegionDistribution(data) {
  const regionDistribution = {};

  data.forEach(item => {
    if (!regionDistribution[item.regionName]) {
      regionDistribution[item.regionName] = {
        regionName: item.regionName,
        totalAmount: 0
      };
    }
    regionDistribution[item.regionName].totalAmount += item.totalAmount;
  });

  return Object.values(regionDistribution).sort((a, b) => b.totalAmount - a.totalAmount);
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

// 辅助函数：计算支付方式分布（基于总金额比例）
function calculatePaymentTypeDistribution(data, totalAmount) {
  if (totalAmount <= 0) {
    return [
      { value: 0, name: '微信支付' },
      { value: 0, name: '支付宝' },
      { value: 0, name: '现金支付' }
    ];
  }

  // 假设微信支付占60%，支付宝占30%，现金支付占10%
  // 在实际应用中，这些数据应该从详细订单中统计得出
  return [
    { value: Math.round(totalAmount * 0.6), name: '微信支付' },
    { value: Math.round(totalAmount * 0.3), name: '支付宝' },
    { value: Math.round(totalAmount * 0.1), name: '现金支付' }
  ];
}

// 辅助函数：计算核心指标
function calculateCoreIndicators(data, date) {
  if (data.length === 0) {
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
        name: '平均客单价',
        value: 0,
        unit: '元',
        comparison: 0,
      },
      {
        key: 'cashAmount',
        name: '现金收入',
        value: 0,
        unit: '元',
        comparison: 0,
      },
      {
        key: 'onlineAmount',
        name: '线上支付收入',
        value: 0,
        unit: '元',
        comparison: 0,
      },
    ];
  }

  const totalAmount = data.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalOrders = data.reduce((sum, item) => sum + item.orderCount, 0);
  const cashAmount = data.reduce((sum, item) => sum + item.cashAmount, 0);
  const onlineAmount = data.reduce((sum, item) => sum + item.onlineAmount, 0);

  // 模拟比较值，实际应该从历史数据计算
  const comparisonValues = {
    '2023-12-25': [35, 18, 14.3, -12.5, 42.8],
    '2023-12-24': [28, 15, 12.5, -8.2, 38.5],
    '2023-12-23': [22, 12, 10.8, -5.7, 35.2],
  };

  const comparisons = comparisonValues[date] || [0, 0, 0, 0, 0];

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
      name: '平均客单价',
      value: totalOrders > 0 ? Math.round(totalAmount / totalOrders * 100) / 100 : 0,
      unit: '元',
      comparison: comparisons[2],
    },
    {
      key: 'cashAmount',
      name: '现金收入',
      value: cashAmount,
      unit: '元',
      comparison: comparisons[3],
    },
    {
      key: 'onlineAmount',
      name: '线上支付收入',
      value: onlineAmount,
      unit: '元',
      comparison: comparisons[4],
    },
  ];
}

// 模拟停车场明细数据
function generateParkingDetailData() {
  return [
    {
      parkingName: '漳州万达广场停车场',
      regionName: '芗城区',
      parkingType: '公共停车场',
      orderCount: 1250,
      totalAmount: 58_750,
      avgOrderAmount: 47,
      cashAmount: 2350,
      onlineAmount: 56_400,
      onlineRate: 96,
      parkingId: 'park001'
    },
    {
      parkingName: '芗城政府路侧停车场',
      regionName: '芗城区',
      parkingType: '路侧停车场',
      orderCount: 850,
      totalAmount: 26_250,
      avgOrderAmount: 30.88,
      cashAmount: 5250,
      onlineAmount: 21_000,
      onlineRate: 80,
      parkingId: 'park002'
    },
    {
      parkingName: '龙文区体育中心停车场',
      regionName: '龙文区',
      parkingType: '公共停车场',
      orderCount: 920,
      totalAmount: 43_240,
      avgOrderAmount: 47,
      cashAmount: 1729,
      onlineAmount: 41_511,
      onlineRate: 96,
      parkingId: 'park003'
    },
    {
      parkingName: '龙海区商业城停车场',
      regionName: '龙海区',
      parkingType: '公共停车场',
      orderCount: 680,
      totalAmount: 32_640,
      avgOrderAmount: 48,
      cashAmount: 3264,
      onlineAmount: 29_376,
      onlineRate: 90,
      parkingId: 'park004'
    },
    {
      parkingName: '漳浦县汽车站停车场',
      regionName: '漳浦县',
      parkingType: '专用停车场',
      orderCount: 550,
      totalAmount: 22_550,
      avgOrderAmount: 41,
      cashAmount: 4510,
      onlineAmount: 18_040,
      onlineRate: 80,
      parkingId: 'park005'
    },
    {
      parkingName: '云霄县中心停车场',
      regionName: '云霄县',
      parkingType: '公共停车场',
      orderCount: 420,
      totalAmount: 16_800,
      avgOrderAmount: 40,
      cashAmount: 1680,
      onlineAmount: 15_120,
      onlineRate: 90,
      parkingId: 'park006'
    },
    {
      parkingName: '诏安县人民广场停车场',
      regionName: '诏安县',
      parkingType: '公共停车场',
      orderCount: 380,
      totalAmount: 15_200,
      avgOrderAmount: 40,
      cashAmount: 3040,
      onlineAmount: 12_160,
      onlineRate: 80,
      parkingId: 'park007'
    },
    {
      parkingName: '东山县旅游中心停车场',
      regionName: '东山县',
      parkingType: '专用停车场',
      orderCount: 510,
      totalAmount: 20_910,
      avgOrderAmount: 41,
      cashAmount: 4182,
      onlineAmount: 16_728,
      onlineRate: 80,
      parkingId: 'park008'
    },
    {
      parkingName: '南靖县土楼停车场',
      regionName: '南靖县',
      parkingType: '路侧停车场',
      orderCount: 320,
      totalAmount: 12_160,
      avgOrderAmount: 38,
      cashAmount: 2432,
      onlineAmount: 9_728,
      onlineRate: 80,
      parkingId: 'park009'
    },
    {
      parkingName: '平和县商贸城停车场',
      regionName: '平和县',
      parkingType: '公共停车场',
      orderCount: 290,
      totalAmount: 11_310,
      avgOrderAmount: 39,
      cashAmount: 2262,
      onlineAmount: 9_048,
      onlineRate: 80,
      parkingId: 'park010'
    },
    {
      parkingName: '华安县体育馆停车场',
      regionName: '华安县',
      parkingType: '专用停车场',
      orderCount: 180,
      totalAmount: 7_380,
      avgOrderAmount: 41,
      cashAmount: 1476,
      onlineAmount: 5_904,
      onlineRate: 80,
      parkingId: 'park011'
    },
    {
      parkingName: '芗城区中山公园停车场',
      regionName: '芗城区',
      parkingType: '路侧停车场',
      orderCount: 620,
      totalAmount: 18_600,
      avgOrderAmount: 30,
      cashAmount: 3720,
      onlineAmount: 14_880,
      onlineRate: 80,
      parkingId: 'park012'
    },
    {
      parkingName: '龙文区行政服务中心停车场',
      regionName: '龙文区',
      parkingType: '公共停车场',
      orderCount: 410,
      totalAmount: 16_400,
      avgOrderAmount: 40,
      cashAmount: 3280,
      onlineAmount: 13_120,
      onlineRate: 80,
      parkingId: 'park013'
    },
    {
      parkingName: '龙海区火车站停车场',
      regionName: '龙海区',
      parkingType: '专用停车场',
      orderCount: 390,
      totalAmount: 15_600,
      avgOrderAmount: 40,
      cashAmount: 3120,
      onlineAmount: 12_480,
      onlineRate: 80,
      parkingId: 'park014'
    },
    {
      parkingName: '漳浦县医院停车场',
      regionName: '漳浦县',
      parkingType: '专用停车场',
      orderCount: 340,
      totalAmount: 13_600,
      avgOrderAmount: 40,
      cashAmount: 2720,
      onlineAmount: 10_880,
      onlineRate: 80,
      parkingId: 'park015'
    },
    {
      parkingName: '云霄县汽车站停车场',
      regionName: '云霄县',
      parkingType: '路侧停车场',
      orderCount: 270,
      totalAmount: 10_260,
      avgOrderAmount: 38,
      cashAmount: 2052,
      onlineAmount: 8_208,
      onlineRate: 80,
      parkingId: 'park016'
    },
    {
      parkingName: '诏安县中心停车场',
      regionName: '诏安县',
      parkingType: '公共停车场',
      orderCount: 230,
      totalAmount: 8_970,
      avgOrderAmount: 39,
      cashAmount: 1794,
      onlineAmount: 7_176,
      onlineRate: 80,
      parkingId: 'park017'
    },
    {
      parkingName: '东山县海滨停车场',
      regionName: '东山县',
      parkingType: '路侧停车场',
      orderCount: 210,
      totalAmount: 8_190,
      avgOrderAmount: 39,
      cashAmount: 1638,
      onlineAmount: 6_552,
      onlineRate: 80,
      parkingId: 'park018'
    },
    {
      parkingName: '南靖县云水谣停车场',
      regionName: '南靖县',
      parkingType: '公共停车场',
      orderCount: 190,
      totalAmount: 7_410,
      avgOrderAmount: 39,
      cashAmount: 1482,
      onlineAmount: 5_928,
      onlineRate: 80,
      parkingId: 'park019'
    },
    {
      parkingName: '平和县琯溪蜜柚市场停车场',
      regionName: '平和县',
      parkingType: '路侧停车场',
      orderCount: 170,
      totalAmount: 6_630,
      avgOrderAmount: 39,
      cashAmount: 1326,
      onlineAmount: 5_304,
      onlineRate: 80,
      parkingId: 'park020'
    },
  ];
}

/**
 * 模拟日收入报表数据（支持筛选）
 * @param {string} date 统计日期，格式：YYYY-MM-DD
 * @param {string} region 区域代码：空字符串表示全部
 * @param {string} parkingType 停车场类型：空字符串表示全部
 * @param {string} parkingId 停车场ID：空字符串表示全部
 * @returns {Promise} 模拟数据
 */
export const getDailyIncomeReport = async (params) => {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 500));

  const {
    date = '2023-12-25',
    region = '',
    parkingType = '',
    parkingId = '',
  } = params;

  // 获取所有模拟数据
  const allParkingDetail = generateParkingDetailData();

  // 应用筛选逻辑
  let filteredParkingDetail = allParkingDetail.filter(item => {
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

    // 3. 停车场ID筛选
    if (parkingId && parkingIdMap[parkingId]) {
      if (item.parkingName !== parkingIdMap[parkingId]) {
        return false;
      }
    }

    return true;
  });

  // 计算总金额
  const totalAmount = filteredParkingDetail.reduce((sum, item) => sum + item.totalAmount, 0);

  // 计算核心指标
  const coreIndicators = calculateCoreIndicators(filteredParkingDetail, date);

  // 计算区域分布
  const regionDistribution = calculateRegionDistribution(filteredParkingDetail);

  // 计算类型分布
  const typeDistribution = calculateTypeDistribution(filteredParkingDetail);

  // 计算支付方式分布
  const paymentType = calculatePaymentTypeDistribution(filteredParkingDetail, totalAmount);

  return {
    date,
    region,
    parkingType,
    parkingId,
    coreIndicators,
    regionDistribution,
    typeDistribution,
    paymentType,
    parkingDetail: filteredParkingDetail,
    generatedAt: new Date().toISOString(),
  };
};

/**
 * 生成日收入报表CSV文件
 * @param {object} params 导出参数
 * @returns {Promise} 模拟导出
 */
export const exportDailyIncomeReport = async (params) => {
  try {
    // 获取筛选后的数据
    const data = await getDailyIncomeReport(params);

    // 生成CSV内容
    const headers = [
      '停车场名称',
      '行政区划',
      '停车场类型',
      '订单数',
      '收费金额(元)',
      '平均客单价(元)',
      '现金收入(元)',
      '线上收入(元)',
      '线上占比(%)',
    ];

    const csvRows = data.parkingDetail.map((item) => [
      item.parkingName,
      item.regionName,
      item.parkingType,
      item.orderCount,
      item.totalAmount,
      item.avgOrderAmount,
      item.cashAmount,
      item.onlineAmount,
      item.onlineRate,
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
    link.download = `日收入报表_${params.date || '当日'}_${new Date().getTime()}.csv`;

    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    ElMessage.success(`导出成功，共${data.parkingDetail.length}条记录`);

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

// 获取筛选条件选项
export const getFilterOptions = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    regions: [
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
    ],
    parkingTypes: [
      { value: '', label: '全部类型' },
      { value: 'public', label: '公共停车场' },
      { value: 'roadside', label: '路侧停车场' },
      { value: 'special', label: '专用停车场' },
    ],
    parkingList: [
      { value: '', label: '全部停车场' },
      { value: 'park001', label: '漳州万达广场停车场' },
      { value: 'park002', label: '芗城政府路侧停车场' },
      { value: 'park003', label: '龙文区体育中心停车场' },
      { value: 'park004', label: '龙海区商业城停车场' },
      { value: 'park005', label: '漳浦县汽车站停车场' },
      { value: 'park006', label: '云霄县中心停车场' },
      { value: 'park007', label: '诏安县人民广场停车场' },
      { value: 'park008', label: '东山县旅游中心停车场' },
      { value: 'park009', label: '南靖县土楼停车场' },
      { value: 'park010', label: '平和县商贸城停车场' },
      { value: 'park011', label: '华安县体育馆停车场' },
      { value: 'park012', label: '芗城区中山公园停车场' },
      { value: 'park013', label: '龙文区行政服务中心停车场' },
      { value: 'park014', label: '龙海区火车站停车场' },
      { value: 'park015', label: '漳浦县医院停车场' },
      { value: 'park016', label: '云霄县汽车站停车场' },
      { value: 'park017', label: '诏安县中心停车场' },
      { value: 'park018', label: '东山县海滨停车场' },
      { value: 'park019', label: '南靖县云水谣停车场' },
      { value: 'park020', label: '平和县琯溪蜜柚市场停车场' },
    ]
  };
};
