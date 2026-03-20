<!-- inspectionechart.vue -->
<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '待开始计划数', value: 12, color: '#FF6B6B' },
    { title: '执行中计划数', value: 18, color: '#4ECDC4' },
    { title: '已归档计划数', value: 65, color: '#13ce66' },
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
      title-text="巡检类型占比"
      :data="[
        { name: '日常巡检', value: 42 },
        { name: '专项巡检', value: 25 },
        { name: '定期巡检', value: 18 },
        { name: '临时巡检', value: 10 },
        { name: '其他', value: 5 },
      ]"
    />
    <Circle
      title-text="计划状态分布"
      :data="[
        { name: '未开始', value: 12 },
        { name: '执行中', value: 18 },
        { name: '已完成', value: 55 },
        { name: '已取消', value: 10 },
      ]"
      :colors="['#909399', '#4a90e2', '#13ce66', '#E6A23C']"
    />
    <Columnar
      title="近7日巡检执行趋势"
      :x-data="['周一', '周二', '周三', '周四', '周五', '周六', '周日']"
      :series-data="[
        { name: '计划巡检数', data: [15, 18, 12, 20, 22, 10, 8] },
        { name: '实际执行数', data: [14, 16, 10, 18, 20, 8, 6] },
      ]"
    />
  </div>
</template>
