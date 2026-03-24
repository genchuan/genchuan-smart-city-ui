<script setup>
import { reactive } from 'vue';
import Indicator from '#/components/stats/indicator.vue';
import Pie from '#/components/stats/pie.vue';
import Bar from '#/components/stats/bar.vue';

// 符合 2.1.1 环卫车辆管理全部模块的模拟数据
const state = reactive({
  // 五个核心卡片
  cardList: [
    { title: '总车辆数', value: 48, color: '#409EFF' },
    { title: '正常运行数', value: 35, color: '#67C23A' },
    { title: '维护中数', value: 8, color: '#E6A23C' },
    { title: '违规告警数', value: 5, color: '#F56C6C' },
    { title: '待作业车辆数', value: 12, color: '#909399' },
  ],
  // 三个圆环图
  pieData: {
    vehicleType: [  // 车辆类型占比
      { name: '压缩车', value: 20 },
      { name: '洒水车', value: 12 },
      { name: '清扫车', value: 10 },
      { name: '转运车', value: 6 },
    ],
    vehicleStatus: [  // 车辆状态占比
      { name: '正常运行', value: 35 },
      { name: '维护中', value: 8 },
      { name: '待作业', value: 5 },
    ],
    deptDistribution: [  // 所属部门分布占比
      { name: '龙文车队', value: 18 },
      { name: '龙海车队', value: 12 },
      { name: '芗城车队', value: 10 },
      { name: '长泰车队', value: 8 },
    ],
  },
  // 两个柱状图
  barData: {
    deptVehicleCount: {  // 不同部门车辆数量对比
      x: ['龙文车队', '龙海车队', '芗城车队', '长泰车队'],
      series: [18, 12, 10, 8],
    },
    vehicleTypeIntactRate: {  // 不同类型车辆完好率对比
      x: ['压缩车', '洒水车', '清扫车', '转运车'],
      series: [96, 98, 95, 97], // 完好率 %
    },
  },
});
</script>

<template>
  <div class="chart-box">
    <!-- 左侧卡片区域：五个指标卡片，网格布局 -->
    <div class="box-left-m" style="flex: 1 !important;">
      <Indicator
        class="left-card"
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
      />
    </div>

    <!-- 三个圆环图 -->
    <Pie
      style="flex: 1 !important;"
      title-text="车辆类型占比"
      :data="state.pieData.vehicleType"
    />
    <Pie
      style="flex: 1 !important;"
      title-text="车辆状态占比"
      :data="state.pieData.vehicleStatus"
    />
    <Pie
      style="flex: 1 !important;"
      title-text="所属部门分布占比"
      :data="state.pieData.deptDistribution"
    />

    <!-- 两个柱状图 -->
    <Bar
      style="flex: 1 !important;"
      title="不同部门车辆数量对比"
      :x-data="state.barData.deptVehicleCount.x"
      :series-data="[{ name: '车辆数', data: state.barData.deptVehicleCount.series }]"
    />
    <Bar
      style="flex: 1 !important;"
      title="不同类型车辆完好率对比"
      :x-data="state.barData.vehicleTypeIntactRate.x"
      :series-data="[{ name: '完好率', data: state.barData.vehicleTypeIntactRate.series }]"
    />
  </div>
</template>

<style scoped lang="scss">
.chart-box {
  padding-bottom: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  padding-left: 15px;
  padding-right: 15px;
  width: 100% !important;

  .box-left-m {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr);
    min-width: 360px;
    max-width: 400px;
    margin-top: 10px !important;

    .left-card {
      height: 150px !important;
    }
  }

  .box-left {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    min-width: 280px;
    max-width: 320px;
    margin-top: 10px !important;

    .left-card {
      height: 150px !important;
    }
  }
}
</style>
