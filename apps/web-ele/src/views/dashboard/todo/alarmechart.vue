<!-- alarmechart.vue -->
<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '待处置预警数', value: 28, color: '#FF6B6B' },
    { title: '处置中预警数', value: 15, color: '#4ECDC4' },
    { title: '已归档预警数', value: 42, color: '#13ce66' },
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
      title-text="预警类型占比"
      :data="[
          { name: '设备故障', value: 35 },
          { name: '网络异常', value: 25 },
          { name: '环境告警', value: 18 },
          { name: '安全事件', value: 12 },
          { name: '其他', value: 10 },
        ]"
    />
    <Circle
      title-text="预警等级分布"
      :data="[
          { name: '严重', value: 8 },
          { name: '高', value: 15 },
          { name: '中', value: 32 },
          { name: '低', value: 25 },
        ]"
      :colors="['#F56C6C', '#E6A23C', '#4a90e2', '#13ce66']"
    />
    <Columnar
      title="近7日预警趋势"
      :x-data="['周一', '周二', '周三', '周四', '周五', '周六', '周日']"
      :series-data="[
          { name: '新增预警', data: [15, 12, 18, 10, 22, 8, 5] },
          { name: '处理预警', data: [10, 8, 15, 9, 18, 6, 4] },
        ]"
    />
  </div>
</template>
