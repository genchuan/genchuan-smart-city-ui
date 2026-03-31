<script setup>
import { reactive, onMounted } from 'vue';
import { getStandardCategoryStatistics } from '#/api/genchuan/dataHub/evaluation/system/standards/index.js';
import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [],
  systemPieData: [],
  statusPieData: [],
  gradePieData: [],
  barXData: [],
  barSeriesData: [],
});

const fetchOverview = async () => {
  try {
    const data = await getStandardCategoryStatistics();
    // 卡片数据：总分类数、启用分类数、标准项总数
    state.cardList = [
      { title: '总分类数', value: data.cardData?.totalCategoryCount || 0, color: '#13ce66' },
      { title: '启用分类数', value: data.cardData?.enabledCategoryCount || 0, color: '#4ECDC4' },
      { title: '标准项总数', value: data.cardData?.totalItemCount || 0, color: '#FFC107' },
    ];
    // 适用体系占比饼图（如有需要可启用）
    state.systemPieData = (data.systemPieChart || []).map(item => ({ name: item.name, value: item.value }));
    // 状态占比饼图
    state.statusPieData = (data.statusPieChart || []).map(item => ({ name: item.name, value: item.value }));
    // 标准等级分布饼图
    state.gradePieData = (data.gradePieChart || []).map(item => ({ name: item.name, value: item.value }));
    // 各分类标准项数量对比柱状图
    const barData = data.categoryBarChart || [];
    state.barXData = barData.map(item => item.categoryName);
    state.barSeriesData = [{ data: barData.map(item => item.itemCount) }];
  } catch (error) {
    console.error('获取统计数据失败', error);
    state.cardList = [];
  }
};

defineExpose({ refreshOverview: fetchOverview });
onMounted(fetchOverview);
</script>

<template>
  <div class="park-chart-box ">
    <div class="chart-box-left">
      <Card class="left-card" v-for="item in state.cardList" :key="item.title" v-bind="item" />
    </div>
    <!-- 适用体系占比饼图（如需显示可取消注释） -->
    <!-- <Circle width="340px" height="330px" title-text="适用体系占比" :data="state.systemPieData" /> -->
    <Circle width="340px" height="330px" title-text="状态占比" :data="state.statusPieData" :colors="['#67C23A', '#E6A23C', '#F56C6C']" />
    <Circle width="340px" height="330px" title-text="标准等级分布" :data="state.gradePieData" />
    <Columnar height="330px" title="各分类标准项数量对比" :x-data="state.barXData" :series-data="state.barSeriesData" />
  </div>
</template>

