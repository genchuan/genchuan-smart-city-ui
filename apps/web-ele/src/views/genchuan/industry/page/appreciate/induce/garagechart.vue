<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '周边车场总数', value: 15, color: '#13ce66' },
    { title: '可预约车场数', value: 14, color: '#4ECDC4' },
    { title: '空闲车位总数', value: 8, color: '#FF6B6B' },
  ],
});
</script>

<template>
  <div class="park-chart-box">
    <div class="chart-box-left">
      <Card
        class="left-card"
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
      />
    </div>
    <div class="chart-box-right">
      <Circle
        width="340px"
        height="330px"
        class="chart-box-circle"
        title-text="门禁类型占比"
        :data="[
          { name: '空闲车位总数', value: 4 },
          { name: '周边车场总数', value: 5 },
          { name: '可预约车场数', value: 2 },
        ]"
      />
      <Circle
        width="340px"
        height="330px"
        class="chart-box-circle"
        title-text="车库状态占比"
        :data="[
          { name: '启用', value: 4 },
          { name: '禁用', value: 5 },
        ]"
        :colors="['#67C23A', '#E6A23C', '#F56C6C', '#909399']"
      />
      <Columnar
        class="chart-box-Columnar"
        height="330px"
        title="不同车场车库数量对比"
        :x-data="['空闲车位总数', '周边车场总数', '可预约车场数']"
        :series-data="[{ name: '', data: [58, 42, 33] }]"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.park-chart-box {
  display: flex;
  min-height: 360px;

  .chart-box-left {
    display: flex;
    flex: 0 0 max(280px, min(25vw, 320px));
    flex-direction: column;
    gap: 12px;
    min-width: 280px;
    max-width: 320px;
    margin-left: 30px;
  }

  .chart-box-right {
    display: flex;
    flex-wrap: wrap;

    .chart-box-circle {
      display: flex;
      justify-content: center;
      width: 300px;
      margin-left: 5px;
    }

    .chart-box-Columnar {
      min-width: 560px;
      margin-left: 15px;
    }
  }
}
</style>
