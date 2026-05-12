<script setup>
import {ref, computed, onMounted, watch} from 'vue';
import {ElSelect, ElOption} from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import lineChart from '#/genchuan-components/stats/lineChartClick.vue';
import {
  getNewPushChart,
  getNewPushIndex,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/enrollMgmt/newPush/data.js';

const loading = ref(true);
const chartData = ref({});      // 折线图 + 卡片数据
const indexData = ref({});      // 核心指标数据

// 年份选择器相关
const currentYear = ref(new Date().getFullYear()); // 默认当前年份
const yearOptions = () => {
  const current = new Date().getFullYear();
  const years = [];
  for (let i = current - 5; i <= current + 2; i++) {
    years.push({label: `${i}年`, value: i});
  }
  return years;
};

// 监听年份变化，重新加载数据
watch(currentYear, () => {
  loadData();
});

// 卡片数据（推送任务数、已推送数、推送完成率）
const cardList = computed(() => {
  const total = indexData.value.totalTaskCount || chartData.value.totalCount || 0;
  const finished = indexData.value.pushedCount || chartData.value.finishedCount || 0;
  const rate = indexData.value.pushRate || chartData.value.avgFinishRate || 0;
  return [
    {title: '推送任务数', value: total, color: '#409EFF', status: 'total'},
    {title: '已推送数', value: finished, color: '#67C23A', status: 'finished'},
    {title: '推送完成率', value: `${rate}%`, color: '#E6A23C', status: 'rate'},
  ];
});

// 折线图数据（迎新推送进度统计）
const lineData = computed(() => {
  const dateList = chartData.value.dateList || [];
  const dailyPushList = chartData.value.dailyPushList || [];
  return {
    xAxis: dateList,
    series: [{name: '推送人数', data: dailyPushList}],
  };
});

const emit = defineEmits(['cardSelect', 'lineSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handleLineClick = (params) => {
  emit('lineSelect', {field: 'date', value: params.xValue});
};

const loadData = async () => {
  loading.value = true;
  try {
    const [chartRes, indexRes] = await Promise.allSettled([
      getNewPushChart({year: currentYear.value}),
      getNewPushIndex({year: currentYear.value}),
    ]);
    if (chartRes.status === 'fulfilled') {
      chartData.value = chartRes.value;
    } else {
      chartData.value = {
        waitPushCount: 2,
        finishedCount: 8,
        totalCount: 10,
        totalPushNum: 2800,
        avgFinishRate: 98.5,
        dateList: ['2025-08-20', '2025-08-22', '2025-08-25', '2025-08-28', '2025-08-30'],
        dailyPushList: [320, 320, 320, 320, 320],
      };
    }
    if (indexRes.status === 'fulfilled') {
      indexData.value = indexRes.value;
    } else {
      indexData.value = {
        totalTaskCount: 10,
        pushedCount: 8,
        pushRate: 80.0,
        totalPushNum: 2560,
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

    <!-- 折线图区域（含年份选择器） -->
    <div class="line-chart-container" style="flex: 2 !important; position: relative;">
      <!-- 年份选择器（紧凑样式，位于右上角） -->
      <div class="year-select-wrapper">
        <el-select v-model="currentYear" size="small">
          <el-option
            v-for="opt in yearOptions()"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </div>
      <lineChart
        title="迎新推送进度统计"
        :x-data="lineData.xAxis"
        :series-data="lineData.series"
        y-name="推送人数"
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

  /* 折线图容器特殊样式，用于绝对定位年份选择器 */
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

  /* 紧凑的年份选择器样式 */
  :deep(.el-select) {
    width: 100px;
  }
}
</style>
