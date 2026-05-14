<script setup>
import {ref, computed, onMounted} from 'vue';
import {ElSelect, ElOption, ElDatePicker} from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import lineChart from '#/genchuan-components/stats/lineChartClick.vue';
import {
  getAccessApplyChart,
  getAccessApplyCount,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/dormMgmt/accessApply/data.js';

const loading = ref(true);
const chartData = ref({});
const classStats = ref({});

const timeRange = ref([]);

const getDefaultTimeRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 30);
  return [start, end];
};

const formatDateTime = (date, isEnd = false) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const time = isEnd ? '23:59:59' : '00:00:00';
  return `${year}-${month}-${day} ${time}`;
};

const getTimeRangeParam = () => {
  if (timeRange.value && timeRange.value.length === 2) {
    const startStr = formatDateTime(timeRange.value[0], false);
    const endStr = formatDateTime(timeRange.value[1], true);
    return `${startStr},${endStr}`;
  }
  const [defaultStart, defaultEnd] = getDefaultTimeRange();
  return `${formatDateTime(defaultStart, false)},${formatDateTime(defaultEnd, true)}`;
};

const handleDateRangeChange = () => {
  loadData();
};

const cardList = computed(() => {
  const total = chartData.value.totalApplyCount || 0;
  const pending = chartData.value.pendingAuditCount || 0;
  const passed = chartData.value.passedCount || 0;
  return [
    {title: '总申请次数', value: total, color: '#409EFF', status: 'total'},
    {title: '待审核申请数', value: pending, color: '#E6A23C', status: 'pending'},
    {title: '已通过申请数', value: passed, color: '#67C23A', status: 'passed'},
  ];
});

const lineData = computed(() => {
  const trend = chartData.value.dailyTrend || [];
  return {
    xAxis: trend.map(item => item.date),
    series: [{name: '申请次数', data: trend.map(item => item.count)}],
  };
});

const barOptions = computed(() => [
  {
    title: '各班级申请次数',
    type: 'classCount',
    getData: () => {
      const stats = classStats.value.classStatistics || [];
      return {
        xData: stats.map(item => item.className),
        seriesData: [{name: '申请次数', data: stats.map(item => item.totalCount)}],
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
        seriesData: [{name: '数量', data: distribution.map(item => item.count)}],
      };
    },
    yName: '数量',
  },
]);

const activeBarIndex = ref(0);
const currentBarData = computed(() => barOptions.value[activeBarIndex.value]?.getData() || {
  xData: [],
  seriesData: []
});
const currentBarTitle = computed(() => barOptions.value[activeBarIndex.value]?.title || '');
const currentYName = computed(() => barOptions.value[activeBarIndex.value]?.yName || '');
const handleBarChange = (index) => {
  activeBarIndex.value = index;
};

// ========== 核心修改：所有点击改为派发自定义事件 ==========
const handleCardClick = (cardInfo) => {
  let filterType = null;
  let filterValue = null;
  switch (cardInfo.status) {
    case 'pending':
      filterType = 'status';
      filterValue = '待审核';
      break;
    case 'passed':
      filterType = 'status';
      filterValue = '已通过';
      break;
    case 'total':
    default:
      return;
  }
  window.dispatchEvent(new CustomEvent('access-apply-chart-filter', {
    detail: {type: filterType, value: filterValue}
  }));
};

const handleBarClick = (name) => {
  const currentType = barOptions.value[activeBarIndex.value]?.type;
  if (currentType === 'classCount') {
    window.dispatchEvent(new CustomEvent('access-apply-chart-filter', {
      detail: {type: 'className', value: name}
    }));
  } else if (currentType === 'typeDistribution') {
    window.dispatchEvent(new CustomEvent('access-apply-chart-filter', {
      detail: {type: 'applyType', value: name}
    }));
  }
};

const handleLineClick = (params) => {
  // params 可能包含 xValue（日期），如 "2025-03-25"
  const date = params.xValue || params.name;
  if (date) {
    // 将单日筛选转换为该天的日期范围
    window.dispatchEvent(new CustomEvent('access-apply-chart-filter', {
      detail: {type: 'createTime', value: [date, date]}
    }));
  }
};

// 数据加载函数（保持不变）
const loadData = async () => {
  loading.value = true;
  try {
    const timeRangeParam = getTimeRangeParam();
    const [chartRes, classRes] = await Promise.allSettled([
      getAccessApplyChart({timeRange: timeRangeParam}),
      getAccessApplyCount({timeRange: timeRangeParam}),
    ]);
    if (chartRes.status === 'fulfilled') chartData.value = chartRes.value;
    else {
      console.warn('看板接口失败，使用模拟数据', chartRes.reason);
      chartData.value = {
        totalApplyCount: 128,
        pendingAuditCount: 12,
        passedCount: 116,
        dailyTrend: [
          {date: '2025-03-25', count: 15},
          {date: '2025-03-26', count: 18},
          {date: '2025-03-27', count: 20},
          {date: '2025-03-28', count: 16},
          {date: '2025-03-29', count: 22},
          {date: '2025-03-30', count: 21},
          {date: '2025-03-31', count: 8},
        ],
        typeDistribution: [
          {type: '应急出入', count: 98},
          {type: '其他', count: 30},
        ],
      };
    }
    if (classRes.status === 'fulfilled') classStats.value = classRes.value;
    else {
      console.warn('班级统计接口失败，使用模拟数据', classRes.reason);
      classStats.value = {
        classStatistics: [
          {className: '高一1班', emergencyCount: 12, otherCount: 3, totalCount: 15},
          {className: '高一2班', emergencyCount: 8, otherCount: 2, totalCount: 10},
          {className: '高一3班', emergencyCount: 5, otherCount: 1, totalCount: 6},
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
  timeRange.value = getDefaultTimeRange();
  loadData();
});
</script>

<template>
  <div v-loading="loading" class="chart-box">
    <div class="chart-box-left">
      <Indicator class="left-card" v-for="item in cardList" :key="item.title" v-bind="item"
                 @click="handleCardClick"/>
    </div>

    <div class="line-chart-container" style="flex: 1 !important; position: relative;">
      <div class="date-range-wrapper">
        <el-date-picker
          v-model="timeRange"
          type="daterange"
          range-separator="-"
          start-placeholder="起始"
          end-placeholder="结束"
          size="small"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :shortcuts="[
            { text: '近7天', value: () => { const end = new Date(); const start = new Date(); start.setDate(end.getDate() - 7); return [start, end]; } },
            { text: '近30天', value: () => { const end = new Date(); const start = new Date(); start.setDate(end.getDate() - 30); return [start, end]; } },
            { text: '近90天', value: () => { const end = new Date(); const start = new Date(); start.setDate(end.getDate() - 90); return [start, end]; } }
          ]"
          @change="handleDateRangeChange"
        />
      </div>
      <lineChart
        title="每日申请趋势"
        :x-data="lineData.xAxis"
        :series-data="lineData.series"
        y-name="申请次数"
        @line-click="handleLineClick"
      />
    </div>

    <div class="chart-area">
      <div class="chart-select-wrapper">
        <el-select v-model="activeBarIndex" size="small" @change="handleBarChange">
          <el-option v-for="(opt, idx) in barOptions" :key="idx" :label="opt.title" :value="idx"/>
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

  .line-chart-container {
    position: relative;
    flex: 1;
    min-width: 280px;
    margin-left: 12px;
  }

  .date-range-wrapper {
    position: absolute;
    top: 8px;
    right: 10px;
    z-index: 10;
  }

  .chart-area {
    position: relative;
    flex: 1;
    min-width: 280px;
    height: 100%;
    margin-left: 12px;
  }

  .chart-select-wrapper {
    position: absolute;
    top: 8px;
    right: 10px;
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
