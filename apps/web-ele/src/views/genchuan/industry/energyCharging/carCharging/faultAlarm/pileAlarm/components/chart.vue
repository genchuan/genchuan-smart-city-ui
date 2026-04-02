<script setup>
import { reactive, onMounted, ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';

import {
  getPileAlarmChart
} from '#/api/genchuan/industry/energyCharging/carCharging/faultAlarm/pileAlarm/data.js';

// ==================== 模拟数据（日期统一为 YYYY-MM-DD） ====================
const mockOverviewData = {
  totalCount: 156,
  handledCount: 114,
  handleRate: 0.731,
  barData: [
    {date: '2026-03-25', alarmCount: 23, handleCount: 15},
    {date: '2026-03-26', alarmCount: 18, handleCount: 12},
    {date: '2026-03-27', alarmCount: 25, handleCount: 18},
    {date: '2026-03-28', alarmCount: 20, handleCount: 14},
    {date: '2026-03-29', alarmCount: 22, handleCount: 16},
    {date: '2026-03-30', alarmCount: 19, handleCount: 13},
    {date: '2026-03-31', alarmCount: 29, handleCount: 21},
  ],
  pieData: [
    {name: '硬件故障', value: 82},
    {name: '软件故障', value: 48},
    {name: '网络故障', value: 26},
  ],
  cardData: {
    unDisCount: 10,
    disCount: 2,
    handlingCount: 0,
    closedCount: 114,
  },
};

// ==================== 状态管理 ====================
const loading = ref(false);
const overviewData = ref({...mockOverviewData});

const barState = reactive({
  title: '每日告警数量及处置完成数量',
  xData: [],
  seriesData: [],
  yName: '',
});

const cardList = computed(() => {
  const total = overviewData.value.totalCount;
  const closed = overviewData.value.cardData?.closedCount || 0;
  const unDis = overviewData.value.cardData?.unDisCount || 0;
  const dis = overviewData.value.cardData?.disCount || 0;
  const handling = overviewData.value.cardData?.handlingCount || 0;
  const unHandled = unDis + dis + handling;
  const handleRate = total > 0 ? ((closed / total) * 100).toFixed(1) + '%' : '0%';
  return [
    {title: '总告警数', value: total, color: '#409EFF', status: 'total'},
    {title: '未处置数', value: unHandled, color: '#E6A23C', status: 'unhandled'},
    {title: '已处置数', value: closed, color: '#67C23A', status: 'handled'},
    {title: '处置完成率', value: handleRate, color: '#F56C6C', status: 'rate'},
  ];
});

// ==================== 辅助函数 ====================
const updateBarToTrend = () => {
  const barData = overviewData.value.barData || [];
  if (barData.length === 0) return;
  barState.xData = barData.map((item) => item.date);
  barState.seriesData = [
    {name: '告警数量', data: barData.map((item) => item.alarmCount)},
    {name: '处置完成数量', data: barData.map((item) => item.handleCount)},
  ];
  barState.yName = '数量';
  barState.title = '每日告警数量及处置完成数量';
};

// ==================== 接口调用 ====================
const fetchOverviewData = async () => {
  loading.value = true;
  try {
    const data = await getPileAlarmChart({});
    overviewData.value = data;
    updateBarToTrend();
    console.log('使用接口数据');
  } catch (error) {
    console.warn('接口调用失败，使用模拟数据：', error.message);
    overviewData.value = {...mockOverviewData};
    updateBarToTrend();
    ElMessage.info('当前使用模拟数据，展示总览信息');
  } finally {
    loading.value = false;
  }
};

// ==================== 事件处理 ====================
const emit = defineEmits(['pieSelect', 'barSelect', 'cardSelect']);

// 卡片点击：不再钻取，改为发出筛选事件
const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

// 柱状图点击：筛选当日告警
const handleBarClick = (date) => {
  emit('barSelect', date);
};

// 饼图点击：筛选故障类型
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
        title-text="告警类型占比"
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
