<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';
import LineChart from '#/components/stats/lineChart.vue';

const state = reactive({
  cardList: [
    { title: '自定义指标汇总值', value: 1500, color: '#13ce66' },
    { title: '指标对比差值', value: '-15', color: '#4ECDC4' },
    { title: '指标对比变化率', value: '-10.71%', color: '#FF6B6B' },
    { title: '数据总量', value: '10条', color: '#67C23A' },
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
      title-text="隐患类型占比"
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
      title-text="井盖状态分布占比"
      :data="[
        { name: '正常', value: 85 },
        { name: '异常', value: 15 },
      ]"
      :colors="['#67C23A', '#F56C6C']"
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
      title="不同维度核心指标统计值对比"
      :x-data="['区域', '责任单位', '井盖类型', '隐患等级']"
      :series-data="[{ name: '核心指标1', data: [1500, 1500, 800, 1500] }]"
    />
    <Columnar
      height="330px"
      title="自定义时段内隐患数变化对比"
      :x-data="['1月', '2月', '3月', '4月', '5月', '6月']"
      :series-data="[{ name: '隐患数', data: [25, 20, 18, 22, 15, 20] }]"
    />
    <LineChart
      height="400px"
      title="自定义时段内核心指标变化趋势"
      :x-data="['1月', '2月', '3月', '4月', '5月', '6月']"
      :series-data="[{ name: '核心指标1', data: [1500, 1500, 1500, 1500, 1500, 1500] }]"
    />
    <LineChart
      height="400px"
      title="对比维度指标变化曲线"
      :x-data="['1月', '2月', '3月', '4月', '5月', '6月']"
      :series-data="[{ name: '当前时段', data: [120, 115, 110, 105, 100, 95] }, { name: '对比时段', data: [135, 130, 125, 120, 115, 110] }]"
    />
    <Columnar
      height="330px"
      title="不同维度下隐患数与处置数叠加对比"
      :x-data="['区域', '责任单位', '井盖类型', '隐患等级']"
      :series-data="[{ name: '隐患数', data: [120, 120, 85, 95] }, { name: '处置数', data: [108, 108, 78, 88] }]"
      :stack="true"
    />
    <Columnar
      height="330px"
      title="各类型井盖隐患分布对比"
      :x-data="['雨水井盖', '污水井盖', '电力井盖', '通信井盖']"
      :series-data="[{ name: '隐患数', data: [85, 35, 15, 10] }, { name: '处置数', data: [78, 32, 12, 8] }]"
      :stack="true"
    />
  </div>
</template>
