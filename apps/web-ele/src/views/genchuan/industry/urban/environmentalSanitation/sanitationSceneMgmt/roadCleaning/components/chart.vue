<script setup>
import { reactive, onMounted } from 'vue';
import { getRoadCleaningChartAll } from '#/api/genchuan/industry/urban/environmentalSanitation/sanitationSceneMgmt/roadCleaning/data.js';
import Indicator from '#/genchuan-components/stats/indicator.vue';
import Pie from '#/genchuan-components/stats/pie.vue';
import Bar from '#/genchuan-components/stats/bar.vue';

const state = reactive({
  loading: false,
  cardList: [],          // 卡片数据
  pieData: {             // 饼图数据
    status: [],
    roadType: [],
  },
  barData: {             // 柱状图数据
    x: [],
    series: [],
  },
});

// 数值安全转换
const toNumber = (val) => (val === null || val === undefined ? 0 : Number(val) || 0);

const fetchData = async () => {
  state.loading = true;
  try {
    const res = await getRoadCleaningChartAll();
    console.log('全部视图接口返回:', res); // 调试用

    // 直接使用返回的对象（无外层code/data包裹）
    if (res && typeof res === 'object') {
      // 卡片数据
      state.cardList = [
        { title: '总计划数', value: toNumber(res.totalPlanCount), color: '#409EFF' },
        { title: '执行中计划数', value: toNumber(res.executingPlanCount), color: '#c8ce13' },
        { title: '质量达标数', value: toNumber(res.qualityQualifiedCount), color: '#67C23A' },
        { title: '全勤人员数', value: toNumber(res.fullAttendanceStaffCount), color: '#F56C6C' },
      ];

      // 饼图数据（确保是数组）
      state.pieData.status = Array.isArray(res.planStatusDistribution) ? res.planStatusDistribution : [];
      state.pieData.roadType = Array.isArray(res.roadSectionTypeDistribution) ? res.roadSectionTypeDistribution : [];

      // 柱状图数据（不同区域质量达标率）
      const areaRates = Array.isArray(res.qualityQualifiedRateByArea) ? res.qualityQualifiedRateByArea : [];
      state.barData.x = areaRates.map(item => item.name);
      state.barData.series = areaRates.map(item => toNumber(item.value));
    }
  } catch (error) {
    console.error('获取全部视图图表数据失败', error);
  } finally {
    state.loading = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="chart-box" v-loading="state.loading" element-loading-text="加载中...">
    <!-- 卡片区域 -->
    <div class="box-left" style="flex: 1 !important;">
      <Indicator
        class="left-card"
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
      />
    </div>

    <!-- 计划状态占比圆环图 -->
    <Pie
      style="flex: 1 !important;"
      title-text="计划状态占比"
      :data="state.pieData.status"
    />

    <!-- 路段类型占比圆环图 -->
    <Pie
      style="flex: 1 !important;"
      title-text="路段类型占比"
      :data="state.pieData.roadType"
    />

    <!-- 不同区域清扫质量达标率柱状图 -->
    <Bar
      style="flex: 1 !important;"
      title="不同区域清扫质量达标率对比"
      :x-data="state.barData.x"
      :series-data="[{ name: '质量达标率', data: state.barData.series }]"
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
