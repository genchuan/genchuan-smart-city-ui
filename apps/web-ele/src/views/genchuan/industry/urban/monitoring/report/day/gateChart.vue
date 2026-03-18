<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';
import BrokenLine from '#/components/stats/lineChart.vue';

const state = reactive({
  cardList: [
    { title: '窨井盖总数', value: 1500, color: '#13ce66' },
    { title: '隐患井盖数', value: 60, color: '#FF6B6B' },
    { title: '当日新增隐患数', value: 15, color: '#E6A23C' },
    { title: '当日处置完成数', value: 12, color: '#409EFF' },
    { title: '设备日在线率', value: '96.5%', color: '#67C23A' },
    { title: '隐患发生率', value: '4.0%', color: '#909399' },
    { title: '当日处置完成率', value: '80.0%', color: '#4ECDC4' },
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
      width="380px"
      height="330px"
      title-text="窨井盖状态分布占比"
      :data="[
        { name: '正常', value: 1440 },
        { name: '隐患', value: 60 },
      ]"
    />
    <Circle
      width="380px"
      height="330px"
      title-text="隐患类型分布占比"
      :data="[
        { name: '缺失', value: 20 },
        { name: '破损', value: 25 },
        { name: '移位', value: 15 },
      ]"
      :colors="['#67C23A', '#E6A23C', '#F56C6C', '#909399']"
    />
    <Circle
      width="380px"
      height="330px"
      title-text="责任单位隐患处置完成率分布"
      :data="[
        { name: '鼓楼区', value: 100 },
        { name: '思明区', value: 100 },
        { name: '丰泽区', value: 60 },
        { name: '芗城区', value: 0 },
      ]"
      :colors="['#67C23A', '#E6A23C', '#F56C6C', '#909399']"
    />
    <Columnar
      height="330px"
      title="各区域当日新增隐患数对比"
      :x-data="['鼓楼区', '思明区', '丰泽区', '芗城区', '城厢区', '蕉城区']"
      :series-data="[{ name: '新增隐患数', data: [2, 1, 5, 0, 4, 1] }]"
    />
    <Columnar
      height="330px"
      title="各区域隐患发生率对比"
      :x-data="['鼓楼区', '思明区', '丰泽区', '芗城区', '城厢区', '蕉城区']"
      :series-data="[{ name: '隐患发生率(%)', data: [3.33, 2.5, 8.33, 1.67, 7.5, 2.14] }]"
    />
    <BrokenLine
      title="当日隐患处置进度实时变化曲线"
      :x-data="['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00']"
      :series-data="[{ name: '已处置隐患数', data: [0, 0, 1, 3, 6, 9, 11, 12] }]"
    />
  </div>
</template>
