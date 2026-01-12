// 出场车流API - 包含模拟数据
import { ElMessage } from 'element-plus';
/**
 * 模拟出场车流报表数据
 * @param {string} startDate 开始日期，格式：YYYY-MM-DD
 * @param {string} endDate 结束日期，格式：YYYY-MM-DD
 * @param {string} region 区域代码：空字符串表示全部
 * @param {string} parkingType 停车场类型：空字符串表示全部
 * @returns {Promise} 模拟数据
 */
export const getExitFlowReport = async (params) => {
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
      name: '总出场车次',
      value: 15_200,
      unit: '次',
      comparison: 10.8,
      abnormal: false,
    },
    {
      key: 'avgDuration',
      name: '平均停留时长',
      value: 2.8,
      unit: '小时',
      comparison: -3.4,
      abnormal: false,
    },
    {
      key: 'turnoverRate',
      name: '平均周转率',
      value: 85.6,
      unit: '%',
      comparison: 2.1,
      abnormal: false,
    },
    {
      key: 'shortTermRate',
      name: '短时停车率',
      value: 45.2,
      unit: '%',
      comparison: 8.7,
      abnormal: false,
    },
    {
      key: 'peakExit',
      name: '高峰出场车次',
      value: 2000,
      unit: '次',
      comparison: 12.5,
      abnormal: true,
    },
  ];

  // 模拟时段对比数据
  const timeComparison = {
    entry: [100, 70, 140, 300, 850, 820, 580, 430, 290, 240, 190, 140],
    exit: [90, 60, 120, 250, 780, 850, 920, 600, 480, 520, 380, 220],
  };

  // 模拟停留时长分布数据
  const durationDistribution = [
    { value: 6840, name: '1小时内' },
    { value: 8360, name: '1-3小时' },
    { value: 2850, name: '3-6小时' },
    { value: 760, name: '6小时以上' },
  ];

  // 模拟停留时长明细数据
  const durationTableData = [
    { durationRange: '1小时内', count: 6840, percentage: 45, avgFee: 8.5 },
    { durationRange: '1-3小时', count: 8360, percentage: 55, avgFee: 14.2 },
    { durationRange: '3-6小时', count: 2850, percentage: 18.8, avgFee: 25.6 },
    { durationRange: '6小时以上', count: 760, percentage: 5, avgFee: 42.3 },
  ];

  // 模拟周转率数据
  const turnoverRate = [
    {
      regionName: '芗城区',
      turnoverRate: 92.5,
      entryCount: 4500,
      exitCount: 4450,
    },
    {
      regionName: '龙文区',
      turnoverRate: 97.3,
      entryCount: 3800,
      exitCount: 3700,
    },
    {
      regionName: '龙海区',
      turnoverRate: 88.6,
      entryCount: 2800,
      exitCount: 2750,
    },
    {
      regionName: '漳浦县',
      turnoverRate: 85.2,
      entryCount: 2100,
      exitCount: 2080,
    },
    {
      regionName: '云霄县',
      turnoverRate: 91.8,
      entryCount: 1800,
      exitCount: 1780,
    },
  ];

  // 模拟表格数据
  const tableData = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  for (let i = 0; i < Math.min(days, 10); i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    const within1h = Math.floor(Math.random() * 1000) + 500;
    const within3h = Math.floor(Math.random() * 1200) + 600;
    const within6h = Math.floor(Math.random() * 400) + 200;
    const over6h = Math.floor(Math.random() * 100) + 50;
    const totalCount = within1h + within3h + within6h + over6h;

    tableData.push({
      date: dateStr,
      regionName: region || '龙文区',
      parkingType: parkingType || '路侧停车场',
      totalCount,
      within1h,
      within3h,
      within6h,
      over6h,
      avgDuration: Number.parseFloat((Math.random() * 2 + 1.5).toFixed(1)),
      turnoverRate: Number.parseFloat((Math.random() * 15 + 80).toFixed(1)),
    });
  }

  return {
    startDate,
    endDate,
    region,
    parkingType,
    coreIndicators,
    timeComparison,
    durationDistribution,
    durationTableData,
    turnoverRate,
    tableData,
    generatedAt: new Date().toISOString(),
  };
};

/**
 * 生成出场车流报表CSV文件
 * @param {object} params 导出参数
 * @returns {Promise} 模拟导出
 */
export const exportExitFlowReport = async (params) => {
  try {
    const data = await getExitFlowReport(params);

    // 生成CSV内容
    const headers = [
      '日期',
      '行政区划',
      '停车场类型',
      '总出场车次',
      '1小时内',
      '1-3小时',
      '3-6小时',
      '6小时以上',
      '平均停留时长(小时)',
      '周转率(%)',
    ];

    const csvRows = data.tableData.map((item) => [
      item.date,
      item.regionName,
      item.parkingType,
      item.totalCount,
      item.within1h,
      item.within3h,
      item.within6h,
      item.over6h,
      item.avgDuration,
      item.turnoverRate,
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
    link.download = `出场车流报表_${params.startDate || '开始'}_${params.endDate || '结束'}.csv`;

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
 * 获取停留时长明细数据
 * @param {object} params 查询参数
 * @returns {Promise} 停留时长数据
 */
export const getDurationDetail = async (params) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    durationDetail: [
      {
        durationRange: '0-30分钟',
        count: 2450,
        percentage: 16.1,
        avgFee: 0,
        minDuration: 0,
        maxDuration: 30,
      },
      {
        durationRange: '30-60分钟',
        count: 4390,
        percentage: 28.9,
        avgFee: 8.5,
        minDuration: 30,
        maxDuration: 60,
      },
      {
        durationRange: '1-2小时',
        count: 5120,
        percentage: 33.7,
        avgFee: 14.2,
        minDuration: 60,
        maxDuration: 120,
      },
      {
        durationRange: '2-3小时',
        count: 3240,
        percentage: 21.3,
        avgFee: 18.5,
        minDuration: 120,
        maxDuration: 180,
      },
    ],
    generatedAt: new Date().toISOString(),
  };
};
