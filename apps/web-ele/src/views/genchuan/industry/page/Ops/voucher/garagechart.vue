<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '券包总数', value: 15, color: '#13ce66' },
    { title: '上架券包数', value: 14, color: '#4ECDC4' },
    { title: '已售总数', value: 8, color: '#FF6B6B' },
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
      title-text="优惠券类型占比"
      :data="[
        { name: '满减券', value: 4 },
        { name: '免费时长券', value: 5 },
        { name: '折扣券', value: 5 },
        { name: '充值券', value: 5 },
      ]"
    />
    <Circle
      width="340px"
      height="330px"
      title-text="适用范围占比"
      :data="[
        { name: '商业停车场', value: 4 },
        { name: '充电停车场', value: 5 },
      ]"
    />
    <Columnar
      height="330px"
      title="各券包销量排名"
      :x-data="['满减券', '免费时长券', '折扣券', '充值券', '充值券']"
      :series-data="[{ name: '', data: [58, 42, 33, 33, 33] }]"
    />
  </div>
</template>
