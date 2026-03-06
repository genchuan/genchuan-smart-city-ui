// 入场车流API - 包含模拟数据
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
        name: '总入场车次',
        value: Math.floor(Math.random() * 5000) + 8000,
        unit: '次',
        comparison: Math.floor(Math.random() * 20) - 5,
        abnormal: false,
      },
      {
        key: 'morningPeak',
        name: '早高峰车次',
        value: Math.floor(Math.random() * 800) + 1000,
        unit: '次',
        comparison: Math.floor(Math.random() * 15) - 3,
        abnormal: false,
      },
      {
        key: 'eveningPeak',
        name: '晚高峰车次',
        value: Math.floor(Math.random() * 900) + 1100,
        unit: '次',
        comparison: Math.floor(Math.random() * 25) - 5,
        abnormal: Math.random() > 0.7,
      },
      {
        key: 'newEnergyRate',
        name: '新能源占比',
        value: Number.parseFloat((Math.random() * 8 + 8).toFixed(1)),
        unit: '%',
        comparison: Math.floor(Math.random() * 15) + 5,
        abnormal: false,
      },
      {
        key: 'avgHourly',
        name: '平均小时车流',
        value: Math.floor(Math.random() * 200) + 400,
        unit: '车次',
        comparison: Math.floor(Math.random() * 10) - 2,
        abnormal: false,
      },
    ];
  }

  return [
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
}

// 根据筛选条件生成时段分布数据
function generateTimeDistribution(region, parkingType) {
  const base = [120, 80, 150, 300, 900, 850, 600, 450, 300, 250, 200, 150];
  const avg = [110, 75, 140, 280, 850, 800, 550, 420, 280, 230, 180, 130];

  if (region || parkingType) {
    // 根据筛选条件调整数据
    const factor = 0.3 + Math.random() * 0.5; // 0.3-0.8之间的随机系数
    return {
      today: base.map(value => Math.round(value * factor)),
      average: avg.map(value => Math.round(value * factor))
    };
  }

  return {
    today: base,
    average: avg
  };
}

// 根据筛选条件生成区域分布数据
function generateRegionDistribution(region) {
  const baseData = [
    { name: '芗城区', value: 4500 },
    { name: '龙文区', value: 3800 },
    { name: '龙海区', value: 2800 },
    { name: '漳浦县', value: 2100 },
    { name: '云霄县', value: 1800 },
    { name: '其他区域', value: 800 },
  ];

  if (region && region !== '') {
    const regionName = regionMap[region];
    // 只返回筛选的区域
    return baseData.filter(item => item.name === regionName);
  }

  return baseData;
}

// 根据筛选条件生成车型分布数据
function generateVehicleType(region, parkingType) {
  const baseData = {
    small: 13_430,
    medium: 1580,
    large: 420,
    newEnergy: 1970,
  };

  if (region || parkingType) {
    const factor = 0.2 + Math.random() * 0.8;
    return {
      small: Math.round(baseData.small * factor),
      medium: Math.round(baseData.medium * factor),
      large: Math.round(baseData.large * factor),
      newEnergy: Math.round(baseData.newEnergy * factor),
    };
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

  const regionName = regionMap[region] || '芗城区';
  const parkingTypeName = parkingTypeMap[parkingType] || '公共停车场';

  for (let i = 0; i < Math.min(days, 10); i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    const baseCount = region || parkingType ? 800 : 1500; // 筛选后数据量减少
    const totalCount = Math.floor(Math.random() * baseCount) + baseCount;
    const morningPeak = Math.floor(totalCount * 0.15);
    const eveningPeak = Math.floor(totalCount * 0.18);
    const offPeak = totalCount - morningPeak - eveningPeak;

    tableData.push({
      date: dateStr,
      regionName: regionName,
      parkingType: parkingTypeName,
      totalCount: totalCount,
      morningPeak: morningPeak,
      eveningPeak: eveningPeak,
      offPeak: offPeak,
      smallVehicle: Math.floor(totalCount * 0.85),
      mediumVehicle: Math.floor(totalCount * 0.1),
      largeVehicle: Math.floor(totalCount * 0.03),
      newEnergy: Math.floor(totalCount * 0.12),
      newEnergyRate: Number.parseFloat((Math.random() * 10 + 8).toFixed(1)),
    });
  }

  return tableData;
}

/**
 * 获取入场车流报表数据（支持筛选）
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

  // 根据筛选条件生成相应数据
  const hasFilter = region !== '' || parkingType !== '';

  const coreIndicators = generateCoreIndicators(hasFilter);
  const timeDistribution = generateTimeDistribution(region, parkingType);
  const regionDistribution = generateRegionDistribution(region);
  const vehicleType = generateVehicleType(region, parkingType);
  const tableData = generateTableData(params);

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
 * 导出入场车流报表
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
    link.download = `入场车流报表_${params.startDate || '开始'}_${params.endDate || '结束'}_${new Date().getTime()}.csv`;

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
