<script setup>
import { reactive, onMounted, ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import {
  getAbnormalOrderChart,
} from '#/api/genchuan/industry/energyCharging/carCharging/chargingOrder/abnormalOrder/data.js';

const mockChartData = {
  barData: [
    { date: '2026-04-01', abnormalCount: 5, handleCount: 4 },
    { date: '2026-04-02', abnormalCount: 3, handleCount: 3 },
    { date: '2026-04-03', abnormalCount: 7, handleCount: 5 },
    { date: '2026-04-04', abnormalCount: 4, handleCount: 4 },
    { date: '2026-04-05', abnormalCount: 6, handleCount: 5 },
    { date: '2026-04-06', abnormalCount: 8, handleCount: 6 },
    { date: '2026-04-07', abnormalCount: 2, handleCount: 2 },
  ],
  pieData: [
    { name: '充电中断', value: 15 },
    { name: '支付异常', value: 8 },
    { name: '设备故障', value: 9 },
  ],
  cardData: {
    totalAbnormalCount: 32,
    unHandleCount: 5,
    handleCount: 27,
    handleRatio: 84.38,
  },
};

const loading = ref(true);
const chartData = ref({ ...mockChartData });

const cardList = computed(() => {
  const total = chartData.value.cardData?.totalAbnormalCount || 0;
  const unHandle = chartData.value.cardData?.unHandleCount || 0;
  const handle = chartData.value.cardData?.handleCount || 0;
  const rate = chartData.value.cardData?.handleRatio || 0;
  return [
    { title: '总异常订单数', value: total, color: '#409EFF', status: 'total' },
    { title: '未处理数', value: unHandle, color: '#E6A23C', status: 'unHandle' },
    { title: '已处理数', value: handle, color: '#67C23A', status: 'handle' },
    { title: '处理完成率', value: `${rate}%`, color: '#F56C6C', status: 'rate' },
  ];
});

// 柱状图数据
const barXData = computed(() => chartData.value.barData?.map(item => item.date) || []);
const barSeriesData = computed(() => [
  { name: '异常订单数量', data: chartData.value.barData?.map(item => item.abnormalCount) || [] },
  { name: '处理完成数量', data: chartData.value.barData?.map(item => item.handleCount) || [] },
]);

// 饼图数据
const pieData = computed(() => chartData.value.pieData || []);

const emit = defineEmits(['barSelect', 'pieSelect', 'cardSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handleBarClick = (params) => {
  emit('barSelect', params.name);
};

const handlePieClick = (item) => {
  emit('pieSelect', item.name);
};

const fetchChartData = async () => {
  loading.value = true;
  try {
    const res = await getAbnormalOrderChart({});
    chartData.value = res;
  } catch (error) {
    console.warn('图表接口失败，使用模拟数据', error);
    chartData.value = mockChartData;
    ElMessage.info('当前使用模拟数据，展示总览信息');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchChartData();
});
</script>

<template>
  <div v-loading="loading" class="chart-box">
    <div class="box-left" style="flex: 1 !important;">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>
    <Bar
      style="flex: 1.5 !important;"
      :title="'每日异常订单数量及处理完成数量'"
      :x-data="barXData"
      :series-data="barSeriesData"
      y-name="数量"
      @bar-click="handleBarClick"
    />
    <Pie
      style="flex: 1 !important;"
      :title-text="'异常订单类型占比'"
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
    min-width: 280px;
    max-width: 320px;
    margin-top: 10px !important;

    .left-card {
      height: 150px !important;
    }
  }
}
</style>
