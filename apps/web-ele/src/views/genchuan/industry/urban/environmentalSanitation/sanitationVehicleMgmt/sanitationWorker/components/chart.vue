<script setup>
import { reactive } from 'vue';
import Indicator from '#/components/stats/indicator.vue';
import Pie from '#/components/stats/pie.vue';
import Bar from '#/components/stats/bar.vue';

// 符合 2.2.1 环卫人员管理全部模块的模拟数据
const state = reactive({
  // 五个核心卡片
  cardList: [
    { title: '总人员数', value: 86, color: '#409EFF' },
    { title: '在岗人数', value: 72, color: '#67C23A' },
    { title: '全勤人数', value: 65, color: '#E6A23C' },
    { title: '考核优秀人数', value: 28, color: '#F56C6C' },
    { title: '待排班人数', value: 8, color: '#909399' },
  ],
  // 三个圆环图
  pieData: {
    jobType: [  // 岗位类型占比
      { name: '保洁员', value: 42 },
      { name: '收运员', value: 24 },
      { name: '驾驶员', value: 12 },
      { name: '管理员', value: 8 },
    ],
    personStatus: [  // 人员状态占比
      { name: '在岗', value: 72 },
      { name: '休假', value: 8 },
      { name: '培训', value: 4 },
      { name: '离职', value: 2 },
    ],
    teamDistribution: [  // 所属班组分布占比
      { name: '龙文班组', value: 28 },
      { name: '龙海班组', value: 22 },
      { name: '芗城班组', value: 20 },
      { name: '长泰班组', value: 16 },
    ],
  },
  // 两个柱状图
  barData: {
    teamCount: {  // 不同班组人员数量对比
      x: ['龙文班组', '龙海班组', '芗城班组', '长泰班组'],
      series: [28, 22, 20, 16],
    },
    jobScore: {  // 不同岗位平均考核得分对比
      x: ['保洁员', '收运员', '驾驶员', '管理员'],
      series: [92, 88, 94, 96], // 考核得分
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
      title-text="岗位类型占比"
      :data="state.pieData.jobType"
    />
    <Pie
      style="flex: 1 !important;"
      title-text="人员状态占比"
      :data="state.pieData.personStatus"
    />
    <Pie
      style="flex: 1 !important;"
      title-text="所属班组分布占比"
      :data="state.pieData.teamDistribution"
    />

    <!-- 两个柱状图 -->
    <Bar
      style="flex: 1 !important;"
      title="不同班组人员数量对比"
      :x-data="state.barData.teamCount.x"
      :series-data="[{ name: '人员数量', data: state.barData.teamCount.series }]"
    />
    <Bar
      style="flex: 1 !important;"
      title="不同岗位平均考核得分对比"
      :x-data="state.barData.jobScore.x"
      :series-data="[{ name: '考核得分', data: state.barData.jobScore.series }]"
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
