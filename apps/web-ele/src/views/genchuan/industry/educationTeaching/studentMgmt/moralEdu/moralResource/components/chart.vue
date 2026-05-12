<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElSelect, ElOption, ElDatePicker } from 'element-plus';
import Bar from '#/genchuan-components/stats/barClick.vue';
import LineChart from '#/genchuan-components/stats/lineChartClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import {
  getMoralResourceChart,
  getMoralResourceCount,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/moralEdu/moralResource/data.js';

const loading = ref(true);
const chartData = ref({});
const typeCountData = ref({});

// 时间范围选择器相关
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

// ========== 饼图配置 ==========
const pieOptions = computed(() => [
  {
    title: '资源类型分布',
    type: 'resourceType',
    getData: () => {
      const typeCount = chartData.value.resourceTypeCount || {};
      return [
        { name: '课程', value: typeCount['课程'] || 0 },
        { name: '图书', value: typeCount['图书'] || 0 },
        { name: '专题包', value: typeCount['专题包'] || 0 },
      ];
    },
  },
  {
    title: '学习完成率分布',
    type: 'learnRate',
    getData: () => {
      const typeList = typeCountData.value.typeList || [];
      const learnRateList = typeCountData.value.learnRateList || [];
      return typeList.map((name, idx) => ({ name, value: learnRateList[idx] || 0 }));
    },
  },
]);

const activePieIndex = ref(0);
const currentPieData = computed(() => pieOptions.value[activePieIndex.value]?.getData() || []);
const currentPieTitle = computed(() => pieOptions.value[activePieIndex.value]?.title || '');

const handlePieChange = (index) => {
  activePieIndex.value = index;
};

// ========== 柱状图数据（固定为资源状态分布） ==========
const barData = computed(() => {
  const status = chartData.value.statusCount || {};
  return {
    xData: ['未上架', '已上架'],
    seriesData: [
      { name: '资源数量', data: [status['未上架'] || 0, status['已上架'] || 0] },
    ],
  };
});

// ========== 折线图配置 ==========
const lineOptions = computed(() => [
  {
    title: '月度学习人数趋势',
    type: 'learnCount',
    getData: () => {
      const trend = chartData.value.learnTrend || [];
      const sorted = [...trend].sort((a, b) => new Date(a.date) - new Date(b.date));
      return {
        xData: sorted.map(item => item.date),
        seriesData: [{ name: '学习人数', data: sorted.map(item => item.count) }],
      };
    },
    yName: '学习人数',
  },
  {
    title: '月度学习完成率趋势',
    type: 'learnRate',
    getData: () => {
      const trend = chartData.value.rateTrend || [];
      const sorted = [...trend].sort((a, b) => new Date(a.date) - new Date(b.date));
      return {
        xData: sorted.map(item => item.date),
        seriesData: [{ name: '完成率(%)', data: sorted.map(item => item.rate) }],
      };
    },
    yName: '完成率(%)',
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

const emit = defineEmits(['barSelect', 'pieSelect', 'lineSelect']);

const handlePieClick = (item) => {
  const currentType = pieOptions.value[activePieIndex.value]?.type;
  if (currentType === 'resourceType') {
    emit('pieSelect', { field: 'resourceType', value: item.name });
  }
};

const handleBarClick = (name) => {
  emit('barSelect', { field: 'status', value: name });
};

const handleLineClick = (date) => {
  emit('lineSelect', { field: 'month', value: date });
};

const loadChartData = async () => {
  try {
    const params = {};
    if (dateRange.value && dateRange.value.length === 2) {
      const startDate = dateRange.value[0];
      const endDate = dateRange.value[1];
      if (startDate) {
        params.startTime = formatLocalDateTime(startDate);
      }
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        params.endTime = formatLocalDateTime(endDateTime);
      }
    }
    const res = await getMoralResourceChart(params);
    chartData.value = res;
  } catch (error) {
    console.warn('图表总览接口失败，使用模拟数据', error);
    chartData.value = {
      statusCount: { unOnlineCount: 3, onlineCount: 17 },
      resourceTypeCount: { courseCount: 10, bookCount: 6, packageCount: 4 },
      learnTrend: [
        { date: '2025-07', count: 1 },
        { date: '2025-08', count: 8 },
        { date: '2025-09', count: 1 },
      ],
      rateTrend: [
        { date: '2025-07', rate: 58.2 },
        { date: '2025-08', rate: 81.53 },
        { date: '2025-09', rate: 65.3 },
      ],
    };
  }
};

const loadCountData = async () => {
  try {
    const params = {};
    if (dateRange.value && dateRange.value.length === 2) {
      const startDate = dateRange.value[0];
      const endDate = dateRange.value[1];
      if (startDate) {
        params.startTime = formatLocalDateTime(startDate);
      }
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        params.endTime = formatLocalDateTime(endDateTime);
      }
    }
    const res = await getMoralResourceCount(params);
    typeCountData.value = res;
  } catch (error) {
    console.warn('资源数量统计接口失败，使用模拟数据', error);
    typeCountData.value = {
      typeList: ['课程', '图书', '专题包'],
      resourceCountList: [10, 6, 4],
      learnRateList: [85.5, 78.0, 90.0],
    };
  }
};

const handleDateRangeChange = async () => {
  if (dateRange.value && dateRange.value.length === 2) {
    loading.value = true;
    try {
      await Promise.all([loadChartData(), loadCountData()]);
    } finally {
      loading.value = false;
    }
  }
};

const loadData = async () => {
  loading.value = true;
  try {
    const [chartRes, countRes] = await Promise.allSettled([
      getMoralResourceChart({}),
      getMoralResourceCount({}),
    ]);
    if (chartRes.status === 'fulfilled') {
      chartData.value = chartRes.value;
    } else {
      console.warn('图表总览接口失败，使用模拟数据');
      chartData.value = {
        statusCount: { unOnlineCount: 3, onlineCount: 17 },
        resourceTypeCount: { courseCount: 10, bookCount: 6, packageCount: 4 },
        learnTrend: [
          { date: '2025-07', count: 1 },
          { date: '2025-08', count: 8 },
          { date: '2025-09', count: 1 },
        ],
        rateTrend: [
          { date: '2025-07', rate: 58.2 },
          { date: '2025-08', rate: 81.53 },
          { date: '2025-09', rate: 65.3 },
        ],
      };
    }
    if (countRes.status === 'fulfilled') {
      typeCountData.value = countRes.value;
    } else {
      console.warn('资源数量统计接口失败，使用模拟数据');
      typeCountData.value = {
        typeList: ['课程', '图书', '专题包'],
        resourceCountList: [10, 6, 4],
        learnRateList: [85.5, 78.0, 90.0],
      };
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
      <!-- 时间范围选择器 -->
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

    <Bar
      style="flex: 1 !important;"
      title="资源状态分布"
      :x-data="barData.xData"
      :series-data="barData.seriesData"
      y-name="资源数量"
      @bar-click="handleBarClick"
    />

    <!-- 折线图区域 -->
    <div class="chart-area">
      <div class="chart-select-wrapper">
        <el-select v-model="activeLineIndex" size="small" @change="handleLineChange">
          <el-option v-for="(opt, idx) in lineOptions" :key="idx" :label="opt.title" :value="idx"/>
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
    flex: 1.5;
    min-width: 280px;
    height: 100%;
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
}
</style>
