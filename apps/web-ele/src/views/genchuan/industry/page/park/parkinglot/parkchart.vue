<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '总停车场数', value: 10, color: '#13ce66' },
    { title: '正常运营车场数', value: 8, color: '#4ECDC4' },
    { title: '可用车场数', value: 8, color: '#FF6B6B' },
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
        title-text="2026年漳州车场类型占比"
        :data="[
          { name: '商业停车场', value: 65 },
          { name: '公共停车场', value: 48 },
          { name: '小区停车场', value: 40 },
          { name: '文旅停车场', value: 20 },
        ]"
      />
      <Circle
        width="340px"
        height="330px"
        class="chart-box-circle"
        title-text="运营状态占比"
        :data="[
          { name: '运营中', value: 158 },
          { name: '维护中', value: 12 },
          { name: '暂停运营', value: 5 },
          { name: '待启用', value: 5 },
        ]"
        :colors="['#67C23A', '#E6A23C', '#F56C6C', '#909399']"
      />
      <Columnar
        class="chart-box-Columnar"
        height="330px"
        title="车场类型占比"
        :x-data="['商业', '公共', '小区', '文旅']"
        :series-data="[{ name: '数量', data: [58, 42, 35, 15] }]"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.park-chart-box {
  min-height: 360px;
  display: flex;
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
      margin-left: 5px;
      width: 300px;
      display: flex;
      justify-content: center;
    }
    .chart-box-Columnar {
      margin-left: 15px;
      min-width: 560px;
    }
  }
}
</style>
