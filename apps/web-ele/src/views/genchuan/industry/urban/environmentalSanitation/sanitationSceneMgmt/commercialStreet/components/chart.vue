<script setup>
import { reactive, onMounted } from 'vue';
import { getCommercialStreetChartAll } from '#/api/genchuan/industry/urban/environmentalSanitation/sanitationSceneMgmt/commercialStreet/data.js';
import Indicator from '#/genchuan-components/stats/indicator.vue';
import Pie from '#/genchuan-components/stats/pie.vue';
import Bar from '#/genchuan-components/stats/bar.vue';

const state = reactive({
  loading: false,
  // 四个核心卡片
  cardList: [],
  // 两个圆环图
  pieData: {
    area: [],   // 区域分布占比
    status: [], // 运营状态占比
  },
  // 基础柱状图：不同商业街问题处置时长对比
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
    const res = await getCommercialStreetChartAll();

    // 根据接口返回格式判断（请求库已解包，res 直接是 data 对象）
    if (res && typeof res === 'object') {
      // 卡片数据映射
      state.cardList = [
        { title: '总商业街数', value: toNumber(res.totalStreetCount), color: '#409EFF' },
        { title: '保洁覆盖达标数', value: toNumber(res.cleaningCoverageMetCount), color: '#67C23A' },
        { title: '设施完好数', value: toNumber(res.facilityIntactCount), color: '#E6A23C' },
        { title: '收运完成数', value: toNumber(res.collectionCompletedCount), color: '#F56C6C' },
      ];

      // 圆环图数据
      state.pieData.area = Array.isArray(res.areaDistribution) ? res.areaDistribution : [];
      state.pieData.status = Array.isArray(res.operationStatusDistribution) ? res.operationStatusDistribution : [];

      // 柱状图数据：不同商业街问题处置时长
      const durationList = Array.isArray(res.problemDisposalDurationByStreet) ? res.problemDisposalDurationByStreet : [];
      state.barData.x = durationList.map(item => item.name || '');
      state.barData.series = durationList.map(item => toNumber(item.value));
    } else {
      console.error('接口返回数据格式异常', res);
    }
  } catch (error) {
    console.error('请求商业街仪表盘数据失败:', error);
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
    <!-- 左侧卡片区域：四个指标卡片，网格布局 -->
    <div class="box-left" style="flex: 1 !important;">
      <Indicator
        class="left-card"
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
      />
    </div>

    <!-- 区域分布占比圆环图 -->
    <Pie
      style="flex: 1 !important;"
      title-text="区域分布占比"
      :data="state.pieData.area"
    />

    <!-- 运营状态占比圆环图 -->
    <Pie
      style="flex: 1 !important;"
      title-text="运营状态占比"
      :data="state.pieData.status"
    />

    <!-- 基础柱状图：不同商业街问题处置时长对比 -->
    <Bar
      style="flex: 1 !important;"
      title="不同商业街问题处置时长对比"
      :x-data="state.barData.x"
      :series-data="[{ name: '处置时长(分钟)', data: state.barData.series }]"
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
