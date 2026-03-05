<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '会员等级总数', value: 15, color: '#13ce66' },
    { title: '启用等级数', value: 14, color: '#4ECDC4' },
    { title: '用户等级分布占比', value: 8, color: '#FF6B6B' },
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
      title-text="设备状态占比"
      :data="[
        { name: '正常', value: 4 },
        { name: '故障', value: 5 },
        { name: '离线', value: 5 },
      ]"
    />

    <Columnar
      height="330px"
      title="不同运营范围充电站数量对比"
      :x-data="['商业停车场', '小区停车场', '学校停车场']"
      :series-data="[{ name: '', data: [58, 42, 33, ] }]"
    />
  </div>
</template>
