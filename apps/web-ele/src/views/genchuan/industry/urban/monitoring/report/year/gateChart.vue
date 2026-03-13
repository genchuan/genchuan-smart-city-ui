<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';
import LineChart from '#/components/stats/lineChart.vue';

const state = reactive({
  cardList: [
    { title: '窨井盖总数', value: 15000, color: '#13ce66' },
    { title: '年度累计隐患数', value: 4500, color: '#FF6B6B' },
    { title: '年度处置完成数', value: 4100, color: '#4ECDC4' },
    { title: '设备年度在线率', value: '97.2%', color: '#67C23A' },
    { title: '年度隐患处置完成率', value: '91%', color: '#E6A23C' },
    { title: '年度重大隐患处置率', value: '98%', color: '#F56C6C' },
    { title: '年度运维综合得分', value: '89.5', color: '#909399' },
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
      title-text="年度隐患类型分布占比"
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
      title-text="隐患等级分布占比"
      :data="[
        { name: '一般隐患', value: 60 },
        { name: '较大隐患', value: 25 },
        { name: '重大隐患', value: 15 },
      ]"
      :colors="['#67C23A', '#E6A23C', '#F56C6C']"
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
      :colors="['#67C23A', '#E6A23C', '#F56C6C', '#909399']"
    />
    <Columnar
      height="330px"
      title="各区域年度累计隐患数对比"
      :x-data="['鼓楼区', '思明区', '丰泽区', '芗城区', '城厢区', '蕉城区']"
      :series-data="[{ name: '隐患数', data: [720, 360, 1080, 180, 900, 300] }]"
    />
    <Columnar
      height="330px"
      title="各责任单位年度运维综合得分对比"
      :x-data="['鼓楼区市政', '思明区市政', '丰泽区市政', '芗城区市政', '城厢区市政', '蕉城区市政']"
      :series-data="[{ name: '综合得分', data: [89.5, 96.8, 72.3, 97.5, 78.6, 92.4] }]"
    />
    <Columnar
      height="330px"
      title="近3年新增隐患数对比"
      :x-data="['2022年度', '2023年度', '2024年度']"
      :series-data="[{ name: '新增隐患数', data: [4000, 4200, 4500] }]"
    />
    <LineChart
      height="400px"
      title="近3年隐患处置完成率变化趋势"
      :x-data="['2022年度', '2023年度', '2024年度']"
      :series-data="[{ name: '处置完成率', data: [85, 88, 91] }]"
    />
    <LineChart
      height="400px"
      title="近3年重大隐患数变化趋势"
      :x-data="['2022年度', '2023年度', '2024年度']"
      :series-data="[{ name: '重大隐患数', data: [350, 320, 280] }]"
    />
  </div>
</template>
