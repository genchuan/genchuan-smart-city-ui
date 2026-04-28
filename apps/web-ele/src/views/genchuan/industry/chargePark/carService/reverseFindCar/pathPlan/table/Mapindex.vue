<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { loadTMap } from '#/utils/genchuan/useTMap.ts';

const props = defineProps({
  data: { type: Array, default: () => [] },
  markerIcons: { type: Object, default: () => ({ normal: '/static/imgs/dataHub/map/marker-blue.png' }) },
  statusIconMap: { type: Object, default: () => ({}) },
  statusKeyMap: { type: Object, default: () => ({}) },
  infoWindowConfig: { type: Object, default: () => ({ title: 'id', fields: [{ key: 'status', label: '状态' }, { key: 'location', label: '位置' }] }) },
  paths: { type: Array, default: () => [] },
  pathOptions: { type: Object, default: () => ({ color: '#4A90E2', width: 4, opacity: 0.8 }) },
});

const emit = defineEmits(['path-click']);

const mapRef = ref(null);
let map = null;
let markerLayer = null;
let infoWindow = null;
let TMapInstance = null;
let boundsPolygon = null;
let polylineLayer = null;
let startEndMarkerLayer = null; // 专门用于起点/终点的 MultiMarker

// 绿色 S 图标的 DataURL（圆形绿色背景，白色 S）
const startIconDataUrl = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30"%3E%3Ccircle cx="15" cy="15" r="15" fill="%2300c253"/%3E%3Ctext x="15" y="21" font-size="14" text-anchor="middle" fill="white" font-weight="bold"%3ES%3C/text%3E%3C/svg%3E';
// 红色 E 图标的 DataURL
const endIconDataUrl = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30"%3E%3Ccircle cx="15" cy="15" r="15" fill="%23ff4444"/%3E%3Ctext x="15" y="21" font-size="14" text-anchor="middle" fill="white" font-weight="bold"%3EE%3C/text%3E%3C/svg%3E';

const initMap = async () => {
  if (!mapRef.value) return;
  try {
    const TMap = await loadTMap();
    TMapInstance = TMap;
    map = new TMap.Map(mapRef.value, {
      center: new TMap.LatLng(24.5123, 117.6589),
      zoom: 12,
    });
    infoWindow = new TMap.InfoWindow({ map, position: new TMap.LatLng(0, 0), offset: { x: 0, y: -32 } });
    infoWindow.close();
    initMarkerLayer();
    initStartEndMarkerLayer();
    renderMarkers();
    renderPaths();
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

// 初始化起点/终点专用图层
const initStartEndMarkerLayer = () => {
  startEndMarkerLayer = new TMapInstance.MultiMarker({
    id: 'start-end-marker-layer',
    map,
    enableCollision: false,
    styles: {
      startStyle: new TMapInstance.MarkerStyle({
        width: 30,
        height: 30,
        anchor: { x: 15, y: 15 }, // 锚点定在圆心
        src: startIconDataUrl,
      }),
      endStyle: new TMapInstance.MarkerStyle({
        width: 30,
        height: 30,
        anchor: { x: 15, y: 15 },
        src: endIconDataUrl,
      }),
    },
    geometries: [],
  });
};

const generateInfoWindowContent = (properties) => {
  const config = props.infoWindowConfig;
  const title = properties[config.title] || '未知';
  let fieldsHtml = '';
  if (config.fields) {
    config.fields.forEach((field) => {
      const value = properties[field.key] || '';
      fieldsHtml += `<td><td style="width:90px;padding-right:8px;text-align:right;">${field.label}：</td><td>${value}</td></tr>`;
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
  if (props.data.length > 0 && props.data[0].coordinate) {
    const [lng, lat] = props.data[0].coordinate.split(',').map(Number);
    if (!isNaN(lng) && !isNaN(lat)) map.setCenter(new TMapInstance.LatLng(lat, lng));
  } else if (!bounds.isEmpty()) map.fitBounds(bounds, { padding: 100 });
};

const renderPaths = () => {
  if (!map || !TMapInstance || !props.paths?.length) return;
  if (polylineLayer) polylineLayer.destroy();
  const geometries = [];
  props.paths.forEach((pathItem) => {
    if (!pathItem.path || !Array.isArray(pathItem.path) || pathItem.path.length < 2) return;
    const pathPoints = pathItem.path.map(point => new TMapInstance.LatLng(point[1], point[0]));
    geometries.push({
      id: pathItem.id,
      styleId: 'path-style',
      paths: pathPoints,
      properties: { id: pathItem.id, pathLength: pathItem.pathLength, expectDuration: pathItem.expectDuration },
    });
  });
  if (geometries.length === 0) return;
  polylineLayer = new TMapInstance.MultiPolyline({
    map,
    styles: { 'path-style': new TMapInstance.PolylineStyle({ color: props.pathOptions.color || '#4A90E2', width: props.pathOptions.width || 4, borderWidth: 0, lineCap: 'round' }) },
    geometries,
  });
  polylineLayer.on('click', (evt) => {
    const properties = evt.geometry?.properties;
    if (properties && properties.id) emit('path-click', properties);
  });
};

// 清除起点/终点标记
const clearStartEndMarkers = () => {
  if (startEndMarkerLayer) {
    startEndMarkerLayer.setGeometries([]);
  }
};

// 绘制单条路径（支持高亮红色），同时绘制起点终点标记
const drawSinglePath = (pathData, highlight = false) => {
  if (!map || !TMapInstance) return;
  // 清除之前的路径和起点/终点标记
  if (polylineLayer) polylineLayer.destroy();
  clearStartEndMarkers();
  polylineLayer = null;

  if (!pathData || !pathData.pathPoints || pathData.pathPoints.length < 2) return;
  const pathPoints = pathData.pathPoints.map(point => new TMapInstance.LatLng(point[1], point[0]));
  const lineColor = highlight ? '#FF0000' : (props.pathOptions.color || '#4A90E2');

  polylineLayer = new TMapInstance.MultiPolyline({
    map,
    styles: {
      'path-style': new TMapInstance.PolylineStyle({
        color: lineColor,
        width: props.pathOptions.width || 4,
        borderWidth: 0,
        lineCap: 'round'
      })
    },
    geometries: [{
      id: pathData.id,
      styleId: 'path-style',
      paths: pathPoints,
      properties: { id: pathData.id, pathLength: pathData.pathLength, expectDuration: pathData.expectDuration },
    }],
  });
  polylineLayer.on('click', (evt) => {
    const properties = evt.geometry?.properties;
    if (properties && properties.id) emit('path-click', properties);
  });

  // 添加起点/终点标记到专用图层
  const startEndGeometries = [];
  if (pathData.startCoord) {
    startEndGeometries.push({
      id: `start_${pathData.id}`,
      styleId: 'startStyle',
      position: new TMapInstance.LatLng(pathData.startCoord.lat, pathData.startCoord.lng),
    });
  }
  if (pathData.endCoord) {
    startEndGeometries.push({
      id: `end_${pathData.id}`,
      styleId: 'endStyle',
      position: new TMapInstance.LatLng(pathData.endCoord.lat, pathData.endCoord.lng),
    });
  }
  if (startEndGeometries.length > 0 && startEndMarkerLayer) {
    startEndMarkerLayer.setGeometries(startEndGeometries);
  }

  // 调整视野
  const bounds = new TMapInstance.LatLngBounds();
  pathPoints.forEach(p => bounds.extend(p));
  if (pathData.startCoord) bounds.extend(new TMapInstance.LatLng(pathData.startCoord.lat, pathData.startCoord.lng));
  if (pathData.endCoord) bounds.extend(new TMapInstance.LatLng(pathData.endCoord.lat, pathData.endCoord.lng));
  map.fitBounds(bounds, { padding: 50 });
};

const clearAllPaths = () => {
  if (polylineLayer) polylineLayer.destroy();
  clearStartEndMarkers();
  polylineLayer = null;
};

const drawBounds = (bounds) => {
  if (!map || !TMapInstance) return;
  if (boundsPolygon) boundsPolygon.destroy();
  const { north, south, east, west } = bounds;
  const paths = [
    new TMapInstance.LatLng(north, west),
    new TMapInstance.LatLng(north, east),
    new TMapInstance.LatLng(south, east),
    new TMapInstance.LatLng(south, west),
  ];
  boundsPolygon = new TMapInstance.MultiPolygon({
    map,
    styles: { highlight: new TMapInstance.PolygonStyle({ color: 'rgba(255, 0, 0, 0.3)', borderColor: '#ff0000', borderWidth: 2 }) },
    geometries: [{ id: 'bounds-rect', styleId: 'highlight', paths: [paths] }],
  });
  const sw = new TMapInstance.LatLng(south, west);
  const ne = new TMapInstance.LatLng(north, east);
  map.fitBounds(new TMapInstance.LatLngBounds(sw, ne), { padding: 50 });
};

const clearBounds = () => { if (boundsPolygon) boundsPolygon.destroy(); boundsPolygon = null; };
const setCenter = (lngLat) => { if (!map || !TMapInstance) return; const [lng, lat] = Array.isArray(lngLat) ? lngLat : [lngLat.lng, lngLat.lat]; map.setCenter(new TMapInstance.LatLng(lat, lng)); };
const setZoom = (zoom) => { if (map) map.setZoom(zoom); };
const getCenter = () => { if (!map) return null; const center = map.getCenter(); return { lng: center.getLng(), lat: center.getLat() }; };
const getZoom = () => map ? map.getZoom() : null;
const getBounds = () => { if (!map) return null; const bounds = map.getBounds(); const sw = bounds.getSouthWest(); const ne = bounds.getNorthEast(); return { south: sw.getLat(), north: ne.getLat(), west: sw.getLng(), east: ne.getLng() }; };
const resize = () => { if (map) map.resize(); };

const onLocateAddress = (event) => {
  const address = event.detail;
  if (address && map && TMapInstance) {
    const parts = address.split(',');
    if (parts.length === 2) {
      const lng = parseFloat(parts[0]);
      const lat = parseFloat(parts[1]);
      if (!isNaN(lng) && !isNaN(lat)) {
        map.setCenter(new TMapInstance.LatLng(lat, lng));
        map.setZoom(14);
      }
    }
  }
};

defineExpose({ setCenter, setZoom, getCenter, getZoom, getBounds, resize, drawBounds, clearBounds, drawSinglePath, clearAllPaths });

watch(() => props.data, renderMarkers, { deep: true });
watch(() => props.paths, renderPaths, { deep: true });

onMounted(() => {
  initMap();
  window.addEventListener('resize', resize);
  window.addEventListener('locate-address', onLocateAddress);
});
onUnmounted(() => {
  window.removeEventListener('resize', resize);
  window.removeEventListener('locate-address', onLocateAddress);
  if (markerLayer) markerLayer.destroy?.();
  if (polylineLayer) polylineLayer.destroy?.();
  if (startEndMarkerLayer) startEndMarkerLayer.destroy?.();
  if (infoWindow) infoWindow.destroy?.();
  if (map && map.destroy) map.destroy();
});
</script>

<template>
  <div class="map-container"><div ref="mapRef" class="map-content"></div></div>
</template>

<style scoped>
.map-container { position: relative; width: 100%; height: 100%; min-height: 300px; }
.map-content { width: 100%; height: 100%; }
</style>
