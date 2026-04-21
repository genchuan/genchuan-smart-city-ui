<!-- workechart.vue -->
<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '工单总数', value: 8, color: '#FF6B6B' },
    { title: '待处理工单数', value: 2, color: '#F56C6C' },
    { title: '处理中工单数', value: 2, color: '#4ECDC4' },
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
      title-text="工单类型分布"
      :data="[
          { name: '设备故障', value: 1 },
          { name: '网络问题', value: 1 },
          { name: '软件问题', value: 1 },
          { name: '硬件维修', value: 1 },
          { name: '安全漏洞', value: 1 },
          { name: '日常维护', value: 1 },
          { name: '巡检任务', value: 1 },
          { name: '日常运维', value: 1 },
        ]"
    />
    <Circle
      title-text="紧急程度分布"
      :data="[
          { name: '紧急', value: 2 },
          { name: '高', value: 2 },
          { name: '中', value: 3 },
          { name: '低', value: 1 },
        ]"
      :colors="['#FF0000', '#F56C6C', '#E6A23C', '#13ce66']"
    />
    <Columnar
      title="近7日工单趋势"
      :x-data="['周一', '周二', '周三', '周四', '周五', '周六', '周日']"
      :series-data="[
          { name: '新增工单', data: [2, 1, 1, 0, 3, 0, 1] },
          { name: '完成工单', data: [0, 0, 1, 0, 2, 1, 1] },
        ]"
    />
  </div>
</template>
