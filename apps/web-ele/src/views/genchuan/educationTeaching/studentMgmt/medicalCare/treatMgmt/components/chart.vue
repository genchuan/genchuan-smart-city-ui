<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElSelect, ElOption, ElDatePicker } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import lineChart from '#/genchuan-components/stats/lineChartClick.vue';
import {
  getTreatMgmtChart,
  getTreatMgmtDistribution,
} from '#/api/genchuan/educationTeaching/studentMgmt/medicalCare/treatMgmt/data.js';

const loading = ref(true);
const chartData = ref({});
const distributionData = ref({});

// 时间范围选择器绑定的值（数组格式 [startDate, endDate]）
const timeRange = ref([]);

// 获取默认时间范围（最近30天，结束时间为当天）
const getDefaultTimeRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 30);
  return [start, end];
};

// 格式化单个日期时间为后端要求的格式（带 T 分隔，如 "2023-01-01T00:00:00"）
// isEnd: 是否为结束时间（结束时间用 23:59:59，起始用 00:00:00）
const formatDateTime = (date, isEnd = false) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const time = isEnd ? '23:59:59' : '00:00:00';
  return `${year}-${month}-${day}T${time}`;
};

// 生成 timeRange 字符串（格式："起始时间,结束时间"）
const getTimeRangeParam = () => {
  if (timeRange.value && timeRange.value.length === 2) {
    const startStr = formatDateTime(timeRange.value[0], false);
    const endStr = formatDateTime(timeRange.value[1], true);
    return `${startStr},${endStr}`;
  }
  const [defaultStart, defaultEnd] = getDefaultTimeRange();
  return `${formatDateTime(defaultStart, false)},${formatDateTime(defaultEnd, true)}`;
};

// 日期范围变化时重新加载数据
const handleDateRangeChange = () => {
  loadData();
};

// ========== 卡片数据 ==========
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

// 折线图数据
const lineData = computed(() => {
  const trend = chartData.value.recentWeekTreatTrend || [];
  return {
    xAxis: trend.map(item => item.date),
    series: [{name: '就诊次数', data: trend.map(item => item.count)}],
  };
});

// 饼图配置
const pieOptions = computed(() => [
  {
    title: '就诊类型分布',
    type: 'treatType',
    getData: () => {
      const dist = distributionData.value.treatTypeDistribution || [];
      return dist.map(item => ({name: item.name, value: item.value}));
    },
  },
  {
    title: '就诊学生年级分布',
    type: 'grade',
    getData: () => {
      const dist = distributionData.value.gradeDistribution || [];
      return dist.map(item => ({name: item.name, value: item.value}));
    },
  },
]);

const activePieIndex = ref(0);
const currentPieData = computed(() => pieOptions.value[activePieIndex.value]?.getData() || []);
const currentPieTitle = computed(() => pieOptions.value[activePieIndex.value]?.title || '');

const handlePieChange = (index) => {
  activePieIndex.value = index;
};

const emit = defineEmits(['cardSelect', 'pieSelect', 'lineSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handlePieClick = (item) => {
  const currentType = pieOptions.value[activePieIndex.value]?.type;
  if (currentType === 'treatType') {
    emit('pieSelect', {field: 'treatType', value: item.name});
  } else if (currentType === 'grade') {
    emit('pieSelect', {field: 'grade', value: item.name});
  }
};

const handleLineClick = (params) => {
  emit('lineSelect', {field: 'date', value: params.xValue});
};

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    const timeRangeParam = getTimeRangeParam();
    const [chartRes, distRes] = await Promise.allSettled([
      getTreatMgmtChart({timeRange: timeRangeParam}),
      getTreatMgmtDistribution({timeRange: timeRangeParam}),
    ]);
    if (chartRes.status === 'fulfilled') {
      chartData.value = chartRes.value;
    } else {
      console.warn('就诊看板接口失败，使用模拟数据', chartRes.reason);
      chartData.value = {
        totalTreatCount: 86,
        pendingAuditCount: 12,
        finishedTreatCount: 74,
        outpatientCount: 62,
        emergencyCount: 18,
        otherCount: 6,
        recentWeekTreatTrend: [
          {date: '2025-03-25', count: 8},
          {date: '2025-03-26', count: 12},
          {date: '2025-03-27', count: 10},
          {date: '2025-03-28', count: 9},
          {date: '2025-03-29', count: 7},
          {date: '2025-03-30', count: 5},
          {date: '2025-03-31', count: 6},
        ],
      };
    }
    if (distRes.status === 'fulfilled') {
      distributionData.value = distRes.value;
    } else {
      console.warn('分布统计接口失败，使用模拟数据', distRes.reason);
      distributionData.value = {
        treatTypeDistribution: [
          {name: '门诊', value: 62},
          {name: '急诊', value: 18},
          {name: '其他', value: 6},
        ],
        gradeDistribution: [
          {name: '高一', value: 25},
          {name: '高二', value: 30},
          {name: '高三', value: 31},
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
    <div class="box-left-m">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>

    <!-- 折线图区域（包含日期选择器） -->
    <div class="line-chart-container" style="flex: 1.5 !important; position: relative;">
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
        title="近一周就诊趋势"
        :x-data="lineData.xAxis"
        :series-data="lineData.series"
        y-name="就诊次数"
        @line-click="handleLineClick"
      />
    </div>

    <div class="chart-area">
      <div class="chart-select-wrapper">
        <el-select v-model="activePieIndex" size="small" @change="handlePieChange">
          <el-option v-for="(opt, idx) in pieOptions" :key="idx" :label="opt.title" :value="idx"/>
        </el-select>
      </div>
      <Pie :title-text="currentPieTitle" :data="currentPieData" @pie-click="handlePieClick"/>
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

  /* 折线图容器特殊样式，用于绝对定位日期选择器 */
  .line-chart-container {
    position: relative;
    flex: 1.5;
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

  /* 紧凑的日期选择器样式 */
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
