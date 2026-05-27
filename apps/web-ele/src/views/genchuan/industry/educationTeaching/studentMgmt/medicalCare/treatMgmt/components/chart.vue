<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElSelect, ElOption, ElDatePicker } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import lineChart from '#/genchuan-components/stats/lineChartClick.vue';
import {
  getTreatMgmtChart,
  getTreatMgmtDistribution,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/medicalCare/treatMgmt/data.js';

const loading = ref(true);

// 受时间范围影响的数据（卡片、饼图）
const chartData = ref({});
const distributionData = ref({});

// 折线图数据（独立，不随 timeRange 变化）
const lineData = ref({ xAxis: [], series: [] });

// 时间范围选择器（仅用于控制卡片和饼图）
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

// 日期变化时只刷新受时间范围影响的数据（卡片 + 饼图）
const handleDateRangeChange = () => {
  loadOverviewData();
};

// 卡片数据（基于 chartData）
const cardList = computed(() => {
  const total = chartData.value.totalTreatCount || 0;
  const pending = chartData.value.pendingAuditCount || 0;
  const finished = chartData.value.finishedTreatCount || 0;
  const outpatient = chartData.value.outpatientCount || 0;
  const emergency = chartData.value.emergencyCount || 0;
  const other = chartData.value.otherCount || 0;
  return [
    {title: '总就诊次数', value: total, color: '#409EFF', status: 'total'},
    {title: '待审核预约数', value: pending, color: '#E6A23C', status: 'pending'},
    {title: '已完成就诊数', value: finished, color: '#67C23A', status: 'finished'},
    {title: '门诊就诊数', value: outpatient, color: '#909399', status: 'outpatient'},
    {title: '急诊就诊数', value: emergency, color: '#F56C6C', status: 'emergency'},
    {title: '其他就诊数', value: other, color: '#909399', status: 'other'},
  ];
});

// 饼图数据（基于 distributionData）
const treatTypePieData = computed(() => {
  const data = distributionData.value.treatTypeDistribution || [];
  return data.map(item => ({
    name: item.type,
    value: item.value,
  }));
});

const gradePieData = computed(() => {
  const data = distributionData.value.gradeDistribution || [];
  return data.map(item => ({
    name: item.grade,
    value: item.value,
  }));
});

const pieOptions = computed(() => [
  {type: 'treatType', title: '就诊类型分布', data: treatTypePieData.value},
  {type: 'grade', title: '就诊学生年级分布', data: gradePieData.value},
]);

const activePieIndex = ref(0);
const currentPie = computed(() => pieOptions.value[activePieIndex.value] || pieOptions.value[0]);

const handlePieChange = (index) => {
  activePieIndex.value = index;
};

// ========== 数据加载 ==========
// 加载受时间范围影响的卡片 + 饼图数据
const loadOverviewData = async () => {
  try {
    const timeRangeParam = getTimeRangeParam();
    // 注意：不再等待折线图，只等待这两个请求
    const [chartRes, distRes] = await Promise.allSettled([
      getTreatMgmtChart({timeRange: timeRangeParam}),
      getTreatMgmtDistribution({timeRange: timeRangeParam}),
    ]);
    if (chartRes.status === 'fulfilled') chartData.value = chartRes.value;
    else {
      // 降级假数据
      chartData.value = {
        totalTreatCount: 86,
        pendingAuditCount: 12,
        finishedTreatCount: 74,
        outpatientCount: 62,
        emergencyCount: 18,
        otherCount: 6,
      };
    }
    if (distRes.status === 'fulfilled') distributionData.value = distRes.value;
    else {
      distributionData.value = {
        treatTypeDistribution: [
          {type: '门诊', value: 62},
          {type: '急诊', value: 18},
          {type: '其他', value: 6},
        ],
        gradeDistribution: [
          {grade: '高一', value: 25},
          {grade: '高二', value: 30},
          {grade: '高三', value: 31},
        ],
      };
    }
  } catch (error) {
    console.error('加载卡片/饼图数据失败', error);
  }
};

// 独立加载折线图数据：不传 timeRange，始终取近一周趋势
const loadLineTrend = async () => {
  try {
    // 关键改动：不传递 timeRange 参数
    const res = await getTreatMgmtChart();
    const trend = res.recentWeekTreatTrend || [];
    lineData.value = {
      xAxis: trend.map(item => item.date),
      series: [{name: '就诊次数', data: trend.map(item => item.count)}],
    };
  } catch (error) {
    console.error('加载近一周趋势失败，使用默认数据', error);
    // 降级默认近一周数据
    const defaultTrend = [
      {date: '2025-03-25', count: 8},
      {date: '2025-03-26', count: 12},
      {date: '2025-03-27', count: 10},
      {date: '2025-03-28', count: 9},
      {date: '2025-03-29', count: 7},
      {date: '2025-03-30', count: 5},
      {date: '2025-03-31', count: 6},
    ];
    lineData.value = {
      xAxis: defaultTrend.map(item => item.date),
      series: [{name: '就诊次数', data: defaultTrend.map(item => item.count)}],
    };
  }
};

// 完整加载（初始调用）
const loadAllData = async () => {
  loading.value = true;
  try {
    // 并行加载，但折线图独立，两者互不影响
    await Promise.all([loadOverviewData(), loadLineTrend()]);
  } catch (error) {
    console.error('初始化数据失败', error);
  } finally {
    loading.value = false;
  }
};

// ========== 点击事件（保持不变） ==========
const handleCardClick = (cardInfo) => {
  let filterType = null;
  let filterValue = null;
  switch (cardInfo.status) {
    case 'pending':
      filterType = 'status';
      filterValue = '待审核';
      break;
    case 'finished':
      filterType = 'status';
      filterValue = '已就诊';
      break;
    case 'outpatient':
      filterType = 'treatType';
      filterValue = '门诊';
      break;
    case 'emergency':
      filterType = 'treatType';
      filterValue = '急诊';
      break;
    case 'other':
      filterType = 'treatType';
      filterValue = '其他';
      break;
    case 'total':
    default:
      return;
  }
  window.dispatchEvent(new CustomEvent('treat-chart-filter', {
    detail: {type: filterType, value: filterValue}
  }));
};

const handlePieClick = (params) => {
  const currentType = currentPie.value.type;
  if (currentType === 'treatType') {
    window.dispatchEvent(new CustomEvent('treat-chart-filter', {
      detail: {type: 'treatType', value: params.name}
    }));
  } else if (currentType === 'grade') {
    window.dispatchEvent(new CustomEvent('treat-chart-filter', {
      detail: {type: 'grade', value: params.name}
    }));
  }
};

const handleLineClick = (params) => {
  const date = params.xValue || params.name;
  if (date) {
    window.dispatchEvent(new CustomEvent('treat-chart-filter', {
      detail: {type: 'createTime', value: [date, date]}
    }));
  }
};

onMounted(() => {
  timeRange.value = getDefaultTimeRange();
  loadAllData();
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

    <div class="line-chart-container" style="flex: 1 !important; position: relative;">
      <!-- 移除原日期选择器，折线图不再受其控制 -->
      <lineChart
        title="近一周就诊趋势"
        :x-data="lineData.xAxis"
        :series-data="lineData.series"
        y-name="就诊次数"
        @line-click="handleLineClick"
      />
    </div>

    <div class="chart-area">
      <!-- 日期选择器已移动到饼图区域的左上角 -->
      <div class="date-range-wrapper-left">
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
      <div class="chart-select-wrapper">
        <el-select v-model="activePieIndex" size="small" @change="handlePieChange">
          <el-option v-for="(opt, idx) in pieOptions" :key="idx" :label="opt.title" :value="idx"/>
        </el-select>
      </div>
      <Pie
        :title-text="currentPie.title"
        :data="currentPie.data"
        @pie-click="handlePieClick"
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

  .line-chart-container {
    position: relative;
    flex: 1.5;
    min-width: 280px;
    margin-left: 12px;
  }

  .chart-area {
    position: relative;
    flex: 1;
    min-width: 280px;
    height: 100%;
    margin-left: 12px;
  }

  // 日期选择器放在饼图左上角
  .date-range-wrapper-left {
    position: absolute;
    top: 8px;
    left: 10px;
    z-index: 10;
  }

  // 下拉切换放在饼图右上角
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
