<!-- space-push/table/chart.vue -->
<template>
  <div class="stats-four-visualization">
    <div class="cards-section">
      <div class="stat-card" :style="{ borderLeftColor: '#409eff' }" @click="handleCardClick('totalPush')">
        <div class="card-header">
          <span class="card-title">总推送量</span>
          <div class="card-indicator" :style="{ backgroundColor: '#409eff' }"></div>
        </div>
        <div class="card-body">
          <div class="card-value" :style="{ color: '#409eff' }">{{ totalPushCount }}</div>
        </div>
      </div>
      <div class="stat-card" :style="{ borderLeftColor: '#67c23a' }" @click="handleCardClick('successRate')">
        <div class="card-header">
          <span class="card-title">推送成功率</span>
          <div class="card-indicator" :style="{ backgroundColor: '#67c23a' }"></div>
        </div>
        <div class="card-body">
          <div class="card-value" :style="{ color: '#67c23a' }">{{ pushSuccessRate }}%</div>
        </div>
      </div>
    </div>

    <div class="right-section">
      <div class="chart-box">
        <div ref="lineChartRef" class="chart-container"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus';
import { getSpacePushChart } from '#/api/genchuan/industry/chargePark/carService/carGuide/spacePush/index.js';

const emit = defineEmits(['refresh']);

const lineChartRef = ref(null);
let lineChart = null;
const totalPushCount = ref(0);
const pushSuccessRate = ref(0);
const pushTrendList = ref([]);

const fetchChartData = async () => {
  try {
    const res = await getSpacePushChart();
    totalPushCount.value = res.totalPushCount || 0;
    pushSuccessRate.value = res.pushSuccessRate || 0;
    pushTrendList.value = res.pushTrendList || [];
    renderLineChart();
  } catch (error) {
    console.error('获取空位推送图表数据失败', error);
    ElMessage.error('加载图表失败，请稍后重试');
  }
};

const renderLineChart = () => {
  if (!lineChartRef.value) return;
  if (lineChart) lineChart.dispose();
  lineChart = echarts.init(lineChartRef.value);

  lineChart.setOption({
    title: { text: '推送量趋势（近30天）', left: 'center', top: 10, textStyle: { color: '#6E7E91', fontSize: 14 } },
    tooltip: { trigger: 'axis', formatter: '{b}<br/>推送数量: {c} 条' },
    xAxis: { type: 'category', data: pushTrendList.value.map(item => item.date), name: '日期', axisLabel: { rotate: pushTrendList.value.length > 8 ? 30 : 0 } },
    yAxis: { type: 'value', name: '推送数量' },
    series: [{
      name: '推送量',
      type: 'line',
      data: pushTrendList.value.map(item => item.count),
      smooth: true,
      lineStyle: { width: 3, color: '#409eff' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(64,158,255,0.3)' },
          { offset: 1, color: 'rgba(64,158,255,0.05)' },
        ]),
      },
      symbol: 'circle',
      symbolSize: 6,
    }],
  });

  lineChart.on('click', (params) => {
    if (params.componentType === 'series') {
      const date = pushTrendList.value[params.dataIndex]?.date;
      if (date) emit('refresh', { pushDate: date });
    }
  });
};

const handleCardClick = (type) => {
  if (type === 'totalPush') {
    emit('refresh', { cardType: 'totalPush' });
  } else if (type === 'successRate') {
    ElMessage.info('查看推送成功率明细趋势');
  }
};

onMounted(() => {
  fetchChartData();
  window.addEventListener('resize', () => lineChart?.resize());
});
onUnmounted(() => {
  lineChart?.dispose();
});
</script>

<style scoped>
.stats-four-visualization {
  display: flex;
  gap: 20px;
  width: 100%;
  min-height: 320px;
}
.cards-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  width: 260px;
  flex-shrink: 0;
}
.stat-card {
  padding: 12px 14px;
  border-radius: 8px;
  border-left: 4px solid;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}
.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.card-title {
  font-size: 13px;
  color: #6e7e91;
  font-weight: 600;
}
.card-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.card-body {
  flex: 1;
  display: flex;
  align-items: center;
}
.card-value {
  font-size: 22px;
  font-weight: 700;
}
.right-section {
  flex: 1;
  min-height: 320px;
}
.chart-box {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
