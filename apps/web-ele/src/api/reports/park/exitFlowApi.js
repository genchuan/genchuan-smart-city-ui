// 出场车流API - 包含模拟数据
import { ElMessage } from 'element-plus';

// 区域映射
const regionMap = {
  '': '全部区域',
  'xiangcheng': '芗城区',
  'longwen': '龙文区',
  'longhai': '龙海区',
  'zhangpu': '漳浦县',
  'yunxiao': '云霄县'
};

// 停车场类型映射
const parkingTypeMap = {
  '': '全部类型',
  'public': '公共停车场',
  'roadside': '路侧停车场',
  'special': '专用停车场'
};

// 生成模拟的核心指标数据
function generateCoreIndicators(filtered = false) {
  if (filtered) {
    return [
      {
        key: 'totalCount',
        name: '总出场车次',
        value: Math.floor(Math.random() * 5000) + 7000,
        unit: '次',
        comparison: Math.floor(Math.random() * 15) - 3,
        abnormal: false,
      },
      {
        key: 'avgDuration',
        name: '平均停留时长',
        value: Number.parseFloat((Math.random() * 2 + 1.5).toFixed(1)),
        unit: '小时',
        comparison: Math.floor(Math.random() * 10) - 8,
        abnormal: false,
      },
      {
        key: 'turnoverRate',
        name: '平均周转率',
        value: Number.parseFloat((Math.random() * 15 + 80).toFixed(1)),
        unit: '%',
        comparison: Math.floor(Math.random() * 5) - 2,
        abnormal: false,
      },
      {
        key: 'shortTermRate',
        name: '短时停车率',
        value: Number.parseFloat((Math.random() * 20 + 40).toFixed(1)),
        unit: '%',
        comparison: Math.floor(Math.random() * 10) - 2,
        abnormal: false,
      },
      {
        key: 'peakExit',
        name: '高峰出场车次',
        value: Math.floor(Math.random() * 600) + 1500,
        unit: '次',
        comparison: Math.floor(Math.random() * 20) - 3,
        abnormal: Math.random() > 0.8,
      },
    ];
  }

  return [
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
}

// 根据筛选条件生成时段对比数据
function generateTimeComparison(region, parkingType) {
  const entryBase = [100, 70, 140, 300, 850, 820, 580, 430, 290, 240, 190, 140];
  const exitBase = [90, 60, 120, 250, 780, 850, 920, 600, 480, 520, 380, 220];

  if (region || parkingType) {
    const factor = 0.3 + Math.random() * 0.7;
    return {
      entry: entryBase.map(value => Math.round(value * factor)),
      exit: exitBase.map(value => Math.round(value * factor))
    };
  }

  return {
    entry: entryBase,
    exit: exitBase
  };
}

// 根据筛选条件生成停留时长分布数据
function generateDurationDistribution(region, parkingType) {
  const baseData = [
    { value: 6840, name: '1小时内' },
    { value: 8360, name: '1-3小时' },
    { value: 2850, name: '3-6小时' },
    { value: 760, name: '6小时以上' },
  ];

  if (region || parkingType) {
    const factor = 0.4 + Math.random() * 0.6;
    return baseData.map(item => ({
      ...item,
      value: Math.round(item.value * factor)
    }));
  }

  return baseData;
}

// 根据筛选条件生成停留时长明细数据
function generateDurationTableData(region, parkingType) {
  const baseData = [
    { durationRange: '1小时内', count: 6840, percentage: 45, avgFee: 8.5 },
    { durationRange: '1-3小时', count: 8360, percentage: 55, avgFee: 14.2 },
    { durationRange: '3-6小时', count: 2850, percentage: 18.8, avgFee: 25.6 },
    { durationRange: '6小时以上', count: 760, percentage: 5, avgFee: 42.3 },
  ];

  if (region || parkingType) {
    const factor = 0.4 + Math.random() * 0.6;
    return baseData.map(item => ({
      ...item,
      count: Math.round(item.count * factor),
      avgFee: Number.parseFloat((item.avgFee * (0.8 + Math.random() * 0.4)).toFixed(1))
    }));
  }

  return baseData;
}

// 根据筛选条件生成周转率数据
function generateTurnoverRate(region) {
  const baseData = [
    { regionName: '芗城区', turnoverRate: 92.5, entryCount: 4500, exitCount: 4450 },
    { regionName: '龙文区', turnoverRate: 97.3, entryCount: 3800, exitCount: 3700 },
    { regionName: '龙海区', turnoverRate: 88.6, entryCount: 2800, exitCount: 2750 },
    { regionName: '漳浦县', turnoverRate: 85.2, entryCount: 2100, exitCount: 2080 },
    { regionName: '云霄县', turnoverRate: 91.8, entryCount: 1800, exitCount: 1780 },
  ];

  if (region && region !== '') {
    const regionName = regionMap[region];
    return baseData.filter(item => item.regionName === regionName);
  }

  return baseData;
}

// 生成表格数据
function generateTableData(params) {
  const { startDate, endDate, region, parkingType } = params;
  const tableData = [];

  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  const regionName = regionMap[region] || '龙文区';
  const parkingTypeName = parkingTypeMap[parkingType] || '路侧停车场';

  const hasFilter = region !== '' || parkingType !== '';

  for (let i = 0; i < Math.min(days, 10); i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    const baseCount = hasFilter ? 600 : 1200;
    const within1h = Math.floor(Math.random() * baseCount) + 300;
    const within3h = Math.floor(Math.random() * (baseCount * 0.6)) + 400;
    const within6h = Math.floor(Math.random() * (baseCount * 0.3)) + 150;
    const over6h = Math.floor(Math.random() * (baseCount * 0.1)) + 30;
    const totalCount = within1h + within3h + within6h + over6h;

    tableData.push({
      date: dateStr,
      regionName: regionName,
      parkingType: parkingTypeName,
      totalCount,
      within1h,
      within3h,
      within6h,
      over6h,
      avgDuration: Number.parseFloat((Math.random() * 2 + 1.5).toFixed(1)),
      turnoverRate: Number.parseFloat((Math.random() * 15 + 80).toFixed(1)),
    });
  }

  return tableData;
}

/**
 * 获取出场车流报表数据（支持筛选）
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

  // 根据筛选条件生成相应数据
  const hasFilter = region !== '' || parkingType !== '';

  const coreIndicators = generateCoreIndicators(hasFilter);
  const timeComparison = generateTimeComparison(region, parkingType);
  const durationDistribution = generateDurationDistribution(region, parkingType);
  const durationTableData = generateDurationTableData(region, parkingType);
  const turnoverRate = generateTurnoverRate(region);
  const tableData = generateTableData(params);

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
 * 导出出场车流报表
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
    link.download = `出场车流报表_${params.startDate || '开始'}_${params.endDate || '结束'}_${new Date().getTime()}.csv`;

    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    ElMessage.success(`导出成功，共${data.tableData.length}条记录`);

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
