// 入场车流API - 包含模拟数据
import { ElMessage } from 'element-plus';

/**
 * 模拟入场车流报表数据
 * @param {string} startDate 开始日期，格式：YYYY-MM-DD
 * @param {string} endDate 结束日期，格式：YYYY-MM-DD
 * @param {string} region 区域代码：空字符串表示全部
 * @param {string} parkingType 停车场类型：空字符串表示全部
 * @returns {Promise} 模拟数据
 */
export const getEntryFlowReport = async (params) => {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 500));

  const {
    startDate = '2023-12-21',
    endDate = '2023-12-21',
    region = '',
    parkingType = '',
  } = params;

  // 模拟核心指标数据
  const coreIndicators = [
    {
      key: 'totalCount',
      name: '总入场车次',
      value: 15_800,
      unit: '次',
      comparison: 12.5,
      abnormal: false,
    },
    {
      key: 'morningPeak',
      name: '早高峰车次',
      value: 2100,
      unit: '次',
      comparison: 8.3,
      abnormal: false,
    },
    {
      key: 'eveningPeak',
      name: '晚高峰车次',
      value: 2300,
      unit: '次',
      comparison: 15.7,
      abnormal: true,
    },
    {
      key: 'newEnergyRate',
      name: '新能源占比',
      value: 12.5,
      unit: '%',
      comparison: 25,
      abnormal: false,
    },
    {
      key: 'avgHourly',
      name: '平均小时车流',
      value: 658,
      unit: '车次',
      comparison: 5.2,
      abnormal: false,
    },
  ];

  // 模拟时段分布数据
  const timeDistribution = {
    today: [120, 80, 150, 300, 900, 850, 600, 450, 300, 250, 200, 150],
    average: [110, 75, 140, 280, 850, 800, 550, 420, 280, 230, 180, 130],
  };

  // 模拟区域分布数据
  const regionDistribution = [
    { name: '芗城区', value: 4500 },
    { name: '龙文区', value: 3800 },
    { name: '龙海区', value: 2800 },
    { name: '漳浦县', value: 2100 },
    { name: '云霄县', value: 1800 },
    { name: '其他区域', value: 800 },
  ];

  // 模拟车型分布数据
  const vehicleType = {
    small: 13_430,
    medium: 1580,
    large: 420,
    newEnergy: 1970,
  };

  // 模拟表格数据
  const tableData = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  for (let i = 0; i < Math.min(days, 10); i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    tableData.push({
      date: dateStr,
      regionName: region || '芗城区',
      parkingType: parkingType || '公共停车场',
      totalCount: Math.floor(Math.random() * 2000) + 1000,
      morningPeak: Math.floor(Math.random() * 400) + 200,
      eveningPeak: Math.floor(Math.random() * 500) + 250,
      offPeak: Math.floor(Math.random() * 1200) + 600,
      smallVehicle: Math.floor(Math.random() * 1800) + 900,
      mediumVehicle: Math.floor(Math.random() * 300) + 100,
      largeVehicle: Math.floor(Math.random() * 100) + 50,
      newEnergy: Math.floor(Math.random() * 400) + 150,
      newEnergyRate: Number.parseFloat((Math.random() * 10 + 8).toFixed(1)),
    });
  }

  return {
    startDate,
    endDate,
    region,
    parkingType,
    coreIndicators,
    timeDistribution,
    regionDistribution,
    vehicleType,
    tableData,
    generatedAt: new Date().toISOString(),
  };
};

/**
 * 生成入场车流报表CSV文件
 * @param {object} params 导出参数
 * @returns {Promise} 模拟导出
 */
export const exportEntryFlowReport = async (params) => {
  try {
    const data = await getEntryFlowReport(params);

    // 生成CSV内容
    const headers = [
      '日期',
      '行政区划',
      '停车场类型',
      '总车次',
      '早高峰(7-9点)',
      '晚高峰(17-19点)',
      '平峰时段',
      '小型车',
      '中型车',
      '大型车',
      '新能源汽车',
      '新能源占比(%)',
    ];

    const csvRows = data.tableData.map((item) => [
      item.date,
      item.regionName,
      item.parkingType,
      item.totalCount,
      item.morningPeak,
      item.eveningPeak,
      item.offPeak,
      item.smallVehicle,
      item.mediumVehicle,
      item.largeVehicle,
      item.newEnergy,
      item.newEnergyRate,
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
    link.download = `入场车流报表_${params.startDate || '开始'}_${params.endDate || '结束'}.csv`;

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
 * 获取入场车流趋势数据
 * @param {object} params 查询参数
 * @returns {Promise} 趋势数据
 */
export const getEntryFlowTrend = async (params) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    trendData: [
      { date: '2023-12-15', value: 14_500 },
      { date: '2023-12-16', value: 15_200 },
      { date: '2023-12-17', value: 14_800 },
      { date: '2023-12-18', value: 15_500 },
      { date: '2023-12-19', value: 16_000 },
      { date: '2023-12-20', value: 15_700 },
      { date: '2023-12-21', value: 15_800 },
    ],
    generatedAt: new Date().toISOString(),
  };
};

/**
 * 获取入场车流对比数据
 * @param {object} params 查询参数
 * @returns {Promise} 对比数据
 */
export const getEntryFlowComparison = async (params) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    current: {
      total: 15_800,
      morningPeak: 2100,
      eveningPeak: 2300,
      newEnergyRate: 12.5,
    },
    comparison: {
      total: 14_050,
      morningPeak: 1940,
      eveningPeak: 1990,
      newEnergyRate: 10,
    },
    change: {
      total: '+12.5%',
      morningPeak: '+8.3%',
      eveningPeak: '+15.7%',
      newEnergyRate: '+25.0%',
    },
    generatedAt: new Date().toISOString(),
  };
};
