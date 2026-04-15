<script setup>
import { computed, nextTick, onUnmounted, ref, shallowRef } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElButton, ElMessage, ElOption, ElSelect } from 'element-plus';

import { getInspectTrackReplay } from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/inspectTrack';
import { loadTMap } from '#/utils/genchuan/useTMap.ts';

import { formatTrackTime, parseTrackPoints } from '../table/data';

const mapRef = ref(null);
const rowData = shallowRef({});
const replayData = shallowRef({});
const loading = shallowRef(false);
const playing = shallowRef(false);
const activeIndex = shallowRef(0);
const speed = shallowRef(1);
const points = shallowRef([]);

let map = null;
let markerLayer = null;
let polylineLayer = null;
let timer = null;
let TMapInstance = null;

const activePoint = computed(() => points.value[activeIndex.value] || {});
const activePointCoordinate = computed(
  () => `${activePoint.value.lon || '-'}, ${activePoint.value.lat || '-'}`,
);
const progressText = computed(() => {
  if (points.value.length === 0) return '0/0';
  return `${activeIndex.value + 1}/${points.value.length}`;
});

const [Modal, modalApi] = useVbenModal({
  footer: false,
  title: '巡检轨迹回放',
  width: 920,
  async onOpenChange(isOpen) {
    if (!isOpen) {
      clearPlayback();
      return;
    }
    rowData.value = modalApi.getData() || {};
    await loadReplayData();
  },
});

function normalizeReplayData(data) {
  const source = data?.points || data?.trackPointList ? data : rowData.value;
  const pointList = parseTrackPoints(source.points || source.trackPointList);

  replayData.value = {
    ...rowData.value,
    ...source,
    userName: source.userName || source.user_name || rowData.value.userName,
    trackTime: source.trackTime || source.track_time || rowData.value.trackTime,
  };
  points.value = pointList;
  activeIndex.value = 0;
}

async function loadReplayData() {
  if (!rowData.value?.id) {
    normalizeReplayData(rowData.value);
    await initMap();
    return;
  }

  loading.value = true;
  try {
    const response = await getInspectTrackReplay(rowData.value.id);
    normalizeReplayData(response || rowData.value);
  } catch (error) {
    console.error('获取巡检轨迹回放失败，使用行数据:', error);
    normalizeReplayData(rowData.value);
  } finally {
    loading.value = false;
  }

  await initMap();
}

function destroyMapLayers() {
  if (markerLayer?.destroy) markerLayer.destroy();
  if (polylineLayer?.destroy) polylineLayer.destroy();
  markerLayer = null;
  polylineLayer = null;
}

function renderTrackLine() {
  if (!map || !TMapInstance || points.value.length === 0) return;

  destroyMapLayers();

  const paths = points.value.map(
    (point) => new TMapInstance.LatLng(point.lat, point.lon),
  );
  const bounds = new TMapInstance.LatLngBounds();
  paths.forEach((path) => bounds.extend(path));

  polylineLayer = new TMapInstance.MultiPolyline({
    id: 'inspect-track-replay-line',
    map,
    styles: {
      line: new TMapInstance.PolylineStyle({
        color: '#2f80ed',
        width: 6,
        borderWidth: 2,
        borderColor: '#ffffff',
        lineCap: 'round',
      }),
    },
    geometries: [
      {
        id: 'track-line',
        styleId: 'line',
        paths,
      },
    ],
  });

  markerLayer = new TMapInstance.MultiMarker({
    id: 'inspect-track-replay-marker',
    map,
    styles: {
      start: new TMapInstance.MarkerStyle({
        width: 24,
        height: 34,
        anchor: { x: 12, y: 34 },
        src: '/static/imgs/dataHub/map/marker-blue.png',
      }),
    },
    geometries: [],
  });

  if (!bounds.isEmpty()) {
    map.fitBounds(bounds, { padding: 80 });
  }
  renderActiveMarker();
}

function renderActiveMarker() {
  if (!markerLayer || !TMapInstance || points.value.length === 0) return;

  const point = points.value[activeIndex.value] || points.value[0];
  markerLayer.setGeometries([
    {
      id: 'active-point',
      styleId: 'start',
      position: new TMapInstance.LatLng(point.lat, point.lon),
      properties: point,
    },
  ]);
  map?.setCenter(new TMapInstance.LatLng(point.lat, point.lon));
}

async function initMap() {
  await nextTick();
  if (!mapRef.value) return;

  try {
    const TMap = await loadTMap();
    TMapInstance = TMap;
    if (map?.destroy) map.destroy();

    const firstPoint = points.value[0] || { lat: 24.896_541, lon: 118.675_324 };
    map = new TMap.Map(mapRef.value, {
      center: new TMap.LatLng(firstPoint.lat, firstPoint.lon),
      zoom: 14,
    });
    renderTrackLine();
  } catch (error) {
    console.error('轨迹回放地图初始化失败:', error);
    ElMessage.error('地图加载失败，请稍后重试');
  }
}

function clearPlayback() {
  playing.value = false;
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function startPlayback() {
  if (points.value.length === 0) {
    ElMessage.warning('当前轨迹暂无可回放点位');
    return;
  }
  clearPlayback();
  playing.value = true;
  timer = setInterval(
    () => {
      if (activeIndex.value >= points.value.length - 1) {
        clearPlayback();
        return;
      }
      activeIndex.value += 1;
      renderActiveMarker();
    },
    Math.max(240, 1000 / Number(speed.value || 1)),
  );
}

function pausePlayback() {
  clearPlayback();
}

function resetPlayback() {
  clearPlayback();
  activeIndex.value = 0;
  renderActiveMarker();
}

function handleSpeedChange(value) {
  speed.value = value;
  if (playing.value) {
    startPlayback();
  }
}

function open(row) {
  modalApi.setData(row || {}).open();
}

onUnmounted(() => {
  clearPlayback();
  destroyMapLayers();
  if (map?.destroy) map.destroy();
});

defineExpose({
  open,
});
</script>

<template>
  <Modal>
    <div class="replay-dialog" v-loading="loading">
      <div class="replay-summary">
        <div>
          <div class="summary-title">
            {{ replayData.userName || rowData.userName || '巡检人员' }}
          </div>
          <div class="summary-sub">
            轨迹ID：{{ rowData.id || '-' }} ｜ 轨迹时间：{{
              formatTrackTime(replayData.trackTime || rowData.trackTime)
            }}
          </div>
        </div>
        <div class="summary-progress">回放进度：{{ progressText }}</div>
      </div>

      <div ref="mapRef" class="replay-map"></div>

      <div class="replay-controls">
        <div class="point-info">
          <span>当前点位：</span>
          <span>{{ activePointCoordinate }}</span>
          <span v-if="activePoint.time">
            ｜ {{ formatTrackTime(activePoint.time) }}
          </span>
        </div>
        <div class="control-buttons">
          <ElButton type="primary" :disabled="playing" @click="startPlayback">
            回放
          </ElButton>
          <ElButton :disabled="!playing" @click="pausePlayback">暂停</ElButton>
          <ElButton @click="resetPlayback">重置</ElButton>
          <ElSelect
            v-model="speed"
            class="speed-select"
            @change="handleSpeedChange"
          >
            <ElOption label="1x" :value="1" />
            <ElOption label="1.5x" :value="1.5" />
            <ElOption label="2x" :value="2" />
            <ElOption label="4x" :value="4" />
          </ElSelect>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.replay-dialog {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 560px;
}

.replay-summary {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
}

.summary-title {
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.summary-sub,
.summary-progress,
.point-info {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.replay-map {
  width: 100%;
  height: 430px;
  overflow: hidden;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
}

.replay-controls {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
}

.control-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.speed-select {
  width: 96px;
}
</style>
