<script setup>
import { computed, onMounted, ref, watch } from 'vue';

import {
  Bottom,
  Download,
  Refresh,
  Top,
  Warning,
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

// API
import {
  exportDailyReport,
  getDailyReport,
} from '#/api/reports/park/dailyReportApi';
import ChartContainer from '#/views/report/park/operation/component/ChartContainer.vue';
import CoreIndicators from '#/views/report/park/operation/component/CoreIndicators.vue';
import DataTable from '#/views/report/park/operation/component/DataTable.vue';
import LoadingOverlay from '#/views/report/park/operation/component/LoadingOverlay.vue';
import ReportSection from '#/views/report/park/operation/component/ReportSection.vue';
// 组件引入
import ReportToolbar from '#/views/report/park/operation/component/ReportToolbar.vue';
// 工具函数
import {
  formatCurrency,
  generateIndicatorTag,
  getComparisonClass,
  getYesterdayDate,
} from '#/views/report/park/operation/component/ReportUtils';

// 响应式数据
const selectedDate = ref(getYesterdayDate());
const regionType = ref('area');
const loading = ref(false);
const exporting = ref(false);
const chartType = ref('bar');
const coreIndicators = ref([]);
const regionData = ref([]);
const abnormalities = ref([]);

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
  { prop: 'areaName', label: '区域', width: 120 },
  { prop: 'enterCount', label: '入场车次', width: 120 },
  { prop: 'exitCount', label: '出场车次', width: 120 },
  { prop: 'revenue', label: '收费金额', width: 150, type: 'currency' },
  {
    prop: 'utilizationRate',
    label: '泊位利用率',
    width: 150,
    type: 'progress',
  },
  { prop: 'warningCount', label: '预警数', width: 100 },
  { prop: 'faultCount', label: '故障设备', width: 100 },
]);

// 图表配置
const chartOptions = computed(() => ({
  title: {
    text: '分区域运营数据对比',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  legend: {
    data: ['入场车次', '收费金额', '泊位利用率'],
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
    data: regionData.value.map((item) => item.areaName),
    axisLabel: {
      interval: 0,
      rotate: 45,
    },
  },
  yAxis: [
    {
      type: 'value',
      name: '车次/金额',
      position: 'left',
    },
    {
      type: 'value',
      name: '利用率(%)',
      position: 'right',
      max: 100,
    },
  ],
  series: [
    {
      name: '入场车次',
      type: chartType.value,
      data: regionData.value.map((item) => item.enterCount),
      yAxisIndex: 0,
      itemStyle: {
        color: '#5470c6',
      },
    },
    {
      name: '收费金额',
      type: chartType.value,
      data: regionData.value.map((item) => item.revenue),
      yAxisIndex: 0,
      itemStyle: {
        color: '#91cc75',
      },
    },
    {
      name: '泊位利用率',
      type: 'line',
      data: regionData.value.map((item) => item.utilizationRate),
      yAxisIndex: 1,
      itemStyle: {
        color: '#fac858',
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

// 监听日期变化
watch(selectedDate, () => {
  loadData();
});

// 监听区域类型变化
watch(regionType, () => {
  loadData();
});

// 加载数据
const loadData = async () => {
  try {
    loading.value = true;

    const params = {
      date: selectedDate.value,
      regionType: regionType.value,
    };

    const response = await getDailyReport(params);

    // 更新数据
    coreIndicators.value = response.coreIndicators;
    regionData.value = response.regionData;
    abnormalities.value = response.abnormalities;
  } catch (error) {
    console.error('加载日报表数据失败:', error);
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
      date: selectedDate.value,
      regionType: regionType.value,
    };

    await exportDailyReport(params);

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
  <div class="daily-report">
    <!-- 工具栏 -->
    <ReportToolbar>
      <template #left>
        <el-date-picker
          v-model="selectedDate"
          type="date"
          placeholder="选择日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          size="medium"
        />
        <el-select
          v-model="regionType"
          placeholder="统计维度"
          size="medium"
          style="width: 120px; margin-left: 12px"
        >
          <el-option label="行政区划" value="area" />
          <el-option label="商圈" value="business" />
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
      title="核心指标"
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

    <!-- 异常提醒 -->
    <div v-if="abnormalities.length > 0" class="abnormal-alert">
      <el-alert title="异常提醒" type="warning" :closable="false" show-icon>
        <div class="abnormal-list">
          <div
            v-for="abnormal in abnormalities"
            :key="abnormal.id"
            class="abnormal-item"
          >
            <el-icon><Warning /></el-icon>
            <span>{{ abnormal.message }}</span>
          </div>
        </div>
      </el-alert>
    </div>

    <!-- 分区域统计 -->
    <ReportSection title="分区域统计">
      <template #actions>
        <el-radio-group v-model="chartType" size="small">
          <el-radio-button label="bar">柱状图</el-radio-button>
          <el-radio-button label="line">折线图</el-radio-button>
        </el-radio-group>
      </template>

      <!-- 图表区域 -->
      <ChartContainer :options="chartOptions" height="400px" />

      <!-- 数据表格 -->
      <DataTable :data="regionData" :columns="tableColumns" />
    </ReportSection>

    <!-- 加载状态 -->
    <LoadingOverlay v-if="loading" />
  </div>
</template>

<style scoped>
.daily-report {
  position: relative;
  min-height: 600px;
  padding: 24px;
}

.abnormal-alert {
  margin-bottom: 24px;
}

.abnormal-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.abnormal-item {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 14px;
}

.comparison-positive {
  color: #67c23a; /* 与CoreIndicators.vue保持一致 */
}

.comparison-negative {
  color: #f56c6c;
}
</style>
