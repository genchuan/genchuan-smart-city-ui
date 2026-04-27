<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElSelect, ElOption } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import lineChart from '#/genchuan-components/stats/lineChartClick.vue';
import {
  getRegisterMgmtChart,
  getRegisterMgmtEnrollCount,
} from '#/api/genchuan/educationTeaching/studentMgmt/enrollMgmt/registerMgmt/data.js';

const loading = ref(true);
const chartData = ref({});          // 卡片 + 折线图
const enrollData = ref({});         // 专业报名录取数据

// ========== 卡片数据 ==========
const cardList = computed(() => {
  const total = chartData.value.totalApplyCount || 0;
  const pending = chartData.value.pendingAuditCount || 0;
  const admitted = chartData.value.admittedCount || 0;
  const confirmed = chartData.value.confirmedCount || 0;
  return [
    { title: '总报名人数', value: total, color: '#409EFF', status: 'total' },
    { title: '待审核人数', value: pending, color: '#E6A23C', status: 'pending' },
    { title: '已录取人数', value: admitted, color: '#67C23A', status: 'admitted' },
    { title: '已确认人数', value: confirmed, color: '#909399', status: 'confirmed' },
  ];
});

// ========== 折线图数据（近一周报名趋势） ==========
const lineData = computed(() => {
  const trend = chartData.value.recentWeekApplyTrend || [];
  return {
    xAxis: trend.map(item => item.date),
    series: [{ name: '报名人数', data: trend.map(item => item.count) }],
  };
});

// ========== 柱状图数据（各专业报名/录取人数） ==========
const barData = computed(() => {
  const data = enrollData.value.majorEnrollData || [];
  return {
    xData: data.map(item => item.major),
    seriesData: [
      { name: '报名人数', data: data.map(item => item.applyCount) },
      { name: '录取人数', data: data.map(item => item.admitCount) },
    ],
  };
});

// ========== 图表切换选项 ==========
const chartOptions = computed(() => [
  {
    type: 'bar',
    title: '各专业报名/录取人数',
    xData: barData.value.xData,
    seriesData: barData.value.seriesData,
    yName: '人数',
  },
  {
    type: 'line',
    title: '近一周报名趋势',
    xData: lineData.value.xAxis,
    seriesData: lineData.value.series,
    yName: '报名人数',
  },
]);

const activeChartIndex = ref(0);
const currentChart = computed(() => chartOptions.value[activeChartIndex.value] || chartOptions.value[0]);

const handleChartChange = (index) => {
  activeChartIndex.value = index;
};

// ========== 事件发射 ==========
const emit = defineEmits(['cardSelect', 'barSelect', 'lineSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handleBarClick = (majorName) => {
  emit('barSelect', { field: 'major', value: majorName });
};

const handleLineClick = (params) => {
  emit('lineSelect', { field: 'date', value: params.xValue });
};

// ========== 加载数据 ==========
const loadData = async () => {
  loading.value = true;
  try {
    const [chartRes, enrollRes] = await Promise.allSettled([
      getRegisterMgmtChart({}),
      getRegisterMgmtEnrollCount({}),
    ]);
    if (chartRes.status === 'fulfilled') {
      chartData.value = chartRes.value;
    } else {
      chartData.value = {
        totalApplyCount: 156,
        pendingAuditCount: 22,
        admittedCount: 134,
        confirmedCount: 118,
        recentWeekApplyTrend: [
          { date: '2025-03-25', count: 12 },
          { date: '2025-03-26', count: 18 },
          { date: '2025-03-27', count: 22 },
          { date: '2025-03-28', count: 16 },
          { date: '2025-03-29', count: 14 },
          { date: '2025-03-30', count: 10 },
          { date: '2025-03-31', count: 8 },
        ],
      };
    }
    if (enrollRes.status === 'fulfilled') {
      enrollData.value = enrollRes.value;
    } else {
      enrollData.value = {
        majorEnrollData: [
          { major: '计算机应用技术', applyCount: 45, admitCount: 40 },
          { major: '电子商务', applyCount: 32, admitCount: 28 },
          { major: '机电一体化', applyCount: 28, admitCount: 25 },
          { major: '会计电算化', applyCount: 25, admitCount: 22 },
          { major: '学前教育', applyCount: 26, admitCount: 19 },
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
    <div class="box-left">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>

    <div class="chart-area">
      <div class="chart-select-wrapper">
        <el-select
          v-model="activeChartIndex"
          size="small"
          @change="handleChartChange"
        >
          <el-option
            v-for="(opt, idx) in chartOptions"
            :key="idx"
            :label="opt.title"
            :value="idx"
          />
        </el-select>
      </div>
      <Bar
        v-if="currentChart.type === 'bar'"
        style="flex: 1 !important;"
        :title="currentChart.title"
        :x-data="currentChart.xData"
        :series-data="currentChart.seriesData"
        :y-name="currentChart.yName"
        @bar-click="handleBarClick"
      />
      <lineChart
        v-else
        style="flex: 1 !important;"
        :title="currentChart.title"
        :x-data="currentChart.xData"
        :series-data="currentChart.seriesData"
        :y-name="currentChart.yName"
        @line-click="handleLineClick"
      />
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

  .box-left {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
    min-width: 280px;
    max-width: 320px;
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
