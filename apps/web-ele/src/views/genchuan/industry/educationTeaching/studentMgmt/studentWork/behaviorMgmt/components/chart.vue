<script setup>
import { reactive, onMounted, ref, computed } from 'vue';
import { ElMessage, ElSelect, ElOption, ElDatePicker } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import lineChart from '#/genchuan-components/stats/lineChartClick.vue';
import {
  getBehaviorMgmtChart,
  getAttendanceCount,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/studentWork/behaviorMgmt/data.js';

const loading = ref(true);
const overviewData = ref({});
const classData = ref([]);

// 时间范围选择器
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
  return `${year}-${month}-${day}T${time}`;
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
  loadChartData();
};

// 卡片列表
const cardList = computed(() => {
  const totalLeave = overviewData.value.totalLeaveCount || 0;
  const pending = overviewData.value.pendingAuditCount || 0;
  const abnormal = overviewData.value.attendanceAbnormalCount || 0;
  const synced = overviewData.value.syncCount || 0;
  return [
    {title: '请假总次数', value: totalLeave, color: '#409EFF', status: 'totalLeave'},
    {title: '待审批数', value: pending, color: '#E6A23C', status: 'pending'},
    {title: '考勤异常人数', value: abnormal, color: '#F56C6C', status: 'abnormal'},
    {title: '已同步数', value: synced, color: '#67C23A', status: 'synced'},
  ];
});

// 请假类型分布饼图
const leaveTypePieData = computed(() => {
  const distribution = overviewData.value.leaveTypeDistribution || [];
  return distribution.map(item => ({name: item.name, value: item.count}));
});

// 每日请假趋势
const dailyTrendXData = computed(() => {
  const trend = overviewData.value.dailyLeaveTrend || [];
  return trend.map(item => item.name);
});
const dailyTrendSeries = computed(() => [
  {name: '请假人数', data: (overviewData.value.dailyLeaveTrend || []).map(item => item.count)},
]);

// 班级分组柱状图数据
const classBarXData = computed(() => classData.value.map(item => item.className));
const classBarSeries = computed(() => [
  {name: '请假次数', data: classData.value.map(item => item.leaveCount)},
  {name: '考勤异常人数', data: classData.value.map(item => item.abnormalCount)},
]);

// 图表切换选项
const chartOptions = computed(() => [
  {
    type: 'line',
    title: '每日请假趋势',
    xData: dailyTrendXData.value,
    seriesData: dailyTrendSeries.value,
    yName: '请假人数',
  },
  {
    type: 'bar',
    title: '各班级请假次数与考勤异常人数对比',
    xData: classBarXData.value,
    seriesData: classBarSeries.value,
    yName: '数量',
  },
]);

const activeChartIndex = ref(0);
const currentChart = computed(() => chartOptions.value[activeChartIndex.value] || chartOptions.value[0]);

const handleChartChange = (index) => {
  activeChartIndex.value = index;
};

// ========== 核心修改：所有点击改为派发自定义事件 ==========
// 卡片点击：映射为筛选字段
const handleCardClick = (cardInfo) => {
  let filterType = null;
  let filterValue = null;
  switch (cardInfo.status) {
    case 'pending':   // 待审批数 → 筛选状态为“待审批”
      filterType = 'status';
      filterValue = '待审批';
      break;
    case 'synced':    // 已同步数 → 筛选考勤同步状态为“已同步”
      filterType = 'attendanceSync';
      filterValue = '已同步';
      break;
    case 'totalLeave':
    case 'abnormal':
    default:
      // 请假总次数和考勤异常人数不清除筛选，也不添加筛选
      return;
  }
  window.dispatchEvent(new CustomEvent('behavior-chart-filter', {
    detail: {type: filterType, value: filterValue}
  }));
};

// 饼图点击（请假类型）
const handlePieClick = (item) => {
  window.dispatchEvent(new CustomEvent('behavior-chart-filter', {
    detail: {type: 'leaveType', value: item.name}
  }));
};

// 柱状图点击（班级筛选）
const handleBarClick = (params) => {
  let className = null;
  if (typeof params === 'string') {
    className = params;
  } else if (params && typeof params === 'object') {
    className = params.name || params.className;
  }
  if (className) {
    window.dispatchEvent(new CustomEvent('behavior-chart-filter', {
      detail: {type: 'className', value: className}
    }));
  } else {
    console.warn('柱状图点击未能获取班级名称', params);
  }
};

// 折线图点击（日期筛选 - 按该日期筛选请假记录）
const handleTrendClick = (params) => {
  // params.name 是日期字符串，例如 "03-01"，可转换成完整日期格式再传给后端
  // 这里简单传递日期字符串，列表组件需处理 createTime 筛选
  window.dispatchEvent(new CustomEvent('behavior-chart-filter', {
    detail: {type: 'createTime', value: params.name}
  }));
};

// 数据加载函数（保持不变）
const loadChartData = async () => {
  loading.value = true;
  try {
    const timeRangeParam = getTimeRangeParam();
    const [overviewRes, classRes] = await Promise.allSettled([
      getBehaviorMgmtChart({timeRange: timeRangeParam}),
      getAttendanceCount({timeRange: timeRangeParam}),
    ]);
    if (overviewRes.status === 'fulfilled') {
      overviewData.value = overviewRes.value;
    } else {
      overviewData.value = {
        totalLeaveCount: 86,
        pendingAuditCount: 12,
        attendanceAbnormalCount: 5,
        syncCount: 74,
        leaveTypeDistribution: [
          {name: '事假', count: 45},
          {name: '病假', count: 32},
          {name: '其他', count: 9},
        ],
        dailyLeaveTrend: [
          {name: '03-01', count: 3},
          {name: '03-02', count: 5},
          {name: '03-03', count: 2},
        ],
      };
    }
    if (classRes.status === 'fulfilled') {
      classData.value = classRes.value.classStatistics || [];
    } else {
      classData.value = [
        {className: '计算机1班', leaveCount: 12, abnormalCount: 1},
        {className: '计算机2班', leaveCount: 15, abnormalCount: 2},
        {className: '软件1班', leaveCount: 9, abnormalCount: 0},
        {className: '软件2班', leaveCount: 8, abnormalCount: 1},
        {className: '电子1班', leaveCount: 10, abnormalCount: 1},
      ];
    }
  } catch (error) {
    console.error('加载图表数据失败', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  timeRange.value = getDefaultTimeRange();
  loadChartData();
});
</script>

<template>
  <div v-loading="loading" class="chart-box">
    <div class="box-left" style="flex: 1 !important;">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>

    <Pie
      style="flex: 1 !important;"
      title-text="请假类型分布"
      :data="leaveTypePieData"
      @pie-click="handlePieClick"
    />

    <div class="chart-area">
      <div class="chart-select-wrapper">
        <el-select v-model="activeChartIndex" size="small" @change="handleChartChange">
          <el-option v-for="(opt, idx) in chartOptions" :key="idx" :label="opt.title" :value="idx"/>
        </el-select>
      </div>

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
            { text: '本月', value: () => { const now = new Date(); const start = new Date(now.getFullYear(), now.getMonth(), 1); const end = new Date(now.getFullYear(), now.getMonth() + 1, 0); return [start, end]; } }
          ]"
          @change="handleDateRangeChange"
        />
      </div>

      <lineChart
        v-if="currentChart.type === 'line'"
        :title="currentChart.title"
        :x-data="currentChart.xData"
        :series-data="currentChart.seriesData"
        :y-name="currentChart.yName"
        @line-click="handleTrendClick"
      />
      <Bar
        v-else
        :title="currentChart.title"
        :x-data="currentChart.xData"
        :series-data="currentChart.seriesData"
        :y-name="currentChart.yName"
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

.chart-area {
  position: relative;
  flex: 1.5;
  min-width: 300px;
  display: flex;
  flex-direction: column;
}

.chart-select-wrapper {
  position: absolute;
  top: 8px;
  right: 10px;
  z-index: 10;
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
</style>
