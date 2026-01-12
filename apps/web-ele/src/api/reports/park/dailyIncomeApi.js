// 日收入报表API - 包含模拟数据
import { ElMessage } from 'element-plus';

/**
 * 模拟日收入报表数据
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

  // 模拟核心指标数据
  const coreIndicators = [
    {
      key: 'totalAmount',
      name: '总收费金额',
      value: 203_000,
      unit: '元',
      comparison: 35,
      abnormal: true,
    },
    {
      key: 'orderCount',
      name: '订单总数',
      value: 4250,
      unit: '笔',
      comparison: 18,
      abnormal: false,
    },
    {
      key: 'avgOrderAmount',
      name: '平均客单价',
      value: 47.76,
      unit: '元',
      comparison: 14.3,
      abnormal: false,
    },
    {
      key: 'cashAmount',
      name: '现金收入',
      value: 16_240,
      unit: '元',
      comparison: -12.5,
      abnormal: true,
    },
    {
      key: 'onlineAmount',
      name: '线上支付收入',
      value: 186_760,
      unit: '元',
      comparison: 42.8,
      abnormal: true,
    },
  ];

  // 模拟区域分布数据
  const regionDistribution = [
    { regionName: '芗城区', totalAmount: 85_000 },
    { regionName: '龙文区', totalAmount: 67_000 },
    { regionName: '龙海区', totalAmount: 32_000 },
    { regionName: '漳浦县', totalAmount: 12_000 },
    { regionName: '云霄县', totalAmount: 7000 },
  ];

  // 模拟停车场类型分布数据
  const typeDistribution = [
    { value: 102_000, name: '公共停车场' },
    { value: 71_050, name: '路侧停车场' },
    { value: 29_950, name: '专用停车场' },
  ];

  // 模拟支付方式分布数据
  const paymentType = [
    { value: 127_890, name: '微信支付' },
    { value: 58_870, name: '支付宝' },
    { value: 16_240, name: '现金支付' },
  ];

  // 模拟停车场明细数据
  const parkingDetail = [
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
    },
  ];

  return {
    date,
    region,
    parkingType,
    parkingId,
    coreIndicators,
    regionDistribution,
    typeDistribution,
    paymentType,
    parkingDetail,
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
    link.download = `日收入报表_${params.date || '当日'}.csv`;

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
