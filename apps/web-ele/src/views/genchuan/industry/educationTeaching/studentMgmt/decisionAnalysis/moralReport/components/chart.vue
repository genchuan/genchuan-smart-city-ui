<script setup>
import { ref, onMounted, computed } from 'vue';
import { ElSelect, ElOption } from 'element-plus';
import { getMoralReportChart } from '#/api/genchuan/industry/educationTeaching/studentMgmt/decisionAnalysis/moralReport/data.js';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import LineChart from '#/genchuan-components/stats/lineChartClick.vue';

const emit = defineEmits(['cardClick', 'pieClick', 'barClick', 'lineClick']);

const cardData = ref({});
const pieData = ref([]);
const barXAxis = ref([]);
const barSeriesData = ref([]);
const lineXAxis = ref([]);
const lineSeriesData = ref([]);
const loading = ref(false);

// 字段名中文映射
const cardLabelMap = {
  targetTotal: '指标总数',
  targetEnableNum: '启用指标数',
  targetWarnNum: '预警指标数',
  activityJoinNum: '活动参与人数',
  resourceLearnRate: '资源学习完成率(%)',
};

// 将 cardData 对象转为数组
const cards = computed(() => {
  if (!cardData.value) return [];
  return Object.entries(cardData.value).map(([key, value]) => ({
    key,
    label: cardLabelMap[key] || key,
    value,
  }));
});

// ========== 图表切换相关 ==========
const activeChart = ref('pie');
const chartOptions = [
  { value: 'pie', label: '德育资源类型分布' },
  { value: 'bar', label: '班级德育得分排名' },
  { value: 'line', label: '德育趋势分析' },
];

// 当前图表的动态标题
const currentChartTitle = computed(() => {
  const found = chartOptions.find(opt => opt.value === activeChart.value);
  return found?.label || '';
});

const handleChartChange = (val) => {
  activeChart.value = val;
};

const defaultParams = {
  statStartTime: new Date(new Date().setDate(1)).getTime(),
  statEndTime: new Date().getTime(),
};

const fetchChartData = async (customParams = null) => {
  loading.value = true;
  try {
    const params = customParams || defaultParams;
    const res = await getMoralReportChart(params);
    const data = res?.data || res;
    if (data) {
      cardData.value = data.cardData || {};
      pieData.value = data.pieData || [];
      if (data.barData && data.barData.length) {
        barXAxis.value = data.barData.map(item => item.name);
        barSeriesData.value = [{ name: '德育得分', data: data.barData.map(item => item.score) }];
      }
      if (data.lineData) {
        lineXAxis.value = data.lineData.date || [];
        lineSeriesData.value = data.lineData.series || [];
      }
    }
  } catch (error) {
    console.error('获取图表数据失败:', error);
  } finally {
    loading.value = false;
  }
};

// 卡片点击
const handleCardClick = (key, value) => {
  emit('cardClick', { title: key, value, status: key });
};

const handlePieClick = (info) => emit('pieClick', info);
const handleBarClick = (info) => emit('barClick', info);
const handleLineClick = (info) => emit('lineClick', info);

const refreshData = (params) => fetchChartData(params);

defineExpose({ refreshData });

onMounted(() => fetchChartData());
</script>

<template>
  <div v-loading="loading" class="chart-box">
    <div class="box-left-m">
      <Indicator
        v-for="card in cards"
        :key="card.key"
        :title="card.label"
        :value="card.value"
        @click="() => handleCardClick(card.key, card.value)"
      />
    </div>

    <!-- 图表切换区域 -->
    <div class="chart-area">
      <div class="chart-select-wrapper">
        <el-select v-model="activeChart" size="small" @change="handleChartChange">
          <el-option
            v-for="opt in chartOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </div>

      <!-- 饼图 -->
      <div v-if="activeChart === 'pie'">
        <Pie
          :data="pieData"
          :title-text="currentChartTitle"
          @pieClick="handlePieClick"
        />
      </div>

      <!-- 柱状图（班级德育得分排名） -->
      <div v-else-if="activeChart === 'bar'">
        <Bar
          :x-data="barXAxis"
          :series-data="barSeriesData"
          :title="currentChartTitle"
          y-name="得分"
          @barClick="handleBarClick"
        />
      </div>

      <!-- 折线图（德育趋势分析） -->
      <div v-else-if="activeChart === 'line'">
        <LineChart
          :x-data="lineXAxis"
          :series-data="lineSeriesData"
          :title="currentChartTitle"
          y-name="数值"
          @lineClick="handleLineClick"
        />
      </div>
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

  .chart-area {
    position: relative;
    flex: 1;
    min-width: 280px;
    height: 100%;
  }

  .chart-select-wrapper {
    position: absolute;
    top: 8px;
    right: 10px;
    z-index: 10;
  }
}
</style>
