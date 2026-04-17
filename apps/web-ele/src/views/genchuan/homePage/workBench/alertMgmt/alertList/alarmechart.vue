<template>
  <div class="park-chart-box">
    <div class="chart-header">
      <el-radio-group v-model="timeRange" size="small" @change="fetchChartData">
        <el-radio-button label="day">今日</el-radio-button>
        <el-radio-button label="week">本周</el-radio-button>
        <el-radio-button label="month">本月</el-radio-button>
        <el-radio-button label="quarter">本季</el-radio-button>
        <el-radio-button label="year">本年</el-radio-button>
      </el-radio-group>
    </div>
    <div class="chart-box-left">
      <Card class="left-card" title="未处理预警数" :value="cardData.waitHandleCount" color="#FF6B6B" />
      <Card class="left-card" title="已处理预警数" :value="cardData.handledCount" color="#4ECDC4" />
      <Card class="left-card" title="高危预警数" :value="cardData.highRiskCount" color="#F56C6C" />
    </div>
    <Circle title-text="预警类型占比" :data="typeCount" />
    <Columnar
      title="预警触发趋势"
      :x-data="trendLabels"
      :series-data="[{ name: '预警数量', data: trendValues }]"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { getAlertChart } from '#/api/genchuan/homePage/workBench/alertMgmt/alertList';
import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';
import { mockChartData } from './table/data.js';   // 引入模拟图表数据

// 是否使用模拟数据（与环境变量同步）
const USE_MOCK = true;

const timeRange = ref('week');
const typeCount = ref([]);
const timeTrend = ref([]);
const cardData = reactive({
  waitHandleCount: 0,
  handledCount: 0,
  highRiskCount: 0
});

const trendLabels = computed(() => timeTrend.value.map(item => item.label || item.hour || item.date));
const trendValues = computed(() => timeTrend.value.map(item => item.value));

const fetchChartData = async () => {
  if (USE_MOCK) {
    // 模拟数据（可根据 timeRange 模拟不同数据，此处简化）
    const mock = mockChartData[timeRange.value] || mockChartData.week;
    typeCount.value = mock.typeCount;
    timeTrend.value = mock.timeTrend;
    cardData.waitHandleCount = mock.cardData.waitHandleCount;
    cardData.handledCount = mock.cardData.handledCount;
    cardData.highRiskCount = mock.cardData.highRiskCount;
    return;
  }

  // 真实接口调用
  try {
    const res = await getAlertChart({ timeRange: timeRange.value });
    if (res.code === 200) {
      typeCount.value = res.data.typeCount || [];
      timeTrend.value = res.data.timeTrend || [];
      cardData.waitHandleCount = res.data.cardData?.waitHandleCount || 0;
      cardData.handledCount = res.data.cardData?.handledCount || 0;
      cardData.highRiskCount = res.data.cardData?.highRiskCount || 0;
    }
  } catch (error) {
    console.error('获取图表数据失败', error);
  }
};

onMounted(() => {
  fetchChartData();
});
</script>

<style scoped lang="scss">
.park-chart-box {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}
.chart-header {
  width: 100%;
  text-align: right;
  margin-bottom: 10px;
}
.chart-box-left {
  display: flex;
  gap: 20px;
  flex: 1;
}
.left-card {
  flex: 1;
}
</style>
