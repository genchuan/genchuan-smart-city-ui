<script setup>
import { computed, onMounted, ref, watch } from 'vue';

import { Bottom, Download, Refresh, Top } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

// API (需要创建对应的API文件)
import {
  exportExitFlowReport,
  getExitFlowReport,
} from '#/api/reports/park/exitFlowApi';
import ChartContainer from '#/views/report/park/component/ChartContainer.vue';
import CoreIndicators from '#/views/report/park/component/CoreIndicators.vue';
import DataTable from '#/views/report/park/component/DataTable.vue';
import LoadingOverlay from '#/views/report/park/component/LoadingOverlay.vue';
import ReportSection from '#/views/report/park/component/ReportSection.vue';
// 组件引入
import ReportToolbar from '#/views/report/park/component/ReportToolbar.vue';
// 工具函数
import {
  generateIndicatorTag,
  getComparisonClass,
  getYesterdayDate,
} from '#/views/report/park/component/ReportUtils';

// 响应式数据
const dateRange = ref([getYesterdayDate(), getYesterdayDate()]);
const region = ref('');
const parkingType = ref('');
const loading = ref(false);
const exporting = ref(false);
const timeChartType = ref('bar');
const coreIndicators = ref([]);
const timeComparisonData = ref({});
const durationDistributionData = ref([]);
const durationTableData = ref([]);
const turnoverRateData = ref([]);
const tableData = ref([]);

// 处理后的核心指标数据
const processedCoreIndicators = computed(() => {
  return coreIndicators.value.map((indicator) => ({
    ...indicator,
    tag: generateIndicatorTag(indicator.comparison),
    abnormal: Math.abs(indicator.comparison) > 30,
  }));
});

// 表格列定义
const tableColumns = computed(() => [
  { prop: 'date', label: '日期', width: 120 },
  { prop: 'regionName', label: '行政区划', width: 120 },
  { prop: 'parkingType', label: '停车场类型', width: 150 },
  { prop: 'totalCount', label: '出场总车次', width: 120 },
  { prop: 'within1h', label: '1小时内', width: 120 },
  { prop: 'within3h', label: '1-3小时', width: 120 },
  { prop: 'within6h', label: '3-6小时', width: 120 },
  { prop: 'over6h', label: '6小时以上', width: 120 },
  { prop: 'avgDuration', label: '平均停留(小时)', width: 150 },
  { prop: 'turnoverRate', label: '周转率', width: 120, type: 'percentage' },
]);

// 停留时长表格列定义
const durationColumns = computed(() => [
  { prop: 'durationRange', label: '停留时长', width: 150 },
  { prop: 'count', label: '车次', width: 120 },
  { prop: 'percentage', label: '占比', width: 120, type: 'percentage' },
  { prop: 'avgFee', label: '平均收费(元)', width: 150, type: 'currency' },
]);

// 时段对比图表配置
const timeComparisonOptions = computed(() => ({
  title: {
    text: '入场与出场时段分布对比',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  legend: {
    data: ['入场车流', '出场车流'],
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
    data: [
      '00-02',
      '02-04',
      '04-06',
      '06-08',
      '08-10',
      '10-12',
      '12-14',
      '14-16',
      '16-18',
      '18-20',
      '20-22',
      '22-24',
    ],
    axisLabel: {
      interval: 0,
      rotate: 45,
    },
  },
  yAxis: {
    type: 'value',
    name: '车次',
  },
  series: [
    {
      name: '入场车流',
      type: timeChartType.value,
      data: timeComparisonData.value.entry || [],
      itemStyle: {
        color: '#1890ff',
      },
    },
    {
      name: '出场车流',
      type: timeChartType.value,
      data: timeComparisonData.value.exit || [],
      itemStyle: {
        color: '#52c41a',
      },
    },
  ],
}));

// 停留时长分布图表配置
const durationDistributionOptions = computed(() => ({
  title: {
    text: '停留时长分布',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    top: 'middle',
  },
  series: [
    {
      name: '停留时长',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '50%'],
      data: durationDistributionData.value,
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

// 周转率图表配置
const turnoverRateOptions = computed(() => ({
  title: {
    text: '区域周转率对比',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
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
    data: turnoverRateData.value.map((item) => item.regionName),
    axisLabel: {
      interval: 0,
      rotate: 45,
    },
  },
  yAxis: {
    type: 'value',
    name: '周转率(%)',
    max: 100,
  },
  series: [
    {
      name: '周转率',
      type: 'bar',
      data: turnoverRateData.value.map((item) => item.turnoverRate),
      itemStyle: {
        color(params) {
          const rate = turnoverRateData.value[params.dataIndex].turnoverRate;
          if (rate >= 90) return '#52c41a';
          if (rate >= 80) return '#faad14';
          return '#ff4d4f';
        },
      },
    },
  ],
}));

// 格式化值
const formatValue = (value, unit) => {
  if (unit === '%') {
    return `${value.toFixed(1)}%`;
  }
  return value.toLocaleString();
};

// 初始化
onMounted(() => {
  loadData();
});

// 监听筛选条件变化
watch([dateRange, region, parkingType], () => {
  loadData();
});

// 加载数据
const loadData = async () => {
  try {
    loading.value = true;

    const params = {
      startDate: dateRange.value[0],
      endDate: dateRange.value[1],
      region: region.value,
      parkingType: parkingType.value,
    };

    const response = await getExitFlowReport(params);

    // 更新数据
    coreIndicators.value = response.coreIndicators;
    timeComparisonData.value = response.timeComparison;
    durationDistributionData.value = response.durationDistribution;
    durationTableData.value = response.durationTableData;
    turnoverRateData.value = response.turnoverRate;
    tableData.value = response.tableData;
  } catch (error) {
    console.error('加载出场车流数据失败:', error);
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
      startDate: dateRange.value[0],
      endDate: dateRange.value[1],
      region: region.value,
      parkingType: parkingType.value,
    };

    await exportExitFlowReport(params);

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
  <div class="exit-flow-report">
    <!-- 工具栏 -->
    <ReportToolbar>
      <template #left>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          size="medium"
          style="width: 280px"
        />
        <el-select
          v-model="region"
          placeholder="行政区划"
          size="medium"
          clearable
          style="width: 120px; margin-left: 12px"
        >
          <el-option label="全部区域" value="" />
          <el-option label="芗城区" value="xiangcheng" />
          <el-option label="龙文区" value="longwen" />
          <el-option label="龙海区" value="longhai" />
        </el-select>
        <el-select
          v-model="parkingType"
          placeholder="停车场类型"
          size="medium"
          clearable
          style="width: 140px; margin-left: 12px"
        >
          <el-option label="全部类型" value="" />
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

    <!-- 核心指标 -->
    <CoreIndicators
      title="出场车流核心指标"
      :indicators="processedCoreIndicators"
      :format-value="formatValue"
    >
      <template #comparison="{ indicator }">
        <span :class="getComparisonClass(indicator.comparison)">
          <el-icon v-if="indicator.comparison > 0"><Top /></el-icon>
          <el-icon v-if="indicator.comparison < 0"><Bottom /></el-icon>
          较近7日均值 {{ Math.abs(indicator.comparison) }}%
        </span>
      </template>
    </CoreIndicators>

    <!-- 时段分布对比 -->
    <ReportSection title="入场与出场时段分布对比">
      <template #actions>
        <el-radio-group v-model="timeChartType" size="small">
          <el-radio-button label="bar">柱状图</el-radio-button>
          <el-radio-button label="line">折线图</el-radio-button>
        </el-radio-group>
      </template>

      <!-- 时段对比图表 -->
      <ChartContainer :options="timeComparisonOptions" height="350px" />
    </ReportSection>

    <!-- 停留时长分布 -->
    <ReportSection title="停留时长分布">
      <div class="duration-charts">
        <div class="pie-chart">
          <ChartContainer
            :options="durationDistributionOptions"
            height="300px"
          />
        </div>
        <div class="duration-table">
          <DataTable :data="durationTableData" :columns="durationColumns" />
        </div>
      </div>
    </ReportSection>

    <!-- 区域周转率 -->
    <ReportSection title="区域周转率分析">
      <ChartContainer :options="turnoverRateOptions" height="350px" />
    </ReportSection>

    <!-- 数据表格 -->
    <ReportSection title="详细数据">
      <DataTable
        :data="tableData"
        :columns="tableColumns"
        show-pagination
        :total="tableData.length"
      />
    </ReportSection>

    <!-- 加载状态 -->
    <LoadingOverlay v-if="loading" />
  </div>
</template>

<style scoped>
.exit-flow-report {
  position: relative;
  min-height: 600px;
  padding: 12px;
}

.duration-charts {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 12px;
}

@media (max-width: 768px) {
  .duration-charts {
    grid-template-columns: 1fr;
  }
}
</style>
