<!-- trendchart.vue - 运营趋势报表图表组件 -->
<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '近期总收费金额', value: '¥805,600', color: '#4ECDC4' },
    { title: '近期总入场车次', value: '35,800', color: '#13ce66' },
    { title: '平均泊位利用率', value: '77.8%', color: '#E6A23C' },
  ],
});
</script>

<template>
  <div class="park-chart-box ">
    <div class="chart-box-left">
      <Card
        class="left-card"
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
      />
    </div>
      <Circle
        title-text="不同周期数据占比"
        :data="[
          { name: '日统计数据', value: 45 },
          { name: '周统计数据', value: 30 },
          { name: '月统计数据', value: 25 },
        ]"
      />
      <Columnar
        title="各区域总收费金额趋势"
        :x-data="['1月', '2月', '3月', '4月', '5月', '6月', '7月']"
        :series-data="[
          { name: '天河区(万元)', data: [28.75, 32.15, 29.80, 31.20, 33.50, 30.75, 35.20] },
          { name: '海珠区(万元)', data: [25.30, 27.80, 26.50, 28.40, 29.10, 27.30, 30.50] },
          { name: '越秀区(万元)', data: [15.68, 17.20, 16.50, 18.10, 19.30, 17.80, 20.10] },
        ]"
      />
    </div>
</template>


