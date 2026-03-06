,
<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '停放时长', value: 15, color: '#13ce66' },
    { title: '车位位置', value: 14, color: '#4ECDC4' },
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

    <Columnar
      height="330px"
      title="车位分布"
      :x-data="['1F', '2F', '3F', 'B1', 'B2']"
      :series-data="[{ name: '', data: [58, 42, 12, 35, 56] }]"
    />
  </div>
</template>
