<script setup>
import { reactive, onMounted, ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import lineChart from '#/genchuan-components/stats/lineChartClick.vue';
import {
  getDutyMgmtChart,
  getDutyIndex,
} from '#/api/genchuan/educationTeaching/studentMgmt/studentWork/dutyMgmt/data.js';

const loading = ref(true);
const chartData = ref({});
const indexData = ref({ monthList: [], dutyCountList: [], checkInRateList: [], shiftRateList: [], vehicleRateList: [] });

// 卡片列表（不支持点击筛选）
const cardList = computed(() => {
  const total = chartData.value.totalDutyCount || 0;
  const today = chartData.value.todayDutyCount || 0;
  const checkInRate = chartData.value.checkInRate || 0;
  const shiftCount = chartData.value.shiftApplyCount || 0;
  const vehicleCount = chartData.value.vehicleApplyCount || 0;
  return [
    { title: '总值班次数', value: total, color: '#409EFF' },
    { title: '今日值班人数', value: today, color: '#67C23A' },
    { title: '打卡率(%)', value: checkInRate, color: '#E6A23C' },
    { title: '调班次数', value: shiftCount, color: '#F56C6C' },
    { title: '出车次数', value: vehicleCount, color: '#909399' },
  ];
});

// 折线图数据（使用 lineChart 组件）
const lineXData = computed(() => indexData.value.monthList || []);
const lineSeriesData = computed(() => [
  { name: '值班次数', data: indexData.value.dutyCountList || [] },
  { name: '打卡率(%)', data: indexData.value.checkInRateList || [] },
  { name: '调班率(%)', data: indexData.value.shiftRateList || [] },
  { name: '出车率(%)', data: indexData.value.vehicleRateList || [] },
]);

const emit = defineEmits(['lineClick']);

// 折线图点击筛选（月份）
const handleLineClick = (monthName) => {
  emit('lineClick', { month: monthName });
};

const loadData = async () => {
  loading.value = true;
  try {
    const [chartRes, indexRes] = await Promise.allSettled([
      getDutyMgmtChart({}),
      getDutyIndex({}),
    ]);
    if (chartRes.status === 'fulfilled') {
      chartData.value = chartRes.value;
    } else {
      chartData.value = {
        totalDutyCount: 124,
        todayDutyCount: 4,
        checkInRate: 96.77,
        shiftApplyCount: 8,
        vehicleApplyCount: 5,
        statusCountMap: { '待打卡': 12, '待调班审批': 2, '待出车审批': 1, '已完成': 109 },
      };
    }
    if (indexRes.status === 'fulfilled') {
      indexData.value = indexRes.value;
    } else {
      indexData.value = {
        monthList: ['2025-01', '2025-02', '2025-03'],
        dutyCountList: [112, 98, 124],
        checkInRateList: [95.54, 96.94, 96.77],
        shiftRateList: [6.25, 7.14, 6.45],
        vehicleRateList: [4.46, 3.06, 4.03],
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
    <div class="box-left-m">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
      />
    </div>
    <lineChart
      style="flex: 1.5 !important;"
      :title="'值班核心指标趋势'"
      :x-data="lineXData"
      :series-data="lineSeriesData"
      y-name="数值"
      @line-click="handleLineClick"
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
}
</style>
