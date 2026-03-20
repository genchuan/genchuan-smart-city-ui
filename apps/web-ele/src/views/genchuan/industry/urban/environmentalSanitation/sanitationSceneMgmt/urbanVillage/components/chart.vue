<script setup>
import { reactive, onMounted } from 'vue';
import { getUrbanVillageChartDashboard } from '#/api/genchuan/industry/urban/environmentalSanitation/sanitationSceneMgmt/urbanVillage/data.js';
import Indicator from '#/components/stats/indicator.vue';
import Pie from '#/components/stats/pie.vue';
import Bar from '#/components/stats/bar.vue';

const state = reactive({
  loading: false,
  // 五个核心卡片
  cardList: [],
  // 两个圆环图
  pieData: {
    status: [],   // 运营状态占比
    area: [],     // 所属区域分布占比
  },
  // 基础柱状图：不同城中村考核得分对比
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
    const res = await getUrbanVillageChartDashboard();

    // 接口返回已解包，直接使用 res（无外层 code/data）
    if (res && typeof res === 'object') {
      // 卡片数据映射
      state.cardList = [
        {title: '总城中村数', value: toNumber(res.totalVillageCount), color: '#409EFF'},
        {title: '正常运营数', value: toNumber(res.normalOperationCount), color: '#67C23A'},
        {title: '保洁达标数', value: toNumber(res.cleaningStandardMetCount), color: '#E6A23C'},
        {title: '问题处置完成数', value: toNumber(res.problemHandledCount), color: '#F56C6C'},
        {title: '复核通过数', value: toNumber(res.reviewPassedCount), color: '#909399'},
      ];

      // 圆环图数据
      state.pieData.status = Array.isArray(res.operationStatusDistribution) ? res.operationStatusDistribution : [];
      state.pieData.area = Array.isArray(res.areaDistribution) ? res.areaDistribution : [];

      // 柱状图数据：不同城中村考核得分
      const scoreList = Array.isArray(res.assessmentScoreByVillage) ? res.assessmentScoreByVillage : [];
      state.barData.x = scoreList.map(item => item.name || '');
      state.barData.series = scoreList.map(item => toNumber(item.value));
    } else {
      console.error('接口返回数据格式异常', res);
    }
  } catch (error) {
    console.error('请求城中村仪表盘数据失败:', error);
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
    <!-- 左侧卡片区域：五个指标卡片，网格布局（3列） -->
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

    <!-- 基础柱状图：不同城中村考核得分对比 -->
    <Bar
      style="flex: 1 !important;"
      title="不同城中村考核得分对比"
      :x-data="state.barData.x"
      :series-data="[{ name: '考核得分', data: state.barData.series }]"
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
