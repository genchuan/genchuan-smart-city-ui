,<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '周边车场总数', value: 15, color: '#13ce66' },
    { title: '可预约车场数', value: 14, color: '#4ECDC4' },
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
    <Circle
      width="340px"
      height="330px"
      title-text="预约数"
      :data="[
        { name: '今日预约数', value: 4 },
        { name: '已确认预约数', value: 5 },
        { name: '待使用预约数', value: 2 },
      ]"
    />
    <Circle
      width="340px"
      height="330px"
      title-text="预约状态"
      :data="[
        { name: '待核验', value: 2 },
        { name: '已确认', value: 2 },
        { name: '已使用', value: 2 },
        { name: '已取消', value: 2 },
        { name: '已过期', value: 2 },
      ]"
      :colors="['#67C23A', '#E6A23C', '#F56C6C', '#909399']"
    />
    <Columnar
      height="330px"
      title="车位类型"
      :x-data="['充电车位', '普通车位']"
      :series-data="[{ name: '', data: [58, 42] }]"
    />
  </div>
</template>
