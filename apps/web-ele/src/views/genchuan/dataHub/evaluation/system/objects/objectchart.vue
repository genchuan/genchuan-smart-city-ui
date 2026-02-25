<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '总对象数', value: 15, color: '#13ce66' },
    { title: '网格对象数', value: 8, color: '#4ECDC4' },
    { title: '部门对象数', value: 5, color: '#FF6B6B' },
    { title: '社区对象数', value: 2, color: '#FFC107' },
  ],
});
</script>

<template>
  <div class="park-chart-box park-district-chart">
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
      title-text="对象类型占比"
      :data="[
        { name: '网格', value: 8 },
        { name: '部门', value: 5 },
        { name: '社区', value: 2 },
      ]"
    />
    <Circle
      width="340px"
      height="330px"
      title-text="状态占比"
      :data="[
        { name: '启用', value: 9 },
        { name: '停用', value: 4 },
        { name: '其他', value: 2 },
      ]"
      :colors="['#67C23A', '#E6A23C', '#F56C6C']"
    />
    <Columnar
      height="330px"
      title="不同区域对象数量对比"
      :x-data="['芗城区', '龙文区', '龙海区', '长泰区', '漳浦县']"
      :series-data="[{ name: '对象数量', data: [5, 4, 3, 2, 1] }]"
    />
  </div>
</template>

<style lang="scss">
.park-district-chart {
  .chart-box-left {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr); /* 每行2列，每列宽度均分 */
    gap: 16px; /* 卡片之间的间距（水平+垂直），可自定义 */
    max-width: 100%; /* 防止溢出 */
    height: 100%;
    .left-card {
      height: 159px !important;
    }
  }
  .district-columnar {
    min-width: 200px !important;
  }
}
</style>
