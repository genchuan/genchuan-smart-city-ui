// 月报表API - 包含模拟数据
import { ElMessage } from 'element-plus';
/**
 * 模拟月报表数据
 * @param {object} params 参数对象
 * @param {string} params.month 月份，格式：YYYY-MM
 * @param {string} params.parkingType 停车场类型：all/public/roadside/special
 * @returns {Promise} 模拟数据
 */
export const getMonthlyReport = async (params) => {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 500));

  const { month = '2023-12', parkingType = 'all' } = params;

  // 基础数据定义 - 确保全部类型 > 各分类型总和
  const typeDataMap = {
    public: {
      count: 25,
      totalBerths: 8500,
      baseEnter: 3000,
      baseRevenue: 60000,
      baseUtilization: 68,
      revenue: 2_200_000,
    },
    roadside: {
      count: 38,
      totalBerths: 4200,
      baseEnter: 2500,
      baseRevenue: 40000,
      baseUtilization: 72,
      revenue: 1_200_000,
    },
    special: {
      count: 12,
      totalBerths: 2800,
      baseEnter: 1500,
      baseRevenue: 20000,
      baseUtilization: 45,
      revenue: 400_000,
    },
  };

  // 全部类型的基础值 = 各分类型基础值之和
  const allTypeBase = {
    baseEnter: Object.values(typeDataMap).reduce((sum, item) => sum + item.baseEnter, 0), // 3000 + 2500 + 1500 = 7000
    baseRevenue: Object.values(typeDataMap).reduce((sum, item) => sum + item.baseRevenue, 0), // 60000 + 40000 + 20000 = 120000
    baseUtilization: Math.round(
      Object.values(typeDataMap).reduce((sum, item) => sum + item.baseUtilization * item.count, 0) /
      Object.values(typeDataMap).reduce((sum, item) => sum + item.count, 0)
    ), // 加权平均
  };

  // 根据停车类型选择基础值
  const baseData = parkingType === 'all'
    ? allTypeBase
    : typeDataMap[parkingType];

  // 模拟月度每日数据（12月有31天）
  const monthlyData = [];
  let totalEnter = 0;
  let totalExit = 0;
  let totalRevenue = 0;
  let totalUtilization = 0;

  for (let i = 1; i <= 31; i++) {
    const day = i.toString().padStart(2, '0');
    const date = `${month}-${day}`;

    // 模拟波动数据 - 使用选定的基础值
    const baseEnter = baseData.baseEnter;
    const baseRevenue = baseData.baseRevenue;
    const baseUtilization = baseData.baseUtilization;

    // 添加随机波动（周末数据更高）
    const dayOfWeek = new Date(date).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const weekendMultiplier = isWeekend ? 1.3 : 1;

    // 添加趋势增长（月初到月末逐步增长）
    const trendMultiplier = 1 + (i / 31) * 0.2;

    const enterCount = Math.round(
      baseEnter * weekendMultiplier * trendMultiplier + Math.random() * 500,
    );
    const exitCount = Math.round(
      baseEnter * weekendMultiplier * trendMultiplier + Math.random() * 500,
    );
    const revenue = Math.round(
      baseRevenue * weekendMultiplier * trendMultiplier +
      Math.random() * 20_000,
    );
    const utilizationRate = Math.round(
      baseUtilization + (isWeekend ? 5 : 0) + Math.random() * 10,
    );

    monthlyData.push({
      date,
      enterCount,
      exitCount,
      revenue,
      utilizationRate,
      warningCount: Math.round(Math.random() * 10),
      faultCount: Math.round(Math.random() * 3),
      faultHandleRate: 90 + Math.round(Math.random() * 10),
      warningHandleRate: 85 + Math.round(Math.random() * 15),
    });

    // 累加月度总计
    totalEnter += enterCount;
    totalExit += exitCount;
    totalRevenue += revenue;
    totalUtilization += utilizationRate;
  }

  // 计算平均值
  const avgUtilization = Math.round(totalUtilization / 31);
  const avgFaultHandleRate = Math.round(
    monthlyData.reduce((sum, item) => sum + item.faultHandleRate, 0) / 31
  );
  const avgWarningHandleRate = Math.round(
    monthlyData.reduce((sum, item) => sum + item.warningHandleRate, 0) / 31
  );

  // 动态计算月度核心指标（基于实际monthlyData）
  const monthlyIndicators = [
    {
      key: 'totalEnter',
      name: '总入场车次',
      value: totalEnter,
      unit: '次',
      comparison: 12,
      lastMonth: Math.round(totalEnter / 1.12),
      abnormal: false,
    },
    {
      key: 'totalExit',
      name: '总出场车次',
      value: totalExit,
      unit: '次',
      comparison: 11,
      lastMonth: Math.round(totalExit / 1.11),
      abnormal: false,
    },
    {
      key: 'totalRevenue',
      name: '总收费金额',
      value: totalRevenue,
      unit: '元',
      comparison: 20,
      lastMonth: Math.round(totalRevenue / 1.2),
      abnormal: totalRevenue > 4_000_000,
    },
    {
      key: 'avgUtilization',
      name: '月均泊位利用率',
      value: avgUtilization,
      unit: '%',
      comparison: 8,
      lastMonth: Math.round(avgUtilization / 1.08),
      abnormal: false,
    },
    {
      key: 'faultHandleRate',
      name: '故障处置率',
      value: avgFaultHandleRate,
      unit: '%',
      comparison: 5,
      lastMonth: Math.round(avgFaultHandleRate / 1.05),
      abnormal: false,
    },
    {
      key: 'warningHandleRate',
      name: '预警处置率',
      value: avgWarningHandleRate,
      unit: '%',
      comparison: 7,
      lastMonth: Math.round(avgWarningHandleRate / 1.07),
      abnormal: false,
    },
  ];

  // 分类型统计数据
  let typeDistribution;
  if (parkingType === 'all') {
    // 计算各类型总收入
    const totalRevenueAll = typeDataMap.public.revenue +
      typeDataMap.roadside.revenue +
      typeDataMap.special.revenue;

    typeDistribution = [
      {
        type: 'public',
        count: typeDataMap.public.count,
        totalBerths: typeDataMap.public.totalBerths,
        revenue: typeDataMap.public.revenue,
        revenuePercentage: Math.round(typeDataMap.public.revenue / totalRevenueAll * 100),
        utilizationRate: typeDataMap.public.baseUtilization,
      },
      {
        type: 'roadside',
        count: typeDataMap.roadside.count,
        totalBerths: typeDataMap.roadside.totalBerths,
        revenue: typeDataMap.roadside.revenue,
        revenuePercentage: Math.round(typeDataMap.roadside.revenue / totalRevenueAll * 100),
        utilizationRate: typeDataMap.roadside.baseUtilization,
      },
      {
        type: 'special',
        count: typeDataMap.special.count,
        totalBerths: typeDataMap.special.totalBerths,
        revenue: typeDataMap.special.revenue,
        revenuePercentage: Math.round(typeDataMap.special.revenue / totalRevenueAll * 100),
        utilizationRate: typeDataMap.special.baseUtilization,
      },
    ];
  } else {
    // 根据停车类型返回对应的数据
    const typeData = typeDataMap[parkingType];
    typeDistribution = [
      {
        type: parkingType,
        count: typeData.count,
        totalBerths: typeData.totalBerths,
        revenue: typeData.revenue,
        revenuePercentage: 100,
        utilizationRate: typeData.baseUtilization,
      },
    ];
  }

  return {
    month,
    parkingType,
    monthlyIndicators,
    typeDistribution,
    monthlyData,
    generatedAt: new Date().toISOString(),
  };
};

/**
 * 生成月报表CSV文件
 * @param {object} params 导出参数
 * @returns {Promise} 模拟导出
 */
export const exportMonthlyReport = async (params) => {
  try {
    const data = await getMonthlyReport(params);

    // 停车类型映射
    const parkingTypeMap = {
      all: '全部',
      public: '公共停车场',
      roadside: '路侧停车场',
      special: '专用停车场',
    };

    // 类型名称映射
    const typeNameMap = {
      public: '公共停车场',
      roadside: '路侧停车场',
      special: '专用停车场',
    };

    // 生成CSV内容 - 核心指标
    const coreHeaders = [
      '指标名称',
      '本月值',
      '单位',
      '上月值',
      '环比增长',
      '状态',
    ];
    const coreRows = data.monthlyIndicators.map((item) => [
      item.name,
      item.value,
      item.unit,
      item.lastMonth,
      `${item.comparison > 0 ? '+' : ''}${item.comparison}%`,
      item.abnormal ? '异常' : '正常',
    ]);

    // 类型分布数据
    const typeHeaders = [
      '停车场类型',
      '数量(个)',
      '总泊位数',
      '收入金额(元)',
      '收入占比(%)',
      '平均利用率(%)',
    ];
    const typeRows = data.typeDistribution.map((item) => [
      typeNameMap[item.type] || '未知类型',
      item.count,
      item.totalBerths,
      item.revenue,
      item.revenuePercentage,
      item.utilizationRate,
    ]);

    // 每日明细数据
    const dailyHeaders = [
      '日期',
      '入场车次',
      '出场车次',
      '收费金额(元)',
      '利用率(%)',
      '预警数量',
      '故障数量',
      '故障处置率(%)',
      '预警处置率(%)',
    ];
    const dailyRows = data.monthlyData.map((item) => [
      item.date,
      item.enterCount,
      item.exitCount,
      item.revenue,
      item.utilizationRate,
      item.warningCount,
      item.faultCount,
      item.faultHandleRate,
      item.warningHandleRate,
    ]);

    // 计算月度合计
    const totalEnter = data.monthlyData.reduce(
      (sum, item) => sum + item.enterCount,
      0,
    );
    const totalExit = data.monthlyData.reduce(
      (sum, item) => sum + item.exitCount,
      0,
    );
    const totalRevenue = data.monthlyData.reduce(
      (sum, item) => sum + item.revenue,
      0,
    );
    const avgUtilization = (
      data.monthlyData.reduce((sum, item) => sum + item.utilizationRate, 0) /
      data.monthlyData.length
    ).toFixed(1);
    const totalWarning = data.monthlyData.reduce(
      (sum, item) => sum + item.warningCount,
      0,
    );
    const totalFault = data.monthlyData.reduce(
      (sum, item) => sum + item.faultCount,
      0,
    );
    const avgFaultHandleRate = (
      data.monthlyData.reduce((sum, item) => sum + item.faultHandleRate, 0) /
      data.monthlyData.length
    ).toFixed(1);
    const avgWarningHandleRate = (
      data.monthlyData.reduce((sum, item) => sum + item.warningHandleRate, 0) /
      data.monthlyData.length
    ).toFixed(1);

    const summaryRow = [
      '月度合计',
      totalEnter,
      totalExit,
      totalRevenue,
      avgUtilization,
      totalWarning,
      totalFault,
      avgFaultHandleRate,
      avgWarningHandleRate,
    ];

    // 合并所有数据
    const csvContent = [
      `月运营报表 - ${data.month} (${parkingTypeMap[data.parkingType] || '未知类型'})`,
      '核心指标汇总',
      coreHeaders.join(','),
      ...coreRows.map((row) => row.join(',')),
      '',
      '停车场类型分布统计',
      typeHeaders.join(','),
      ...typeRows.map((row) => row.join(',')),
      '',
      '每日运营明细表',
      dailyHeaders.join(','),
      ...dailyRows.map((row) => row.join(',')),
      summaryRow.join(','),
    ].join('\n');

    // 创建Blob并下载
    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `月运营报表_${data.month}_${data.parkingType}.csv`;

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
