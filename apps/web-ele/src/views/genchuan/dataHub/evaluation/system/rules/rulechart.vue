<script setup>
import { defineExpose, onMounted, reactive } from 'vue';

import { getRuleStatistics } from '#/api/genchuan/dataHub/evaluation/system/rules/index.js';
import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [],
  pieData2: [],      // 适用对象类型占比
  pieData3: [],      // 状态占比
  barXData: [],
  barSeriesData: [],
});

const fetchOverview = async () => {
  try {
    const data = await getRuleStatistics();
    // 卡片数据映射
    state.cardList = [
      {
        title: '总分类数',
        value: data.cardData?.totalCategoryCount || 0,
        color: '#13ce66',
      },
      {
        title: '规则项总数',
        value: data.cardData?.totalRuleCount || 0,
        color: '#4ECDC4',
      },
      {
        title: '启用规则数',
        value: data.cardData?.enabledRuleCount || 0,
        color: '#FFC107',
      },
    ];

    // 适用对象类型占比饼图（直接使用接口返回数据）
    state.pieData2 = (data.applyObjectTypePieChart || []).map(item => ({
      name: item.name,
      value: item.value,
    }));

    // 状态占比饼图
    state.pieData3 = (data.statusPieChart || []).map(item => ({
      name: item.name,
      value: item.value,
    }));

    // 各分类规则项数量对比柱状图
    const barData = data.categoryBarChart || [];
    state.barXData = barData.map(item => item.categoryName);
    state.barSeriesData = [
      {
        data: barData.map(item => item.ruleCount),
      },
    ];
  } catch (error) {
    console.error('获取规则统计失败', error);
    clearState();
  }
};

const clearState = () => {
  state.cardList = [];
  state.pieData2 = [];
  state.pieData3 = [];
  state.barXData = [];
  state.barSeriesData = [];
};

defineExpose({
  refreshOverview: fetchOverview,
});

onMounted(() => {
  fetchOverview();
});
</script>

<template>
  <div class="park-chart-box ">
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
      :data="state.pieData2"
    />
    <Circle
      width="340px"
      height="330px"
      title-text="状态占比"
      :data="state.pieData3"
      :colors="['#67C23A', '#E6A23C', '#F56C6C']"
    />
    <Columnar
      class="district-columnar"
      height="330px"
      title="各分类规则项数量对比"
      :x-data="state.barXData"
      :series-data="state.barSeriesData"
    />
  </div>
</template>

