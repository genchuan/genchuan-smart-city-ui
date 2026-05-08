<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElSelect, ElOption } from 'element-plus';
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
    const [chartRes, classRes] = await Promise.allSettled([
      getStayMgmtChart({}),
      getStayMgmtCount({}),
    ]);
    if (chartRes.status === 'fulfilled') {
      chartData.value = chartRes.value;
    } else {
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
    <lineChart
      style="flex: 1.5 !important;"
      title="周末留宿趋势"
      :x-data="lineData.xAxis"
      :series-data="lineData.series"
      y-name="留宿人数"
      @line-click="handleLineClick"
    />
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
}
</style>
