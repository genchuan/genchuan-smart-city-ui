<script setup>
import {
  defineExpose,
  defineProps,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue';

import {mapOrbitAnimation} from '#/api/genchuan/industry/mapOrbitAnimation.js';

import markerCarAbnormal from '../../images/abnormal.png';
import markerCarNormal from '../../images/normal.png';
import markerUnknown from '../../images/unknown.png';

const props = defineProps({
  idName: {
    type: String,
    default: 'satelliteMap',
  },
  geometriesArray: {
    type: Array,
    default: () => [],
  },
  orbitConfig: {
    type: Object,
    default: () => ({
      center: {lat: 24.58, lng: 117.65},
      rotateSpeed: 0.05,
      pitch: 0,
      zoom: 10,
      loop: true,
    }),
  },
});

const mapInstance = ref(null);
const infoWindow = ref(null);
const carMarkerLayer = ref(null);
const mapInitialized = ref(false);

const {
  orbitStatus,
  startOrbitAnimation,
  stopOrbitAnimation,
  toggleOrbitAnimation,
  orbitConfig,
} = mapOrbitAnimation(mapInstance, props.orbitConfig);

watch(
  () => props.orbitConfig,
  (newConfig) => {
    Object.assign(orbitConfig.value, newConfig);
  },
  {deep: true, immediate: true},
);

const carTrackStatusMap = {
  normal: {
    color: '#39b20d',
    icon: markerCarNormal,
    text: '正常通行',
    size: {w: 36, h: 36},
    styleId: 'car-normal',
  },
  abnormal: {
    color: '#FF4500',
    icon: markerCarAbnormal,
    text: '异常通行',
    size: {w: 36, h: 36},
    styleId: 'car-abnormal',
  },
  '': {
    color: '#999',
    icon: markerUnknown,
    text: '状态未知',
    size: {w: 36, h: 36},
    styleId: 'car-unknown',
  },
};

const handleMarkerClick = (e) => {
  const {properties, position} = e.geometry;
  if (properties && position && infoWindow.value) {
    infoWindow.value.setContent(getTooltipContent(properties));
    infoWindow.value.setPosition(position);
    infoWindow.value.open();
  }
};

const handleInfoWindowClose = () => {
  if (infoWindow.value) infoWindow.value.close();
};

const initMap = () => {
  const callbackName = `initMap_${props.idName}`;
  const script = document.createElement('script');
  // 使用卫星地图的key
  script.src = `https://map.qq.com/api/gljs?v=1.exp&key=QTQBZ-F3RWW-JJJRV-YNPA5-ZIKDK-3SBNO&callback=${callbackName}`;
  script.async = true;
  window[callbackName] = () => {
    mapCallback();
    delete window[callbackName];
  };
  document.head.append(script);
};

const createAllMarkers = (map) => {
  if (carMarkerLayer.value) {
    try {
      carMarkerLayer.value.off('click', handleMarkerClick);
      carMarkerLayer.value.destroy();
    } catch (error) {
      console.warn('销毁车辆轨迹标注层失败:', error);
    }
    carMarkerLayer.value = null;
  }

  if (
    !Array.isArray(props.geometriesArray) ||
    props.geometriesArray.length === 0
  )
    return;

  const carTrackData = [];
  const carTrackSet = new Set();

  props.geometriesArray.forEach((item) => {
    const {
      carNumber,
      entryId,
      carLatitude,
      carLongitude,
      carStatus,
      inspectionResult,
    } = item;
    if (
      item &&
      carNumber &&
      entryId &&
      typeof carLatitude === 'number' &&
      typeof carLongitude === 'number'
    ) {
      const carKey = `${carNumber}-${entryId}`;
      if (!carTrackSet.has(carKey)) {
        carTrackSet.add(carKey);
        const carStyleId =
          carTrackStatusMap[
          carStatus || (inspectionResult === '正常' ? 'normal' : 'abnormal')
            ]?.styleId || 'car-unknown';
        carTrackData.push({
          id: `car-${carKey}`,
          styleId: carStyleId,
          position: new TMap.LatLng(carLatitude, carLongitude),
          properties: {...item, markerType: 'carTrack'},
        });
      }
    }
  });

  if (carTrackData.length > 0) {
    carMarkerLayer.value = new TMap.MultiMarker({
      map,
      styles: {
        'car-normal': new TMap.MarkerStyle({
          width: 36,
          height: 36,
          anchor: {x: 18, y: 18},
          src: markerCarNormal,
        }),
        'car-abnormal': new TMap.MarkerStyle({
          width: 36,
          height: 36,
          anchor: {x: 18, y: 18},
          src: markerCarAbnormal,
        }),
        'car-unknown': new TMap.MarkerStyle({
          width: 36,
          height: 36,
          anchor: {x: 18, y: 18},
          src: markerUnknown,
        }),
      },
      geometries: carTrackData,
    });
    carMarkerLayer.value.on('click', handleMarkerClick);
  }
};

const getTooltipContent = (properties) => {
  const labelStyle =
    'width: 120px; text-align: right; font-weight: bold; margin-right: 8px; flex-shrink: 0;';
  const valueStyle = 'flex: 1; text-align: left; word-break: break-all;';
  const rowStyle =
    'display: flex; align-items: center; margin: 4px 0; font-size: 13px;';
  const titleStyle =
    'margin-bottom: 6px; font-weight: bold; color: #1E90FF; border-bottom: 1px solid #eee; padding-bottom: 4px; text-align: center; font-size: 14px;';

  const formatTime = (timeStamp) => {
    if (!timeStamp) return '未知';
    const date = new Date(timeStamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (properties.markerType === 'carTrack') {
    const carStatusText =
      carTrackStatusMap[properties.carStatus]?.text || '未知状态';
    const carStatusColor =
      carTrackStatusMap[properties.carStatus]?.color || '#999';
    return `<div style="padding:10px 12px;color:#333;background:white;border:1px solid #ccc;min-width:400px;border-radius:4px;"><div style="${titleStyle}">车辆通行轨迹详情</div>
      <div style="${rowStyle}"><span style="${labelStyle}">入场记录ID：</span><span style="${valueStyle}">${properties.entryId || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">车牌号码：</span><span style="${valueStyle};color:#1E90FF;font-weight:500;">${properties.carNumber || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">入场时间：</span><span style="${valueStyle}">${formatTime(properties.entryTime)}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">入场位置：</span><span style="${valueStyle}">${properties.entryPosition || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">停车记录ID：</span><span style="${valueStyle}">${properties.parkingId || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">占用车位：</span><span style="${valueStyle}">${properties.spaceId || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">停放时长：</span><span style="${valueStyle}">${properties.parkingTime ? `${properties.parkingTime}分钟` : '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">离场记录ID：</span><span style="${valueStyle}">${properties.exitId || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">离场时间：</span><span style="${valueStyle}">${formatTime(properties.exitTime)}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">离场位置：</span><span style="${valueStyle}">${properties.exitPosition || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">稽查标识：</span><span style="${valueStyle}">${properties.inspectionId || '无'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">稽查结果：</span><span style="${valueStyle};color:${properties.inspectionResult === '异常' ? '#FF4500' : '#39b20d'};">${properties.inspectionResult || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">车辆状态：</span><span style="${valueStyle};color:${carStatusColor};">${carStatusText}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">车辆坐标：</span><span style="${valueStyle}">${properties.carLatitude || '未知'}, ${properties.carLongitude || '未知'}</span></div>
    </div>`;
  }
  return '';
};

const mapCallback = () => {
  const mapContainer = document.querySelector(`#${props.idName}`);
  if (!mapContainer) {
    console.error(`地图容器不存在：${props.idName}`);
    return;
  }
  const {center, zoom, pitch} = props.orbitConfig;

  // 关键修改：使用卫星地图配置
  const map = new TMap.Map(mapContainer, {
    center: new TMap.LatLng(center.lat, center.lng),
    zoom,
    // 设置卫星地图
    baseMap: {
      type: 'satellite'
    },
    enablePitch: true,
    enableRotate: true,
    pitch,
    rotation: 0,
  });

  mapInstance.value = map;
  mapInitialized.value = true;

  infoWindow.value = new TMap.InfoWindow({
    map,
    position: new TMap.LatLng(0, 0),
    content: '',
    offset: {x: 0, y: -40},
    visible: false,
  });
  infoWindow.value.on('close', handleInfoWindowClose);

  createAllMarkers(map);
  startOrbitAnimation();
};

watch(
  () => props.geometriesArray,
  (newVal) => {
    if (mapInitialized.value && Array.isArray(newVal))
      createAllMarkers(mapInstance.value);
  },
  {deep: true},
);

onMounted(() => {
  initMap();
});

onUnmounted(() => {
  stopOrbitAnimation();
  if (carMarkerLayer.value) {
    try {
      carMarkerLayer.value.off('click', handleMarkerClick);
      carMarkerLayer.value.destroy();
    } catch (error) {
      console.warn('销毁车辆轨迹标注层失败:', error);
    }
  }
  if (infoWindow.value) {
    try {
      infoWindow.value.off('close', handleInfoWindowClose);
      infoWindow.value.destroy();
    } catch (error) {
      console.warn('销毁信息窗口失败:', error);
    }
  }
  if (mapInstance.value) {
    try {
      mapInstance.value.destroy();
    } catch (error) {
      console.warn('销毁地图实例失败:', error);
    }
  }
  orbitStatus.value = {
    playing: false,
    currentRotation: 0,
    animationFrameId: null,
    isInited: false,
  };
  mapInitialized.value = false;
});

defineExpose({
  toggleOrbitAnimation,
  orbitStatus,
  startOrbitAnimation,
  stopOrbitAnimation,
});
</script>

<template>
  <div class="map-container">
    <div :id="idName" class="map-satellite"></div>
    <div class="legend">
      <div class="legend-items">
        <div class="legend-item">
          <img
            :src="markerCarNormal"
            class="legend-icon"
            alt="正常通行"
          />正常通行
        </div>
        <div class="legend-item">
          <img
            :src="markerCarAbnormal"
            class="legend-icon"
            alt="异常通行"
          />异常通行
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

.map-satellite {
  width: 100%;
  height: 99%;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 8px;
}

.legend {
  position: absolute;
  bottom: 0.1vh;
  left: 0;
  box-sizing: border-box;
  display: flex;
  flex-flow: column wrap;
  align-items: flex-end;
  width: 100%;
  height: auto;
  padding: 0.5vw;
  background: rgb(0 0 0 / 50%);
}

.legend-items {
  display: flex;
  flex-direction: row;
  gap: 1vw;
  align-items: center;
  justify-content: center;
}

.legend-item {
  display: flex;
  gap: 0.1vw;
  align-items: center;
  font-size: 0.7vw;
  color: #fff;
}

.legend-icon {
  width: 1vw;
  height: 1.5vh;
  object-fit: contain;
}
</style>
