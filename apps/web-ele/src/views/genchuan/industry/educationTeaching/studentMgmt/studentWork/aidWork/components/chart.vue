<script setup>
import {reactive, onMounted, ref, computed} from 'vue';
import {ElMessage, ElSelect, ElOption, ElDatePicker} from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import {
  getAidWorkChart,
  getApplyCount,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/studentWork/aidWork/data.js';

// 资助类型映射（后端 type 数字转中文）
const aidTypeMap = {
  '1': '奖学金',
  '2': '助学金',
  '3': '助学贷款',
  '4': '勤工俭学'
};

const loading = ref(true);
const chartData = ref({});
const typeApplyData = ref([]); // 存储后端返回的数组，每个元素有 type, applyCount, finishCount, finishRate

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
  const totalCount = chartData.value.totalApplyCount || 0;
  const totalPass = chartData.value.totalPassCount || 0;
  const totalAmount = chartData.value.totalApplyAmount || 0;
  const totalGrant = chartData.value.totalGrantAmount || 0;
  return [
    {title: '总申请数', value: totalCount, color: '#409EFF', status: 'total'},
    {title: '总通过数', value: totalPass, color: '#67C23A', status: 'passed'},
    {title: '总申请金额', value: `¥${totalAmount.toFixed(2)}`, color: '#E6A23C', status: 'amount'},
    {title: '总发放金额', value: `¥${totalGrant.toFixed(2)}`, color: '#F56C6C', status: 'grant'},
  ];
});

// 各状态申请数量饼图数据
const statusPieData = computed(() => {
  const map = chartData.value.statusCountMap || {};
  return Object.entries(map).map(([name, value]) => ({name, value}));
});

// 各资助类型申请数量饼图数据
const typePieData = computed(() => {
  const map = chartData.value.typeCountMap || {};
  return Object.entries(map).map(([name, value]) => ({name, value}));
});

// 饼图切换选项
const pieOptions = computed(() => [
  {
    title: '各状态申请数量',
    data: statusPieData.value,
    type: 'status',
  },
  {
    title: '各资助类型申请数量',
    data: typePieData.value,
    type: 'aidType',
  },
]);

const activePieIndex = ref(0);
const currentPieData = computed(() => pieOptions.value[activePieIndex.value] || pieOptions.value[0]);

const handlePieChange = (index) => {
  activePieIndex.value = index;
};

// 处理 typeApplyData 转换为柱状图需要的格式
// 需要将后端 type 数字转为中文名称，处理 null 值，finishRate 转为百分比
const transformedApplyData = computed(() => {
  return typeApplyData.value.map(item => {
    const typeName = aidTypeMap[item.type] || item.type;
    const finishCount = item.finishCount ?? 0;
    const finishRate = item.finishRate != null ? (item.finishRate * 100).toFixed(1) : 0;
    return {
      name: typeName,
      applyCount: item.applyCount,
      finishCount: finishCount,
      finishRate: parseFloat(finishRate),
    };
  });
});

const barXData = computed(() => transformedApplyData.value.map(item => item.name));
const barApplySeries = computed(() => [{
  name: '申请人数',
  data: transformedApplyData.value.map(item => item.applyCount)
}]);
const barFinishSeries = computed(() => [{
  name: '办理完成人数',
  data: transformedApplyData.value.map(item => item.finishCount)
}]);
const barRateSeries = computed(() => [{
  name: '办理完成率(%)',
  data: transformedApplyData.value.map(item => item.finishRate)
}]);

// 柱状图切换选项
const chartOptions = computed(() => [
  {
    type: 'bar',
    title: '各类型申请人数',
    xData: barXData.value,
    seriesData: barApplySeries.value,
    yName: '人数',
  },
  {
    type: 'bar',
    title: '各类型办理完成人数',
    xData: barXData.value,
    seriesData: barFinishSeries.value,
    yName: '人数',
  },
  {
    type: 'bar',
    title: '各类型办理完成率',
    xData: barXData.value,
    seriesData: barRateSeries.value,
    yName: '完成率(%)',
  },
]);

const activeChartIndex = ref(0);
const currentChart = computed(() => chartOptions.value[activeChartIndex.value] || chartOptions.value[0]);

const handleChartChange = (index) => {
  activeChartIndex.value = index;
};

const emit = defineEmits(['cardClick', 'pieClick', 'barClick']);

const handleCardClick = (cardInfo) => {
  emit('cardClick', cardInfo.status);
};

const handlePieClick = (item) => {
  const pieType = currentPieData.value.type;
  emit('pieClick', {type: pieType, value: item.name});
};

const handleBarClick = (params) => {
  // 柱状图点击筛选对应类型
  const typeName = params.name;
  emit('barClick', {type: 'aidType', value: typeName});
};

// 加载看板数据（带时间范围参数）
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

    const res = await getAidWorkChart(params);
    chartData.value = res;
  } catch (error) {
    console.warn('获取看板数据失败，使用模拟数据', error);
    chartData.value = {
      totalApplyCount: 256,
      totalPassCount: 198,
      totalApplyAmount: 768000,
      totalGrantAmount: 594000,
      statusCountMap: {'待审核': 32, '已通过': 198, '已完成': 26},
      typeCountMap: {'奖学金': 86, '助学金': 102, '助学贷款': 48, '勤工俭学': 20},
    };
  }
};

// 加载申请人数统计（带时间范围参数）
const loadApplyCountData = async () => {
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

    const res = await getApplyCount(params);
    typeApplyData.value = res;
  } catch (error) {
    console.warn('获取申请人数统计失败，使用模拟数据', error);
    typeApplyData.value = [
      {type: "1", name: "", applyCount: 86, finishCount: 78, finishRate: 0.907},
      {type: "2", name: "", applyCount: 102, finishCount: 92, finishRate: 0.902},
      {type: "3", name: "", applyCount: 48, finishCount: 42, finishRate: 0.875},
      {type: "4", name: "", applyCount: 20, finishCount: 18, finishRate: 0.90},
    ];
  }
};

// 时间范围变化处理
const handleDateRangeChange = async () => {
  if (dateRange.value && dateRange.value.length === 2) {
    loading.value = true;
    try {
      await Promise.all([
        loadChartData(),
        loadApplyCountData(),
      ]);
    } finally {
      loading.value = false;
    }
  }
};

const loadData = async () => {
  loading.value = true;
  try {
    // 初始化时不传时间参数，让后端返回全部数据
    const [chartRes, applyRes] = await Promise.allSettled([
      getAidWorkChart({}),
      getApplyCount({}),
    ]);
    if (chartRes.status === 'fulfilled') {
      chartData.value = chartRes.value;
    } else {
      chartData.value = {
        totalApplyCount: 256,
        totalPassCount: 198,
        totalApplyAmount: 768000,
        totalGrantAmount: 594000,
        statusCountMap: {'待审核': 32, '已通过': 198, '已完成': 26},
        typeCountMap: {'奖学金': 86, '助学金': 102, '助学贷款': 48, '勤工俭学': 20},
      };
    }
    if (applyRes.status === 'fulfilled') {
      typeApplyData.value = applyRes.value;
    } else {
      typeApplyData.value = [
        {type: "1", name: "", applyCount: 86, finishCount: 78, finishRate: 0.907},
        {type: "2", name: "", applyCount: 102, finishCount: 92, finishRate: 0.902},
        {type: "3", name: "", applyCount: 48, finishCount: 42, finishRate: 0.875},
        {type: "4", name: "", applyCount: 20, finishCount: 18, finishRate: 0.90},
      ];
    }
  } catch (error) {
    console.error('加载图表数据失败', error);
    chartData.value = {
      totalApplyCount: 256,
      totalPassCount: 198,
      totalApplyAmount: 768000,
      totalGrantAmount: 594000,
      statusCountMap: {'待审核': 32, '已通过': 198, '已完成': 26},
      typeCountMap: {'奖学金': 86, '助学金': 102, '助学贷款': 48, '勤工俭学': 20},
    };
    typeApplyData.value = [
      {type: "1", name: "", applyCount: 86, finishCount: 78, finishRate: 0.907},
      {type: "2", name: "", applyCount: 102, finishCount: 92, finishRate: 0.902},
      {type: "3", name: "", applyCount: 48, finishCount: 42, finishRate: 0.875},
      {type: "4", name: "", applyCount: 20, finishCount: 18, finishRate: 0.90},
    ];
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

    <!-- 饼图切换区域 -->
    <div class="pie-chart-area">
      <div class="pie-select-wrapper">
        <el-select
          v-model="activePieIndex"
          size="small"
          @change="handlePieChange"
        >
          <el-option
            v-for="(opt, idx) in pieOptions"
            :key="idx"
            :label="opt.title"
            :value="idx"
          />
        </el-select>
      </div>
      <Pie
        :title-text="currentPieData.title"
        :data="currentPieData.data"
        @pie-click="handlePieClick"
      />
    </div>

    <!-- 柱状图切换区域 -->
    <div class="chart-area bar-chart-container">
      <div class="chart-select-wrapper">
        <el-select
          v-model="activeChartIndex"
          size="small"
          @change="handleChartChange"
        >
          <el-option
            v-for="(opt, idx) in chartOptions"
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
      <Bar
        :title="currentChart.title"
        :x-data="currentChart.xData"
        :series-data="currentChart.seriesData"
        :y-name="currentChart.yName"
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
    min-width: 360px;
    max-width: 400px;
    margin-top: 10px !important;

    .left-card {
      height: 150px !important;
    }
  }
}

.pie-chart-area {
  position: relative;
  flex: 1;
  min-width: 280px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
}

.pie-select-wrapper {
  position: absolute;
  top: 8px;
  right: 10px;
  z-index: 10;
}

.chart-area {
  position: relative;
  flex: 1.5;
  min-width: 300px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
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
</style>
