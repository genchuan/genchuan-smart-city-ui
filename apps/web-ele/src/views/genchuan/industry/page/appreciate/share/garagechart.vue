<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '总共享车位数', value: 15, color: '#13ce66' },
    { title: '启用共享车位数', value: 14, color: '#4ECDC4' },
    { title: '共享订单总数', value: 8, color: '#FF6B6B' },
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
      title-text="共享时段占比"
      :data="[
        { name: '白天', value: 4 },
        { name: '夜晚', value: 5 },
      ]"
    />
    <Circle
      width="340px"
      height="330px"
      title-text="所属车场占比"
      :data="[
        { name: '商业停车场', value: 4 },
        { name: '车站停车场', value: 5 },
                { name: '超市停车场', value: 5 },
      ]"
    />
    <Columnar
      height="330px"
      title="各共享车位订单数排名"
      :x-data="['商业车位', '车站车位', '超市车位']"
      :series-data="[{ name: '', data: [58, 42, 33] }]"
    />
  </div>
</template>
