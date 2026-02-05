<script setup>
import { computed, onMounted, ref, watch } from 'vue';

import { Download, Refresh } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

// API
import {
  exportFlowDistributionReport,
  getFlowDistributionReport,
} from '#/api/reports/park/flowDistApi';
import ChartContainer from '#/views/report/park/component/ChartContainer.vue';
import CoreIndicators from '#/views/report/park/component/CoreIndicators.vue';
import DataTable from '#/views/report/park/component/DataTable.vue';
import LoadingOverlay from '#/views/report/park/component/LoadingOverlay.vue';
import ReportSection from '#/views/report/park/component/ReportSection.vue';
// 组件引入
import ReportToolbar from '#/views/report/park/component/ReportToolbar.vue';
// 工具函数

// 响应式数据
const timeRange = ref('7');
const customDateRange = ref([]);
const region = ref('');
const parkingType = ref('');
const flowType = ref('total');
const loading = ref(false);
const exporting = ref(false);
const coreIndicators = ref([]);
const regionDensityData = ref([]);
const timeDistributionData = ref({});
const typeDistributionData = ref([]);
const hotspotData = ref([]);
const tableData = ref([]);

// 处理后的核心指标数据
const processedCoreIndicators = computed(() => {
  return coreIndicators.value.map((indicator) => ({
    ...indicator,
    abnormal: Math.abs(indicator.comparison) > 30,
  }));
});

// 热点区域表格列定义
const hotspotColumns = computed(() => {
  // 根据车流类型动态调整列
  const baseColumns = [
    { prop: 'rank', label: '排名', width: 80 },
    { prop: 'regionName', label: '区域', width: 120 },
    { prop: 'parkingCount', label: '停车场数量', width: 120 },
    { prop: 'totalFlow', label: '总车流', width: 120 },
  ];

  // 根据车流类型显示不同的列
  if (flowType.value === 'total') {
    return [
      ...baseColumns,
      { prop: 'entryFlow', label: '入场车流', width: 120 },
      { prop: 'exitFlow', label: '出场车流', width: 120 },
      { prop: 'flowDensity', label: '车流密度', width: 120 },
      { prop: 'peakHour', label: '高峰时段', width: 150 },
      { prop: 'growthRate', label: '增长率', width: 120, type: 'growth' },
    ];
  } else if (flowType.value === 'entry') {
    return [
      ...baseColumns,
      { prop: 'entryFlow', label: '入场车流', width: 120 },
      { prop: 'flowDensity', label: '车流密度', width: 120 },
      { prop: 'peakHour', label: '高峰时段', width: 150 },
      { prop: 'growthRate', label: '增长率', width: 120, type: 'growth' },
    ];
  } else {
    return [
      ...baseColumns,
      { prop: 'exitFlow', label: '出场车流', width: 120 },
      { prop: 'flowDensity', label: '车流密度', width: 120 },
      { prop: 'peakHour', label: '高峰时段', width: 150 },
      { prop: 'growthRate', label: '增长率', width: 120, type: 'growth' },
    ];
  }
});

// 详细数据表格列定义
const tableColumns = computed(() => {
  const baseColumns = [
    { prop: 'date', label: '日期', width: 120 },
    { prop: 'regionName', label: '行政区划', width: 120 },
    { prop: 'parkingType', label: '停车场类型', width: 150 },
    { prop: 'totalFlow', label: '总车流', width: 120 },
  ];

  if (flowType.value === 'total') {
    return [
      ...baseColumns,
      { prop: 'entryFlow', label: '入场车流', width: 120 },
      { prop: 'exitFlow', label: '出场车流', width: 120 },
      { prop: 'morningPeak', label: '早高峰车流', width: 150 },
      { prop: 'eveningPeak', label: '晚高峰车流', width: 150 },
      { prop: 'peakRatio', label: '高峰占比', width: 120, type: 'percentage' },
      {
        prop: 'utilizationRate',
        label: '泊位利用率',
        width: 150,
        type: 'percentage',
      },
    ];
  } else if (flowType.value === 'entry') {
    return [
      ...baseColumns,
      { prop: 'entryFlow', label: '入场车流', width: 120 },
      { prop: 'morningPeak', label: '早高峰车流', width: 150 },
      { prop: 'peakRatio', label: '高峰占比', width: 120, type: 'percentage' },
      {
        prop: 'utilizationRate',
        label: '泊位利用率',
        width: 150,
        type: 'percentage',
      },
    ];
  } else {
    return [
      ...baseColumns,
      { prop: 'exitFlow', label: '出场车流', width: 120 },
      { prop: 'eveningPeak', label: '晚高峰车流', width: 150 },
      { prop: 'peakRatio', label: '高峰占比', width: 120, type: 'percentage' },
      {
        prop: 'utilizationRate',
        label: '泊位利用率',
        width: 150,
        type: 'percentage',
      },
    ];
  }
});

// 区域车流密度分布图表配置
const regionDensityOptions = computed(() => {
  // 获取区域数据
  const regions = regionDensityData.value;

  // 图表标题
  const chartTitle =
    flowType.value === 'total'
      ? '区域车流密度分布'
      : flowType.value === 'entry'
        ? '区域入场车流密度分布'
        : '区域出场车流密度分布';

  // 车流类型名称
  const flowTypeName =
    flowType.value === 'total'
      ? '车流'
      : flowType.value === 'entry'
        ? '入场车流'
        : '出场车流';

  if (regions.length === 0) {
    return {
      title: {
        text: chartTitle,
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
        data: [],
        axisLabel: {
          interval: 0,
          rotate: 45,
        },
      },
      yAxis: {
        type: 'value',
        name: '车流量',
      },
      series: [
        {
          name: flowTypeName,
          type: 'bar',
          data: [],
          barWidth: '60%',
          label: {
            show: true,
            position: 'top',
            formatter: '{c}',
          },
        },
      ],
    };
  }

  return {
    title: {
      text: chartTitle,
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params) => {
        const data = params[0];
        return `${data.name}<br/>${flowTypeName}: ${data.value.toLocaleString()}车次`;
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
      data: regions.map((item) => item.regionName),
      axisLabel: {
        interval: 0,
        rotate: 45,
      },
    },
    yAxis: {
      type: 'value',
      name: '车流量',
    },
    series: [
      {
        name: flowTypeName,
        type: 'bar',
        data: regions.map((item) => ({
          value: item.value,
          itemStyle: {
            color: getRegionColor(item.value),
          },
        })),
        barWidth: '60%',
        label: {
          show: true,
          position: 'top',
          formatter: '{c}',
        },
      },
    ],
  };
});

// 根据车流密度获取颜色
const getRegionColor = (density) => {
  if (density >= 4000) return '#a50026'; // 最高密度
  if (density >= 3000) return '#d73027';
  if (density >= 2000) return '#fdae61';
  if (density >= 1000) return '#fee08b';
  return '#ffffbf'; // 最低密度
};

// 时段分布图表配置
const timeDistributionOptions = computed(() => {
  // 图表标题
  const chartTitle =
    flowType.value === 'total'
      ? '车流时段分布'
      : flowType.value === 'entry'
        ? '入场车流时段分布'
        : '出场车流时段分布';

  // 根据车流类型确定显示的数据系列
  let seriesData;
  let seriesName;
  let seriesColor;

  if (flowType.value === 'entry') {
    // 入场车流显示 entry 数据
    seriesData = timeDistributionData.value.entry || [];
    seriesName = '入场车流';
    seriesColor = '#52c41a';
  } else if (flowType.value === 'exit') {
    // 出场车流显示 exit 数据
    seriesData = timeDistributionData.value.exit || [];
    seriesName = '出场车流';
    seriesColor = '#fa8c16';
  } else {
    // 总车流显示 total 数据
    seriesData = timeDistributionData.value.total || [];
    seriesName = '总车流';
    seriesColor = '#1890ff';
  }

  return {
    title: {
      text: chartTitle,
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: [seriesName],
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
        name: seriesName,
        type: 'line',
        data: seriesData,
        smooth: true,
        itemStyle: {
          color: seriesColor,
        },
      },
    ],
  };
});

// 类型分布图表配置
const typeDistributionOptions = computed(() => {
  // 图表标题
  const chartTitle =
    flowType.value === 'total'
      ? '停车场类型车流分布'
      : flowType.value === 'entry'
        ? '停车场类型入场车流分布'
        : '停车场类型出场车流分布';

  return {
    title: {
      text: chartTitle,
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}车次 ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle',
    },
    series: [
      {
        name: '车流分布',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        data: typeDistributionData.value,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };
});

// 格式化值
const formatValue = (value, unit) => {
  return value.toLocaleString();
};

// 初始化
onMounted(() => {
  loadData();
});

// 监听筛选条件变化
watch([timeRange, region, parkingType, flowType], () => {
  loadData();
});

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
      region: region.value,
      parkingType: parkingType.value,
      flowType: flowType.value,
    };

    if (timeRange.value === 'custom' && customDateRange.value?.length === 2) {
      params.startDate = customDateRange.value[0];
      params.endDate = customDateRange.value[1];
    }

    const response = await getFlowDistributionReport(params);

    // 更新数据
    coreIndicators.value = response.coreIndicators || [];

    // 将热力图数据转换为区域密度数据
    if (response.heatmapData && typeof response.heatmapData === 'object') {
      regionDensityData.value = Object.entries(response.heatmapData)
        .map(([name, value]) => ({
          regionName: name,
          value,
        }))
        .sort((a, b) => b.value - a.value); // 按值降序排列
    } else {
      regionDensityData.value = [];
    }

    timeDistributionData.value = response.timeDistribution || {};
    typeDistributionData.value = response.typeDistribution || [];
    hotspotData.value = response.hotspotData || [];
    tableData.value = response.tableData || [];
  } catch (error) {
    console.error('加载车流分布数据失败:', error);
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
      region: region.value,
      parkingType: parkingType.value,
      flowType: flowType.value,
    };

    if (timeRange.value === 'custom' && customDateRange.value?.length === 2) {
      params.startDate = customDateRange.value[0];
      params.endDate = customDateRange.value[1];
    }

    await exportFlowDistributionReport(params);

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
  <div class="flow-distribution-report">
    <!-- 工具栏 -->
    <ReportToolbar>
      <template #left>
        <el-select
          v-model="timeRange"
          placeholder="时间范围"
          size="medium"
          style="width: 120px"
        >
          <el-option label="今日" value="today" />
          <el-option label="近7日" value="7" />
          <el-option label="近30日" value="30" />
          <el-option label="自定义" value="custom" />
        </el-select>

        <el-date-picker
          v-if="timeRange === 'custom'"
          v-model="customDateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          size="medium"
          style="width: 280px; margin-left: 12px"
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
          <el-option label="漳浦县" value="zhangpu" />
          <el-option label="云霄县" value="yunxiao" />
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
      title="车流分布核心指标"
      :indicators="processedCoreIndicators"
      :format-value="formatValue"
    />

    <!-- 区域车流密度分布 -->
    <ReportSection title="区域车流密度分布">
      <template #actions>
        <el-radio-group v-model="flowType" size="small">
          <el-radio-button label="total">总车流</el-radio-button>
          <el-radio-button label="entry">入场车流</el-radio-button>
          <el-radio-button label="exit">出场车流</el-radio-button>
        </el-radio-group>
      </template>

      <!-- 图表区域 -->
      <ChartContainer :options="regionDensityOptions" height="450px" />
    </ReportSection>

    <!-- 多维度分布 -->
    <div class="multi-dimension">
      <!-- 时段分布 -->
      <ReportSection
        title="时段分布"
        :with-background="true"
        :with-padding="true"
      >
        <ChartContainer :options="timeDistributionOptions" height="300px" />
      </ReportSection>

      <!-- 类型分布 -->
      <ReportSection
        title="停车场类型分布"
        :with-background="true"
        :with-padding="true"
      >
        <ChartContainer :options="typeDistributionOptions" height="300px" />
      </ReportSection>
    </div>

    <!-- 热点区域分析 -->
    <ReportSection title="热点区域分析">
      <DataTable
        :data="hotspotData"
        :columns="hotspotColumns"
        show-pagination
        :total="hotspotData.length"
      />
    </ReportSection>

    <!-- 详细数据表格 -->
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
.flow-distribution-report {
  position: relative;
  min-height: 600px;
  padding: 12px;
}

.multi-dimension {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

@media (max-width: 992px) {
  .multi-dimension {
    grid-template-columns: 1fr;
  }
}
</style>
