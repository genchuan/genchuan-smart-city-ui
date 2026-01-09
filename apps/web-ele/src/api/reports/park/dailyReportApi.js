// 日报表API - 包含模拟数据
import { ElMessage } from 'element-plus';

/**
 * 模拟日报表数据
 * @param {string} date 日期，格式：YYYY-MM-DD
 * @param {string} regionType 区域类型：area/business
 * @returns {Promise} 模拟数据
 */
export const getDailyReport = async (params) => {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 500));

  const { date = '2023-12-21', regionType = 'area' } = params;

  // 模拟核心指标数据
  const coreIndicators = [
    {
      key: 'totalEnter',
      name: '总入场车次',
      value: 8500,
      unit: '次',
      comparison: 5, // 与近7日均值偏差5%
      abnormal: false,
    },
    {
      key: 'totalExit',
      name: '总出场车次',
      value: 8450,
      unit: '次',
      comparison: 4,
      abnormal: false,
    },
    {
      key: 'totalRevenue',
      name: '总收费金额',
      value: 152_000,
      unit: '元',
      comparison: 52, // 与近7日均值偏差52%
      abnormal: true,
    },
    {
      key: 'avgUtilization',
      name: '平均泊位利用率',
      value: 68,
      unit: '%',
      comparison: 8,
      abnormal: false,
    },
    {
      key: 'warningCount',
      name: '预警总数',
      value: 56,
      unit: '条',
      comparison: 86, // 与近7日均值偏差86%
      abnormal: true,
    },
    {
      key: 'faultCount',
      name: '故障设备数',
      value: 12,
      unit: '台',
      comparison: 10,
      abnormal: false,
    },
  ];

  // 模拟分区域数据（行政区划）
  const regionData =
    regionType === 'area'
      ? [
          {
            areaName: '芗城区',
            district: '芗城',
            enterCount: 4200,
            exitCount: 4180,
            revenue: 82_000,
            totalBerths: 1500,
            usedBerths: 1020,
            utilizationRate: 68,
            warningCount: 32,
            faultCount: 5,
            memberRevenue: 28_000,
          },
          {
            areaName: '龙文区',
            district: '龙文',
            enterCount: 3800,
            exitCount: 3780,
            revenue: 65_000,
            totalBerths: 1200,
            usedBerths: 840,
            utilizationRate: 70,
            warningCount: 18,
            faultCount: 4,
            memberRevenue: 22_000,
          },
          {
            areaName: '龙海区',
            district: '龙海',
            enterCount: 2800,
            exitCount: 2780,
            revenue: 38_000,
            totalBerths: 800,
            usedBerths: 520,
            utilizationRate: 65,
            warningCount: 4,
            faultCount: 2,
            memberRevenue: 12_000,
          },
          {
            areaName: '长泰区',
            district: '长泰',
            enterCount: 1800,
            exitCount: 1780,
            revenue: 22_000,
            totalBerths: 500,
            usedBerths: 340,
            utilizationRate: 68,
            warningCount: 2,
            faultCount: 1,
            memberRevenue: 8000,
          },
          {
            areaName: '漳浦县',
            district: '漳浦',
            enterCount: 1500,
            exitCount: 1480,
            revenue: 18_000,
            totalBerths: 400,
            usedBerths: 260,
            utilizationRate: 65,
            warningCount: 0,
            faultCount: 0,
            memberRevenue: 6000,
          },
        ]
      : [
          // 如果是商圈统计维度
          {
            areaName: '万达商圈',
            district: '芗城',
            enterCount: 2800,
            exitCount: 2780,
            revenue: 58_000,
            totalBerths: 800,
            usedBerths: 560,
            utilizationRate: 70,
            warningCount: 18,
            faultCount: 3,
            memberRevenue: 18_000,
          },
          {
            areaName: '古城商圈',
            district: '芗城',
            enterCount: 2200,
            exitCount: 2180,
            revenue: 42_000,
            totalBerths: 600,
            usedBerths: 420,
            utilizationRate: 70,
            warningCount: 12,
            faultCount: 2,
            memberRevenue: 14_000,
          },
          {
            areaName: '碧湖商圈',
            district: '龙文',
            enterCount: 1800,
            exitCount: 1780,
            revenue: 32_000,
            totalBerths: 500,
            usedBerths: 350,
            utilizationRate: 70,
            warningCount: 8,
            faultCount: 1,
            memberRevenue: 10_000,
          },
        ];

  // 模拟异常数据
  const abnormalities = [
    {
      id: 1,
      metric: 'totalRevenue',
      message: '总收费金额152000元，较近7日均值增长52%，超出阈值',
      currentValue: 152_000,
      referenceValue: 100_000,
      deviation: 52,
      rule: '与近7日均值偏差超过30%',
      severity: 'high',
    },
    {
      id: 2,
      metric: 'warningCount',
      message: '预警总数56条，较近7日均值增长86%，超出阈值',
      currentValue: 56,
      referenceValue: 30,
      deviation: 86,
      rule: '与近7日均值偏差超过30%',
      severity: 'medium',
    },
  ];

  return {
    date,
    regionType,
    coreIndicators,
    regionData,
    abnormalities,
    generatedAt: new Date().toISOString(),
  };
};

/**
 * 生成日报表CSV文件
 * @param {object} params 导出参数
 * @returns {Promise} 模拟导出
 */
export const exportDailyReport = async (params) => {
  try {
    const data = await getDailyReport(params);

    // 生成CSV内容 - 核心指标
    const coreHeaders = ['指标名称', '指标值', '单位', '同比变化', '状态'];
    const coreRows = data.coreIndicators.map((item) => [
      item.name,
      item.value,
      item.unit,
      `${item.comparison > 0 ? '+' : ''}${item.comparison}%`,
      item.abnormal ? '异常' : '正常',
    ]);

    // 区域数据
    const regionHeaders = [
      '区域名称',
      '行政区',
      '入场车次',
      '出场车次',
      '收费金额(元)',
      '总泊位数',
      '已用泊位',
      '利用率(%)',
      '预警数量',
      '故障设备',
      '会员收入(元)',
    ];
    const regionRows = data.regionData.map((item) => [
      item.areaName,
      item.district,
      item.enterCount,
      item.exitCount,
      item.revenue,
      item.totalBerths,
      item.usedBerths,
      item.utilizationRate,
      item.warningCount,
      item.faultCount,
      item.memberRevenue,
    ]);

    // 异常数据
    const abnormalHeaders = [
      '异常指标',
      '异常描述',
      '当前值',
      '参考值',
      '偏差',
      '严重等级',
    ];
    const abnormalRows = data.abnormalities.map((item) => [
      item.metric === 'totalRevenue' ? '总收费金额' : '预警总数',
      item.message,
      item.currentValue,
      item.referenceValue,
      `${item.deviation}%`,
      item.severity === 'high'
        ? '高'
        : item.severity === 'medium'
          ? '中'
          : '低',
    ]);

    // 合并所有数据
    const csvContent = [
      `日运营报表 - ${data.date} (${data.regionType === 'area' ? '行政区划' : '商圈'})`,
      '核心指标汇总',
      coreHeaders.join(','),
      ...coreRows.map((row) => row.join(',')),
      '',
      '分区域运营明细',
      regionHeaders.join(','),
      ...regionRows.map((row) => row.join(',')),
      '',
      '异常指标监控',
      abnormalHeaders.join(','),
      ...abnormalRows.map((row) => row.join(',')),
    ].join('\n');

    // 创建Blob并下载
    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `日运营报表_${data.date}_${data.regionType === 'area' ? '行政区划' : '商圈'}.csv`;

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
