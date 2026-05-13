<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElSelect, ElOption, ElDatePicker } from 'element-plus';
import Bar from '#/genchuan-components/stats/barClick.vue';
import LineChart from '#/genchuan-components/stats/lineChartClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import {
  getMoralActivityCount,
  getMoralActivityChart,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/moralEdu/moralActivity/data.js';

const loading = ref(true);
const chartData = ref({});
const trendData = ref({});
const overviewData = ref({});

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

// ========== 柱状图配置 ==========
const barOptions = computed(() => [
  {
    title: '各类型活动数量',
    type: 'activityCount',
    getData: () => {
      const typeList = chartData.value.typeList || [];
      const activityCountList = chartData.value.activityCountList || [];
      return {xData: typeList, seriesData: [{name: '活动数量', data: activityCountList}]};
    },
    yName: '活动数量',
  },
  {
    title: '各类型参与人数',
    type: 'joinCount',
    getData: () => {
      const typeList = chartData.value.typeList || [];
      const joinCountList = chartData.value.joinCountList || [];
      return {xData: typeList, seriesData: [{name: '参与人数', data: joinCountList}]};
    },
    yName: '参与人数',
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

// ========== 折线图配置 ==========
const lineOptions = computed(() => [
  {
    title: '月度活动数量趋势',
    type: 'monthCount',
    getData: () => {
      const monthTrend = trendData.value.monthTrend || [];
      return {
        xData: monthTrend.map(item => item.date),
        seriesData: [{name: '活动数量', data: monthTrend.map(item => item.totalCount)}]
      };
    },
    yName: '活动数量',
  },
  {
    title: '月度参与人数趋势',
    type: 'joinCount',
    getData: () => {
      const joinTrend = trendData.value.joinTrend || [];
      return {
        xData: joinTrend.map(item => item.date),
        seriesData: [{name: '参与人数', data: joinTrend.map(item => item.totalCount)}]
      };
    },
    yName: '参与人数',
  },
]);

const activeLineIndex = ref(0);
const currentLineData = computed(() => lineOptions.value[activeLineIndex.value]?.getData() || {
  xData: [],
  seriesData: []
});
const currentLineTitle = computed(() => lineOptions.value[activeLineIndex.value]?.title || '');
const currentLineYName = computed(() => lineOptions.value[activeLineIndex.value]?.yName || '');

const handleLineChange = (index) => {
  activeLineIndex.value = index;
};

// ========== 饼图配置 ==========
const pieOptions = computed(() => [
  {
    title: '活动状态分布',
    type: 'status',
    getData: () => {
      const status = overviewData.value.statusCount || {ongoing: 0, ended: 0, unpublished: 0};
      return [
        {name: '未发布', value: status.unpublished || 0},
        {name: '进行中', value: status.ongoing || 0},
        {name: '已结束', value: status.ended || 0},
      ];
    },
  },
  {
    title: '活动类型分布',
    type: 'activityType',
    getData: () => {
      const typeCount = overviewData.value.activityTypeCount || {
        party_league: 0,
        volunteer: 0,
        other: 0
      };
      return [
        {name: '党团活动', value: typeCount.party_league || 0},
        {name: '志愿活动', value: typeCount.volunteer || 0},
        {name: '其他', value: typeCount.other || 0},
      ];
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
const handleBarClick = (typeName) => {
  window.dispatchEvent(new CustomEvent('moral-activity-chart-filter', {
    detail: {type: 'activityType', value: typeName}
  }));
};

const handleLineClick = (month) => {
  // 将月份（如 "2025-03"）转换为该月的日期范围
  const [year, monthNum] = month.split('-');
  const startDate = `${year}-${monthNum}-01`;
  const lastDay = new Date(parseInt(year), parseInt(monthNum), 0).getDate();
  const endDate = `${year}-${monthNum}-${lastDay}`;
  window.dispatchEvent(new CustomEvent('moral-activity-chart-filter', {
    detail: {type: 'createTime', value: [startDate, endDate]}
  }));
};

const handlePieClick = (item) => {
  const currentType = pieOptions.value[activePieIndex.value]?.type;
  if (currentType === 'status') {
    window.dispatchEvent(new CustomEvent('moral-activity-chart-filter', {
      detail: {type: 'status', value: item.name}
    }));
  } else if (currentType === 'activityType') {
    window.dispatchEvent(new CustomEvent('moral-activity-chart-filter', {
      detail: {type: 'activityType', value: item.name}
    }));
  }
};

// 数据加载函数（保持不变）
const loadActivityCount = async () => {
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
    const res = await getMoralActivityCount(params);
    chartData.value = res;
  } catch (error) {
    console.warn('活动数量统计接口失败，使用模拟数据', error);
    chartData.value = {
      typeList: ['党团活动', '志愿活动', '其他'],
      activityCountList: [5, 7, 3],
      joinCountList: [200, 280, 50]
    };
  }
};

const loadActivityChart = async () => {
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
    const res = await getMoralActivityChart(params);
    overviewData.value = res;
    trendData.value = res;
  } catch (error) {
    console.warn('图表总览接口失败，使用模拟数据', error);
    const mockData = {
      statusCount: {ongoing: 3, ended: 5, unpublished: 2},
      activityTypeCount: {party_league: 4, volunteer: 3, other: 3},
      monthTrend: [{date: '2025-03', totalCount: 2}, {
        date: '2025-04',
        totalCount: 1
      }, {date: '2025-06', totalCount: 1}],
      joinTrend: [{date: '2025-03', totalCount: 1}, {
        date: '2025-04',
        totalCount: 1
      }, {date: '2025-05', totalCount: 1}]
    };
    overviewData.value = mockData;
    trendData.value = mockData;
  }
};

const handleDateRangeChange = async () => {
  if (dateRange.value && dateRange.value.length === 2) {
    loading.value = true;
    try {
      await Promise.all([loadActivityCount(), loadActivityChart()]);
    } finally {
      loading.value = false;
    }
  }
};

const loadData = async () => {
  loading.value = true;
  try {
    const [countRes, chartRes] = await Promise.allSettled([getMoralActivityCount({}), getMoralActivityChart({})]);
    if (countRes.status === 'fulfilled') chartData.value = countRes.value;
    else chartData.value = {
      typeList: ['党团活动', '志愿活动', '其他'],
      activityCountList: [5, 7, 3],
      joinCountList: [200, 280, 50]
    };
    if (chartRes.status === 'fulfilled') {
      overviewData.value = chartRes.value;
      trendData.value = chartRes.value;
    } else {
      const mockData = {
        statusCount: {ongoing: 3, ended: 5, unpublished: 2},
        activityTypeCount: {party_league: 4, volunteer: 3, other: 3},
        monthTrend: [{date: '2025-03', totalCount: 2}, {
          date: '2025-04',
          totalCount: 1
        }, {date: '2025-06', totalCount: 1}],
        joinTrend: [{date: '2025-03', totalCount: 1}, {
          date: '2025-04',
          totalCount: 1
        }, {date: '2025-05', totalCount: 1}]
      };
      overviewData.value = mockData;
      trendData.value = mockData;
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
    <!-- 饼图区域 -->
    <div class="chart-area">
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
      <Pie :title-text="currentPieTitle" :data="currentPieData" @pie-click="handlePieClick"/>
    </div>

    <!-- 柱状图区域 -->
    <div class="chart-area bar-chart-container">
      <div class="chart-select-wrapper">
        <el-select v-model="activeBarIndex" size="small" @change="handleBarChange">
          <el-option v-for="(opt, idx) in barOptions" :key="idx" :label="opt.title" :value="idx"/>
        </el-select>
      </div>
      <Bar :title="currentBarTitle" :x-data="currentBarData.xData"
           :series-data="currentBarData.seriesData" :y-name="currentYName"
           @bar-click="handleBarClick"/>
    </div>

    <!-- 折线图区域 -->
    <div class="chart-area">
      <div class="chart-select-wrapper">
        <el-select v-model="activeLineIndex" size="small" @change="handleLineChange">
          <el-option v-for="(opt, idx) in lineOptions" :key="idx" :label="opt.title" :value="idx"/>
        </el-select>
      </div>
      <LineChart :title="currentLineTitle" :x-data="currentLineData.xData"
                 :series-data="currentLineData.seriesData" :y-name="currentLineYName"
                 @line-click="handleLineClick"/>
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

  .bar-chart-container {
    position: relative;
  }

  .date-range-wrapper {
    position: absolute;
    top: 38px;
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
