<script setup>
import { reactive, onMounted } from 'vue';
import { getGarbageTransferChartDashboard } from '#/api/genchuan/industry/urban/environmentalSanitation/sanitationSceneMgmt/garbageTransfer/data.js';
import Indicator from '#/components/stats/indicator.vue';
import Pie from '#/components/stats/pie.vue';
import Bar from '#/components/stats/bar.vue';
import LineChart from '#/components/stats/lineChart.vue';

const state = reactive({
  loading: false,
  cardList: [],
  pieData: {
    status: [],
    area: [],
  },
  barData: {
    x: [],
    series: [],
  },
  lineData: {
    x: [],
    series: [],
  },
});

const toNumber = (val) => (val === null || val === undefined ? 0 : Number(val) || 0);

// 获取数据
const fetchData = async () => {
  state.loading = true;
  try {
    const res = await getGarbageTransferChartDashboard();

    // 接口返回已解包，直接使用 res（没有外层 code/data）
    if (res && typeof res === 'object') {
      // 卡片数据映射
      state.cardList = [
        { title: '总转运站数', value: toNumber(res.totalStations), color: '#409EFF' },
        { title: '正常运营数', value: toNumber(res.normalOperationCount), color: '#67C23A' },
        { title: '设备正常数', value: toNumber(res.equipmentNormalCount), color: '#E6A23C' },
        { title: '环境达标数', value: toNumber(res.environmentStandardCount), color: '#F56C6C' },
      ];

      // 圆环图数据
      state.pieData.status = Array.isArray(res.operationStatusDistribution) ? res.operationStatusDistribution : [];
      state.pieData.area = Array.isArray(res.areaDistribution) ? res.areaDistribution : [];

      // 柱状图数据：不同转运站日转运量对比
      const volumeList = Array.isArray(res.dailyTransferVolumeComparison) ? res.dailyTransferVolumeComparison : [];
      state.barData.x = volumeList.map(item => item.name || '');
      state.barData.series = volumeList.map(item => toNumber(item.value));

      // 折线图数据：近7日环境指标变化趋势（如果为 null，置空数组）
      const trend = Array.isArray(res.environmentTrend7Days) ? res.environmentTrend7Days : [];
      state.lineData.x = trend.map(item => item.date || item.timePoint || '');
      state.lineData.series = trend.map(item => toNumber(item.value));
    }
  } catch (error) {
    console.error('获取转运站仪表盘数据失败', error);
    // 可根据需要添加用户提示
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
    <!-- 左侧卡片区域：四个指标卡片，网格布局 -->
    <div class="box-left" style="flex: 1 !important;">
      <Indicator
        class="left-card"
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
      />
    </div>

    <!-- 运营状态占比圆环图 -->
    <Pie
      style="flex: 1 !important;"
      title-text="运营状态占比"
      :data="state.pieData.status"
    />

    <!-- 区域分布占比圆环图 -->
    <Pie
      style="flex: 1 !important;"
      title-text="区域分布占比"
      :data="state.pieData.area"
    />

    <!-- 基础柱状图：转运站日转运量对比 -->
    <Bar
      style="flex: 1 !important;"
      title="不同转运站日转运量对比"
      :x-data="state.barData.x"
      :series-data="[{ name: '日转运量(吨)', data: state.barData.series }]"
    />

    <!-- 基础折线图：近7日环境指标变化趋势 -->
    <LineChart
      style="flex: 1 !important;"
      title="近7日环境指标变化趋势"
      :x-data="state.lineData.x"
      :series-data="[{ name: '异味浓度(ppm)', data: state.lineData.series }]"
      y-name="ppm"
      :smooth="true"
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
