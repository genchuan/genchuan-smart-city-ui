<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElSelect, ElOption } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import lineChart from '#/genchuan-components/stats/lineChartClick.vue';
import {
  getRepairMgmtChart,
  getRepairMgmtCount,
} from '#/api/genchuan/educationTeaching/studentMgmt/dormMgmt/repairMgmt/data.js';

const loading = ref(true);
const chartData = ref({});      // 卡片 + 折线图 + 类型分布
const countData = ref({});      // 完成率统计（用于饼图完成率）

// ========== 卡片数据 ==========
const cardList = computed(() => {
  const total = chartData.value.totalRepairCount || 0;
  const pending = chartData.value.pendingDispatchCount || 0;
  const repairing = chartData.value.repairingCount || 0;
  const repaired = chartData.value.repairedCount || 0;
  const accepted = chartData.value.acceptedCount || 0;
  return [
    { title: '总报修次数', value: total, color: '#409EFF', status: 'total' },
    { title: '待派单', value: pending, color: '#E6A23C', status: 'pending' },
    { title: '维修中', value: repairing, color: '#F56C6C', status: 'repairing' },
    { title: '已维修', value: repaired, color: '#67C23A', status: 'repaired' },
    { title: '已验收', value: accepted, color: '#909399', status: 'accepted' },
  ];
});

// ========== 折线图数据（每日报修趋势） ==========
const lineData = computed(() => {
  const trend = chartData.value.dailyTrend || [];
  return {
    xAxis: trend.map(item => item.date),
    series: [{ name: '报修次数', data: trend.map(item => item.count) }],
  };
});

// ========== 饼图配置（支持切换：报修类型分布 / 维修完成率） ==========
const pieOptions = computed(() => [
  {
    title: '报修类型分布',
    type: 'typeDistribution',
    getData: () => {
      const distribution = chartData.value.typeDistribution || [];
      return distribution.map(item => ({ name: item.type, value: item.count }));
    },
  },
  {
    title: '维修完成率',
    type: 'finishRate',
    getData: () => {
      const typeStats = countData.value.typeStatistics || [];
      return typeStats.map(item => ({ name: item.type, value: item.finishRate * 100 }));
    },
  },
]);

const activePieIndex = ref(0);
const currentPieData = computed(() => pieOptions.value[activePieIndex.value]?.getData() || []);
const currentPieTitle = computed(() => pieOptions.value[activePieIndex.value]?.title || '');

const handlePieChange = (index) => {
  activePieIndex.value = index;
};

// ========== 事件发射 ==========
const emit = defineEmits(['cardSelect', 'pieSelect', 'lineSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handlePieClick = (item) => {
  const currentType = pieOptions.value[activePieIndex.value]?.type;
  if (currentType === 'typeDistribution') {
    emit('pieSelect', { field: 'repairType', value: item.name });
  }
  // 完成率饼图不做钻取
};

const handleLineClick = (params) => {
  emit('lineSelect', { field: 'date', value: params.xValue });
};

// ========== 加载数据 ==========
const loadData = async () => {
  loading.value = true;
  try {
    const [chartRes, countRes] = await Promise.allSettled([
      getRepairMgmtChart({}),
      getRepairMgmtCount({}),
    ]);
    if (chartRes.status === 'fulfilled') {
      chartData.value = chartRes.value;
    } else {
      chartData.value = {
        totalRepairCount: 86,
        pendingDispatchCount: 8,
        repairingCount: 5,
        repairedCount: 12,
        acceptedCount: 61,
        dailyTrend: [
          { date: '2025-03-25', count: 15 },
          { date: '2025-03-26', count: 18 },
          { date: '2025-03-27', count: 20 },
          { date: '2025-03-28', count: 16 },
          { date: '2025-03-29', count: 22 },
          { date: '2025-03-30', count: 21 },
          { date: '2025-03-31', count: 8 },
        ],
        typeDistribution: [
          { type: '水电', count: 52 },
          { type: '家具', count: 24 },
          { type: '其他', count: 10 },
        ],
      };
    }
    if (countRes.status === 'fulfilled') {
      countData.value = countRes.value;
    } else {
      countData.value = {
        typeStatistics: [
          { type: '水电', total: 52, finished: 50, finishRate: 0.9615 },
          { type: '家具', total: 24, finished: 22, finishRate: 0.9167 },
          { type: '其他', total: 10, finished: 9, finishRate: 0.9 },
        ],
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
    <div class="box-left-m">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>

    <lineChart
      style="flex: 1.5 !important;"
      title="每日报修趋势"
      :x-data="lineData.xAxis"
      :series-data="lineData.series"
      y-name="报修次数"
      @line-click="handleLineClick"
    />

    <div class="chart-area">
      <div class="chart-select-wrapper">
        <el-select v-model="activePieIndex" size="small" @change="handlePieChange">
          <el-option v-for="(opt, idx) in pieOptions" :key="idx" :label="opt.title" :value="idx" />
        </el-select>
      </div>
      <Pie :title-text="currentPieTitle" :data="currentPieData" @pie-click="handlePieClick" />
    </div>
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

  .chart-area {
    position: relative;
    flex: 1;
    min-width: 280px;
    height: 100%;
  }

  .chart-select-wrapper {
    position: absolute;
    top: 8px;
    right: 10px;
    z-index: 10;
  }
}
</style>
