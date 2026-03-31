<script setup>
import { reactive, onMounted, defineExpose } from 'vue';
import { getOverview } from '#/api/genchuan/dataHub/evaluation/system/indicators/index.js';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [],
  typePieData: [],      // 适用对象类型占比
  indexPieData: [],     // 指标类型占比
  barXData: [],
  barSeriesData: [],
});

const fetchOverview = async () => {
  try {
    const data = await getOverview();
    console.log('overview response:', data);

    // 卡片数据（添加颜色，与评价主体风格一致）
    const cardData = data.cardData || {};
    state.cardList = [
      { title: '总体系数', value: cardData.totalSystemCount || 0, color: '#13ce66' },
      { title: '启用体系数', value: cardData.enableSystemCount || 0, color: '#4ECDC4' },
      { title: '总指标数', value: cardData.totalItemCount || 0, color: '#FF6B6B' },
      { title: '版本数', value: cardData.versionCounts?.length || 0, color: '#FFC107' },
    ];

    // 适用对象类型饼图
    state.typePieData = (data.objectTypePieChart || []).map(item => ({
      name: item.name || '未知',
      value: item.value || 0,
    }));

    // 指标类型饼图
    state.indexPieData = (data.indexTypePieChart || []).map(item => ({
      name: item.name || '未知',
      value: item.value || 0,
    }));

    // 各体系指标项数量柱状图
    const barData = data.systemItemCountBarChart || [];
    state.barXData = barData.map(item => item.systemName || '未知');
    state.barSeriesData = [
      {
        // name: '指标数量',
        data: barData.map(item => item.itemCount || 0),
      },
    ];
  } catch (error) {
    console.error('获取概览数据失败', error);
    clearState();
  }
};

// 清空状态（避免界面显示异常）
const clearState = () => {
  state.cardList = [];
  state.typePieData = [];
  state.indexPieData = [];
  state.barXData = [];
  state.barSeriesData = [];
};

// 暴露刷新方法，命名与评价主体组件保持一致
defineExpose({
  refreshOverview: fetchOverview,
});

onMounted(() => {
  fetchOverview();
});
</script>

<template>
  <div class="park-chart-box park-subject-chart">
    <div class="chart-box-left">
      <Card
        class="left-card"
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
      />
    </div>
    <Circle
      width="340px"
      height="330px"
      title-text="适用对象类型占比"
      :data="state.typePieData"
    />
    <Circle
      width="340px"
      height="330px"
      title-text="指标类型占比"
      :data="state.indexPieData"
      :colors="['#67C23A', '#E6A23C', '#F56C6C', '#909399']"
    />
    <Columnar
      height="330px"
      title="各体系指标项数量对比"
      :x-data="state.barXData"
      :series-data="state.barSeriesData"
    />
  </div>
</template>

<style lang="scss">
.park-subject-chart {
  .chart-box-left {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    max-width: 100%;
    height: 100%;
    .left-card {
      height: 159px !important;
    }
  }
  .subject-columnar {
    min-width: 200px !important;
  }
}
</style>
