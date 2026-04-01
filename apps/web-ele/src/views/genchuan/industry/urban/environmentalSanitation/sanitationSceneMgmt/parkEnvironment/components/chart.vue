<script setup>
import { reactive, onMounted } from 'vue';
import { getParkChartDashboard } from '#/api/genchuan/industry/urban/environmentalSanitation/sanitationSceneMgmt/parkEnvironment/data.js';
import Indicator from '#/genchuan-components/stats/indicator.vue';
import Pie from '#/genchuan-components/stats/pie.vue';
import Bar from '#/genchuan-components/stats/bar.vue';

const state = reactive({
  loading: false,
  // 五个核心卡片
  cardList: [],
  // 两个圆环图
  pieData: {
    status: [],   // 运营状态占比
    area: [],     // 所属区域分布占比
  },
  // 基础柱状图：不同公园环境达标率对比
  barData: {
    x: [],
    series: [],
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
    const res = await getParkChartDashboard();

    // 接口返回已解包，直接使用 res（无外层 code/data）
    if (res && typeof res === 'object') {
      // 卡片数据映射
      state.cardList = [
        {title: '总公园数', value: toNumber(res.totalParkCount), color: '#409EFF'},
        {title: '正常运营数', value: toNumber(res.normalOperationCount), color: '#67C23A'},
        {title: '保洁达标数', value: toNumber(res.cleaningStandardMetCount), color: '#E6A23C'},
        {
          title: '绿化存活达标数',
          value: toNumber(res.greeningSurvivalStandardMetCount),
          color: '#F56C6C'
        },
        {title: '设施完好数', value: toNumber(res.facilityIntactCount), color: '#909399'},
      ];

      // 圆环图数据
      state.pieData.status = Array.isArray(res.operationStatusDistribution) ? res.operationStatusDistribution : [];
      state.pieData.area = Array.isArray(res.areaDistribution) ? res.areaDistribution : [];

      // 柱状图数据：不同公园环境达标率
      const rateList = Array.isArray(res.environmentComplianceRateByPark) ? res.environmentComplianceRateByPark : [];
      state.barData.x = rateList.map(item => item.name || '');
      state.barData.series = rateList.map(item => toNumber(item.value));
    } else {
      console.error('接口返回数据格式异常', res);
    }
  } catch (error) {
    console.error('请求公园仪表盘数据失败:', error);
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
    <div class="box-left-m" style="flex: 1 !important;">
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

    <!-- 所属区域分布占比圆环图 -->
    <Pie
      style="flex: 1 !important;"
      title-text="所属区域分布占比"
      :data="state.pieData.area"
    />

    <!-- 基础柱状图：不同公园环境达标率对比 -->
    <Bar
      style="flex: 1 !important;"
      title="不同公园环境达标率对比"
      :x-data="state.barData.x"
      :series-data="[{ name: '达标率', data: state.barData.series }]"
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
