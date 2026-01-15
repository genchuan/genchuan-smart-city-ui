<script setup>
import { computed, onMounted, ref, watch } from 'vue';

import { Bottom, Download, Refresh, Top } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

// API
import {
  exportTrendReport,
  getTrendReport,
} from '#/api/reports/park/trendReportApi';
import ChartContainer from '#/views/report/park/component/ChartContainer.vue';
import DataTable from '#/views/report/park/component/DataTable.vue';
import LoadingOverlay from '#/views/report/park/component/LoadingOverlay.vue';
import ReportSection from '#/views/report/park/component/ReportSection.vue';
// 组件引入
import ReportToolbar from '#/views/report/park/component/ReportToolbar.vue';
// 工具函数
import {
  formatCurrency,
  getIndicatorColor,
  getIndicatorName,
  getTrendText,
  getTrendType,
} from '#/views/report/park/component/ReportUtils';

// 响应式数据
const timeRange = ref('6');
const customDateRange = ref([]);
const selectedIndicators = ref(['revenue', 'enterCount']);
const loading = ref(false);
const exporting = ref(false);
const chartType = ref('line');
const trendData = ref([]);
const trendAnalysis = ref([]);

// 强制图表重新渲染的key
const chartKey = ref(0);

// 表格列定义 - 改为计算属性，根据选中的指标动态生成
const tableColumns = computed(() => {
  const baseColumns = [{ prop: 'month', label: '月份', width: 120 }];

  // 动态添加指标列
  if (selectedIndicators.value.includes('revenue')) {
    baseColumns.push({ prop: 'revenue', label: '收费金额', width: 150, type: 'currency' });
  }
  if (selectedIndicators.value.includes('enterCount')) {
    baseColumns.push({ prop: 'enterCount', label: '入场车次', width: 120 });
  }
  if (selectedIndicators.value.includes('utilizationRate')) {
    baseColumns.push({ prop: 'utilizationRate', label: '泊位利用率', width: 150, type: 'percentage' });
  }
  if (selectedIndicators.value.includes('memberRevenue')) {
    baseColumns.push({ prop: 'memberRevenue', label: '会员消费金额', width: 150, type: 'currency' });
  }

  // 添加环比列（如果有对应指标）
  if (selectedIndicators.value.includes('revenue')) {
    baseColumns.push({ prop: 'revenueGrowth', label: '收费金额环比', width: 150, type: 'growth' });
  }
  if (selectedIndicators.value.includes('enterCount')) {
    baseColumns.push({ prop: 'enterCountGrowth', label: '入场车次环比', width: 150, type: 'growth' });
  }

  return baseColumns;
});

// 图表配置 - 确保响应指标变化
const chartOptions = computed(() => {
  // 确保指标数据存在
  if (!trendData.value || trendData.value.length === 0) {
    return {
      title: { text: '暂无数据', left: 'center' },
      xAxis: { type: 'category', data: [] },
      yAxis: { type: 'value' },
      series: []
    };
  }

  // 根据选中的指标生成series
  const series = selectedIndicators.value.map((indicator) => {
    const data = trendData.value.map((item) => item[indicator] || 0);

    return {
      name: getIndicatorName(indicator),
      type: chartType.value,
      data: data,
      yAxisIndex: getYAxisIndex(indicator),
      itemStyle: {
        color: getIndicatorColor(indicator),
      },
    };
  });

  // 动态生成图例
  const legendData = selectedIndicators.value.map(getIndicatorName);

  // 动态调整grid底部间距
  const bottomMargin = legendData.length > 2 ? '20%' : (legendData.length > 0 ? '15%' : '10%');

  return {
    title: {
      text: '运营趋势分析',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        let result = `${params[0].axisValue}<br/>`;
        params.forEach((param) => {
          const value = formatChartValue(param.value, param.seriesName);
          result += `${param.marker} ${param.seriesName}: ${value}<br/>`;
        });
        return result;
      },
    },
    legend: {
      data: legendData,
      bottom: 10,
      show: legendData.length > 0, // 有数据时才显示图例
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: bottomMargin,
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: trendData.value.map((item) => item.month),
      axisLabel: {
        interval: 0,
        rotate: 45,
      },
    },
    yAxis: [
      {
        type: 'value',
        name: '金额/车次',
        position: 'left',
        show: selectedIndicators.value.some(ind => getYAxisIndex(ind) === 0),
      },
      {
        type: 'value',
        name: '利用率(%)',
        position: 'right',
        max: 100,
        min: 0,
        show: selectedIndicators.value.some(ind => getYAxisIndex(ind) === 1),
      },
    ],
    series,
  };
});

// 趋势分析数据 - 只显示选中的指标
const processedTrendAnalysis = computed(() => {
  return selectedIndicators.value.map((indicator) => {
    // 从API返回的trendAnalysis中查找对应指标
    const analysis = trendAnalysis.value.find(item => item.indicator === indicator);
    if (analysis) {
      return analysis;
    }

    // 如果没有找到，动态计算
    if (trendData.value.length > 0) {
      const firstValue = trendData.value[0][indicator] || 0;
      const lastValue = trendData.value[trendData.value.length - 1][indicator] || 0;
      const growthRate = firstValue ? Math.round(((lastValue - firstValue) / firstValue) * 100) : 0;

      let trend = 'stable';
      let description = '';

      // 根据指标类型生成描述
      switch (indicator) {
        case 'enterCount':
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

        case 'memberRevenue':
          if (growthRate > 15) {
            trend = 'up';
            description = `会员消费金额大幅增长${growthRate}%，会员体系运营效果显著。`;
          } else {
            description = `会员消费金额保持稳定增长。`;
          }
          break;

        case 'revenue':
          if (growthRate > 10) {
            trend = 'up';
            description = `收费金额从${formatCurrency(firstValue)}增长至${formatCurrency(lastValue)}，整体呈上升趋势，累计增长${growthRate}%。`;
          } else if (growthRate < -10) {
            trend = 'down';
            description = `收费金额呈下降趋势，需要关注市场变化和运营策略。`;
          } else {
            description = `收费金额保持稳定，建议继续优化运营效率。`;
          }
          break;

        case 'utilizationRate':
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

        default:
          description = `${getIndicatorName(indicator)}保持${growthRate > 0 ? '增长' : '下降'}趋势。`;
      }

      return {
        indicator,
        currentValue: lastValue,
        growthRate,
        trend,
        description,
      };
    }

    // 默认返回
    return {
      indicator,
      currentValue: 0,
      growthRate: 0,
      trend: 'stable',
      description: '暂无数据',
    };
  });
});

// 获取Y轴索引
const getYAxisIndex = (indicator) => {
  if (indicator === 'utilizationRate') return 1;
  return 0;
};

// 格式化图表值
const formatChartValue = (value, seriesName) => {
  if (seriesName.includes('金额')) {
    return formatCurrency(value);
  }
  if (seriesName.includes('利用率')) {
    return `${value}%`;
  }
  return value.toLocaleString();
};

// 格式化值
const formatValue = (value, indicator) => {
  if (indicator === 'revenue' || indicator === 'memberRevenue') {
    return formatCurrency(value);
  }
  return value.toLocaleString();
};

// 获取增长率样式
const getGrowthRateClass = (rate) => {
  if (rate > 0) return 'growth-positive';
  if (rate < 0) return 'growth-negative';
  return '';
};

// 初始化
onMounted(() => {
  loadData();
});

// 监听时间范围变化
watch(timeRange, () => {
  loadData();
});

// 监听指标变化 - 优化：强制图表重新渲染
watch(selectedIndicators, () => {
  // 当指标变化时，增加chartKey强制图表组件重新渲染
  chartKey.value++;
  console.log('指标变化，强制图表重新渲染:', selectedIndicators.value);
}, { deep: true });

// 监听自定义日期范围变化
watch(customDateRange, () => {
  if (timeRange.value === 'custom') {
    loadData();
  }
});

// 加载数据
const loadData = async () => {
  try {
    loading.value = true;

    const params = {
      timeRange: timeRange.value,
      indicators: ['revenue', 'enterCount', 'utilizationRate', 'memberRevenue'], // 固定获取所有指标数据
    };

    if (timeRange.value === 'custom' && customDateRange.value?.length === 2) {
      params.startMonth = customDateRange.value[0];
      params.endMonth = customDateRange.value[1];
    }

    const response = await getTrendReport(params);

    // 更新数据
    trendData.value = response.trendData;
    trendAnalysis.value = response.trendAnalysis;

    // 数据加载完成后，强制图表重新渲染
    chartKey.value++;
  } catch (error) {
    console.error('加载趋势报表数据失败:', error);
    ElMessage.error('加载数据失败');
  } finally {
    loading.value = false;
  }
};

// 刷新数据
const refreshData = () => {
  loadData();
};

// 导出数据
const handleExport = async () => {
  try {
    exporting.value = true;

    const params = {
      timeRange: timeRange.value,
      indicators: selectedIndicators.value,
    };

    if (timeRange.value === 'custom' && customDateRange.value?.length === 2) {
      params.startMonth = customDateRange.value[0];
      params.endMonth = customDateRange.value[1];
    }

    await exportTrendReport(params);

    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
  } finally {
    exporting.value = false;
  }
};
</script>

<template>
  <div class="trend-report">
    <!-- 工具栏 -->
    <ReportToolbar>
      <template #left>
        <el-select
          v-model="timeRange"
          placeholder="时间范围"
          size="medium"
          style="width: 120px"
        >
          <el-option label="近3个月" value="3" />
          <el-option label="近6个月" value="6" />
          <el-option label="近12个月" value="12" />
          <el-option label="自定义" value="custom" />
        </el-select>

        <el-date-picker
          v-if="timeRange === 'custom'"
          v-model="customDateRange"
          type="monthrange"
          range-separator="至"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
          format="YYYY-MM"
          value-format="YYYY-MM"
          size="medium"
          style="width: 280px; margin-left: 12px"
        />

        <!-- 修改点：保持下拉多选框，但优化样式 -->
        <div class="indicator-filter-group">
          <span class="filter-label">指标选择：</span>
          <el-select
            v-model="selectedIndicators"
            multiple
            placeholder="请选择指标"
            size="medium"
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="2"
            class="indicator-multiselect"
            @change="chartKey++"
          >
          <el-option label="收费金额" value="revenue" />
          <el-option label="入场车次" value="enterCount" />
          <el-option label="泊位利用率" value="utilizationRate" />
          <el-option label="会员消费金额" value="memberRevenue" />
          </el-select>
        </div>
      </template>

      <template #right>
        <el-button
          type="primary"
          :icon="Download"
          @click="handleExport"
          :loading="exporting"
        >
          导出Excel
        </el-button>
        <el-button :icon="Refresh" @click="refreshData"> 刷新 </el-button>
      </template>
    </ReportToolbar>

    <!-- 趋势图表 -->
    <ReportSection title="运营趋势分析">
      <template #actions>
        <el-button-group size="small">
          <el-button
            :type="chartType === 'line' ? 'primary' : ''"
            @click="chartType = 'line'; chartKey++"
          >
            折线图
          </el-button>
          <el-button
            :type="chartType === 'bar' ? 'primary' : ''"
            @click="chartType = 'bar'; chartKey++"
          >
            柱状图
          </el-button>
        </el-button-group>
      </template>

      <!-- 图表区域 - 添加key强制重新渲染 -->
      <ChartContainer
        :key="chartKey"
        :options="chartOptions"
        height="400px"
      />
    </ReportSection>

    <!-- 趋势分析 -->
    <ReportSection title="趋势分析">
      <div class="analysis-cards">
        <div
          v-for="analysis in processedTrendAnalysis"
          :key="analysis.indicator"
          class="analysis-card"
        >
          <div class="analysis-header">
            <span class="analysis-name">{{
                getIndicatorName(analysis.indicator)
              }}</span>
            <el-tag :type="getTrendType(analysis.trend)" size="small">
              {{ getTrendText(analysis.trend) }}
            </el-tag>
          </div>
          <div class="analysis-content">
            <div class="analysis-value">
              <span class="value">{{
                  formatValue(analysis.currentValue, analysis.indicator)
                }}</span>
              <span
                v-if="analysis.growthRate"
                class="growth-rate"
                :class="getGrowthRateClass(analysis.growthRate)"
              >
                <el-icon v-if="analysis.growthRate > 0"><Top /></el-icon>
                <el-icon v-if="analysis.growthRate < 0"><Bottom /></el-icon>
                {{ Math.abs(analysis.growthRate) }}%
              </span>
            </div>
            <div class="analysis-description">
              {{ analysis.description }}
            </div>
          </div>
        </div>
      </div>
    </ReportSection>

    <!-- 趋势数据表格 -->
    <ReportSection title="趋势数据">
      <DataTable
        :data="trendData"
        :columns="tableColumns"
        show-pagination
        :total="trendData.length"
      />
    </ReportSection>

    <!-- 加载状态 -->
    <LoadingOverlay v-if="loading" />
  </div>
</template>

<style scoped>
.trend-report {
  position: relative;
  min-height: 600px;
  padding: 12px;
}

/* 修改点：优化指标筛选样式 */
.indicator-filter-group {
  display: flex;
  align-items: center;
  margin-left: 6px;
}

.filter-label {
  margin-right: 8px;
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
}

/* 自定义多选框样式 */
.indicator-multiselect {
  width: 300px;
}

/* 优化多选标签显示 */
:deep(.indicator-multiselect .el-select__tags) {
  display: flex;
  flex-wrap: nowrap;
  max-width: 250px;
  overflow-x: auto;
  scrollbar-width: thin;
}

:deep(.indicator-multiselect .el-select__tags::-webkit-scrollbar) {
  height: 4px;
}

:deep(.indicator-multiselect .el-select__tags::-webkit-scrollbar-thumb) {
  background-color: #c0c4cc;
  border-radius: 2px;
}

/* 优化下拉框选项样式 */
:deep(.indicator-multiselect .el-select-dropdown__item) {
  padding: 8px 16px;
}

/* 选中状态样式 */
:deep(.indicator-multiselect .el-select-dropdown__item.selected) {
  font-weight: 500;
  color: #409eff;
  background-color: #f0f9ff;
}

.analysis-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 8px;
  margin-top: 10px;
}

.analysis-card {
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
}

.analysis-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.analysis-name {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.analysis-content {
  .analysis-value {
    display: flex;
    align-items: baseline;
    margin-bottom: 4px;
  }

  .value {
    margin-right: 8px;
    font-size: 24px;
    font-weight: bold;
    color: #303233;
  }

  .growth-rate {
    font-size: 14px;
  }

  .growth-positive {
    color: #52c41a;
  }

  .growth-negative {
    color: #f5222d;
  }

  .analysis-description {
    font-size: 14px;
    line-height: 1.5;
    color: #606266;
  }
}

.growth-positive {
  color: #52c41a;
}

.growth-negative {
  color: #f5222d;
}
</style>
