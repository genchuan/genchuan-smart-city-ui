<script setup>
import {ref, computed, onMounted} from 'vue';
import {ElRadioGroup, ElRadioButton, ElDatePicker} from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Radar from '#/genchuan-components/stats/radarClick.vue';
import lineChart from '#/genchuan-components/stats/lineChartClick.vue';
import {
  getAssessMgmtChart,
  getDimensionScore,
  getCycleTrend,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/studentWork/assessMgmt/data.js';

const loading = ref(true);

// ========== 周期筛选（前端中文值，单选框）==========
const cycleFilter = ref('月');
const cycleOptions = [
  {label: '周', value: '周'},
  {label: '月', value: '月'},
  {label: '学期', value: '学期'},
];

// 周期中文 -> 英文映射
const cycleMap = {
  '周': 'week',
  '月': 'month',
  '学期': 'semester',
};

// ========== 数据状态 ==========
const overviewData = ref({});
const dimensionData = ref([]);
const trendData = ref([]);

// ========== 雷达图指标 ==========
const radarIndicator = [
  {name: '教室卫生', max: 100},
  {name: '早操', max: 100},
  {name: '文明班级', max: 100},
  {name: '黑板报', max: 100},
];

// ========== 卡片列表 ==========
const cardList = computed(() => {
  const total = overviewData.value.totalCount || 0;
  const avgScore = overviewData.value.avgScore || 0;
  const topRankClass = overviewData.value.topRankClass || '-';
  const published = overviewData.value.statusCount?.published || 0;
  return [
    {title: '本期考评总数', value: total, color: '#409EFF', status: 'total'},
    {title: '平均得分', value: avgScore, color: '#67C23A', status: 'avgScore'},
    {title: '排名第一班级', value: topRankClass, color: '#E6A23C', status: 'topRank'},
    {title: '已发布数', value: published, color: '#F56C6C', status: 'published'},
  ];
});

// ========== 雷达图数据 ==========
const radarSeries = computed(() => {
  return dimensionData.value.map(item => ({
    name: item.className,
    value: [
      item.classCleanScore ?? 0,
      item.morningExerciseScore ?? 0,
      item.civilClassScore ?? 0,
      item.blackboardScore ?? 0,
    ],
  }));
});

// ========== 折线图数据（完全保持原逻辑）==========
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

const lineXData = computed(() => trendData.value.map(item => item.cycleName));
const lineSeriesData = computed(() => [
  {name: '平均得分', data: trendData.value.map(item => item.avgScore)},
  {name: '班级排名', data: trendData.value.map(item => item.rankNo)},
]);

// ========== 事件 ==========
const emit = defineEmits(['radarClick', 'lineClick', 'cardSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handleRadarClick = (params) => {
  emit('radarClick', {className: params.name});
};

const handleLineClick = (params) => {
  emit('lineClick', {cycleName: params.name});
};

// ========== 概览数据转换 ==========
const transformOverviewData = (data) => {
  if (!data) return {};
  let assessTypeCountObj = {};
  if (Array.isArray(data.assessTypeCount)) {
    data.assessTypeCount.forEach(item => {
      const key = item.assess_type || item.assessType;
      if (key) assessTypeCountObj[key] = item.count;
    });
  } else {
    assessTypeCountObj = data.assessTypeCount || {};
  }
  let statusCountObj = {};
  if (Array.isArray(data.statusCount)) {
    data.statusCount.forEach(item => {
      let key = item.status;
      if (key === '1') key = 'published';
      if (key === '0') key = 'un_publish';
      if (key) statusCountObj[key] = item.count;
    });
  } else {
    statusCountObj = data.statusCount || {};
  }
  return {
    totalCount: data.totalCount ?? 0,
    avgScore: data.avgScore ?? 0,
    topRankClass: data.topRankClass || '-',
    assessTypeCount: assessTypeCountObj,
    statusCount: statusCountObj,
  };
};

// ========== 加载概览数据（随周期变化） ==========
const loadOverviewData = async () => {
  try {
    const cycleEnum = cycleMap[cycleFilter.value];
    const res = await getAssessMgmtChart({cycle: cycleEnum});
    overviewData.value = transformOverviewData(res);
  } catch (error) {
    console.error('获取概览数据失败，使用模拟数据', error);
    overviewData.value = {
      totalCount: 12,
      avgScore: 89.50,
      topRankClass: '高一(1)班',
      assessTypeCount: {
        class_clean: 4,
        morning_exercise: 3,
        civil_class: 3,
        blackboard: 2,
      },
      statusCount: {
        un_publish: 2,
        published: 10,
      },
    };
  }
};

// ========== 加载多维度得分数据（随周期变化） ==========
const loadDimensionData = async () => {
  try {
    const cycleEnum = cycleMap[cycleFilter.value];
    const res = await getDimensionScore({cycle: cycleEnum});
    dimensionData.value = res;
  } catch (error) {
    console.error('获取多维度得分数据失败，使用模拟数据', error);
    dimensionData.value = [
      {
        className: '高一(1)班',
        classCleanScore: 95,
        morningExerciseScore: 92,
        civilClassScore: 98,
        blackboardScore: 90,
        totalScore: 93.75,
      },
      {
        className: '高一(2)班',
        classCleanScore: 88,
        morningExerciseScore: 85,
        civilClassScore: 90,
        blackboardScore: 87,
        totalScore: 87.5,
      },
      {
        className: '高二(1)班',
        classCleanScore: 92,
        morningExerciseScore: 94,
        civilClassScore: 91,
        blackboardScore: 93,
        totalScore: 92.5,
      },
    ];
  }
};

// ========== 周期变化（同时刷新概览和多维度） ==========
const onCycleChange = async () => {
  loading.value = true;
  await Promise.all([loadOverviewData(), loadDimensionData()]);
  loading.value = false;
};

// ========== 趋势接口（完全保持原逻辑） ==========
const loadTrendData = async () => {
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
    const res = await getCycleTrend(params);
    trendData.value = res;
  } catch (error) {
    console.warn('获取周期趋势数据失败，使用模拟数据', error);
    trendData.value = [
      {cycleName: '第1周', avgScore: 90.5, rankNo: 2},
      {cycleName: '第2周', avgScore: 92, rankNo: 1},
      {cycleName: '第3周', avgScore: 93.5, rankNo: 1},
      {cycleName: '第4周', avgScore: 95, rankNo: 1},
    ];
  }
};

const handleDateRangeChange = async () => {
  if (dateRange.value && dateRange.value.length === 2) {
    await loadTrendData();
  }
};

// ========== 初始化加载 ==========
const initData = async () => {
  loading.value = true;
  await Promise.all([loadOverviewData(), loadDimensionData(), loadTrendData()]);
  loading.value = false;
};

onMounted(() => {
  initData();
});
</script>

<template>
  <div v-loading="loading" class="chart-box">
    <!-- 卡片区 -->
    <div class="box-left" style="flex: 1 !important;">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>

    <!-- 雷达图：班级多维度考评得分（周期单选框放在此容器右上角） -->
    <div class="chart-wrapper" style="flex: 1 !important; position: relative;">
      <!-- 周期单选框 - 置于雷达图右上角（参考代码样式） -->
      <div class="cycle-radio">
        <el-radio-group v-model="cycleFilter" @change="onCycleChange">
          <el-radio-button
            v-for="opt in cycleOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-radio-group>
      </div>
      <Radar
        title-text="班级多维度考评得分"
        :indicator="radarIndicator"
        :series="radarSeries"
        @radar-click="handleRadarClick"
      />
    </div>

    <!-- 折线图：班级考评周期趋势（完全保持原逻辑） -->
    <div class="chart-wrapper line-chart-container"
         style="flex: 1.5 !important; position: relative;">
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
      <lineChart
        title="班级考评周期趋势"
        :x-data="lineXData"
        :series-data="lineSeriesData"
        y-name="值"
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
    gap: 12px;
    min-width: 280px;
    max-width: 320px;
    margin-top: 10px !important;

    .left-card {
      height: 150px !important;
    }
  }

  .chart-wrapper {
    display: flex;
    flex-direction: column;
    min-width: 320px;
    flex: 1;
    margin-left: 12px;
    position: relative;

    // 周期单选框：放在雷达图容器右上角
    .cycle-radio {
      position: absolute;
      top: 8px;
      right: 10px;
      z-index: 10;
    }
  }

  /* 折线图容器中的时间选择器 */
  .line-chart-container {
    position: relative;
  }

  .date-range-wrapper {
    position: absolute;
    top: 8px;
    right: 10px;
    z-index: 10;
  }

  /* 紧凑的时间选择器样式 */
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
