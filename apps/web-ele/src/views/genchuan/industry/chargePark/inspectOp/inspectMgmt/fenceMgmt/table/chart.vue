<script setup>
import { computed, onMounted, reactive, shallowRef } from 'vue';

import { ElTag } from 'element-plus';

import { getFenceMgmtChart } from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/fenceMgmt';
import IndicatorClick from '#/genchuan-components/stats/indicatorClick.vue';

import FenceMapEditor from '../components/FenceMapEditor.vue';
import {
  getFenceStatusTagType,
  getMockChartData,
  normalizeFenceMgmtRow,
} from './data';

const emit = defineEmits(['alarmFilter', 'mapFilter', 'statusFilter']);

const activeFence = shallowRef(null);
const state = reactive({
  cardList: [
    {
      title: '围栏数',
      value: 0,
      desc: '全部电子围栏',
      filterType: 'all',
      color: '#2f80ed',
    },
    {
      title: '告警触发数',
      value: 0,
      desc: '越界告警累计',
      filterType: 'alarmed',
      color: '#e74c3c',
    },
  ],
  mapData: [],
});

const activeArea = computed(() => activeFence.value?.area || '[]');

function normalizeMapData(mapData) {
  if (!Array.isArray(mapData)) return [];
  return mapData.map((item, index) =>
    normalizeFenceMgmtRow({
      ...item,
      id: item.id || index + 1,
    }),
  );
}

function normalizeChartData(data) {
  const chartData = data?.mapData || data?.cardData ? data : getMockChartData();
  const cardData = chartData.cardData || {};

  state.cardList[0].value = cardData.fenceCount ?? 0;
  state.cardList[1].value = cardData.alarmCount ?? 0;
  state.mapData = normalizeMapData(chartData.mapData);
  activeFence.value = state.mapData[0] || null;
}

async function fetchChartData() {
  try {
    const response = await getFenceMgmtChart();
    normalizeChartData(response);
  } catch (error) {
    console.error('获取电子围栏统计失败，使用静态数据:', error);
    normalizeChartData(getMockChartData());
  }
}

function handleCardClick(card) {
  if (card.filterType === 'alarmed') {
    emit('alarmFilter');
    return;
  }
  emit('statusFilter', '');
}

function handleFenceClick(item) {
  activeFence.value = item;
  emit('mapFilter', item);
}

onMounted(() => {
  fetchChartData();
});
</script>

<template>
  <div class="fence-visualization">
    <div class="cards-section">
      <IndicatorClick
        v-for="card in state.cardList"
        :key="card.title"
        :color="card.color"
        :desc="card.desc"
        :status="card.filterType"
        :title="card.title"
        :value="card.value"
        @click="handleCardClick"
      />
    </div>

    <div class="map-section">
      <div class="map-title">围栏区域分布</div>
      <FenceMapEditor
        :model-value="activeArea"
        readonly
        height="320px"
        @area-click="handleFenceClick(activeFence)"
      />
      <div class="map-fence-list">
        <ElTag
          v-for="item in state.mapData.slice(0, 6)"
          :key="item.id"
          class="fence-tag"
          effect="plain"
          :type="getFenceStatusTagType(item.status)"
          @click="handleFenceClick(item)"
        >
          {{ item.name }} {{ item.status }}
        </ElTag>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fence-visualization {
  display: flex;
  flex-wrap: nowrap;
  gap: 20px;
  width: 100%;
  min-height: 320px;
  overflow: hidden;
}

.cards-section {
  display: grid;
  flex-shrink: 0;
  grid-template-rows: repeat(2, 1fr);
  gap: 12px;
  width: 240px;
  height: 320px;
}

.map-section {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  height: 320px;
  overflow: hidden;
  background-color: hsl(var(--card));
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
}

.map-title {
  position: absolute;
  top: 12px;
  left: 16px;
  z-index: 2;
  padding: 4px 8px;
  font-size: 14px;
  color: #4b5563;
  background: rgb(255 255 255 / 88%);
  border-radius: 4px;
}

.map-fence-list {
  position: absolute;
  right: 12px;
  bottom: 12px;
  left: 12px;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.fence-tag {
  cursor: pointer;
  background: rgb(255 255 255 / 90%);
}
</style>
