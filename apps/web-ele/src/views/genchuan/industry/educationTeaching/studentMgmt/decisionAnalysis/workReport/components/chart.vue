<script setup>
import { ref, onMounted, computed } from 'vue';
import { ElSelect, ElOption } from 'element-plus';
import { getWorkReportChart } from '#/api/genchuan/industry/educationTeaching/studentMgmt/decisionAnalysis/workReport/data.js';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import Radar from '#/genchuan-components/stats/radarClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import LineChart from '#/genchuan-components/stats/lineChartClick.vue';

const emit = defineEmits(['cardClick', 'pieClick', 'radarClick', 'barClick', 'lineClick']);

const cardData = ref({});
const pieData = ref([]);
const radarIndicator = ref([]);
const radarSeries = ref([]);
const barXAxis = ref([]);
const barSeriesData = ref([]);
const lineXAxis = ref([]);
const lineSeriesData = ref([]);
const loading = ref(false);

// 字段名中文映射
const cardLabelMap = {
  studentTotal: '学生总数',
  studentRegularNum: '在籍人数',
  warnStudentNum: '异常预警人数',
  newHonorNum: '新增荣誉数',
  newViolateNum: '新增违纪数',
  newAssessNum: '新增考评数',
  dutyRate: '值班到岗率(%)',
  fundCoverRate: '资助覆盖率(%)',
};

// 将 cardData 对象转为数组，便于渲染，同时保留原始 key
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
  { value: 'pie', label: '学工各维度记录分布' },
  { value: 'radar', label: '班级多维度考评得分' },
  { value: 'bar', label: '各班级荣誉与违纪对比' },
  { value: 'line', label: '学工趋势分析' },
];

// 各图表的动态标题（用于组件内部显示）
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
    const res = await getWorkReportChart(params);
    const data = res?.data || res;
    if (data) {
      cardData.value = data.cardData || {};
      pieData.value = data.pieData || [];
      if (data.radarData) {
        radarIndicator.value = (data.radarData.dimensions || []).map(d => ({ name: d, max: 100 }));
        radarSeries.value = data.radarData.series || [];
      }
      if (data.barData && data.barData.length) {
        barXAxis.value = data.barData.map(item => item.name);
        barSeriesData.value = [
          { name: '荣誉数量', data: data.barData.map(item => item.honorNum || 0) },
          { name: '违纪次数', data: data.barData.map(item => item.violateNum || 0) },
        ];
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

// 卡片点击：传递原始 key 和 value，父组件根据 key 进行钻取
const handleCardClick = (key, value) => {
  emit('cardClick', { title: key, value, status: key });
};

const handlePieClick = (info) => emit('pieClick', info);
const handleRadarClick = (info) => emit('radarClick', info.name);
const handleBarClick = (info) => emit('barClick', info);
const handleLineClick = (info) => emit('lineClick', info);

const refreshData = (params) => fetchChartData(params);

defineExpose({ refreshData });

onMounted(() => fetchChartData());
</script>

<template>
  <div v-loading="loading" class="chart-box">
    <!-- 卡片区域 - 保持不变 -->
    <div class="box-left-big">
      <Indicator
        v-for="card in cards"
        :key="card.key"
        :title="card.label"
        :value="card.value"
        @click="() => handleCardClick(card.key, card.value)"
      />
    </div>

    <!-- 图表切换区域 - 无日期选择器 -->
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

      <!-- 雷达图 -->
      <div v-else-if="activeChart === 'radar'">
        <Radar
          :indicator="radarIndicator"
          :series="radarSeries"
          :title-text="currentChartTitle"
          @radarClick="handleRadarClick"
        />
      </div>

      <!-- 柱状图（荣誉与违纪对比） -->
      <div v-else-if="activeChart === 'bar'">
        <Bar
          :x-data="barXAxis"
          :series-data="barSeriesData"
          :title="currentChartTitle"
          y-name="数量"
          @barClick="handleBarClick"
        />
      </div>

      <!-- 折线图（学工趋势） -->
      <div v-else-if="activeChart === 'line'">
        <LineChart
          :x-data="lineXAxis"
          :series-data="lineSeriesData"
          :title="currentChartTitle"
          y-name="次数"
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

  .box-left-big {
    display: grid !important;
    grid-template-columns: repeat(4, 1fr);
    min-width: 360px;
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
