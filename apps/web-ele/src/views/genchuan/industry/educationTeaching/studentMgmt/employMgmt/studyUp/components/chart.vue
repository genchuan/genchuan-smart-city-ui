<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElSelect, ElOption, ElDatePicker } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import {
  getStudyUpChart,
  getStudyUpCount,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/employMgmt/studyUp/data.js';

const loading = ref(true);
const chartData = ref({});      // 卡片 + 柱状图
const countData = ref({});      // 饼图

// ========== 时间范围选择器 ==========
const timeRange = ref([]);

// 获取默认时间范围（最近30天，结束时间为当天）
const getDefaultTimeRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 30);
  return [start, end];
};

// 格式化单个日期时间为后端要求的格式（带 T 分隔）
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

// 日期变化重新加载
const handleDateRangeChange = () => {
  loadData();
};

// ========== 数据处理辅助函数 ==========
// 将后端返回的 school_name 转为 schoolName
const transformSchoolTopCount = (list) => {
  if (!Array.isArray(list)) return [];
  return list.map(item => ({
    schoolName: item.school_name || item.schoolName,
    count: item.count,
  }));
};

// 将院校类型英文转中文
const transformSchoolType = (list) => {
  if (!Array.isArray(list)) return [];
  const typeMap = { public: '公办', private: '民办' };
  return list.map(item => ({
    name: typeMap[item.name] || item.name,
    value: item.value,
  }));
};

// 卡片数据
const cardList = computed(() => {
  const total = chartData.value.totalStudent || 0;
  const wait = chartData.value.waitPlanStudent || 0;
  const planned = chartData.value.plannedStudent || 0;
  return [
    {title: '总升学意向学生数', value: total, color: '#409EFF', status: 'total'},
    {title: '待规划学生数', value: wait, color: '#E6A23C', status: 'wait'},
    {title: '已规划学生数', value: planned, color: '#67C23A', status: 'planned'},
  ];
});

// 柱状图数据（热门目标院校）- 处理字段名
const barData = computed(() => {
  const rawSchools = chartData.value.schoolTopCount || [];
  const schools = transformSchoolTopCount(rawSchools);
  return {
    xData: schools.map(item => item.schoolName),
    seriesData: [{name: '学生数', data: schools.map(item => item.count)}],
  };
});

// 饼图数据：升学意向分布（直接使用）
const intentionPieData = computed(() => {
  const dist = countData.value.intentionDistribution || [];
  return dist.map(item => ({name: item.name, value: item.value}));
});

// 饼图数据：院校类型选择分布（需要中英文转换）
const schoolTypePieData = computed(() => {
  const dist = countData.value.schoolTypeDistribution || [];
  return transformSchoolType(dist);
});

// 饼图切换选项
const pieOptions = computed(() => [
  {
    title: '升学意向分布',
    data: intentionPieData.value,
    type: 'intention',
  },
  {
    title: '院校类型选择分布',
    data: schoolTypePieData.value,
    type: 'schoolType',
  },
]);

const activePieIndex = ref(0);
const currentPieData = computed(() => pieOptions.value[activePieIndex.value] || pieOptions.value[0]);

const handlePieChange = (index) => {
  activePieIndex.value = index;
};

const emit = defineEmits(['cardSelect', 'barSelect', 'pieSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handleBarClick = (schoolName) => {
  emit('barSelect', {field: 'schoolName', value: schoolName});
};

const handlePieClick = (item) => {
  const pieType = currentPieData.value.type;
  if (pieType === 'intention') {
    emit('pieSelect', {field: 'intention', value: item.name});
  } else if (pieType === 'schoolType') {
    emit('pieSelect', {field: 'schoolType', value: item.name});
  }
};

// ========== 加载数据 ==========
const loadData = async () => {
  loading.value = true;
  try {
    const timeRangeParam = getTimeRangeParam();
    const [chartRes, countRes] = await Promise.allSettled([
      getStudyUpChart({timeRange: timeRangeParam}),
      getStudyUpCount({timeRange: timeRangeParam}),
    ]);
    if (chartRes.status === 'fulfilled') {
      chartData.value = chartRes.value;
    } else {
      console.warn('看板接口失败，使用模拟数据', chartRes.reason);
      chartData.value = {
        totalStudent: 128,
        waitPlanStudent: 32,
        plannedStudent: 96,
        schoolTopCount: [
          {school_name: '福建师范大学', count: 28},
          {school_name: '华侨大学', count: 22},
          {school_name: '福州大学', count: 18},
          {school_name: '其他', count: 60},
        ],
      };
    }
    if (countRes.status === 'fulfilled') {
      countData.value = countRes.value;
    } else {
      console.warn('统计接口失败，使用模拟数据', countRes.reason);
      countData.value = {
        intentionDistribution: [
          {name: '专升本', value: 86},
          {name: '考研', value: 32},
          {name: '其他', value: 10},
        ],
        schoolTypeDistribution: [
          {name: 'public', value: 92},
          {name: 'private', value: 36},
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
    <!-- 左侧卡片 -->
    <div class="chart-box-left">
      <Indicator class="left-card" v-for="item in cardList" :key="item.title" v-bind="item"
                 @click="handleCardClick"/>
    </div>

    <!-- 柱状图区域（含日期选择器） -->
    <div class="bar-chart-container" style="flex: 1.5 !important; position: relative;">
      <!-- 日期范围选择器（紧凑样式，位于柱状图右上角） -->
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
      <Bar
        title="热门目标院校"
        :x-data="barData.xData"
        :series-data="barData.seriesData"
        y-name="学生数"
        @bar-click="handleBarClick"
      />
    </div>

    <!-- 饼图区域（带下拉切换） -->
    <div class="chart-area pie-chart-container" style="flex: 1 !important; position: relative;">
      <!-- 下拉切换 -->
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
      <Pie
        style="flex: 1 !important;"
        :title-text="currentPieData.title"
        :data="currentPieData.data"
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

  .chart-box-left {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 280px;
    max-width: 320px;
    margin: 0;
  }

  .bar-chart-container {
    position: relative;
    flex: 1.5;
    min-width: 280px;
    margin-left: 12px;
  }

  .chart-area {
    position: relative;
    flex: 1;
    min-width: 280px;
    height: 100%;
    margin-left: 12px;
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
