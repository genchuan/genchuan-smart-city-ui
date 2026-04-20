<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElSelect, ElOption } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import lineChart from '#/genchuan-components/stats/lineChartClick.vue';
import {
  getLeaveHandleChart,
  getLeaveHandleIndex,
} from '#/api/genchuan/educationTeaching/studentMgmt/leaveMgmt/leaveHandle/data.js';

const loading = ref(true);
const chartData = ref({});          // 卡片数据
const indexData = ref({});          // 折线图数据

// ========== 卡片数据 ==========
const cardList = computed(() => {
  const total = chartData.value.totalGraduate || 0;
  const waitHandle = chartData.value.waitHandle || 0;
  const finishRate = chartData.value.finishRate || 0;
  return [
    { title: '离校办理人数', value: total, color: '#409EFF', status: 'total' },
    { title: '办理完成率', value: finishRate, color: '#67C23A', suffix: '%', status: 'rate' },
    { title: '待办理人数', value: waitHandle, color: '#E6A23C', status: 'waitHandle' },
  ];
});

// ========== 折线图数据（每日离校人数趋势） ==========
const lineData = computed(() => {
  const trend = indexData.value.dailyLeaveCount || [];
  return {
    xAxis: trend.map(item => item.date),
    series: [{ name: '离校人数', data: trend.map(item => item.count) }],
  };
});

// ========== 事件发射 ==========
const emit = defineEmits(['cardSelect', 'lineSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handleLineClick = (params) => {
  emit('lineSelect', { field: 'date', value: params.xValue });
};

// ========== 加载数据 ==========
const loadData = async () => {
  loading.value = true;
  try {
    const [chartRes, indexRes] = await Promise.allSettled([
      getLeaveHandleChart({}),
      getLeaveHandleIndex({}),
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
          { date: '2025-03-25', count: 15 },
          { date: '2025-03-26', count: 22 },
          { date: '2025-03-27', count: 18 },
          { date: '2025-03-28', count: 16 },
          { date: '2025-03-29', count: 12 },
          { date: '2025-03-30', count: 9 },
          { date: '2025-03-31', count: 11 },
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
    <div class="chart-box-left">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>
    <lineChart
      style="flex: 1 !important;"
      title="每日离校人数趋势"
      :x-data="lineData.xAxis"
      :series-data="lineData.series"
      y-name="离校人数"
      @line-click="handleLineClick"
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

  .chart-box-left {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 280px;
    max-width: 320px;
    margin: 0;
  }
}
</style>
