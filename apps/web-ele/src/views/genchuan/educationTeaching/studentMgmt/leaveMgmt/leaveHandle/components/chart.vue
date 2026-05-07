<script setup>
import {ref, computed, onMounted} from 'vue';
import {ElSelect, ElOption, ElDatePicker} from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import lineChart from '#/genchuan-components/stats/lineChartClick.vue';
import {
  getLeaveHandleChart,
  getLeaveHandleIndex,
} from '#/api/genchuan/educationTeaching/studentMgmt/leaveMgmt/leaveHandle/data.js';

const loading = ref(true);
const chartData = ref({});          // 卡片数据
const indexData = ref({});          // 折线图数据

// ========== 时间范围选择器 ==========
const timeRange = ref([]);

// 获取默认时间范围（最近30天，结束时间为当天）
const getDefaultTimeRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 30);
  return [start, end];
};

// 格式化单个日期时间为后端要求的格式（带 T 分隔，如 "2023-01-01T00:00:00"）
// isEnd: 是否为结束时间（结束时间用 23:59:59，起始用 00:00:00）
const formatDateTime = (date, isEnd = false) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const time = isEnd ? '23:59:59' : '00:00:00';
  return `${year}-${month}-${day}T${time}`;
};

// 生成 timeRange 字符串（格式："起始时间,结束时间"）
const getTimeRangeParam = () => {
  if (timeRange.value && timeRange.value.length === 2) {
    const startStr = formatDateTime(timeRange.value[0], false);
    const endStr = formatDateTime(timeRange.value[1], true);
    return `${startStr},${endStr}`;
  }
  const [defaultStart, defaultEnd] = getDefaultTimeRange();
  return `${formatDateTime(defaultStart, false)},${formatDateTime(defaultEnd, true)}`;
};

// 日期范围变化时重新加载数据
const handleDateRangeChange = () => {
  loadData();
};

// ========== 卡片数据 ==========
const cardList = computed(() => {
  const total = chartData.value.totalGraduate || 0;
  const waitHandle = chartData.value.waitHandle || 0;
  const finishRate = chartData.value.finishRate || 0;
  return [
    {title: '离校办理人数', value: total, color: '#409EFF', status: 'total'},
    {title: '办理完成率', value: finishRate, color: '#67C23A', suffix: '%', status: 'rate'},
    {title: '待办理人数', value: waitHandle, color: '#E6A23C', status: 'waitHandle'},
  ];
});

// ========== 折线图数据（每日离校人数趋势） ==========
const lineData = computed(() => {
  const trend = indexData.value.dailyLeaveCount || [];
  return {
    xAxis: trend.map(item => item.date),
    series: [{name: '离校人数', data: trend.map(item => item.count)}],
  };
});

// ========== 事件发射 ==========
const emit = defineEmits(['cardSelect', 'lineSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handleLineClick = (params) => {
  emit('lineSelect', {field: 'date', value: params.xValue});
};

// ========== 加载数据 ==========
const loadData = async () => {
  loading.value = true;
  try {
    const timeRangeParam = getTimeRangeParam();
    const [chartRes, indexRes] = await Promise.allSettled([
      getLeaveHandleChart({timeRange: timeRangeParam}),
      getLeaveHandleIndex({timeRange: timeRangeParam}),
    ]);
    if (chartRes.status === 'fulfilled') {
      chartData.value = chartRes.value;
    } else {
      chartData.value = {
        totalGraduate: 256,
        waitConfirm: 12,
        waitHandle: 24,
        finishedLeave: 220,
        finishRate: 85.94,
      };
    }
    if (indexRes.status === 'fulfilled') {
      indexData.value = indexRes.value;
    } else {
      indexData.value = {
        checkoutRate: 92.58,
        parentConfirmRate: 95.31,
        handleFinishRate: 85.94,
        dailyLeaveCount: [
          {date: '2025-03-25', count: 15},
          {date: '2025-03-26', count: 22},
          {date: '2025-03-27', count: 18},
          {date: '2025-03-28', count: 16},
          {date: '2025-03-29', count: 12},
          {date: '2025-03-30', count: 9},
          {date: '2025-03-31', count: 11},
        ],
      };
    }
  } catch (error) {
    console.error('加载图表数据失败', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  timeRange.value = getDefaultTimeRange();
  loadData();
});
</script>

<template>
  <div v-loading="loading" class="chart-box">
    <div class="chart-box-left">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>

    <!-- 折线图容器（含日期选择器） -->
    <div class="line-chart-container" style="flex: 1 !important; position: relative;">
      <!-- 日期范围选择器（紧凑样式，位于右上角） -->
      <div class="date-range-wrapper">
        <el-date-picker
          v-model="timeRange"
          type="daterange"
          range-separator="-"
          start-placeholder="起始"
          end-placeholder="结束"
          size="small"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :shortcuts="[
            { text: '近7天', value: () => { const end = new Date(); const start = new Date(); start.setDate(end.getDate() - 7); return [start, end]; } },
            { text: '近30天', value: () => { const end = new Date(); const start = new Date(); start.setDate(end.getDate() - 30); return [start, end]; } },
            { text: '近90天', value: () => { const end = new Date(); const start = new Date(); start.setDate(end.getDate() - 90); return [start, end]; } }
          ]"
          @change="handleDateRangeChange"
        />
      </div>
      <lineChart
        title="每日离校人数趋势"
        :x-data="lineData.xAxis"
        :series-data="lineData.series"
        y-name="离校人数"
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

  .chart-box-left {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 280px;
    max-width: 320px;
    margin: 0;
  }

  /* 折线图容器特殊样式，用于绝对定位日期选择器 */
  .line-chart-container {
    position: relative;
    flex: 1;
    min-width: 280px;
    margin-left: 12px;
  }

  .date-range-wrapper {
    position: absolute;
    top: 8px;
    right: 10px;
    z-index: 10;
  }

  /* 紧凑的时间选择器样式 */
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
