,
<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '今日申请数', value: 15, color: '#13ce66' },
    { title: '已开具数', value: 14, color: '#4ECDC4' },
    { title: '待开具数', value: 8, color: '#FF6B6B' },
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
      title-text="发票类型占比"
      :data="[
        { name: '普通发票', value: 4 },
        { name: '增值税电子普通发票', value: 5 },
      ]"
    />
    <Circle
      width="340px"
      height="330px"
      title-text="申请状态占比"
      :data="[
        { name: '已开具', value: 4 },
        { name: '待开具', value: 3 },
        { name: '已作废', value: 1 },
        { name: '已红冲', value: 1 },
      ]"
      :colors="['#67C23A', '#E6A23C', '#F56C6C', '#909399']"
    />
    <Columnar
      height="330px"
      title="订单类型"
      :x-data="['临停', '期卡', '充值', '逃费追缴', '欠费追缴']"
      :series-data="[{ name: '', data: [58, 42, 20, 17, 16] }]"
    />
  </div>
</template>
