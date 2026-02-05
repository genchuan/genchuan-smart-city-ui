<script setup>
import { computed, onMounted, ref, watch } from 'vue';

import { Bottom, Download, Refresh, Top } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

// API (需要创建对应的API文件)
import {
  exportEntryFlowReport,
  getEntryFlowReport,
} from '#/api/reports/park/entryFlowApi';
import ChartContainer from '#/views/report/park/component/ChartContainer.vue';
import CoreIndicators from '#/views/report/park/component/CoreIndicators.vue';
import DataTable from '#/views/report/park/component/DataTable.vue';
import LoadingOverlay from '#/views/report/park/component/LoadingOverlay.vue';
import ReportSection from '#/views/report/park/component/ReportSection.vue';
// 组件引入
import ReportToolbar from '#/views/report/park/component/ReportToolbar.vue';
// 工具函数
import {
  // generateIndicatorTag,
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
const timeDistributionData = ref([]);
const regionDistributionData = ref([]);
const vehicleTypeData = ref([]);
const tableData = ref([]);

// 处理后的核心指标数据
const processedCoreIndicators = computed(() => {
  return coreIndicators.value.map((indicator) => ({
    ...indicator,
    // tag: generateIndicatorTag(indicator.comparison),
    // abnormal: Math.abs(indicator.comparison) > 30,
  }));
});

// 表格列定义
const tableColumns = computed(() => [
  { prop: 'date', label: '日期', width: 120 },
  { prop: 'regionName', label: '行政区划', width: 120 },
  { prop: 'parkingType', label: '停车场类型', width: 150 },
  { prop: 'totalCount', label: '总车次', width: 120 },
  { prop: 'morningPeak', label: '早高峰(7-9点)', width: 150 },
  { prop: 'eveningPeak', label: '晚高峰(17-19点)', width: 150 },
  { prop: 'offPeak', label: '平峰时段', width: 150 },
  { prop: 'smallVehicle', label: '小型车', width: 120 },
  { prop: 'mediumVehicle', label: '中型车', width: 120 },
  { prop: 'largeVehicle', label: '大型车', width: 120 },
  { prop: 'newEnergy', label: '新能源汽车', width: 150 },
  {
    prop: 'newEnergyRate',
    label: '新能源占比',
    width: 150,
    type: 'percentage',
  },
]);

// 时段分布图表配置
const timeDistributionOptions = computed(() => ({
  title: {
    text: '入场车流时段分布',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  legend: {
    data: ['今日', '近7日均值'],
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
      name: '今日',
      type: timeChartType.value,
      data: timeDistributionData.value.today || [],
      itemStyle: {
        color: '#1890ff',
      },
    },
    {
      name: '近7日均值',
      type: 'line',
      data: timeDistributionData.value.average || [],
      smooth: true,
      lineStyle: {
        color: '#ff4d4f',
      },
    },
  ],
}));

// 区域分布图表配置
const regionDistributionOptions = computed(() => ({
  title: {
    text: '区域入场车流分布',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    top: 'middle',
    data: regionDistributionData.value.map((item) => item.name),
  },
  series: [
    {
      name: '入场车流',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '50%'],
      data: regionDistributionData.value,
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

// 车型分布图表配置
const vehicleTypeOptions = computed(() => ({
  title: {
    text: '车型分布',
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
      name: '车型分布',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '50%'],
      data: [
        { value: vehicleTypeData.value.small || 0, name: '小型车' },
        { value: vehicleTypeData.value.medium || 0, name: '中型车' },
        { value: vehicleTypeData.value.large || 0, name: '大型车' },
        { value: vehicleTypeData.value.newEnergy || 0, name: '新能源汽车' },
      ],
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

    const response = await getEntryFlowReport(params);

    // 更新数据
    coreIndicators.value = response.coreIndicators;
    timeDistributionData.value = response.timeDistribution;
    regionDistributionData.value = response.regionDistribution;
    vehicleTypeData.value = response.vehicleType;
    tableData.value = response.tableData;
  } catch (error) {
    console.error('加载入场车流数据失败:', error);
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

    await exportEntryFlowReport(params);

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
  <div class="entry-flow-report">
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
      title="入场车流核心指标"
      :indicators="processedCoreIndicators"
      :format-value="formatValue"
    >
<!--      <template #comparison="{ indicator }">-->
<!--        <span :class="getComparisonClass(indicator.comparison)">-->
<!--          <el-icon v-if="indicator.comparison > 0"><Top /></el-icon>-->
<!--          <el-icon v-if="indicator.comparison < 0"><Bottom /></el-icon>-->
<!--          较近7日均值 {{ Math.abs(indicator.comparison) }}%-->
<!--        </span>-->
<!--      </template>-->
    </CoreIndicators>

    <!-- 时段分布 -->
    <ReportSection title="时段分布统计">
      <template #actions>
        <el-radio-group v-model="timeChartType" size="small">
          <el-radio-button label="bar">柱状图</el-radio-button>
          <el-radio-button label="line">折线图</el-radio-button>
        </el-radio-group>
      </template>

      <!-- 时段分布图表 -->
      <ChartContainer :options="timeDistributionOptions" height="350px" />
    </ReportSection>

    <!-- 区域与车型分布 -->
    <div class="distribution-grid">
      <!-- 区域分布 -->
      <ReportSection
        title="区域分布统计"
        :with-background="true"
        :with-padding="true"
      >
        <ChartContainer :options="regionDistributionOptions" height="300px" />
      </ReportSection>

      <!-- 车型分布 -->
      <ReportSection
        title="车型分布统计"
        :with-background="true"
        :with-padding="true"
      >
        <ChartContainer :options="vehicleTypeOptions" height="300px" />
      </ReportSection>
    </div>

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
.entry-flow-report {
  position: relative;
  min-height: 600px;
  padding: 12px;
}

.distribution-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

@media (max-width: 992px) {
  .distribution-grid {
    grid-template-columns: 1fr;
  }
}
</style>
