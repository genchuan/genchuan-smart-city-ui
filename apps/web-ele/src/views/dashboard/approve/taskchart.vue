<!-- taskchart.vue -->
<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '待处理任务数', value: 15, color: '#FF6B6B' },
    { title: '处理中任务数', value: 23, color: '#4ECDC4' },
    { title: '已完成任务数', value: 42, color: '#13ce66' },
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
        title-text="任务类型占比"
        :data="[
          { name: '日常运维', value: 35 },
          { name: '故障处理', value: 28 },
          { name: '项目任务', value: 22 },
          { name: '巡检任务', value: 15 },
          { name: '其他', value: 10 },
        ]"
      />
      <Circle
        title-text="任务优先级分布"
        :data="[
          { name: '高', value: 15 },
          { name: '中', value: 45 },
          { name: '低', value: 30 },
          { name: '紧急', value: 10 },
        ]"
        :colors="['#E6A23C', '#4a90e2', '#13ce66', '#F56C6C']"
      />
      <Columnar
        title="近7日任务趋势"
        :x-data="['周一', '周二', '周三', '周四', '周五', '周六', '周日']"
        :series-data="[
          { name: '新增任务', data: [12, 15, 8, 10, 18, 5, 7] },
          { name: '完成任务', data: [10, 12, 7, 9, 14, 4, 6] },
        ]"
      />
  </div>
</template>



