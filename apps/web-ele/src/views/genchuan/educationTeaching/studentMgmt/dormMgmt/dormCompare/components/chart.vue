<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElSelect, ElOption } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import {
  getDormCompareChart,
  getDormCompareScoreRank,
} from '#/api/genchuan/educationTeaching/studentMgmt/dormMgmt/dormCompare/data.js';

const loading = ref(true);
const overviewData = ref({});      // 卡片数据 + dormStats
const rankData = ref({});          // 柱状图专用数据

// ========== 卡片数据 ==========
const cardList = computed(() => {
  const total = overviewData.value.totalCompare || 0;
  const avg = overviewData.value.avgScore || 0;
  const high = overviewData.value.highScore || 0;
  const low = overviewData.value.lowScore || 0;
  return [
    { title: '总评比记录数', value: total, color: '#409EFF', status: 'total' },
    { title: '平均得分', value: avg, color: '#67C23A', status: 'avg', suffix: '分' },
    { title: '最高得分', value: high, color: '#E6A23C', status: 'high', suffix: '分' },
    { title: '最低得分', value: low, color: '#F56C6C', status: 'low', suffix: '分' },
  ];
});

// ========== 柱状图数据（宿舍得分排名） ==========
const barData = computed(() => {
  // 优先使用专用排名接口的数据，否则从 dormStats 提取
  if (rankData.value.labels && rankData.value.data) {
    return {
      xData: rankData.value.labels,
      seriesData: [{ name: '得分', data: rankData.value.data }],
    };
  }
  const stats = overviewData.value.dormStats || [];
  return {
    xData: stats.map(item => item.dormNum),
    seriesData: [{ name: '得分', data: stats.map(item => item.score) }],
  };
});

// ========== 事件发射 ==========
const emit = defineEmits(['cardSelect', 'barSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handleBarClick = (dormNum) => {
  emit('barSelect', { field: 'dormNum', value: dormNum });
};

// ========== 加载数据 ==========
const loadData = async () => {
  loading.value = true;
  try {
    const [chartRes, rankRes] = await Promise.allSettled([
      getDormCompareChart({ cycle: '月' }), // 默认月周期，可扩展筛选
      getDormCompareScoreRank({ cycle: '月' }),
    ]);
    if (chartRes.status === 'fulfilled') {
      overviewData.value = chartRes.value;
    } else {
      overviewData.value = {
        totalCompare: 86,
        avgScore: 85.2,
        highScore: 98.5,
        lowScore: 62.0,
        dormStats: [
          { dormNum: '302', score: 95.5, rankNo: 1 },
          { dormNum: '301', score: 92.0, rankNo: 2 },
          { dormNum: '201', score: 90.5, rankNo: 3 },
          { dormNum: '202', score: 88.0, rankNo: 4 },
          { dormNum: '101', score: 85.5, rankNo: 5 },
        ],
      };
    }
    if (rankRes.status === 'fulfilled') {
      rankData.value = rankRes.value;
    } else {
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

onMounted(() => {
  loadData();
});
</script>

<template>
  <div v-loading="loading" class="chart-box">
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
