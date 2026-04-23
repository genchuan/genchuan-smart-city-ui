<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { loadTMap } from '#/utils/genchuan/useTMap.ts';

const props = defineProps({
  data: { type: Array, default: () => [] },
  markerIcons: { type: Object, default: () => ({ normal: '/static/imgs/dataHub/map/marker-blue.png' }) },
  statusIconMap: { type: Object, default: () => ({}) },
  statusKeyMap: { type: Object, default: () => ({}) },
  infoWindowConfig: { type: Object, default: () => ({ title: 'id', fields: [{ key: 'status', label: '状态' }, { key: 'location', label: '位置' }] }) },
});

const mapRef = ref(null);
let map = null;
let markerLayer = null;
let infoWindow = null;
let TMapInstance = null;
let boundsPolygon = null;

const initMap = async () => {
  if (!mapRef.value) return;
  try {
    const TMap = await loadTMap();
    TMapInstance = TMap;
    map = new TMap.Map(mapRef.value, { center: new TMap.LatLng(24.5123, 117.6589), zoom: 12 });
    infoWindow = new TMap.InfoWindow({ map, position: new TMap.LatLng(0, 0), offset: { x: 0, y: -32 } });
    infoWindow.close();
    initMarkerLayer();
    renderMarkers();
  } catch (error) {
    console.error('地图初始化失败:', error);
  }
};

const initMarkerLayer = () => {
  const iconSrc = props.markerIcons.normal || '/static/imgs/dataHub/map/marker-blue.png';
  markerLayer = new TMapInstance.MultiMarker({
    id: 'rescue-marker-layer',
    map,
    enableCollision: false,
    styles: { normal: new TMapInstance.MarkerStyle({ width: 25, height: 35, anchor: { x: 12.5, y: 35 }, src: iconSrc }) },
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
      const value = properties[field.key] || '';
      fieldsHtml += `<tr><td style="width:90px;padding-right:8px;text-align:right;">${field.label}：</td><td>${value}</td></tr>`;
    });
  }
  return `<div style="padding:10px;min-width:220px;"><h3 style="margin:0 0 8px;font-size:15px;">${title}</h3><table style="width:100%;border-collapse:collapse;">${fieldsHtml}</table></div>`;
};

const onMarkerClick = (evt) => {
  const { position, properties } = evt.geometry;
  if (!infoWindow || !properties) return;
  infoWindow.setPosition(position);
  infoWindow.setContent(generateInfoWindowContent(properties));
  infoWindow.open();
};

// 修复：增加边界有效性检查，避免 far <= 0 错误
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
    geometries.push({ id: item.geoCode || item.id, styleId: 'normal', position, properties: item });
  });
  markerLayer.setGeometries(geometries);
  if (geometries.length > 0 && !bounds.isEmpty()) {
    map.fitBounds(bounds, { padding: 100 });
  } else if (props.data.length > 0) {
    console.warn('没有有效的坐标数据，地图保持默认视图');
  }
};

const drawBounds = (bounds) => { /* 保持不变 */ };
const clearBounds = () => { /* 保持不变 */ };
const setCenter = (lngLat) => { /* 保持不变 */ };
const setZoom = (zoom) => { if (map) map.setZoom(zoom); };
const getCenter = () => map ? { lng: map.getCenter().getLng(), lat: map.getCenter().getLat() } : null;
const getZoom = () => map ? map.getZoom() : null;
const getBounds = () => { if (!map) return null; const sw = map.getBounds().getSouthWest(); const ne = map.getBounds().getNorthEast(); return { south: sw.getLat(), north: ne.getLat(), west: sw.getLng(), east: ne.getLng() }; };
const resize = () => { if (map) map.resize(); };

defineExpose({ setCenter, setZoom, getCenter, getZoom, getBounds, resize, drawBounds, clearBounds });
watch(() => props.data, renderMarkers, { deep: true });
onMounted(() => { initMap(); window.addEventListener('resize', resize); });
onUnmounted(() => { window.removeEventListener('resize', resize); if (markerLayer) markerLayer.destroy?.(); if (infoWindow) infoWindow.destroy?.(); if (map && map.destroy) map.destroy(); });
</script>

<template>
  <div class="map-container"><div ref="mapRef" class="map-content"></div></div>
</template>

<style scoped>
.map-container { position: relative; width: 100%; height: 100%; min-height: 300px; }
.map-content { width: 100%; height: 100%; }
</style>
