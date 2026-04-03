<script setup>
import { reactive, onMounted, ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import { getAbnormalOrderChart } from '#/api/genchuan/industry/energyCharging/carCharging/chargingOrder/abnormalOrder/data.js';

// 模拟数据
const mockOverviewData = {
  barData: [
    { date: '2026-03-25', abnormalCount: 12, handleCount: 8 },
    { date: '2026-03-26', abnormalCount: 15, handleCount: 10 },
    { date: '2026-03-27', abnormalCount: 18, handleCount: 14 },
    { date: '2026-03-28', abnormalCount: 14, handleCount: 12 },
    { date: '2026-03-29', abnormalCount: 20, handleCount: 16 },
    { date: '2026-03-30', abnormalCount: 22, handleCount: 18 },
    { date: '2026-03-31', abnormalCount: 25, handleCount: 22 },
  ],
  pieData: [
    { name: '支付异常', value: 35 },
    { name: '充电中断', value: 52 },
    { name: '设备故障', value: 28 },
  ],
  cardData: {
    totalAbnormalCount: 126,
    unHandleCount: 18,
    handleCount: 108,
    handleRatio: 85.71,
  },
};

const loading = ref(false);
const overviewData = ref({ ...mockOverviewData });

const barState = reactive({
  title: '每日异常订单数量及处理完成数量',
  xData: [],
  seriesData: [],
  yName: '数量',
});

const cardList = computed(() => {
  const total = overviewData.value.cardData?.totalAbnormalCount || 0;
  const unHandled = overviewData.value.cardData?.unHandleCount || 0;
  const handled = overviewData.value.cardData?.handleCount || 0;
  const rate = overviewData.value.cardData?.handleRatio || 0;
  return [
    { title: '总异常订单数', value: total, color: '#409EFF', status: 'total' },
    { title: '未处理数', value: unHandled, color: '#E6A23C', status: 'unhandled' },
    { title: '已处理数', value: handled, color: '#67C23A', status: 'handled' },
    { title: '处理完成率', value: `${rate}%`, color: '#F56C6C', status: 'rate' },
  ];
});

const updateBarToTrend = () => {
  const barData = overviewData.value.barData || [];
  if (barData.length === 0) return;
  barState.xData = barData.map((item) => item.date);
  barState.seriesData = [
    { name: '异常订单数量', data: barData.map((item) => item.abnormalCount) },
    { name: '处理完成数量', data: barData.map((item) => item.handleCount) },
  ];
  barState.title = '每日异常订单数量及处理完成数量';
};

const fetchOverviewData = async () => {
  loading.value = true;
  try {
    const data = await getAbnormalOrderChart({});
    overviewData.value = data;
    updateBarToTrend();
    console.log('使用接口数据');
  } catch (error) {
    console.warn('接口调用失败，使用模拟数据：', error.message);
    overviewData.value = { ...mockOverviewData };
    updateBarToTrend();
    ElMessage.info('当前使用模拟数据，展示总览信息');
  } finally {
    loading.value = false;
  }
};

const emit = defineEmits(['pieSelect', 'barSelect', 'cardSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handleBarClick = (date) => {
  emit('barSelect', date);
};

const handlePieClick = (pieItem) => {
  emit('pieSelect', pieItem.name);
};

onMounted(() => {
  fetchOverviewData();
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
    <div class="chart-wrapper" style="flex: 1 !important;">
      <Pie
        title-text="异常订单类型占比"
        :data="overviewData.pieData"
        @pie-click="handlePieClick"
      />
    </div>
    <div class="chart-wrapper" style="flex: 1 !important;">
      <Bar
        :title="barState.title"
        :x-data="barState.xData"
        :series-data="barState.seriesData"
        :y-name="barState.yName"
        @bar-click="handleBarClick"
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
    gap: 12px;
    min-width: 280px;
    max-width: 320px;
    margin-top: 10px !important;
    .left-card {
      height: 150px !important;
    }
  }
  .chart-wrapper {
    display: flex;
    flex-direction: column;
    min-width: 280px;
    position: relative;
  }
}
</style>
