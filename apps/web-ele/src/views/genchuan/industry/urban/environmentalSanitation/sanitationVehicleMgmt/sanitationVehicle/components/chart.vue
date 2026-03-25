<script setup>
import { reactive, onMounted } from 'vue';
import { getVehicleChartDashboard } from '#/api/genchuan/industry/urban/environmentalSanitation/sanitationVehicleMgmt/sanitationVehicle/data.js';
import Indicator from '#/components/stats/indicator.vue';
import Pie from '#/components/stats/pie.vue';
import Bar from '#/components/stats/bar.vue';

const state = reactive({
  loading: false,
  // 五个核心卡片
  cardList: [],
  // 三个圆环图
  pieData: {
    vehicleType: [],      // 车辆类型占比
    vehicleStatus: [],    // 车辆状态占比
    deptDistribution: [], // 所属部门分布占比
  },
  // 两个柱状图
  barData: {
    deptVehicleCount: {    // 不同部门车辆数量对比
      x: [],
      series: [],
    },
    vehicleTypeIntactRate: { // 不同类型车辆完好率对比
      x: [],
      series: [],
    },
  },
});

// 通用数值转换（处理字符串或数字）
const toNumber = (val) => {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'string') return parseFloat(val) || 0;
  return Number(val) || 0;
};

// 获取图表数据
const fetchChartData = async () => {
  state.loading = true;
  try {
    const res = await getVehicleChartDashboard();

    // 接口返回已解包，直接使用 res（无外层 code/data）
    if (res && typeof res === 'object') {
      // 卡片数据映射
      state.cardList = [
        { title: '总车辆数', value: toNumber(res.totalVehicleCount), color: '#409EFF' },
        { title: '正常运行数', value: toNumber(res.normalOperationCount), color: '#67C23A' },
        { title: '维护中数', value: toNumber(res.maintenanceCount), color: '#E6A23C' },
        { title: '违规告警数', value: toNumber(res.violationAlertCount), color: '#F56C6C' },
        { title: '待作业车辆数', value: toNumber(res.pendingWorkCount), color: '#909399' },
      ];

      // 圆环图数据
      state.pieData.vehicleType = Array.isArray(res.vehicleTypeDistribution) ? res.vehicleTypeDistribution : [];
      state.pieData.vehicleStatus = Array.isArray(res.vehicleStatusDistribution) ? res.vehicleStatusDistribution : [];
      state.pieData.deptDistribution = Array.isArray(res.deptDistribution) ? res.deptDistribution : [];

      // 柱状图1：不同部门车辆数量对比
      const deptCountList = Array.isArray(res.vehicleCountByDept) ? res.vehicleCountByDept : [];
      state.barData.deptVehicleCount.x = deptCountList.map(item => item.name || '');
      state.barData.deptVehicleCount.series = deptCountList.map(item => toNumber(item.value));

      // 柱状图2：不同类型车辆完好率对比
      const intactRateList = Array.isArray(res.vehicleIntegrityRateByType) ? res.vehicleIntegrityRateByType : [];
      state.barData.vehicleTypeIntactRate.x = intactRateList.map(item => item.name || '');
      state.barData.vehicleTypeIntactRate.series = intactRateList.map(item => toNumber(item.value));
    } else {
      console.error('接口返回数据格式异常', res);
    }
  } catch (error) {
    console.error('请求环卫车辆仪表盘数据失败:', error);
  } finally {
    state.loading = false;
  }
};

onMounted(() => {
  fetchChartData();
});
</script>

<template>
  <div class="chart-box" v-loading="state.loading" element-loading-text="加载中...">
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
