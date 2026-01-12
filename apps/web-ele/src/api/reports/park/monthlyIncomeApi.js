// 月收入报表API - 包含模拟数据
import { ElMessage } from 'element-plus';

/**
 * 模拟月收入报表数据
 * @param {string} month 统计月份，格式：YYYY-MM
 * @param {string} region 区域代码：空字符串表示全部
 * @param {string} parkingType 停车场类型：空字符串表示全部
 * @returns {Promise} 模拟数据
 */
export const getMonthlyIncomeReport = async (params) => {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 600));

  const { month = '2023-12', region = '', parkingType = '' } = params;

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
    current: [85, 120, 150, 135, 100], // 本月各周收入（万元）
    last: [70, 105, 125, 120, 90],     // 上月各周收入（万元）
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

  // 模拟表格数据
  const tableData = [
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
  ];

  return {
    month,
    region,
    parkingType,
    coreIndicators,
    trendData,
    monthlyComparison,
    regionDistribution,
    typeDistribution,
    tableData,
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
    const data = await getMonthlyIncomeReport(params);

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
