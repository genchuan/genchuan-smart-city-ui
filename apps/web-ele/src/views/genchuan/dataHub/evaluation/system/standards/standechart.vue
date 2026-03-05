<script setup>
import { defineProps } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const props = defineProps({
  cardList: {
    type: Array,
    default: () => [
      { title: '总分类数', value: 12, color: '#13ce66' },
      { title: '启用分类数', value: 8, color: '#4ECDC4' },
      { title: '停用分类数', value: 4, color: '#FF6B6B' },
      { title: '标准项总数', value: 35, color: '#FFC107' },
    ]
  },
  pieData1: {
    type: Array,
    default: () => [
      { name: '网格管理评价体系V1.0', value: 4 },
      { name: '部门绩效评价体系V2.0', value: 3 },
      { name: '社区服务评价体系V1.5', value: 3 },
      { name: '街道治理评价体系V3.0', value: 2 },
    ]
  },
  pieData2: {
    type: Array,
    default: () => [
      { name: '优秀', value: 8 },
      { name: '良好', value: 12 },
      { name: '合格', value: 10 },
      { name: '不合格', value: 5 },
    ]
  },
  barData: {
    type: Object,
    default: () => ({
      xData: ['标准分类1','标准分类2','标准分类3','标准分类4','标准分类5','标准分类6','标准分类7'],
      series: [{
        data: [4, 2, 5, 3, 6, 2, 4]
      }]
    })
  }
});
</script>

<template>
  <div class="park-chart-box park-subject-chart">
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
      title-text="适用体系占比"
      :data="pieData1"
    />
    <Circle
      width="340px"
      height="330px"
      title-text="标准等级分布"
      :data="pieData2"
      :colors="['#67C23A', '#E6A23C', '#F56C6C', '#909399']"
    />
    <Columnar
      height="330px"
      title="各分类标准项数量对比"
      :x-data="barData.xData"
      :series-data="barData.series"
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
