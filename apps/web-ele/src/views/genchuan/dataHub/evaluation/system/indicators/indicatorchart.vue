<script setup>
import { reactive, onMounted } from 'vue';
import { getOverview } from '#/api/genchuan/dataHub/evaluation/system/indicators';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [],
  typePieData: [],      // 适用对象类型占比
  indexPieData: [],     // 指标类型占比
  barXData: [],
  barSeriesData: [],
});

const fetchOverview = async () => {
  try {
    const data = await getOverview();
    state.cardList = data.cardList || [];
    state.typePieData = data.pieData1 || [];
    state.indexPieData = data.pieData2 || [];
    state.barXData = data.barData?.xData || [];
    state.barSeriesData = data.barData?.series || [];
  } catch (error) {
    console.error('获取概览数据失败', error);
    state.cardList = [];
    state.typePieData = [];
    state.indexPieData = [];
    state.barXData = [];
    state.barSeriesData = [];
  }
};

onMounted(() => {
  fetchOverview();
});

defineExpose({ fetchOverview });
</script>

<template>
  <div class="park-chart-box park-subject-chart">
    <div class="chart-box-left">
      <Card
        class="left-card"
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
      />
    </div>
    <Circle
      width="340px"
      height="330px"
      title-text="适用对象类型占比"
      :data="state.typePieData"
    />
    <Circle
      width="340px"
      height="330px"
      title-text="指标类型占比"
      :data="state.indexPieData"
      :colors="['#67C23A', '#E6A23C', '#F56C6C', '#909399']"
    />
    <Columnar
      height="330px"
      title="各体系指标项数量对比"
      :x-data="state.barXData"
      :series-data="state.barSeriesData"
    />
  </div>
</template>

<style lang="scss">
.park-subject-chart {
  .chart-box-left {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    max-width: 100%;
    height: 100%;
    .left-card {
      height: 159px !important;
    }
  }
  .subject-columnar {
    min-width: 200px !important;
  }
}
</style>
