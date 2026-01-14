<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { Download, Refresh } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

import {
  exportMonthlyIncomeReport,
  getMonthlyIncomeReport,
} from '#/api/reports/park/monthlyIncomeApi';
import ChartContainer from '#/views/report/park/component/ChartContainer.vue';
import CoreIndicators from '#/views/report/park/component/CoreIndicators.vue';
import DataTable from '#/views/report/park/component/DataTable.vue';
import LoadingOverlay from '#/views/report/park/component/LoadingOverlay.vue';
import ReportSection from '#/views/report/park/component/ReportSection.vue';
import ReportToolbar from '#/views/report/park/component/ReportToolbar.vue';
import {
  formatCurrency,
  getComparisonClass,
  getLastMonth,
} from '#/views/report/park/component/ReportUtils';

// 响应式数据
const month = ref(getLastMonth());
const region = ref('');
const parkingType = ref('');
const loading = ref(false);
const exporting = ref(false);
const generateLoading = ref(false);
const coreIndicators = ref([]);
const trendData = ref([]);
const typeDistributionData = ref([]);
const regionDistributionData = ref([]);
const monthlyComparisonData = ref({});
const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);

// 处理后的核心指标数据
const processedCoreIndicators = computed(() => {
  return coreIndicators.value.map((indicator) => ({
    ...indicator,
    abnormal: Math.abs(indicator.comparison) > 30,
  }));
});

// 表格列定义 - 月度明细
const tableColumns = computed(() => [
  { prop: 'regionName', label: '行政区划', width: 120 },
  { prop: 'parkingType', label: '停车场类型', width: 150 },
  { prop: 'parkingCount', label: '停车场数', width: 120 },
  { prop: 'orderCount', label: '订单总数', width: 120 },
  { prop: 'totalAmount', label: '总收费金额', width: 150, type: 'currency' },
  { prop: 'avgOrderAmount', label: '月均客单价', width: 150, type: 'currency' },
  { prop: 'cashAmount', label: '现金收入', width: 150, type: 'currency' },
  { prop: 'onlineAmount', label: '线上收入', width: 150, type: 'currency' },
  { prop: 'arrearsAmount', label: '欠费金额', width: 150, type: 'currency' },
  { prop: 'onlineRate', label: '线上占比', width: 120, type: 'percentage' },
  {
    prop: 'growthRate',
    label: '环比增长',
    width: 120,
    type: 'growth',
    formatter: (value) => `${value > 0 ? '+' : ''}${value}%`
  },
]);

// 月度趋势图表配置
const trendOptions = computed(() => ({
  title: {
    text: '月度收入趋势',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  legend: {
    data: ['本月', '上月'],
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
    data: ['第1周', '第2周', '第3周', '第4周', '第5周'],
    axisLabel: {
      interval: 0,
    },
  },
  yAxis: {
    type: 'value',
    name: '收入(万元)',
  },
  series: [
    {
      name: '本月',
      type: 'line',
      data: trendData.value.current || [],
      smooth: true,
      itemStyle: {
        color: '#1890ff',
      },
    },
    {
      name: '上月',
      type: 'line',
      data: trendData.value.last || [],
      smooth: true,
      itemStyle: {
        color: '#52c41a',
      },
    },
  ],
}));

// 月度对比图表配置
const comparisonOptions = computed(() => ({
  title: {
    text: '月度收入对比',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
    formatter: (params) => {
      const current = params[0];
      const last = params[1];
      return `
        <div>${current.name}</div>
        <div>${current.seriesName}: ${formatCurrency(current.value, false)}</div>
        <div>${last.seriesName}: ${formatCurrency(last.value, false)}</div>
        <div>增长率: ${monthlyComparisonData.value.growthRate || 0}%</div>
      `;
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
    data: ['总收费金额', '订单总数', '线上收入', '现金收入'],
    axisLabel: {
      interval: 0,
    },
  },
  yAxis: {
    type: 'value',
    name: '金额(元)',
  },
  series: [
    {
      name: '本月',
      type: 'bar',
      data: monthlyComparisonData.value.current || [],
      barWidth: '40%',
      itemStyle: {
        color: '#1890ff',
      },
    },
    {
      name: '上月',
      type: 'bar',
      data: monthlyComparisonData.value.last || [],
      barWidth: '40%',
      itemStyle: {
        color: '#52c41a',
      },
    },
  ],
}));

// 区域分布图表配置
const regionDistributionOptions = computed(() => ({
  title: {
    text: '区域收入分布',
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
      name: '区域收入',
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

// 停车场类型分布图表配置
const typeDistributionOptions = computed(() => ({
  title: {
    text: '停车场类型分布',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: ¥{c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    top: 'middle',
  },
  series: [
    {
      name: '停车场类型',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '50%'],
      data: typeDistributionData.value.map(item => ({
        ...item,
        value: item.value / 10000,
        name: item.name
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
  if (unit === '元' || unit === '金额') {
    return formatCurrency(value, false);
  }
  return value.toLocaleString();
};

// 初始化
onMounted(() => {
  loadData();
});

// 监听筛选条件变化
watch([month, region, parkingType], () => {
  currentPage.value = 1;
  loadData();
});

// 加载数据
const loadData = async () => {
  try {
    loading.value = true;

    const params = {
      month: month.value,
      region: region.value,
      parkingType: parkingType.value,
      page: currentPage.value,
      pageSize: pageSize.value,
    };

    const response = await getMonthlyIncomeReport(params);

    // 更新数据
    coreIndicators.value = response.coreIndicators || [];
    trendData.value = response.trendData || {};
    typeDistributionData.value = response.typeDistribution || [];
    regionDistributionData.value = response.regionDistribution || [];
    monthlyComparisonData.value = response.monthlyComparison || {};
    tableData.value = response.tableData || [];
    totalCount.value = response.total || 0;
  } catch (error) {
    console.error('加载月收入数据失败:', error);
    ElMessage.error('加载数据失败');
  } finally {
    loading.value = false;
  }
};

// 刷新数据
const refreshData = () => {
  currentPage.value = 1;
  loadData();
};

// 导出数据
const handleExport = async () => {
  try {
    exporting.value = true;

    const params = {
      month: month.value,
      region: region.value,
      parkingType: parkingType.value,
    };

    await exportMonthlyIncomeReport(params);

    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
  } finally {
    exporting.value = false;
  }
};

// 生成报表
const generateReport = async () => {
  try {
    generateLoading.value = true;

    await new Promise(resolve => setTimeout(resolve, 1000));

    ElMessage.success(`已生成${month.value}月收入报表`);
    loadData();
  } catch (error) {
    console.error('生成报表失败:', error);
    ElMessage.error('生成报表失败');
  } finally {
    generateLoading.value = false;
  }
};

// 分页处理
const handlePageChange = (pagination) => {
  currentPage.value = pagination.page;
  pageSize.value = pagination.pageSize;
  loadData();
};

// 获取月份列表
const monthList = ref([
  { value: '2023-12', label: '2023年12月' },
  { value: '2023-11', label: '2023年11月' },
  { value: '2023-10', label: '2023年10月' },
  { value: '2023-09', label: '2023年09月' },
  { value: '2023-08', label: '2023年08月' },
]);
</script>

<template>
  <div class="monthly-income-report">
    <!-- 工具栏 -->
    <ReportToolbar>
      <template #left>
        <el-date-picker
          v-model="month"
          type="month"
          placeholder="选择月份"
          format="YYYY-MM"
          value-format="YYYY-MM"
          size="medium"
          style="width: 140px"
        />
        <el-select
          v-model="region"
          placeholder="行政区划"
          size="medium"
          clearable
          style="width: 120px"
        >
          <el-option label="全部区域" value="" />
          <el-option label="芗城区" value="xiangcheng" />
          <el-option label="龙文区" value="longwen" />
          <el-option label="龙海区" value="longhai" />
          <el-option label="漳浦县" value="zhangpu" />
        </el-select>
        <el-select
          v-model="parkingType"
          placeholder="停车场类型"
          size="medium"
          clearable
          style="width: 140px"
        >
          <el-option label="全部类型" value="" />
          <el-option label="公共停车场" value="public" />
          <el-option label="路侧停车场" value="roadside" />
          <el-option label="专用停车场" value="special" />
        </el-select>
<!--        <el-button-->
<!--          type="primary"-->
<!--          @click="generateReport"-->
<!--          :loading="generateLoading"-->
<!--        >-->
<!--          生成报表-->
<!--        </el-button>-->
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
      title="月收入核心指标"
      :indicators="processedCoreIndicators"
      :format-value="formatValue"
    >
<!--      <template #comparison="{ indicator }">-->
<!--        <span :class="getComparisonClass(indicator.comparison)">-->
<!--          较上月 {{ indicator.comparison > 0 ? '+' : '' }}{{ indicator.comparison }}%-->
<!--        </span>-->
<!--      </template>-->
    </CoreIndicators>

    <!-- 趋势分析 -->
    <div class="trend-analysis">
      <!-- 月度趋势 -->
      <ReportSection
        title="月度收入趋势"
        :with-background="true"
        :with-padding="true"
      >
        <ChartContainer :options="trendOptions" height="350px" />
      </ReportSection>

      <!-- 月度对比 -->
      <ReportSection
        title="月度收入对比"
        :with-background="true"
        :with-padding="true"
      >
        <ChartContainer :options="comparisonOptions" height="350px" />
      </ReportSection>
    </div>

    <!-- 分布分析 -->
    <div class="distribution-analysis">
      <!-- 区域分布 -->
      <ReportSection
        title="区域收入分布"
        :with-background="true"
        :with-padding="true"
      >
        <ChartContainer :options="regionDistributionOptions" height="300px" />
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

    <!-- 月度收入明细 -->
    <ReportSection title="月度收入明细">
      <DataTable
        :data="tableData"
        :columns="tableColumns"
        show-pagination
        :total="totalCount"
        :page-sizes="[10, 20, 50]"
        :hide-on-single-page="false"
        :current-page-prop="currentPage"
        :page-size-prop="pageSize"
        @page-change="handlePageChange"
        :remote="true"
      />
    </ReportSection>

    <!-- 加载状态 -->
    <LoadingOverlay v-if="loading" />
  </div>
</template>

<style scoped>
.monthly-income-report {
  position: relative;
  min-height: 600px;
  padding: 12px;
}

.trend-analysis {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.distribution-analysis {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

@media (max-width: 992px) {
  .trend-analysis,
  .distribution-analysis {
    grid-template-columns: 1fr;
  }
}
</style>
