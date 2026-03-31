<script setup>
import { reactive, onMounted, defineExpose } from 'vue';
import { getOverview } from '#/api/genchuan/dataHub/evaluation/system/subjects/index.js';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [],
  typePieData: [],
  statusPieData: [],
  memberCountBarXData: [],
  memberCountBarSeriesData: [],
});

const fetchOverview = async () => {
  try {
    const data = await getOverview(); // 直接获取数据
    console.log('overview response:', data);

    // 卡片数据
    const cardData = data.cardData || {};
    state.cardList = [
      { title: '总主体数', value: cardData.totalCount || 0, color: '#13ce66' },
      { title: '人工主体数', value: cardData.manualSubjectCount || 0, color: '#4ECDC4' },
      { title: '系统主体数', value: cardData.systemSubjectCount || 0, color: '#FF6B6B' },
      { title: '启用主体数', value: cardData.enabledSubjectCount || 0, color: '#FFC107' },
    ];

    // 主体类型饼图
    state.typePieData = (data.typePieChart || []).map(item => ({
      name: item.name || '未知',
      value: item.value || 0,
    }));

    // 状态饼图
    state.statusPieData = (data.statusPieChart || []).map(item => ({
      name: item.name || '未知',
      value: item.value || 0,
    }));

    // 成员数量柱状图
    const memberCountBar = data.memberCountBarChart || [];
    state.memberCountBarXData = memberCountBar.map(item => item.subjectName || '未知');
    state.memberCountBarSeriesData = [
      {
        // name: '成员数量',
        data: memberCountBar.map(item => item.memberCount || 0),
      },
    ];
  } catch (error) {
    console.error('获取概览数据失败', error);
    // 清空数据避免报错
    state.cardList = [];
    state.typePieData = [];
    state.statusPieData = [];
    state.memberCountBarXData = [];
    state.memberCountBarSeriesData = [];
  }
};

// 暴露刷新方法给父组件
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
      title-text="主体类型占比"
      :data="state.typePieData"
    />
    <Circle
      width="340px"
      height="330px"
      title-text="状态占比"
      :data="state.statusPieData"
      :colors="['#67C23A', '#E6A23C', '#F56C6C']"
    />
    <Columnar
      height="330px"
      title="各主体成员数量对比"
      :x-data="state.memberCountBarXData"
      :series-data="state.memberCountBarSeriesData"
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
