<script setup>
import {ref, computed, onMounted, watch} from 'vue';
import {ElRadioGroup, ElRadioButton} from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import {
  getDormCompareChart,
  getDormCompareScoreRank,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/dormMgmt/dormCompare/data.js';

const loading = ref(true);
const overviewData = ref({});
const rankData = ref({});

const cycleOptions = ['周', '月', '学期'];
const currentCycle = ref('周');

const cardList = computed(() => {
  const total = overviewData.value.totalCompare || 0;
  const avg = overviewData.value.avgScore || 0;
  const high = overviewData.value.highScore || 0;
  const low = overviewData.value.lowScore || 0;
  return [
    {title: '总评比记录数', value: total, color: '#409EFF', status: 'total'},
    {title: '平均得分', value: avg, color: '#67C23A', status: 'avg', suffix: '分'},
    {title: '最高得分', value: high, color: '#E6A23C', status: 'high', suffix: '分'},
    {title: '最低得分', value: low, color: '#F56C6C', status: 'low', suffix: '分'},
  ];
});

const barData = computed(() => {
  if (rankData.value.labels && rankData.value.data) {
    return {
      xData: rankData.value.labels,
      seriesData: [{name: '得分', data: rankData.value.data}],
    };
  }
  const stats = overviewData.value.dormStats || [];
  const sorted = [...stats].sort((a, b) => b.score - a.score);
  return {
    xData: sorted.map(item => item.dormNum),
    seriesData: [{name: '得分', data: sorted.map(item => item.score)}],
  };
});

// ========== 核心修改：所有点击改为派发自定义事件 ==========
const handleCardClick = (cardInfo) => {
  // 卡片点击不进行列表筛选，直接返回（如需筛选可扩展）
  // 保持原逻辑不触发列表筛选
  return;
};

const handleBarClick = (dormNum) => {
  window.dispatchEvent(new CustomEvent('dorm-compare-chart-filter', {
    detail: {type: 'dormNum', value: dormNum}
  }));
};

const loadData = async () => {
  loading.value = true;
  try {
    const params = {cycle: currentCycle.value};
    const [chartRes, rankRes] = await Promise.allSettled([
      getDormCompareChart(params),
      getDormCompareScoreRank(params),
    ]);
    if (chartRes.status === 'fulfilled') overviewData.value = chartRes.value;
    else {
      console.warn('得分看板接口失败，使用模拟数据');
      overviewData.value = {
        totalCompare: 86,
        avgScore: 85.2,
        highScore: 98.5,
        lowScore: 62.0,
        dormStats: [
          {dormNum: '302', score: 95.5, rank: 1},
          {dormNum: '301', score: 92.0, rank: 2},
          {dormNum: '201', score: 90.5, rank: 3},
          {dormNum: '202', score: 88.0, rank: 4},
          {dormNum: '101', score: 85.5, rank: 5},
        ],
      };
    }
    if (rankRes.status === 'fulfilled') rankData.value = rankRes.value;
    else {
      rankData.value = {
        labels: ['302', '301', '201', '202', '101'],
        data: [95.5, 92.0, 90.5, 88.0, 85.5],
      };
    }
  } catch (error) {
    console.error('加载图表数据失败', error);
  } finally {
    loading.value = false;
  }
};

watch(currentCycle, (newCycle) => {
  loadData();
  // 派发周期筛选事件，通知列表组件
  window.dispatchEvent(new CustomEvent('dorm-compare-chart-filter', {
    detail: { type: 'cycle', value: newCycle }
  }));
});
onMounted(() => {
  loadData();
});
</script>

<template>
  <div v-loading="loading" class="chart-box">
    <div class="cycle-radio">
      <el-radio-group v-model="currentCycle">
        <el-radio-button v-for="cycle in cycleOptions" :key="cycle" :label="cycle">
          {{ cycle }}
        </el-radio-button>
      </el-radio-group>
    </div>

    <div class="box-left">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>

    <Bar
      style="flex: 1 !important;"
      title="宿舍得分排名"
      :x-data="barData.xData"
      :series-data="barData.seriesData"
      y-name="得分"
      @bar-click="handleBarClick"
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
  position: relative;

  .cycle-radio {
    position: absolute;
    top: 8px;
    right: 10px;
    z-index: 10;
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
