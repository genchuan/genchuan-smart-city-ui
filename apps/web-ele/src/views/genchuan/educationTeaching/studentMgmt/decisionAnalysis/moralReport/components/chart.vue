<script setup>
import { ref, computed, onMounted } from 'vue';
import Indicator from '#/genchuan-components/stats/indicator.vue';
import Bar from '#/genchuan-components/stats/bar.vue';
import {
  getMoralReportChart,
  getMoralReportScoreRank,
} from '#/api/genchuan/educationTeaching/studentMgmt/decisionAnalysis/moralReport/data.js';

const loading = ref(true);
const chartData = ref({});
const rankData = ref([]);

// 卡片数据（6个）
const cardList = computed(() => {
  const total = chartData.value.totalMoralCount || 0;
  const avg = chartData.value.avgScore || 0;
  const max = chartData.value.maxScore || 0;
  const min = chartData.value.minScore || 0;
  const good = chartData.value.goodPersonCount || 0;
  const civilized = chartData.value.civilizedBehaviorCount || 0;
  return [
    { title: '总德育评比记录数', value: total, color: '#409EFF', status: 'total' },
    { title: '平均德育得分', value: avg, color: '#67C23A', suffix: '分', status: 'avg' },
    { title: '最高德育得分', value: max, color: '#E6A23C', suffix: '分', status: 'max' },
    { title: '最低德育得分', value: min, color: '#F56C6C', suffix: '分', status: 'min' },
    { title: '好人好事记录数', value: good, color: '#909399', status: 'good' },
    { title: '文明行为记录数', value: civilized, color: '#909399', status: 'civilized' },
  ];
});

// 柱状图数据（班级德育得分排名）
const barData = computed(() => {
  return {
    xData: rankData.value.map(item => item.className),
    seriesData: [{ name: '德育得分', data: rankData.value.map(item => item.score) }],
  };
});

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    const [chartRes, rankRes] = await Promise.allSettled([
      getMoralReportChart({ timeScale: '月', statStartTime: '2026-01-01 00:00:00', statEndTime: '2026-01-31 23:59:59' }),
      getMoralReportScoreRank({ timeScale: '月', statStartTime: '2026-01-01 00:00:00', statEndTime: '2026-01-31 23:59:59' }),
    ]);

    if (chartRes.status === 'fulfilled') {
      chartData.value = chartRes.value;
    } else {
      chartData.value = {
        totalMoralCount: 110,
        avgScore: 90.2,
        maxScore: 99.0,
        minScore: 70.0,
        goodPersonCount: 45,
        civilizedBehaviorCount: 65,
      };
    }

    if (rankRes.status === 'fulfilled') {
      rankData.value = rankRes.value;
    } else {
      rankData.value = [
        { className: '高一(1)班', score: 95.5, rank: 1 },
        { className: '高一(3)班', score: 93.2, rank: 2 },
        { className: '高一(2)班', score: 90.8, rank: 3 },
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
      title="班级德育得分排名"
      :x-data="barData.xData"
      :series-data="barData.seriesData"
      y-name="德育得分"
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
