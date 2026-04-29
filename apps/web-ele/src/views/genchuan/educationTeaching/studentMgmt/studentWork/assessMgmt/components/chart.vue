<script setup>
import { computed, onMounted, ref } from 'vue';

import { ElDatePicker, ElOption, ElSelect } from 'element-plus';

import {
  getAssessMgmtChart,
  getCycleTrend,
  getDimensionScore,
} from '#/api/genchuan/educationTeaching/studentMgmt/studentWork/assessMgmt/data.js';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import lineChart from '#/genchuan-components/stats/lineChartClick.vue';
import Radar from '#/genchuan-components/stats/radarClick.vue';

const emit = defineEmits(['radarClick', 'lineClick', 'cardSelect']);

// 模拟数据（字段名已改为 rankNo）
const mockOverview = {
  totalCount: 12,
  avgScore: 89.5,
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

const mockDimensionScore = [
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

// 修改：mockTrend 中的 rank → rankNo
const mockTrend = [
  { cycleName: '第1周', avgScore: 90.5, rankNo: 2 },
  { cycleName: '第2周', avgScore: 92, rankNo: 1 },
  { cycleName: '第3周', avgScore: 93.5, rankNo: 1 },
  { cycleName: '第4周', avgScore: 95, rankNo: 1 },
];

const loading = ref(true);
const overviewData = ref({});
const dimensionData = ref([]);
const trendData = ref([]);

// 雷达图统计周期
const cycle = ref('month'); // 默认月
const cycleOptions = [
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
  { label: '学期', value: 'semester' },
];

// 时间范围选择器相关（只针对周期趋势接口）
// 默认值：开始时间 2024-01-01，结束时间 2026-12-31
const dateRange = ref([new Date('2024-01-01'), new Date('2026-12-31')]);

// 格式化日期为后端需要的 ISO 8601 格式 (LocalDateTime)
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
  const total = overviewData.value.totalCount || 0;
  const avgScore = overviewData.value.avgScore || 0;
  const topRankClass = overviewData.value.topRankClass || '-';
  const published = overviewData.value.statusCount?.published || 0;
  return [
    { title: '本期考评总数', value: total, color: '#409EFF', status: 'total' },
    {
      title: '平均得分',
      value: avgScore,
      color: '#67C23A',
      status: 'avgScore',
    },
    {
      title: '排名第一班级',
      value: topRankClass,
      color: '#E6A23C',
      status: 'topRank',
    },
    {
      title: '已发布数',
      value: published,
      color: '#F56C6C',
      status: 'published',
    },
  ];
});

// 雷达图数据：将 dimensionData 转换为雷达图需要的格式（每个班级一个系列）
const radarIndicator = [
  { name: '教室卫生', max: 100 },
  { name: '早操', max: 100 },
  { name: '文明班级', max: 100 },
  { name: '黑板报', max: 100 },
];
const radarSeries = computed(() => {
  return dimensionData.value.map((item) => ({
    name: item.className,
    value: [
      item.classCleanScore ?? 0,
      item.morningExerciseScore ?? 0,
      item.civilClassScore ?? 0,
      item.blackboardScore ?? 0,
    ],
  }));
});

// 折线图数据：使用 rankNo 字段
const lineXData = computed(() => trendData.value.map((item) => item.cycleName));
const lineSeriesData = computed(() => [
  { name: '平均得分', data: trendData.value.map((item) => item.avgScore) },
  { name: '班级排名', data: trendData.value.map((item) => item.rankNo) },
]);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handleRadarClick = (params) => {
  emit('radarClick', { className: params.name });
};

const handleLineClick = (params) => {
  emit('lineClick', { cycleName: params.name });
};

// 转换后端返回的数组格式为对象格式
const transformOverviewData = (data) => {
  if (!data) return mockOverview;

  // 转换 assessTypeCount：数组 → 对象
  let assessTypeCountObj = {};
  if (Array.isArray(data.assessTypeCount)) {
    data.assessTypeCount.forEach((item) => {
      const key = item.assess_type || item.assessType;
      if (key) assessTypeCountObj[key] = item.count;
    });
  } else {
    assessTypeCountObj = data.assessTypeCount || {};
  }

  // 转换 statusCount：数组 → 对象，并统一状态值
  let statusCountObj = {};
  if (Array.isArray(data.statusCount)) {
    data.statusCount.forEach((item) => {
      let key = item.status;
      if (key === '1') key = 'published';
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

// 加载雷达图数据（根据当前周期）
const loadDimensionData = async () => {
  try {
    const res = await getDimensionScore({ cycle: cycle.value });
    dimensionData.value = res;
  } catch (error) {
    console.warn(
      `获取周期 ${cycle.value} 的多维度得分数据失败，使用模拟数据`,
      error,
    );
    dimensionData.value = mockDimensionScore;
  }
};

// 加载周期趋势数据（带时间范围参数）
const loadTrendData = async () => {
  try {
    const params = {};

    // 只有当时间范围存在时才添加参数
    if (dateRange.value && dateRange.value.length === 2) {
      const startDate = dateRange.value[0];
      const endDate = dateRange.value[1];
      if (startDate) {
        params.startTime = formatLocalDateTime(startDate);
      }
      if (endDate) {
        // 设置结束时间为当天的 23:59:59
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        params.endTime = formatLocalDateTime(endDateTime);
      }
    }

    const res = await getCycleTrend(params);
    trendData.value = res;
  } catch (error) {
    console.warn('获取周期趋势数据失败，使用模拟数据', error);
    trendData.value = mockTrend;
  }
};

// 时间范围变化处理
const handleDateRangeChange = async () => {
  if (dateRange.value && dateRange.value.length === 2) {
    await loadTrendData();
  }
};

// 周期变更回调
const onCycleChange = () => {
  loadDimensionData();
};

const loadChartData = async () => {
  loading.value = true;
  try {
    const [overviewRes, dimensionRes, trendRes] = await Promise.allSettled([
      getAssessMgmtChart({ cycle: 'month' }),
      getDimensionScore({ cycle: cycle.value }),
      getCycleTrend({}), // 初始化时不传时间参数，让后端返回全部数据
    ]);

    overviewData.value =
      overviewRes.status === 'fulfilled'
        ? transformOverviewData(overviewRes.value)
        : mockOverview;

    dimensionData.value =
      dimensionRes.status === 'fulfilled'
        ? dimensionRes.value
        : mockDimensionScore;
    trendData.value =
      trendRes.status === 'fulfilled' ? trendRes.value : mockTrend;
  } catch (error) {
    console.error('加载图表数据失败', error);
    overviewData.value = mockOverview;
    dimensionData.value = mockDimensionScore;
    trendData.value = mockTrend;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadChartData();
});
</script>

<template>
  <div v-loading="loading" class="chart-box">
    <!-- 卡片区 -->
    <div class="box-left" style="flex: 1 !important">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>

    <!-- 雷达图：班级多维度考评得分（带周期选择） -->
    <div class="chart-wrapper" style=" position: relative;flex: 1 !important">
      <div class="chart-select-wrapper">
        <ElSelect v-model="cycle" size="small" @change="onCycleChange">
          <ElOption
            v-for="opt in cycleOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </ElSelect>
      </div>
      <Radar
        title-text="班级多维度考评得分"
        :indicator="radarIndicator"
        :series="radarSeries"
        @radar-click="handleRadarClick"
      />
    </div>

    <!-- 折线图：班级考评周期趋势 -->
    <div
      class="chart-wrapper line-chart-container"
      style=" position: relative;flex: 1.5 !important"
    >
      <!-- 时间范围选择器（只针对周期趋势接口） -->
      <div class="date-range-wrapper">
        <ElDatePicker
          v-model="dateRange"
          type="daterange"
          range-separator="-"
          start-placeholder="起始时间"
          end-placeholder="结束时间"
          size="small"
          :shortcuts="[
            {
              text: '近三个月',
              value: () => {
                const end = new Date();
                const start = new Date();
                start.setMonth(start.getMonth() - 3);
                return [start, end];
              },
            },
            {
              text: '近半年',
              value: () => {
                const end = new Date();
                const start = new Date();
                start.setMonth(start.getMonth() - 6);
                return [start, end];
              },
            },
            {
              text: '近一年',
              value: () => {
                const end = new Date();
                const start = new Date();
                start.setFullYear(start.getFullYear() - 1);
                return [start, end];
              },
            },
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
  display: flex;
  flex-wrap: wrap;
  width: 100% !important;
  padding-right: 15px;
  padding-bottom: 0.5rem;
  padding-left: 15px;

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
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 320px;
    margin-left: 12px;
  }

  .chart-select-wrapper {
    position: absolute;
    top: 8px;
    right: 10px;
    z-index: 10;
  }

  /* 折线图容器特殊样式，用于绝对定位时间选择器 */
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
