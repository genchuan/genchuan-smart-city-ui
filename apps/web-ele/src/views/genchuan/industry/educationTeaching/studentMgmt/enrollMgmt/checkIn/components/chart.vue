<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { ElSelect, ElOption } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import lineChart from '#/genchuan-components/stats/lineChartClick.vue';
import {
  getCheckInChart,
  getCheckInIndex,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/enrollMgmt/checkIn/data.js';

const loading = ref(true);
const chartData = ref({});
const indexData = ref({});

const currentYear = ref(new Date().getFullYear());
const yearOptions = () => {
  const current = new Date().getFullYear();
  const years = [];
  for (let i = current - 5; i <= current + 2; i++) {
    years.push({ label: `${i}年`, value: i });
  }
  return years;
};

watch(currentYear, () => {
  loadData();
});

const cardList = computed(() => {
  const total = indexData.value.totalRegisterCount || 0;
  const rate = indexData.value.checkinRate || 0;
  const wait = chartData.value.waitConfirmCount || 0;
  return [
    {title: '报到总人数', value: total, color: '#409EFF', status: 'total'},
    {title: '报到完成率', value: `${rate}%`, color: '#67C23A', status: 'rate'},
    {title: '待报到人数', value: wait, color: '#E6A23C', status: 'wait'},
  ];
});

const lineData = computed(() => {
  const dateList = chartData.value.dateList || [];
  const dailyConfirmList = chartData.value.dailyConfirmList || [];
  const dailyAuditList = chartData.value.dailyAuditList || [];
  return {
    xAxis: dateList,
    series: [
      {name: '确认人数', data: dailyConfirmList},
      {name: '审核人数', data: dailyAuditList},
    ],
  };
});

// ========== 核心修改：所有点击改为派发自定义事件 ==========
const handleCardClick = (cardInfo) => {
  let filterType = null;
  let filterValue = null;
  switch (cardInfo.status) {
    case 'wait':   // 待报到人数 → 筛选状态为“待确认”
      filterType = 'status';
      filterValue = '待确认';
      break;
    case 'total':
    case 'rate':
    default:
      // 报到总人数和报到完成率不触发筛选
      return;
  }
  window.dispatchEvent(new CustomEvent('checkin-chart-filter', {
    detail: {type: filterType, value: filterValue}
  }));
};

const handleLineClick = (params) => {
  const date = params.xValue || params.name;
  if (date) {
    // 折线图点击日期，按该日期筛选报到记录（创建时间）
    window.dispatchEvent(new CustomEvent('checkin-chart-filter', {
      detail: {type: 'createTime', value: [date, date]}
    }));
  }
};

const loadData = async () => {
  loading.value = true;
  try {
    const [chartRes, indexRes] = await Promise.allSettled([
      getCheckInChart({year: currentYear.value}),
      getCheckInIndex({year: currentYear.value}),
    ]);
    if (chartRes.status === 'fulfilled') chartData.value = chartRes.value;
    else {
      chartData.value = {
        waitConfirmCount: 50,
        waitAuditCount: 30,
        finishedCount: 240,
        totalCount: 320,
        progress: 75.0,
        dateList: ['2025-08-25', '2025-08-26', '2025-08-27', '2025-08-28', '2025-08-29'],
        dailyConfirmList: [20, 35, 42, 58, 65],
        dailyAuditList: [15, 30, 40, 55, 60],
      };
    }
    if (indexRes.status === 'fulfilled') indexData.value = indexRes.value;
    else {
      indexData.value = {
        totalRegisterCount: 320,
        totalConfirmCount: 270,
        checkinRate: 84.38,
        accountCreatedCount: 240,
        accountCreateRate: 75.0,
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
    <div class="chart-box-left">
      <Indicator class="left-card" v-for="item in cardList" :key="item.title" v-bind="item"
                 @click="handleCardClick"/>
    </div>

    <div class="line-chart-container" style="flex: 2 !important; position: relative;">
      <div class="year-select-wrapper">
        <el-select v-model="currentYear" size="small">
          <el-option v-for="opt in yearOptions()" :key="opt.value" :label="opt.label"
                     :value="opt.value"/>
        </el-select>
      </div>
      <lineChart
        title="新生报到进度统计"
        :x-data="lineData.xAxis"
        :series-data="lineData.series"
        y-name="人数"
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

  .chart-box-left {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 280px;
    max-width: 320px;
    margin: 0;
  }

  .line-chart-container {
    position: relative;
    flex: 2;
    min-width: 280px;
    margin-left: 12px;
  }

  .year-select-wrapper {
    position: absolute;
    top: 8px;
    right: 10px;
    z-index: 10;
  }

  :deep(.el-select) {
    width: 100px;
  }
}
</style>
