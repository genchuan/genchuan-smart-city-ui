<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { ElSelect, ElOption } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import lineChart from '#/genchuan-components/stats/lineChartClick.vue';
import {
  getPromoteMgmtChart,
  getPromoteMgmtSiteCount,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/enrollMgmt/promoteMgmt/data.js';

const loading = ref(true);
const chartData = ref({});      // 折线图 + 卡片数据
const siteData = ref({});       // 站点柱状图数据

// 年份选择器相关
const currentYear = ref(new Date().getFullYear()); // 默认当前年份
const yearOptions = () => {
  const current = new Date().getFullYear();
  const years = [];
  for (let i = current - 5; i <= current + 2; i++) {
    years.push({ label: `${i}年`, value: i });
  }
  return years;
};

// 监听年份变化，重新加载数据
watch(currentYear, () => {
  loadData();
});

// 卡片数据（未执行任务数、已执行任务数、总任务数、总宣传人数、总意向学生数、意向转化率）
const cardList = computed(() => {
  const wait = chartData.value.waitExecuteCount || 0;
  const finished = chartData.value.finishedCount || 0;
  const total = chartData.value.totalCount || 0;
  const promoteTotal = chartData.value.totalPromoteNum || 0;
  const intentTotal = chartData.value.totalIntentNum || 0;
  const rate = chartData.value.intentRate || 0;
  return [
    {title: '未执行任务数', value: wait, color: '#E6A23C', status: 'wait'},
    {title: '已执行任务数', value: finished, color: '#67C23A', status: 'finished'},
    {title: '总任务数', value: total, color: '#409EFF', status: 'total'},
    {title: '总宣传人数', value: promoteTotal, color: '#909399', status: 'promote'},
    {title: '总意向学生数', value: intentTotal, color: '#F56C6C', status: 'intent'},
    {title: '意向转化率', value: `${rate}%`, color: '#9B59B6', status: 'rate'},
  ];
});

// 折线图数据（招生宣传进度统计）
const lineData = computed(() => {
  const dateList = chartData.value.dateList || [];
  const dailyPromoteList = chartData.value.dailyPromoteList || [];
  const dailyIntentList = chartData.value.dailyIntentList || [];
  return {
    xAxis: dateList,
    series: [
      {name: '宣传人数', data: dailyPromoteList},
      {name: '意向学生数', data: dailyIntentList},
    ],
  };
});

// 柱状图数据（各站点宣传人数、意向学生数）
const barData = computed(() => {
  const siteList = siteData.value.siteList || [];
  const promoteNumList = siteData.value.promoteNumList || [];
  const intentNumList = siteData.value.intentNumList || [];
  return {
    xData: siteList,
    seriesData: [
      {name: '宣传人数', data: promoteNumList},
      {name: '意向学生数', data: intentNumList},
    ],
  };
});

const emit = defineEmits(['cardSelect', 'barSelect', 'lineSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handleBarClick = (siteName) => {
  emit('barSelect', {field: 'site', value: siteName});
};

const handleLineClick = (params) => {
  emit('lineSelect', {field: 'date', value: params.xValue});
};

const loadData = async () => {
  loading.value = true;
  try {
    const [chartRes, siteRes] = await Promise.allSettled([
      getPromoteMgmtChart({year: currentYear.value}),
      getPromoteMgmtSiteCount({year: currentYear.value}),
    ]);
    if (chartRes.status === 'fulfilled') {
      chartData.value = chartRes.value;
    } else {
      chartData.value = {
        waitExecuteCount: 5,
        finishedCount: 20,
        totalCount: 25,
        totalPromoteNum: 2500,
        totalIntentNum: 650,
        intentRate: 26.0,
        dateList: ['2025-06-10', '2025-06-15', '2025-06-20', '2025-06-25', '2025-06-30'],
        dailyPromoteList: [300, 450, 520, 630, 600],
        dailyIntentList: [80, 120, 150, 160, 140],
      };
    }
    if (siteRes.status === 'fulfilled') {
      siteData.value = siteRes.value;
    } else {
      siteData.value = {
        siteList: ['泉州一中', '泉州五中', '厦门双十', '福州一中'],
        promoteNumList: [500, 600, 700, 700],
        intentNumList: [130, 160, 180, 180],
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
      <Indicator class="left-card" v-for="item in cardList" :key="item.title" v-bind="item"
                 @click="handleCardClick"/>
    </div>

    <!-- 折线图区域（含年份选择器） -->
    <div class="line-chart-container" style="flex: 1 !important; position: relative;">
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
        title="招生宣传进度统计"
        :x-data="lineData.xAxis"
        :series-data="lineData.series"
        y-name="人数"
        @line-click="handleLineClick"
      />
    </div>

    <Bar
      style="flex: 1 !important;"
      title="各站点宣传效果对比"
      :x-data="barData.xData"
      :series-data="barData.seriesData"
      y-name="人数"
      @bar-click="handleBarClick"
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

  /* 折线图容器特殊样式，用于绝对定位年份选择器 */
  .line-chart-container {
    position: relative;
    flex: 1;
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
