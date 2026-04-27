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
    default: () => ({
      green: 'normal',
      orange: 'normal',
      red: 'normal',
      blue: 'normal',
      gray: 'normal',
    }),
  },
  statusKeyMap: {
    type: Object,
    default: () => ({
      正常: 'green',
      异常: 'red',
      离线: 'red',
      维护中: 'orange',
      停用: 'red',
      建设中: 'gray',
    }),
  },
  infoWindowConfig: {
    type: Object,
    default: () => ({
      title: 'locationName',
      fields: [
        { key: 'geoCode', label: '地理编码' },
        { key: 'statusName', label: '状态', bold: true },
        { key: 'areaName', label: '区域' },
        { key: 'layerTypeName', label: '图层类型' },
        { key: 'adminCode', label: '行政区划' },
        { key: 'checkResultName', label: '校验结果' },
      ],
    }),
  },
});

const emit = defineEmits(['markerClick']);

const mapRef = ref(null);
let map = null;
let markerLayers = {};
let infoWindow = null;
let TMapInstance = null;

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
  const createLayer = (id, src) => {
    const layer = new TMapInstance.MultiMarker({
      id,
      map,
      enableCollision: false,
      styles: {
        normal: new TMapInstance.MarkerStyle({
          width: 25,
          height: 35,
          anchor: { x: 12.5, y: 35 },
          src,
        }),
      },
      geometries: [],
    });
    layer.on('click', onMarkerClick);
    return layer;
  };

  const layers = {};
  Object.keys(props.statusIconMap).forEach((key) => {
    const iconKey = props.statusIconMap[key];
    const src = props.markerIcons[iconKey] || props.markerIcons.normal;
    layers[key] = createLayer(`${key}-layer`, src);
  });

  markerLayers = layers;
};

const generateInfoWindowContent = (properties) => {
  const config = props.infoWindowConfig;
  const title = properties[config.title] || '未知';

  let fieldsHtml = '';
  if (config.fields) {
    config.fields.forEach((field) => {
      const value = properties[field.key] || '';
      const style = field.bold ? 'font-weight:bold;' : '';
      fieldsHtml += `
        <tr>
          <td style="width:90px;padding-right:8px;text-align:right;">${field.label}：</td>
          <td style="${style}">${value}</td>
        </tr>
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
  emit('markerClick', properties);
};

const renderMarkers = () => {
  if (!map || !props.data?.length || !TMapInstance) return;

  const buckets = {};
  Object.keys(props.statusIconMap).forEach((key) => {
    buckets[key] = [];
  });

  const bounds = new TMapInstance.LatLngBounds();

  props.data.forEach((item) => {
    if (!item.coordinate) return;

    const [lng, lat] = item.coordinate.split(',').map(Number);
    if (Number.isNaN(lng) || Number.isNaN(lat)) return;

    const position = new TMapInstance.LatLng(lat, lng);
    bounds.extend(position);

    let key = 'blue';
    const statusName = (item.statusName || '').trim();

    // 优先根据运行状态确定图标颜色
    if (props.statusKeyMap[statusName]) {
      key = props.statusKeyMap[statusName];
    } else if (item.checkResultName === '未通过') {
      key = 'red';
    }

    if (buckets[key]) {
      buckets[key].push({
        id: item.geoCode || item.id,
        styleId: 'normal',
        position,
        properties: item,
      });
    }
  });

  Object.keys(markerLayers).forEach((k) => {
    if (markerLayers[k]) {
      markerLayers[k].setGeometries(buckets[k] || []);
    }
  });

  // 如果有数据，将地图中心点定位到第一个点
  if (props.data.length > 0) {
    const firstItem = props.data[0];
    if (firstItem.coordinate) {
      const [lng, lat] = firstItem.coordinate.split(',').map(Number);
      if (!Number.isNaN(lng) && !Number.isNaN(lat)) {
        const position = new TMapInstance.LatLng(lat, lng);
        map.setCenter(position);
        map.setZoom(15); // 设置合适的缩放级别
      }
    }
  }
  // 否则使用默认的边界适配
  else if (!bounds.isEmpty()) {
    map.fitBounds(bounds, { padding: 100 });
  }
};

const handleResize = () => {
  if (map) map.resize();
};

watch(() => props.data, renderMarkers, { deep: true });

onMounted(() => {
  initMap();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  Object.values(markerLayers).forEach(
    (layer) => layer.destroy && layer.destroy(),
  );
  if (infoWindow) infoWindow.destroy && infoWindow.destroy();
  if (map && map.destroy) map.destroy();
});
</script>

<template>
  <div class="map-container">
    <div ref="mapRef" class="map-content"></div>
  </div>
</template>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 300px;
}

.map-content {
  width: 100%;
  height: 100%;
}
</style>
