<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '总规则数', value: 15, color: '#13ce66' },
    { title: '启用规则数', value: 14, color: '#4ECDC4' },
    { title: '常用规则数', value: 8, color: '#FF6B6B' },
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
      title-text="触发类型占比"
      :data="[
        { name: '白天', value: 4 },
        { name: '夜晚', value: 5 },
      ]"
    />
    <Circle
      width="340px"
      height="330px"
      title-text="启用状态占比"
      :data="[
        { name: '启用', value: 4 },
        { name: '禁用', value: 5 },
      ]"
    />
    <Columnar
      height="330px"
      title="规则使用次数排名"
      :x-data="['商业车位', '车站车位', '超市车位']"
      :series-data="[{ name: '', data: [58, 42, 33] }]"
    />
  </div>
</template>
