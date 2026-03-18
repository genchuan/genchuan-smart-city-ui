<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';
import BrokenLine from '#/components/stats/lineChart.vue';

const state = reactive({
  cardList: [
    { title: '窨井盖总数', value: 15000, color: '#13ce66' },
    { title: '周累计隐患数', value: 150, color: '#FF6B6B' },
    { title: '周处置完成数', value: 120, color: '#409EFF' },
    { title: '周平均设备在线率', value: '96.5%', color: '#67C23A' },
    { title: '周隐患处置完成率', value: '80.0%', color: '#4ECDC4' },
    { title: '周平均处置时长', value: '4.5小时', color: '#909399' },
    { title: '环比隐患变化率', value: '10.0%', color: '#E6A23C' },
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
      title-text="周隐患类型分布占比"
      :data="[
        { name: '缺失', value: 50 },
        { name: '破损', value: 60 },
        { name: '移位', value: 40 },
      ]"
      :colors="['#67C23A', '#E6A23C', '#F56C6C', '#909399']"
    />
    <Circle
      width="380px"
      height="330px"
      title-text="各责任单位处置量占比"
      :data="[
        { name: '鼓楼区', value: 12 },
        { name: '思明区', value: 10 },
        { name: '丰泽区', value: 20 },
        { name: '芗城区', value: 5 },
        { name: '城厢区', value: 18 },
      ]"
      :colors="['#67C23A', '#E6A23C', '#F56C6C', '#909399', '#409EFF']"
    />
    <Circle
      width="380px"
      height="330px"
      title-text="井盖状态周度分布占比"
      :data="[
        { name: '正常', value: 14850 },
        { name: '隐患', value: 150 },
      ]"
    />
    <Columnar
      height="330px"
      title="各区域周累计隐患数对比"
      :x-data="['鼓楼区', '思明区', '丰泽区', '芗城区', '城厢区', '蕉城区']"
      :series-data="[{ name: '周累计隐患数', data: [15, 10, 30, 5, 25, 8] }]"
    />
    <Columnar
      height="330px"
      title="各区域处置完成率对比"
      :x-data="['鼓楼区', '思明区', '丰泽区', '芗城区', '城厢区', '蕉城区']"
      :series-data="[{ name: '处置完成率(%)', data: [80, 100, 66.67, 100, 72, 100] }]"
    />
    <Columnar
      height="330px"
      title="近4周新增隐患数对比"
      :x-data="['第22周', '第23周', '第24周', '第25周']"
      :series-data="[{ name: '新增隐患数', data: [100, 120, 130, 150] }]"
    />
    <BrokenLine
      title="近4周隐患处置完成率变化趋势"
      :x-data="['第22周', '第23周', '第24周', '第25周']"
      :series-data="[{ name: '处置完成率(%)', data: [75, 78, 82, 80] }]"
    />
    <BrokenLine
      title="近4周平均设备在线率变化趋势"
      :x-data="['第22周', '第23周', '第24周', '第25周']"
      :series-data="[{ name: '设备在线率(%)', data: [95.2, 95.8, 96.2, 96.5] }]"
    />
    <Columnar
      height="330px"
      title="区域隐患管控排名"
      :x-data="['三明市梅列区', '漳州市芗城区', '厦门市思明区', '平潭综合实验区', '宁德市蕉城区', '龙岩市新罗区', '南平市延平区', '莆田市城厢区', '泉州市丰泽区']"
      :series-data="[{ name: '排名', data: [1, 2, 2, 3, 4, 5, 6, 7, 8] }]"
    />
    <Columnar
      height="330px"
      title="责任单位处置完成率排名"
      :x-data="['厦门市思明区', '漳州市芗城区', '宁德市蕉城区', '三明市梅列区', '平潭综合实验区', '福州市鼓楼区', '龙岩市新罗区', '莆田市城厢区', '南平市延平区', '泉州市丰泽区']"
      :series-data="[{ name: '处置完成率(%)', data: [100, 100, 100, 100, 100, 80, 75, 72, 66.67, 66.67] }]"
    />
  </div>
</template>
