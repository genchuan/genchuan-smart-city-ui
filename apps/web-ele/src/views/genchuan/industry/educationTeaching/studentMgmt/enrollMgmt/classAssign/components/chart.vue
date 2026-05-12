<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElSelect, ElOption, ElDatePicker } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import lineChart from '#/genchuan-components/stats/lineChartClick.vue';
import {
  getClassAssignChart,
  getClassAssignDistribution,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/enrollMgmt/classAssign/data.js';

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

// 卡片数据
const cardList = computed(() => {
  const total = chartData.value.totalAssignTaskCount || 0;
  const unassigned = chartData.value.unassignedCount || 0;
  const assigned = chartData.value.assignedCount || 0;
  const totalStudents = chartData.value.totalAssignedStudentCount || 0;
  return [
    { title: '总分班任务数', value: total, color: '#409EFF', status: 'total' },
    { title: '未分班任务数', value: unassigned, color: '#E6A23C', status: 'unassigned' },
    { title: '已分班任务数', value: assigned, color: '#67C23A', status: 'assigned' },
    { title: '已分班学生总数', value: totalStudents, color: '#909399', status: 'totalStudents' },
  ];
});

// 近一周分班趋势折线图
const lineData = computed(() => {
  const trend = chartData.value.recentWeekAssignTrend || [];
  return {
    xAxis: trend.map(item => item.date),
    series: [{ name: '分班学生数', data: trend.map(item => item.count) }],
  };
});

// 班级人数饼图数据（兼容后端返回的 value 字段和模拟数据的 studentCount 字段）
const classPieData = computed(() => {
  const data = distributionData.value.classStudentCount || [];
  return data.map(item => ({
    name: item.className,
    value: item.value ?? item.studentCount,  // 优先使用 value，兼容 studentCount
  }));
});

// 专业分班占比饼图数据（后端直接使用 value 字段）
const majorPieData = computed(() => {
  const data = distributionData.value.majorAssignRate || [];
  return data.map(item => ({ name: item.name, value: item.value }));
});

// 饼图切换选项
const pieOptions = computed(() => [
  { type: 'class', title: '各班级人数分布', data: classPieData.value },
  { type: 'major', title: '专业分班占比', data: majorPieData.value },
]);

const activePieIndex = ref(0);
const currentPie = computed(() => pieOptions.value[activePieIndex.value] || pieOptions.value[0]);

const handlePieChange = (index) => {
  activePieIndex.value = index;
};

const emit = defineEmits(['cardSelect', 'pieSelect', 'lineSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handlePieClick = (params) => {
  emit('pieSelect', {
    name: params.name,
    type: currentPie.value.type,
  });
};

const handleLineClick = (params) => {
  emit('lineSelect', { field: 'date', value: params.xValue });
};

const loadData = async () => {
  loading.value = true;
  try {
    const timeRangeParam = getTimeRangeParam();
    const [chartRes, distRes] = await Promise.allSettled([
      getClassAssignChart({ timeRange: timeRangeParam }),
      getClassAssignDistribution({ timeRange: timeRangeParam }),
    ]);
    if (chartRes.status === 'fulfilled') {
      chartData.value = chartRes.value;
    } else {
      chartData.value = {
        totalAssignTaskCount: 12,
        unassignedCount: 3,
        assignedCount: 9,
        totalAssignedStudentCount: 586,
        recentWeekAssignTrend: [
          { date: '2025-03-25', count: 68 },
          { date: '2025-03-26', count: 85 },
          { date: '2025-03-27', count: 135 },
          { date: '2025-03-28', count: 72 },
          { date: '2025-03-29', count: 42 },
          { date: '2025-03-30', count: 12 },
          { date: '2025-03-31', count: 12 },
        ],
      };
    }
    if (distRes.status === 'fulfilled') {
      distributionData.value = distRes.value;
    } else {
      distributionData.value = {
        classStudentCount: [
          { className: '2025级计算机1班', studentCount: 48 },
          { className: '2025级计算机2班', studentCount: 47 },
          { className: '2025级电商1班', studentCount: 45 },
          { className: '2025级机电1班', studentCount: 48 },
          { className: '2025级会计1班', studentCount: 43 },
          { className: '2025级学前1班', studentCount: 41 },
        ],
        majorAssignRate: [
          { name: '计算机应用技术', value: 0.28 },
          { name: '电子商务', value: 0.20 },
          { name: '机电一体化', value: 0.19 },
          { name: '会计电算化', value: 0.17 },
          { name: '学前教育', value: 0.16 },
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
    <div class="box-left">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>

    <!-- 折线图区域（含日期选择器） -->
    <div class="line-chart-container" style="flex: 1.5 !important; position: relative;">
      <!-- 日期范围选择器（紧凑样式，位于右上角） -->
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
        title="近一周分班趋势"
        :x-data="lineData.xAxis"
        :series-data="lineData.series"
        y-name="分班学生数"
        @line-click="handleLineClick"
      />
    </div>

    <div class="chart-area">
      <div class="chart-select-wrapper">
        <el-select v-model="activePieIndex" size="small" @change="handlePieChange">
          <el-option v-for="(opt, idx) in pieOptions" :key="idx" :label="opt.title" :value="idx" />
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
