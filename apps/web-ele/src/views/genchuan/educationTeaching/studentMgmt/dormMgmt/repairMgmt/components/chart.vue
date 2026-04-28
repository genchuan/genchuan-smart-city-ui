<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElSelect, ElOption, ElDatePicker } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import lineChart from '#/genchuan-components/stats/lineChartClick.vue';
import {
  getRepairMgmtChart,
  getRepairMgmtCount,
} from '#/api/genchuan/educationTeaching/studentMgmt/dormMgmt/repairMgmt/data.js';

const loading = ref(true);
const chartData = ref({});      // 卡片 + 折线图 + 类型分布
const countData = ref({});      // 完成率统计

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
  // 默认：最近30天
  const [defaultStart, defaultEnd] = getDefaultTimeRange();
  return `${formatDateTime(defaultStart, false)},${formatDateTime(defaultEnd, true)}`;
};

// 日期范围变化时重新加载数据
const handleDateRangeChange = () => {
  loadData();
};

// ========== 卡片数据 ==========
const cardList = computed(() => {
  const total = chartData.value.totalRepairCount || 0;
  const pending = chartData.value.pendingDispatchCount || 0;
  const repairing = chartData.value.repairingCount || 0;
  const repaired = chartData.value.repairedCount || 0;
  const accepted = chartData.value.acceptedCount || 0;
  return [
    { title: '总报修次数', value: total, color: '#409EFF', status: 'total' },
    { title: '待派单', value: pending, color: '#E6A23C', status: 'pending' },
    { title: '维修中', value: repairing, color: '#F56C6C', status: 'repairing' },
    { title: '已维修', value: repaired, color: '#67C23A', status: 'repaired' },
    { title: '已验收', value: accepted, color: '#909399', status: 'accepted' },
  ];
});

// ========== 折线图数据（每日报修趋势） ==========
const lineData = computed(() => {
  const trend = chartData.value.dailyTrend || [];
  // 兼容 dailyTrend 为 null 或空数组的情况
  return {
    xAxis: trend.map(item => item.date),
    series: [{ name: '报修次数', data: trend.map(item => item.count) }],
  };
});

// ========== 饼图配置（支持切换：报修类型分布 / 维修完成率） ==========
const pieOptions = computed(() => [
  {
    title: '报修类型分布',
    type: 'typeDistribution',
    getData: () => {
      const distribution = chartData.value.typeDistribution || [];
      // 后端返回的 type 是英文，但 data.js 已在 convertEnToZh 中转换为中文，这里直接使用
      return distribution.map(item => ({ name: item.type, value: item.count }));
    },
  },
  {
    title: '维修完成率',
    type: 'finishRate',
    getData: () => {
      const typeStats = countData.value.typeStatistics || [];
      // 如果后端有 finishRate 字段则使用，否则用 finished/total 计算
      return typeStats.map(item => ({
        name: item.type,
        value: item.finishRate !== undefined ? item.finishRate * 100 : (item.finished / item.total) * 100,
      }));
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
const emit = defineEmits(['cardSelect', 'pieSelect', 'lineSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handlePieClick = (item) => {
  const currentType = pieOptions.value[activePieIndex.value]?.type;
  if (currentType === 'typeDistribution') {
    emit('pieSelect', { field: 'repairType', value: item.name });
  }
  // 完成率饼图不做钻取
};

const handleLineClick = (params) => {
  emit('lineSelect', { field: 'date', value: params.xValue });
};

// ========== 加载数据 ==========
const loadData = async () => {
  loading.value = true;
  try {
    const timeRangeParam = getTimeRangeParam();
    const [chartRes, countRes] = await Promise.allSettled([
      getRepairMgmtChart({ timeRange: timeRangeParam }),
      getRepairMgmtCount({ timeRange: timeRangeParam }),
    ]);
    if (chartRes.status === 'fulfilled') {
      chartData.value = chartRes.value;
    } else {
      console.warn('看板接口失败，使用模拟数据', chartRes.reason);
      chartData.value = {
        totalRepairCount: 86,
        pendingDispatchCount: 8,
        repairingCount: 5,
        repairedCount: 12,
        acceptedCount: 61,
        dailyTrend: [
          { date: '2025-03-25', count: 15 },
          { date: '2025-03-26', count: 18 },
          { date: '2025-03-27', count: 20 },
          { date: '2025-03-28', count: 16 },
          { date: '2025-03-29', count: 22 },
          { date: '2025-03-30', count: 21 },
          { date: '2025-03-31', count: 8 },
        ],
        typeDistribution: [
          { type: '水电', count: 52 },
          { type: '家具', count: 24 },
          { type: '其他', count: 10 },
        ],
      };
    }
    if (countRes.status === 'fulfilled') {
      countData.value = countRes.value;
    } else {
      console.warn('统计接口失败，使用模拟数据', countRes.reason);
      countData.value = {
        typeStatistics: [
          { type: '水电', total: 52, finished: 50, finishRate: 0.9615 },
          { type: '家具', total: 24, finished: 22, finishRate: 0.9167 },
          { type: '其他', total: 10, finished: 9, finishRate: 0.9 },
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
  // 初始化时间范围（默认最近30天）
  timeRange.value = getDefaultTimeRange();
  loadData();
});
</script>

<template>
  <div v-loading="loading" class="chart-box">
    <!-- 卡片区 -->
    <div class="box-left-m">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>

    <!-- 折线图区域（包含日期选择器） -->
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
        title="每日报修趋势"
        :x-data="lineData.xAxis"
        :series-data="lineData.series"
        y-name="报修次数"
        @line-click="handleLineClick"
      />
    </div>

    <!-- 饼图（可切换） -->
    <div class="chart-area">
      <div class="chart-select-wrapper">
        <el-select v-model="activePieIndex" size="small" @change="handlePieChange">
          <el-option v-for="(opt, idx) in pieOptions" :key="idx" :label="opt.title" :value="idx" />
        </el-select>
      </div>
      <Pie :title-text="currentPieTitle" :data="currentPieData" @pie-click="handlePieClick" />
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

  .box-left-m {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr);
    min-width: 360px;
    max-width: 400px;
    margin-top: 10px !important;

    .left-card {
      height: 150px !important;
    }
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

  /* 紧凑的日期选择器样式 */
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
