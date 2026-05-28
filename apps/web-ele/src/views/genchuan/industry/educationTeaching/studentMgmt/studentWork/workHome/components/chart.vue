<script setup>
import {ref, computed, watch, onMounted} from 'vue';
import {ElSelect, ElOption, ElRadioGroup, ElRadioButton, ElDatePicker} from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import Radar from '#/genchuan-components/stats/radarClick.vue';
import lineChart from '#/genchuan-components/stats/lineChart.vue';
import {
  getWorkHomeChart,
  getDimensionCount,
  getScoreAnalysis,
  getCoreIndex,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/studentWork/workHome/data.js';

const loading = ref(true);
const chartData = ref({});
const dimensionData = ref([]);
const radarData = ref([]);
const coreData = ref([]);

// 周期筛选相关（仅用于雷达图）
const cycleFilter = ref('月');
const cycleOptions = [
  {label: '周', value: '周'},
  {label: '月', value: '月'},
  {label: '学期', value: '学期'},
];
const cycleMap = {
  '周': 'week',
  '月': 'month',
  '学期': 'semester',
};

// 日期范围筛选（影响卡片、饼图、折线图）
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

// 卡片列表
const cardList = computed(() => {
  const data = chartData.value;
  return [
    {title: '学生总人数', value: data.totalStudent || 0, color: '#409EFF', status: 'totalStudent'},
    {title: '荣誉总数', value: data.totalHonor || 0, color: '#67C23A', status: 'totalHonor'},
    {title: '考评总数', value: data.totalAssess || 0, color: '#E6A23C', status: 'totalAssess'},
    {title: '违纪总数', value: data.totalViolate || 0, color: '#F56C6C', status: 'totalViolate'},
    {title: '心理评估总数', value: data.totalMental || 0, color: '#909399', status: 'totalMental'},
    {title: '资助总数', value: data.totalFund || 0, color: '#409EFF', status: 'totalFund'},
    {
      title: '待处理违纪',
      value: data.unhandledViolate || 0,
      color: '#F56C6C',
      status: 'unhandledViolate'
    },
    {
      title: '待处理预警',
      value: data.unhandledWarn || 0,
      color: '#E6A23C',
      status: 'unhandledWarn'
    },
  ];
});

// 饼图数据
const pieData = computed(() => dimensionData.value.map(item => ({
  name: item.dimension,
  value: item.count,
})));

// 雷达图指标
const radarIndicator = [
  {name: '教室卫生', max: 100},
  {name: '早操', max: 100},
  {name: '文明班级', max: 100},
  {name: '黑板报', max: 100},
];

const radarSeries = computed(() => radarData.value.map(item => ({
  name: item.className,
  value: [
    Number(item.healthScore) || 0,
    Number(item.exerciseScore) || 0,
    Number(item.civilizedScore) || 0,
    Number(item.blackboardScore) || 0,
  ],
})));

// 折线图数据（按日期排序）
const lineXData = computed(() => {
  return [...coreData.value]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(item => item.date);
});
const lineSeriesData = computed(() => {
  const sorted = [...coreData.value].sort((a, b) => new Date(a.date) - new Date(b.date));
  return [
    {name: '新增荣誉数', data: sorted.map(item => item.honorCount || 0)},
    {name: '新增违纪数', data: sorted.map(item => item.violateCount || 0)},
    {name: '新增考评数', data: sorted.map(item => item.assessCount || 0)},
  ];
});

// 图表切换选项
const chartOptions = computed(() => [
  {
    type: 'pie',
    title: '各维度记录分布',
    data: pieData.value,
  },
  {
    type: 'radar',
    title: '班级整体发展维度评分',
    indicator: radarIndicator,
    series: radarSeries.value,
  },
  {
    type: 'line',
    title: '核心指标趋势',
    xData: lineXData.value,
    seriesData: lineSeriesData.value,
    yName: '数量',
  },
]);

const activeChartIndex = ref(0);
const currentChart = computed(() => chartOptions.value[activeChartIndex.value] || chartOptions.value[0]);

const handleChartChange = (index) => {
  activeChartIndex.value = index;
};

const emit = defineEmits(['cardClick', 'pieClick', 'radarClick', 'lineClick']);

// ========== 核心修改：卡片点击处理（待处理违纪/预警派发自定义事件） ==========
const handleCardClick = (cardInfo) => {
  switch (cardInfo.status) {
    case 'totalStudent':
      emit('cardClick', 'totalStudent');
      break;
    case 'totalHonor':
      emit('cardClick', 'totalHonor');
      break;
    case 'totalAssess':
      emit('cardClick', 'totalAssess');
      break;
    case 'totalViolate':
      emit('cardClick', 'totalViolate');
      break;
    case 'totalMental':
      emit('cardClick', 'totalMental');
      break;
    case 'totalFund':
      emit('cardClick', 'totalFund');
      break;
    case 'unhandledViolate':
      // 派发自定义事件，通知违纪管理模块按状态“待审批”筛选
      window.dispatchEvent(new CustomEvent('violate-chart-filter', {
        detail: {type: 'status', value: '待审批'}
      }));
      emit('cardClick', 'unhandledViolate');
      break;
    case 'unhandledWarn':
      window.dispatchEvent(new CustomEvent('violate-chart-filter', {
        detail: {type: 'status', value: '已预警'}
      }));
      emit('cardClick', 'unhandledWarn');
      break;
    default:
      break;
  }
};

const handlePieClick = (item) => {
  emit('pieClick', {dimension: item.name});
};

const handleRadarClick = (params) => {
  emit('radarClick', {className: params.name});
};

const handleLineClick = (params) => {
  emit('lineClick', {date: params.name});
};

const loadRadarData = async (cycle) => {
  try {
    const cycleEnum = cycleMap[cycle];
    const res = await getScoreAnalysis({cycle: cycleEnum});
    radarData.value = res;
  } catch (error) {
    console.error('获取雷达图数据失败，使用模拟数据', error);
    radarData.value = [
      {
        className: '计算机2022级1班',
        healthScore: 95.5,
        exerciseScore: 92.0,
        civilizedScore: 98.0,
        blackboardScore: 90.0
      },
      {
        className: '计算机2022级2班',
        healthScore: 88.0,
        exerciseScore: 90.5,
        civilizedScore: 89.0,
        blackboardScore: 92.5
      },
    ];
  }
};

const loadOtherData = async (startTime, endTime) => {
  const params = {};
  if (startTime) params.startTime = startTime;
  if (endTime) params.endTime = endTime;

  try {
    const [chartRes, dimRes, coreRes] = await Promise.allSettled([
      getWorkHomeChart(params),
      getDimensionCount(params),
      getCoreIndex(params),
    ]);
    if (chartRes.status === 'fulfilled') chartData.value = chartRes.value;
    else chartData.value = {
      totalStudent: 1256,
      totalHonor: 328,
      totalAssess: 452,
      totalViolate: 86,
      totalMental: 215,
      totalFund: 168,
      unhandledViolate: 12,
      unhandledWarn: 5
    };

    if (dimRes.status === 'fulfilled') dimensionData.value = dimRes.value;
    else dimensionData.value = [
      {dimension: '荣誉', count: 328},
      {dimension: '考评', count: 452},
      {dimension: '违纪', count: 86},
      {dimension: '行为', count: 512},
      {dimension: '心理', count: 215},
      {dimension: '资助', count: 168},
    ];

    if (coreRes.status === 'fulfilled') {
      const sortedData = [...coreRes.value].sort((a, b) => new Date(a.date) - new Date(b.date));
      coreData.value = sortedData;
    } else {
      coreData.value = [
        {date: '2025-01-06', honorCount: 12, violateCount: 3, assessCount: 18},
        {date: '2025-01-13', honorCount: 15, violateCount: 2, assessCount: 18},
        {date: '2025-01-20', honorCount: 8, violateCount: 5, assessCount: 18},
      ];
    }
  } catch (error) {
    console.error('加载其他图表数据失败', error);
  }
};

const handleDateRangeChange = async () => {
  if (dateRange.value && dateRange.value.length === 2) {
    const startDate = dateRange.value[0];
    const endDate = dateRange.value[1];
    let startTime = null;
    let endTime = null;
    if (startDate) startTime = formatLocalDateTime(startDate);
    if (endDate) {
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);
      endTime = formatLocalDateTime(endDateTime);
    }
    await loadOtherData(startTime, endTime);
  }
};

watch(cycleFilter, (newCycle) => {
  if (currentChart.value.type === 'radar') {
    loadRadarData(newCycle);
  }
});

const initData = async () => {
  loading.value = true;
  let startTime = null, endTime = null;
  if (dateRange.value && dateRange.value.length === 2) {
    const startDate = dateRange.value[0];
    const endDate = dateRange.value[1];
    if (startDate) startTime = formatLocalDateTime(startDate);
    if (endDate) {
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);
      endTime = formatLocalDateTime(endDateTime);
    }
  }
  await Promise.all([loadOtherData(startTime, endTime), loadRadarData(cycleFilter.value)]);
  loading.value = false;
};

onMounted(() => {
  initData();
});
</script>

<template>
  <div v-loading="loading" class="chart-box">
    <!-- 卡片区 -->
    <div class="box-left-big" style="flex: 1.5 !important;">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>

    <!-- 统一图表切换区域 -->
    <div class="chart-switch-area" style="flex: 2 !important;">
      <!-- 左上角控件组：根据图表类型显示日期选择器或雷达图周期单选框 -->
      <div class="top-left-controls">
        <!-- 饼图/折线图模式：显示日期选择器 -->
        <el-date-picker
          v-if="currentChart.type !== 'radar'"
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
          class="date-picker"
        />
        <!-- 雷达图模式：显示周期单选框 -->
        <el-radio-group
          v-else
          v-model="cycleFilter"
          size="small"
          class="cycle-radio"
        >
          <el-radio-button v-for="opt in cycleOptions" :key="opt.value" :label="opt.value"/>
        </el-radio-group>
      </div>

      <!-- 右上角：图表切换下拉选择器（始终显示） -->
      <div class="top-right-controls">
        <el-select
          v-model="activeChartIndex"
          size="small"
          @change="handleChartChange"
          class="chart-select"
        >
          <el-option
            v-for="(opt, idx) in chartOptions"
            :key="idx"
            :label="opt.title"
            :value="idx"
          />
        </el-select>
      </div>

      <!-- 动态渲染图表 -->
      <Pie
        v-if="currentChart.type === 'pie'"
        :title-text="currentChart.title"
        :data="currentChart.data"
        @pie-click="handlePieClick"
      />
      <Radar
        v-else-if="currentChart.type === 'radar'"
        :title-text="currentChart.title"
        :indicator="currentChart.indicator"
        :series="currentChart.series"
        @radar-click="handleRadarClick"
      />
      <lineChart
        v-else-if="currentChart.type === 'line'"
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

  .box-left-big {
    display: grid !important;
    grid-template-columns: repeat(4, 1fr);
    min-width: 360px;
    margin-top: 10px !important;

    .left-card {
      height: 150px !important;
    }
  }
}

.chart-switch-area {
  position: relative;
  flex: 2;
  min-width: 320px;
  display: flex;
  flex-direction: column;
}

/* 左上角控件容器 */
.top-left-controls {
  position: absolute;
  top: 8px;
  left: 10px;
  z-index: 10;
}

/* 右上角控件容器 */
.top-right-controls {
  position: absolute;
  top: 8px;
  right: 10px;
  z-index: 10;
}

.chart-select {
  width: 160px;
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
