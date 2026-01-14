<script setup>
import { computed, onMounted, ref, watch } from 'vue';

import { Bottom, Download, Refresh, Top } from '@element-plus/icons-vue';
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus';

// API
import {
  exportMonthlyReport,
  getMonthlyReport,
} from '#/api/reports/park/monthlyReportApi';
import ChartContainer from '#/views/report/park/component/ChartContainer.vue';
import CoreIndicators from '#/views/report/park/component/CoreIndicators.vue';
import DataTable from '#/views/report/park/component/DataTable.vue';
import LoadingOverlay from '#/views/report/park/component/LoadingOverlay.vue';
import ReportSection from '#/views/report/park/component/ReportSection.vue';
// 组件引入
import ReportToolbar from '#/views/report/park/component/ReportToolbar.vue';
// 工具函数
import {
  formatCurrency,
  getComparisonClass,
  getLastMonth,
  getParkingTypeName,
  getParkingTypeTagType,
} from '#/views/report/park/component/ReportUtils';

// 响应式数据
const selectedMonth = ref(getLastMonth());
const parkingType = ref('all');
const loading = ref(false);
const exporting = ref(false);
const trendMetric = ref('revenue');
const monthlyIndicators = ref([]);
const typeDistribution = ref([]);
const monthlyData = ref([]);

// 处理后的核心指标数据
const processedMonthlyIndicators = computed(() => {
  return monthlyIndicators.value.map((indicator) => ({
    ...indicator,
    // tag: generateIndicatorTag(indicator.comparison),
    // comparisonLabel: '较上月',
  }));
});

// 类型表格列定义
const typeTableColumns = computed(() => [
  {
    prop: 'type',
    label: '停车场类型',
    width: 120,
    type: 'tag',
    tagType: (row) => getParkingTypeTagType(row.type),
    formatter: (value) => getParkingTypeName(value),
  },
  { prop: 'count', label: '停车场数', width: 100 },
  { prop: 'totalBerths', label: '泊位总数', width: 100 },
  { prop: 'revenue', label: '收费金额', width: 150, type: 'currency' },
  {
    prop: 'revenuePercentage',
    label: '金额占比',
    width: 120,
    type: 'percentage',
  },
  {
    prop: 'utilizationRate',
    label: '平均利用率',
    width: 120,
    type: 'percentage',
  },
]);

// 月度数据表格列定义
const monthlyTableColumns = computed(() => [
  { prop: 'date', label: '日期', width: 120 },
  { prop: 'enterCount', label: '入场车次', width: 120 },
  { prop: 'exitCount', label: '出场车次', width: 120 },
  { prop: 'revenue', label: '收费金额', width: 150, type: 'currency' },
  {
    prop: 'utilizationRate',
    label: '泊位利用率',
    width: 150,
    type: 'percentage',
  },
  { prop: 'warningCount', label: '预警数', width: 100 },
  { prop: 'faultCount', label: '故障设备', width: 100 },
  {
    prop: 'faultHandleRate',
    label: '故障处置率',
    width: 120,
    type: 'percentage',
  },
  {
    prop: 'warningHandleRate',
    label: '预警处置率',
    width: 120,
    type: 'percentage',
  },
]);

// 趋势图表配置
const trendChartOptions = computed(() => {
  const metricName =
    {
      revenue: '收费金额',
      enterCount: '入场车次',
      utilizationRate: '泊位利用率',
    }[trendMetric.value] || trendMetric.value;

  const metricUnit =
    trendMetric.value === 'revenue'
      ? '元'
      : trendMetric.value === 'utilizationRate'
        ? '%'
        : '';

  return {
    title: {
      text: '月度趋势对比',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: [metricName],
      bottom: 10,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: monthlyData.value.map((item) => item.date.slice(8)),
      name: '日期',
    },
    yAxis: {
      type: 'value',
      name: metricUnit,
    },
    series: [
      {
        name: metricName,
        type: 'line',
        data: monthlyData.value.map((item) => item[trendMetric.value]),
        smooth: true,
        itemStyle: {
          color: '#1890ff',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(24, 144, 255, 0.5)' },
            { offset: 1, color: 'rgba(24, 144, 255, 0.1)' },
          ]),
        },
      },
    ],
  };
});

// 饼图配置
const pieChartOptions = computed(() => ({
  title: {
    text: '收费金额分布',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: ¥{c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: typeDistribution.value.map((item) => getParkingTypeName(item.type)),
  },
  series: [
    {
      name: '收费金额分布',
      type: 'pie',
      radius: '50%',
      center: ['50%', '60%'],
      data: typeDistribution.value.map((item) => ({
        value: item.revenue,
        name: getParkingTypeName(item.type),
      })),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
}));

// 格式化值
const formatValue = (value, unit) => {
  if (unit === '元') {
    return formatCurrency(value);
  }
  return value.toLocaleString();
};

// 初始化
onMounted(() => {
  loadData();
});

// 监听月份变化
watch(selectedMonth, () => {
  loadData();
});

// 监听停车场类型变化
watch(parkingType, () => {
  loadData();
});

// 加载数据
const loadData = async () => {
  try {
    loading.value = true;

    const params = {
      month: selectedMonth.value,
      parkingType: parkingType.value,
    };

    const response = await getMonthlyReport(params);

    // 更新数据
    monthlyIndicators.value = response.monthlyIndicators;
    typeDistribution.value = response.typeDistribution;
    monthlyData.value = response.monthlyData;
  } catch (error) {
    console.error('加载月报表数据失败:', error);
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
      month: selectedMonth.value,
      parkingType: parkingType.value,
    };

    await exportMonthlyReport(params);

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
  <div class="monthly-report">
    <!-- 工具栏 -->
    <ReportToolbar>
      <template #left>
        <el-date-picker
          v-model="selectedMonth"
          type="month"
          placeholder="选择月份"
          format="YYYY-MM"
          value-format="YYYY-MM"
          size="medium"
        />
        <el-select
          v-model="parkingType"
          placeholder="停车场类型"
          size="medium"
          style="width: 140px; margin-left: 12px"
        >
          <el-option label="全部类型" value="all" />
          <el-option label="公共停车场" value="public" />
          <el-option label="路侧停车场" value="roadside" />
          <el-option label="专用停车场" value="special" />
        </el-select>
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

    <!-- 月度核心指标 -->
    <CoreIndicators
      title="月度核心指标"
      :indicators="processedMonthlyIndicators"
      :format-value="formatValue"
    >
<!--      <template #comparison="{ indicator }">-->
<!--        <span :class="getComparisonClass(indicator.comparison, 0)">-->
<!--          <el-icon v-if="indicator.comparison > 0"><Top /></el-icon>-->
<!--          <el-icon v-if="indicator.comparison < 0"><Bottom /></el-icon>-->
<!--          较上月 {{ Math.abs(indicator.comparison) }}%-->
<!--        </span>-->
<!--      </template>-->
    </CoreIndicators>

    <!-- 趋势对比 -->
    <ReportSection title="月度趋势对比">
      <template #actions>
        <el-select
          v-model="trendMetric"
          placeholder="趋势指标"
          size="small"
          style="width: 120px"
        >
          <el-option label="收费金额" value="revenue" />
          <el-option label="入场车次" value="enterCount" />
          <el-option label="泊位利用率" value="utilizationRate" />
        </el-select>
      </template>

      <!-- 趋势图表 -->
      <ChartContainer :options="trendChartOptions" height="300px" />
    </ReportSection>

    <!-- 分类型统计 -->
    <ReportSection title="停车场类型统计">
      <div class="type-charts">
        <div class="pie-chart">
          <ChartContainer :options="pieChartOptions" height="300px" />
        </div>
        <div class="type-table">
          <DataTable :data="typeDistribution" :columns="typeTableColumns" />
        </div>
      </div>
    </ReportSection>

    <!-- 月度数据表格 -->
    <ReportSection title="详细数据">
      <DataTable
        :data="monthlyData"
        :columns="monthlyTableColumns"
        show-pagination
        :total="monthlyData.length"
      />
    </ReportSection>

    <!-- 加载状态 -->
    <LoadingOverlay v-if="loading" />
  </div>
</template>

<style scoped>
.monthly-report {
  position: relative;
  min-height: 600px;
  padding: 12px;
}

.type-charts {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 12px;
}

@media (max-width: 768px) {
  .type-charts {
    grid-template-columns: 1fr;
  }
}
</style>
