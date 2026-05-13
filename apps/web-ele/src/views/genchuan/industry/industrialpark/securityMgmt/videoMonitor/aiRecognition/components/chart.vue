<script setup>
import { ref, computed, onMounted } from 'vue';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import { getAiRecognitionChart } from '#/api/genchuan/industry/industrialpark/securityMgmt/videoMonitor/aiRecognition/data.js';

const loading = ref(true);
const chartData = ref({
  recognizeTotalCount: 0,
  alarmTotalCount: 0,
  checkRate: 0,
  handleRate: 0,
  typeRatioList: [],
  accuracyList: [],
});

// 卡片数据
const cardList = computed(() => [
  { title: '识别总数', value: chartData.value.recognizeTotalCount, color: '#409EFF', status: 'recognize' },
  { title: '告警总数', value: chartData.value.alarmTotalCount, color: '#F56C6C', status: 'alarm' },
  { title: '核实率', value: `${chartData.value.checkRate}%`, color: '#67C23A', status: 'check' },
  { title: '处置率', value: `${chartData.value.handleRate}%`, color: '#E6A23C', status: 'handle' },
]);

// 异常行为类型占比饼图
const typePieData = computed(() => {
  const list = chartData.value.typeRatioList || [];
  return list.map(item => ({ name: item.type, value: item.ratio }));
});

// 识别准确率饼图
const accuracyPieData = computed(() => {
  const list = chartData.value.accuracyList || [];
  return list.map(item => ({ name: item.ruleName, value: item.accuracy }));
});

const emit = defineEmits(['cardSelect', 'pieSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handleTypePieClick = (item) => {
  emit('pieSelect', { field: 'ruleType', value: item.name, type: 'type' });
};

const handleAccuracyPieClick = (item) => {
  emit('pieSelect', { field: 'ruleName', value: item.name, type: 'accuracy' });
};

const loadData = async () => {
  loading.value = true;
  try {
    const res = await getAiRecognitionChart();
    chartData.value = res;
  } catch (error) {
    console.error('加载图表数据失败', error);
    chartData.value = {
      recognizeTotalCount: 1250,
      alarmTotalCount: 32,
      checkRate: 100.0,
      handleRate: 96.88,
      typeRatioList: [
        { type: '人形', ratio: 60 },
        { type: '车辆', ratio: 25 },
        { type: '异常行为', ratio: 15 }
      ],
      accuracyList: [
        { ruleName: '越界检测', accuracy: 98.5 },
        { ruleName: '人脸识别', accuracy: 99.2 },
        { ruleName: '车辆检测', accuracy: 97.8 }
      ],
    };
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
    <div class="box-left">
      <Indicator class="left-card" v-for="item in cardList" :key="item.title" v-bind="item" @click="handleCardClick" />
    </div>
    <Pie
      style="flex: 1;"
      title-text="异常行为类型占比"
      :data="typePieData"
      @pieClick="handleTypePieClick"
    />
    <Pie
      style="flex: 1;"
      title-text="识别准确率"
      :data="accuracyPieData"
      @pieClick="handleAccuracyPieClick"
    />
  </div>
</template>

<style scoped lang="scss">
.chart-box {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
  width: 100%;
  padding: 0 15px;

  .box-left {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    min-width: 280px;
    max-width: 320px;
    margin-top: 10px !important;

    .left-card {
      height: 150px !important;
    }
  }
}
</style>
