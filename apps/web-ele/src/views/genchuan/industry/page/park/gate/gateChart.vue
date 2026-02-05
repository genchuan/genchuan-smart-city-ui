<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '总车位数', value: 15, color: '#13ce66' },
    { title: '可用车位数', value: 14, color: '#4ECDC4' },
    { title: '可预约车位数', value: 8, color: '#FF6B6B' },
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
      title-text="车位类型占比"
      :data="[
        { name: '道闸', value: 4 },
        { name: '车牌识别', value: 5 },
        { name: '道闸+刷卡', value: 2 },
        { name: '车牌识别+人脸识别', value: 5 },
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
      :colors="['#67C23A', '#E6A23C', '#F56C6C', '#909399']"
    />
    <Columnar
      height="330px"
      title="不同车场/车库车位数量对比"
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
