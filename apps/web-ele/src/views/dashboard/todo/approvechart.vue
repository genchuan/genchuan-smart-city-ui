<!-- approvechart.vue -->
<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '待审批总数', value: 50, color: '#FF6B6B' },
    { title: '高紧急度待审批数', value: 12, color: '#F56C6C' },
    { title: '各业务类型待审批数', value: 8, color: '#4ECDC4' },
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
      title-text="待审批业务类型占比"
      :data="[
        { name: '采购审批', value: 35 },
        { name: '费用报销', value: 28 },
        { name: '请假申请', value: 22 },
        { name: '项目立项', value: 15 },
        { name: '其他', value: 10 },
      ]"
    />
    <Circle
      title-text="紧急程度分布占比"
      :data="[
        { name: '高', value: 15 },
        { name: '中', value: 45 },
        { name: '低', value: 30 },
        { name: '紧急', value: 10 },
      ]"
      :colors="['#F56C6C', '#E6A23C', '#13ce66', '#FF0000']"
    />
    <Columnar
      title="近7日审批事项趋势"
      :x-data="['周一', '周二', '周三', '周四', '周五', '周六', '周日']"
      :series-data="[
        { name: '新增待审批', data: [12, 15, 8, 10, 18, 5, 7] },
        { name: '审批完成', data: [10, 12, 7, 9, 14, 4, 6] },
      ]"
    />
  </div>
</template>
