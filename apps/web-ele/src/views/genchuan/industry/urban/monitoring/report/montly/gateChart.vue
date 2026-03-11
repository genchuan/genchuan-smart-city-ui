<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';
import LineChart from '#/components/stats/lineChart.vue';

const state = reactive({
  cardList: [
    { title: '窨井盖总数', value: 15000, color: '#13ce66' },
    { title: '月累计隐患数', value: 500, color: '#FF6B6B' },
    { title: '月处置完成数', value: 450, color: '#4ECDC4' },
    { title: '设备月在线率', value: '97.5%', color: '#67C23A' },
    { title: '月隐患处置完成率', value: '90%', color: '#E6A23C' },
    { title: '月重复隐患率', value: '15%', color: '#F56C6C' },
    { title: '月平均处置时长', value: '8.5小时', color: '#909399' },
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
      title-text="月隐患类型分布占比"
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
      title-text="月重复隐患区域分布占比"
      :data="[
        { name: '鼓楼区', value: 40 },
        { name: '丰泽区', value: 30 },
        { name: '城厢区', value: 20 },
        { name: '其他区域', value: 10 },
      ]"
      :colors="['#F56C6C', '#E6A23C', '#67C23A', '#909399']"
    />
    <Columnar
      height="330px"
      title="各区域月累计隐患数对比"
      :x-data="['鼓楼区', '思明区', '丰泽区', '芗城区', '城厢区', '蕉城区']"
      :series-data="[{ name: '隐患数', data: [60, 30, 90, 15, 75, 25] }]"
    />
    <Columnar
      height="330px"
      title="各责任单位考核得分对比"
      :x-data="['鼓楼区市政', '思明区市政', '丰泽区市政', '芗城区市政', '城厢区市政', '蕉城区市政']"
      :series-data="[{ name: '考核得分', data: [85, 95, 65, 90, 70, 88] }]"
    />
    <Columnar
      height="330px"
      title="近6个月新增隐患数对比"
      :x-data="['1月', '2月', '3月', '4月', '5月', '6月']"
      :series-data="[{ name: '新增隐患数', data: [45, 52, 48, 55, 50, 47] }]"
    />
    <LineChart
      height="400px"
      title="近6个月隐患处置完成率变化趋势"
      :x-data="['1月', '2月', '3月', '4月', '5月', '6月']"
      :series-data="[{ name: '处置完成率', data: [85, 88, 90, 87, 92, 95] }]"
    />
    <LineChart
      height="400px"
      title="近6个月重复隐患率变化趋势"
      :x-data="['1月', '2月', '3月', '4月', '5月', '6月']"
      :series-data="[{ name: '重复隐患率', data: [18, 17, 16, 15, 14, 13] }]"
    />
  </div>
</template>
