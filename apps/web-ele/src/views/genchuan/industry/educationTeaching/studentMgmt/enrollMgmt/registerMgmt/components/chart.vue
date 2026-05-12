<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElSelect, ElOption, ElDatePicker } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import lineChart from '#/genchuan-components/stats/lineChartClick.vue';
import {
  getRegisterMgmtChart,
  getRegisterMgmtEnrollCount,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/enrollMgmt/registerMgmt/data.js';

const loading = ref(true);
const chartData = ref({});          // 卡片 + 折线图
const enrollData = ref({});         // 专业报名录取数据

// 时间范围选择器绑定的值（数组格式 [startDate, endDate]）
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
  const total = chartData.value.totalApplyCount || 0;
  const pending = chartData.value.pendingAuditCount || 0;
  const admitted = chartData.value.admittedCount || 0;
  const confirmed = chartData.value.confirmedCount || 0;
  return [
    { title: '总报名人数', value: total, color: '#409EFF', status: 'total' },
    { title: '待审核人数', value: pending, color: '#E6A23C', status: 'pending' },
    { title: '已录取人数', value: admitted, color: '#67C23A', status: 'admitted' },
    { title: '已确认人数', value: confirmed, color: '#909399', status: 'confirmed' },
  ];
});

// ========== 折线图数据（近一周报名趋势） ==========
const lineData = computed(() => {
  const trend = chartData.value.recentWeekApplyTrend || [];
  return {
    xAxis: trend.map(item => item.date),
    series: [{ name: '报名人数', data: trend.map(item => item.count) }],
  };
});

// ========== 柱状图数据（各专业报名/录取人数） ==========
const barData = computed(() => {
  const data = enrollData.value.majorEnrollData || [];
  return {
    xData: data.map(item => item.major),
    seriesData: [
      { name: '报名人数', data: data.map(item => item.applyCount) },
      { name: '录取人数', data: data.map(item => item.admitCount) },
    ],
  };
});

// ========== 图表切换选项 ==========
const chartOptions = computed(() => [
  {
    type: 'bar',
    title: '各专业报名/录取人数',
    xData: barData.value.xData,
    seriesData: barData.value.seriesData,
    yName: '人数',
  },
  {
    type: 'line',
    title: '近一周报名趋势',
    xData: lineData.value.xAxis,
    seriesData: lineData.value.series,
    yName: '报名人数',
  },
]);

const activeChartIndex = ref(0);
const currentChart = computed(() => chartOptions.value[activeChartIndex.value] || chartOptions.value[0]);

const handleChartChange = (index) => {
  activeChartIndex.value = index;
};

// ========== 事件发射 ==========
const emit = defineEmits(['cardSelect', 'barSelect', 'lineSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handleBarClick = (majorName) => {
  emit('barSelect', { field: 'major', value: majorName });
};

const handleLineClick = (params) => {
  emit('lineSelect', { field: 'date', value: params.xValue });
};

// ========== 加载数据 ==========
const loadData = async () => {
  loading.value = true;
  try {
    const timeRangeParam = getTimeRangeParam();
    const [chartRes, enrollRes] = await Promise.allSettled([
      getRegisterMgmtChart({ timeRange: timeRangeParam }),
      getRegisterMgmtEnrollCount({ timeRange: timeRangeParam }),
    ]);
    if (chartRes.status === 'fulfilled') {
      chartData.value = chartRes.value;
    } else {
      console.warn('看板接口失败，使用模拟数据', chartRes.reason);
      chartData.value = {
        totalApplyCount: 156,
        pendingAuditCount: 22,
        admittedCount: 134,
        confirmedCount: 118,
        recentWeekApplyTrend: [
          { date: '2025-03-25', count: 12 },
          { date: '2025-03-26', count: 18 },
          { date: '2025-03-27', count: 22 },
          { date: '2025-03-28', count: 16 },
          { date: '2025-03-29', count: 14 },
          { date: '2025-03-30', count: 10 },
          { date: '2025-03-31', count: 8 },
        ],
      };
    }
    if (enrollRes.status === 'fulfilled') {
      enrollData.value = enrollRes.value;
    } else {
      console.warn('专业统计接口失败，使用模拟数据', enrollRes.reason);
      enrollData.value = {
        majorEnrollData: [
          { major: '计算机应用技术', applyCount: 45, admitCount: 40 },
          { major: '电子商务', applyCount: 32, admitCount: 28 },
          { major: '机电一体化', applyCount: 28, admitCount: 25 },
          { major: '会计电算化', applyCount: 25, admitCount: 22 },
          { major: '学前教育', applyCount: 26, admitCount: 19 },
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

    <div class="chart-area main-chart-container">
      <!-- 图表切换下拉框 -->
      <div class="chart-select-wrapper">
        <el-select
          v-model="activeChartIndex"
          size="small"
          @change="handleChartChange"
        >
          <el-option
            v-for="(opt, idx) in chartOptions"
            :key="idx"
            :label="opt.title"
            :value="idx"
          />
        </el-select>
      </div>

      <!-- 时间范围选择器（紧凑样式，位于右上角） -->
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

      <Bar
        v-if="currentChart.type === 'bar'"
        style="flex: 1 !important;"
        :title="currentChart.title"
        :x-data="currentChart.xData"
        :series-data="currentChart.seriesData"
        :y-name="currentChart.yName"
        @bar-click="handleBarClick"
      />
      <lineChart
        v-else
        style="flex: 1 !important;"
        :title="currentChart.title"
        :x-data="currentChart.xData"
        :series-data="currentChart.seriesData"
        :y-name="currentChart.yName"
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

  .box-left {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
    min-width: 280px;
    max-width: 320px;
    margin-top: 10px !important;

    .left-card {
      height: 150px !important;
    }
  }

  .chart-area {
    position: relative;
    flex: 1;
    min-width: 280px;
    height: 100%;
  }

  .chart-select-wrapper {
    position: absolute;
    top: 8px;
    right: 10px;
    z-index: 10;
  }

  /* 主图表容器（用于定位时间选择器） */
  .main-chart-container {
    position: relative;
  }

  .date-range-wrapper {
    position: absolute;
    top: 8px;
    left: 10px;
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
