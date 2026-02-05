// 车流分布API - 包含模拟数据
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
function generateCoreIndicators(flowType, region, parkingType) {
  const hasFilter = region !== '' || parkingType !== '';

  if (hasFilter) {
    const factor = 0.4 + Math.random() * 0.6;
    const baseValue = flowType === 'total' ? 30000 : 15000;

    return [
      {
        key: 'totalFlow',
        name: flowType === 'total' ? '总车流量' : flowType === 'entry' ? '入场车流' : '出场车流',
        value: Math.round(baseValue * factor),
        unit: '车次',
        comparison: Math.floor(Math.random() * 25) - 5,
        abnormal: Math.random() > 0.8,
      },
      {
        key: 'peakFlow',
        name: '高峰车流量',
        value: Math.round(baseValue * factor * 0.18),
        unit: '车次',
        comparison: Math.floor(Math.random() * 20) - 4,
        abnormal: false,
      },
      {
        key: 'flowDensity',
        name: '平均车流密度',
        value: Number.parseFloat((Math.random() * 200 + 800).toFixed(1)),
        unit: '车次/小时',
        comparison: Math.floor(Math.random() * 15) - 3,
        abnormal: false,
      },
      {
        key: 'utilizationRate',
        name: '泊位利用率',
        value: Number.parseFloat((Math.random() * 20 + 70).toFixed(1)),
        unit: '%',
        comparison: Math.floor(Math.random() * 10) - 2,
        abnormal: false,
      },
      {
        key: 'peakRatio',
        name: '高峰时段占比',
        value: Number.parseFloat((Math.random() * 15 + 30).toFixed(1)),
        unit: '%',
        comparison: Math.floor(Math.random() * 8) - 2,
        abnormal: false,
      },
    ];
  }

  const baseValue = flowType === 'total' ? 32000 : 16000;

  return [
    {
      key: 'totalFlow',
      name: flowType === 'total' ? '总车流量' : flowType === 'entry' ? '入场车流' : '出场车流',
      value: baseValue,
      unit: '车次',
      comparison: Math.floor(Math.random() * 20) - 2,
      abnormal: false,
    },
    {
      key: 'peakFlow',
      name: '高峰车流量',
      value: Math.round(baseValue * 0.2),
      unit: '车次',
      comparison: Math.floor(Math.random() * 15) - 2,
      abnormal: false,
    },
    {
      key: 'flowDensity',
      name: '平均车流密度',
      value: Number.parseFloat((Math.random() * 100 + 900).toFixed(1)),
      unit: '车次/小时',
      comparison: Math.floor(Math.random() * 12) - 2,
      abnormal: false,
    },
    {
      key: 'utilizationRate',
      name: '泊位利用率',
      value: Number.parseFloat((Math.random() * 10 + 75).toFixed(1)),
      unit: '%',
      comparison: Math.floor(Math.random() * 8) - 1,
      abnormal: false,
    },
    {
      key: 'peakRatio',
      name: '高峰时段占比',
      value: Number.parseFloat((Math.random() * 10 + 32).toFixed(1)),
      unit: '%',
      comparison: Math.floor(Math.random() * 6) - 1,
      abnormal: false,
    },
  ];
}

// 根据筛选条件生成热力图数据
function generateHeatmapData(flowType, region, parkingType) {
  const baseData = {
    '芗城区': 4500,
    '龙文区': 3800,
    '龙海区': 2800,
    '漳浦县': 2100,
    '云霄县': 1800,
    '诏安县': 1500,
    '东山县': 1200,
    '南靖县': 900,
    '平和县': 800,
    '华安县': 600
  };

  if (region && region !== '') {
    const regionName = regionMap[region];
    // 只返回选中的区域
    const result = {};
    result[regionName] = baseData[regionName] || 1000;
    return result;
  }

  if (parkingType !== '') {
    // 根据停车场类型调整数据
    const factor = parkingType === 'public' ? 1.2 :
      parkingType === 'roadside' ? 0.8 : 0.6;
    const adjustedData = {};
    Object.keys(baseData).forEach(key => {
      adjustedData[key] = Math.round(baseData[key] * factor);
    });
    return adjustedData;
  }

  // 根据车流类型调整数据
  const factor = flowType === 'entry' ? 0.9 : flowType === 'exit' ? 0.85 : 1;
  const adjustedData = {};
  Object.keys(baseData).forEach(key => {
    adjustedData[key] = Math.round(baseData[key] * factor);
  });
  return adjustedData;
}

// 根据筛选条件生成时段分布数据
function generateTimeDistribution(flowType, region, parkingType) {
  const totalBase = [200, 150, 250, 500, 1200, 1100, 800, 600, 400, 350, 280, 200];
  const entryBase = [100, 70, 140, 300, 850, 820, 580, 430, 290, 240, 190, 140];
  const exitBase = [90, 60, 120, 250, 780, 850, 920, 600, 480, 520, 380, 220];

  let seriesData;
  if (flowType === 'entry') {
    seriesData = [...entryBase];
  } else if (flowType === 'exit') {
    seriesData = [...exitBase];
  } else {
    seriesData = [...totalBase];
  }

  // 根据筛选条件调整数据
  if (region !== '' || parkingType !== '') {
    const factor = 0.3 + Math.random() * 0.7;
    seriesData = seriesData.map(value => Math.round(value * factor));
  }

  return {
    total: totalBase,
    entry: entryBase,
    exit: exitBase,
    [flowType]: seriesData
  };
}

// 根据筛选条件生成类型分布数据
function generateTypeDistribution(parkingType) {
  const baseData = [
    { value: 18500, name: '公共停车场' },
    { value: 9500, name: '路侧停车场' },
    { value: 4000, name: '专用停车场' },
  ];

  if (parkingType && parkingType !== '') {
    const selectedType = parkingTypeMap[parkingType];
    // 只返回选中的类型
    return baseData.filter(item => item.name === selectedType);
  }

  return baseData;
}

// 根据筛选条件生成热点区域数据
function generateHotspotData(flowType, region, parkingType) {
  const baseData = [
    {
      rank: 1,
      regionName: '芗城区',
      parkingCount: 28,
      totalFlow: 4500,
      entryFlow: 2450,
      exitFlow: 2050,
      flowDensity: 160,
      peakHour: '17:00-19:00',
      growthRate: 12.5
    },
    {
      rank: 2,
      regionName: '龙文区',
      parkingCount: 22,
      totalFlow: 3800,
      entryFlow: 2000,
      exitFlow: 1800,
      flowDensity: 145,
      peakHour: '17:30-19:30',
      growthRate: 8.3
    },
    {
      rank: 3,
      regionName: '龙海区',
      parkingCount: 18,
      totalFlow: 2800,
      entryFlow: 1500,
      exitFlow: 1300,
      flowDensity: 125,
      peakHour: '18:00-20:00',
      growthRate: 15.7
    },
    {
      rank: 4,
      regionName: '漳浦县',
      parkingCount: 15,
      totalFlow: 2100,
      entryFlow: 1100,
      exitFlow: 1000,
      flowDensity: 105,
      peakHour: '16:30-18:30',
      growthRate: 5.2
    },
    {
      rank: 5,
      regionName: '云霄县',
      parkingCount: 12,
      totalFlow: 1800,
      entryFlow: 950,
      exitFlow: 850,
      flowDensity: 95,
      peakHour: '17:00-19:00',
      growthRate: 9.8
    },
  ];

  let filteredData = [...baseData];

  // 区域筛选
  if (region && region !== '') {
    const regionName = regionMap[region];
    filteredData = filteredData.filter(item => item.regionName === regionName);
  }

  // 根据车流类型调整数据
  if (flowType !== 'total') {
    filteredData = filteredData.map(item => {
      const flowValue = flowType === 'entry' ? item.entryFlow : item.exitFlow;
      return {
        ...item,
        totalFlow: flowValue,
        flowDensity: Math.round(item.flowDensity * 0.9)
      };
    });
  }

  // 根据停车场类型调整数据
  if (parkingType !== '') {
    const factor = parkingType === 'public' ? 1.1 :
      parkingType === 'roadside' ? 0.9 : 0.7;
    filteredData = filteredData.map(item => ({
      ...item,
      totalFlow: Math.round(item.totalFlow * factor),
      entryFlow: Math.round(item.entryFlow * factor),
      exitFlow: Math.round(item.exitFlow * factor),
      flowDensity: Math.round(item.flowDensity * factor)
    }));
  }

  // 重新排序
  return filteredData
    .sort((a, b) => b.totalFlow - a.totalFlow)
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

// 生成表格数据
function generateTableData(params) {
  const { timeRange, region, parkingType, flowType, startDate, endDate } = params;
  const tableData = [];

  const days = timeRange === 'today' ? 1 :
    timeRange === '7' ? 7 :
      timeRange === '30' ? 30 :
        timeRange === 'custom' && startDate && endDate ?
          Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1 : 7;

  const regionName = regionMap[region] || '芗城区';
  const parkingTypeName = parkingTypeMap[parkingType] || '公共停车场';

  const hasFilter = region !== '' || parkingType !== '';
  const baseFlow = hasFilter ? 800 : 1500;

  for (let i = 0; i < Math.min(days, 30); i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const totalFlow = Math.floor(Math.random() * baseFlow) + baseFlow;
    const entryFlow = Math.floor(totalFlow * 0.55);
    const exitFlow = Math.floor(totalFlow * 0.45);
    const morningPeak = Math.floor(totalFlow * 0.18);
    const eveningPeak = Math.floor(totalFlow * 0.22);
    const peakRatio = Number.parseFloat(((morningPeak + eveningPeak) / totalFlow * 100).toFixed(1));
    const utilizationRate = Number.parseFloat((Math.random() * 20 + 70).toFixed(1));

    tableData.push({
      date: dateStr,
      regionName: regionName,
      parkingType: parkingTypeName,
      totalFlow: flowType === 'total' ? totalFlow : flowType === 'entry' ? entryFlow : exitFlow,
      entryFlow: entryFlow,
      exitFlow: exitFlow,
      morningPeak: morningPeak,
      eveningPeak: eveningPeak,
      peakRatio: peakRatio,
      utilizationRate: utilizationRate,
    });
  }

  return tableData;
}

/**
 * 获取车流分布报表数据（支持筛选）
 */
export const getFlowDistributionReport = async (params) => {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 500));

  const {
    timeRange = '7',
    region = '',
    parkingType = '',
    flowType = 'total',
    startDate,
    endDate,
  } = params;

  // 根据筛选条件生成相应数据
  const coreIndicators = generateCoreIndicators(flowType, region, parkingType);
  const heatmapData = generateHeatmapData(flowType, region, parkingType);
  const timeDistribution = generateTimeDistribution(flowType, region, parkingType);
  const typeDistribution = generateTypeDistribution(parkingType);
  const hotspotData = generateHotspotData(flowType, region, parkingType);
  const tableData = generateTableData(params);

  return {
    timeRange,
    region,
    parkingType,
    flowType,
    coreIndicators,
    heatmapData,
    timeDistribution,
    typeDistribution,
    hotspotData,
    tableData,
    generatedAt: new Date().toISOString(),
  };
};

/**
 * 导出车流分布报表
 */
export const exportFlowDistributionReport = async (params) => {
  try {
    const data = await getFlowDistributionReport(params);

    // 生成CSV内容
    const headers = [
      '日期',
      '行政区划',
      '停车场类型',
      '总车流',
      '入场车流',
      '出场车流',
      '早高峰车流',
      '晚高峰车流',
      '高峰占比(%)',
      '泊位利用率(%)',
    ];

    const csvRows = data.tableData.map((item) => [
      item.date,
      item.regionName,
      item.parkingType,
      item.totalFlow,
      item.entryFlow || '',
      item.exitFlow || '',
      item.morningPeak,
      item.eveningPeak,
      item.peakRatio,
      item.utilizationRate,
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
    link.download = `车流分布报表_${params.timeRange || '近7日'}_${new Date().getTime()}.csv`;

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
