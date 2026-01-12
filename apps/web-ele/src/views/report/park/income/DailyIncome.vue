<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { Download, Refresh } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

// API (需要创建对应的API文件)
import {
  exportDailyIncomeReport,
  getDailyIncomeReport,
} from '#/api/reports/park/dailyIncomeApi';
import ChartContainer from '#/views/report/park/component/ChartContainer.vue';
import CoreIndicators from '#/views/report/park/component/CoreIndicators.vue';
import DataTable from '#/views/report/park/component/DataTable.vue';
import LoadingOverlay from '#/views/report/park/component/LoadingOverlay.vue';
import ReportSection from '#/views/report/park/component/ReportSection.vue';
import ReportToolbar from '#/views/report/park/component/ReportToolbar.vue';
import {
  formatCurrency,
  generateIndicatorTag,
  getComparisonClass,
  getYesterdayDate,
} from '#/views/report/park/component/ReportUtils';

// 响应式数据
const date = ref(getYesterdayDate());
const region = ref('');
const parkingType = ref('');
const parkingId = ref('');
const loading = ref(false);
const exporting = ref(false);
const coreIndicators = ref([]);
const regionDistributionData = ref([]);
const typeDistributionData = ref([]);
const parkingDetailData = ref([]);
const paymentTypeData = ref([]);

// 处理后的核心指标数据
const processedCoreIndicators = computed(() => {
  return coreIndicators.value.map((indicator) => ({
    ...indicator,
    tag: generateIndicatorTag(indicator.comparison),
    abnormal: Math.abs(indicator.comparison) > 30,
  }));
});

// 表格列定义 - 停车场明细
const parkingColumns = computed(() => [
  { prop: 'parkingName', label: '停车场名称', width: 180 },
  { prop: 'regionName', label: '行政区划', width: 120 },
  { prop: 'parkingType', label: '停车场类型', width: 150 },
  { prop: 'orderCount', label: '订单数', width: 120 },
  { prop: 'totalAmount', label: '收费金额', width: 150, type: 'currency' },
  { prop: 'avgOrderAmount', label: '平均客单价', width: 150, type: 'currency' },
  { prop: 'cashAmount', label: '现金收入', width: 150, type: 'currency' },
  { prop: 'onlineAmount', label: '线上收入', width: 150, type: 'currency' },
  {
    prop: 'onlineRate',
    label: '线上占比',
    width: 120,
    type: 'percentage',
  },
]);

// 区域收入分布图表配置
const regionDistributionOptions = computed(() => ({
  title: {
    text: '区域收入分布',
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
    data: regionDistributionData.value.map((item) => item.regionName),
    axisLabel: {
      interval: 0,
      rotate: 45,
    },
  },
  yAxis: {
    type: 'value',
    name: '收入(万元)',
  },
  series: [
    {
      name: '收入',
      type: 'bar',
      data: regionDistributionData.value.map((item) => ({
        value: item.totalAmount,
        itemStyle: {
          color: getRegionColor(item.totalAmount),
        },
      })),
      barWidth: '60%',
      label: {
        show: true,
        position: 'top',
        formatter: (params) => formatCurrency(params.value, false),
      },
    },
  ],
}));

// 支付方式分布图表配置
const paymentTypeOptions = computed(() => ({
  title: {
    text: '支付方式分布',
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
      name: '支付方式',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '50%'],
      data: paymentTypeData.value,
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
    text: '停车场类型收入分布',
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
      name: '停车场类型',
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
}));

// 根据收入金额获取颜色
const getRegionColor = (amount) => {
  if (amount >= 100000) return '#52c41a'; // 绿色 - 高收入
  if (amount >= 50000) return '#1890ff';  // 蓝色 - 中高收入
  if (amount >= 20000) return '#fa8c16';  // 橙色 - 中等收入
  return '#f5222d';                       // 红色 - 低收入
};

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
watch([date, region, parkingType, parkingId], () => {
  loadData();
});

// 加载数据
const loadData = async () => {
  try {
    loading.value = true;

    const params = {
      date: date.value,
      region: region.value,
      parkingType: parkingType.value,
      parkingId: parkingId.value,
    };

    const response = await getDailyIncomeReport(params);

    // 更新数据
    coreIndicators.value = response.coreIndicators || [];
    regionDistributionData.value = response.regionDistribution || [];
    typeDistributionData.value = response.typeDistribution || [];
    parkingDetailData.value = response.parkingDetail || [];
    paymentTypeData.value = response.paymentType || [];
  } catch (error) {
    console.error('加载日收入数据失败:', error);
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
      date: date.value,
      region: region.value,
      parkingType: parkingType.value,
      parkingId: parkingId.value,
    };

    await exportDailyIncomeReport(params);

    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
  } finally {
    exporting.value = false;
  }
};

// 获取停车场列表（模拟）
const parkingList = ref([
  { value: '', label: '全部停车场' },
  { value: 'park001', label: '漳州万达广场停车场' },
  { value: 'park002', label: '芗城政府路侧停车场' },
  { value: 'park003', label: '龙文区体育中心停车场' },
  { value: 'park004', label: '龙海区商业城停车场' },
]);
</script>

<template>
  <div class="daily-income-report">
    <!-- 工具栏 -->
    <ReportToolbar>
      <template #left>
        <el-date-picker
          v-model="date"
          type="date"
          placeholder="选择日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          size="medium"
          style="width: 160px"
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
        <el-select
          v-model="parkingId"
          placeholder="停车场"
          size="medium"
          clearable
          style="width: 220px; margin-left: 12px"
        >
          <el-option
            v-for="parking in parkingList"
            :key="parking.value"
            :label="parking.label"
            :value="parking.value"
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
      title="日收入核心指标"
      :indicators="processedCoreIndicators"
      :format-value="formatValue"
    >
      <template #comparison="{ indicator }">
        <span :class="getComparisonClass(indicator.comparison)">
          较近7日均值 {{ indicator.comparison > 0 ? '+' : '' }}{{ indicator.comparison }}%
        </span>
      </template>
    </CoreIndicators>

    <!-- 区域收入分布 -->
    <ReportSection title="区域收入分布">
      <ChartContainer :options="regionDistributionOptions" height="350px" />
    </ReportSection>

    <!-- 多维度分析 -->
    <div class="multi-dimension">
      <!-- 支付方式分布 -->
      <ReportSection
        title="支付方式分布"
        :with-background="true"
        :with-padding="true"
      >
        <ChartContainer :options="paymentTypeOptions" height="300px" />
      </ReportSection>

      <!-- 停车场类型分布 -->
      <ReportSection
        title="停车场类型分布"
        :with-background="true"
        :with-padding="true"
      >
        <ChartContainer :options="typeDistributionOptions" height="300px" />
      </ReportSection>
    </div>

    <!-- 停车场收入明细 -->
    <ReportSection title="停车场收入明细">
      <DataTable
        :data="parkingDetailData"
        :columns="parkingColumns"
        show-pagination
        :total="parkingDetailData.length"
        :page-sizes="[10, 20, 50]"
      />
    </ReportSection>

    <!-- 加载状态 -->
    <LoadingOverlay v-if="loading" />
  </div>
</template>

<style scoped>
.daily-income-report {
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
