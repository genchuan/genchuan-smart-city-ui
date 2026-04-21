<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElSelect, ElOption } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import lineChart from '#/genchuan-components/stats/lineChartClick.vue';
import {
  getTreatMgmtChart,
  getTreatMgmtDistribution,
} from '#/api/genchuan/educationTeaching/studentMgmt/medicalCare/treatMgmt/data.js';

const loading = ref(true);
const chartData = ref({});      // 卡片 + 折线图
const distributionData = ref({}); // 饼图数据

// ========== 卡片数据 ==========
const cardList = computed(() => {
  const total = chartData.value.totalTreatCount || 0;
  const pending = chartData.value.pendingAuditCount || 0;
  const finished = chartData.value.finishedTreatCount || 0;
  const outpatient = chartData.value.outpatientCount || 0;
  const emergency = chartData.value.emergencyCount || 0;
  const other = chartData.value.otherCount || 0;
  return [
    { title: '总就诊次数', value: total, color: '#409EFF', status: 'total' },
    { title: '待审核预约数', value: pending, color: '#E6A23C', status: 'pending' },
    { title: '已完成就诊数', value: finished, color: '#67C23A', status: 'finished' },
    { title: '门诊就诊数', value: outpatient, color: '#909399', status: 'outpatient' },
    { title: '急诊就诊数', value: emergency, color: '#F56C6C', status: 'emergency' },
    { title: '其他就诊数', value: other, color: '#909399', status: 'other' },
  ];
});

// ========== 折线图数据（近一周就诊趋势） ==========
const lineData = computed(() => {
  const trend = chartData.value.recentWeekTreatTrend || [];
  return {
    xAxis: trend.map(item => item.date),
    series: [{ name: '就诊次数', data: trend.map(item => item.count) }],
  };
});

// ========== 饼图配置（支持切换：就诊类型分布 / 年级分布） ==========
const pieOptions = computed(() => [
  {
    title: '就诊类型分布',
    type: 'treatType',
    getData: () => {
      const dist = distributionData.value.treatTypeDistribution || [];
      return dist.map(item => ({ name: item.name, value: item.value }));
    },
  },
  {
    title: '就诊学生年级分布',
    type: 'grade',
    getData: () => {
      const dist = distributionData.value.gradeDistribution || [];
      return dist.map(item => ({ name: item.name, value: item.value }));
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
  if (currentType === 'treatType') {
    emit('pieSelect', { field: 'treatType', value: item.name });
  } else if (currentType === 'grade') {
    emit('pieSelect', { field: 'grade', value: item.name });
  }
};

const handleLineClick = (params) => {
  emit('lineSelect', { field: 'date', value: params.xValue });
};

// ========== 加载数据 ==========
const loadData = async () => {
  loading.value = true;
  try {
    const [chartRes, distRes] = await Promise.allSettled([
      getTreatMgmtChart({}),
      getTreatMgmtDistribution({}),
    ]);
    if (chartRes.status === 'fulfilled') {
      chartData.value = chartRes.value;
    } else {
      chartData.value = {
        totalTreatCount: 86,
        pendingAuditCount: 12,
        finishedTreatCount: 74,
        outpatientCount: 62,
        emergencyCount: 18,
        otherCount: 6,
        recentWeekTreatTrend: [
          { date: '2025-03-25', count: 8 },
          { date: '2025-03-26', count: 12 },
          { date: '2025-03-27', count: 10 },
          { date: '2025-03-28', count: 9 },
          { date: '2025-03-29', count: 7 },
          { date: '2025-03-30', count: 5 },
          { date: '2025-03-31', count: 6 },
        ],
      };
    }
    if (distRes.status === 'fulfilled') {
      distributionData.value = distRes.value;
    } else {
      distributionData.value = {
        treatTypeDistribution: [
          { name: '门诊', value: 62 },
          { name: '急诊', value: 18 },
          { name: '其他', value: 6 },
        ],
        gradeDistribution: [
          { name: '高一', value: 25 },
          { name: '高二', value: 30 },
          { name: '高三', value: 31 },
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
      title="近一周就诊趋势"
      :x-data="lineData.xAxis"
      :series-data="lineData.series"
      y-name="就诊次数"
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
