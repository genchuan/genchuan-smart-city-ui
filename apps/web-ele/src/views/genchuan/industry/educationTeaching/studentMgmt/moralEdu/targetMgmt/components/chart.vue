<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElSelect, ElOption, ElDatePicker } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import {
  getTargetMgmtChart,
  getTargetIndex,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/moralEdu/targetMgmt/data.js';

const loading = ref(true);
const overviewData = ref({});
const indexData = ref({});

const dateRange = ref([new Date('2024-01-01'), new Date('2026-12-31')]);

const formatLocalDateTime = (date) => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const cardList = computed(() => {
  const total = indexData.value.totalTargetCount || 0;
  const enabled = indexData.value.enabledTargetCount || 0;
  const warned = indexData.value.warnTargetCount || 0;
  const avg = indexData.value.avgScore || 0;
  return [
    {title: '指标总数', value: total, color: '#409EFF', status: 'total'},
    {title: '启用指标数', value: enabled, color: '#67C23A', status: 'enabled'},
    {title: '预警指标数', value: warned, color: '#F56C6C', status: 'warned'},
    {title: '平均得分', value: avg, color: '#E6A23C', status: 'avg', suffix: '分'},
  ];
});

const barOptions = computed(() => [
  {
    title: '评价人类型分布',
    type: 'evaluatorType',
    getData: () => {
      const data = overviewData.value.evaluatorTypeCount || {};
      const xData = ['教职工', '家长', '领导'];
      const seriesData = [{
        name: '指标数量',
        data: [data.teacher || 0, data.parent || 0, data.leader || 0]
      }];
      return {xData, seriesData};
    },
  },
  {
    title: '计分方式分布',
    type: 'scoreType',
    getData: () => {
      const data = overviewData.value.scoreTypeCount || {};
      const xData = ['累计赋分', '接口赋分'];
      const seriesData = [{name: '指标数量', data: [data['累计赋分'] || 0, data['接口赋分'] || 0]}];
      return {xData, seriesData};
    },
  },
]);

const activeBarIndex = ref(0);
const currentBarData = computed(() => barOptions.value[activeBarIndex.value]?.getData() || {
  xData: [],
  seriesData: []
});
const currentBarTitle = computed(() => barOptions.value[activeBarIndex.value]?.title || '');
const handleBarChange = (index) => {
  activeBarIndex.value = index;
};

const pieOptions = computed(() => [
  {
    title: '状态分布',
    type: 'status',
    getData: () => {
      const status = overviewData.value.statusCount || {disable: 0, enable: 0};
      return [
        {name: '未启用', value: status.disable || 0},
        {name: '已启用', value: status.enable || 0},
      ];
    },
  },
  {
    title: '指标得分分布',
    type: 'scoreDistribution',
    getData: () => {
      const distributionArray = overviewData.value.scoreDistribution || [];
      if (!distributionArray.length) return [];
      const distObj = distributionArray[0];
      return Object.entries(distObj).map(([range, count]) => ({name: range, value: count}));
    },
  },
]);

const activePieIndex = ref(0);
const currentPieData = computed(() => pieOptions.value[activePieIndex.value]?.getData() || []);
const currentPieTitle = computed(() => pieOptions.value[activePieIndex.value]?.title || '');
const handlePieChange = (index) => {
  activePieIndex.value = index;
};

// ========== 核心修改：所有点击改为派发自定义事件 ==========
// 卡片点击
const handleCardClick = (cardInfo) => {
  let filterType = null;
  let filterValue = null;
  switch (cardInfo.status) {
    case 'enabled':
      filterType = 'status';
      filterValue = '已启用';
      break;
    case 'warned':
      // 预警指标数 → 可能需要筛选预警相关，但列表中可能没有直接字段，简化处理
      // 此处暂不处理，保持与原有逻辑一致（原有代码未做筛选）
      return;
    case 'total':
    case 'avg':
    default:
      return;
  }
  if (filterType) {
    window.dispatchEvent(new CustomEvent('target-chart-filter', {
      detail: {type: filterType, value: filterValue}
    }));
  }
};

// 柱状图点击
const handleBarClickWrapper = (name) => {
  const currentType = barOptions.value[activeBarIndex.value]?.type;
  if (currentType === 'evaluatorType') {
    let value = name;
    if (name === '教职工') value = 'teacher';
    if (name === '家长') value = 'parent';
    if (name === '领导') value = 'leader';
    window.dispatchEvent(new CustomEvent('target-chart-filter', {
      detail: {type: 'evaluatorType', value}
    }));
  } else if (currentType === 'scoreType') {
    window.dispatchEvent(new CustomEvent('target-chart-filter', {
      detail: {type: 'scoreType', value: name}
    }));
  }
};

// 饼图点击
const handlePieClickWrapper = (item) => {
  const currentType = pieOptions.value[activePieIndex.value]?.type;
  if (currentType === 'status') {
    let status = '';
    if (item.name === '未启用') status = '未启用';
    if (item.name === '已启用') status = '已启用';
    if (status) {
      window.dispatchEvent(new CustomEvent('target-chart-filter', {
        detail: {type: 'status', value: status}
      }));
    }
  } else if (currentType === 'scoreDistribution') {
    // 得分分布点击不触发列表筛选（原有代码仅 emit('pieSelect')，列表未处理，可忽略）
    // 保留原有逻辑不处理
  }
};

// 数据加载函数（保持不变）
const loadChartData = async () => {
  try {
    const params = {};
    if (dateRange.value && dateRange.value.length === 2) {
      const startDate = dateRange.value[0];
      const endDate = dateRange.value[1];
      if (startDate) params.startTime = formatLocalDateTime(startDate);
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        params.endTime = formatLocalDateTime(endDateTime);
      }
    }
    const res = await getTargetMgmtChart(params);
    overviewData.value = res;
  } catch (error) {
    console.warn('图表总览接口失败，使用模拟数据', error);
    overviewData.value = {
      statusCount: {disable: 4, enable: 6},
      evaluatorTypeCount: {teacher: 5, parent: 2, leader: 3},
      scoreTypeCount: {"累计赋分": 8, "接口赋分": 2},
      scoreDistribution: [{"0-20": 1, "20-40": 2, "40-60": 3, "60-80": 2, "80-100": 2}]
    };
  }
};

const handleDateRangeChange = async () => {
  if (dateRange.value && dateRange.value.length === 2) {
    loading.value = true;
    try {
      await loadChartData();
    } finally {
      loading.value = false;
    }
  }
};

const loadData = async () => {
  loading.value = true;
  try {
    const [chartRes, indexRes] = await Promise.allSettled([
      getTargetMgmtChart({}),
      getTargetIndex()
    ]);
    if (chartRes.status === 'fulfilled') overviewData.value = chartRes.value;
    else overviewData.value = {
      statusCount: {disable: 4, enable: 6},
      evaluatorTypeCount: {teacher: 5, parent: 2, leader: 3},
      scoreTypeCount: {"累计赋分": 8, "接口赋分": 2},
      scoreDistribution: [{"0-20": 1, "20-40": 2, "40-60": 3, "60-80": 2, "80-100": 2}]
    };
    if (indexRes.status === 'fulfilled') indexData.value = indexRes.value;
    else indexData.value = {
      totalTargetCount: 10,
      enabledTargetCount: 8,
      warnTargetCount: 1,
      avgScore: 78.5
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
    <div class="box-left" style="flex: 1 !important;">
      <Indicator class="left-card" v-for="item in cardList" :key="item.title" v-bind="item"
                 @click="handleCardClick"/>
    </div>

    <div class="bar-chart-area bar-chart-container">
      <div class="chart-select-wrapper">
        <el-select v-model="activeBarIndex" size="small" @change="handleBarChange">
          <el-option v-for="(opt, idx) in barOptions" :key="idx" :label="opt.title" :value="idx"/>
        </el-select>
      </div>
      <Bar
        style="flex: 1 !important;"
        :title="currentBarTitle"
        :x-data="currentBarData.xData"
        :series-data="currentBarData.seriesData"
        y-name="指标数量"
        @bar-click="handleBarClickWrapper"
      />
    </div>

    <div class="pie-chart-area">
      <div class="chart-select-wrapper">
        <el-select v-model="activePieIndex" size="small" @change="handlePieChange">
          <el-option v-for="(opt, idx) in pieOptions" :key="idx" :label="opt.title" :value="idx"/>
        </el-select>
      </div>
      <div class="date-range-wrapper">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="-"
          start-placeholder="起始时间"
          end-placeholder="结束时间"
          size="small"
          :shortcuts="[
            { text: '近三个月', value: () => { const end = new Date(); const start = new Date(); start.setMonth(start.getMonth() - 3); return [start, end]; } },
            { text: '近半年', value: () => { const end = new Date(); const start = new Date(); start.setMonth(start.getMonth() - 6); return [start, end]; } },
            { text: '近一年', value: () => { const end = new Date(); const start = new Date(); start.setFullYear(start.getFullYear() - 1); return [start, end]; } }
          ]"
          @change="handleDateRangeChange"
        />
      </div>
      <Pie
        style="flex: 1 !important;"
        :title-text="currentPieTitle"
        :data="currentPieData"
        @pie-click="handlePieClickWrapper"
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

  .bar-chart-area,
  .pie-chart-area {
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

  .bar-chart-container {
    position: relative;
  }

  .date-range-wrapper {
    position: absolute;
    top: 8px;
    left: 10px;
    z-index: 10;
  }

  :deep(.el-date-editor) {
    --el-date-editor-width: 240px;

    .el-range__icon {
      margin-right: 2px;
    }

    .el-range-separator {
      padding: 0 4px;
    }

    .el-range__close-icon {
      margin-left: 2px;
    }
  }
}
</style>
