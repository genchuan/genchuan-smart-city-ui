<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '已配置巡检员数', value: 15, color: '#13ce66' },
    { title: '各片区巡检员数', value: 14, color: '#4ECDC4' },
    { title: '未关联泊位点巡检员数', value: 8, color: '#FF6B6B' },
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
    <Columnar
      height="330px"
      title="不同片区巡检员配置数量对比"
      :x-data="[
        '龙文区碧湖公园停车场',
        '龙海区石码镇便民停车场',
        '龙海区闽齐社区停车场',
        '龙海区闽齐社区停车场',
        '长泰区武安镇公共停车场',
        '漳浦县绥安镇便民停车场',
      ]"
      :series-data="[{ name: '', data: [58, 42, 35, 15, 13, 33] }]"
    />
  </div>
</template>
