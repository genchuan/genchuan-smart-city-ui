<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '卡种总数', value: 15, color: '#13ce66' },
    { title: '启用卡种数', value: 14, color: '#4ECDC4' },
    { title: '在售卡种数', value: 8, color: '#FF6B6B' },
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
      width="340px"
      height="330px"
      title-text="卡种类型占比"
      :data="[
        { name: '周卡', value: 4 },
        { name: '月卡', value: 5 },
        { name: '日卡', value: 5 },
        { name: '畅停卡', value: 5 },
        { name: '年卡', value: 5 },
      ]"
    />
    <Circle
      width="340px"
      height="330px"
      title-text="适用车场分布占比"
      :data="[
        { name: '商业停车场', value: 4 },
        { name: '充电停车场', value: 5 },
      ]"
    />
    <Columnar
      height="330px"
      title="各卡种销量排名"
      :x-data="['日卡', '月卡', '周卡', '年卡', '畅停卡']"
      :series-data="[{ name: '', data: [58, 42, 33, 33, 33] }]"
    />
  </div>
</template>
