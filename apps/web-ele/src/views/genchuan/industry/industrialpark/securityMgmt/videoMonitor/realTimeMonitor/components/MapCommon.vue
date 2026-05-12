<script setup>
import { onMounted, defineProps, ref, onUnmounted, watch, defineExpose } from 'vue';

import markerNormal from '#/views/genchuan/industry/industrialPark/images/marker-normal.png';
import markerAlarm from '#/views/genchuan/industry/industrialPark/images/marker-alarm.png';
import markerOffline from '#/views/genchuan/industry/industrialPark/images/marker-offline.png';

const props = defineProps({
  idName: {
    type: String,
    default: 'monitorMap',
  },
  geometriesArray: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['markerClick']);

let mapInstance = null;
let infoWindow = null;
let markerLayer = null;
let mapInitialized = false;

// 根据运行状态获取标记样式ID
const getStyleIdByStatus = (status) => {
  if (status === 'enabled' || status === '正常') return 'normal';
  if (status === 'disabled' || status === '异常') return 'alarm';
  if (status === 'wait' || status === '离线') return 'offline';
  return 'normal';
};

// 信息窗内容
const getTooltipContent = (properties) => {
  const { stationName, statusName, id } = properties;
  const statusText = statusName || (properties.stationStatus === 'enabled' ? '正常' : (properties.stationStatus === 'disabled' ? '异常' : '离线'));
  const statusColor = statusText === '正常' ? 'green' : (statusText === '异常' ? 'red' : 'orange');

  return `
    <div style="padding: 12px; font-size: 14px; color: #333; background: white; border: 1px solid #ddd; border-radius: 6px; min-width: 200px;">
      <div style="margin-bottom: 8px; font-weight: bold; color: #409EFF; border-bottom: 1px solid #eee; padding-bottom: 4px;">摄像头信息</div>
      <div style="margin: 6px 0; display: flex;">
        <span style="font-weight: bold; width: 70px;">名称：</span>
        <span style="flex: 1;">${stationName || '未知'}</span>
      </div>
      <div style="margin: 6px 0; display: flex;">
        <span style="font-weight: bold; width: 70px;">状态：</span>
        <span style="flex: 1; color: ${statusColor};">${statusText}</span>
      </div>
      <div style="margin: 6px 0; display: flex;">
        <span style="font-weight: bold; width: 70px;">ID：</span>
        <span style="flex: 1;">${id || '-'}</span>
      </div>
    </div>
  `;
};

const handleMarkerClick = (e) => {
  const { properties } = e.geometry;
  if (properties && infoWindow) {
    infoWindow.setContent(getTooltipContent(properties));
    infoWindow.setPosition(e.geometry.position);
    infoWindow.open();
    emit('markerClick', properties.stationName);
  }
};

const handleInfoWindowClose = () => {
  if (infoWindow) infoWindow.close();
};

const initMap = () => {
  const callbackName = `initMap_${props.idName}`;
  if (window[callbackName]) delete window[callbackName];

  const script = document.createElement('script');
  script.src = `https://map.qq.com/api/gljs?v=1.exp&key=QTQBZ-F3RWW-JJJRV-YNPA5-ZIKDK-3SBNO&callback=${callbackName}`;
  script.async = true;

  window[callbackName] = () => {
    mapCallback();
    delete window[callbackName];
  };

  document.head.appendChild(script);
};

const getMarkerStyles = () => {
  return {
    normal: new TMap.MarkerStyle({
      width: 34,
      height: 34,
      anchor: { x: 15, y: 30 },
      src: markerNormal,
    }),
    alarm: new TMap.MarkerStyle({
      width: 34,
      height: 34,
      anchor: { x: 15, y: 30 },
      src: markerAlarm,
    }),
    offline: new TMap.MarkerStyle({
      width: 34,
      height: 34,
      anchor: { x: 15, y: 30 },
      src: markerOffline,
    }),
  };
};

const createMarkers = (map) => {
  if (markerLayer) {
    try {
      markerLayer.off('click', handleMarkerClick);
      markerLayer.destroy();
    } catch (error) {
      console.warn('销毁标记层失败：', error);
    }
    markerLayer = null;
  }

  const geometriesData = [];
  if (Array.isArray(props.geometriesArray)) {
    props.geometriesArray.forEach((item) => {
      const { lon, lat, stationStatus, id, stationName, statusName } = item;
      if (typeof lon === 'number' && typeof lat === 'number') {
        const styleId = getStyleIdByStatus(stationStatus);
        geometriesData.push({
          id: `marker-${id}`,
          styleId: styleId,
          position: new TMap.LatLng(lat, lon),
          properties: {
            id,
            stationName,
            stationStatus,
            statusName,
          },
        });
      }
    });
  }

  if (geometriesData.length > 0) {
    markerLayer = new TMap.MultiMarker({
      map: map,
      styles: getMarkerStyles(),
      geometries: geometriesData,
    });
    markerLayer.on('click', handleMarkerClick);
  }
};

const mapCallback = () => {
  const mapContainer = document.getElementById(props.idName);
  if (!mapContainer) {
    console.error(`地图容器不存在：${props.idName}`);
    return;
  }

  const map = new TMap.Map(mapContainer, {
    center: new TMap.LatLng(24.90, 118.68),
    zoom: 13,
    pitch: 0,
  });
  mapInstance = map;
  mapInitialized = true;

  infoWindow = new TMap.InfoWindow({
    map: map,
    position: new TMap.LatLng(0, 0),
    content: '',
    offset: { x: 0, y: -40 },
    visible: false,
  });
  infoWindow.on('close', handleInfoWindowClose);

  if (props.geometriesArray.length > 0) {
    createMarkers(map);
  }
};

const refreshMap = () => {
  if (mapInitialized && mapInstance) {
    createMarkers(mapInstance);
  } else {
    initMap();
  }
};

watch(
  () => props.geometriesArray,
  (newVal) => {
    if (mapInitialized && mapInstance && Array.isArray(newVal)) {
      createMarkers(mapInstance);
    }
  },
  { deep: true }
);

onMounted(() => {
  initMap();
});

onUnmounted(() => {
  if (markerLayer) {
    try {
      markerLayer.off('click', handleMarkerClick);
      markerLayer.destroy();
    } catch (error) {}
  }
  if (infoWindow) {
    infoWindow.off('close', handleInfoWindowClose);
    infoWindow.destroy();
  }
  if (mapInstance) {
    mapInstance.destroy();
  }
  mapInitialized = false;
});

defineExpose({ refreshMap });
</script>

<template>
  <div class="map-container">
    <div :id="idName" class="map-common-css"></div>
    <div class="legend">
      <div class="legend-items">
        <div class="legend-item">
          <img :src="markerNormal" class="legend-icon" alt="正常" />
          <span>正常</span>
        </div>
        <div class="legend-item">
          <img :src="markerAlarm" class="legend-icon" alt="异常/告警" />
          <span>异常/告警</span>
        </div>
        <div class="legend-item">
          <img :src="markerOffline" class="legend-icon" alt="离线" />
          <span>离线</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
}
.map-common-css {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
}
.legend {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.6);
  padding: 6px 12px;
  border-radius: 4px;
  backdrop-filter: blur(4px);
}
.legend-items {
  display: flex;
  gap: 16px;
  align-items: center;
}
.legend-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #fff;
  gap: 4px;
}
.legend-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}
</style>
