// 月报表API - 包含模拟数据

/**
 * 模拟月报表数据
 * @param {string} month 月份，格式：YYYY-MM
 * @param {string} parkingType 停车场类型：all/public/roadside/special
 * @returns {Promise} 模拟数据
 */
export const getMonthlyReport = async (params) => {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 500));

  const { month = '2023-12', parkingType = 'all' } = params;

  // 模拟月度核心指标
  const monthlyIndicators = [
    {
      key: 'totalEnter',
      name: '总入场车次',
      value: 256_000,
      unit: '次',
      comparison: 12, // 较上月增长12%
      lastMonth: 228_571,
      abnormal: false,
    },
    {
      key: 'totalExit',
      name: '总出场车次',
      value: 254_800,
      unit: '次',
      comparison: 11,
      lastMonth: 229_545,
      abnormal: false,
    },
    {
      key: 'totalRevenue',
      name: '总收费金额',
      value: 3_800_000,
      unit: '元',
      comparison: 20, // 较上月增长20%
      lastMonth: 3_166_666,
      abnormal: true,
    },
    {
      key: 'avgUtilization',
      name: '月均泊位利用率',
      value: 65,
      unit: '%',
      comparison: 8,
      lastMonth: 60,
      abnormal: false,
    },
    {
      key: 'faultHandleRate',
      name: '故障处置率',
      value: 95,
      unit: '%',
      comparison: 5,
      lastMonth: 90,
      abnormal: false,
    },
    {
      key: 'warningHandleRate',
      name: '预警处置率',
      value: 92,
      unit: '%',
      comparison: 7,
      lastMonth: 86,
      abnormal: false,
    },
  ];

  // 模拟分类型统计数据
  const typeDistribution =
    parkingType === 'all'
      ? [
          {
            type: 'public',
            count: 25,
            totalBerths: 8500,
            revenue: 2_200_000,
            revenuePercentage: 58,
            utilizationRate: 68,
          },
          {
            type: 'roadside',
            count: 38,
            totalBerths: 4200,
            revenue: 1_200_000,
            revenuePercentage: 32,
            utilizationRate: 72,
          },
          {
            type: 'special',
            count: 12,
            totalBerths: 2800,
            revenue: 400_000,
            revenuePercentage: 10,
            utilizationRate: 45,
          },
        ]
      : [
          // 如果指定了特定类型，只返回该类型数据
          {
            type: parkingType,
            count:
              parkingType === 'public'
                ? 25
                : parkingType === 'roadside'
                  ? 38
                  : 12,
            totalBerths:
              parkingType === 'public'
                ? 8500
                : parkingType === 'roadside'
                  ? 4200
                  : 2800,
            revenue:
              parkingType === 'public'
                ? 2_200_000
                : parkingType === 'roadside'
                  ? 1_200_000
                  : 400_000),
            revenuePercentage: 100,
            utilizationRate:
              parkingType === 'public'
                ? 68
                : parkingType === 'roadside'
                  ? 72
                  : 45,
          },
        ];

  // 模拟月度每日数据（12月有31天）
  const monthlyData = [];
  for (let i = 1; i <= 31; i++) {
    const day = i.toString().padStart(2, '0');
    const date = `${month}-${day}`;

    // 模拟波动数据
    const baseEnter = 8000;
    const baseRevenue = 120_000;
    const baseUtilization = 65;

    // 添加随机波动（周末数据更高）
    const dayOfWeek = new Date(date).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const weekendMultiplier = isWeekend ? 1.3 : 1;

    // 添加趋势增长（月初到月末逐步增长）
    const trendMultiplier = 1 + (i / 31) * 0.2;

    monthlyData.push({
      date,
      enterCount: Math.round(
        baseEnter * weekendMultiplier * trendMultiplier + Math.random() * 500,
      ),
      exitCount: Math.round(
        baseEnter * weekendMultiplier * trendMultiplier + Math.random() * 500,
      ),
      revenue: Math.round(
        baseRevenue * weekendMultiplier * trendMultiplier +
          Math.random() * 20_000,
      ),
      utilizationRate: Math.round(
        baseUtilization + (isWeekend ? 5 : 0) + Math.random() * 10,
      ),
      warningCount: Math.round(Math.random() * 10),
      faultCount: Math.round(Math.random() * 3),
      faultHandleRate: 90 + Math.round(Math.random() * 10),
      warningHandleRate: 85 + Math.round(Math.random() * 15),
    });
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
 * 模拟导出月报表数据
 * @param {object} params 导出参数
 * @returns {Promise} 模拟导出
 */
export const exportMonthlyReport = async (params) => {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const { month = '2023-12', parkingType = 'all' } = params;

  // 模拟导出逻辑
  console.log(`导出月报表：月份=${month}, 停车场类型=${parkingType}`);

  // 在实际应用中，这里应该返回一个文件下载
  // 模拟创建一个Blob对象并触发下载
  const data = await getMonthlyReport(params);
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  // 创建下载链接
  const a = document.createElement('a');
  a.href = url;
  a.download = `月运营报表_${month}_${parkingType}.json`;
  document.body.append(a);
  a.click();

  // 清理
  setTimeout(() => {
    a.remove();
    URL.revokeObjectURL(url);
  }, 100);

  return {
    success: true,
    message: '导出成功',
    filename: `月运营报表_${month}_${parkingType}.xlsx`,
    data,
  };
};
