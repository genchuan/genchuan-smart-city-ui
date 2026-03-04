<script setup>
import { defineProps } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const props = defineProps({
  cardList: {
    type: Array,
    default: () => [
      { title: '总体系数', value: 30, color: '#13ce66' },
      { title: '启用体系数', value: 10, color: '#4ECDC4' },
      { title: '各版本体系数', value: 10, color: '#FF6B6B' },
      { title: '指标项总数', value: 10, color: '#FFC107' },
    ]
  },
  pieData1: {
    type: Array,
    default: () => [
      { name: '网格', value: 10 },
      { name: '部门', value: 4 },
      { name: '社区', value: 6 },
    ]
  },
  pieData2: {
    type: Array,
    default: () => [
      { name: '数量', value: 1 },
      { name: '比率', value: 5 },
      { name: '时长', value: 7 },
    ]
  },
  barData: {
    type: Object,
    default: () => ({
      xData: ['指标体系1','指标体系2','指标体系3','指标体系4','指标体系5','指标体系6','指标体系7'],
      series: [{
        // name: '指标项数量',
        data: [12,1,2,5,7,8,9,]
      }]
    })
  }
});
</script>

<template>
  <div class="park-chart-box park-district-chart">
    <div class="chart-box-left">
      <Card
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
      />
    </div>
    <Circle
      width="340px"
      height="330px"
      title-text="适用对象类型占比"
      :data="pieData1"
    />
    <Circle
      width="340px"
      height="330px"
      title-text="指标类型占比"
      :data="pieData2"
      :colors="['#67C23A', '#E6A23C', '#F56C6C', '#909399']"
    />
    <Columnar
      height="330px"
      title="各体系指标项数量对比"
      :x-data="barData.xData"
      :series-data="barData.series"
    />
  </div>
</template>

<style lang="scss">
.park-district-chart {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
  .chart-box-left {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    max-width: 100%;
    height: 330px;
    .left-card {
      height: 159px !important;
    }
  }
}
</style>
