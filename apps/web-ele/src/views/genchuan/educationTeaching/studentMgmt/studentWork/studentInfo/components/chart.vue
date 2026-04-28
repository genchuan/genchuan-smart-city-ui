<script setup>
import { reactive, onMounted, ref, computed } from 'vue';
import { ElMessage, ElSelect, ElOption, ElDatePicker } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import {
  getStudentInfoChart,
  getStudentInfoDistribution,
  getStudentInfoCoreIndex,
} from '#/api/genchuan/educationTeaching/studentMgmt/studentWork/studentInfo/data.js';

// 模拟分布数据（最终 fallback）
const mockDistribution = {
  grade: [
    { name: '2021级', count: 320 },
    { name: '2022级', count: 310 },
    { name: '2023级', count: 305 },
    { name: '2024级', count: 321 },
  ],
  major: [
    {name: '计算机科学与技术', count: 328},
    {name: '软件工程', count: 286},
    {name: '电子信息工程', count: 252},
    {name: '网络工程', count: 215},
    {name: '数据科学与大数据技术', count: 175},
  ],
  class: [
    {name: '计算机1班', count: 45},
    {name: '计算机2班', count: 42},
    {name: '软件1班', count: 48},
    {name: '软件2班', count: 50},
    {name: '电子1班', count: 40},
  ],
};

// 将 count 字段转换为 value（Pie 组件需要 {name, value}）
const convertToPieData = (data) => {
  return data.map(item => ({name: item.name, value: item.count}));
};

const loading = ref(true);
const overviewData = ref({});
const distributionData = ref({grade: [], major: [], class: []});
const coreIndexData = ref([]);

const activeDistribution = ref('grade');

// 时间范围选择器相关（只针对核心指标接口）
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

// 计算当前饼图数据（转换为 Pie 组件所需格式）
const distributionPieData = computed(() => {
  const raw = distributionData.value[activeDistribution.value] || [];
  return convertToPieData(raw);
});

// 饼图标题映射
const pieTitleMap = {
  grade: '年级分布',
  major: '专业分布',
  class: '班级分布'
};

// 修改：使用后端实际字段名
const cardList = computed(() => {
  const total = overviewData.value.totalStudentCount || 0;
  const inSchool = overviewData.value.inSchoolCount || 0;
  const transfer = overviewData.value.transferCount || 0;
  const suspend = overviewData.value.suspendCount || 0;
  const dropOut = overviewData.value.dropOutCount || 0;
  const abnormal = transfer + suspend + dropOut;
  return [
    {title: '学生总人数', value: total, color: '#409EFF', status: 'total'},
    {title: '在籍人数', value: inSchool, color: '#67C23A', status: 'inSchool'},
    {title: '异动人数', value: abnormal, color: '#E6A23C', status: 'abnormal'},
  ];
});

const barState = reactive({
  title: '学生核心指标趋势',
  xData: [],
  seriesData: [],
  yName: '人数',
});

const updateBarTrend = () => {
  const data = coreIndexData.value;
  if (data.length === 0) return;
  barState.xData = data.map(item => item.date);
  barState.seriesData = [
    {name: '新增学生数', data: data.map(item => item.newStudentCount)},
    {name: '学籍异动数', data: data.map(item => item.statusChangeCount)},
  ];
  barState.title = '学生核心指标趋势';
};

const emit = defineEmits(['pieSelect', 'barSelect', 'cardSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handlePieClick = (item) => {
  let filterField = '';
  let filterValue = item.name;
  if (activeDistribution.value === 'grade') filterField = 'grade';
  else if (activeDistribution.value === 'major') filterField = 'major';
  else if (activeDistribution.value === 'class') filterField = 'className';
  emit('pieSelect', {field: filterField, value: filterValue});
};

const handleBarClick = (date) => {
  emit('barSelect', date);
};

// 独立的分布数据获取函数（供切换选项卡时调用）
const fetchDistribution = async (dimension) => {
  try {
    const data = await getStudentInfoDistribution({dimension});
    // 接口返回的数据可能已经是 {name, count} 格式
    distributionData.value[dimension] = data;
  } catch (error) {
    console.warn(`获取${dimension}分布数据失败，使用模拟数据`, error);
    distributionData.value[dimension] = mockDistribution[dimension] || [];
  }
};

// 切换分布维度
const changeDistribution = async (dimension) => {
  // 如果当前维度数据为空，则请求
  if (!distributionData.value[dimension] || distributionData.value[dimension].length === 0) {
    await fetchDistribution(dimension);
  }
};

// 加载核心指标数据（带时间范围参数）
const loadCoreIndexData = async () => {
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

    const res = await getStudentInfoCoreIndex(params);
    coreIndexData.value = res;
    updateBarTrend();
  } catch (error) {
    console.error('加载核心指标数据失败', error);
    coreIndexData.value = [
      {date: '2025-01', newStudentCount: 45, statusChangeCount: 3},
      {date: '2025-02', newStudentCount: 12, statusChangeCount: 1},
      {date: '2025-03', newStudentCount: 8, statusChangeCount: 5},
    ];
    updateBarTrend();
  }
};

// 时间范围变化处理
const handleDateRangeChange = () => {
  if (dateRange.value && dateRange.value.length === 2) {
    loadCoreIndexData();
  }
};

// 加载所有图表数据
const loadAllChartData = async () => {
  loading.value = true;
  try {
    const [overviewRes, gradeRes, majorRes, classRes] = await Promise.allSettled([
      getStudentInfoChart({}),
      getStudentInfoDistribution({dimension: 'grade'}),
      getStudentInfoDistribution({dimension: 'major'}),
      getStudentInfoDistribution({dimension: 'class'}),
    ]);

    if (overviewRes.status === 'fulfilled') {
      overviewData.value = overviewRes.value;
    } else {
      // 使用后端字段名的模拟数据
      overviewData.value = {
        totalStudentCount: 1256,
        inSchoolCount: 1220,
        suspendCount: 15,
        dropOutCount: 9,
        transferCount: 12,
        normalStudentCount: 1100,
        specialStudentCount: 156,
        transferStudentCount: 12,
      };
    }

    distributionData.value.grade = gradeRes.status === 'fulfilled' ? gradeRes.value : mockDistribution.grade;
    distributionData.value.major = majorRes.status === 'fulfilled' ? majorRes.value : mockDistribution.major;
    distributionData.value.class = classRes.status === 'fulfilled' ? classRes.value : mockDistribution.class;

    // 单独加载核心指标数据（带时间范围）
    await loadCoreIndexData();
  } catch (error) {
    console.error('加载图表数据失败', error);
    // 设置默认数据（使用后端字段名）
    overviewData.value = {
      totalStudentCount: 1256,
      inSchoolCount: 1220,
      suspendCount: 15,
      dropOutCount: 9,
      transferCount: 12,
      normalStudentCount: 1100,
      specialStudentCount: 156,
      transferStudentCount: 12,
    };
    distributionData.value = mockDistribution;
    coreIndexData.value = [
      {date: '2025-01', newStudentCount: 45, statusChangeCount: 3},
      {date: '2025-02', newStudentCount: 12, statusChangeCount: 1},
      {date: '2025-03', newStudentCount: 8, statusChangeCount: 5},
    ];
    updateBarTrend();
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadAllChartData();
});
</script>

<template>
  <div v-loading="loading" class="chart-box">
    <div class="chart-box-left" style="flex: 1 !important;">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>
    <div class="chart-wrapper pie-chart-container" style="flex: 1 !important;">
      <!-- 下拉选择器 -->
      <div class="pie-select-wrapper">
        <el-select
          v-model="activeDistribution"
          size="small"
          @change="changeDistribution"
        >
          <el-option label="年级分布" value="grade"/>
          <el-option label="专业分布" value="major"/>
          <el-option label="班级分布" value="class"/>
        </el-select>
      </div>
      <Pie
        :title-text="pieTitleMap[activeDistribution]"
        :data="distributionPieData"
        @pie-click="handlePieClick"
      />
    </div>
    <div class="chart-wrapper bar-chart-container" style="flex: 1.5 !important;">
      <!-- 时间范围选择器（只针对核心指标接口） -->
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
        :title="barState.title"
        :x-data="barState.xData"
        :series-data="barState.seriesData"
        :y-name="barState.yName"
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

  .chart-box-left {
    display: flex;
    flex: 0 0 max(280px, min(25vw, 320px));
    flex-direction: column;
    gap: 12px;
    min-width: 200px;
    max-width: 240px;
    margin: 0;
  }

  .chart-wrapper {
    display: flex;
    flex-direction: column;
    min-width: 280px;
    position: relative;
  }

  /* 饼图容器特殊样式，用于绝对定位下拉选择器 */
  .pie-chart-container {
    position: relative;
  }

  .pie-select-wrapper {
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
