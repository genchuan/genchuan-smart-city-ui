<script setup>
import { reactive, onMounted } from 'vue';
import {
  getPublicToiletChartAll
} from '#/api/genchuan/industry/urbanmanagement/environmentalSanitation/sanitationSceneMgmt/publicToilet/data.js';
import Indicator from '#/components/stats/indicator.vue';
import Pie from '#/components/stats/pie.vue';
import Bar from '#/components/stats/bar.vue';

const state = reactive({
  loading: false,
  cardList: [],        // 卡片数据
  pieData: {           // 饼图数据
    status: [],
    area: [],
  },
  barData: {           // 柱状图数据
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
    const res = await getPublicToiletChartAll();
    console.log('接口原始响应:', res);

    // ✅ 直接判断是否有 card 字段（这是必要字段）
    if (res && typeof res === 'object' && res.card) {
      const { card, pie, cleaningQualifiedRateByArea } = res;

      // 卡片数据
      state.cardList = [
        { title: '总公厕数', value: toNumber(card?.totalToiletCount), color: '#409EFF' },
        { title: '正常运营数', value: toNumber(card?.normalOperationCount), color: '#67C23A' },
        { title: '保洁达标数', value: toNumber(card?.cleaningQualifiedCount), color: '#E6A23C' },
        { title: '无投诉数', value: toNumber(card?.noComplaintCount), color: '#F56C6C' },
      ];

      // 饼图数据
      state.pieData.status = Array.isArray(pie?.operationStatus) ? pie.operationStatus : [];
      state.pieData.area = Array.isArray(pie?.areaDistribution) ? pie.areaDistribution : [];

      // 柱状图数据
      const areaRates = Array.isArray(cleaningQualifiedRateByArea) ? cleaningQualifiedRateByArea : [];
      state.barData.x = areaRates.map(item => item.name || '');
      state.barData.series = areaRates.map(item => toNumber(item.value));
    } else {
      console.error('接口返回数据格式异常或缺少 card 字段', res);
    }
  } catch (error) {
    console.error('请求图表数据失败:', error);
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
    <!-- 卡片区域 -->
    <div class="box-left" style="flex: 1 !important;">
      <Indicator
        class="left-card"
        v-for="(item, index) in state.cardList"
        :key="index"
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

    <!-- 区域保洁达标率柱状图 -->
    <Bar
      style="flex: 1 !important;"
      title="不同区域保洁达标率对比"
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
