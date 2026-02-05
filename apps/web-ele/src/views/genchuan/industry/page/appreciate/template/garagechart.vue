<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '总模板数', value: 15, color: '#13ce66' },
    { title: '启用模板数', value: 14, color: '#4ECDC4' },
    { title: '常用模板数', value: 8, color: '#FF6B6B' },
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
      title-text="类型占比"
      :data="[
        { name: '模板类型占比', value: 4 },
        { name: '启用状态占比', value: 5 },
      ]"
    />

    <Columnar
      height="330px"
      title="模板使用次数排名"
      :x-data="['模版1', '模版2', '模版3']"
      :series-data="[{ name: '', data: [58, 42, 33] }]"
    />
  </div>
</template>
