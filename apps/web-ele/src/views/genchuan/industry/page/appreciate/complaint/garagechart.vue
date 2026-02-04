<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '今日投诉数', value: 15, color: '#13ce66' },
    { title: '未处理投诉数', value: 14, color: '#4ECDC4' },
    { title: '已处理投诉数', value: 8, color: '#FF6B6B' },
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
      title-text="投诉类型占比"
      :data="[
        { name: '服务投诉', value: 4 },
        { name: '设备故障', value: 5 },
        { name: '收费争议', value: 5 },
        { name: '其他', value: 5 },
      ]"
      :colors="['#67C23A', '#E6A23C', '#F56C6C', '#909399']"
    />
    <Columnar
      height="330px"
      title="近7天投诉提交趋势"
      :x-data="[
        '七天前',
        '六天前',
        '五天前',
        '四天前',
        '三天前',
        '两天前',
        '一天前',
      ]"
      :series-data="[{ name: '', data: [58, 42, 33, 45, 32, 36, 52] }]"
    />
  </div>
</template>
