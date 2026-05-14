<script setup>
import {reactive, onMounted, ref, computed} from 'vue';
import {ElMessage, ElDatePicker} from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import lineChart from '#/genchuan-components/stats/lineChartClick.vue';
import {
  getDutyMgmtChart,
  getDutyIndex,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/studentWork/dutyMgmt/data.js';

const loading = ref(true);
const chartData = ref({});
const indexData = ref({
  monthList: [],
  dutyCountList: [],
  checkInRateList: [],
  shiftRateList: [],
  vehicleRateList: []
});

// 时间范围选择器
const dateRange = ref([new Date('2024-01-01'), new Date('2026-12-31')]);

const formatLocalDateTime = (date) => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

// 卡片列表（不支持点击筛选，保持原样）
const cardList = computed(() => {
  const total = chartData.value.totalDutyCount || 0;
  const today = chartData.value.todayDutyCount || 0;
  const checkInRate = chartData.value.checkInRate || 0;
  const shiftCount = chartData.value.shiftApplyCount || 0;
  const vehicleCount = chartData.value.vehicleApplyCount || 0;
  return [
    {title: '总值班次数', value: total, color: '#409EFF'},
    {title: '今日值班人数', value: today, color: '#67C23A'},
    {title: '打卡率(%)', value: checkInRate, color: '#E6A23C'},
    {title: '调班次数', value: shiftCount, color: '#F56C6C'},
    {title: '出车次数', value: vehicleCount, color: '#909399'},
  ];
});

// 折线图数据
const lineXData = computed(() => indexData.value.monthList || []);
const lineSeriesData = computed(() => [
  {name: '值班次数', data: indexData.value.dutyCountList || []},
  {name: '打卡率(%)', data: indexData.value.checkInRateList || []},
  {name: '调班率(%)', data: indexData.value.shiftRateList || []},
  {name: '出车率(%)', data: indexData.value.vehicleRateList || []},
]);

// ========== 核心修改：折线图点击改为派发自定义事件 ==========
const handleLineClick = (monthName) => {
  // monthName 格式例如 "2025-01"
  window.dispatchEvent(new CustomEvent('duty-chart-filter', {
    detail: {month: monthName}
  }));
};

// 加载数据函数保持不变
const loadChartData = async () => {
  try {
    const params = {};
    if (dateRange.value && dateRange.value.length === 2) {
      const startDate = dateRange.value[0];
      const endDate = dateRange.value[1];
      if (startDate) params.startTime = formatLocalDateTime(startDate);
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        params.endTime = formatLocalDateTime(endDateTime);
      }
    }
    const res = await getDutyMgmtChart(params);
    chartData.value = res;
  } catch (error) {
    console.warn('获取看板数据失败，使用模拟数据', error);
    chartData.value = {
      totalDutyCount: 124,
      todayDutyCount: 4,
      checkInRate: 96.77,
      shiftApplyCount: 8,
      vehicleApplyCount: 5,
      statusCountMap: {'待打卡': 12, '待调班审批': 2, '待出车审批': 1, '已完成': 109},
    };
  }
};

const loadIndexData = async () => {
  try {
    const params = {};
    if (dateRange.value && dateRange.value.length === 2) {
      const startDate = dateRange.value[0];
      const endDate = dateRange.value[1];
      if (startDate) params.startTime = formatLocalDateTime(startDate);
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        params.endTime = formatLocalDateTime(endDateTime);
      }
    }
    const res = await getDutyIndex(params);
    indexData.value = res;
  } catch (error) {
    console.warn('获取核心指标数据失败，使用模拟数据', error);
    indexData.value = {
      monthList: ['2025-01', '2025-02', '2025-03'],
      dutyCountList: [112, 98, 124],
      checkInRateList: [95.54, 96.94, 96.77],
      shiftRateList: [6.25, 7.14, 6.45],
      vehicleRateList: [4.46, 3.06, 4.03],
    };
  }
};

const handleDateRangeChange = async () => {
  if (dateRange.value && dateRange.value.length === 2) {
    loading.value = true;
    try {
      await Promise.all([loadChartData(), loadIndexData()]);
    } finally {
      loading.value = false;
    }
  }
};

const loadData = async () => {
  loading.value = true;
  try {
    const [chartRes, indexRes] = await Promise.allSettled([
      getDutyMgmtChart({}),
      getDutyIndex({}),
    ]);
    if (chartRes.status === 'fulfilled') chartData.value = chartRes.value;
    else chartData.value = {
      totalDutyCount: 124,
      todayDutyCount: 4,
      checkInRate: 96.77,
      shiftApplyCount: 8,
      vehicleApplyCount: 5,
      statusCountMap: {'待打卡': 12, '待调班审批': 2, '待出车审批': 1, '已完成': 109}
    };
    if (indexRes.status === 'fulfilled') indexData.value = indexRes.value;
    else indexData.value = {
      monthList: ['2025-01', '2025-02', '2025-03'],
      dutyCountList: [112, 98, 124],
      checkInRateList: [95.54, 96.94, 96.77],
      shiftRateList: [6.25, 7.14, 6.45],
      vehicleRateList: [4.46, 3.06, 4.03]
    };
  } catch (error) {
    console.error('加载图表数据失败', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div v-loading="loading" class="chart-box">
    <div class="box-left-m">
      <Indicator class="left-card" v-for="item in cardList" :key="item.title" v-bind="item"/>
    </div>
    <div class="line-chart-container">
      <div class="date-range-wrapper">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="-"
          start-placeholder="起始时间"
          end-placeholder="结束时间"
          size="small"
          :shortcuts="[
            { text: '近三个月', value: () => { const end = new Date(); const start = new Date(); start.setMonth(start.getMonth() - 3); return [start, end]; } },
            { text: '近半年', value: () => { const end = new Date(); const start = new Date(); start.setMonth(start.getMonth() - 6); return [start, end]; } },
            { text: '近一年', value: () => { const end = new Date(); const start = new Date(); start.setFullYear(start.getFullYear() - 1); return [start, end]; } }
          ]"
          @change="handleDateRangeChange"
        />
      </div>
      <lineChart
        style="flex: 1.5 !important;"
        :title="'值班核心指标趋势'"
        :x-data="lineXData"
        :series-data="lineSeriesData"
        y-name="数值"
        @line-click="handleLineClick"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.chart-box {
  padding-bottom: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  padding-left: 15px;
  padding-right: 15px;
  width: 100% !important;

  .box-left-m {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr);
    min-width: 360px;
    max-width: 400px;
    margin-top: 10px !important;

    .left-card {
      height: 150px !important;
    }
  }

  .line-chart-container {
    position: relative;
    flex: 1.5;
    min-width: 300px;
    margin-top: 10px;
  }

  .date-range-wrapper {
    position: absolute;
    top: 8px;
    right: 10px;
    z-index: 10;
  }

  :deep(.el-date-editor) {
    --el-date-editor-width: 240px;

    .el-range__icon {
      margin-right: 2px;
    }

    .el-range-separator {
      padding: 0 4px;
    }

    .el-range__close-icon {
      margin-left: 2px;
    }
  }
}
</style>
