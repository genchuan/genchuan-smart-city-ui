<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Line from '#/components/stats/line.vue';

const state = reactive({
  // 卡片数据
  cardList: [
    { title: '复审台账总数', value: 120, color: '#13ce66' },
    { title: '待复审数', value: 35, color: '#4ECDC4' },
    { title: '已下发数', value: 65, color: '#FF6B6B' },
  ],
  // 圆环图数据
  circleData: {
    reviewStatus: [
      { name: '已完成', value: 84 },
      { name: '待复审', value: 35 },
      { name: '处理中', value: 1 },
    ],
    violationLevel: [
      { name: '轻微', value: 45 },
      { name: '一般', value: 50 },
      { name: '严重', value: 25 },
    ],
  },
  // 堆叠柱状图数据
  stackedColumnData: {
    xData: ['1月', '2月', '3月', '4月', '5月', '6月'],
    seriesData: [
      { name: '新增数量', data: [15, 20, 25, 18, 22, 30] },
      { name: '完成数量', data: [12, 18, 20, 15, 20, 25] },
    ],
  },
  // 基础柱状图数据
  basicColumnData: {
    xData: ['区域A', '区域B', '区域C', '区域D', '区域E'],
    seriesData: [
      { name: '复审完成数量', data: [25, 30, 20, 15, 22] },
      { name: '整改完成率(%)', data: [85, 90, 75, 80, 95] },
    ],
  },
  // 折线图数据
  lineData: {
    xData: ['1月', '2月', '3月'],
    seriesData: [{ name: '整改完成率(%)', data: [75, 80, 85] }],
  },
});
</script>

<template>
  <div class="park-chart-box">
    <!-- 卡片部分 -->
    <div class="chart-box-left">
      <Card
        class="left-card"
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
      />
    </div>

    <!-- 圆环图部分 -->
    <Circle
      width="340px"
      height="330px"
      title-text="复审状态占比"
      :data="state.circleData.reviewStatus"
      :colors="['#67C23A', '#E6A23C', '#F56C6C', '#909399']"
    />
    <Circle
      width="340px"
      height="330px"
      title-text="违规等级占比"
      :data="state.circleData.violationLevel"
      :colors="['#67C23A', '#E6A23C', '#F56C6C', '#909399']"
    />

    <!-- 折线图部分 -->
    <Line
      height="330px"
      title="近3个月复审台账企业整改完成率趋势"
      :x-data="state.lineData.xData"
      :series-data="state.lineData.seriesData"
      y-name="完成率(%)"
    />
  </div>
</template>
