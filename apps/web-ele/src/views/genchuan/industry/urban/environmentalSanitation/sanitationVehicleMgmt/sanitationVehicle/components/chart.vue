<script setup>
import {reactive, onMounted, ref, computed} from 'vue';
import {ElSelect, ElOption} from 'element-plus';
import {
  getVehicleChartDashboard
} from '#/api/genchuan/industry/urban/environmentalSanitation/sanitationVehicleMgmt/sanitationVehicle/data.js';
import Indicator from '#/genchuan-components/stats/indicator.vue';
import Pie from '#/genchuan-components/stats/pie.vue';
import Bar from '#/genchuan-components/stats/bar.vue';

const state = reactive({
  loading: false,
  // 五个核心卡片
  cardList: [],
  // 三个圆环图（原始数据，用于切换）
  pieData: {
    vehicleType: [],      // 车辆类型占比
    vehicleStatus: [],    // 车辆状态占比
    deptDistribution: [], // 所属部门分布占比
  },
  // 两个柱状图（原始数据，用于切换）
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

// 圆环图选项（基于原始数据生成）
const pieOptions = computed(() => [
  {
    title: '车辆类型占比',
    data: state.pieData.vehicleType,
  },
  {
    title: '车辆状态占比',
    data: state.pieData.vehicleStatus,
  },
  {
    title: '所属部门分布占比',
    data: state.pieData.deptDistribution,
  },
]);

// 柱状图选项（基于原始数据生成）
const barOptions = computed(() => [
  {
    title: '不同部门车辆数量对比',
    xData: state.barData.deptVehicleCount.x,
    seriesData: [{name: '车辆数', data: state.barData.deptVehicleCount.series}],
  },
  {
    title: '不同类型车辆完好率对比',
    xData: state.barData.vehicleTypeIntactRate.x,
    seriesData: [{name: '完好率', data: state.barData.vehicleTypeIntactRate.series}],
  },
]);

// 当前选中的圆环图索引和数据
const activePieIndex = ref(0);
const currentPieData = computed(() => pieOptions.value[activePieIndex.value] || pieOptions.value[0]);

// 切换圆环图
const handlePieChange = (index) => {
  activePieIndex.value = index;
};

// 当前选中的柱状图索引和数据
const activeBarIndex = ref(0);
const currentBar = computed(() => barOptions.value[activeBarIndex.value] || barOptions.value[0]);

// 切换柱状图
const handleBarChange = (index) => {
  activeBarIndex.value = index;
};

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
        {title: '总车辆数', value: toNumber(res.totalVehicleCount), color: '#409EFF'},
        {title: '正常运行数', value: toNumber(res.normalOperationCount), color: '#67C23A'},
        {title: '维护中数', value: toNumber(res.maintenanceCount), color: '#E6A23C'},
        {title: '违规告警数', value: toNumber(res.violationAlertCount), color: '#F56C6C'},
        {title: '待作业车辆数', value: toNumber(res.pendingWorkCount), color: '#909399'},
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

    <!-- 圆环图区域（带下拉切换） -->
    <div class="pie-chart-area">
      <div class="pie-select-wrapper">
        <el-select
          v-model="activePieIndex"
          size="small"
          @change="handlePieChange"
        >
          <el-option
            v-for="(opt, idx) in pieOptions"
            :key="idx"
            :label="opt.title"
            :value="idx"
          />
        </el-select>
      </div>
      <Pie
        style="flex: 1 !important;"
        :title-text="currentPieData.title"
        :data="currentPieData.data"
      />
    </div>

    <!-- 柱状图区域（带下拉切换） -->
    <div class="bar-chart-area">
      <div class="bar-select-wrapper">
        <el-select
          v-model="activeBarIndex"
          size="small"
          @change="handleBarChange"
        >
          <el-option
            v-for="(opt, idx) in barOptions"
            :key="idx"
            :label="opt.title"
            :value="idx"
          />
        </el-select>
      </div>
      <Bar
        style="flex: 1 !important;"
        :title="currentBar.title"
        :x-data="currentBar.xData"
        :series-data="currentBar.seriesData"
      />
    </div>
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

/* 圆环图区域样式 */
.pie-chart-area {
  position: relative;
  flex: 1;
  min-width: 280px;
  height: 100%;
  margin-top: 10px;
}

.pie-select-wrapper {
  position: absolute;
  top: 8px;
  right: 10px;
  z-index: 10;
}

/* 柱状图区域样式 */
.bar-chart-area {
  position: relative;
  flex: 1.5;
  min-width: 300px;
  height: 100%;
  margin-top: 10px;
}

.bar-select-wrapper {
  position: absolute;
  top: 8px;
  right: 10px;
  z-index: 10;
}
</style>
