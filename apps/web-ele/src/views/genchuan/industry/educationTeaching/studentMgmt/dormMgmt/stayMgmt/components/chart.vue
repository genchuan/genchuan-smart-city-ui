<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElSelect, ElOption, ElDatePicker } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import lineChart from '#/genchuan-components/stats/lineChartClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import {
  getStayMgmtChart,
  getStayMgmtCount,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/dormMgmt/stayMgmt/data.js';

const loading = ref(true);
const chartData = ref({});
const classStats = ref({});

const timeRange = ref([]);

const getDefaultTimeRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 30);
  return [start, end];
};

const formatDateTime = (date, isEnd = false) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const time = isEnd ? '23:59:59' : '00:00:00';
  return `${year}-${month}-${day} ${time}`;
};

const getTimeRangeParam = () => {
  if (timeRange.value && timeRange.value.length === 2) {
    const startStr = formatDateTime(timeRange.value[0], false);
    const endStr = formatDateTime(timeRange.value[1], true);
    return `${startStr},${endStr}`;
  }
  const [defaultStart, defaultEnd] = getDefaultTimeRange();
  return `${formatDateTime(defaultStart, false)},${formatDateTime(defaultEnd, true)}`;
};

const handleDateRangeChange = () => {
  loadData();
};

const cardList = computed(() => {
  const total = chartData.value.totalStayCount || 0;
  const pendingConfirm = chartData.value.pendingConfirmCount || 0;
  const pendingAudit = chartData.value.pendingAuditCount || 0;
  const passed = chartData.value.passedCount || 0;
  return [
    {title: '总留宿申请数', value: total, color: '#409EFF', status: 'total'},
    {title: '待确认留宿数', value: pendingConfirm, color: '#E6A23C', status: 'pendingConfirm'},
    {title: '待审核留宿数', value: pendingAudit, color: '#F56C6C', status: 'pendingAudit'},
    {title: '已通过留宿数', value: passed, color: '#67C23A', status: 'passed'},
  ];
});

const lineData = computed(() => {
  const trend = chartData.value.weekendTrend || [];
  return {
    xAxis: trend.map(item => item.date),
    series: [{name: '留宿人数', data: trend.map(item => item.count)}],
  };
});

const pieData = computed(() => {
  const distribution = chartData.value.statusDistribution || [];
  return distribution.map(item => ({name: item.status, value: item.count}));
});

const barData = computed(() => {
  const stats = classStats.value.classStatistics || [];
  return {
    xData: stats.map(item => item.className),
    seriesData: [{name: '留宿人数', data: stats.map(item => item.stayCount)}],
  };
});

const chartOptions = [
  {title: '周末留宿趋势', type: 'line'},
  {title: '各班级留宿统计', type: 'bar'},
];
const activeChartIndex = ref(0);
const currentChartTitle = computed(() => chartOptions[activeChartIndex.value].title);
const currentChartType = computed(() => chartOptions[activeChartIndex.value].type);

const handleChartChange = (index) => {
  activeChartIndex.value = index;
};

// ========== 核心修改：所有点击改为派发自定义事件 ==========
const handleCardClick = (cardInfo) => {
  let filterType = null;
  let filterValue = null;
  switch (cardInfo.status) {
    case 'pendingConfirm':
      filterType = 'status';
      filterValue = '待确认';
      break;
    case 'pendingAudit':
      filterType = 'status';
      filterValue = '待审核';
      break;
    case 'passed':
      filterType = 'status';
      filterValue = '已通过';
      break;
    case 'total':
    default:
      return;
  }
  window.dispatchEvent(new CustomEvent('stay-chart-filter', {
    detail: {type: filterType, value: filterValue}
  }));
};

const handlePieClick = (item) => {
  window.dispatchEvent(new CustomEvent('stay-chart-filter', {
    detail: {type: 'status', value: item.name}
  }));
};

const handleBarClick = (className) => {
  window.dispatchEvent(new CustomEvent('stay-chart-filter', {
    detail: {type: 'className', value: className}
  }));
};

const handleLineClick = (params) => {
  // params.xValue 为日期，例如 "2025-03-02"
  const date = params.xValue || params.name;
  if (date) {
    window.dispatchEvent(new CustomEvent('stay-chart-filter', {
      detail: {type: 'stayDate', value: date}
    }));
  }
};

// 加载数据（保持不变）
const loadData = async () => {
  loading.value = true;
  try {
    const timeRangeParam = getTimeRangeParam();
    const [chartRes, classRes] = await Promise.allSettled([
      getStayMgmtChart({timeRange: timeRangeParam}),
      getStayMgmtCount({timeRange: timeRangeParam}),
    ]);
    if (chartRes.status === 'fulfilled') chartData.value = chartRes.value;
    else {
      chartData.value = {
        totalStayCount: 156,
        pendingConfirmCount: 15,
        pendingAuditCount: 8,
        passedCount: 133,
        weekendTrend: [
          {date: '2025-03-02', count: 22},
          {date: '2025-03-09', count: 18},
          {date: '2025-03-16', count: 25},
          {date: '2025-03-23', count: 20},
          {date: '2025-03-30', count: 28},
        ],
        statusDistribution: [
          {status: '待确认', count: 15},
          {status: '待审核', count: 8},
          {status: '已通过', count: 133},
        ],
      };
    }
    if (classRes.status === 'fulfilled') classStats.value = classRes.value;
    else {
      classStats.value = {
        classStatistics: [
          {className: '高一1班', stayCount: 18, ratio: 0.25},
          {className: '高一2班', stayCount: 15, ratio: 0.21},
          {className: '高一3班', stayCount: 22, ratio: 0.30},
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
    <div class="box-left">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>

    <div class="chart-switch-container" style="flex: 1.5 !important; position: relative">
      <div class="chart-select-wrapper">
        <el-select v-model="activeChartIndex" size="small" @change="handleChartChange">
          <el-option v-for="(opt, idx) in chartOptions" :key="idx" :label="opt.title" :value="idx"/>
        </el-select>
      </div>
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
        v-if="currentChartType === 'line'"
        :title="currentChartTitle"
        :x-data="lineData.xAxis"
        :series-data="lineData.series"
        y-name="留宿人数"
        @line-click="handleLineClick"
      />
      <Bar
        v-else
        :title="currentChartTitle"
        :x-data="barData.xData"
        :series-data="barData.seriesData"
        y-name="留宿人数"
        @bar-click="handleBarClick"
      />
    </div>

    <Pie
      style="flex: 1 !important;"
      title-text="留宿申请状态分布"
      :data="pieData"
      @pie-click="handlePieClick"
    />
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

  .box-left {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    min-width: 280px;
    max-width: 320px;
    margin-top: 10px !important;

    .left-card {
      height: 150px !important;
    }
  }

  .chart-switch-container {
    position: relative;
    min-width: 280px;
    margin-left: 12px;
  }

  .chart-select-wrapper {
    position: absolute;
    top: 8px;
    left: 10px;
    z-index: 10;
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
