<!-- entrychart.vue - 月收入数据图表版本 -->
<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import LineChart from '#/components/stats/line.vue'; // 引入折线图组件

const state = reactive({
  cardList: [
    { title: '本月总收入', value: '¥4,080,000', color: '#4ECDC4' },
    { title: '总订单数', value: '40,800', color: '#FF6B6B' },
    { title: '月均客单价', value: '¥100', color: '#FFD166' },
    { title: '总欠费金额', value: '¥40,800', color: '#06D6A0' },
  ],

  // 近6个月收入趋势数据
  lineChartData: {
    xData: ['2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12'],
    seriesData: [
      {
        name: '收入趋势',
        data: [850_000, 890_000, 920_000, 1_050_000, 1_180_000, 1_250_000],
        type: 'line',
        smooth: true,
      },
    ],
  },
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
      title-text="各区域收入占比"
      :data="[
        { name: '天河区', value: 30 },
        { name: '越秀区', value: 24 },
        { name: '海珠区', value: 27 },
        { name: '其他区域', value: 19 },
      ]"
    />
    <Circle
      title-text="订单类型收入占比"
      :data="[
        { name: '临时停车', value: 65 },
        { name: '月卡停车', value: 20 },
        { name: '业主停车', value: 10 },
        { name: '预约停车', value: 5 },
      ]"
    />
    <LineChart
      title="近6个月收入趋势"
      :x-data="state.lineChartData.xData"
      :series-data="state.lineChartData.seriesData"
      height="300px"
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
