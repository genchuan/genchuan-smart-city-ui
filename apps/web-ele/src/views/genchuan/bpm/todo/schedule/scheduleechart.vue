<!-- scheduleechart.vue -->
<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '今日排班数', value: 35, color: '#FF6B6B' },
    { title: '换班申请数', value: 8, color: '#4ECDC4' },
    { title: '待交接数', value: 12, color: '#13ce66' },
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
      title-text="岗位分布占比"
      :data="[
        { name: '监控岗', value: 25 },
        { name: '巡检岗', value: 20 },
        { name: '运维岗', value: 18 },
        { name: '客服岗', value: 15 },
        { name: '管理岗', value: 12 },
        { name: '其他', value: 10 },
      ]"
    />
    <Circle
      title-text="排班状态分布"
      :data="[
        { name: '正常', value: 120 },
        { name: '换班中', value: 8 },
        { name: '已换班', value: 15 },
        { name: '请假', value: 5 },
      ]"
      :colors="['#13ce66', '#4a90e2', '#E6A23C', '#F56C6C']"
    />
    <Columnar
      title="近7日排班趋势"
      :x-data="['周一', '周二', '周三', '周四', '周五', '周六', '周日']"
      :series-data="[
        { name: '计划排班数', data: [30, 32, 28, 35, 36, 25, 20] },
        { name: '实际到岗数', data: [28, 30, 26, 33, 34, 22, 18] },
      ]"
    />
  </div>
</template>
