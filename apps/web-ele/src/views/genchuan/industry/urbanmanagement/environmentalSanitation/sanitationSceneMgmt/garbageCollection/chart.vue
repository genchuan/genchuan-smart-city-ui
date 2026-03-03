<script setup>
import { reactive, onMounted } from 'vue';
import {
  getGarbageCollectionStats,
  getGarbageTypeCircle,
  getPlanStatusCircle,
  getAreaDistributionCircle,
  getAreaCompletionRateColumn
} from '#/api/genchuan/industry/urbanmanagement/environmentalSanitation/sanitationSceneMgmt/garbageCollection/data.js';
import Indicator from '#/components/stats/indicator.vue';
import Pie from '#/components/stats/pie.vue';
import Bar from '#/components/stats/bar.vue';

// 响应式状态
const state = reactive({
  // 卡片数据（接口返回对象）
  cardList: [
    { title: '总计划数', value: 0, color: '#409EFF' },
    { title: '执行中计划数', value: 0, color: '#c8ce13' },
    { title: '已完成计划数', value: 0, color: '#67C23A' },
    { title: '异常计划数', value: 0, color: '#F56C6C' },
  ],
  // 饼图数据（接口直接返回数组）
  pieData: {
    type: [],        // 垃圾类型占比
    status: [],      // 计划状态占比
    area: [],        // 区域分布占比
  },
  // 柱状图数据（接口直接返回数组）
  barData: {
    x: [],           // 区域名称数组
    series: [],      // 完成率数值数组
  },
});

// ----- 卡片数据（原逻辑，接口返回对象）-----
const fetchStats = async () => {
  try {
    const data = await getGarbageCollectionStats();
    if (data) {
      state.cardList[0].value = data.totalCount ?? 0;
      state.cardList[1].value = data.executingCount ?? 0;
      state.cardList[2].value = data.completedCount ?? 0;
      state.cardList[3].value = data.abnormalCount ?? 0;
    }
  } catch (error) {
    console.error('【卡片接口】请求失败:', error);
  }
};

// ----- 通用处理函数：处理直接返回数组的饼图数据 -----
const handlePieArray = (data, chartName, targetKey) => {
  if (Array.isArray(data)) {
    const formatted = data.map(item => ({
      name: item.name,
      value: Number(item.value) || 0,
    }));
    // 根据 targetKey 更新对应的 pieData 字段
    if (targetKey === 'type') state.pieData.type = formatted;
    else if (targetKey === 'status') state.pieData.status = formatted;
    else if (targetKey === 'area') state.pieData.area = formatted;
  } else {
    console.warn(`【${chartName}】返回的数据不是数组:`, data);
  }
};

// ----- 垃圾类型占比饼图 -----
const fetchGarbageTypeCircle = async () => {
  try {
    const res = await getGarbageTypeCircle(); // 直接返回数组
    handlePieArray(res, '垃圾类型饼图', 'type');
  } catch (error) {
    console.error('【垃圾类型饼图】请求失败:', error);
    if (error.response) console.error('错误详情:', error.response.data);
  }
};

// ----- 计划状态占比饼图 -----
const fetchPlanStatusCircle = async () => {
  try {
    const res = await getPlanStatusCircle(); // 直接返回数组
    handlePieArray(res, '计划状态饼图', 'status');
  } catch (error) {
    console.error('【计划状态饼图】请求失败:', error);
    if (error.response) console.error('错误详情:', error.response.data);
  }
};

// ----- 区域分布占比饼图 -----
const fetchAreaDistributionCircle = async () => {
  try {
    const res = await getAreaDistributionCircle(); // 直接返回数组
    handlePieArray(res, '区域分布饼图', 'area');
  } catch (error) {
    console.error('【区域分布饼图】请求失败:', error);
    if (error.response) console.error('错误详情:', error.response.data);
  }
};

// ----- 区域完成率柱状图 -----
const fetchAreaCompletionRateColumn = async () => {
  try {
    const res = await getAreaCompletionRateColumn(); // 直接返回数组
    if (Array.isArray(res)) {
      const x = [];
      const series = [];
      res.forEach(item => {
        x.push(item.areaName);
        // 处理 completionRate，可能是 "25%" 或 25
        let rate;
        if (typeof item.completionRate === 'string') {
          rate = parseFloat(item.completionRate) || 0;
        } else {
          rate = Number(item.completionRate) || 0;
        }
        series.push(rate);
      });
      state.barData.x = x;
      state.barData.series = series;
    } else {
      console.warn('【区域完成率柱状图】返回的数据不是数组:', res);
    }
  } catch (error) {
    console.error('【区域完成率柱状图】请求失败:', error);
    if (error.response) console.error('错误详情:', error.response.data);
  }
};

// 组件挂载后并行请求所有数据
onMounted(() => {
  fetchStats();                         // 卡片
  fetchGarbageTypeCircle();              // 垃圾类型饼图
  fetchPlanStatusCircle();               // 计划状态饼图
  fetchAreaDistributionCircle();         // 区域分布饼图
  fetchAreaCompletionRateColumn();       // 区域完成率柱状图
});
</script>

<template>
  <div class="chart-box">
    <!-- 卡片区域 -->
    <div class="box-left" style="flex: 1 !important;">
      <Indicator
        class="left-card"
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
      />
    </div>

    <!-- 垃圾类型占比饼图 -->
    <Pie
      style="flex: 1 !important;"
      title-text="收运品类占比"
      :data="state.pieData.type"
    />

    <!-- 计划状态占比饼图 -->
    <Pie
      style="flex: 1 !important;"
      title-text="计划状态占比"
      :data="state.pieData.status"
    />

    <!-- 区域分布占比饼图 -->
    <Pie
      style="flex: 1 !important;"
      title-text="区域分布占比"
      :data="state.pieData.area"
    />

    <!-- 区域完成率柱状图 -->
    <Bar
      style="flex: 1 !important;"
      title="不同区域收运完成率对比"
      :x-data="state.barData.x"
      :series-data="[{ name: '完成率', data: state.barData.series }]"
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
