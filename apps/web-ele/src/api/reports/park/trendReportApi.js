// 趋势报表API - 包含模拟数据
import { ElMessage } from 'element-plus';

/**
 * 模拟趋势报表数据
 * @param {string} timeRange 时间范围：3/6/12/custom
 * @param {Array} indicators 指标数组
 * @param {string} startMonth 开始月份（仅custom时使用）
 * @param {string} endMonth 结束月份（仅custom时使用）
 * @returns {Promise} 模拟数据
 */
export const getTrendReport = async (params) => {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 500));

  const {
    timeRange = '6',
    indicators = ['revenue', 'enterCount'],
    startMonth = '2023-07',
    endMonth = '2023-12',
  } = params;

  // 计算时间范围
  const months = [];
  let monthCount = Number.parseInt(timeRange);

  if (timeRange === 'custom') {
    // 解析自定义时间范围
    const start = new Date(`${startMonth}-01`);
    const end = new Date(`${endMonth}-01`);

    const current = new Date(start);
    while (current <= end) {
      const year = current.getFullYear();
      const month = current.getMonth() + 1;
      months.push(`${year}-${month.toString().padStart(2, '0')}`);
      current.setMonth(current.getMonth() + 1);
    }
    monthCount = months.length;
  } else {
    // 生成最近N个月的数据
    const currentDate = new Date();
    for (let i = monthCount - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(currentDate.getMonth() - i);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      months.push(`${year}-${month.toString().padStart(2, '0')}`);
    }
  }

  // 模拟趋势数据
  const trendData = months.map((month, index) => {
    // 基础值
    const baseRevenue = 2_800_000 + index * 100_000; // 每月增长10万
    const baseEnter = 200_000 + index * 10_000; // 每月增长1万
    const baseUtilization = 60 + index * 0.5; // 每月增长0.5%

    // 添加随机波动
    const revenue = baseRevenue + Math.random() * 200_000;
    const enterCount = baseEnter + Math.random() * 15_000;
    const utilizationRate = Math.min(
      85,
      Math.max(55, baseUtilization + Math.random() * 10),
    );

    // 计算环比增长率（相对于上个月）
    const revenueGrowth =
      index > 0
        ? Math.round(
            ((revenue - baseRevenue + 100_000) / (baseRevenue - 100_000) - 1) *
              100,
          )
        : 0;
    const enterCountGrowth =
      index > 0
        ? Math.round(
            ((enterCount - baseEnter + 10_000) / (baseEnter - 10_000) - 1) *
              100,
          )
        : 0;

    // 关键节点（模拟一些重要事件）
    const keyNodes = [];
    if (month === '2023-08') {
      keyNodes.push('新增3个路侧停车场');
    }
    if (month === '2023-10') {
      keyNodes.push('国庆黄金周活动');
    }
    if (month === '2023-11') {
      keyNodes.push('双十一促销活动');
    }
    if (month === '2023-12') {
      keyNodes.push('新增5个公共停车场');
    }

    return {
      month,
      revenue: Math.round(revenue),
      enterCount: Math.round(enterCount),
      utilizationRate: Math.round(utilizationRate),
      memberRevenue: Math.round(revenue * 0.3), // 会员消费占30%
      revenueGrowth,
      enterCountGrowth,
      keyNodes: keyNodes.join('; '),
    };
  });

  // 模拟关键节点
  const keyNodes = [
    {
      id: 1,
      month: '2023-08',
      date: '2023年8月',
      title: '新增3个路侧停车场',
      description:
        '在万达商圈、古城商圈、碧湖商圈各新增1个路侧停车场，新增泊位150个',
      type: 'new_parking',
      impact: 15, // 正面影响15%
    },
    {
      id: 2,
      month: '2023-10',
      date: '2023年10月',
      title: '国庆黄金周活动',
      description: '国庆期间推出停车优惠活动，免费停车时长从30分钟延长至60分钟',
      type: 'activity',
      impact: 25, // 正面影响25%
    },
    {
      id: 3,
      month: '2023-11',
      date: '2023年11月',
      title: '双十一促销活动',
      description: '推出会员充值优惠活动，充200送50，充500送150',
      type: 'activity',
      impact: 18, // 正面影响18%
    },
    {
      id: 4,
      month: '2023-12',
      date: '2023年12月',
      title: '新增5个公共停车场',
      description: '在市区主要交通枢纽新增5个公共停车场，新增泊位800个',
      type: 'new_parking',
      impact: 22, // 正面影响22%
    },
  ];

  // 模拟趋势分析
  const trendAnalysis = indicators.map((indicator) => {
    const firstValue = trendData[0][indicator];
    const lastValue = trendData[trendData.length - 1][indicator];
    const growthRate = Math.round(
      ((lastValue - firstValue) / firstValue) * 100,
    );

    let trend = 'stable';
    let description = '';

    switch (indicator) {
      case 'enterCount': {
        if (growthRate > 5) {
          trend = 'up';
          description = `入场车次稳步增长，累计增长${growthRate}%，表明停车需求持续增加。`;
        } else if (growthRate < -5) {
          trend = 'down';
          description = `入场车次有所下降，需要分析原因并采取措施。`;
        } else {
          description = `入场车次保持稳定，运营状况良好。`;
        }

        break;
      }
      case 'memberRevenue': {
        if (growthRate > 15) {
          trend = 'up';
          description = `会员消费金额大幅增长${growthRate}%，会员体系运营效果显著。`;
        } else {
          description = `会员消费金额保持稳定增长。`;
        }

        break;
      }
      case 'revenue': {
        if (growthRate > 10) {
          trend = 'up';
          description = `收费金额从${formatCurrency(firstValue)}增长至${formatCurrency(lastValue)}，整体呈上升趋势，累计增长${growthRate}%。主要得益于新增停车场和促销活动的开展。`;
        } else if (growthRate < -10) {
          trend = 'down';
          description = `收费金额呈下降趋势，需要关注市场变化和运营策略。`;
        } else {
          description = `收费金额保持稳定，建议继续优化运营效率。`;
        }

        break;
      }
      case 'utilizationRate': {
        if (growthRate > 3) {
          trend = 'up';
          description = `泊位利用率提升${growthRate}%，资源利用效率持续优化。`;
        } else if (growthRate < -3) {
          trend = 'down';
          description = `泊位利用率下降，需要调整资源配置。`;
        } else {
          description = `泊位利用率保持稳定，处于合理区间。`;
        }

        break;
      }
      // No default
    }

    return {
      indicator,
      currentValue: lastValue,
      growthRate,
      trend,
      description,
    };
  });

  return {
    timeRange,
    indicators,
    months,
    trendData,
    keyNodes,
    trendAnalysis,
    generatedAt: new Date().toISOString(),
  };
};

/**
 * 生成趋势报表CSV文件
 * @param {object} params 导出参数
 * @returns {Promise} 模拟导出
 */
export const exportTrendReport = async (params) => {
  try {
    const data = await getTrendReport(params);

    // 生成CSV内容 - 趋势数据
    const trendHeaders = [
      '月份',
      '收费金额(元)',
      '入场车次',
      '利用率(%)',
      '会员收入(元)',
      '收入环比增长(%)',
      '入场环比增长(%)',
      '关键事件',
    ];
    const trendRows = data.trendData.map((item) => [
      item.month,
      item.revenue,
      item.enterCount,
      item.utilizationRate,
      item.memberRevenue,
      `${item.revenueGrowth > 0 ? '+' : ''}${item.revenueGrowth}`,
      `${item.enterCountGrowth > 0 ? '+' : ''}${item.enterCountGrowth}`,
      item.keyNodes,
    ]);

    // 趋势分析数据
    const analysisHeaders = [
      '指标',
      '当前值',
      '累计增长率(%)',
      '趋势分析',
      '趋势方向',
    ];
    const analysisRows = data.trendAnalysis.map((item) => [
      item.indicator === 'revenue'
        ? '收费金额'
        : item.indicator === 'enterCount'
          ? '入场车次'
          : item.indicator === 'utilizationRate'
            ? '利用率'
            : '会员收入',
      formatCurrency(item.currentValue),
      `${item.growthRate > 0 ? '+' : ''}${item.growthRate}`,
      item.description,
      item.trend === 'up' ? '上升' : item.trend === 'down' ? '下降' : '稳定',
    ]);

    // 关键节点数据
    const keyNodeHeaders = [
      '序号',
      '时间',
      '事件标题',
      '事件描述',
      '影响度(%)',
    ];
    const keyNodeRows = data.keyNodes.map((node) => [
      node.id,
      node.date,
      node.title,
      node.description,
      node.impact,
    ]);

    // 合并所有数据
    const csvContent = [
      `趋势分析报表 - ${data.timeRange === 'custom' ? `${params.startMonth}至${params.endMonth}` : `最近${data.timeRange}个月`}`,
      '月度趋势数据明细',
      trendHeaders.join(','),
      ...trendRows.map((row) => row.join(',')),
      '',
      '趋势分析报告',
      analysisHeaders.join(','),
      ...analysisRows.map((row) => row.join(',')),
      '',
      '关键节点事件',
      keyNodeHeaders.join(','),
      ...keyNodeRows.map((row) => row.join(',')),
    ].join('\n');

    // 创建Blob并下载
    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `趋势报表_${data.timeRange}个月_${Date.now()}.csv`;

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

// 辅助函数：格式化金额
function formatCurrency(value) {
  if (value >= 100_000_000) {
    return `${(value / 100_000_000).toFixed(2)}亿`;
  } else if (value >= 10_000) {
    return `${(value / 10_000).toFixed(2)}万`;
  }
  return `${value.toFixed(2)}`;
}
