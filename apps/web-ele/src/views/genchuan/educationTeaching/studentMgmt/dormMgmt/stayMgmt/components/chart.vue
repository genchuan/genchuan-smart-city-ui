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
} from '#/api/genchuan/educationTeaching/studentMgmt/dormMgmt/stayMgmt/data.js';

const loading = ref(true);
const chartData = ref({});      // 卡片 + 折线图 + 状态分布
const classStats = ref({});     // 班级统计

// ========== 时间范围选择器 ==========
const timeRange = ref([]);

// 获取默认时间范围（最近30天，结束时间为当天）
const getDefaultTimeRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 30);
  return [start, end];
};

// 格式化单个日期时间为后端要求的格式（带 T 分隔）
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
  const total = chartData.value.totalStayCount || 0;
  const pendingConfirm = chartData.value.pendingConfirmCount || 0;
  const pendingAudit = chartData.value.pendingAuditCount || 0;
  const passed = chartData.value.passedCount || 0;
  return [
    { title: '总留宿申请数', value: total, color: '#409EFF', status: 'total' },
    { title: '待确认留宿数', value: pendingConfirm, color: '#E6A23C', status: 'pendingConfirm' },
    { title: '待审核留宿数', value: pendingAudit, color: '#F56C6C', status: 'pendingAudit' },
    { title: '已通过留宿数', value: passed, color: '#67C23A', status: 'passed' },
  ];
});

// ========== 折线图数据（周末留宿趋势） ==========
const lineData = computed(() => {
  const trend = chartData.value.weekendTrend || [];
  return {
    xAxis: trend.map(item => item.date),
    series: [{ name: '留宿人数', data: trend.map(item => item.count) }],
  };
});

// ========== 饼图数据（留宿申请状态分布） ==========
const pieData = computed(() => {
  const distribution = chartData.value.statusDistribution || [];
  return distribution.map(item => ({ name: item.status, value: item.count }));
});

// ========== 柱状图数据（各班级留宿统计） ==========
const barData = computed(() => {
  const stats = classStats.value.classStatistics || [];
  return {
    xData: stats.map(item => item.className),
    seriesData: [{ name: '留宿人数', data: stats.map(item => item.stayCount) }],
  };
});

// ========== 图表切换（参考代码风格） ==========
const chartOptions = [
  { title: '周末留宿趋势', type: 'line' },
  { title: '各班级留宿统计', type: 'bar' },
];
const activeChartIndex = ref(0);
const currentChartTitle = computed(() => chartOptions[activeChartIndex.value].title);
const currentChartType = computed(() => chartOptions[activeChartIndex.value].type);

const handleChartChange = (index) => {
  activeChartIndex.value = index;
};

// ========== 事件发射 ==========
const emit = defineEmits(['cardSelect', 'pieSelect', 'barSelect', 'lineSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handlePieClick = (item) => {
  emit('pieSelect', { field: 'status', value: item.name });
};

const handleBarClick = (className) => {
  emit('barSelect', { field: 'className', value: className });
};

const handleLineClick = (params) => {
  emit('lineSelect', { field: 'date', value: params.xValue });
};

// ========== 加载数据 ==========
const loadData = async () => {
  loading.value = true;
  try {
    const timeRangeParam = getTimeRangeParam();
    const [chartRes, classRes] = await Promise.allSettled([
      getStayMgmtChart({ timeRange: timeRangeParam }),
      getStayMgmtCount({ timeRange: timeRangeParam }),
    ]);
    if (chartRes.status === 'fulfilled') {
      chartData.value = chartRes.value;
    } else {
      // 模拟数据
      chartData.value = {
        totalStayCount: 156,
        pendingConfirmCount: 15,
        pendingAuditCount: 8,
        passedCount: 133,
        weekendTrend: [
          { date: '2025-03-02', count: 22 },
          { date: '2025-03-09', count: 18 },
          { date: '2025-03-16', count: 25 },
          { date: '2025-03-23', count: 20 },
          { date: '2025-03-30', count: 28 },
        ],
        statusDistribution: [
          { status: '待确认', count: 15 },
          { status: '待审核', count: 8 },
          { status: '已通过', count: 133 },
        ],
      };
    }
    if (classRes.status === 'fulfilled') {
      classStats.value = classRes.value;
    } else {
      classStats.value = {
        classStatistics: [
          { className: '高一1班', stayCount: 18, ratio: 0.25 },
          { className: '高一2班', stayCount: 15, ratio: 0.21 },
          { className: '高一3班', stayCount: 22, ratio: 0.30 },
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
    <!-- 卡片区 -->
    <div class="box-left">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>

    <!-- 可切换图表区域（折线图 / 柱状图） -->
    <div class="chart-switch-container" style="flex: 1.5 !important; position: relative">
      <!-- 左上角：下拉切换标题 -->
      <div class="chart-select-wrapper">
        <el-select v-model="activeChartIndex" size="small" @change="handleChartChange">
          <el-option
            v-for="(opt, idx) in chartOptions"
            :key="idx"
            :label="opt.title"
            :value="idx"
          />
        </el-select>
      </div>
      <!-- 右上角：日期范围选择器 -->
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

      <!-- 折线图 -->
      <lineChart
        v-if="currentChartType === 'line'"
        :title="currentChartTitle"
        :x-data="lineData.xAxis"
        :series-data="lineData.series"
        y-name="留宿人数"
        @line-click="handleLineClick"
      />
      <!-- 柱状图 -->
      <Bar
        v-else
        :title="currentChartTitle"
        :x-data="barData.xData"
        :series-data="barData.seriesData"
        y-name="留宿人数"
        @bar-click="handleBarClick"
      />
    </div>

    <!-- 饼图（保持不变） -->
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

  /* 可切换图表区域的样式 */
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
