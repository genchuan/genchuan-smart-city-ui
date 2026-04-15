<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

import { ElButton, ElMessage } from 'element-plus';

import { loadTMap } from '#/utils/genchuan/useTMap.ts';

import { parseFenceArea, stringifyFenceArea } from '../table/data';

const props = defineProps({
  modelValue: {
    type: String,
    default: '[]',
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  height: {
    type: String,
    default: '320px',
  },
});

const emit = defineEmits(['update:modelValue', 'areaClick']);

const mapRef = ref(null);
const points = ref(parseFenceArea(props.modelValue));

let map = null;
let TMapInstance = null;
let polygonLayer = null;
let polylineLayer = null;
let markerLayer = null;

function getPointFromEvent(event) {
  const latLng = event?.latLng || event?.latlng;
  if (!latLng) return null;

  const lat =
    typeof latLng.getLat === 'function' ? latLng.getLat() : latLng.lat;
  const lng =
    typeof latLng.getLng === 'function' ? latLng.getLng() : latLng.lng;

  if (Number.isNaN(Number(lng)) || Number.isNaN(Number(lat))) return null;
  return {
    lng: Number(lng),
    lat: Number(lat),
  };
}

function emitArea() {
  emit('update:modelValue', stringifyFenceArea(points.value));
}

function destroyLayers() {
  if (polygonLayer?.destroy) polygonLayer.destroy();
  if (polylineLayer?.destroy) polylineLayer.destroy();
  if (markerLayer?.destroy) markerLayer.destroy();
  polygonLayer = null;
  polylineLayer = null;
  markerLayer = null;
}

function fitBounds() {
  if (!map || !TMapInstance || points.value.length === 0) return;

  const bounds = new TMapInstance.LatLngBounds();
  for (const point of points.value) {
    bounds.extend(new TMapInstance.LatLng(point.lat, point.lng));
  }
  if (!bounds.isEmpty()) {
    map.fitBounds(bounds, { padding: 80 });
  }
}

function renderArea() {
  if (!map || !TMapInstance) return;

  destroyLayers();
  const paths = points.value.map(
    (point) => new TMapInstance.LatLng(point.lat, point.lng),
  );

  if (paths.length >= 3 && TMapInstance.MultiPolygon) {
    polygonLayer = new TMapInstance.MultiPolygon({
      id: 'fence-polygon-layer',
      map,
      styles: {
        polygon: new TMapInstance.PolygonStyle({
          color: 'rgba(47, 128, 237, 0.22)',
          borderColor: '#2f80ed',
          borderWidth: 2,
        }),
      },
      geometries: [
        {
          id: 'fence-polygon',
          styleId: 'polygon',
          paths,
          properties: {
            points: points.value,
          },
        },
      ],
    });
    polygonLayer.on?.('click', () => emit('areaClick'));
  }

  if (paths.length >= 2 && TMapInstance.MultiPolyline) {
    const linePaths = paths.length >= 3 ? [...paths, paths[0]] : paths;
    polylineLayer = new TMapInstance.MultiPolyline({
      id: 'fence-line-layer',
      map,
      styles: {
        line: new TMapInstance.PolylineStyle({
          color: '#2f80ed',
          width: 4,
          lineCap: 'round',
        }),
      },
      geometries: [
        {
          id: 'fence-line',
          styleId: 'line',
          paths: linePaths,
        },
      ],
    });
  }

  if (TMapInstance.MultiMarker) {
    markerLayer = new TMapInstance.MultiMarker({
      id: 'fence-marker-layer',
      map,
      styles: {
        marker: new TMapInstance.MarkerStyle({
          width: 12,
          height: 12,
          anchor: { x: 6, y: 6 },
          color: '#2f80ed',
        }),
      },
      geometries: paths.map((position, index) => ({
        id: `point-${index}`,
        styleId: 'marker',
        position,
      })),
    });
  }

  fitBounds();
}

async function initMap() {
  await nextTick();
  if (!mapRef.value) return;

  try {
    const TMap = await loadTMap();
    TMapInstance = TMap;
    const firstPoint = points.value[0] || { lat: 24.896_541, lng: 118.675_324 };

    map = new TMap.Map(mapRef.value, {
      center: new TMap.LatLng(firstPoint.lat, firstPoint.lng),
      zoom: 14,
    });

    if (!props.readonly) {
      map.on('click', (event) => {
        const point = getPointFromEvent(event);
        if (!point) return;
        points.value = [...points.value, point];
        emitArea();
        renderArea();
      });
    }

    renderArea();
  } catch (error) {
    console.error('电子围栏地图初始化失败:', error);
    ElMessage.error('地图加载失败，请稍后重试');
  }
}

function resetArea() {
  points.value = [];
  emitArea();
  renderArea();
}

watch(
  () => props.modelValue,
  (value) => {
    const nextPoints = parseFenceArea(value);
    if (JSON.stringify(nextPoints) === JSON.stringify(points.value)) return;
    points.value = nextPoints;
    renderArea();
  },
);

onMounted(() => {
  initMap();
});

onUnmounted(() => {
  destroyLayers();
  if (map?.destroy) map.destroy();
});
</script>

<template>
  <div class="fence-map-editor">
    <div ref="mapRef" class="fence-map" :style="{ height }"></div>
    <div v-if="!readonly" class="map-toolbar">
      <span>点击地图添加围栏顶点，至少需要 3 个点。</span>
      <ElButton size="small" @click="resetArea">重置区域</ElButton>
    </div>
    <div v-else class="map-toolbar">
      <span>围栏点位：{{ points.length }} 个</span>
    </div>
  </div>
</template>

<style scoped>
.fence-map-editor {
  overflow: hidden;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
}

.fence-map {
  width: 100%;
  min-height: 220px;
}

.map-toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  background: var(--el-fill-color-lighter);
}
</style>
