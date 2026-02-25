<script setup>
import { computed } from 'vue';
import { subjectList } from './table/data.js'; // 导入主体数据

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const subjects = subjectList(); // 获取数据

// 统计卡片数据
const cardList = computed(() => {
  const total = subjects.length;
  const manual = subjects.filter(s => s.subjectTypeName === '人工主体').length;
  const system = subjects.filter(s => s.subjectTypeName === '系统主体').length;
  const enabled = subjects.filter(s => s.statusName === '启用').length;
  return [
    { title: '总主体数', value: total, color: '#13ce66' },
    { title: '人工主体数', value: manual, color: '#4ECDC4' },
    { title: '系统主体数', value: system, color: '#FF6B6B' },
    { title: '启用主体数', value: enabled, color: '#FFC107' },
  ];
});

// 主体类型占比
const typeData = computed(() => {
  const manual = subjects.filter(s => s.subjectTypeName === '人工主体').length;
  const system = subjects.filter(s => s.subjectTypeName === '系统主体').length;
  return [
    { name: '人工主体', value: manual },
    { name: '系统主体', value: system },
  ];
});

// 状态占比
const statusData = computed(() => {
  const enabled = subjects.filter(s => s.statusName === '启用').length;
  const disabled = subjects.filter(s => s.statusName === '停用').length;
  return [
    { name: '启用', value: enabled },
    { name: '停用', value: disabled },
    { name: '其他', value: 0 }, // 占位，颜色对应
  ];
});

// 各主体成员数量对比（取前8个，避免柱状图太拥挤）
const memberCompareData = computed(() => {
  const sorted = [...subjects].sort((a, b) => b.memberCount - a.memberCount).slice(0, 8);
  return {
    xData: sorted.map(s => s.name),
    seriesData: [{ name: '成员数量', data: sorted.map(s => s.memberCount) }]
  };
});
</script>

<template>
  <div class="park-chart-box park-district-chart">
    <div class="chart-box-left">
      <Card
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
      />
    </div>
    <Circle
      width="340px"
      height="330px"
      title-text="主体类型占比"
      :data="typeData"
    />
    <Circle
      width="340px"
      height="330px"
      title-text="状态占比"
      :data="statusData"
      :colors="['#67C23A', '#E6A23C', '#F56C6C']"
    />
    <Columnar
      height="330px"
      title="主体成员数量对比"
      :x-data="memberCompareData.xData"
      :series-data="memberCompareData.seriesData"
    />
  </div>
</template>

<style lang="scss">
.park-district-chart {
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
  .district-columnar {
    min-width: 200px !important;
  }
}
</style>
