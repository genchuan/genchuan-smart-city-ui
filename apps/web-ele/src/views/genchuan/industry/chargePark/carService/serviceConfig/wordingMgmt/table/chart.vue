<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';
import * as echarts from 'echarts';
import { getWordingMgmtChartData } from '#/api/genchuan/industry/chargePark/carService/serviceConfig/wordingMgmt/index.js';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['refresh']);

const state = reactive({
  cardList: [
    { title: '生效话术数', value: 0, color: '#67C23A', key: 'enableWordingCount' },
    { title: '匹配率', value: '0%', color: '#E6A23C', key: 'matchRate' },
  ],
  pieData: [],
});

const pieChartRef = ref(null);
let pieChart = null;

const fetchChartData = async () => {
  try {
    const data = await getWordingMgmtChartData();
    if (data) {
      state.cardList[0].value = data.enableWordingCount ?? 0;
      let rate = data.matchRate ?? 0;
      const percent = rate <= 1 ? (rate * 100).toFixed(1) : rate;
      state.cardList[1].value = `${percent}%`;
      state.pieData = data.typeCountList || [];
      initChart();
    }
  } catch (error) {
    console.error('获取话术统计数据失败', error);
    ElMessage.error('加载统计图表失败');
  }
};

const getPieOption = () => ({
  backgroundColor: 'transparent',
  title: { text: '话术类型占比', left: 'center', top: 10, textStyle: { color: '#6E7E91', fontSize: 14 } },
  tooltip: { trigger: 'item', formatter: '{b}: {d}%' },
  series: [{
    name: '话术类型', type: 'pie', radius: '55%', center: ['50%', '55%'],
    data: state.pieData.map(item => ({ name: item.type, value: item.count })),
    label: { show: true, formatter: '{b}: {d}%' },
    emphasis: { scale: true },
  }]
});

const initChart = () => {
  if (pieChartRef.value) {
    if (pieChart) pieChart.dispose();
    pieChart = echarts.init(pieChartRef.value);
    pieChart.setOption(getPieOption());
    pieChart.on('click', (params) => {
      if (params.componentType === 'series') {
        const type = params.data.name;
        if (type) emit('refresh', { type });
      }
    });
  }
};

const handleResize = () => {
  pieChart?.resize();
};

const handleCardClick = (index) => {
  const card = state.cardList[index];
  if (card.key === 'enableWordingCount') emit('refresh', { status: '已生效' });
  else if (card.key === 'matchRate') emit('refresh', { highMatchRate: true }); // 匹配率钻取按需实现
};

const refreshStats = () => {
  fetchChartData();
};

onMounted(() => {
  nextTick(() => {
    fetchChartData();
    window.addEventListener('resize', handleResize);
    window.addEventListener('wording-mgmt-refresh-stats', refreshStats);
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('wording-mgmt-refresh-stats', refreshStats);
  pieChart?.dispose();
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
      <div class="chart-box"><div ref="pieChartRef" class="chart-container"></div></div>
    </div>
  </div>
</template>

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
.chart-box { flex:1; height: 100%; border-radius: 8px; background-color: var(--el-bg-color, #fff); box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.chart-container { width: 100%; height: 100%; }
</style>
