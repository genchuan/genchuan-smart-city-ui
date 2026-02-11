<!-- entrychart.vue -->
<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '平均闭环率', value: '94.8%', color: '#06D6A0' },
    { title: '平均处置时长', value: '4.3小时', color: '#4ECDC4' },
    { title: '总工单数', value: '420', color: '#FF6B6B' },
    { title: '平均响应时长', value: '28分钟', color: '#FFD166' },
  ],
});
</script>

<template>
  <div class="park-chart-box park-district-chart">
    <div class="chart-box-left">
      <Card
        class="left-card"
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
      />
    </div>
    <Circle
      title-text="工单类型占比"
      :data="[
          { name: '设备维修', value: 35 },
          { name: '设备巡检', value: 25 },
          { name: '故障处理', value: 20 },
          { name: '设备保养', value: 12 },
          { name: '设备安装', value: 8 },
        ]"
    />
    <Circle
      title-text="工单状态占比"
      :data="[
          { name: '已完成', value: 88 },
          { name: '进行中', value: 5 },
          { name: '待处理', value: 4 },
          { name: '已超时', value: 3 },
        ]"
    />
    <Columnar
      title="各运维人员效率对比"
      :x-data="['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九']"
      :series-data="[
          { name: '闭环率', data: [93.8, 96.9, 96.4, 91.4, 100, 92.3, 94.7] },
        ]"
    />
  </div>
</template>
<style lang="scss">
.park-district-chart {
  .chart-box-left {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr); /* 每行2列，每列宽度均分 */
    gap: 16px; /* 卡片之间的间距（水平+垂直），可自定义 */
    max-width: 100%; /* 防止溢出 */
    height: 100%;
    .left-card {
      height: 159px !important;
    }
  }
  .district-columnar {
    min-width: 200px !important;
  }
}
</style>
