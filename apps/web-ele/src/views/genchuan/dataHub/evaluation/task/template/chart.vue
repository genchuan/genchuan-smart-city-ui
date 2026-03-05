<script setup>
import { defineProps } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const props = defineProps({
  cardList: {
    type: Array,
    default: () => [
      { title: '总模板数', value: 12, color: '#13ce66' },
      { title: '启用模板数', value: 8, color: '#4ECDC4' },
      { title: '停用模板数', value: 4, color: '#FF6B6B' },
      { title: '已使用模板数', value: 6, color: '#FFC107' },
    ]
  },
  pieData1: {
    type: Array,
    default: () => [
      { name: '网格', value: 4 },
      { name: '部门', value: 3 },
      { name: '社区', value: 3 },
      { name: '街道', value: 2 },
    ]
  },
  pieData2: {
    type: Array,
    default: () => [
      { name: '月度', value: 4 },
      { name: '季度', value: 3 },
      { name: '年度', value: 3 },
      { name: '专项', value: 2 },
    ]
  },
  barData: {
    type: Object,
    default: () => ({
      xData: ['任务模板1','任务模板2','任务模板3','任务模板4','任务模板5','任务模板6','任务模板7'],
      series: [{
        name: '使用次数',
        data: [25, 18, 32, 15, 28, 12, 20]
      }]
    })
  }
});
</script>

<template>
  <div class="park-chart-box park-template-chart">
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
      title-text="任务周期占比"
      :data="pieData2"
      :colors="['#67C23A', '#E6A23C', '#F56C6C', '#909399']"
    />
    <Columnar
      height="330px"
      title="各模板使用次数对比"
      :x-data="barData.xData"
      :series-data="barData.series"
    />
  </div>
</template>

<style lang="scss">
.park-template-chart {
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
  .template-columnar {
    min-width: 200px !important;
  }
}
</style>