<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { loadTMap } from '#/utils/genchuan/useTMap.ts';

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  markerIcons: {
    type: Object,
    default: () => ({
      normal: '/static/imgs/dataHub/map/marker-blue.png',
    }),
  },
  // 状态与样式id的映射，如 { normal: 'normal', exception: 'exception' }
  statusIconMap: {
    type: Object,
    default: () => ({}),
  },
  // 数据项中表示状态的字段名，默认为 'status'
  statusKey: {
    type: String,
    default: 'status',
  },
  infoWindowConfig: {
    type: Object,
    default: () => ({
      title: 'id',
      fields: [
        { key: 'status', label: '状态' },
        { key: 'location', label: '位置' },
      ],
    }),
  },
});

const emit = defineEmits(['marker-click']);

const mapRef = ref(null);
let map = null;
let markerLayer = null;
let infoWindow = null;
let TMapInstance = null;

// 动态构建标记样式集
const buildMarkerStyles = () => {
  const styles = {};
  // 默认 normal 样式
  const defaultSrc = props.markerIcons.normal || '/static/imgs/dataHub/map/marker-blue.png';
  styles.normal = new TMapInstance.MarkerStyle({
    width: 25,
    height: 35,
    anchor: { x: 12.5, y: 35 },
    src: defaultSrc,
  });
  // 根据 statusIconMap 添加其他样式（如 exception）
  Object.entries(props.statusIconMap).forEach(([status, styleId]) => {
    const iconSrc = props.markerIcons[styleId] || props.markerIcons[status];
    if (iconSrc && !styles[styleId]) {
      styles[styleId] = new TMapInstance.MarkerStyle({
        width: 25,
        height: 35,
        anchor: { x: 12.5, y: 35 },
        src: iconSrc,
      });
    }
  });
  return styles;
};

const initMap = async () => {
  if (!mapRef.value) return;
  try {
    const TMap = await loadTMap();
    TMapInstance = TMap;
    map = new TMap.Map(mapRef.value, {
      center: new TMap.LatLng(24.5123, 117.6589),
      zoom: 12,
    });
    infoWindow = new TMap.InfoWindow({
      map,
      position: new TMap.LatLng(0, 0),
      offset: { x: 0, y: -32 },
    });
    infoWindow.close();
    initMarkerLayer();
    renderMarkers();
  } catch (error) {
    console.error('地图初始化失败:', error);
  }
};

const initMarkerLayer = () => {
  const styles = buildMarkerStyles();
  markerLayer = new TMapInstance.MultiMarker({
    id: 'area-monitor-marker-layer',
    map,
    enableCollision: false,
    styles,
    geometries: [],
  });
  markerLayer.on('click', onMarkerClick);
};

const generateInfoWindowContent = (properties) => {
  const config = props.infoWindowConfig;
  const title = properties[config.title] || '未知';
  let fieldsHtml = '';
  if (config.fields) {
    config.fields.forEach((field) => {
      const value = properties[field.key] ?? '';
      const style = field.bold ? 'font-weight:bold;' : '';
      fieldsHtml += `
        <tr>
          <td style="width:90px;padding-right:8px;text-align:right;">${field.label}：</td>
          <td style="${style}">${value}</td>
        </td>
      `;
    });
  }
  return `
    <div style="padding:10px;min-width:220px;">
      <h3 style="margin:0 0 8px;font-size:15px;">${title}</h3>
      <table style="width:100%;border-collapse:collapse;">
        ${fieldsHtml}
      </table>
    </div>
  `;
};

const onMarkerClick = (evt) => {
  const { position, properties } = evt.geometry;
  if (!infoWindow || !properties) return;
  infoWindow.setPosition(position);
  infoWindow.setContent(generateInfoWindowContent(properties));
  infoWindow.open();
  emit('marker-click', properties);
};

const renderMarkers = () => {
  if (!map || !props.data?.length || !TMapInstance || !markerLayer) return;
  const geometries = [];
  const bounds = new TMapInstance.LatLngBounds();

  props.data.forEach((item) => {
    if (!item.coordinate) return;
    const [lng, lat] = item.coordinate.split(',').map(Number);
    if (isNaN(lng) || isNaN(lat)) return;
    const position = new TMapInstance.LatLng(lat, lng);
    bounds.extend(position);

    // 根据状态字段选择样式ID
    let styleId = 'normal';
    const statusValue = item[props.statusKey];
    if (statusValue && props.statusIconMap[statusValue]) {
      styleId = props.statusIconMap[statusValue];
    }

    geometries.push({
      id: item.id || `${item.areaId || ''}_${Date.now()}_${Math.random()}`,
      styleId,
      position,
      properties: item,
    });
  });

  markerLayer.setGeometries(geometries);
  if (geometries.length > 0) {
    // 自动调整视野以包含所有标记
    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 50 });
    }
  }
};

const setCenter = (lngLat) => {
  if (!map || !TMapInstance) return;
  const [lng, lat] = Array.isArray(lngLat) ? lngLat : [lngLat.lng, lngLat.lat];
  const position = new TMapInstance.LatLng(lat, lng);
  map.setCenter(position);
};

const setZoom = (zoom) => { if (map) map.setZoom(zoom); };
const getCenter = () => { if (!map) return null; const center = map.getCenter(); return { lng: center.getLng(), lat: center.getLat() }; };
const getZoom = () => map ? map.getZoom() : null;
const resize = () => { if (map) map.resize(); };

defineExpose({
  setCenter, setZoom, getCenter, getZoom, resize,
});

watch(() => props.data, () => {
  if (markerLayer) renderMarkers();
}, { deep: true });

onMounted(() => {
  initMap();
  window.addEventListener('resize', resize);
});

onUnmounted(() => {
  window.removeEventListener('resize', resize);
  if (markerLayer) markerLayer.destroy?.();
  if (infoWindow) infoWindow.destroy?.();
  if (map && map.destroy) map.destroy();
});
</script>

<template>
  <div class="map-container">
    <div ref="mapRef" class="map-content"></div>
  </div>
</template>

<style scoped>
.map-container { position: relative; width: 100%; height: 100%; min-height: 300px; }
.map-content { width: 100%; height: 100%; }
</style>
