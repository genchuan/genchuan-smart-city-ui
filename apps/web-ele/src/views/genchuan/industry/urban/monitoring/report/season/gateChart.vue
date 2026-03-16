<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';
import LineChart from '#/components/stats/lineChart.vue';

const state = reactive({
  cardList: [
    { title: '窨井盖总数', value: 15000, color: '#13ce66' },
    { title: '季累计隐患数', value: 1500, color: '#FF6B6B' },
    { title: '季处置完成数', value: 1350, color: '#4ECDC4' },
    { title: '设备季在线率', value: '97.5%', color: '#67C23A' },
    { title: '季隐患处置完成率', value: '90%', color: '#E6A23C' },
    { title: '季重大隐患处置率', value: '92%', color: '#F56C6C' },
    { title: '季平均处置时长', value: '8.5小时', color: '#909399' },
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
      width="340px"
      height="330px"
      title-text="季隐患等级分布占比"
      :data="[
        { name: '重大隐患', value: 15 },
        { name: '较大隐患', value: 25 },
        { name: '一般隐患', value: 60 },
      ]"
    />
    <Circle
      width="340px"
      height="330px"
      title-text="隐患类型分布占比"
      :data="[
        { name: '井盖缺失', value: 30 },
        { name: '井盖破损', value: 25 },
        { name: '井盖移位', value: 20 },
        { name: '井盖异响', value: 15 },
        { name: '其他异常', value: 10 },
      ]"
      :colors="['#F56C6C', '#E6A23C', '#67C23A', '#909399', '#4ECDC4']"
    />
    <Circle
      width="340px"
      height="330px"
      title-text="区域风险等级分布占比"
      :data="[
        { name: '高风险', value: 20 },
        { name: '中风险', value: 50 },
        { name: '低风险', value: 30 },
      ]"
      :colors="['#F56C6C', '#E6A23C', '#67C23A']"
    />
    <Columnar
      height="330px"
      title="各区域季累计隐患数对比"
      :x-data="['鼓楼区', '思明区', '丰泽区', '芗城区', '城厢区', '蕉城区']"
      :series-data="[{ name: '隐患数', data: [180, 90, 270, 45, 225, 75] }]"
    />
    <Columnar
      height="330px"
      title="各区域重大隐患数对比"
      :x-data="['鼓楼区', '思明区', '丰泽区', '芗城区', '城厢区', '蕉城区']"
      :series-data="[{ name: '重大隐患数', data: [25, 5, 45, 2, 35, 8] }]"
    />
    <Columnar
      height="330px"
      title="近4个季度新增隐患数对比"
      :x-data="['2023-Q3', '2023-Q4', '2024-Q1', '2024-Q2']"
      :series-data="[{ name: '新增隐患数', data: [1200, 1350, 1400, 1500] }]"
    />
    <LineChart
      height="400px"
      title="近4个季度隐患处置完成率变化趋势"
      :x-data="['2023-Q3', '2023-Q4', '2024-Q1', '2024-Q2']"
      :series-data="[{ name: '处置完成率', data: [85, 88, 90, 92] }]"
    />
    <LineChart
      height="400px"
      title="近4个季度重大隐患数变化趋势"
      :x-data="['2023-Q3', '2023-Q4', '2024-Q1', '2024-Q2']"
      :series-data="[{ name: '重大隐患数', data: [120, 110, 100, 95] }]"
    />
  </div>
</template>
