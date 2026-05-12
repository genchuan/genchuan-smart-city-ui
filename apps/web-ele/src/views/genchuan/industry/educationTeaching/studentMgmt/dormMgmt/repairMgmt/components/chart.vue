<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElDatePicker } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import {
  getRepairMgmtChart,
  getRepairMgmtCount,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/dormMgmt/repairMgmt/data.js';

const loading = ref(true);
const chartData = ref({});      // 卡片 + 类型分布
const countData = ref({});      // 楼栋统计

// 时间范围选择器绑定的值（数组格式 [startDate, endDate]）
const timeRange = ref([]);

// 获取默认时间范围（最近30天，结束时间为当天）
const getDefaultTimeRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 30);
  return [start, end];
};

// 格式化单个日期时间为后端要求的格式（空格分隔，如 "2023-01-01 00:00:00"）
// isEnd: 是否为结束时间（结束时间用 23:59:59，起始用 00:00:00）
const formatDateTime = (date, isEnd = false) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  if (isEnd) {
    return `${year}-${month}-${day} 23:59:59`;
  } else {
    return `${year}-${month}-${day} 00:00:00`;
  }
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

// ========== 卡片数据（不变） ==========
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

// ========== 柱状图数据（各楼栋维修统计） ==========
const barData = computed(() => {
  const buildingStats = countData.value.buildingStatisticsList || [];
  // 提取楼栋名称（x轴）
  const xAxis = buildingStats.map(item => item.building);
  // 两个系列：已完成维修数、总维修数
  const series = [
    {
      name: '已完成维修数',
      data: buildingStats.map(item => item.finished || 0),
    },
    {
      name: '总维修数',
      data: buildingStats.map(item => item.total || 0),
    },
  ];
  return { xAxis, series };
});

// ========== 饼图数据（报修类型分布，保持不变） ==========
const pieData = computed(() => {
  const distribution = chartData.value.typeDistribution || [];
  return distribution.map(item => ({ name: item.type, value: item.count }));
});

// ========== 事件发射 ==========
const emit = defineEmits(['cardSelect', 'pieSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handlePieClick = (item) => {
  emit('pieSelect', { field: 'repairType', value: item.name });
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
        typeDistribution: [
          { type: '水电', count: 52 },
          { type: '家具', count: 24 },
          { type: '其他', count: 10 },
        ],
      };
    }
    if (countRes.status === 'fulfilled') {
      // 直接保存后端返回的完整 data（包含 buildingStatisticsList）
      countData.value = countRes.value.data || countRes.value;
    } else {
      console.warn('统计接口失败，使用模拟数据', countRes.reason);
      countData.value = {
        buildingStatisticsList: [
          { building: '1号楼', total: 22, finished: 21 },
          { building: '2号楼', total: 28, finished: 26 },
          { building: '3号楼', total: 36, finished: 34 },
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

    <!-- 柱状图区域（各楼栋维修统计） -->
    <div class="bar-chart-container" style="flex: 1.5 !important; position: relative;">
      <!-- 日期范围选择器（位于右上角） -->
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
        title="各楼栋维修统计"
        :x-data="barData.xAxis"
        :series-data="barData.series"
        y-name="维修数量"
        :clickable="false"
      />
    </div>

    <!-- 饼图区域（报修类型分布） -->
    <div class="chart-area">
      <Pie title-text="报修类型分布" :data="pieData" @pie-click="handlePieClick" />
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

  .bar-chart-container {
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
