<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '总片区数', value: 10, color: '#13ce66' },
    { title: '正常运营片区数', value: 8, color: '#4ECDC4' },
    { title: '关联车场总数', value: 16, color: '#FF6B6B' },
    { title: '关联道路总数', value: 28, color: '#FF6B6B' },
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
    <Circle
      class="park-type-chart-new"
      title-text="片区状态占比"
      :data="[
        { name: '开启', value: 65 },
        { name: '禁用', value: 18 },
      ]"
    />
    <Columnar
      class="park-type-chart-new"
      title="不同区域片区数量对比"
      :x-data="['芗城区', '龙海区', '龙文区', '台商投资区', '高新区', '东山县']"
      :series-data="[{ name: '数量', data: [58, 42, 35, 15, 33, 21] }]"
    />
    <Columnar
      class="park-type-chart-new"
      title="各片区关联车场数对比"
      :x-data="['芗城区', '龙海区', '龙文区', '台商投资区', '高新区', '东山县']"
      :series-data="[{ name: '数量', data: [31, 21, 35, 56, 22, 5] }]"
    />
  </div>
</template>
<style scoped>
.park-type-chart-new {
  min-width: 280px !important;
  height: 440px !important;
}
</style>
