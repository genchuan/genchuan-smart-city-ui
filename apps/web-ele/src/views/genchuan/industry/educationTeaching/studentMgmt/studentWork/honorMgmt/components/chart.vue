<script setup>
import { reactive, onMounted, ref, computed } from 'vue';
import { ElMessage, ElSelect, ElOption, ElDatePicker } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import {
  getHonorMgmtChart,
  getHonorCount,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/studentWork/honorMgmt/data.js';

const mockClassData = [
  { name: '计算机1班', count: 45 },
  { name: '计算机2班', count: 42 },
  { name: '软件1班', count: 48 },
  { name: '软件2班', count: 50 },
  { name: '电子1班', count: 40 },
];
const mockTypeData = [
  { name: '优秀学生', count: 128 },
  { name: '奖学金', count: 86 },
  { name: '竞赛获奖', count: 92 },
  { name: '其他', count: 22 },
];

const loading = ref(true);
const overviewData = ref({});
const chartData = ref({ class: [], type: [] });

const activeDimension = ref('type');
const barTitleMap = { type: '各类型荣誉数量', class: '各班级荣誉数量' };
const barYName = '荣誉数量';

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

const currentBarData = computed(() => {
  const raw = chartData.value[activeDimension.value] || [];
  return {
    xData: raw.map(item => item.name),
    seriesData: [{ name: '荣誉数量', data: raw.map(item => item.count) }]
  };
});

const cardList = computed(() => {
  const total = overviewData.value.totalHonorCount || 0;
  const pending = overviewData.value.pendingAuditCount || 0;
  const todayPush = overviewData.value.todayPushCount || 0;
  const excellent = overviewData.value.excellentStudentCount || 0;
  return [
    { title: '荣誉记录总数', value: total, color: '#409EFF', status: 'total' },
    { title: '待审核数', value: pending, color: '#E6A23C', status: 'pending' },
    { title: '今日推送数', value: todayPush, color: '#67C23A', status: 'todayPush' },
    { title: '优秀学生数', value: excellent, color: '#F56C6C', status: 'excellent' },
  ];
});

// ========== 核心修改：所有点击改为派发自定义事件 ==========
// 卡片点击映射
const handleCardClick = (cardInfo) => {
  let filterType = null;
  let filterValue = null;
  switch (cardInfo.status) {
    case 'pending':   // 待审核数 → 筛选状态为“待审核”
      filterType = 'status';
      filterValue = '待审核';
      break;
    case 'todayPush': // 今日推送数 → 筛选状态为“已推送”（注意：列表状态字段可能需要是“已推送”）
      filterType = 'status';
      filterValue = '已推送';
      break;
    case 'excellent': // 优秀学生数 → 可按荣誉类型筛选“优秀学生”
      filterType = 'honorType';
      filterValue = '优秀学生';
      break;
    case 'total':
    default:
      // 荣誉记录总数不触发筛选
      return;
  }
  window.dispatchEvent(new CustomEvent('honor-chart-filter', {
    detail: { type: filterType, value: filterValue }
  }));
};

// 柱状图点击：根据当前维度派发不同筛选字段
const handleBarClick = (name) => {
  if (activeDimension.value === 'class') {
    window.dispatchEvent(new CustomEvent('honor-chart-filter', {
      detail: { type: 'className', value: name }
    }));
  } else {
    window.dispatchEvent(new CustomEvent('honor-chart-filter', {
      detail: { type: 'honorType', value: name }
    }));
  }
};

const changeDimension = async (dimension) => {
  activeDimension.value = dimension;
  if (!chartData.value[dimension] || chartData.value[dimension].length === 0) {
    await fetchChartData(dimension);
  }
};

const fetchChartData = async (dimension) => {
  try {
    const params = { dimension };
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
    const data = await getHonorCount(params);
    chartData.value[dimension] = data;
  } catch (error) {
    console.warn(`获取${dimension}荣誉数量失败，使用模拟数据`, error);
    chartData.value[dimension] = dimension === 'class' ? mockClassData : mockTypeData;
  }
};

const handleDateRangeChange = async () => {
  if (dateRange.value && dateRange.value.length === 2) {
    await fetchChartData(activeDimension.value);
  }
};

const loadAllChartData = async () => {
  loading.value = true;
  try {
    const [overviewRes, classRes, typeRes] = await Promise.allSettled([
      getHonorMgmtChart({}),
      getHonorCount({ dimension: 'class' }),
      getHonorCount({ dimension: 'type' }),
    ]);
    if (overviewRes.status === 'fulfilled') overviewData.value = overviewRes.value;
    else overviewData.value = { totalHonorCount: 328, pendingAuditCount: 12, todayPushCount: 8, excellentStudentCount: 128, scholarshipCount: 86, competitionCount: 92 };
    chartData.value.class = classRes.status === 'fulfilled' ? classRes.value : mockClassData;
    chartData.value.type = typeRes.status === 'fulfilled' ? typeRes.value : mockTypeData;
  } catch (error) { console.error('加载图表数据失败', error); }
  finally { loading.value = false; }
};

onMounted(() => {
  loadAllChartData();
});
</script>

<template>
  <div v-loading="loading" class="chart-box">
    <div class="box-left">
      <Indicator class="left-card" v-for="item in cardList" :key="item.title" v-bind="item"
                 @click="handleCardClick" />
    </div>
    <div class="chart-wrapper bar-chart-container">
      <div class="bar-select-wrapper">
        <el-select v-model="activeDimension" size="small" @change="changeDimension">
          <el-option label="各类型荣誉数量" value="type" />
          <el-option label="各班级荣誉数量" value="class" />
        </el-select>
      </div>
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
      <Bar
        :title="barTitleMap[activeDimension]"
        :x-data="currentBarData.xData"
        :series-data="currentBarData.seriesData"
        :y-name="barYName"
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
    .left-card { height: 150px !important; }
  }

  .chart-wrapper {
    display: flex;
    flex-direction: column;
    min-width: 280px;
    position: relative;
    flex: 2;
  }

  .bar-select-wrapper {
    position: absolute;
    top: 8px;
    right: 10px;
    z-index: 10;
  }

  .bar-chart-container { position: relative; }
  .date-range-wrapper {
    position: absolute;
    top: 8px;
    left: 10px;
    z-index: 10;
  }

  :deep(.el-date-editor) {
    --el-date-editor-width: 240px;
    .el-range__icon { margin-right: 2px; }
    .el-range-separator { padding: 0 4px; }
    .el-range__close-icon { margin-left: 2px; }
  }
}
</style>
