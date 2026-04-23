<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';
import * as echarts from 'echarts';
import { getUserAppealChartData } from '#/api/genchuan/industry/chargePark/carService/complaintMediate/userAppeal/index.js';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['refresh']);

const state = reactive({
  cardList: [
    { title: '待申诉数', value: 0, color: '#F56C6C', key: 'waitAppealCount' },
    { title: '处理完成率', value: '0%', color: '#67C23A', key: 'handleFinishRate' },
  ],
  trendList: [],
});

const lineChartRef = ref(null);
let lineChart = null;

const fetchChartData = async () => {
  try {
    const data = await getUserAppealChartData({ startTime: '', endTime: '' }); // 后端按近30天处理
    if (data) {
      state.cardList[0].value = data.waitAppealCount ?? 0;
      let rate = data.handleFinishRate ?? 0;
      const percent = rate <= 1 ? (rate * 100).toFixed(1) : rate;
      state.cardList[1].value = `${percent}%`;
      state.trendList = data.appealTrendList || [];
      initChart();
    }
  } catch (error) {
    console.error('获取用户申诉统计数据失败', error);
    ElMessage.error('加载统计图表失败');
  }
};

const getLineOption = () => ({
  backgroundColor: 'transparent',
  title: { text: '申诉量趋势（近30天）', left: 'center', top: 10, textStyle: { color: '#6E7E91', fontSize: 14 } },
  tooltip: { trigger: 'axis', formatter: '{b}<br/>申诉数量: {c} 条' },
  xAxis: { type: 'category', data: state.trendList.map(item => item.date), axisLabel: { rotate: state.trendList.length > 8 ? 30 : 0 } },
  yAxis: { type: 'value', name: '申诉数量（条）' },
  series: [{
    name: '申诉数量', type: 'line', data: state.trendList.map(item => item.count ?? 0), smooth: true,
    lineStyle: { width: 3, color: '#E6A23C' },
    areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(230,162,60,0.3)' }, { offset: 1, color: 'rgba(230,162,60,0.05)' }
      ]) },
    symbol: 'circle', symbolSize: 6,
  }]
});

const initChart = () => {
  if (lineChartRef.value) {
    if (lineChart) lineChart.dispose();
    lineChart = echarts.init(lineChartRef.value);
    lineChart.setOption(getLineOption());
    lineChart.on('click', (params) => {
      if (params.componentType === 'series') {
        const date = state.trendList[params.dataIndex]?.date;
        if (date) emit('refresh', { date });
      }
    });
  }
};

const handleResize = () => {
  lineChart?.resize();
};

const handleCardClick = (index) => {
  const card = state.cardList[index];
  if (card.key === 'waitAppealCount') emit('refresh', { statusList: ['待处理'] }); // 待审核+待处置
  else if (card.key === 'handleFinishRate') emit('refresh', { statusList: ['已完成'] });
};

onMounted(() => {
  nextTick(() => {
    fetchChartData();
    window.addEventListener('resize', handleResize);
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  lineChart?.dispose();
});
</script>

<template>
  <div class="stats-four-visualization">
    <div class="cards-section">
      <div v-for="(card, index) in state.cardList" :key="index" class="stat-card" :style="{ borderLeftColor: card.color }" @click="handleCardClick(index)">
        <div class="card-header"><span class="card-title">{{ card.title }}</span><div class="card-indicator" :style="{ backgroundColor: card.color }"></div></div>
        <div class="card-body"><div class="card-value" :style="{ color: card.color }">{{ card.value }}</div></div>
      </div>
    </div>
    <div class="right-section">
      <div class="chart-box"><div ref="lineChartRef" class="chart-container"></div></div>
    </div>
  </div>
</template>

<style scoped>
/* 样式与原意见建议图表完全一致，此处省略（保持相同） */
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
  border-left: 4px solid #4a90e2;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  cursor: pointer;
}
.card-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
.card-title { font-size: 13px; color: #6e7e91; font-weight: 600; }
.card-indicator { width: 8px; height: 8px; border-radius: 50%; }
.card-body { flex:1; display: flex; align-items: center; }
.card-value { font-size: 22px; font-weight: 700; }
.right-section { flex:1; display: flex; height: 320px; }
.chart-box { flex:1; height: 100%; border-radius: 8px; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.chart-container { width: 100%; height: 100%; }
</style>
