<script setup>
import { ref, computed, onMounted } from 'vue';
import Indicator from '#/genchuan-components/stats/indicator.vue';
import Bar from '#/genchuan-components/stats/bar.vue';
import {
  getDormCompareReportChart,
  getDormCompareReportScoreRank,
} from '#/api/genchuan/educationTeaching/studentMgmt/decisionAnalysis/dormCompareReport/data.js';

const loading = ref(true);
const chartData = ref({});
const rankData = ref([]);

// 卡片数据（6个）
const cardList = computed(() => {
  const total = chartData.value.totalCompareCount || 0;
  const avg = chartData.value.avgScore || 0;
  const max = chartData.value.maxScore || 0;
  const min = chartData.value.minScore || 0;
  const civilized = chartData.value.civilizedDormCount || 0;
  const normal = chartData.value.normalDormCount || 0;
  return [
    { title: '总宿舍评比记录数', value: total, color: '#409EFF', status: 'total' },
    { title: '平均宿舍评比得分', value: avg, color: '#67C23A', suffix: '分', status: 'avg' },
    { title: '最高宿舍评比得分', value: max, color: '#E6A23C', suffix: '分', status: 'max' },
    { title: '最低宿舍评比得分', value: min, color: '#F56C6C', suffix: '分', status: 'min' },
    { title: '文明宿舍数量', value: civilized, color: '#909399', status: 'civilized' },
    { title: '普通宿舍数量', value: normal, color: '#909399', status: 'normal' },
  ];
});

// 柱状图数据（宿舍得分排名）
const barData = computed(() => {
  return {
    xData: rankData.value.map(item => item.dormNum),
    seriesData: [{ name: '评比得分', data: rankData.value.map(item => item.score) }],
  };
});

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    const [chartRes, rankRes] = await Promise.allSettled([
      getDormCompareReportChart({ timeScale: '月', statStartTime: '2026-01-01 00:00:00', statEndTime: '2026-01-31 23:59:59' }),
      getDormCompareReportScoreRank({ timeScale: '月', statStartTime: '2026-01-01 00:00:00', statEndTime: '2026-01-31 23:59:59' }),
    ]);

    if (chartRes.status === 'fulfilled') {
      chartData.value = chartRes.value;
    } else {
      chartData.value = {
        totalCompareCount: 30,
        avgScore: 89.6,
        maxScore: 98.5,
        minScore: 72.0,
        civilizedDormCount: 8,
        normalDormCount: 22,
      };
    }

    if (rankRes.status === 'fulfilled') {
      rankData.value = rankRes.value;
    } else {
      rankData.value = [
        { dormNum: '1号楼101', score: 98.5, rank: 1 },
        { dormNum: '2号楼202', score: 96.2, rank: 2 },
        { dormNum: '1号楼102', score: 94.8, rank: 3 },
      ];
    }
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
    <div class="box-left-m">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
      />
    </div>
    <Bar
      style="flex: 1.5 !important;"
      title="宿舍得分排名"
      :x-data="barData.xData"
      :series-data="barData.seriesData"
      y-name="评比得分"
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
}
</style>
