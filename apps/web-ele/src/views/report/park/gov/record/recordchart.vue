<!-- recordchart.vue -->
<script setup>
import { reactive } from 'vue';
import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

// 卡片数据：上报完成率、驳回率、按时上报数
const cardList = reactive([
  { title: '上报完成率', value: '82.5%', color: '#4ECDC4' },
  { title: '驳回率', value: '11.3%', color: '#F56C6C' },
  { title: '按时上报数', value: '26', color: '#13ce66' },
]);

// 上报状态占比饼图
const statusPieData = [
  { name: '待上报', value: 2 },
  { name: '已上报', value: 5 },
  { name: '已驳回', value: 3 },
  { name: '审核通过', value: 4 },
];

// 近30天上报数量趋势柱状图
const last30Days = Array.from({ length: 30 }, (_, i) => {
  const date = new Date('2026-02-12');
  date.setDate(date.getDate() - (29 - i));
  return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
});
const uploadTrendData = Array.from({ length: 30 }, () => Math.floor(Math.random() * 10) + 1);
</script>

<template>
  <div class="park-chart-box park-district-chart">
    <!-- 卡片区：2列布局，复用原样式 -->
    <div class="chart-box-left">
      <Card
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        :title="item.title"
        :value="item.value"
        :color="item.color"
      />
    </div>

    <!-- 饼图：上报状态占比 -->
    <Circle
      title-text="上报状态占比"
      :data="statusPieData"
    />

    <!-- 柱状图：近30天上报数量趋势 -->
    <Columnar
      title="近30天上报数量趋势"
      :x-data="last30Days"
      :series-data="[
        { name: '上报数量', data: uploadTrendData },
      ]"
      :label-map="{ '上报数量': '次' }"
    />
  </div>
</template>

<style lang="scss">
.park-district-chart {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;

  .chart-box-left {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    max-width: 100%;
    height: 100%;
    .left-card {
      height: 159px !important;
    }
  }

  // 让饼图与柱状图自适应宽度
  > * {
    min-width: 280px;
    flex: 1 1 300px;
  }
}
</style>
