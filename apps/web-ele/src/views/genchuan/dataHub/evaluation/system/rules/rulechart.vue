<script setup>
import { reactive, onMounted } from 'vue';
import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [],
  pieData1: [],
  pieData2: [],
  pieData3: [],
  barXData: [],
  barSeriesData: [],
});

// 模拟获取数据（可替换为实际API调用）
const fetchData = () => {
  // 卡片数据
  state.cardList = [
    { title: '总分类数', value: 12, color: '#13ce66' },
    { title: '规则项总数', value: 45, color: '#4ECDC4' },
    { title: '否决项总数', value: 8, color: '#FF6B6B' },
    { title: '启用规则数', value: 38, color: '#FFC107' },
  ];

  // 规则类型占比饼图
  state.pieData1 = [
    { name: '加分', value: 25 },
    { name: '扣分', value: 20 },
  ];

  // 适用对象类型占比饼图
  state.pieData2 = [
    { name: '网格', value: 20 },
    { name: '部门', value: 15 },
    { name: '社区', value: 8 },
    { name: '街道', value: 2 },
  ];

  // 状态占比饼图
  state.pieData3 = [
    { name: '启用', value: 38 },
    { name: '停用', value: 15 },
  ];

  // 柱状图数据
  state.barXData = ['规则分类1', '规则分类2', '规则分类3', '规则分类4', '规则分类5'];
  state.barSeriesData = [
    {
      // name: '规则项数量',
      data: [12, 8, 6, 9, 10],
    },
  ];
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="park-chart-box park-subject-chart">
    <!-- 卡片区域 -->
    <div class="chart-box-left">
      <Card
        class="left-card"
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
      />
    </div>

    <!-- 饼图1：规则类型占比 -->
    <Circle
      width="340px"
      height="330px"
      title-text="规则类型占比"
      :data="state.pieData1"
    />

    <!-- 饼图2：适用对象类型占比 -->
    <Circle
      width="340px"
      height="330px"
      title-text="适用对象类型占比"
      :data="state.pieData2"
    />

    <!-- 饼图3：状态占比（自定义颜色） -->
    <Circle
      width="340px"
      height="330px"
      title-text="状态占比"
      :data="state.pieData3"
      :colors="['#67C23A', '#E6A23C', '#F56C6C']"
    />

    <!-- 柱状图：各分类规则项数量对比 -->
    <Columnar
      class="district-columnar"
      height="330px"
      title="各分类规则项数量对比"
      :x-data="state.barXData"
      :series-data="state.barSeriesData"
    />
  </div>
</template>

<style lang="scss">
.park-subject-chart {
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
  .subject-columnar {
    min-width: 200px !important;
  }
}
</style>

