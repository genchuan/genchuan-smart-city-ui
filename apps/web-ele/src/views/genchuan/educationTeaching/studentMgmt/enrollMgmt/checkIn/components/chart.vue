<script setup>
import { ref, computed, onMounted } from 'vue';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import lineChart from '#/genchuan-components/stats/lineChartClick.vue';
import {
  getCheckInChart,
  getCheckInIndex,
} from '#/api/genchuan/educationTeaching/studentMgmt/enrollMgmt/checkIn/data.js';

const loading = ref(true);
const chartData = ref({});      // 折线图数据 + 卡片进度
const indexData = ref({});      // 核心指标数据

// 卡片数据（报到总人数、报到完成率、待报到人数）
const cardList = computed(() => {
  const total = indexData.value.totalRegisterCount || 0;
  const completed = indexData.value.totalConfirmCount || 0;
  const rate = indexData.value.checkinRate || 0;
  const wait = chartData.value.waitConfirmCount || 0;
  return [
    { title: '报到总人数', value: total, color: '#409EFF', status: 'total' },
    { title: '报到完成率', value: `${rate}%`, color: '#67C23A', status: 'rate' },
    { title: '待报到人数', value: wait, color: '#E6A23C', status: 'wait' },
  ];
});

// 折线图数据（新生报到进度统计）
const lineData = computed(() => {
  const dateList = chartData.value.dateList || [];
  const dailyConfirmList = chartData.value.dailyConfirmList || [];
  const dailyAuditList = chartData.value.dailyAuditList || [];
  return {
    xAxis: dateList,
    series: [
      { name: '确认人数', data: dailyConfirmList },
      { name: '审核人数', data: dailyAuditList },
    ],
  };
});

const emit = defineEmits(['cardSelect', 'lineSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handleLineClick = (params) => {
  emit('lineSelect', { field: 'date', value: params.xValue });
};

const loadData = async () => {
  loading.value = true;
  try {
    const [chartRes, indexRes] = await Promise.allSettled([
      getCheckInChart({ year: 2025 }),
      getCheckInIndex({ year: 2025 }),
    ]);
    if (chartRes.status === 'fulfilled') {
      chartData.value = chartRes.value;
    } else {
      chartData.value = {
        waitConfirmCount: 50,
        waitAuditCount: 30,
        finishedCount: 240,
        totalCount: 320,
        progress: 75.0,
        dateList: ['2025-08-25', '2025-08-26', '2025-08-27', '2025-08-28', '2025-08-29'],
        dailyConfirmList: [20, 35, 42, 58, 65],
        dailyAuditList: [15, 30, 40, 55, 60],
      };
    }
    if (indexRes.status === 'fulfilled') {
      indexData.value = indexRes.value;
    } else {
      indexData.value = {
        totalRegisterCount: 320,
        totalConfirmCount: 270,
        checkinRate: 84.38,
        accountCreatedCount: 240,
        accountCreateRate: 75.0,
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
      <Indicator class="left-card" v-for="item in cardList" :key="item.title" v-bind="item" @click="handleCardClick" />
    </div>
    <lineChart
      style="flex: 2 !important;"
      title="新生报到进度统计"
      :x-data="lineData.xAxis"
      :series-data="lineData.series"
      y-name="人数"
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
