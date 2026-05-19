<script setup>
import { computed, nextTick, onUnmounted, ref, shallowRef } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElButton, ElMessage } from 'element-plus';

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
const movePaused = shallowRef(false);

let map = null;
let markerLayer = null;
let endpointMarkerLayer = null;
let polylineLayer = null;
let TMapInstance = null;
let playbackStartPathIndex = 0;
let smoothTrackItems = [];
let pendingMovingState = null;
let movingFrameId = null;

const REPLAY_MARKER_ID = 'car';
const REPLAY_MARKER_STYLE_ID = 'car-down';
const REPLAY_PATH_ID = 'erasePath';
const SMOOTH_STEP_METERS = 8;

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
  smoothTrackItems = [];
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
  cancelMovingFrame();
  unbindMarkerMoveEvents();
  if (markerLayer?.stopMove) markerLayer.stopMove();
  if (markerLayer?.destroy) markerLayer.destroy();
  if (endpointMarkerLayer?.destroy) endpointMarkerLayer.destroy();
  if (polylineLayer?.destroy) polylineLayer.destroy();
  markerLayer = null;
  endpointMarkerLayer = null;
  polylineLayer = null;
}

function renderTrackLine(options = {}) {
  if (!map || !TMapInstance || points.value.length === 0) return;

  const { fitBounds = true } = options;
  destroyMapLayers();
  smoothTrackItems = buildSmoothTrackItems(points.value);

  const paths = getSmoothTrackPaths(0);
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
        eraseColor: 'rgba(190,188,188,1)',
      }),
    },
    geometries: [
      {
        id: REPLAY_PATH_ID,
        styleId: 'line',
        paths,
      },
    ],
  });

  endpointMarkerLayer = new TMapInstance.MultiMarker({
    id: 'inspect-track-replay-endpoint-marker',
    map,
    styles: {
      start: new TMapInstance.MarkerStyle({
        width: 25,
        height: 35,
        anchor: { x: 16, y: 32 },
        src: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/start.png',
      }),
      end: new TMapInstance.MarkerStyle({
        width: 25,
        height: 35,
        anchor: { x: 16, y: 32 },
        src: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/end.png',
      }),
    },
    geometries: getEndpointGeometries(),
  });

  markerLayer = new TMapInstance.MultiMarker({
    id: 'inspect-track-replay-marker',
    map,
    styles: {
      [REPLAY_MARKER_STYLE_ID]: new TMapInstance.MarkerStyle({
        width: 40,
        height: 40,
        anchor: { x: 20, y: 20 },
        faceTo: 'map',
        rotate: 180,
        src: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/car.png',
      }),
    },
    geometries: getCarGeometries(paths[0], points.value[0]),
  });
  bindMarkerMoveEvents();

  if (fitBounds && !bounds.isEmpty()) {
    map.fitBounds(bounds, { padding: 80 });
  }
  renderActiveMarker();
}

function renderActiveMarker(shouldCenter = true) {
  if (!markerLayer || !TMapInstance || points.value.length === 0) return;

  const point = points.value[activeIndex.value] || points.value[0];
  const position = new TMapInstance.LatLng(point.lat, point.lon);
  markerLayer.setGeometries(getCarGeometries(position, point));
  if (shouldCenter) {
    map?.setCenter(position);
  }
}

function getCarGeometries(carPosition, carProperties) {
  return [
    {
      id: REPLAY_MARKER_ID,
      rank: 100,
      styleId: REPLAY_MARKER_STYLE_ID,
      position: carPosition,
      properties: carProperties,
    },
  ];
}

function getEndpointGeometries() {
  const firstPoint = points.value[0];
  const lastPoint = points.value.at(-1);

  if (!TMapInstance || !firstPoint || !lastPoint) return [];

  return [
    {
      id: 'start',
      styleId: 'start',
      position: new TMapInstance.LatLng(firstPoint.lat, firstPoint.lon),
      properties: firstPoint,
    },
    {
      id: 'end',
      styleId: 'end',
      position: new TMapInstance.LatLng(lastPoint.lat, lastPoint.lon),
      properties: lastPoint,
    },
  ];
}

function bindMarkerMoveEvents() {
  if (!markerLayer?.on) return;
  markerLayer.on('moving', handleMarkerMoving);
  markerLayer.on('move_ended', handleMarkerMoveEnded);
  markerLayer.on('move_stopped', handleMarkerMoveStopped);
  markerLayer.on('move_paused', handleMarkerMovePaused);
  markerLayer.on('move_resumed', handleMarkerMoveResumed);
}

function unbindMarkerMoveEvents() {
  if (!markerLayer?.off) return;
  markerLayer.off('moving', handleMarkerMoving);
  markerLayer.off('move_ended', handleMarkerMoveEnded);
  markerLayer.off('move_stopped', handleMarkerMoveStopped);
  markerLayer.off('move_paused', handleMarkerMovePaused);
  markerLayer.off('move_resumed', handleMarkerMoveResumed);
}

function getTrackPaths(startIndex = 0) {
  return getSmoothTrackPaths(getSmoothPathIndexBySourceIndex(startIndex));
}

function getSmoothTrackPaths(startPathIndex = 0) {
  if (!TMapInstance) return [];
  const source = smoothTrackItems.length > 0 ? smoothTrackItems : points.value;
  return source
    .slice(startPathIndex)
    .map((point) => new TMapInstance.LatLng(point.lat, point.lon));
}

function buildSmoothTrackItems(sourcePoints) {
  if (sourcePoints.length < 2) {
    return sourcePoints.map((point, index) => ({
      ...point,
      sourceIndex: index,
    }));
  }

  const items = [];
  sourcePoints.forEach((point, index) => {
    if (index === 0) {
      items.push({ ...point, sourceIndex: index });
      return;
    }

    const prev = sourcePoints[index - 1];
    const distance = getApproxDistanceMeters(prev, point);
    const stepCount = Math.max(1, Math.ceil(distance / SMOOTH_STEP_METERS));

    for (let step = 1; step <= stepCount; step += 1) {
      const ratio = step / stepCount;
      items.push({
        ...point,
        lat: prev.lat + (point.lat - prev.lat) * ratio,
        lon: prev.lon + (point.lon - prev.lon) * ratio,
        sourceIndex: index,
      });
    }
  });

  return items;
}

function getApproxDistanceMeters(startPoint, endPoint) {
  const latMeters = (endPoint.lat - startPoint.lat) * 111_320;
  const lonMeters =
    (endPoint.lon - startPoint.lon) *
    111_320 *
    Math.cos(((startPoint.lat + endPoint.lat) / 2 / 180) * Math.PI);
  return Math.hypot(latMeters, lonMeters);
}

function getSmoothPathIndexBySourceIndex(sourceIndex) {
  if (smoothTrackItems.length === 0) return sourceIndex;
  const index = smoothTrackItems.findIndex(
    (item) => item.sourceIndex >= sourceIndex,
  );
  return index === -1 ? Math.max(smoothTrackItems.length - 1, 0) : index;
}

function getLatLngNumber(latLng, key) {
  if (!latLng) return Number.NaN;
  const getterName = key === 'lat' ? 'getLat' : 'getLng';
  const getterValue =
    typeof latLng[getterName] === 'function' ? latLng[getterName]() : undefined;
  return Number(latLng[key] ?? getterValue);
}

function getNearestPointIndex(latLng) {
  const lat = getLatLngNumber(latLng, 'lat');
  const lon = getLatLngNumber(latLng, 'lng');
  if (Number.isNaN(lat) || Number.isNaN(lon)) return activeIndex.value;

  let nearestIndex = activeIndex.value;
  let minDistance = Number.POSITIVE_INFINITY;
  points.value.forEach((point, index) => {
    const distance = (point.lat - lat) ** 2 + (point.lon - lon) ** 2;
    if (distance < minDistance) {
      minDistance = distance;
      nearestIndex = index;
    }
  });
  return nearestIndex;
}

function getMovingEventItem(event) {
  return event?.[REPLAY_MARKER_ID] || event;
}

function handleMarkerMoving(event) {
  const movingItem = getMovingEventItem(event);
  const passedLatLngs = Array.isArray(movingItem?.passedLatLngs)
    ? movingItem.passedLatLngs
    : [];
  const currentLatLng =
    passedLatLngs.at(-1) || movingItem?.position || event?.latLng;
  if (!currentLatLng) return;

  pendingMovingState = {
    currentLatLng,
    passedLatLngs,
  };
  if (movingFrameId) return;

  movingFrameId = window.requestAnimationFrame(flushMovingState);
}

function flushMovingState() {
  movingFrameId = null;
  if (!pendingMovingState) return;

  const { currentLatLng, passedLatLngs } = pendingMovingState;
  pendingMovingState = null;

  activeIndex.value = getNearestPointIndex(currentLatLng);
  erasePassedTrack(passedLatLngs);
}

function cancelMovingFrame() {
  if (!movingFrameId) return;
  window.cancelAnimationFrame(movingFrameId);
  movingFrameId = null;
  pendingMovingState = null;
}

function handleMarkerMoveEnded() {
  activeIndex.value = Math.max(points.value.length - 1, 0);
  playing.value = false;
  movePaused.value = false;
  renderActiveMarker();
}

function handleMarkerMoveStopped() {
  playing.value = false;
  movePaused.value = false;
}

function handleMarkerMovePaused() {
  playing.value = false;
  movePaused.value = true;
}

function handleMarkerMoveResumed() {
  playing.value = true;
  movePaused.value = false;
}

function getPlaybackDuration(pathLength) {
  const multiplier = Number(speed.value || 1);
  return Math.max(240, ((pathLength - 1) * 1000) / multiplier);
}

function erasePassedTrack(passedLatLngs) {
  if (!polylineLayer?.eraseTo || passedLatLngs.length === 0) return;

  polylineLayer.eraseTo(
    REPLAY_PATH_ID,
    playbackStartPathIndex + passedLatLngs.length - 1,
    passedLatLngs[passedLatLngs.length - 1],
  );
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
  movePaused.value = false;
  if (markerLayer?.stopMove) markerLayer.stopMove();
}

function startPlayback() {
  if (points.value.length === 0) {
    ElMessage.warning('当前轨迹暂无可回放点位');
    return;
  }

  if (movePaused.value && markerLayer?.resumeMove) {
    markerLayer.resumeMove();
    playing.value = true;
    movePaused.value = false;
    return;
  }

  if (!markerLayer) {
    renderTrackLine();
  }

  if (points.value.length === 1) {
    activeIndex.value = 0;
    renderActiveMarker();
    return;
  }

  const startIndex =
    activeIndex.value >= points.value.length - 1 ? 0 : activeIndex.value;
  activeIndex.value = startIndex;
  playbackStartPathIndex = getSmoothPathIndexBySourceIndex(startIndex);

  if (startIndex === 0) {
    renderTrackLine({ fitBounds: false });
    playbackStartPathIndex = 0;
  }

  renderActiveMarker(false);

  const paths = getTrackPaths(startIndex);
  if (paths.length < 2 || !markerLayer?.moveAlong) return;

  playing.value = true;
  movePaused.value = false;
  markerLayer.moveAlong(
    {
      [REPLAY_MARKER_ID]: {
        path: paths,
        duration: getPlaybackDuration(points.value.length - startIndex),
      },
    },
    { autoRotation: true },
  );
}

function resetPlayback() {
  clearPlayback();
  activeIndex.value = 0;
  playbackStartPathIndex = 0;
  renderTrackLine({ fitBounds: false });
  renderActiveMarker();
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
          <!-- <ElButton :disabled="!playing" @click="pausePlayback">暂停</ElButton> -->
          <ElButton @click="resetPlayback">重置</ElButton>
          <!-- <ElSelect
            v-model="speed"
            class="speed-select"
            @change="handleSpeedChange"
          >
            <ElOption label="1x" :value="1" />
            <ElOption label="1.5x" :value="1.5" />
            <ElOption label="2x" :value="2" />
            <ElOption label="4x" :value="4" />
          </ElSelect> -->
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
