// 车流分布API - 包含模拟数据
import { ElMessage } from 'element-plus';
/**
 * 模拟车流分布报表数据
 * @param {string} timeRange 时间范围：today/7/30/custom
 * @param {string} region 区域代码：空字符串表示全部
 * @param {string} parkingType 停车场类型：空字符串表示全部
 * @param {string} flowType 车流类型：entry/exit/total
 * @param {string} startDate 开始日期（仅custom时使用）
 * @param {string} endDate 结束日期（仅custom时使用）
 * @returns {Promise} 模拟数据
 */
export const getFlowDistributionReport = async (params) => {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 600));

  const {
    timeRange = '7',
    region = '',
    parkingType = '',
    flowType = 'total',
    startDate = '',
    endDate = '',
  } = params;

  // 根据车流类型生成核心指标数据
  let coreIndicators;
  if (flowType === 'entry') {
    coreIndicators = [
      {
        key: 'totalFlow',
        name: '总入场车流量',
        value: 15_800,
        unit: '车次',
        comparison: 8.5,
        abnormal: false,
      },
      {
        key: 'peakFlow',
        name: '入场高峰车流',
        value: 2100,
        unit: '车次',
        comparison: 12.3,
        abnormal: true,
      },
      {
        key: 'flowDensity',
        name: '平均车流密度',
        value: 156,
        unit: '车次/停车场',
        comparison: 5.7,
        abnormal: false,
      },
      {
        key: 'utilizationRate',
        name: '平均利用率',
        value: 78.5,
        unit: '%',
        comparison: 3.2,
        abnormal: false,
      },
      {
        key: 'hotspotCount',
        name: '热点区域数',
        value: 8,
        unit: '个',
        comparison: 14.3,
        abnormal: false,
      },
    ];
  } else if (flowType === 'exit') {
    coreIndicators = [
      {
        key: 'totalFlow',
        name: '总出场车流量',
        value: 15_200,
        unit: '车次',
        comparison: 10.8,
        abnormal: false,
      },
      {
        key: 'peakFlow',
        name: '出场高峰车流',
        value: 2000,
        unit: '车次',
        comparison: 12.5,
        abnormal: true,
      },
      {
        key: 'flowDensity',
        name: '平均车流密度',
        value: 152,
        unit: '车次/停车场',
        comparison: 4.8,
        abnormal: false,
      },
      {
        key: 'utilizationRate',
        name: '平均利用率',
        value: 76.2,
        unit: '%',
        comparison: 2.5,
        abnormal: false,
      },
      {
        key: 'hotspotCount',
        name: '热点区域数',
        value: 7,
        unit: '个',
        comparison: 12.1,
        abnormal: false,
      },
    ];
  } else {
    // total 总车流
    coreIndicators = [
      {
        key: 'totalFlow',
        name: '总车流量',
        value: 31_000,
        unit: '车次',
        comparison: 8.5,
        abnormal: false,
      },
      {
        key: 'peakFlow',
        name: '高峰车流量',
        value: 4400,
        unit: '车次',
        comparison: 12.3,
        abnormal: true,
      },
      {
        key: 'flowDensity',
        name: '平均车流密度',
        value: 156,
        unit: '车次/停车场',
        comparison: 5.7,
        abnormal: false,
      },
      {
        key: 'utilizationRate',
        name: '平均利用率',
        value: 78.5,
        unit: '%',
        comparison: 3.2,
        abnormal: false,
      },
      {
        key: 'hotspotCount',
        name: '热点区域数',
        value: 8,
        unit: '个',
        comparison: 14.3,
        abnormal: false,
      },
    ];
  }

  // 根据车流类型生成区域车流密度数据
  let heatmapData;
  if (flowType === 'entry') {
    heatmapData = {
      芗城区: 2250,
      龙文区: 1900,
      龙海区: 1400,
      漳浦县: 1050,
      云霄县: 900,
      诏安县: 600,
      平和县: 475,
      南靖县: 550,
      华安县: 425,
      东山县: 360,
      长泰区: 675,
    };
  } else if (flowType === 'exit') {
    heatmapData = {
      芗城区: 2200,
      龙文区: 1850,
      龙海区: 1350,
      漳浦县: 1025,
      云霄县: 875,
      诏安县: 590,
      平和县: 465,
      南靖县: 540,
      华安县: 415,
      东山县: 355,
      长泰区: 665,
    };
  } else {
    heatmapData = {
      芗城区: 4500,
      龙文区: 3800,
      龙海区: 2800,
      漳浦县: 2100,
      云霄县: 1800,
      诏安县: 1200,
      平和县: 950,
      南靖县: 1100,
      华安县: 850,
      东山县: 720,
      长泰区: 1350,
    };
  }

  // 根据车流类型生成时段分布数据
  let timeDistribution;
  if (flowType === 'entry') {
    timeDistribution = {
      total: [120, 80, 150, 300, 900, 850, 600, 450, 300, 250, 200, 150],
      entry: [120, 80, 150, 300, 900, 850, 600, 450, 300, 250, 200, 150],
      exit: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    };
  } else if (flowType === 'exit') {
    timeDistribution = {
      total: [90, 60, 120, 250, 780, 850, 920, 600, 480, 520, 380, 220],
      entry: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      exit: [90, 60, 120, 250, 780, 850, 920, 600, 480, 520, 380, 220],
    };
  } else {
    timeDistribution = {
      total: [240, 160, 290, 550, 1680, 1670, 1520, 1050, 790, 770, 580, 370],
      entry: [120, 80, 150, 300, 900, 850, 600, 450, 300, 250, 200, 150],
      exit: [120, 80, 140, 250, 780, 820, 920, 600, 490, 520, 380, 220],
    };
  }

  // 根据车流类型生成类型分布数据
  let typeDistribution;
  if (flowType === 'entry') {
    typeDistribution = [
      { value: 7900, name: '公共停车场' },
      { value: 4250, name: '路侧停车场' },
      { value: 1820, name: '专用停车场' },
    ];
  } else if (flowType === 'exit') {
    typeDistribution = [
      { value: 7600, name: '公共停车场' },
      { value: 4100, name: '路侧停车场' },
      { value: 1760, name: '专用停车场' },
    ];
  } else {
    typeDistribution = [
      { value: 18_600, name: '公共停车场' },
      { value: 8680, name: '路侧停车场' },
      { value: 3720, name: '专用停车场' },
    ];
  }

  // 根据车流类型生成热点区域数据
  let hotspotData;
  if (flowType === 'entry') {
    hotspotData = [
      {
        rank: 1,
        regionName: '芗城区',
        parkingCount: 42,
        totalFlow: 2250,
        entryFlow: 2250,
        exitFlow: 0,
        flowDensity: 53.6,
        peakHour: '08:00-10:00',
        growthRate: 12.5,
      },
      {
        rank: 2,
        regionName: '龙文区',
        parkingCount: 35,
        totalFlow: 1900,
        entryFlow: 1900,
        exitFlow: 0,
        flowDensity: 54.3,
        peakHour: '07:00-09:00',
        growthRate: 8.3,
      },
      {
        rank: 3,
        regionName: '龙海区',
        parkingCount: 28,
        totalFlow: 1400,
        entryFlow: 1400,
        exitFlow: 0,
        flowDensity: 50,
        peakHour: '17:00-19:00',
        growthRate: 15.7,
      },
      {
        rank: 4,
        regionName: '漳浦县',
        parkingCount: 22,
        totalFlow: 1050,
        entryFlow: 1050,
        exitFlow: 0,
        flowDensity: 47.7,
        peakHour: '09:00-11:00',
        growthRate: 6.2,
      },
      {
        rank: 5,
        regionName: '云霄县',
        parkingCount: 18,
        totalFlow: 900,
        entryFlow: 900,
        exitFlow: 0,
        flowDensity: 50,
        peakHour: '10:00-12:00',
        growthRate: 10.4,
      },
    ];
  } else if (flowType === 'exit') {
    hotspotData = [
      {
        rank: 1,
        regionName: '芗城区',
        parkingCount: 42,
        totalFlow: 2200,
        entryFlow: 0,
        exitFlow: 2200,
        flowDensity: 52.4,
        peakHour: '18:00-20:00',
        growthRate: 10.8,
      },
      {
        rank: 2,
        regionName: '龙文区',
        parkingCount: 35,
        totalFlow: 1850,
        entryFlow: 0,
        exitFlow: 1850,
        flowDensity: 52.9,
        peakHour: '17:00-19:00',
        growthRate: 7.5,
      },
      {
        rank: 3,
        regionName: '龙海区',
        parkingCount: 28,
        totalFlow: 1350,
        entryFlow: 0,
        exitFlow: 1350,
        flowDensity: 48.2,
        peakHour: '19:00-21:00',
        growthRate: 12.3,
      },
      {
        rank: 4,
        regionName: '漳浦县',
        parkingCount: 22,
        totalFlow: 1025,
        entryFlow: 0,
        exitFlow: 1025,
        flowDensity: 46.6,
        peakHour: '20:00-22:00',
        growthRate: 5.8,
      },
      {
        rank: 5,
        regionName: '云霄县',
        parkingCount: 18,
        totalFlow: 875,
        entryFlow: 0,
        exitFlow: 875,
        flowDensity: 48.6,
        peakHour: '21:00-23:00',
        growthRate: 9.2,
      },
    ];
  } else {
    hotspotData = [
      {
        rank: 1,
        regionName: '芗城区',
        parkingCount: 42,
        totalFlow: 4500,
        entryFlow: 2250,
        exitFlow: 2250,
        flowDensity: 107.1,
        peakHour: '08:00-10:00',
        growthRate: 12.5,
      },
      {
        rank: 2,
        regionName: '龙文区',
        parkingCount: 35,
        totalFlow: 3800,
        entryFlow: 1900,
        exitFlow: 1900,
        flowDensity: 108.6,
        peakHour: '07:00-09:00',
        growthRate: 8.3,
      },
      {
        rank: 3,
        regionName: '龙海区',
        parkingCount: 28,
        totalFlow: 2800,
        entryFlow: 1400,
        exitFlow: 1400,
        flowDensity: 100,
        peakHour: '17:00-19:00',
        growthRate: 15.7,
      },
      {
        rank: 4,
        regionName: '漳浦县',
        parkingCount: 22,
        totalFlow: 2100,
        entryFlow: 1050,
        exitFlow: 1050,
        flowDensity: 95.5,
        peakHour: '09:00-11:00',
        growthRate: 6.2,
      },
      {
        rank: 5,
        regionName: '云霄县',
        parkingCount: 18,
        totalFlow: 1800,
        entryFlow: 900,
        exitFlow: 900,
        flowDensity: 100,
        peakHour: '10:00-12:00',
        growthRate: 10.4,
      },
    ];
  }

  // 生成表格数据
  const tableData = [];
  const days =
    timeRange === 'today'
      ? 1
      : timeRange === '7'
        ? 7
        : timeRange === '30'
          ? 30
          : 15;

  for (let i = 0; i < Math.min(days, 30); i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    let entryFlow, exitFlow, totalFlow;

    if (flowType === 'entry') {
      entryFlow = Math.floor(Math.random() * 2000) + 1000;
      exitFlow = 0;
      totalFlow = entryFlow;
    } else if (flowType === 'exit') {
      entryFlow = 0;
      exitFlow = Math.floor(Math.random() * 2000) + 950;
      totalFlow = exitFlow;
    } else {
      entryFlow = Math.floor(Math.random() * 1000) + 500;
      exitFlow = Math.floor(Math.random() * 1000) + 475;
      totalFlow = entryFlow + exitFlow;
    }

    const morningPeak =
      flowType === 'exit'
        ? 0
        : Math.floor(entryFlow * 0.2) + Math.floor(Math.random() * 100);
    const eveningPeak =
      flowType === 'entry'
        ? 0
        : Math.floor(exitFlow * 0.25) + Math.floor(Math.random() * 100);
    const peakRatio =
      totalFlow > 0
        ? Number.parseFloat(
            (((morningPeak + eveningPeak) / totalFlow) * 100).toFixed(1),
          )
        : 0;

    tableData.push({
      date: dateStr,
      regionName: region || '芗城区',
      parkingType: parkingType || '公共停车场',
      totalFlow,
      entryFlow,
      exitFlow,
      morningPeak,
      eveningPeak,
      peakRatio,
      utilizationRate: Number.parseFloat((Math.random() * 30 + 65).toFixed(1)),
    });
  }

  // 按日期倒序排列
  tableData.sort((a, b) => new Date(b.date) - new Date(a.date));

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
 * 生成车流分布报表CSV文件
 * @param {object} params 导出参数
 * @returns {Promise} 模拟导出
 */
export const exportFlowDistributionReport = async (params) => {
  try {
    const data = await getFlowDistributionReport(params);

    // 生成CSV内容
    const headers = [
      '日期',
      '行政区划',
      '停车场类型',
      '总车流量',
      '入场车流',
      '出场车流',
      '早高峰车流',
      '晚高峰车流',
      '高峰占比(%)',
      '利用率(%)',
    ];

    const csvRows = data.tableData.map((item) => [
      item.date,
      item.regionName,
      item.parkingType,
      item.totalFlow,
      item.entryFlow,
      item.exitFlow,
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
    link.download = `车流分布报表_${data.flowType}_${Date.now()}.csv`;

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
