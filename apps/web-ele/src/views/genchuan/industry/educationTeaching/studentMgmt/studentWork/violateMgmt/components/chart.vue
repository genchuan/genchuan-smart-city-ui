<script setup>
import { reactive, onMounted, ref, computed } from 'vue';
import { ElMessage, ElDatePicker } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import {
  getViolateMgmtChart,
  getViolateCount,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/studentWork/violateMgmt/data.js';

// 模拟数据（字段与后端一致）
const mockOverview = {
  totalCount: 32,
  pendingCount: 5,
  warnCount: 8,
  highRiskStudentCount: 0,
  violateTypeCount: { appearance: 10, behavior: 18, other: 4 },
};

const mockViolateCount = {
  classCountList: [
    { class_name: '高一(1)班', count: 5 },
    { class_name: '高一(2)班', count: 8 },
    { class_name: '高一(3)班', count: 6 },
    { class_name: '高二(1)班', count: 7 },
    { class_name: '高二(2)班', count: 6 },
  ],
  typeCountList: [
    { typeName: '仪容仪表', count: 10, percent: '31.25' },
    { typeName: '行为违规', count: 18, percent: '56.25' },
    { typeName: '其他', count: 4, percent: '12.5' },
  ],
};

const loading = ref(true);
const overviewData = ref({});
const classCountData = ref([]);
const typeCountData = ref([]);

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

// 卡片列表
const cardList = computed(() => {
  const total = overviewData.value.totalCount || 0;
  const pending = overviewData.value.pendingCount || 0;
  const warn = overviewData.value.warnCount || 0;
  const highRisk = overviewData.value.highRiskStudentCount || 0;
  return [
    { title: '违纪总次数', value: total, color: '#409EFF', status: 'total' },
    { title: '待审批', value: pending, color: '#E6A23C', status: 'pending' },
    { title: '已预警', value: warn, color: '#F56C6C', status: 'warn' },
    { title: '高风险学生', value: highRisk, color: '#909399', status: 'highRisk' },
  ];
});

// 各班级违纪次数柱状图（适配后端字段 class_name）
const barXData = computed(() => classCountData.value.map(item => item.class_name));
const barSeriesData = computed(() => [
  { name: '违纪次数', data: classCountData.value.map(item => item.count) },
]);

// 违纪类型分布饼图（处理 typeName 为 null 的情况）
const pieData = computed(() => {
  return typeCountData.value.map((item, index) => ({
    name: item.typeName || `类型${index + 1}`,
    value: item.count,
  }));
});

const emit = defineEmits(['barClick', 'pieClick', 'cardSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handleBarClick = (className) => {
  emit('barClick', { type: 'class', value: className });
};

const handlePieClick = (item) => {
  emit('pieClick', { type: 'violateType', value: item.name });
};

// 加载预警看板数据（带时间范围参数）
const loadOverviewData = async () => {
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

    const res = await getViolateMgmtChart(params);
    overviewData.value = res;
  } catch (error) {
    console.warn('获取预警看板数据失败，使用模拟数据', error);
    overviewData.value = mockOverview;
  }
};

// 加载违纪次数统计（带时间范围参数）
const loadViolateCountData = async () => {
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

    const res = await getViolateCount(params);
    classCountData.value = res.classCountList || [];
    typeCountData.value = res.typeCountList || [];
  } catch (error) {
    console.warn('获取违纪次数统计失败，使用模拟数据', error);
    classCountData.value = mockViolateCount.classCountList;
    typeCountData.value = mockViolateCount.typeCountList;
  }
};

// 时间范围变化处理
const handleDateRangeChange = async () => {
  if (dateRange.value && dateRange.value.length === 2) {
    loading.value = true;
    try {
      await Promise.all([
        loadOverviewData(),
        loadViolateCountData(),
      ]);
    } finally {
      loading.value = false;
    }
  }
};

const loadChartData = async () => {
  loading.value = true;
  try {
    // 初始化时不传时间参数，让后端返回全部数据
    const [overviewRes, violateCountRes] = await Promise.allSettled([
      getViolateMgmtChart({}),
      getViolateCount({}),
    ]);
    overviewData.value = overviewRes.status === 'fulfilled' ? overviewRes.value : mockOverview;
    if (violateCountRes.status === 'fulfilled') {
      classCountData.value = violateCountRes.value.classCountList || [];
      typeCountData.value = violateCountRes.value.typeCountList || [];
    } else {
      classCountData.value = mockViolateCount.classCountList;
      typeCountData.value = mockViolateCount.typeCountList;
    }
  } catch (error) {
    console.error('加载图表数据失败', error);
    overviewData.value = mockOverview;
    classCountData.value = mockViolateCount.classCountList;
    typeCountData.value = mockViolateCount.typeCountList;
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
    <div class="box-left" style="flex: 1 !important;">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>
    <div class="chart-wrapper bar-chart-container" style="flex: 1.5 !important; position: relative;">
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
      <Bar
        :title="'各班级违纪次数'"
        :x-data="barXData"
        :series-data="barSeriesData"
        y-name="违纪次数"
        @bar-click="handleBarClick"
      />
    </div>
    <Pie
      style="flex: 1 !important;"
      :title-text="'违纪类型分布'"
      :data="pieData"
      @pie-click="handlePieClick"
    />
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
    min-width: 280px;
    position: relative;
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
