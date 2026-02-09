<!-- entrychart.vue -->
<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';
import RadarChart from '#/components/stats/radar.vue';

const state = reactive({
  cardList: [
    { title: '平均绩效分', value: '91.5', color: '#4ECDC4' },
    { title: '优秀人员占比', value: '25%', color: '#06D6A0' },
    { title: '待改进人员数', value: '2', color: '#FF6B6B' },
    { title: '最高绩效分', value: '97.3', color: '#FFD166' },
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
      title-text="绩效等级分布"
      :data="[
          { name: '优秀(≥95)', value: 25 },
          { name: '良好(90-94)', value: 45 },
          { name: '合格(85-89)', value: 20 },
          { name: '待改进(<85)', value: 10 },
        ]"
    />
    <Columnar
      title="运维人员绩效得分对比"
      :x-data="['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九']"
      :series-data="[
          { name: '绩效得分', data: [92.5, 95.2, 88.7, 85.4, 97.3, 89.2, 93.5] },
        ]"
    />
    <RadarChart
      title="运维人员能力雷达图"
      :indicator-names="['响应速度', '维修质量', '工作效率', '服务态度', '巡检完成率', '故障修复率']"
      :series-data="[
    {
      name: '张三',
      data: [92, 90, 88, 95, 94, 93],
      color: '#4a90e2'
    },
    {
      name: '李四',
      data: [95, 82, 90, 96, 86, 80],
      color: '#FF6B6B'
    }
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
