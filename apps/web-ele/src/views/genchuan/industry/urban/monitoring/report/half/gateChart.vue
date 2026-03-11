<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';
import LineChart from '#/components/stats/lineChart.vue';

const state = reactive({
  cardList: [
    { title: '窨井盖总数', value: 15000, color: '#13ce66' },
    { title: '半年累计隐患数', value: 2250, color: '#FF6B6B' },
    { title: '半年处置完成数', value: 1890, color: '#4ECDC4' },
    { title: '设备半年在线率', value: '97.2%', color: '#67C23A' },
    { title: '半年隐患处置完成率', value: '84%', color: '#E6A23C' },
    { title: '半年重复隐患率', value: '18%', color: '#F56C6C' },
    { title: '运维效能提升率', value: '6.8%', color: '#909399' },
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
      title-text="半年隐患类型分布占比"
      :data="[
        { name: '井盖缺失', value: 30 },
        { name: '井盖破损', value: 25 },
        { name: '井盖移位', value: 20 },
        { name: '井盖异响', value: 15 },
        { name: '其他异常', value: 10 },
      ]"
    />
    <Circle
      width="340px"
      height="330px"
      title-text="责任单位处置量占比"
      :data="[
        { name: '鼓楼区市政', value: 35 },
        { name: '思明区市政', value: 25 },
        { name: '丰泽区市政', value: 20 },
        { name: '其他区域', value: 20 },
      ]"
      :colors="['#67C23A', '#E6A23C', '#F56C6C', '#909399', '#4ECDC4']"
    />
    <Circle
      width="340px"
      height="330px"
      title-text="重复隐患原因分布占比"
      :data="[
        { name: '设备故障', value: 40 },
        { name: '人为破坏', value: 30 },
        { name: '自然损坏', value: 20 },
        { name: '其他原因', value: 10 },
      ]"
      :colors="['#F56C6C', '#E6A23C', '#67C23A', '#909399']"
    />
    <Columnar
      height="330px"
      title="各区域半年累计隐患数对比"
      :x-data="['鼓楼区', '思明区', '丰泽区', '芗城区', '城厢区', '蕉城区']"
      :series-data="[{ name: '隐患数', data: [360, 180, 540, 90, 450, 150] }]"
    />
    <Columnar
      height="330px"
      title="各责任单位处置完成率对比"
      :x-data="['鼓楼区市政', '思明区市政', '丰泽区市政', '芗城区市政', '城厢区市政', '蕉城区市政']"
      :series-data="[{ name: '处置完成率', data: [88.89, 100, 72.22, 100, 73.33, 92] }]"
    />
    <Columnar
      height="330px"
      title="近2个半年新增隐患数对比"
      :x-data="['2023年下半年', '2024年上半年']"
      :series-data="[{ name: '新增隐患数', data: [2100, 2250] }]"
    />
    <LineChart
      height="400px"
      title="近2个半年隐患处置完成率变化趋势"
      :x-data="['2023年下半年', '2024年上半年']"
      :series-data="[{ name: '处置完成率', data: [80, 84] }]"
    />
    <LineChart
      height="400px"
      title="近2个半年重复隐患率变化趋势"
      :x-data="['2023年下半年', '2024年上半年']"
      :series-data="[{ name: '重复隐患率', data: [22, 18] }]"
    />
  </div>
</template>
