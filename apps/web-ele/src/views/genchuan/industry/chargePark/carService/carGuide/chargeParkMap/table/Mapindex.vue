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
  statusIconMap: {
    type: Object,
    default: () => ({}),
  },
  statusKeyMap: {
    type: Object,
    default: () => ({}),
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
let tempMarkerLayer = null;
let infoWindow = null;
let TMapInstance = null;
let boundsPolygon = null;

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
    initTempMarkerLayer();
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
    styles: {
      normal: new TMapInstance.MarkerStyle({
        width: 25,
        height: 35,
        anchor: { x: 12.5, y: 35 },
        src: iconSrc,
      }),
    },
    geometries: [],
  });
  markerLayer.on('click', onMarkerClick);
};

const initTempMarkerLayer = () => {
  tempMarkerLayer = new TMapInstance.MultiMarker({
    id: 'temp-marker-layer',
    map,
    enableCollision: false,
    styles: {
      temp: new TMapInstance.MarkerStyle({
        width: 30,
        height: 42,
        anchor: { x: 15, y: 42 },
        src: '/static/imgs/marker-red.png',
      }),
    },
    geometries: [],
  });
  tempMarkerLayer.on('click', (evt) => {
    const { position, properties } = evt.geometry;
    if (infoWindow && properties) {
      infoWindow.setPosition(position);
      infoWindow.setContent(`<div style="padding:8px;">${properties.title || '查询位置'}</div>`);
      infoWindow.open();
    }
  });
};

const addTempMarker = (lng, lat, title = '查询位置') => {
  if (!tempMarkerLayer || !TMapInstance) return;
  clearTempMarkers();
  const position = new TMapInstance.LatLng(lat, lng);
  const geometry = {
    id: `temp_${Date.now()}`,
    styleId: 'temp',
    position,
    properties: { title, coordinate: `${lng},${lat}` },
  };
  tempMarkerLayer.add([geometry]);
  if (infoWindow) {
    infoWindow.setPosition(position);
    infoWindow.setContent(`<div style="padding:8px;">${title}</div>`);
    infoWindow.open();
  }
};

const clearTempMarkers = () => {
  if (tempMarkerLayer) {
    tempMarkerLayer.setGeometries([]);
  }
};

// 信息窗内容生成：去掉标题，只显示字段表格
const generateInfoWindowContent = (properties) => {
  const config = props.infoWindowConfig;
  let fieldsHtml = '';
  if (config.fields) {
    config.fields.forEach((field) => {
      let value = properties[field.key] !== undefined ? properties[field.key] : '';
      // 如果字段名为 address，且值为坐标格式，可稍作美化，但保持原样
      const style = field.bold ? 'font-weight:bold;' : '';
      fieldsHtml += `
        <tr>
          <td style="width:90px;padding-right:8px;text-align:right;vertical-align:top;">${field.label}：</td>
          <td style="${style}">${value}</td>
        </tr>
      `;
    });
  }
  return `
    <div style="padding:10px;min-width:200px;">
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
    geometries.push({
      id: item.id || `${item.lon}_${item.lat}`,
      styleId: 'normal',
      position,
      properties: item,
    });
  });
  markerLayer.setGeometries(geometries);

  if (props.data.length > 0 && !bounds.isEmpty()) {
    map.fitBounds(bounds, { padding: 100 });
  }
};

const drawBounds = (bounds) => {
  if (!map || !TMapInstance) return;
  clearBounds();
  const { north, south, east, west } = bounds;
  const paths = [
    new TMapInstance.LatLng(north, west),
    new TMapInstance.LatLng(north, east),
    new TMapInstance.LatLng(south, east),
    new TMapInstance.LatLng(south, west),
  ];
  boundsPolygon = new TMapInstance.MultiPolygon({
    map,
    styles: {
      highlight: new TMapInstance.PolygonStyle({
        color: 'rgba(255, 0, 0, 0.3)',
        borderColor: '#ff0000',
        borderWidth: 2,
      }),
    },
    geometries: [{
      id: 'bounds-rect',
      styleId: 'highlight',
      paths: [paths],
    }],
  });
  const sw = new TMapInstance.LatLng(south, west);
  const ne = new TMapInstance.LatLng(north, east);
  const latLngBounds = new TMapInstance.LatLngBounds(sw, ne);
  map.fitBounds(latLngBounds, { padding: 50 });
};

const clearBounds = () => {
  if (boundsPolygon) {
    boundsPolygon.destroy();
    boundsPolygon = null;
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
const getBounds = () => {
  if (!map) return null;
  const bounds = map.getBounds();
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  return { south: sw.getLat(), north: ne.getLat(), west: sw.getLng(), east: ne.getLng() };
};
const resize = () => { if (map) map.resize(); };

defineExpose({
  setCenter, setZoom, getCenter, getZoom, getBounds, resize, drawBounds, clearBounds,
  addTempMarker, clearTempMarkers,
});

watch(() => props.data, () => {
  clearTempMarkers();
  renderMarkers();
}, { deep: true });

onMounted(() => {
  initMap();
  window.addEventListener('resize', resize);
});

onUnmounted(() => {
  window.removeEventListener('resize', resize);
  if (markerLayer) markerLayer.destroy?.();
  if (tempMarkerLayer) tempMarkerLayer.destroy?.();
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
