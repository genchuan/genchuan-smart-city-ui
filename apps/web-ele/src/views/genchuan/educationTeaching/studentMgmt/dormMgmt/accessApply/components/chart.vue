<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElSelect, ElOption } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import lineChart from '#/genchuan-components/stats/lineChartClick.vue';
import {
  getAccessApplyChart,
  getAccessApplyCount,
} from '#/api/genchuan/educationTeaching/studentMgmt/dormMgmt/accessApply/data.js';

const loading = ref(true);
const chartData = ref({});      // 卡片 + 折线图 + 类型分布
const classStats = ref({});     // 班级统计

// ========== 卡片数据 ==========
const cardList = computed(() => {
  const total = chartData.value.totalApplyCount || 0;
  const pending = chartData.value.pendingAuditCount || 0;
  const passed = chartData.value.passedCount || 0;
  return [
    { title: '总申请次数', value: total, color: '#409EFF', status: 'total' },
    { title: '待审核申请数', value: pending, color: '#E6A23C', status: 'pending' },
    { title: '已通过申请数', value: passed, color: '#67C23A', status: 'passed' },
  ];
});

// ========== 折线图数据（每日申请趋势） ==========
const lineData = computed(() => {
  const trend = chartData.value.dailyTrend || [];
  return {
    xAxis: trend.map(item => item.date),
    series: [{ name: '申请次数', data: trend.map(item => item.count) }],
  };
});

// ========== 柱状图配置（支持切换：各班级申请次数 / 申请类型分布） ==========
const barOptions = computed(() => [
  {
    title: '各班级申请次数',
    type: 'classCount',
    getData: () => {
      const stats = classStats.value.classStatistics || [];
      return {
        xData: stats.map(item => item.className),
        seriesData: [{ name: '申请次数', data: stats.map(item => item.totalCount) }],
      };
    },
    yName: '申请次数',
  },
  {
    title: '申请类型分布',
    type: 'typeDistribution',
    getData: () => {
      const distribution = chartData.value.typeDistribution || [];
      return {
        xData: distribution.map(item => item.type),
        seriesData: [{ name: '数量', data: distribution.map(item => item.count) }],
      };
    },
    yName: '数量',
  },
]);

const activeBarIndex = ref(0);
const currentBarData = computed(() => barOptions.value[activeBarIndex.value]?.getData() || { xData: [], seriesData: [] });
const currentBarTitle = computed(() => barOptions.value[activeBarIndex.value]?.title || '');
const currentYName = computed(() => barOptions.value[activeBarIndex.value]?.yName || '');

const handleBarChange = (index) => {
  activeBarIndex.value = index;
};

// ========== 事件发射 ==========
const emit = defineEmits(['cardSelect', 'barSelect', 'lineSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handleBarClick = (name) => {
  const currentType = barOptions.value[activeBarIndex.value]?.type;
  if (currentType === 'classCount') {
    emit('barSelect', { field: 'className', value: name });
  } else if (currentType === 'typeDistribution') {
    emit('barSelect', { field: 'applyType', value: name });
  }
};

const handleLineClick = (params) => {
  emit('lineSelect', { field: 'date', value: params.xValue });
};

// ========== 加载数据 ==========
const loadData = async () => {
  loading.value = true;
  try {
    const [chartRes, classRes] = await Promise.allSettled([
      getAccessApplyChart({}),
      getAccessApplyCount({}),
    ]);
    if (chartRes.status === 'fulfilled') {
      chartData.value = chartRes.value;
    } else {
      chartData.value = {
        totalApplyCount: 128,
        pendingAuditCount: 12,
        passedCount: 116,
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
          { type: '应急出入', count: 98 },
          { type: '其他', count: 30 },
        ],
      };
    }
    if (classRes.status === 'fulfilled') {
      classStats.value = classRes.value;
    } else {
      classStats.value = {
        classStatistics: [
          { className: '高一1班', emergencyCount: 12, otherCount: 3, totalCount: 15 },
          { className: '高一2班', emergencyCount: 8, otherCount: 2, totalCount: 10 },
          { className: '高一3班', emergencyCount: 5, otherCount: 1, totalCount: 6 },
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
    <!-- 卡片区 -->
    <div class="chart-box-left">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>

    <lineChart
      style="flex: 1 !important;"
      title="每日申请趋势"
      :x-data="lineData.xAxis"
      :series-data="lineData.series"
      y-name="申请次数"
      @line-click="handleLineClick"
    />

    <div class="chart-area">
      <div class="chart-select-wrapper">
        <el-select v-model="activeBarIndex" size="small" @change="handleBarChange">
          <el-option v-for="(opt, idx) in barOptions" :key="idx" :label="opt.title" :value="idx" />
        </el-select>
      </div>
      <Bar
        :title="currentBarTitle"
        :x-data="currentBarData.xData"
        :series-data="currentBarData.seriesData"
        :y-name="currentYName"
        @bar-click="handleBarClick"
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

  .chart-box-left {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 280px;
    max-width: 320px;
    margin: 0;
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
