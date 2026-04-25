<script setup>
import { computed, onMounted, reactive } from 'vue';

import { getInspectTaskChart } from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/inspectTask';
import Columnar from '#/components/stats/columnar.vue';
import IndicatorClick from '#/genchuan-components/stats/indicatorClick.vue';
import LineChartClick from '#/genchuan-components/stats/lineChartClick.vue';

import { getMockChartData, getPlanTypeLabel } from './data';

const emit = defineEmits(['statusFilter', 'trendFilter']);

const state = reactive({
  cardList: [
    {
      title: '待处理任务数',
      value: 0,
      desc: '待派发/待认领/处理中',
      status: '处理中',
      color: '#f59e0b',
    },
    {
      title: '已完成任务数',
      value: 0,
      desc: '已完成',
      status: '已完成',
      color: '#27ae60',
    },
  ],
  typeData: [],
  trendData: [],
});

const trendXData = computed(() => state.trendData.map((item) => item.time));
const trendSeriesData = computed(() => [
  {
    name: '平均处理时效',
    data: state.trendData.map((item) => item.avgHandleTime),
    color: '#2f80ed',
  },
]);

function normalizeChartData(data) {
  const chartData =
    data?.typeData || data?.trendData || data?.cardData
      ? data
      : getMockChartData();
  const cardData = chartData.cardData || {};

  state.cardList[0].value = cardData.waitTaskCount ?? 0;
  state.cardList[1].value = cardData.finishTaskCount ?? 0;
  state.typeData = Array.isArray(chartData.typeData) ? chartData.typeData : [];
  state.trendData = Array.isArray(chartData.trendData)
    ? chartData.trendData
    : [];
}

async function fetchChartData() {
  try {
    const response = await getInspectTaskChart();
    normalizeChartData(response?.data || response);
  } catch (error) {
    console.error('获取巡检任务统计失败，使用静态数据:', error);
    normalizeChartData(getMockChartData());
  }
}

function handleCardClick(card) {
  emit('statusFilter', card.status);
}

function handleTrendClick(payload) {
  if (payload?.categoryName) {
    emit('trendFilter', payload.categoryName);
  }
}

onMounted(() => {
  fetchChartData();
});
</script>

<template>
  <div class="park-chart-box">
    <div class="chart-box-left">
      <IndicatorClick
        v-for="card in state.cardList"
        :key="card.title"
        :color="card.color"
        :desc="card.desc"
        :status="card.status"
        :title="card.title"
        :value="card.value"
        @click="handleCardClick"
      />
    </div>

    <LineChartClick
      class="simple-bar-chart"
      title="任务处理时效"
      :series-data="trendSeriesData"
      :x-data="trendXData"
      y-name="分钟"
      @line-click="handleTrendClick"
    />
    <Columnar
      class="park-type-chart"
      title="任务类型分布"
      :x-data="state.typeData.map((item) => getPlanTypeLabel(item.typeName))"
      :series-data="[
        { name: '任务数', data: state.typeData.map((item) => item.count) },
      ]"
    />
  </div>
</template>
