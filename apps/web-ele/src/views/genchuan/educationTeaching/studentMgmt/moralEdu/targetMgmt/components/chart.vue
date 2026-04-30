<script setup>
import { computed, onMounted, ref } from 'vue';

import { ElDatePicker, ElOption, ElSelect } from 'element-plus';

import {
  getTargetIndex,
  getTargetMgmtChart,
} from '#/api/genchuan/educationTeaching/studentMgmt/moralEdu/targetMgmt/data.js';
import Bar from '#/genchuan-components/stats/barClick.vue';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';

// 事件发射
const emit = defineEmits(['barSelect', 'cardSelect', 'pieSelect']);
const loading = ref(true);
const overviewData = ref({});
const indexData = ref({});

// 时间范围选择器相关（只针对 getTargetMgmtChart 接口）
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

// 卡片数据
const cardList = computed(() => {
  const total = indexData.value.totalTargetCount || 0;
  const enabled = indexData.value.enabledTargetCount || 0;
  const warned = indexData.value.warnTargetCount || 0;
  const avg = indexData.value.avgScore || 0;
  return [
    { title: '指标总数', value: total, color: '#409EFF', status: 'total' },
    {
      title: '启用指标数',
      value: enabled,
      color: '#67C23A',
      status: 'enabled',
    },
    { title: '预警指标数', value: warned, color: '#F56C6C', status: 'warned' },
    {
      title: '平均得分',
      value: avg,
      color: '#E6A23C',
      status: 'avg',
      suffix: '分',
    },
  ];
});

// 柱状图配置（适配后端 evaluatorTypeCount 和 scoreTypeCount）
const barOptions = computed(() => [
  {
    title: '评价人类型分布',
    type: 'evaluatorType',
    getData: () => {
      const data = overviewData.value.evaluatorTypeCount || {};
      // 后端键名：teacher, parent, leader
      const xData = ['教职工', '家长', '领导'];
      const seriesData = [
        {
          name: '指标数量',
          data: [data.teacher || 0, data.parent || 0, data.leader || 0],
        },
      ];
      return { xData, seriesData };
    },
  },
  {
    title: '计分方式分布',
    type: 'scoreType',
    getData: () => {
      const data = overviewData.value.scoreTypeCount || {};
      // 后端键名已经是中文："累计赋分", "接口赋分"
      const xData = ['累计赋分', '接口赋分'];
      const seriesData = [
        {
          name: '指标数量',
          data: [data['累计赋分'] || 0, data['接口赋分'] || 0],
        },
      ];
      return { xData, seriesData };
    },
  },
]);

const activeBarIndex = ref(0);
const currentBarData = computed(
  () =>
    barOptions.value[activeBarIndex.value]?.getData() || {
      xData: [],
      seriesData: [],
    },
);
const currentBarTitle = computed(
  () => barOptions.value[activeBarIndex.value]?.title || '',
);

const handleBarChange = (index) => {
  activeBarIndex.value = index;
};

// 饼图配置（适配 statusCount 和 scoreDistribution）
const pieOptions = computed(() => [
  {
    title: '状态分布',
    type: 'status',
    getData: () => {
      const status = overviewData.value.statusCount || {
        disable: 0,
        enable: 0,
      };
      return [
        { name: '未启用', value: status.disable || 0 },
        { name: '已启用', value: status.enable || 0 },
      ];
    },
  },
  {
    title: '指标得分分布',
    type: 'scoreDistribution',
    getData: () => {
      const distributionArray = overviewData.value.scoreDistribution || [];
      if (distributionArray.length === 0) return [];
      const distObj = distributionArray[0];
      // 将对象转换为 { name: range, value: count } 数组
      return Object.entries(distObj).map(([range, count]) => ({
        name: range,
        value: count,
      }));
    },
  },
]);

const activePieIndex = ref(0);
const currentPieData = computed(
  () => pieOptions.value[activePieIndex.value]?.getData() || [],
);
const currentPieTitle = computed(
  () => pieOptions.value[activePieIndex.value]?.title || '',
);

const handlePieChange = (index) => {
  activePieIndex.value = index;
};

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handleBarClickWrapper = (name) => {
  const currentType = barOptions.value[activeBarIndex.value]?.type;
  if (currentType === 'evaluatorType') {
    // 将中文名称映射回英文键名
    let value = name;
    if (name === '教职工') value = 'teacher';
    if (name === '家长') value = 'parent';
    if (name === '领导') value = 'leader';
    emit('barSelect', { field: 'evaluatorType', value });
  } else if (currentType === 'scoreType') {
    emit('barSelect', { field: 'scoreType', value: name });
  }
};

const handlePieClickWrapper = (item) => {
  const currentType = pieOptions.value[activePieIndex.value]?.type;
  if (currentType === 'status') {
    let status = '';
    if (item.name === '未启用') status = 'disable';
    if (item.name === '已启用') status = 'enable';
    if (status) emit('cardSelect', status);
  } else if (currentType === 'scoreDistribution') {
    emit('pieSelect', { range: item.name, count: item.value });
  }
};

// 加载图表分布数据（带时间范围参数）
const loadChartData = async () => {
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

    const res = await getTargetMgmtChart(params);
    overviewData.value = res;
  } catch (error) {
    console.warn('图表总览接口失败，使用模拟数据', error);
    overviewData.value = {
      statusCount: { disable: 4, enable: 6 },
      evaluatorTypeCount: { teacher: 5, parent: 2, leader: 3 },
      scoreTypeCount: { 累计赋分: 8, 接口赋分: 2 },
      scoreDistribution: [
        { '0-20': 1, '20-40': 2, '40-60': 3, '60-80': 2, '80-100': 2 },
      ],
    };
  }
};

// 时间范围变化处理
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

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    // 初始化时不传时间参数，让后端返回全部数据
    const [chartRes, indexRes] = await Promise.allSettled([
      getTargetMgmtChart({}),
      getTargetIndex(),
    ]);
    if (chartRes.status === 'fulfilled') {
      overviewData.value = chartRes.value;
    } else {
      console.warn('分布接口失败，使用模拟数据');
      overviewData.value = {
        statusCount: { disable: 4, enable: 6 },
        evaluatorTypeCount: { teacher: 5, parent: 2, leader: 3 },
        scoreTypeCount: { 累计赋分: 8, 接口赋分: 2 },
        scoreDistribution: [
          { '0-20': 1, '20-40': 2, '40-60': 3, '60-80': 2, '80-100': 2 },
        ],
      };
    }
    if (indexRes.status === 'fulfilled') {
      indexData.value = indexRes.value;
    } else {
      console.warn('核心指标接口失败，使用模拟数据');
      indexData.value = {
        totalTargetCount: 10,
        enabledTargetCount: 8,
        warnTargetCount: 1,
        avgScore: 78.5,
      };
    }
  } catch (error) {
    console.error('加载图表数据失败', error);
    overviewData.value = {
      statusCount: { disable: 4, enable: 6 },
      evaluatorTypeCount: { teacher: 5, parent: 2, leader: 3 },
      scoreTypeCount: { 累计赋分: 8, 接口赋分: 2 },
      scoreDistribution: [
        { '0-20': 1, '20-40': 2, '40-60': 3, '60-80': 2, '80-100': 2 },
      ],
    };
    indexData.value = {
      totalTargetCount: 10,
      enabledTargetCount: 8,
      warnTargetCount: 1,
      avgScore: 78.5,
    };
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
    <!-- 左侧卡片区 -->
    <div class="box-left" style="flex: 1 !important">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>

    <!-- 柱状图区域（带下拉选择器） -->
    <div class="bar-chart-area bar-chart-container">
      <div class="chart-select-wrapper">
        <ElSelect
          v-model="activeBarIndex"
          size="small"
          @change="handleBarChange"
        >
          <ElOption
            v-for="(opt, idx) in barOptions"
            :key="idx"
            :label="opt.title"
            :value="idx"
          />
        </ElSelect>
      </div>
      <Bar
        style="flex: 1 !important"
        :title="currentBarTitle"
        :x-data="currentBarData.xData"
        :series-data="currentBarData.seriesData"
        y-name="指标数量"
        @bar-click="handleBarClickWrapper"
      />
    </div>

    <!-- 饼图区域（带下拉选择器） -->
    <div class="pie-chart-area">
      <div class="chart-select-wrapper">
        <ElSelect
          v-model="activePieIndex"
          size="small"
          @change="handlePieChange"
        >
          <ElOption
            v-for="(opt, idx) in pieOptions"
            :key="idx"
            :label="opt.title"
            :value="idx"
          />
        </ElSelect>
      </div>
      <!-- 时间范围选择器（只针对 getTargetMgmtChart 接口） -->
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
      <Pie
        style="flex: 1 !important"
        :title-text="currentPieTitle"
        :data="currentPieData"
        @pie-click="handlePieClickWrapper"
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

  /* 柱状图容器特殊样式，用于绝对定位时间选择器 */
  .bar-chart-container {
    position: relative;
  }

  .date-range-wrapper {
    position: absolute;
    top: 8px;
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
