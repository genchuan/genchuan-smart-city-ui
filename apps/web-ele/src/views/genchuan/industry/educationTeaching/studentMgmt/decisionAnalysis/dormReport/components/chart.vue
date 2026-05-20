<script setup>
import { ref, onMounted, computed } from 'vue';
import { ElSelect, ElOption } from 'element-plus';
import { getDormReportChart } from '#/api/genchuan/industry/educationTeaching/studentMgmt/decisionAnalysis/dormReport/data.js';
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

const cardLabelMap = {
  bedTotal: '总床位数',
  bedUsedNum: '已用床位数',
  bedFreeNum: '空余床位数',
  repairFinishRate: '报修完成率(%)',
  inDormRate: '在寝率(%)',
  stayNum: '留宿人数',
};

const cards = computed(() => {
  if (!cardData.value) return [];
  return Object.entries(cardData.value).map(([key, value]) => ({
    key,
    label: cardLabelMap[key] || key,
    value,
  }));
});

// 图表切换
const activeChart = ref('pie');
const chartOptions = [
  { value: 'pie', label: '楼栋床位占比' },
  { value: 'bar', label: '宿舍得分排名' },
  { value: 'line', label: '在寝率趋势' },
];

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
    const res = await getDormReportChart(params);
    const data = res?.data || res;
    if (data) {
      cardData.value = data.cardData || {};
      pieData.value = data.pieData || [];
      if (data.barData && data.barData.length) {
        barXAxis.value = data.barData.map(item => item.name);
        barSeriesData.value = [{ name: '得分', data: data.barData.map(item => item.score) }];
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

      <div v-if="activeChart === 'pie'">
        <Pie :data="pieData" :title-text="currentChartTitle" @pieClick="handlePieClick" />
      </div>
      <div v-else-if="activeChart === 'bar'">
        <Bar :x-data="barXAxis" :series-data="barSeriesData" :title="currentChartTitle" y-name="得分" @barClick="handleBarClick" />
      </div>
      <div v-else-if="activeChart === 'line'">
        <LineChart :x-data="lineXAxis" :series-data="lineSeriesData" :title="currentChartTitle" y-name="数值" @lineClick="handleLineClick" />
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
