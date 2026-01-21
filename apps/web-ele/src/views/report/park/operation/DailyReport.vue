<!-- [file name]: DailyReport.vue -->
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
  getYesterdayDate,
} from '#/views/report/park/component/ReportUtils';

// 响应式数据
const selectedDate = ref(getYesterdayDate());
const region = ref(''); // 行政区划筛选
const loading = ref(false);
const exporting = ref(false);
const chartType = ref('bar');
const coreIndicators = ref([]);
const regionData = ref([]);
const abnormalities = ref([]);

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);

// 处理后的核心指标数据 - 根据筛选后的regionData动态计算
const processedCoreIndicators = computed(() => {
  // 如果筛选后有区域数据，则基于筛选后的数据计算核心指标
  if (regionData.value.length > 0) {
    const totalEnter = regionData.value.reduce((sum, item) => sum + item.enterCount, 0);
    const totalExit = regionData.value.reduce((sum, item) => sum + item.exitCount, 0);
    const totalRevenue = regionData.value.reduce((sum, item) => sum + item.revenue, 0);
    const totalWarning = regionData.value.reduce((sum, item) => sum + item.warningCount, 0);
    const totalFault = regionData.value.reduce((sum, item) => sum + item.faultCount, 0);
    const totalMemberRevenue = regionData.value.reduce((sum, item) => sum + item.memberRevenue, 0);

    // 计算平均利用率
    const avgUtilization = regionData.value.length > 0
      ? Math.round(regionData.value.reduce((sum, item) => sum + item.utilizationRate, 0) / regionData.value.length)
      : 0;

    // 计算总泊位数和已用泊位数
    const totalBerths = regionData.value.reduce((sum, item) => sum + item.totalBerths, 0);
    const usedBerths = regionData.value.reduce((sum, item) => sum + item.usedBerths, 0);

    return [
      {
        key: 'totalEnter',
        name: '总入场车次',
        value: totalEnter,
        unit: '次',
        comparison: 0, // 这里可以计算真实差值
        abnormal: false,
      },
      {
        key: 'totalExit',
        name: '总出场车次',
        value: totalExit,
        unit: '次',
        comparison: 0,
        abnormal: false,
      },
      {
        key: 'totalRevenue',
        name: '总收费金额',
        value: totalRevenue,
        unit: '元',
        comparison: 0,
        abnormal: false,
      },
      {
        key: 'avgUtilization',
        name: '平均泊位利用率',
        value: avgUtilization,
        unit: '%',
        comparison: 0,
        abnormal: false,
      },
      {
        key: 'warningCount',
        name: '预警总数',
        value: totalWarning,
        unit: '条',
        comparison: 0,
        abnormal: false,
      },
      {
        key: 'faultCount',
        name: '故障设备数',
        value: totalFault,
        unit: '台',
        comparison: 0,
        abnormal: false,
      },
      {
        key: 'memberRevenue',
        name: '会员收入',
        value: totalMemberRevenue,
        unit: '元',
        comparison: 0,
        abnormal: false,
      }
    ];
  }

  // 如果没有筛选数据，返回原始API数据
  return coreIndicators.value.map((indicator) => ({
    ...indicator,
  }));
});

// 表格列定义 - 修正类型映射
const tableColumns = computed(() => [
  { prop: 'areaName', label: '区域名称', width: 120 },
  { prop: 'district', label: '行政区', width: 100 },
  { prop: 'enterCount', label: '入场车次', width: 120 },
  { prop: 'exitCount', label: '出场车次', width: 120 },
  { prop: 'revenue', label: '收费金额', width: 150, type: 'currency' },
  {
    prop: 'utilizationRate',
    label: '泊位利用率',
    width: 150,
    type: 'progress', // 使用progress类型
  },
  { prop: 'warningCount', label: '预警数', width: 100 },
  { prop: 'faultCount', label: '故障设备', width: 100 },
  { prop: 'memberRevenue', label: '会员收入', width: 150, type: 'currency' },
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

// 分页处理
const handlePageChange = (pagination) => {
  currentPage.value = pagination.page;
  pageSize.value = pagination.pageSize;
};

// 初始化
onMounted(() => {
  loadData();
});

// 监听筛选条件变化
watch([selectedDate, region], () => {
  currentPage.value = 1; // 重置页码
  loadData();
}, { immediate: false });

// 加载数据
const loadData = async () => {
  try {
    loading.value = true;

    const params = {
      date: selectedDate.value,
      regionType: 'area', // 固定按行政区划统计
    };

    const response = await getDailyReport(params);

    // 更新核心指标和异常数据
    coreIndicators.value = response.coreIndicators;
    abnormalities.value = response.abnormalities;

    // 应用行政区划筛选
    let filteredData = response.regionData;

    // 行政区划筛选
    if (region.value) {
      filteredData = filteredData.filter(item =>
        item.district === region.value ||
        (region.value === '其他' && !['芗城', '龙文', '龙海', '长泰', '漳浦'].includes(item.district))
      );
    }

    regionData.value = filteredData;
  } catch (error) {
    console.error('加载日报表数据失败:', error);
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
      date: selectedDate.value,
      regionType: 'area', // 固定按行政区划导出
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

// 行政区划列表
const regionList = ref([
  { value: '', label: '全部行政区' },
  { value: '芗城', label: '芗城区' },
  { value: '龙文', label: '龙文区' },
  { value: '龙海', label: '龙海区' },
  { value: '长泰', label: '长泰区' },
  { value: '漳浦', label: '漳浦县' },
]);

// 清除行政区筛选
const clearRegion = () => {
  region.value = '';
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
          v-model="region"
          placeholder="选择行政区划"
          size="medium"
          clearable
          style="width: 140px; margin-left: 12px"
          @clear="clearRegion"
        >
          <el-option
            v-for="item in regionList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
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
      <!-- 暂时移除比较图标 -->
    </CoreIndicators>

    <!-- 异常提醒 -->
    <div v-if="abnormalities && abnormalities.length > 0" class="abnormal-alert">
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

    <!-- 筛选信息提示 -->
    <div v-if="region" class="filter-info">
      <el-alert :title="`当前筛选：行政区划=${regionList.find(r => r.value === region)?.label}`"
                type="info"
                :closable="false"
                show-icon />
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
      <DataTable
        :data="regionData"
        :columns="tableColumns"
        show-pagination
        :total="regionData.length"
        :current-page-prop="currentPage"
        :page-size-prop="pageSize"
        @page-change="handlePageChange"
      />
    </ReportSection>

    <!-- 加载状态 -->
    <LoadingOverlay v-if="loading" />
  </div>
</template>

<style scoped>
.daily-report {
  position: relative;
  min-height: 600px;
  padding: 12px;
}

.abnormal-alert {
  margin-bottom: 12px;
}

.filter-info {
  margin-bottom: 12px;
}

.abnormal-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.abnormal-item {
  display: flex;
  gap: 4px;
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
