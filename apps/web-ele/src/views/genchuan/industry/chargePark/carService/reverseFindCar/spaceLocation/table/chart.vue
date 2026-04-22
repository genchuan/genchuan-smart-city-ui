<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';
import { getSpaceLocationChart } from '#/api/genchuan/industry/chargePark/carService/reverseFindCar/spaceLocation/index.js';
import { ElMessage } from 'element-plus';
import MapComponent from '#/views/genchuan/industry/chargePark/carService/Mapindex.vue';

const emit = defineEmits(['refresh']);

const state = reactive({
  cardList: [
    { title: '总查询量', value: 0, color: '#4A90E2', key: 'totalQueryCount' },
    { title: '定位成功率', value: '0%', color: '#50E3C2', key: 'locationSuccessRate' },
  ],
  mapData: [],
  mapConfig: {
    infoWindowConfig: {
      title: 'spaceNo',
      fields: [
        { key: 'spaceNo', label: '车位编号' },
        { key: 'plateNo', label: '车牌号' },
        { key: 'locationResult', label: '定位结果' },
      ],
    },
  },
});

const mapRef = ref(null);

const fetchChartData = async () => {
  try {
    const data = await getSpaceLocationChart({ timeRange: '近30天' });
    if (data) {
      state.cardList[0].value = data.totalQueryCount ?? 0;
      let rate = data.locationSuccessRate ?? 0;
      const percent = rate <= 1 ? (rate * 100).toFixed(1) : rate;
      state.cardList[1].value = `${percent}%`;
      // 地图数据格式转换
      state.mapData = (data.spaceLocationList || []).map(item => ({
        id: item.spaceId || item.id,
        coordinate: `${item.lon},${item.lat}`,
        spaceNo: item.spaceNo,
        plateNo: item.plateNo,
        locationResult: item.locationResult || '成功',
      }));
    }
  } catch (error) {
    console.error('获取车位定位统计数据失败', error);
    ElMessage.error('加载统计图表失败');
  }
};

const handleCardClick = (index) => {
  const card = state.cardList[index];
  if (card.key === 'totalQueryCount') {
    // 点击总查询量：可触发刷新列表（不额外筛选）
    emit('refresh', { totalQueryCount: true });
  } else if (card.key === 'locationSuccessRate') {
    // 点击成功率：可触发刷新列表（不额外筛选）
    emit('refresh', { locationSuccessRate: true });
  }
};

const handleMarkerClick = (item) => {
  if (item?.id) {
    // 地图标注点击可跳转详情或筛选
    emit('refresh', { spaceId: item.id });
  }
};

// 刷新图表数据
const refresh = () => {
  fetchChartData();
};

defineExpose({ refresh });

onMounted(() => {
  nextTick(() => {
    fetchChartData();
    window.addEventListener('space-location-data-changed', refresh);
  });
});

onUnmounted(() => {
  window.removeEventListener('space-location-data-changed', refresh);
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
          ref="mapRef"
          :data="state.mapData"
          :marker-icons="{ normal: '/static/imgs/dataHub/map/marker-blue.png' }"
          :info-window-config="state.mapConfig.infoWindowConfig"
          @marker-click="handleMarkerClick"
        />
      </div>
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
.map-wrapper { width: 100%; height: 100%; border-radius: 8px; overflow: hidden; }
</style>
