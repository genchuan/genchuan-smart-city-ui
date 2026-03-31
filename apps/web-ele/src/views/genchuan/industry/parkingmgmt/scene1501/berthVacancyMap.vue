<template>
  <div class="map-container">
    <div :id="idName" class="map-common-css"></div>

    <div class="legend">
      <div class="legend-items">
        <div class="legend-item">
          <img :src="markerGreen" class="legend-icon" alt="无预警" />
          <span>无预警</span>
        </div>
        <div class="legend-item">
          <img :src="markerBlue" class="legend-icon" alt="已处置" />
          <span>已处置</span>
        </div>
        <div class="legend-item">
          <img :src="markerRed" class="legend-icon" alt="预警中" />
          <span>预警中</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, defineProps, ref, onUnmounted, watch, defineExpose } from 'vue';
import markerGreen from '../images/normal.png';
import markerBlue from '../images/handled.png';
import markerRed from '../images/warning.png';
import markerGray from '../images/unknown.png';
import { useMapOrbitAnimation } from '#/api/genchuan/industry/parkingmgmt/useMapOrbitAnimation.js';

const props = defineProps({
  idName: {
    type: String,
    default: 'chinaEcharts',
  },
  geometriesArray: {
    type: Array,
    default: () => []
  },
  orbitConfig: {
    type: Object,
    default: () => ({
      center: {lat: 24.900000, lng: 118.690000},
      rotateSpeed: 0.2,
      pitch: 40,
      zoom: 10,
      loop: true
    })
  }
});

const mapInstance = ref(null);
const infoWindow = ref(null);
const markerLayer = ref(null);
const mapInitialized = ref(false);

const {
  orbitStatus,
  startOrbitAnimation,
  stopOrbitAnimation,
  toggleOrbitAnimation
} = useMapOrbitAnimation(mapInstance, props.orbitConfig);

// 停车场预警状态映射
const statusMap = {
  'no_warn': {color: 'green', icon: markerGreen, text: '无预警'},
  'warning': {color: 'red', icon: markerRed, text: '预警中'},
  'disposed': {color: 'blue', icon: markerBlue, text: '已处置'}
};

// 核查结果文字映射
const checkResultMap = {
  'normal': '正常',
  'fault': '故障',
  'adjust': '规划调整',
  '': '无'
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
  if (infoWindow.value) {
    infoWindow.value.close();
  }
};

const initMap = () => {
  const callbackName = `initMap_${props.idName}`;
  const script = document.createElement('script');
  script.src = `https://map.qq.com/api/gljs?v=1.exp&key=QTQBZ-F3RWW-JJJRV-YNPA5-ZIKDK-3SBNO&callback=${callbackName}`;
  script.async = true;

  window[callbackName] = () => {
    mapCallback();
    delete window[callbackName];
  };

  document.head.appendChild(script);
};

const createMarkers = (map) => {
  if (markerLayer.value) {
    try {
      markerLayer.value.off('click', handleMarkerClick);
      markerLayer.value.destroy();
    } catch (error) {
      console.warn('销毁标记层失败：', error);
    }
    markerLayer.value = null;
  }

  const geometriesData = [];
  if (Array.isArray(props.geometriesArray)) {
    props.geometriesArray.forEach((item, index) => {
      const coordX = item.coord_x || item.coordX;
      const coordY = item.coord_y || item.coordY;

      if (item && typeof coordX === 'number' && typeof coordY === 'number') {
        const warnStatus = item.warn_status || '';
        const statusInfo = statusMap[warnStatus] || {text: '未知', icon: markerGray, color: '#999'};
        const styleId = warnStatus ? `status-${warnStatus}` : 'default';

        geometriesData.push({
          id: `marker-${index}`,
          styleId,
          position: new TMap.LatLng(coordX, coordY),
          properties: {
            park_id: item.park_id,
            park_name: item.park_name,
            total_space: item.total_space,
            free_space: item.free_space,
            vacant_space: item.vacant_space,
            vacant_endure: item.vacant_endure,
            warn_status: warnStatus,
            check_result: item.check_result,
            region_name: item.region_name,
            coord_x: coordX,
            coord_y: coordY
          }
        });
      }
    });
  }

  if (geometriesData.length > 0) {
    markerLayer.value = new TMap.MultiMarker({
      map: map,
      styles: getMarkerStyles(),
      geometries: geometriesData
    });
    markerLayer.value.on('click', handleMarkerClick);
  }
};

const getTooltipContent = (properties) => {
  const labelStyle = 'width: 80px; text-align: right; font-weight: bold; margin-right: 6px; flex-shrink: 0;';
  const valueStyle = 'flex: 1; text-align: left; word-break: break-all;';
  const rowStyle = 'display: flex; align-items: center; margin: 6px 0;';

  const statusInfo = statusMap[properties.warn_status] || {text: '未知', color: '#999'};
  const checkResultText = checkResultMap[properties.check_result] || '未知';
  const vacantRate = properties.total_space
    ? ((properties.vacant_space / properties.total_space) * 100).toFixed(1) + '%'
    : '未知';

  return `
    <div style="padding: 10px 12px; font-size: 14px; color: #333; background: white; border: 1px solid #ccc; min-width: 280px; border-radius: 4px;">
      <div style="margin-bottom: 8px; font-weight: bold; color: #1E90FF; border-bottom: 1px solid #eee; padding-bottom: 4px; text-align: center;">停车场空置信息</div>
      <div style="${rowStyle}">
        <span style="${labelStyle}">停车场ID：</span>
        <span style="${valueStyle}">${properties.park_id || '未知'}</span>
      </div>
      <div style="${rowStyle}">
        <span style="${labelStyle}">停车场名称：</span>
        <span style="${valueStyle}">${properties.park_name || '未知'}</span>
      </div>
      <div style="${rowStyle}">
        <span style="${labelStyle}">总车位数：</span>
        <span style="${valueStyle}">${properties.total_space || '未知'}</span>
      </div>
      <div style="${rowStyle}">
        <span style="${labelStyle}">空闲车位数：</span>
        <span style="${valueStyle}">${properties.free_space || '未知'}</span>
      </div>
      <div style="${rowStyle}">
        <span style="${labelStyle}">空置车位数：</span>
        <span style="${valueStyle}">${properties.vacant_space || '未知'}</span>
      </div>
      <div style="${rowStyle}">
        <span style="${labelStyle}">空置率：</span>
        <span style="${valueStyle}">${vacantRate}</span>
      </div>
      <div style="${rowStyle}">
        <span style="${labelStyle}">空置时长：</span>
        <span style="${valueStyle}">${properties.vacant_endure || 0}分钟</span>
      </div>
      <div style="${rowStyle}">
        <span style="${labelStyle}">核查结果：</span>
        <span style="${valueStyle}">${checkResultText}</span>
      </div>
      <div style="${rowStyle}">
        <span style="${labelStyle}">所属区域：</span>
        <span style="${valueStyle}">${properties.region_name || '未知'}</span>
      </div>
      <div style="${rowStyle}">
        <span style="${labelStyle}">位置坐标：</span>
        <span style="${valueStyle}">(${properties.coord_x.toFixed(6)}, ${properties.coord_y.toFixed(6)})</span>
      </div>
      <div style="${rowStyle}">
        <span style="${labelStyle}">预警状态：</span>
        <span style="${valueStyle}; color: ${statusInfo.color}; font-weight: 500;">
          ${statusInfo.text}
        </span>
      </div>
    </div>
  `;
};

const getMarkerStyles = () => {
  return {
    'status-no_warn': new TMap.MarkerStyle({
      width: 34,
      height: 34,
      anchor: {x: 15, y: 30},
      src: markerGreen
    }),
    'status-warning': new TMap.MarkerStyle({
      width: 34,
      height: 34,
      anchor: {x: 15, y: 30},
      src: markerRed
    }),
    'status-disposed': new TMap.MarkerStyle({
      width: 34,
      height: 34,
      anchor: {x: 15, y: 30},
      src: markerBlue
    }),
    'default': new TMap.MarkerStyle({
      width: 34,
      height: 34,
      anchor: {x: 15, y: 30},
      src: markerGray
    })
  };
};

const mapCallback = () => {
  const mapContainer = document.getElementById(props.idName);
  if (!mapContainer) {
    console.error(`地图容器不存在：${props.idName}`);
    return;
  }

  const map = new TMap.Map(mapContainer, {
    center: new TMap.LatLng(24.900000, 118.690000),
    zoom: 10,
    mapStyleId: 'style1',
    enablePitch: true,
    enableRotate: true,
    pitch: 0,
    rotation: 0
  });
  mapInstance.value = map;
  mapInitialized.value = true;

  infoWindow.value = new TMap.InfoWindow({
    map: map,
    position: new TMap.LatLng(0, 0),
    content: '',
    offset: {x: 0, y: -50},
    visible: false
  });
  infoWindow.value.on('close', handleInfoWindowClose);

  if (props.geometriesArray.length > 0) {
    createMarkers(map);
  }

  startOrbitAnimation();
  console.log('地图初始化完成，3D旋转已开启：', map.enableRotate);
};

watch(
  () => props.geometriesArray,
  (newVal) => {
    if (mapInitialized.value && Array.isArray(newVal) && newVal.length > 0) {
      createMarkers(mapInstance.value);
    }
  },
  {deep: true}
);

onMounted(() => {
  initMap();
});

onUnmounted(() => {
  stopOrbitAnimation();

  if (markerLayer.value) {
    try {
      markerLayer.value.off('click', handleMarkerClick);
      markerLayer.value.destroy();
    } catch (error) {
      console.warn('卸载时销毁标记层失败：', error);
    }
  }

  if (infoWindow.value) {
    try {
      infoWindow.value.off('close', handleInfoWindowClose);
      infoWindow.value.destroy();
    } catch (error) {
      console.warn('卸载时销毁信息窗失败：', error);
    }
  }

  if (mapInstance.value) {
    mapInstance.value.destroy();
  }

  orbitStatus.value = {
    playing: true,
    currentRotation: 0,
    animationFrameId: null,
    isInited: false
  };
  mapInitialized.value = false;
});

defineExpose({
  toggleOrbitAnimation,
  orbitStatus
});
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.map-common-css {
  width: 100%;
  height: 98%;
  margin: 0 auto;
  border-radius: 8px;
  overflow: hidden;
}

.legend {
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  flex-direction: column;
  width: 100%;
  height: auto;
  bottom: 0.5vh;
  left: 0;
  display: flex;
  flex-wrap: wrap;
  padding: 0.5vw;
  align-items: flex-end;
}

.legend-items {
  display: flex;
  flex-direction: row;
  gap: 1vw;
  align-items: center;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 0.8vw;
  color: #fff;
}

.legend-icon {
  width: 1.2vw;
  height: 2vh;
  margin-right: 0.2vw;
}
</style>
