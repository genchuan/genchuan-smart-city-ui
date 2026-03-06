<script setup>
import { defineProps } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';
import Line from '#/components/stats/line.vue';

const props = defineProps({
  cardList: {
    type: Array,
    default: () => [
      { title: '总任务数', value: 20, color: '#13ce66' },
      { title: '进行中任务', value: 8, color: '#409eff' },
      { title: '平均完成率', value: 65, color: '#ffc107' },
      { title: '未完成任务数', value: 12, color: '#f56c6c' },
    ]
  },
  pieData1: {
    type: Array,
    default: () => [
      { name: '未启动', value: 5 },
      { name: '进行中', value: 5 },
      { name: '暂停中', value: 3 },
      { name: '已完成', value: 4 },
      { name: '已取消', value: 3 },
    ]
  },
  pieData2: {
    type: Array,
    default: () => [
      { name: '自动采集', value: 10 },
      { name: '人工录入', value: 6 },
      { name: '接口同步', value: 4 },
    ]
  },
  pieData3: {
    type: Array,
    default: () => [
      { name: '网格管理评价模板', value: 6 },
      { name: '部门绩效评价模板', value: 5 },
      { name: '社区服务评价模板', value: 5 },
      { name: '街道治理评价模板', value: 4 },
    ]
  },
  barData: {
    type: Object,
    default: () => ({
      xData: ['月度', '季度', '年度', '专项'],
      series: [{
        name: '任务数量',
        data: [8, 5, 4, 3]
      }]
    })
  },
  lineData: {
    type: Object,
    default: () => ({
      xData: ['10月', '11月', '12月', '1月', '2月', '3月'],
      series: [
        { name: '创建任务', data: [6, 5, 4, 3, 4, 2] },
        { name: '完成任务', data: [5, 4, 3, 3, 3, 1] }
      ]
    })
  }
});
</script>

<template>
  <div class="park-chart-box park-task-chart">
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
      title-text="任务状态占比"
      :data="pieData1"
    />
    <Circle
      width="340px"
      height="330px"
      title-text="数据采集方式占比"
      :data="pieData2"
      :colors="['#409eff', '#67c23a', '#e6a23c']"
    />
    <Circle
      width="340px"
      height="330px"
      title-text="关联模板占比"
      :data="pieData3"
      :colors="['#909399', '#409eff', '#67c23a', '#e6a23c']"
    />
    <Columnar
      height="330px"
      title="各周期任务数量对比"
      :x-data="barData.xData"
      :series-data="barData.series"
    />
    <Line
      height="330px"
      title="近6个月任务创建与完成趋势"
      :x-data="lineData.xData"
      :series-data="lineData.series"
    />
  </div>
</template>

<style lang="scss">
.park-task-chart {
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
  .task-columnar {
    min-width: 200px !important;
  }
}
</style>
