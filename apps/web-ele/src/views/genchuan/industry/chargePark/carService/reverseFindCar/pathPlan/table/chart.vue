<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';
import { getPathPlanChart } from '#/api/genchuan/industry/chargePark/carService/reverseFindCar/pathPlan/index.js';
import { ElMessage } from 'element-plus';
import MapComponent from './Mapindex.vue';

const emit = defineEmits(['refresh']);

const state = reactive({
  cardList: [
    { title: '总规划量', value: 0, color: '#4A90E2', key: 'totalPlanCount' },
    { title: '规划成功率', value: '0%', color: '#50E3C2', key: 'planSuccessRate' },
  ],
  pathList: [],
  mapConfig: {
    polylineOptions: { color: '#4A90E2', width: 4, opacity: 0.8 },
    infoWindowConfig: { title: 'pathInfo', fields: [{ key: 'pathLength', label: '路径长度' }, { key: 'expectDuration', label: '预计时长' }] },
  },
});

const mapComponentRef = ref(null);

const fetchChartData = async () => {
  try {
    const data = await getPathPlanChart({ timeRange: '近30天' });
    if (data) {
      state.cardList[0].value = data.totalPlanCount ?? 0;
      let rate = data.planSuccessRate ?? 0;
      const percent = rate <= 1 ? (rate * 100).toFixed(1) : rate;
      state.cardList[1].value = `${percent}%`;

      state.pathList = (data.pathList || []).map((item, index) => ({
        id: `chart_path_${index}`,
        path: item.path,
        pathLength: null,
        expectDuration: null,
      }));
    }
  } catch (error) {
    console.error('获取路径规划统计数据失败', error);
    ElMessage.error('加载统计图表失败');
  }
};

const handleCardClick = (index) => {
  const card = state.cardList[index];
  if (card.key === 'totalPlanCount') emit('refresh', { totalPlanCount: true });
  else if (card.key === 'planSuccessRate') emit('refresh', { planSuccessRate: true });
};

const handlePathClick = (pathItem) => {
  if (pathItem && pathItem.path && pathItem.path.length >= 2) {
    const startCoord = { lng: pathItem.path[0][0], lat: pathItem.path[0][1] };
    const endCoord = { lng: pathItem.path[pathItem.path.length - 1][0], lat: pathItem.path[pathItem.path.length - 1][1] };
    // 先临时绘制蓝色路径（立即反馈）
    if (mapComponentRef.value) {
      mapComponentRef.value.drawSinglePath({
        id: 'temp_' + Date.now(),
        pathPoints: pathItem.path,
        startCoord,
        endCoord,
        pathLength: null,
        expectDuration: null,
      }, false);
    }
    // 发送坐标给表格，表格匹配后会重新绘制红色路径并高亮行
    emit('refresh', { pathCoordinates: { startCoord, endCoord } });
  }
};

const onDrawPathPlan = (event) => {
  const pathData = event.detail;
  if (mapComponentRef.value && pathData) {
    mapComponentRef.value.drawSinglePath(pathData, pathData.highlight || false);
  }
};

const refresh = () => fetchChartData();
defineExpose({ refresh });

onMounted(() => {
  nextTick(() => {
    fetchChartData();
    window.addEventListener('path-plan-data-changed', refresh);
    window.addEventListener('draw-path-plan', onDrawPathPlan);
  });
});
onUnmounted(() => {
  window.removeEventListener('path-plan-data-changed', refresh);
  window.removeEventListener('draw-path-plan', onDrawPathPlan);
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
      <div class="map-wrapper">
        <MapComponent
          ref="mapComponentRef"
          :paths="state.pathList"
          :path-options="state.mapConfig.polylineOptions"
          :info-window-config="state.mapConfig.infoWindowConfig"
          @path-click="handlePathClick"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-four-visualization { display: flex; gap: 20px; width: 100%; min-height: 320px; }
.cards-section { display: grid; grid-template-columns: 1fr; gap: 12px; width: 260px; flex-shrink: 0; }
.stat-card { padding: 12px 14px; border-radius: 8px; border-left: 4px solid #4a90e2; box-shadow: 0 2px 8px rgba(0,0,0,0.08); cursor: pointer; }
.card-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
.card-title { font-size: 13px; color: #6e7e91; font-weight: 600; }
.card-indicator { width: 8px; height: 8px; border-radius: 50%; }
.card-body { flex:1; display: flex; align-items: center; }
.card-value { font-size: 22px; font-weight: 700; }
.right-section { flex:1; display: flex; height: 320px; }
.map-wrapper { width: 100%; height: 100%; border-radius: 8px; overflow: hidden; }
</style>
