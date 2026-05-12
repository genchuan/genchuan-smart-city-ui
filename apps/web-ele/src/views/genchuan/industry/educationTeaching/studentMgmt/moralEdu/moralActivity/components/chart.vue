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
const chartData = ref({});       // 柱状图数据（活动类型数量/参与人数）
const trendData = ref({});       // 折线图数据（月度趋势）
const overviewData = ref({});    // 饼图数据（状态分布、类型分布）

// 时间范围选择器相关（针对两个接口）
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

// ========== 柱状图配置 ==========
const barOptions = computed(() => [
  {
    title: '各类型活动数量',
    type: 'activityCount',
    getData: () => {
      const typeList = chartData.value.typeList || [];
      const activityCountList = chartData.value.activityCountList || [];
      return {
        xData: typeList,
        seriesData: [{name: '活动数量', data: activityCountList}]
      };
    },
    yName: '活动数量',
  },
  {
    title: '各类型参与人数',
    type: 'joinCount',
    getData: () => {
      const typeList = chartData.value.typeList || [];
      const joinCountList = chartData.value.joinCountList || [];
      return {
        xData: typeList,
        seriesData: [{name: '参与人数', data: joinCountList}]
      };
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

// ========== 折线图配置（适配后端字段 date, totalCount） ==========
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

// ========== 饼图配置（适配后端 statusCount 和 activityTypeCount 的键名） ==========
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

// ========== 事件发射 ==========
const emit = defineEmits(['barSelect']);

// 柱状图点击：筛选对应类型的活动记录
const handleBarClick = (typeName) => {
  emit('barSelect', {field: 'activityType', value: typeName});
};

// 折线图点击：筛选对应月份的活动记录
const handleLineClick = (month) => {
  emit('barSelect', {field: 'month', value: month});
};

// 饼图点击：根据当前饼图类型发射筛选事件
const handlePieClick = (item) => {
  const currentType = pieOptions.value[activePieIndex.value]?.type;
  if (currentType === 'status') {
    emit('barSelect', {field: 'status', value: item.name});
  } else if (currentType === 'activityType') {
    emit('barSelect', {field: 'activityType', value: item.name});
  }
};

// 加载活动数量统计（带时间范围参数）
const loadActivityCount = async () => {
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

    const res = await getMoralActivityCount(params);
    chartData.value = res;
  } catch (error) {
    console.warn('活动数量统计接口失败，使用模拟数据', error);
    chartData.value = {
      typeList: ['党团活动', '志愿活动', '其他'],
      activityCountList: [5, 7, 3],
      joinCountList: [200, 280, 50],
    };
  }
};

// 加载图表总览数据（带时间范围参数）
const loadActivityChart = async () => {
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

    const res = await getMoralActivityChart(params);
    overviewData.value = res;
    trendData.value = res;
  } catch (error) {
    console.warn('图表总览接口失败，使用模拟数据', error);
    const mockData = {
      statusCount: {ongoing: 3, ended: 5, unpublished: 2},
      activityTypeCount: {party_league: 4, volunteer: 3, other: 3},
      monthTrend: [
        {date: '2025-03', totalCount: 2},
        {date: '2025-04', totalCount: 1},
        {date: '2025-06', totalCount: 1},
      ],
      joinTrend: [
        {date: '2025-03', totalCount: 1},
        {date: '2025-04', totalCount: 1},
        {date: '2025-05', totalCount: 1},
      ],
    };
    overviewData.value = mockData;
    trendData.value = mockData;
  }
};

// 时间范围变化处理
const handleDateRangeChange = async () => {
  if (dateRange.value && dateRange.value.length === 2) {
    loading.value = true;
    try {
      await Promise.all([
        loadActivityCount(),
        loadActivityChart(),
      ]);
    } finally {
      loading.value = false;
    }
  }
};

// ========== 加载数据 ==========
const loadData = async () => {
  loading.value = true;
  try {
    // 初始化时不传时间参数，让后端返回全部数据
    const [countRes, chartRes] = await Promise.allSettled([
      getMoralActivityCount({}),
      getMoralActivityChart({})
    ]);
    if (countRes.status === 'fulfilled') {
      chartData.value = countRes.value;
    } else {
      console.warn('活动数量统计接口失败，使用模拟数据');
      chartData.value = {
        typeList: ['党团活动', '志愿活动', '其他'],
        activityCountList: [5, 7, 3],
        joinCountList: [200, 280, 50],
      };
    }
    if (chartRes.status === 'fulfilled') {
      overviewData.value = chartRes.value;
      trendData.value = chartRes.value;
    } else {
      console.warn('图表总览接口失败，使用模拟数据');
      const mockData = {
        statusCount: {ongoing: 3, ended: 5, unpublished: 2},
        activityTypeCount: {party_league: 4, volunteer: 3, other: 3},
        monthTrend: [
          {date: '2025-03', totalCount: 2},
          {date: '2025-04', totalCount: 1},
          {date: '2025-06', totalCount: 1},
        ],
        joinTrend: [
          {date: '2025-03', totalCount: 1},
          {date: '2025-04', totalCount: 1},
          {date: '2025-05', totalCount: 1},
        ],
      };
      overviewData.value = mockData;
      trendData.value = mockData;
    }
  } catch (error) {
    console.error('加载图表数据失败', error);
    chartData.value = {
      typeList: ['党团活动', '志愿活动', '其他'],
      activityCountList: [5, 7, 3],
      joinCountList: [200, 280, 50],
    };
    const mockData = {
      statusCount: {ongoing: 3, ended: 5, unpublished: 2},
      activityTypeCount: {party_league: 4, volunteer: 3, other: 3},
      monthTrend: [
        {date: '2025-03', totalCount: 2},
        {date: '2025-04', totalCount: 1},
        {date: '2025-06', totalCount: 1},
      ],
      joinTrend: [
        {date: '2025-03', totalCount: 1},
        {date: '2025-04', totalCount: 1},
        {date: '2025-05', totalCount: 1},
      ],
    };
    overviewData.value = mockData;
    trendData.value = mockData;
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
          <el-option
            v-for="(opt, idx) in pieOptions"
            :key="idx"
            :label="opt.title"
            :value="idx"
          />
        </el-select>
      </div>
      <!-- 时间范围选择器（只针对两个接口） -->
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
        :title-text="currentPieTitle"
        :data="currentPieData"
        @pie-click="handlePieClick"
      />
    </div>

    <!-- 柱状图区域 -->
    <div class="chart-area bar-chart-container">
      <div class="chart-select-wrapper">
        <el-select v-model="activeBarIndex" size="small" @change="handleBarChange">
          <el-option
            v-for="(opt, idx) in barOptions"
            :key="idx"
            :label="opt.title"
            :value="idx"
          />
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

    <!-- 折线图区域 -->
    <div class="chart-area">
      <div class="chart-select-wrapper">
        <el-select v-model="activeLineIndex" size="small" @change="handleLineChange">
          <el-option
            v-for="(opt, idx) in lineOptions"
            :key="idx"
            :label="opt.title"
            :value="idx"
          />
        </el-select>
      </div>
      <LineChart
        :title="currentLineTitle"
        :x-data="currentLineData.xData"
        :series-data="currentLineData.seriesData"
        :y-name="currentLineYName"
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

  /* 柱状图容器特殊样式，用于绝对定位时间选择器 */
  .bar-chart-container {
    position: relative;
  }

  .date-range-wrapper {
    position: absolute;
    top: 38px;
    left: 10px;
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
