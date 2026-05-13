<script setup>
import {ref, computed, onMounted} from 'vue';
import {ElSelect, ElOption} from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import lineChart from '#/genchuan-components/stats/lineChartClick.vue';
import {
  getBedMgmtChart,
  getBedDistribution,
  getBedIndex,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/dormMgmt/bedMgmt/data.js';

const loading = ref(true);
const overviewData = ref({});
const distributionData = ref({});
const indexData = ref({});

const cardList = computed(() => {
  const total = overviewData.value.totalBed || 0;
  const used = overviewData.value.usedBed || 0;
  const unused = overviewData.value.unusedBed || 0;
  return [
    {title: '总床位数', value: total, color: '#409EFF', status: 'total'},
    {title: '已用床位数', value: used, color: '#67C23A', status: 'used'},
    {title: '空余床位数', value: unused, color: '#F56C6C', status: 'unused'},
  ];
});

const pieData = computed(() => {
  const labels = distributionData.value.labels || [];
  const data = distributionData.value.data || [];
  return labels.map((label, idx) => ({name: label, value: data[idx] || 0}));
});

const lineData = computed(() => {
  const trend = indexData.value.trendList || [];
  return {
    xAxis: trend.map(item => item.date),
    series: [
      {name: '分配次数', data: trend.map(item => item.assign)},
      {name: '调整次数', data: trend.map(item => item.adjust)},
    ],
  };
});

// ========== 核心修改：所有点击改为派发自定义事件 ==========
const handleCardClick = (cardInfo) => {
  let filterType = null;
  let filterValue = null;
  switch (cardInfo.status) {
    case 'used':
      filterType = 'status';
      filterValue = '已分配';
      break;
    case 'unused':
      filterType = 'status';
      filterValue = '未分配';
      break;
    case 'total':
    default:
      return;
  }
  window.dispatchEvent(new CustomEvent('bed-chart-filter', {
    detail: {type: filterType, value: filterValue}
  }));
};

const handlePieClick = (item) => {
  window.dispatchEvent(new CustomEvent('bed-chart-filter', {
    detail: {type: 'building', value: item.name}
  }));
};

const handleLineClick = (params) => {
  // params.xValue 为日期字符串，如 "2025-03-25"
  const date = params.xValue || params.name;
  if (date) {
    // 将单日筛选转换为该天的日期范围
    window.dispatchEvent(new CustomEvent('bed-chart-filter', {
      detail: {type: 'createTime', value: [date, date]}
    }));
  }
};

// 数据加载函数（保持不变）
const loadData = async () => {
  loading.value = true;
  try {
    const [chartRes, distRes, indexRes] = await Promise.allSettled([
      getBedMgmtChart({}),
      getBedDistribution({}),
      getBedIndex({}),
    ]);
    if (chartRes.status === 'fulfilled') overviewData.value = chartRes.value;
    else overviewData.value = {
      totalBed: 1200,
      usedBed: 980,
      unusedBed: 220,
      usageRate: 81.67,
      buildingStats: [
        {building: '1号楼', total: 400, used: 350, unused: 50},
        {building: '2号楼', total: 400, used: 320, unused: 80},
        {building: '3号楼', total: 400, used: 310, unused: 90},
      ],
    };
    if (distRes.status === 'fulfilled') distributionData.value = distRes.value;
    else distributionData.value = {
      labels: ['1号楼', '2号楼', '3号楼'],
      data: [33.33, 33.33, 33.34]
    };
    if (indexRes.status === 'fulfilled') indexData.value = indexRes.value;
    else indexData.value = {
      assignCount: 120,
      adjustCount: 15,
      newAssignCount: 8,
      newAdjustCount: 2,
      trendList: [
        {date: '2025-03-25', assign: 15, adjust: 2},
        {date: '2025-03-26', assign: 18, adjust: 1},
        {date: '2025-03-27', assign: 20, adjust: 3},
        {date: '2025-03-28', assign: 16, adjust: 2},
        {date: '2025-03-29', assign: 22, adjust: 3},
        {date: '2025-03-30', assign: 21, adjust: 2},
        {date: '2025-03-31', assign: 8, adjust: 2},
      ],
    };
  } catch (error) {
    console.error('加载图表数据失败', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div v-loading="loading" class="chart-box">
    <div class="chart-box-left">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>
    <Pie
      style="flex: 1 !important;"
      title-text="楼栋床位占比"
      :data="pieData"
      @pie-click="handlePieClick"
    />
    <lineChart
      style="flex: 1.5 !important;"
      title="近7天操作趋势"
      :x-data="lineData.xAxis"
      :series-data="lineData.series"
      y-name="次数"
      @line-click="handleLineClick"
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

  .chart-box-left {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 280px;
    max-width: 320px;
    margin: 0;
  }
}
</style>
